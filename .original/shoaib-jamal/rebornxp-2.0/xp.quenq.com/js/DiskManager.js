import { IDBStorage } from "./VFS/IDBStorage.js";

export class DiskManager extends EventTarget {
    storages = {};
    _isReady = false;
    _readyPromise;
    static RECYCLE_BIN_PATH = 'C:/RECYCLER';
    static USER_PROFILES_BASE_PATH = 'C:/Documents and Settings';
    static DEFAULT_USER_PROFILE_TEMPLATE_NAME_IN_JSON = 'Default User';

    constructor() {
        super();
        this.storages['C'] = new IDBStorage('C');
        this.storages['D'] = new IDBStorage('D');
        this.storages['E'] = new IDBStorage('E');
        this._readyPromise = this._initializeStorages();
        this._readyPromise.catch(err => {
            console.error("CRITICAL BOOT ERROR in DiskManager initialization promise:", err);
            alert("CRITICAL BOOT ERROR: DiskManager failed to initialize. Check console. Details: " + err.message);
        });
    }

    async _initializeStorages() {
        try {
            await this.storages['C']._getDB();
            await this.storages['D']._getDB();
            await this.storages['E']._getDB();
            this._isReady = true;

            const cStorage = this._getStorage('C');
            const persistentPathsData = [
                { path: DiskManager.USER_PROFILES_BASE_PATH, name: 'Documents and Settings', metadata: {} },
                {
                    path: DiskManager.RECYCLE_BIN_PATH,
                    name: 'RECYCLER',
                    metadata: {
                        icon: "recycler empty.png",
                        hidden: true
                    }
                }
            ];

            for (const pData of persistentPathsData) {
                const node = await cStorage.getNode(pData.path);
                if (!node) {
                    try {
                        await cStorage.putNode({
                            id: pData.path,
                            name: pData.name,
                            type: 'folder',
                            content: null,
                            createdAt: Date.now(),
                            modifiedAt: Date.now(),
                            metadata: pData.metadata
                        });
                    } catch (e) {
                        const checkAgain = await cStorage.getNode(pData.path);
                        if (!checkAgain || checkAgain.type !== 'folder') {
                            console.error(`DiskManager: FAILED to create persistent folder ${pData.path}:`, e);
                            throw new Error(`Failed to initialize persistent directory ${pData.path}: ${e.message}`);
                        }
                    }
                } else if (pData.path === DiskManager.RECYCLE_BIN_PATH && (!node.metadata || node.metadata.hidden !== true)) {
                    node.metadata = { ...(node.metadata || {}), hidden: true, icon: node.metadata?.icon || "recycler empty.png" };
                    await cStorage.putNode(node);
                }
            }
            this.dispatchEvent(new Event('disksReady'));
        } catch (error) {
            console.error("DiskManager: Critical error initializing storages:", error);
            alert("Fatal Error: Could not initialize virtual drives. Check console. Details: " + error.message);
            throw error;
        }
    }

    async ready() {
        if (this._isReady) return Promise.resolve();
        return this._readyPromise;
    }

    _getStorage(driveLetter) {
        const storage = this.storages[driveLetter.toUpperCase()];
        if (!storage) throw new Error(`Storage for drive ${driveLetter}: not found.`);
        return storage;
    }

    _normalizeAndSplitPath(fullPath) {
        if (typeof fullPath !== 'string') {
            throw new Error(`Invalid path input to _normalizeAndSplitPath: ${fullPath}`);
        }
        const match = fullPath.match(/^([A-Za-z]):\/?(.*)/);
        if (!match) throw new Error(`Invalid path format: "${fullPath}"`);
        const drive = match[1].toUpperCase();
        let path = ('/' + match[2].replace(/\\/g, '/')).replace(/\/+/g, '/').replace(/\/$/, '');
        if (path === '') path = '/';
        return { drive, path, fullPath: `${drive}:${path}` };
    }

