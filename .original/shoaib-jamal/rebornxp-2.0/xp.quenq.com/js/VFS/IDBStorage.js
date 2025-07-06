const DB_NAME_PREFIX = 'rebornxp_fs_';
const STORE_NAME = 'nodes';
const DB_VERSION = 1;

export class IDBStorage {
    constructor(driveLetter) {
        this.driveLetter = driveLetter.toUpperCase();
        this.dbName = `${DB_NAME_PREFIX}${this.driveLetter}`;
        this.db = null;
        this._openingPromise = null;
    }

    async _getDB() {
        if (this.db) {
            return this.db;
        }
        if (this._openingPromise) {
            return this._openingPromise;
        }

        this._openingPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, DB_VERSION);

            request.onerror = (event) => {
                console.error(`IDBStorage [${this.driveLetter}]: Database open request error:`, event.target.error);
                this._openingPromise = null;
                reject(event.target.error);
            };

            request.onupgradeneeded = (event) => {
                const dbInstance = event.target.result;
                if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                    dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;

                this.db.onclose = () => {
                    console.warn(`IDBStorage [${this.driveLetter}]: Database connection closed.`);
                    this.db = null;
                    this._openingPromise = null;
                };

                this.db.onerror = (dbEvent) => {
                    console.error(`IDBStorage [${this.driveLetter}]: General database error on connection:`, dbEvent.target.error);
                };
                
                this.db.onversionchange = () => {
                    console.warn(`IDBStorage [${this.driveLetter}]: Database version change requested. Closing connection.`);
                    if (this.db) {
                        this.db.close();
                    }
                    this.db = null;
                    this._openingPromise = null;
                };

                const checkAndCreateRoot = async () => {
                    try {
                        const rootNode = await this.getNode(`${this.driveLetter}:/`);
                        if (!rootNode) {
                            await this.putNode({
                                id: `${this.driveLetter}:/`, name: '', type: 'folder', content: null,
                                createdAt: Date.now(), modifiedAt: Date.now(), metadata: {}
                            });
                        }
                        this._openingPromise = null;
                        resolve(this.db);
                    } catch (rootError) {
                        console.error(`IDBStorage [${this.driveLetter}]: Error during root folder check/creation:`, rootError);
                        this._openingPromise = null;
                        reject(rootError);
                    }
                };
                checkAndCreateRoot();
            };
        });
        return this._openingPromise;
    }

    async _getTransaction(mode = 'readonly') {
        const db = await this._getDB();
        if (!db) {
            throw new Error(`IDBStorage [${this.driveLetter}]: Database not available for transaction.`);
        }
        try {
            return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
        } catch (e) {
            console.error(`IDBStorage [${this.driveLetter}]: Error creating transaction (mode: ${mode}):`, e);
            throw e;
        }
    }

    async getNode(fullPathId) {
        try {
            const store = await this._getTransaction();
            return new Promise((resolve, reject) => {
                const request = store.get(fullPathId);
                request.onerror = (event) => reject(event.target.error);
                request.onsuccess = (event) => resolve(event.target.result || null); 
            });
        } catch (error) {
            console.error(`IDBStorage [${this.driveLetter}]: getNode error for ${fullPathId}`, error);
            throw error;
        }
    }

    async putNode(node) {
        if (!node.id) throw new Error("Node must have an 'id' (full path).");    
        node.modifiedAt = Date.now(); 
        if (!node.createdAt) node.createdAt = node.modifiedAt;

        try {
            const store = await this._getTransaction('readwrite');
            return new Promise((resolve, reject) => {
                const request = store.put(node);
                request.onerror = (event) => reject(event.target.error);
                request.onsuccess = (event) => resolve(event.target.result); 
            });
        } catch (error) {
            console.error(`IDBStorage [${this.driveLetter}]: putNode error for ${node.id}`, error);
            throw error;
        }
    }

    async deleteNode(fullPathId) {
        try {
            const store = await this._getTransaction('readwrite');
            return new Promise((resolve, reject) => {
                const request = store.delete(fullPathId);
                request.onerror = (event) => reject(event.target.error);
                request.onsuccess = () => resolve();
            });
        } catch (error) {
            console.error(`IDBStorage [${this.driveLetter}]: deleteNode error for ${fullPathId}`, error);
            throw error;
        }
    }

    async listChildren(folderPathId) {
        const prefix = folderPathId === `${this.driveLetter}:/` ? folderPathId : `${folderPathId}/`;
        try {
            const store = await this._getTransaction();
            const children = [];

            return new Promise((resolve, reject) => {
                const request = store.openCursor();
                request.onerror = (event) => reject(event.target.error);
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        if (cursor.key.startsWith(prefix) && cursor.key !== folderPathId) {
                            const relativePath = cursor.key.substring(prefix.length);
                            if (!relativePath.includes('/')) { 
                                children.push(cursor.value);
                            }
                        }
                        cursor.continue();
                    } else {
                        resolve(children);
                    }
                };
            });
        } catch (error) {
            console.error(`IDBStorage [${this.driveLetter}]: listChildren error for ${folderPathId}`, error);
            throw error;
        }
    }

    async deleteFolderRecursive(folderPathId) {
        const children = await this.listChildren(folderPathId);
        for (const child of children) {
            if (child.type === 'folder') {
                await this.deleteFolderRecursive(child.id);
            } else {
                await this.deleteNode(child.id);
            }
        }
        await this.deleteNode(folderPathId);
    }
}