    // NEW HELPER: Traverses the JSON and collects a flat list of all nodes to create.
    _collectNodes(jsonDataNode, parentPath, driveLetter) {
        const nodesToCreate = [];
        if (!jsonDataNode || !jsonDataNode.contents) return nodesToCreate;

        for (const [name, itemData] of Object.entries(jsonDataNode.contents)) {
            if (name === '.' || name === '..') continue;
            
            const childFullPathId = parentPath === `${driveLetter}:/` ? `${driveLetter}:/${name}` : this.join(parentPath, name);
            
            let initialMetadata = itemData.metadata && typeof itemData.metadata === 'object' ? { ...itemData.metadata } : {};
            let nodeSpecificIcon = initialMetadata.icon || itemData.icon || (itemData.contents && typeof itemData.contents === 'object' && itemData.contents.icon) || null;
            if (nodeSpecificIcon) initialMetadata.icon = nodeSpecificIcon;
            
            const node = {
                id: childFullPathId,
                name: name,
                type: itemData.type === 'directory' ? 'folder' : 'file',
                content: itemData.contents, // Keep original content path for now
                createdAt: Date.now(),
                modifiedAt: Date.now(),
                metadata: initialMetadata
            };
            nodesToCreate.push(node);

            if (node.type === 'folder' && itemData.contents) {
                nodesToCreate.push(...this._collectNodes(itemData, childFullPathId, driveLetter));
            }
        }
        return nodesToCreate;
    }

        async _processNodeList(storage, nodeList, progress) {
        const fileProcessingPromises = [];

        // First, create all folder and empty file structures in the database
        for (const node of nodeList) {
            const content = node.content;
            node.content = null; // Don't store the asset path in the DB
            await storage.putNode(node);
            node.content = content; // Put it back for the next step
        }

        // Now, create promises for all files that need fetching
        for (const node of nodeList) {
            if (node.type !== 'file') continue;

            let fileContentFromJSON = node.content;
            if (typeof fileContentFromJSON === 'string' && (fileContentFromJSON.startsWith('res/') || fileContentFromJSON.startsWith('./res/'))) {
                const assetPath = fileContentFromJSON.startsWith('./') ? fileContentFromJSON.substring(2) : fileContentFromJSON;
                
                const promise = (async () => {
                    try {
                        const response = await fetch(assetPath);
                        if (!response.ok) throw new Error(`Fetch failed for ${assetPath}: ${response.statusText} (${response.status})`);
                        
                        const extension = assetPath.split('.').pop().toLowerCase();
                        const textExtensions = ['html', 'htm', 'txt', 'json', 'js', 'css', 'xml', 'ini'];
                        let finalContent;

                        if (textExtensions.includes(extension)) {
                            finalContent = await response.text();
                        } else {
                            finalContent = await response.blob();
                        }
                        
                        const nodeToUpdate = await storage.getNode(node.id);
                        if (nodeToUpdate) {
                            nodeToUpdate.content = finalContent;
                            await storage.putNode(nodeToUpdate);
                        }

                    } catch (fetchError) {
                        console.error(`DiskManager: CRITICAL error fetching asset "${assetPath}" for "${node.id}". Error:`, fetchError);
                    } finally {
                        if (progress && progress.total > 0) {
                            progress.completed++;
                            // --- MODIFICATION HERE ---
                            // Use the event name from the progress object, or default to the C-drive event
                            const eventName = progress.eventName || 'vfs:progress';
                            this.dispatchEvent(new CustomEvent(eventName, { detail: { completed: progress.completed, total: progress.total } }));
                            // --- END MODIFICATION ---
                        }
                    }
                })();
                fileProcessingPromises.push(promise);
            } else {
                const nodeToUpdate = await storage.getNode(node.id);
                if (nodeToUpdate) {
                    if (typeof fileContentFromJSON === 'object' && fileContentFromJSON !== null && fileContentFromJSON.action) {
                        nodeToUpdate.content = JSON.stringify(fileContentFromJSON);
                    } else {
                        nodeToUpdate.content = String(fileContentFromJSON || "");
                    }
                    await storage.putNode(nodeToUpdate);
                }
            }
        }
        
        await Promise.all(fileProcessingPromises);
    }

        async _recursiveCreateFromJSON(storage, rootPath, driveData, driveLetter, progressEventName = 'vfs:progress') {
        const allNodes = this._collectNodes(driveData, rootPath, driveLetter);
        const fetchableFiles = allNodes.filter(n => n.type === 'file' && typeof n.content === 'string' && n.content.startsWith('res/'));
        const progress = {
            completed: 0,
            total: fetchableFiles.length,
            eventName: progressEventName
        };
        await this._processNodeList(storage, allNodes, progress);
    }

    async populateCoreSystemDrive(forceRepopulate = false) {
        await this.ready();
        const systemDriveVersionKey = 'cDriveSystemVersion';
        const currentClientVersion = window.APP_VERSION || "0.0.0";
        const lastPopulatedVersion = localStorage.getItem(systemDriveVersionKey);

        if (lastPopulatedVersion === currentClientVersion && !forceRepopulate) {
            this.dispatchEvent(new CustomEvent('drivePopulated', { detail: { drive: 'C', status: 'already_populated', type: 'system' } }));
            return;
        }

        this.dispatchEvent(new CustomEvent('drivePopulationStart', { detail: { drive: 'C', type: 'system' } }));
        let driveData;
        try {
            const response = await fetch('/res/data/drive_c_system.json');
            if (!response.ok) throw new Error(`Failed to fetch system base for C: ${response.statusText}`);
            driveData = await response.json();
        } catch (e) {
            this.dispatchEvent(new CustomEvent('drivePopulationError', { detail: { drive: 'C', error: e.message, type: 'system' } }));
            throw e;
        }

        const storage = this._getStorage('C');
        try {
            const rootPath = 'C:/';
            if (!(await storage.getNode(rootPath))) {
                await storage.putNode({ id: rootPath, name: '', type: 'folder', content: null, createdAt: Date.now(), modifiedAt: Date.now(), metadata: {} });
            }
            if (!(await storage.getNode(DiskManager.USER_PROFILES_BASE_PATH))) {
                await this.mkdir(DiskManager.USER_PROFILES_BASE_PATH);
            }

            const pathsToClearAndRepopulate = [
                "C:/WINDOWS", "C:/BOOT.INI",
                `${DiskManager.USER_PROFILES_BASE_PATH}/${DiskManager.DEFAULT_USER_PROFILE_TEMPLATE_NAME_IN_JSON}`,
                `${DiskManager.USER_PROFILES_BASE_PATH}/All Users`
            ];
            for (const path of pathsToClearAndRepopulate) {
                const nodeExists = await storage.getNode(path);
                if (nodeExists) {
                    if (nodeExists.type === 'folder') await storage.deleteFolderRecursive(path);
                    else await storage.deleteNode(path);
                }
            }

            // FIX: Call the centralized, correctly-awaited helper function.
            // This ensures all file operations complete before this function returns.
            await this._recursiveCreateFromJSON(storage, rootPath, driveData, 'C', 'vfs:progress');
            this.dispatchEvent(new CustomEvent('drivePopulated', { detail: { drive: 'C', status: 'success', type: 'system' } }));
        } catch (error) {
            this.dispatchEvent(new CustomEvent('drivePopulationError', { detail: { drive: 'C', error: error.message, type: 'system' } }));
            throw error;
        }
    }

    _countFetchableFiles(jsonDataNode) {

        let count = 0;

        if (!jsonDataNode || !jsonDataNode.contents) return 0;

        for (const itemData of Object.values(jsonDataNode.contents)) {

            if (itemData.type === 'file' && typeof itemData.contents === 'string' && itemData.contents.startsWith('res/')) {

                count++;

            } else if (itemData.type === 'directory' && itemData.contents) {

                count += this._countFetchableFiles(itemData);

            }

        }

        return count;

    }

         async populateEDriveFromJSON(forceRepopulate = false) {
        await this.ready();
        const driveLetter = 'E';
        const driveVersionKey = 'eDriveVersion';
        const currentClientVersion = window.APP_VERSION || "0.0.0";
        const lastPopulatedVersion = localStorage.getItem(driveVersionKey);

        if (lastPopulatedVersion === currentClientVersion && !forceRepopulate) {
            this.dispatchEvent(new CustomEvent('drivePopulated', { detail: { drive: driveLetter, status: 'already_populated' } }));
            return;
        }

        const storage = this._getStorage(driveLetter);
        const rootNodeE = await storage.getNode('E:/');
        if (rootNodeE) {
            const children = await storage.listChildren('E:/');
            for (const child of children) {
                if (child.type === 'folder') await storage.deleteFolderRecursive(child.id);
                else await storage.deleteNode(child.id);
            }
        }

        this.dispatchEvent(new CustomEvent('drivePopulationStart', { detail: { drive: driveLetter } }));
        let driveData;
        try {
            const response = await fetch('/res/data/drive_e_goodies.json');
            if (!response.ok) throw new Error(`Failed to fetch drive_e_goodies.json: ${response.statusText}`);
            driveData = await response.json();
        } catch (e) {
            this.dispatchEvent(new CustomEvent('drivePopulationError', { detail: { drive: driveLetter, error: e.message } }));
            throw e;
        }

        try {
            const rootPath = `${driveLetter.toUpperCase()}:/`;
            if (!(await storage.getNode(rootPath))) {
                await storage.putNode({ id: rootPath, name: '', type: 'folder', content: null, createdAt: Date.now(), modifiedAt: Date.now(), metadata: {} });
            }
            // FIX: Call the centralized, correctly-awaited helper function.
            await this._recursiveCreateFromJSON(storage, rootPath, driveData, driveLetter, 'vfs:progress-e');
            this.dispatchEvent(new CustomEvent('drivePopulated', { detail: { drive: driveLetter, status: 'success' } }));
        } catch (error) {
            this.dispatchEvent(new CustomEvent('drivePopulationError', { detail: { drive: driveLetter, error: error.message } }));
            throw error;
        }
    }

    async open(fullPath, createNewFileIfNotFound = false) {
        await this.ready();
        const { drive, path, fullPath: normalizedFullPath } = this._normalizeAndSplitPath(fullPath);
        const storage = this._getStorage(drive);
        let node = await storage.getNode(normalizedFullPath);
        if (!node && createNewFileIfNotFound && path !== '/') {
            const parentPath = this.dirname(normalizedFullPath);
            const parentNode = await storage.getNode(parentPath);
            if (parentNode && parentNode.type === 'folder') {
                node = {
                    id: normalizedFullPath, name: this.basename(normalizedFullPath), type: 'file', content: "",
                    createdAt: Date.now(), modifiedAt: Date.now(), metadata: {}
                };
                await storage.putNode(node);
            } else { return null; }
        }
        return node;
    }

    async readFile(fullPath) {
        const node = await this.open(fullPath);
        if (node && node.type === 'file') return node.content;
        if (node && node.type !== 'file') throw new Error(`"${fullPath}" is not a file.`);
        return null;
    }

    async writeFile(fullPath, content) {
        await this.ready();
        const { drive, path, fullPath: normalizedFullPath } = this._normalizeAndSplitPath(fullPath);
        const storage = this._getStorage(drive);
        let node = await storage.getNode(normalizedFullPath);
        if (node && node.type === 'folder') throw new Error(`Cannot write to "${fullPath}", it's a folder.`);
        if (!node) {
            const parentPath = this.dirname(normalizedFullPath);
            const parentNode = await storage.getNode(parentPath);
            if (!parentNode || parentNode.type !== 'folder') throw new Error(`Cannot create file, parent folder "${parentPath}" not found or is not a folder.`);
            node = {
                id: normalizedFullPath, name: this.basename(normalizedFullPath), type: 'file', content: content,
                createdAt: Date.now(), modifiedAt: Date.now(), metadata: {}
            };
        } else { node.content = content; node.modifiedAt = Date.now(); }
        await storage.putNode(node);
        this.dispatchEvent(new CustomEvent('fileChanged', { detail: { path: normalizedFullPath, type: 'write' } }));
    }

    async mkdir(fullPath) {
        await this.ready();
        const { drive, path, fullPath: normalizedFullPath } = this._normalizeAndSplitPath(fullPath);
        const storage = this._getStorage(drive);

        const existingNode = await storage.getNode(normalizedFullPath);
        if (existingNode) {
            const allowedToRecreateDuringSystemUpdate = [
                `${DiskManager.USER_PROFILES_BASE_PATH}/Default User`,
                `${DiskManager.USER_PROFILES_BASE_PATH}/All Users`
            ];
            const isPartOfTemplateOrAllUsers = allowedToRecreateDuringSystemUpdate.some(p => normalizedFullPath.startsWith(p));

            if (normalizedFullPath === DiskManager.RECYCLE_BIN_PATH || normalizedFullPath === DiskManager.USER_PROFILES_BASE_PATH) {
            } else if (isPartOfTemplateOrAllUsers && localStorage.getItem('cDriveSystemVersion') !== window.APP_VERSION) {
            } else {
                if (!isPartOfTemplateOrAllUsers) {
                     throw new Error(`Folder or file "${normalizedFullPath}" already exists.`);
                }
            }
        }

        if (path !== '/') {
            const parentPath = this.dirname(normalizedFullPath);
            const parentNode = await storage.getNode(parentPath);
            if (!parentNode || parentNode.type !== 'folder') {
                throw new Error(`Cannot create folder, parent "${parentPath}" not found or is not a folder.`);
            }
        }

        const newFolderNode = {
            id: normalizedFullPath, name: this.basename(normalizedFullPath), type: 'folder', content: null,
            createdAt: Date.now(), modifiedAt: Date.now(), metadata: {}
        };
        await storage.putNode(newFolderNode);
        this.dispatchEvent(new CustomEvent('fileChanged', { detail: { path: normalizedFullPath, type: 'mkdir' } }));
        return newFolderNode;
    }

    async list(fullPath) {
        await this.ready();
        const { drive, path, fullPath: normalizedFullPath } = this._normalizeAndSplitPath(fullPath);
        const storage = this._getStorage(drive);
        const node = await storage.getNode(normalizedFullPath);
        if (!node || node.type !== 'folder') return [];
        return storage.listChildren(normalizedFullPath);
    }

    async rename(oldFullPath, newName) {
        await this.ready();
        if (!newName || newName.match(/[\\\/:\*\?"<>\|]/g)) throw new Error(`Invalid new name: "${newName}"`);
        if (typeof oldFullPath !== 'string' || !oldFullPath.trim()) throw new Error(`Invalid old path for rename: "${oldFullPath}"`);
        const { drive, path: oldRelPath, fullPath: normalizedOldPath } = this._normalizeAndSplitPath(oldFullPath);
        const storage = this._getStorage(drive);
        const oldNode = await storage.getNode(normalizedOldPath);
        if (!oldNode) throw new Error(`"${normalizedOldPath}" not found for rename.`);
        if (oldRelPath === '/') throw new Error("Cannot rename root directory.");

        const protectedPaths = [
            DiskManager.USER_PROFILES_BASE_PATH.toUpperCase(),
            DiskManager.RECYCLE_BIN_PATH.toUpperCase(),
            `${DiskManager.USER_PROFILES_BASE_PATH}/Default User`.toUpperCase(),
            `${DiskManager.USER_PROFILES_BASE_PATH}/All Users`.toUpperCase()
        ];
        if (protectedPaths.includes(normalizedOldPath.toUpperCase())) {
            throw new Error(`Cannot rename the system folder "${normalizedOldPath}".`);
        }

        const parentPathId = this.dirname(normalizedOldPath);
        const newFullPathId = this.join(parentPathId, newName);
        if (await storage.getNode(newFullPathId)) throw new Error(`"${newFullPathId}" already exists.`);
        if (oldNode.type === 'folder') {
            const itemsToUpdate = [];
            const newPathsMap = new Map();
            const collectAndUpdatePaths = async (currentOldPath, currentNewPathBase) => {
                const children = await storage.listChildren(currentOldPath);
                for (const child of children) {
                    const childNewPath = this.join(currentNewPathBase, child.name);
                    newPathsMap.set(child.id, childNewPath);
                    itemsToUpdate.push({ oldNode: child, newId: childNewPath });
                    if (child.type === 'folder') {
                        await collectAndUpdatePaths(child.id, childNewPath);
                    }
                }
            };
            newPathsMap.set(normalizedOldPath, newFullPathId);
            await collectAndUpdatePaths(normalizedOldPath, newFullPathId);
            const transaction = await storage._getTransaction('readwrite');
            const nodesToPut = [];
            for (const item of itemsToUpdate) {
                const updatedChildNode = { ...item.oldNode, id: item.newId, name: this.basename(item.newId), modifiedAt: Date.now() };
                nodesToPut.push(updatedChildNode);
            }
            const renamedFolderNode = { ...oldNode, id: newFullPathId, name: newName, modifiedAt: Date.now() };
            nodesToPut.push(renamedFolderNode);
            for (const nodeToPut of nodesToPut) {
                 await new Promise((res, rej) => { const req = transaction.put(nodeToPut); req.onsuccess = res; req.onerror = rej; });
            }
            for (let i = itemsToUpdate.length - 1; i >= 0; i--) {
                 await new Promise((res, rej) => { const req = transaction.delete(itemsToUpdate[i].oldNode.id); req.onsuccess = res; req.onerror = rej; });
            }
            await new Promise((res, rej) => { const req = transaction.delete(normalizedOldPath); req.onsuccess = res; req.onerror = rej; });
        } else {
            const newNode = { ...oldNode, id: newFullPathId, name: newName, modifiedAt: Date.now() };
            await storage.putNode(newNode);
            await storage.deleteNode(normalizedOldPath);
        }
        this.dispatchEvent(new CustomEvent('fileChanged', { detail: { oldPath: normalizedOldPath, newPath: newFullPathId, type: 'rename' } }));
    }

    async moveToRecycleBin(fullPath) {
        await this.ready();
        const { drive, path, fullPath: normalizedFullPath } = this._normalizeAndSplitPath(fullPath);
        const storage = this._getStorage(drive);
        const node = await storage.getNode(normalizedFullPath);
        if (!node) throw new Error(`"${normalizedFullPath}" not found to move to Recycle Bin.`);
        if (path === '/') throw new Error("Cannot move root directory to Recycle Bin.");
        if (normalizedFullPath.startsWith(DiskManager.RECYCLE_BIN_PATH)) {
            throw new Error("Cannot move items already in the Recycle Bin to the Recycle Bin.");
        }
        const protectedPaths = [
            DiskManager.USER_PROFILES_BASE_PATH.toUpperCase(),
            `${DiskManager.USER_PROFILES_BASE_PATH}/Default User`.toUpperCase(),
            `${DiskManager.USER_PROFILES_BASE_PATH}/All Users`.toUpperCase()
        ];
        if (protectedPaths.includes(normalizedFullPath.toUpperCase())) {
            throw new Error(`Cannot move the system folder "${normalizedFullPath}" to Recycle Bin.`);
        }

        let targetNameInRecycler = node.name;
        let counter = 1;
        let finalDestPathInRecycler = this.join(DiskManager.RECYCLE_BIN_PATH, targetNameInRecycler);
        while (await storage.getNode(finalDestPathInRecycler)) {
            const extension = targetNameInRecycler.includes('.') ? targetNameInRecycler.substring(targetNameInRecycler.lastIndexOf('.')) : '';
            const base = targetNameInRecycler.includes('.') ? targetNameInRecycler.substring(0, targetNameInRecycler.lastIndexOf('.')) : targetNameInRecycler;
            targetNameInRecycler = `${base} (${counter})${extension}`;
            finalDestPathInRecycler = this.join(DiskManager.RECYCLE_BIN_PATH, targetNameInRecycler);
            counter++;
        }
        const originalId = node.id;
        const _recursiveMoveToRecycler = async (currentNode, newParentPathInRecycler) => {
            const newNameInRecycler = this.basename(newParentPathInRecycler);
            const recycledNodeData = {
                ...currentNode,
                id: newParentPathInRecycler,
                name: newNameInRecycler,
                metadata: {
                    ...currentNode.metadata,
                    originalPath: currentNode.id,
                    recycledAt: Date.now()
                },
                modifiedAt: Date.now()
            };
            if (currentNode.type === 'folder') {
                recycledNodeData.content = null;
                await storage.putNode(recycledNodeData);
                const children = await storage.listChildren(currentNode.id);
                for (const child of children) {
                    await _recursiveMoveToRecycler(child, this.join(recycledNodeData.id, child.name));
                }
            } else {
                await storage.putNode(recycledNodeData);
            }
            await storage.deleteNode(currentNode.id);
        };
        await _recursiveMoveToRecycler(node, finalDestPathInRecycler);
        this.dispatchEvent(new CustomEvent('fileChanged', { detail: { path: originalId, type: 'recycle', newPath: finalDestPathInRecycler } }));
        this.dispatchEvent(new CustomEvent('recycleBinChanged'));
    }

    async restoreFromRecycleBin(recycledItemPath) {
        await this.ready();
        const { drive, path, fullPath: normalizedRecycledPath } = this._normalizeAndSplitPath(recycledItemPath);
        const storage = this._getStorage(drive);
        const recycledNode = await storage.getNode(normalizedRecycledPath);
        if (!recycledNode) throw new Error(`Recycled item "${normalizedRecycledPath}" not found.`);
        if (!recycledNode.metadata || !recycledNode.metadata.originalPath) {
            throw new Error(`Recycled item "${normalizedRecycledPath}" is missing original path information.`);
        }
        const originalPath = recycledNode.metadata.originalPath;
        let targetRestorePath = originalPath;
        let counter = 1;
        while (await storage.getNode(targetRestorePath)) {
            if (targetRestorePath === recycledNode.id) break;
            const originalName = this.basename(originalPath);
            const extension = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '';
            const base = originalName.includes('.') ? originalName.substring(0, originalName.lastIndexOf('.')) : originalName;
            const newName = `${base} (Restored ${counter})${extension}`;
            targetRestorePath = this.join(this.dirname(originalPath), newName);
            counter++;
        }
        const _recursiveRestore = async (currentRecycledNode, currentTargetRestorePath) => {
            const { originalPath: nodeOriginalPath, recycledAt, ...originalMetadata } = currentRecycledNode.metadata;
            const restoredNodeData = {
                ...currentRecycledNode,
                id: currentTargetRestorePath,
                name: this.basename(currentTargetRestorePath),
                metadata: originalMetadata,
                modifiedAt: Date.now()
            };
            if (currentRecycledNode.type === 'folder') {
                restoredNodeData.content = null;
                await storage.putNode(restoredNodeData);
                const childrenInRecycler = await storage.listChildren(currentRecycledNode.id);
                for (const child of childrenInRecycler) {
                    const childOriginalName = child.metadata.originalPath ? this.basename(child.metadata.originalPath) : child.name;
                    await _recursiveRestore(child, this.join(restoredNodeData.id, childOriginalName));
                }
            } else {
                await storage.putNode(restoredNodeData);
            }
            await storage.deleteNode(currentRecycledNode.id);
        };
        await _recursiveRestore(recycledNode, targetRestorePath);
        this.dispatchEvent(new CustomEvent('fileChanged', { detail: { path: targetRestorePath, type: 'restore', oldPath: normalizedRecycledPath } }));
        this.dispatchEvent(new CustomEvent('recycleBinChanged'));
        return targetRestorePath;
    }

    async permanentDelete(fullPath) {
        await this.ready();
        const { drive, path, fullPath: normalizedFullPath } = this._normalizeAndSplitPath(fullPath);
        const storage = this._getStorage(drive);
        const node = await storage.getNode(normalizedFullPath);
        if (!node) return;
        if (path === '/') throw new Error("Cannot delete root directory.");

        const protectedPaths = [
            DiskManager.USER_PROFILES_BASE_PATH.toUpperCase(),
            `${DiskManager.USER_PROFILES_BASE_PATH}/Default User`.toUpperCase(),
            `${DiskManager.USER_PROFILES_BASE_PATH}/All Users`.toUpperCase()
        ];
         if (protectedPaths.includes(normalizedFullPath.toUpperCase()) && !normalizedFullPath.startsWith(DiskManager.RECYCLE_BIN_PATH + "/")) {
            throw new Error(`Cannot permanently delete the system folder "${normalizedFullPath}".`);
        }

        if (node.type === 'folder') {
            await storage.deleteFolderRecursive(normalizedFullPath);
        } else {
            await storage.deleteNode(normalizedFullPath);
        }
        this.dispatchEvent(new CustomEvent('fileChanged', { detail: { path: normalizedFullPath, type: 'delete_permanent' } }));
        if (normalizedFullPath.startsWith(DiskManager.RECYCLE_BIN_PATH)) {
            this.dispatchEvent(new CustomEvent('recycleBinChanged'));
        }
    }

    async getRecycleBinStatus() {
        await this.ready();
        try {
            const items = await this.list(DiskManager.RECYCLE_BIN_PATH);
            return { isEmpty: items.length === 0, count: items.length };
        } catch (e) {
            console.error("DiskManager: Error getting Recycle Bin status", e);
            return { isEmpty: true, count: 0, error: true };
        }
    }

    async delete(fullPath) {
        await this.ready();
        if (fullPath.startsWith(DiskManager.RECYCLE_BIN_PATH)) {
            return this.permanentDelete(fullPath);
        } else {
            return this.moveToRecycleBin(fullPath);
        }
    }

    async copy(sourceFullPath, destFolderFullPath) {
        await this.ready();
        const { drive: sourceDrive, fullPath: normSourcePath } = this._normalizeAndSplitPath(sourceFullPath);
        const { drive: destDrive, fullPath: normDestFolderPath } = this._normalizeAndSplitPath(destFolderFullPath);
        const sourceStorage = this._getStorage(sourceDrive);
        const destStorage = this._getStorage(destDrive);
        const sourceNode = await sourceStorage.getNode(normSourcePath);
        if (!sourceNode) throw new Error(`Source "${normSourcePath}" not found.`);
        const destFolderNode = await destStorage.getNode(normDestFolderPath);
        if (!destFolderNode || destFolderNode.type !== 'folder') throw new Error(`Destination "${normDestFolderPath}" is not a valid folder.`);
        let targetName = sourceNode.name; let counter = 1;
        let finalDestPathId = this.join(normDestFolderPath, targetName);
        while (await destStorage.getNode(finalDestPathId)) {
            const extension = targetName.includes('.') ? targetName.substring(targetName.lastIndexOf('.')) : '';
            const base = targetName.includes('.') ? targetName.substring(0, targetName.lastIndexOf('.')) : targetName;
            targetName = `${base} (${counter})${extension}`;
            finalDestPathId = this.join(normDestFolderPath, targetName); counter++;
        }
        const _recursiveCopy = async (currentSourceNode, currentDestFullPathId) => {
            const newNodeData = {
                ...currentSourceNode, id: currentDestFullPathId, name: this.basename(currentDestFullPathId),
                createdAt: Date.now(), modifiedAt: Date.now()
            };
            if (currentSourceNode.type === 'file') {
                await destStorage.putNode(newNodeData);
            } else if (currentSourceNode.type === 'folder') {
                newNodeData.content = null; await destStorage.putNode(newNodeData);
                const children = await sourceStorage.listChildren(currentSourceNode.id);
                for (const child of children) {
                    await _recursiveCopy(child, this.join(currentDestFullPathId, child.name));
                }
            }
        };
        await _recursiveCopy(sourceNode, finalDestPathId);
        this.dispatchEvent(new CustomEvent('fileChanged', { detail: { path: normDestFolderPath, type: 'create', name: this.basename(finalDestPathId) } }));
    }

    async move(sourceFullPath, destFolderFullPath) {
        await this.ready();
        const { drive: sourceDrive, fullPath: normSourcePath } = this._normalizeAndSplitPath(sourceFullPath);
        const { drive: destDrive, fullPath: normDestFolderPath } = this._normalizeAndSplitPath(destFolderFullPath);

        const protectedPaths = [
            DiskManager.USER_PROFILES_BASE_PATH.toUpperCase(),
            `${DiskManager.USER_PROFILES_BASE_PATH}/Default User`.toUpperCase(),
            `${DiskManager.USER_PROFILES_BASE_PATH}/All Users`.toUpperCase(),
            DiskManager.RECYCLE_BIN_PATH.toUpperCase()
        ];
        if (protectedPaths.includes(normSourcePath.toUpperCase())) {
            throw new Error(`Cannot move the system folder "${normSourcePath}".`);
        }

        if (sourceDrive === destDrive && this.dirname(normSourcePath) === normDestFolderPath) {
            let targetName = this.basename(normSourcePath); let counter = 1;
            let finalDestPath = this.join(normDestFolderPath, targetName);
            const storage = this._getStorage(sourceDrive);
            while (await storage.getNode(finalDestPath) && finalDestPath !== normSourcePath) {
                 const extension = targetName.includes('.')?targetName.substring(targetName.lastIndexOf('.')):'';
                 const base = targetName.includes('.')?targetName.substring(0,targetName.lastIndexOf('.')):targetName;
                 targetName = `${base} (${counter})${extension}`; finalDestPath = this.join(normDestFolderPath, targetName); counter++;
            }
            if (finalDestPath !== normSourcePath) return this.rename(normSourcePath, targetName);
            else return;
        }
        await this.copy(sourceFullPath, destFolderFullPath);
        await this.permanentDelete(sourceFullPath);
    }

    dirname(fullPath) {
        const { drive, path } = this._normalizeAndSplitPath(fullPath);
        if (path === '/') return `${drive}:/`;
        const lastSlash = path.lastIndexOf('/');
        return `${drive}:${lastSlash === 0 ? '/' : path.substring(0, lastSlash)}`;
    }

    basename(fullPath) {
        const { path } = this._normalizeAndSplitPath(fullPath);
        if (path === '/') return '';
        return path.substring(path.lastIndexOf('/') + 1);
    }

    join(baseFullPath, relativePath) {
        const { drive, path: basePathRel } = this._normalizeAndSplitPath(baseFullPath);
        const normRelativePath = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
        if (basePathRel === '/') return `${drive}:/${normRelativePath}`;
        return `${drive}:${basePathRel}/${normRelativePath}`.replace(/\/+/g, '/');
    }
}