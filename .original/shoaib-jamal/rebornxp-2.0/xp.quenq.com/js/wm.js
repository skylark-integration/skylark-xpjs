(function() {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const _wmVfsIconObjectUrls = new Map();


    var elementDrag = function(elmnt, currentPos3, currentPos4) {
        let viewport = window.wm._desktop.getBoundingClientRect();
        let viewportWidth = viewport.width;
        let viewportHeight = viewport.height;
        let p3 = currentPos3;
        let p4 = currentPos4;

        return function(e) {
            e = e || window.event;
            e.preventDefault();
            let clientX, clientY;
            if (e.type === "touchmove") {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            if (clientX - viewport.left < viewportWidth && clientX - viewport.left > 0) {
                let p1 = p3 - clientX;
                p3 = clientX;
                elmnt.style.left = (elmnt.offsetLeft - p1) + "px";
            }
            if (clientY - viewport.top < viewportHeight - 34 && clientY - viewport.top > 0) {
                let p2 = p4 - clientY;
                p4 = clientY;
                elmnt.style.top = (elmnt.offsetTop - p2) + "px";
            }
        }
    }

    var windowResize = function(e) {
        e.preventDefault();
        var currentResizer = e.target;
        if (currentResizer.classList.contains("maximized") || currentResizer.classList.contains("fullscreen")) return;

        let viewport = window.wm._desktop.getBoundingClientRect();
        const windowRoot = e.target.parentElement.parentElement;
        var elContent = windowRoot.querySelector("appcontents");
        let prevX = e.clientX;
        let prevY = e.clientY;

        function doResize(ev) {
            elContent.classList.add("resizing");
            const rect = windowRoot.getBoundingClientRect();
            const contentRect = elContent.getBoundingClientRect();
            switch (currentResizer.classList[1]) {
                case "n": elContent.style.height = contentRect.height + (prevY - ev.clientY) + "px"; windowRoot.style.top = rect.top - (prevY - ev.clientY + viewport.top) + "px"; break;
                case "s": elContent.style.height = contentRect.height - (prevY - ev.clientY) + "px"; break;
                case "w": elContent.style.width = contentRect.width + (prevX - ev.clientX) + "px"; windowRoot.style.left = rect.left - (prevX - ev.clientX + viewport.left) + "px"; break;
                case "e": elContent.style.width = contentRect.width - (prevX - ev.clientX) + "px"; break;
                case "nw": elContent.style.width = contentRect.width + (prevX - ev.clientX) + "px"; elContent.style.height = contentRect.height + (prevY - ev.clientY) + "px"; windowRoot.style.top = rect.top - (prevY - ev.clientY + viewport.top) + "px"; windowRoot.style.left = rect.left - (prevX - ev.clientX + viewport.left) + "px"; break;  
                case "ne": elContent.style.width = contentRect.width - (prevX - ev.clientX) + "px"; elContent.style.height = contentRect.height + (prevY - ev.clientY) + "px"; windowRoot.style.top = rect.top - (prevY - ev.clientY + viewport.top) + "px"; break;
                case "sw": elContent.style.width = contentRect.width + (prevX - ev.clientX) + "px"; elContent.style.height = contentRect.height - (prevY - ev.clientY) + "px"; windowRoot.style.left = rect.left - (prevX - ev.clientX + viewport.left) + "px"; break;
                case "se": elContent.style.width = contentRect.width - (prevX - ev.clientX) + "px"; elContent.style.height = contentRect.height - (prevY - ev.clientY) + "px"; break;
            }
            const appHeaderSpan = windowRoot.querySelector("appheader span");
            if(appHeaderSpan) appHeaderSpan.style.maxWidth = `${elContent.offsetWidth - 100}px`;
            prevX = ev.clientX; prevY = ev.clientY;
        }
        function endResize() {
            elContent.classList.remove("resizing");
            window.removeEventListener("pointermove", doResize);
            window.removeEventListener("pointerup", endResize);
            windowRoot.dispatchEvent(new Event('wm:windowResized'));
        }
        window.addEventListener("pointermove", doResize);
        window.addEventListener("pointerup", endResize);
    }

    var onMouseDown = function(shouldMakeDraggable) {
        return function(e) {
            var elmnt = wm._windows[this.dataset.windowId];
            if (!elmnt || elmnt.classList.contains("maximized") || elmnt.classList.contains("fullscreen")) return;
            wm.focusWindow(elmnt.id);
            if (shouldMakeDraggable) {
                e = e || window.event; e.preventDefault();
                let currentPos3 = e.clientX; let currentPos4 = e.clientY; 
                document.onpointerup = closeDragElement;
                document.onpointermove = elementDrag(elmnt, currentPos3, currentPos4); 
            }
        }
    }
    var closeDragElement = function() { document.onpointerup = null; document.onpointermove = null; }

    var setupApp = function(elmnt) {
        elmnt.dataset.windowId = elmnt.id; wm._windows[elmnt.id] = elmnt; wm.pushWindow(elmnt.id);
        var headerElement = elmnt.querySelector('appheader');
        if (headerElement) {
            headerElement.onpointerdown = onMouseDown(true); headerElement.dataset.windowId = elmnt.id;
            elmnt.onpointerdown = onMouseDown(false);
        } else { elmnt.onpointerdown = onMouseDown(true); }
        elmnt.querySelectorAll("grabber").forEach(grab => grab.addEventListener("pointerdown", windowResize));
    }

    var setupStartButtonAndGlobalClicks = function() {
        let prevSelect, newSelect, prevMenu, newMenu, contextTarget, contextSpawn;
        document.addEventListener("keydown", function(ev) {
            if (ev.metaKey && ev.key.toLowerCase() === 'e') { ev.preventDefault(); if(window.explorer) window.explorer.open(""); }
            else if (ev.metaKey && ev.key.toLowerCase() === 'r') { ev.preventDefault(); if(window.apps) apps.load("run").then(app => app.start()); }
            else if (ev.metaKey) { ev.preventDefault(); wm.toggleStartMenu(); }
        });
        document.addEventListener('click', function(event) {
            if (!wm._startMenu || !wm._startButton) return;
            if (wm._startMenu.contains(event.target)) {
                const listEntry = event.target.closest("li:not(.submenuHolder)");
                if (listEntry) {
                    if (listEntry.hasAttribute("action")) eval(listEntry.getAttribute("action"));
                    if (listEntry.classList.contains("new")) listEntry.classList.remove("new");
                    const appName = listEntry.id; const appData = listEntry.getAttribute("data");
                    if (appName && window.apps) apps.load(appName).then(app => {if(app) app.start(appData)});
                    wm.closeStartMenu();
                }
            } else if (wm._startMenu !== event.target && !wm._startMenu.contains(event.target) && !wm._startButton.contains(event.target)) {
                wm.closeStartMenu();
            }
            const fsIcon = event.target.closest("fsicon");
            const entryItem = event.target.closest("entry");
            if (fsIcon || entryItem) {
                if (newSelect) newSelect.classList.remove("selected");
                newSelect = fsIcon || entryItem; newSelect.classList.add("selected");
                if(fsIcon && newSelect.querySelector('img')) document.documentElement.style.setProperty('--icon-mask', `url('${newSelect.querySelector('img').src}')`);    
            } else if (newSelect && event.target.contains(newSelect)) {
                newSelect.classList.remove("selected"); newSelect = null;
            }
            const appMenuItem = event.target.closest("ul.appmenus > li");
            if (appMenuItem) {
                const currentSubmenu = appMenuItem.querySelector("ul.submenu");
                if (prevMenu && prevMenu !== currentSubmenu) prevMenu.classList.remove("visible");
                if (currentSubmenu) {
                    currentSubmenu.classList.toggle("visible");
                    currentSubmenu.style.left = `${appMenuItem.offsetLeft}px`;
                    prevMenu = currentSubmenu.classList.contains("visible") ? currentSubmenu : null;
                } else { if(prevMenu) prevMenu.classList.remove("visible"); prevMenu = null; }
            } else if (prevMenu && !event.target.closest('ul.submenu')) {
                prevMenu.classList.remove("visible"); prevMenu = null;
            }
            if (contextSpawn && !contextSpawn.contains(event.target) && !event.target.closest('contextmenu.visible')) { contextSpawn.remove(); contextSpawn = null; }      
        }, false);


        document.addEventListener('contextmenu', function(event) {
    let existingMenu = document.querySelector('contextmenu.visible');
    if (existingMenu) {
        existingMenu.remove();
    }

    let contextSpawn = null;
    let targetContextMenuElement = null;
    let windowId = null;

    const potentialHeader = event.target.closest('appheader');
    const potentialTaskButton = event.target.closest('task[data-window-id]');
    const potentialTaskArea = event.target.closest('taskarea');
    const isDesktopClick = event.target.matches('scene_desktop') || event.target.matches('scene_iconspace');

    if (potentialHeader) {
        const appWindow = potentialHeader.closest('app');
        if (appWindow) {
            windowId = appWindow.id;
            targetContextMenuElement = appWindow.querySelector('appheader > contextmenu');
        }
    } else if (potentialTaskButton) {
        windowId = potentialTaskButton.dataset.windowId;
        const appWindow = wm._windows[windowId];
        if (appWindow) {
            targetContextMenuElement = appWindow.querySelector('appheader > contextmenu');
        }
    } else if (potentialTaskArea) {
        targetContextMenuElement = potentialTaskArea.querySelector('contextmenu');
    } else if (isDesktopClick) {
        return;
    } else {
        targetContextMenuElement =
            (wm._desktop && event.target.closest('trayarea') ? wm._desktop.querySelector('trayarea > contextmenu') : null) ||
            (wm._startButton && event.target.closest('startbtn') ? wm._startButton.querySelector('contextmenu') : null);
    }

    if (targetContextMenuElement) {
        event.preventDefault();
        event.stopPropagation();

        contextSpawn = targetContextMenuElement.cloneNode(true);
        contextSpawn.classList.add("visible");

        if (windowId) {
            contextSpawn.querySelectorAll('li[onclick]').forEach(li => {
                const originalOnclick = li.getAttribute('onclick');
                if (originalOnclick) {
                    const newOnclick = originalOnclick.replace(
                        /window\.wm\.(.*?)\(wm\._contextParent\.closest\('app'\)\.id(.*?)\)/g,
                        `this.closest('contextmenu').remove(); window.wm.$1('${windowId}'$2)`
                    );
                    li.setAttribute('onclick', newOnclick);
                }
            });
        } else {
            contextSpawn.querySelectorAll('li[onclick]').forEach(li => {
                const originalOnclick = li.getAttribute('onclick');
                if (originalOnclick) {
                    li.setAttribute('onclick', `this.closest('contextmenu').remove(); ${originalOnclick}`);
                }
            });
        }

        if (window.explorer && typeof window.explorer._positionContextMenu === 'function') {
            window.explorer._positionContextMenu(event, contextSpawn, wm._desktop);
        } else {
            contextSpawn.style.left = `${event.clientX}px`;
            contextSpawn.style.top = `${event.clientY}px`;
            document.body.appendChild(contextSpawn);
        }

        const closeMenuHandler = (clickEvent) => {
            let currentMenu = document.querySelector('contextmenu.visible');
            if (currentMenu && !currentMenu.contains(clickEvent.target)) {
                currentMenu.remove();
                document.removeEventListener('click', closeMenuHandler, true);
                document.removeEventListener('contextmenu', closeMenuHandler, true);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeMenuHandler, true);
            document.removeEventListener('contextmenu', closeMenuHandler, true);
            document.addEventListener('contextmenu', closeMenuHandler, true);
        }, 0);
    }
}, false);

    }

    var setupTaskButton = function(taskButton) {
        if (!taskButton.dataset.windowId) return;
        wm._taskButtons[taskButton.dataset.windowId] = taskButton;
        taskButton.onclick = function(e) {
            if (taskButton.classList.contains("active")) {
                wm.minimizeWindow(this.dataset.windowId);
                const activeWindows = wm._windowStack.filter(id => wm._windows[id] && !wm._windows[id].classList.contains("minimized"));
                if (activeWindows.length > 0) wm.focusWindow(activeWindows[activeWindows.length - 1]);
            } else { wm.focusWindow(this.dataset.windowId); }
        }
    }
    var setupTaskbarButtons = function() {
        if (!wm._taskholder) return;
        wm._taskholder.querySelectorAll("task").forEach(setupTaskButton);
    }

    const getFileDialogHTMLTemplate = () => {
        const currentUser = window.shell?._currentUser || "Administrator"; 
        const desktopPath = `C:/Documents and Settings/${currentUser}/Desktop`;
        const myDocsPath = `C:/Documents and Settings/${currentUser}/My Documents`;
        return `
        <div style="display: flex; flex-direction: column; height: 100%; font-family: Tahoma, Arial, sans-serif; font-size: 11px; background-color: var(--dialog-bg, #ECE9D8); color: var(--text-color, black);">
            <div style="padding: 8px 12px; display: flex; align-items: center; border-bottom: 1px solid var(--border-light, #FFF); background-color: var(--dialog-header-bg, #F5F4F0);">
                <span style="margin-right: 5px;">Look in:</span>
                <div class="file-dialog-path-combobox" style="flex-grow: 1; display: flex; align-items: center; border: 1px solid var(--input-border-color, #7F9DB9); background-color: white; padding: 1px 2px; height: 21px;">
                    <img class="file-dialog-path-icon" src="res/icons/tray/mycomputer.png" style="width: 16px; height: 16px; margin-right: 4px;">
                    <span class="file-dialog-path-text" style="flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">My Computer</span>
                </div>
                <button class="file-dialog-up" title="Up One Level" style="margin-left: 6px; width: 23px; height: 21px; border: 1px solid var(--button-border, #003C74); background-color: var(--button-bg, #ECE9D8); padding: 0;"><img src="res/ui/nav/up.png" style="width:16px; height:16px;"></button>
            </div>
            <div style="display: flex; flex-grow: 1; overflow: hidden; border-top: 1px solid var(--border-dark, #808080);">
                <div class="file-dialog-places-bar" style="width: 120px; background-color: var(--places-bar-bg, #EBF3FD); border-right: 1px solid var(--border-dark, #808080); padding-top: 10px; overflow-y: auto;">
                    <div class="place-item" data-path-target="${desktopPath}" style="padding: 5px 8px; display:flex; align-items:center; cursor:default;"><img src="res/icons/tray/desktop.png" style="width:32px; height:32px; margin-right:8px;"><span>Desktop</span></div>
                    <div class="place-item" data-path-target="${myDocsPath}" style="padding: 5px 8px; display:flex; align-items:center; cursor:default;"><img src="res/icons/tray/mydocuments.png" style="width:32px; height:32px; margin-right:8px;"><span>My Documents</span></div>
                    <div class="place-item" data-path-target="" style="padding: 5px 8px; display:flex; align-items:center; cursor:default;"><img src="res/icons/tray/mycomputer.png" style="width:32px; height:32px; margin-right:8px;"><span>My Computer</span></div>
                </div>
                <div class="file-dialog-item-view" style="flex-grow: 1; background-color: white; overflow-y: auto; padding: 5px; border: 1px inset var(--input-inset-border, #808080);">
                </div>
            </div>
            <div style="padding: 8px 12px; border-top: 1px solid var(--border-light, #FFF); background-color: var(--dialog-header-bg, #F5F4F0);">
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <span style="width: 70px; text-align: right; margin-right: 5px;">File name:</span>
                    <input type="text" class="file-dialog-filename-input" style="flex-grow: 1; height: 21px; border: 1px solid var(--input-border-color, #7F9DB9); padding: 1px 2px;">
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="width: 70px; text-align: right; margin-right: 5px;">Files of type:</span>
                    <select class="file-dialog-type-filter" style="flex-grow: 1; height: 21px; width: 100px; border: 1px solid var(--input-border-color, #7F9DB9); background-color: white;">
                        <option value="*.*">All Files (*.*)</option>
                    </select>
                </div>
            </div>
            <div style="padding: 8px 12px; text-align: right; border-top: 1px solid var(--border-dark, #808080); background-color: var(--dialog-header-bg, #F5F4F0);">     
                <winbutton class="file-dialog-action-btn default" style="min-width: 75px; height: 23px; margin-left: 6px;"><btnopt>Open</btnopt></winbutton>
                <winbutton class="file-dialog-cancel-btn" style="min-width: 75px; height: 23px; margin-left: 6px;"><btnopt>Cancel</btnopt></winbutton>
            </div>
        </div>
    `;
    };


    window.wm = {
        _windows: {}, _windowStack: [], _windowspace: null, _windowTemplate: null,
        _windowOffsetX: 25, _windowOffsetY: 25, _windowOffsetIndex: 25,
        _startButton: null, _startMenu: null, _contextParent: null,
        _taskButtons: {}, _taskholder: null, _usedPIDs: ["0"],
        _logon: null, _overlay: null, _desktopHolder: null, _desktop: null, _fakePointer: null,

        setup: function() {
            this._windowTemplate = shell.windowTemplate;
            this._logon = document.querySelector("scene_logon");
            this._overlay = document.querySelector("scene_overlay");
            this._desktopHolder = document.querySelector("scene_holder");
            this._desktop = document.querySelector("scene_desktop[data-env='system']");
            if (this._desktop) { 
                this._windowspace = this._desktop.querySelector("scene_windowspace");
                this._taskholder = this._desktop.querySelector("taskarea");
                this._startButton = this._desktop.querySelector("startbtn");
                this._startMenu = this._desktop.querySelector("startmenu");
            }
            this._fakePointer = document.querySelector("fakepointer");
            document.querySelectorAll("app").forEach(setupApp);
            setupStartButtonAndGlobalClicks();
            setupTaskbarButtons();
            window.addEventListener("resize", () => this.recoverWindowPositions());
        },

        createNewWindow: function(name, contents, options = {}) {
            let windowElement = document.createElement("app");
            windowElement.innerHTML = this._windowTemplate;
            let pid = String(Math.floor(Math.random() * 90000) + 10000);
            while (this._usedPIDs.includes(pid)) pid = String(Math.floor(Math.random() * 90000) + 10000);
            this._usedPIDs.push(pid);
            windowElement.id = `${name}-${pid}`;
            windowElement.classList.add(name);
            if (options.parent) windowElement.setAttribute('parent', options.parent);
            const appContentsContainer = windowElement.querySelector("appcontents");
            if (contents instanceof HTMLElement) appContentsContainer.appendChild(contents);
            else appContentsContainer.innerHTML = contents;
            const targetWindowSpace = this._windowspace || this._desktop?.querySelector("scene_windowspace");
            if(targetWindowSpace) targetWindowSpace.appendChild(windowElement); else console.error("WM: No windowspace found to append new window!");
            setupApp(windowElement);
            if (!options.noTaskbarButton) {
                var task = document.createElement("task");
                task.dataset.windowId = windowElement.id;
                const appHeaderForTask = windowElement.querySelector("appheader");
                if(appHeaderForTask) task.innerHTML = appHeaderForTask.innerHTML; // Icon source set here
                const targetTaskHolder = this._taskholder || this._desktop?.querySelector("taskarea");
                if(targetTaskHolder) targetTaskHolder.appendChild(task);
                setupTaskButton(task);
            }
            if (contents.querySelector && contents.querySelector("tab_ui")) this.setupTabs(windowElement.id);
            contents.querySelectorAll && contents.querySelectorAll("wincheckbox").forEach(cb => {
                let htmlcb = cb.parentElement.querySelector("input");
                cb.parentElement.addEventListener("click", e => { if(htmlcb && !htmlcb.disabled) htmlcb.checked = !htmlcb.checked; });
            });
            this.focusWindow(windowElement.id);
            if (!windowElement.getAttribute("sized") && !options.skipIteratedPosition) this.setIteratedPosition(windowElement.id);
            return windowElement.id;
        },

        _currentFileDialogState: {
            promiseResolve: null, promiseReject: null, currentPath: '', dialogHWnd: null, mode: 'open',
            selectedFileNode: null, itemClickHandler: null, itemDblClickHandler: null, currentFilterExtensions: ['*']
        },

        async _renderFileDialogItems(dialogElement, folderPath) {
            const itemView = dialogElement.querySelector('.file-dialog-item-view');
            const pathTextElement = dialogElement.querySelector('.file-dialog-path-text');
            const pathIconElement = dialogElement.querySelector('.file-dialog-path-icon');
            itemView.innerHTML = '';
            this._currentFileDialogState.selectedFileNode = null;
            dialogElement.querySelector('.file-dialog-filename-input').value = '';

            if (folderPath === '' || folderPath.toLowerCase() === 'my computer') {
                pathTextElement.textContent = 'My Computer';
                pathIconElement.src = 'res/icons/tray/mycomputer.png';
                ['C', 'D'].forEach(driveLetter => {
                    const driveNode = { id: `${driveLetter}:/`, name: `Local Disk (${driveLetter}:)`, type: 'folder', metadata: { icon: 'drive.png' } };
                    this._addNodeToFileDialogView(dialogElement, driveNode, itemView);
                });
                return;
            }
            pathTextElement.textContent = folderPath;
            pathIconElement.src = 'res/icons/tray/folder.png';

            try {
                const items = await dm.list(folderPath);
                const currentFilterExts = this._currentFileDialogState.currentFilterExtensions;
                const filteredItems = items.filter(node => {
                    if (node.type === 'folder') return true;
                    if (currentFilterExts.includes('*') || currentFilterExts.includes('*.*')) return true;
                    const ext = node.name.includes('.') ? node.name.split('.').pop().toLowerCase() : '';
                    return currentFilterExts.includes(ext);
                });
                const sortedItems = filteredItems.sort((a,b) => (a.type==='folder'&&b.type!=='folder')?-1:(a.type!=='folder'&&b.type==='folder')?1:a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                sortedItems.forEach(node => this._addNodeToFileDialogView(dialogElement, node, itemView));
            } catch (error) { itemView.textContent = `Error loading: ${error.message}`; }
        },
        _addNodeToFileDialogView(dialogElement, node, itemView) {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = `padding: 3px 5px; display: flex; align-items: center; cursor: default; margin-bottom: 1px; user-select:none;`;
            itemDiv.dataset.nodeId = node.id; itemDiv.dataset.nodeType = node.type; itemDiv.dataset.nodeName = node.name;
            const iconName = node.metadata?.icon || (node.type === 'folder' ? 'folder.png' : (window.explorer.icons[node.name.split('.').pop().toLowerCase()] || 'default.png'));
            itemDiv.innerHTML = `<img src="res/icons/tray/${iconName}" style="width:16px; height:16px; margin-right:5px; pointer-events:none;"><span>${node.name}</span>`; 

            itemDiv.removeEventListener('click', this._currentFileDialogState.itemClickHandler); 
            this._currentFileDialogState.itemClickHandler = () => {
                itemView.querySelectorAll('.selected-file-dialog-item').forEach(el => {el.classList.remove('selected-file-dialog-item'); el.style.backgroundColor=''; el.style.color='';});
                itemDiv.classList.add('selected-file-dialog-item'); itemDiv.style.backgroundColor = 'var(--selected-bg, #316AC5)'; itemDiv.style.color = 'var(--selected-text, white)';
                this._currentFileDialogState.selectedFileNode = node;
                if (node.type === 'file') dialogElement.querySelector('.file-dialog-filename-input').value = node.name;
                else dialogElement.querySelector('.file-dialog-filename-input').value = '';
            };
            itemDiv.addEventListener('click', this._currentFileDialogState.itemClickHandler);

            itemDiv.removeEventListener('dblclick', this._currentFileDialogState.itemDblClickHandler);
            this._currentFileDialogState.itemDblClickHandler = () => {
                if (node.type === 'folder') {
                    this._currentFileDialogState.currentPath = node.id;
                    this._renderFileDialogItems(dialogElement, node.id);
                } else if (this._currentFileDialogState.mode === 'open') {
                    this._currentFileDialogState.selectedFileNode = node;
                    dialogElement.querySelector('.file-dialog-action-btn').click();
                }
            };
            itemDiv.addEventListener('dblclick', this._currentFileDialogState.itemDblClickHandler);
            itemView.appendChild(itemDiv);
        },

        _setupFileDialogEventListeners(dialogElement, dialogHWnd, options) {
            const state = this._currentFileDialogState;
            dialogElement.querySelector('.file-dialog-cancel-btn').onclick = () => { state.promiseResolve(null); wm.closeWindow(dialogHWnd); };
            dialogElement.querySelector('.file-dialog-up').onclick = () => {
                if (state.currentPath && state.currentPath !== 'C:/' && state.currentPath !== 'D:/' && state.currentPath !== 'E:/' && state.currentPath !== '' && state.currentPath.toLowerCase() !== 'my computer') {
                    state.currentPath = dm.dirname(state.currentPath);
                    this._renderFileDialogItems(dialogElement, state.currentPath);
                } else if (state.currentPath !== '' && state.currentPath.toLowerCase() !== 'my computer') {
                    state.currentPath = ''; this._renderFileDialogItems(dialogElement, '');
                }
            };
            dialogElement.querySelectorAll('.place-item').forEach(place => {
                place.onclick = () => {
                    const targetPath = place.dataset.pathTarget;
                    const currentUser = window.shell?._currentUser || "Administrator";
                    const resolvedTargetPath = targetPath.replace('${shell._currentUser}', currentUser);
                    state.currentPath = resolvedTargetPath;
                    this._renderFileDialogItems(dialogElement, state.currentPath);
                };
            });
            const filenameInput = dialogElement.querySelector('.file-dialog-filename-input');
            const actionButton = dialogElement.querySelector('.file-dialog-action-btn');
            const typeFilter = dialogElement.querySelector('.file-dialog-type-filter');

            actionButton.onclick = async () => {
                if (state.mode === 'open') {
                    if (state.selectedFileNode && state.selectedFileNode.type === 'file') {
                        state.promiseResolve(state.selectedFileNode.id); wm.closeWindow(dialogHWnd);
                    } else if (state.selectedFileNode && state.selectedFileNode.type === 'folder') {
                        state.currentPath = state.selectedFileNode.id; this._renderFileDialogItems(dialogElement, state.currentPath);
                    } else if (filenameInput.value.trim()) {
                        const currentDrive = dm._normalizeAndSplitPath(state.currentPath || options.initialPath || 'C:/').drive;
                        const typedPath = dm.join(state.currentPath || `${currentDrive}:/`, filenameInput.value.trim());
                        const node = await dm.open(typedPath);
                        if (node && node.type === 'file') { state.promiseResolve(node.id); wm.closeWindow(dialogHWnd); }
                        else if (node && node.type === 'folder') { state.currentPath = node.id; this._renderFileDialogItems(dialogElement, state.currentPath); }
                        else { alert(`File not found: ${filenameInput.value.trim()}`); }
                    } else { alert("Please select a file."); }
                } else if (state.mode === 'save') {
                    let nameToSave = filenameInput.value.trim();
                    if (!nameToSave) { alert("Please enter a file name."); return; }
                    if (nameToSave.match(/[\\\/:\*\?"<>\|]/g)) { alert("File name contains invalid characters."); return; }

                    const selectedFilterValue = typeFilter.value; 
                    const primaryExtension = selectedFilterValue.split(',')[0].trim(); 

                    if (primaryExtension !== '*' && primaryExtension !== '*.*' && !nameToSave.toLowerCase().endsWith(`.${primaryExtension}`)) {
                        const currentExtMatch = nameToSave.match(/\.([a-zA-Z0-9]+)$/);
                        if (currentExtMatch) { 
                            if (!options.filters.some(f => f.extensions.includes(currentExtMatch[1].toLowerCase()))) {
                                nameToSave += `.${primaryExtension}`;
                            }
                        } else { 
                             nameToSave += `.${primaryExtension}`;
                        }
                    }

                    const currentDrive = dm._normalizeAndSplitPath(state.currentPath || options.initialPath || 'C:/').drive;
                    const finalPath = dm.join(state.currentPath || `${currentDrive}:/`, nameToSave);
                    const existingNode = await dm.open(finalPath);
                    if (existingNode) {
                        dialogHandler.spawnDialog({
                            title: "Confirm Save As", text: `"${nameToSave}" already exists.\nDo you want to replace it?`, icon: "question",
                            buttons: [
                                ["Yes", (e) => { wm.closeWindow(e.target.closest("app").id); state.promiseResolve(finalPath); wm.closeWindow(dialogHWnd); }],
                                ["No", (e) => wm.closeWindow(e.target.closest("app").id)]
                            ]
                        });
                    } else { state.promiseResolve(finalPath); wm.closeWindow(dialogHWnd); }
                }
            };
            filenameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') actionButton.click(); });

            typeFilter.innerHTML = ''; 
            const effectiveFilters = options.filters || [{ name: "All Files", extensions: ["*.*"] }];
            effectiveFilters.forEach(filter => {
                const opt = document.createElement('option');
                opt.value = filter.extensions.join(',');
                opt.textContent = `${filter.name} (${filter.extensions.map(ext => ext === '*' || ext === '*.*' ? ext : `*.${ext}`).join('; ')})`;
                typeFilter.appendChild(opt);
            });
            state.currentFilterExtensions = (typeFilter.value || '*.*').split(',').map(s => s.trim().toLowerCase());
            typeFilter.onchange = () => {
                state.currentFilterExtensions = (typeFilter.value || '*.*').split(',').map(s => s.trim().toLowerCase());
                this._renderFileDialogItems(dialogElement, state.currentPath);
            };
        },

        openFileDialog: function(options = {}) {
            return new Promise(async (resolve, reject) => {
                await dm.ready(); 
                const dialogContent = document.createElement('div');
                dialogContent.innerHTML = getFileDialogHTMLTemplate();
                dialogContent.style.height = '100%'; dialogContent.style.width = '100%';
                const title = options.title || "Open";
                const dialogHWnd = this.createNewWindow('fileDialog', dialogContent, { skipIteratedPosition: true, noTaskbarButton: true });
                this.setCaption(dialogHWnd, title); this.setSize(dialogHWnd, 520, 360); this.setDialog(dialogHWnd);
                const dialogAppElement = this._windows[dialogHWnd];
                dialogAppElement.style.left = `calc(50% - ${520/2}px)`; dialogAppElement.style.top = `calc(50% - ${360/2}px)`;
                const initialUserPath = `C:/Documents and Settings/${window.shell?._currentUser || "Administrator"}/My Documents`;
                this._currentFileDialogState = {
                    promiseResolve: resolve, promiseReject: reject,
                    currentPath: options.initialPath || initialUserPath,
                    dialogHWnd: dialogHWnd, mode: 'open', selectedFileNode: null,
                    currentFilterExtensions: (options.filters && options.filters[0] ? options.filters[0].extensions : ['*.*'])
                };
                dialogAppElement.querySelector('.file-dialog-action-btn btnopt').textContent = 'Open';
                if (options.defaultName) dialogAppElement.querySelector('.file-dialog-filename-input').value = options.defaultName;
                this._renderFileDialogItems(dialogAppElement, this._currentFileDialogState.currentPath);
                this._setupFileDialogEventListeners(dialogAppElement, dialogHWnd, options);
                this.focusWindow(dialogHWnd);
            });
        },

        saveFileDialog: function(options = {}) {
             return new Promise(async (resolve, reject) => {
                await dm.ready();
                const dialogContent = document.createElement('div');
                dialogContent.innerHTML = getFileDialogHTMLTemplate();
                dialogContent.style.height = '100%'; dialogContent.style.width = '100%';
                const title = options.title || "Save As";
                const dialogHWnd = this.createNewWindow('fileDialog', dialogContent, { skipIteratedPosition: true, noTaskbarButton: true });
                this.setCaption(dialogHWnd, title); this.setSize(dialogHWnd, 520, 360); this.setDialog(dialogHWnd);
                const dialogAppElement = this._windows[dialogHWnd];
                dialogAppElement.style.left = `calc(50% - ${520/2}px)`; dialogAppElement.style.top = `calc(50% - ${360/2}px)`;
                const initialUserPath = `C:/Documents and Settings/${window.shell?._currentUser || "Administrator"}/My Documents`;
                this._currentFileDialogState = {
                    promiseResolve: resolve, promiseReject: reject,
                    currentPath: options.initialPath || initialUserPath,
                    dialogHWnd: dialogHWnd, mode: 'save', selectedFileNode: null,
                    currentFilterExtensions: (options.filters && options.filters[0] ? options.filters[0].extensions : ['*.*'])
                };
                dialogAppElement.querySelector('.file-dialog-action-btn btnopt').textContent = 'Save';
                if (options.defaultName) dialogAppElement.querySelector('.file-dialog-filename-input').value = options.defaultName;
                this._renderFileDialogItems(dialogAppElement, this._currentFileDialogState.currentPath);
                this._setupFileDialogEventListeners(dialogAppElement, dialogHWnd, options);
                this.focusWindow(dialogHWnd);
            });
        },
        setupTabs: function(windowId){if(this._windows[windowId]?.querySelector("tab_ui")){let _appTabs=this._windows[windowId].querySelector("tabholder").querySelectorAll("li");_appTabs.forEach(tab=>{tab.addEventListener("click",e=>{this.changeTab(windowId,tab.id)})})}},
        changeTab: function(windowId,tabToChange){if(!this._windows[windowId]?.querySelector("tab_ui")?.querySelector(`#tab_${tabToChange}`)){return}let _appTabs=this._windows[windowId].querySelector("tabholder").querySelectorAll("li");let _appTabsContnets=this._windows[windowId].querySelector("tab_ui").querySelectorAll("tabcontent");_appTabs.forEach(tab=>{tab.classList.remove("selected")});_appTabsContnets.forEach(tab=>{tab.classList.remove("selected")});this._windows[windowId].querySelector("tab_ui").querySelector(`li#${tabToChange}`).classList.add("selected");this._windows[windowId].querySelector("tab_ui").querySelector(`#tab_${tabToChange}`).classList.add("selected")},   
        setupInputs: function(windowId){if(!this._windows[windowId])return;let toggleableItems=this._windows[windowId].querySelectorAll("[data-storage]");toggleableItems.forEach(item=>{item.addEventListener("click",e=>{const cb=item.querySelector("input[type='checkbox']");if(cb&&!cb.disabled)cb.checked=!cb.checked;item.setAttribute("checked",cb.checked?"checked":"")});const storageKey=item.getAttribute("data-storage");const userSpecificKey=`${shell._currentUser}.${storageKey}`;const cb=item.querySelector("input[type='checkbox']");if(cb){const sysVal=localStorage.getItem(storageKey);const userVal=localStorage.getItem(userSpecificKey);if(sysVal==="true"||userVal==="true"){cb.checked=true;item.setAttribute("data-enabled","true")}else{cb.checked=false;item.setAttribute("data-enabled","false")}}});const applyBtn=this._windows[windowId].querySelector("[data-storage-apply]");if(applyBtn)applyBtn.addEventListener("click",e=>{toggleableItems.forEach(item=>{const cb=item.querySelector("input[type='checkbox']");let curValue=cb.checked?"true":"false";const storageKey=item.getAttribute("data-storage");if(item.getAttribute("systemwide")){localStorage.setItem(storageKey,curValue);shell.handleToggle(storageKey,curValue)}else{localStorage.setItem(`${shell._currentUser}.${storageKey}`,curValue);shell.handleToggle(storageKey,curValue)}})})},
        minimizeWindow: function(windowId){if(!this._windows[windowId]||!this._taskButtons[windowId]||!this._desktop)return;let viewport=this._desktop.getBoundingClientRect();let animatable=this._windows[windowId].querySelector("appanimator");let cssRoot=document.querySelector(":root");let appSizes=this._windows[windowId].getBoundingClientRect();cssRoot.style.setProperty("--srcWidth",`${appSizes.width-(parseInt(getComputedStyle(this._windows[windowId]).paddingLeft)*2)}px`);cssRoot.style.setProperty("--srcTop",`${appSizes.top-viewport.top}px`);cssRoot.style.setProperty("--srcLeft",`${appSizes.left-viewport.left}px`);let taskSizes=this._taskButtons[windowId].getBoundingClientRect();cssRoot.style.setProperty("--destWidth",`${taskSizes.width}px`);cssRoot.style.setProperty("--destTop",`${taskSizes.top-viewport.top}px`);cssRoot.style.setProperty("--destLeft",`${taskSizes.left-viewport.left}px`);if(animatable)animatable.classList.add("animating");setTimeout(()=>{this._windows[windowId].classList.add("minimized");if(animatable)animatable.classList.remove("animating")},250);this._taskButtons[windowId].classList.remove("active");this._taskButtons[windowId].classList.add("inactive");this._taskButtons[windowId].classList.add("minimized")},
        minimizeAllWindows: function(){if(!this._windowspace)return;this._windowspace.querySelectorAll("app").forEach(window=>{this.minimizeWindow(window.id)})},
        toggleMaximizeWindow:function(windowId){const win=this._windows[windowId];if(!win||win.classList.contains("noresize")||win.classList.contains("dialogbox"))return;const animatable=win.querySelector("appanimator");const cssRoot=document.querySelector(":root");const viewport=this._desktop.getBoundingClientRect();if(win.classList.contains("maximized")){cssRoot.style.setProperty("--srcWidth",`100%`);cssRoot.style.setProperty("--srcTop",`0px`);cssRoot.style.setProperty("--srcLeft",`0px`);cssRoot.style.setProperty("--destWidth",`${win.getAttribute("oldWidth")}px`);cssRoot.style.setProperty("--destTop",`${parseFloat(win.getAttribute("oldTop"))-viewport.top}px`);cssRoot.style.setProperty("--destLeft",`${parseFloat(win.getAttribute("oldLeft"))-viewport.left}px`);if(animatable)animatable.classList.add("animating");setTimeout(()=>{win.classList.remove("maximized");if(animatable)animatable.classList.remove("animating")},250)}else{const appSizes=win.getBoundingClientRect();win.setAttribute("oldWidth",`${appSizes.width-(parseInt(getComputedStyle(win).paddingLeft)*2)}`);win.setAttribute("oldTop",`${appSizes.top}`);win.setAttribute("oldLeft",`${appSizes.left}`);cssRoot.style.setProperty("--srcWidth",`${appSizes.width-(parseInt(getComputedStyle(win).paddingLeft)*2)}px`);cssRoot.style.setProperty("--srcTop",`${appSizes.top-viewport.top}px`);cssRoot.style.setProperty("--srcLeft",`${appSizes.left-viewport.left}px`);cssRoot.style.setProperty("--destWidth",`100%`);cssRoot.style.setProperty("--destTop",`0px`);cssRoot.style.setProperty("--destLeft",`0px`);if(animatable)animatable.classList.add("animating");setTimeout(()=>{win.classList.add("maximized");if(animatable)animatable.classList.remove("animating")},250)}},
        closeWindow: function(windowId){
            const winEl=this._windows[windowId];
            if(!winEl)return;
            
            const existingObjectUrl = _wmVfsIconObjectUrls.get(windowId);
            if (existingObjectUrl) {
                URL.revokeObjectURL(existingObjectUrl);
                _wmVfsIconObjectUrls.delete(windowId);
            }

            winEl.dispatchEvent(new CustomEvent('wm:windowClosed',{bubbles:false,cancelable:false}));
            if(this._desktop)this._desktop.querySelectorAll(`[parent='${windowId}']`).forEach(childWin=>this.closeWindow(childWin.id));
            winEl.remove();
            delete this._windows[windowId];
            this._windowStack=this._windowStack.filter(id=>id!==windowId);
            if(this._taskButtons[windowId]){this._taskButtons[windowId].remove();delete this._taskButtons[windowId]}
            const activeWindows=this._windowStack.filter(id=>this._windows[id]&&!this._windows[id].classList.contains("minimized"));
            if(activeWindows.length>0)this.focusWindow(activeWindows[activeWindows.length-1])
        },
        setDialog: function(windowId){if(!this._windows[windowId])return;this._windows[windowId].classList.add("dialogbox");if(this._taskButtons[windowId])this._taskButtons[windowId].classList.add("dialogbox")},
        setIFrameApp: function(windowId){if(!this._windows[windowId])return;this._windows[windowId].classList.add("iframeapp")},
        setSize: function(windowId,newWidth,newHeight){const appWrapper=this._windows[windowId];if(!appWrapper)return;const appContent=appWrapper.querySelector("appcontents");if(!appContent)return;if(String(newWidth).toLowerCase()==="auto"){appContent.style.width="auto"}else if(String(newWidth).toLowerCase()==="fullscreen"){appWrapper.classList.add("fullscreen");return}else{appContent.style.width=`${parseFloat(newWidth)}px`}if(String(newHeight).toLowerCase()==="auto"){appContent.style.height="auto"}else{appContent.style.height=`${parseFloat(newHeight)}px`}if(!appWrapper.classList.contains("fullscreen"))this.setIteratedPosition(windowId);const contentRect=appContent.getBoundingClientRect();const appHeaderSpan=appWrapper.querySelector("appheader span");if(appHeaderSpan)appHeaderSpan.style.maxWidth=`${contentRect.width-100}px`;appWrapper.setAttribute("sized","true")},
        setPosition: function(windowId,PosX,PosY){const appWrapper=this._windows[windowId];if(appWrapper){appWrapper.style.left=PosX+"px";appWrapper.style.top=PosY+"px"}},
        setIteratedPosition:function(windowId){const appWrapper=this._windows[windowId];if(!appWrapper||!this._desktop||!this._taskholder)return;const screenRect=this._desktop.getBoundingClientRect();const windowRect=appWrapper.getBoundingClientRect();const taskbarRect=this._taskholder.getBoundingClientRect();if((windowRect.height+taskbarRect.height+this._windowOffsetY)>screenRect.height||this._windowOffsetY>=screenRect.height/2)this._windowOffsetY=this._windowOffsetIndex;if((windowRect.width+this._windowOffsetX)>screenRect.width||this._windowOffsetX>=screenRect.width/2)this._windowOffsetX=this._windowOffsetIndex;this.setPosition(windowId,this._windowOffsetX,this._windowOffsetY);this._windowOffsetX+=this._windowOffsetIndex;this._windowOffsetY+=this._windowOffsetIndex},
        cascadeWindows: function(){if(!this._windowspace)return;let userWindows=this._windowspace.querySelectorAll("app:not(.dialogbox)");this._windowOffsetX=this._windowOffsetIndex;this._windowOffsetY=this._windowOffsetIndex;userWindows.forEach(app=>{if(!app.classList.contains("minimized"))this.setIteratedPosition(app.id)})},
        recoverWindowPositions:function(){if(!this._desktop||!this._taskholder)return;const screenRect=this._desktop.getBoundingClientRect();const taskbarRect=this._taskholder.getBoundingClientRect();this._windowStack.forEach((id)=>{const winEl=this._windows[id];if(!winEl)return;const winRect=winEl.getBoundingClientRect();let newTop=parseFloat(winEl.style.top);let newLeft=parseFloat(winEl.style.left);if((winRect.top+winRect.height)>(screenRect.height-taskbarRect.height)){if(winRect.height>(screenRect.height-taskbarRect.height))newTop=0;else newTop=screenRect.height-taskbarRect.height-winRect.height}if(winRect.top<0)newTop=0;if((winRect.left+winRect.width)>screenRect.width){if(winRect.width>screenRect.width)newLeft=0;else newLeft=screenRect.width-winRect.width}if(winRect.left<0)newLeft=0;winEl.style.top=`${newTop}px`;winEl.style.left=`${newLeft}px`})},
        setNoResize: function(windowId){if(this._windows[windowId])this._windows[windowId].classList.add("noresize")},
        setNoClose: function(windowId){if(this._windows[windowId])this._windows[windowId].classList.add("noclose")},
        setIcon: async function(windowId, newIconPathOrName) {
            const win = this._windows[windowId];
            if (!win) return;

            const appHeader = win.querySelector("appheader");
            const appAnim = win.querySelector("appanimator");
            let finalIconSrc = '';
            let isVfsIcon = false;

            if (typeof newIconPathOrName === 'string' && (newIconPathOrName.toLowerCase().startsWith("c:/") || newIconPathOrName.toLowerCase().startsWith("e:/") || newIconPathOrName.toLowerCase().startsWith("d:/"))) {
                isVfsIcon = true;
                try {
                    const iconNode = await dm.open(newIconPathOrName);
                    if (iconNode && iconNode.content instanceof Blob) {
                        const oldUrl = _wmVfsIconObjectUrls.get(windowId);
                        if (oldUrl) URL.revokeObjectURL(oldUrl);
                        
                        finalIconSrc = URL.createObjectURL(iconNode.content);
                        _wmVfsIconObjectUrls.set(windowId, finalIconSrc);
                    } else {
                        finalIconSrc = 'res/icons/tray/defaultapp.png'; 
                    }
                } catch (e) {
                    finalIconSrc = 'res/icons/tray/defaultapp.png'; 
                }
            } else if (newIconPathOrName) {
                finalIconSrc = 'res/icons/tray/' + newIconPathOrName;
            } else {
                 finalIconSrc = 'res/icons/tray/defaultapp.png';
            }
            
            if (appHeader && appHeader.querySelector("img")) appHeader.querySelector("img").src = finalIconSrc;
            if (appAnim && appAnim.querySelector("img")) appAnim.querySelector("img").src = finalIconSrc;
            
            if (this._taskButtons[windowId] && appHeader) {
                 const taskImg = this._taskButtons[windowId].querySelector("img");
                 if(taskImg) taskImg.src = finalIconSrc;
                 const taskSpan = this._taskButtons[windowId].querySelector("span");
                 const headerSpan = appHeader.querySelector("span");
                 if(taskSpan && headerSpan) taskSpan.textContent = headerSpan.textContent;
            }
        },
        removeIcon: function(windowId){const win=this._windows[windowId];if(!win)return;const appHeader=win.querySelector("appheader");const appAnim=win.querySelector("appanimator");if(appHeader&&appHeader.querySelector("img"))appHeader.querySelector("img").remove();if(appAnim&&appAnim.querySelector("img"))appAnim.querySelector("img").remove();if(this._taskButtons[windowId]&&appHeader)this._taskButtons[windowId].innerHTML=appHeader.innerHTML},
        setCaption: function(windowId,newCaption){const win=this._windows[windowId];if(!win)return;const appHeader=win.querySelector("appheader");const appAnim=win.querySelector("appanimator");if(appHeader&&appHeader.querySelector("span"))appHeader.querySelector("span").textContent=newCaption;if(appAnim&&appAnim.querySelector("span"))appAnim.querySelector("span").textContent=newCaption;if(this._taskButtons[windowId]&&appHeader){const taskSpan = this._taskButtons[windowId].querySelector("span"); if(taskSpan) taskSpan.textContent = newCaption;}},
        pushWindow: function(windowId){if(!this._windows[windowId])return;this._windows[windowId].style.zIndex=String(this._windowStack.push(windowId))},
        focusWindow: function(windowId){
            const targetWindow=this._windows[windowId];
            if(!targetWindow||!this._windowStack.includes(windowId))return;
            let srcIndex=this._windowStack.indexOf(windowId);
            this._windowStack.splice(srcIndex,1);
            this._windowStack.push(windowId);
            this._windowStack.forEach((id,i)=>{
                if(this._windows[id]){
                    this._windows[id].style.zIndex=String(i+1);
                    this._windows[id].classList.add("inactive");
                    if(this._taskButtons[id])this._taskButtons[id].classList.remove("active")
                }
            });
            targetWindow.classList.remove("inactive");
            const taskBtn=this._taskButtons[windowId];
            if(taskBtn){
                taskBtn.classList.add("active");
                if(targetWindow.classList.contains("minimized")){
                    targetWindow.classList.remove("minimized");
                    taskBtn.classList.remove("minimized");
                    taskBtn.classList.remove("inactive");
                    const animatable=targetWindow.querySelector("appanimator");
                    const cssRoot=document.querySelector(":root");
                    const taskSizes=taskBtn.getBoundingClientRect();
                    const viewport=this._desktop.getBoundingClientRect();
                    cssRoot.style.setProperty("--srcWidth",`${taskSizes.width}px`);
                    cssRoot.style.setProperty("--srcTop",`${taskSizes.top-viewport.top}px`);
                    cssRoot.style.setProperty("--srcLeft",`${taskSizes.left-viewport.left}px`);
                    let oldWidth=targetWindow.getAttribute("oldWidth")||targetWindow.style.width||targetWindow.getBoundingClientRect().width;
                    let oldTop=targetWindow.getAttribute("oldTop")||targetWindow.style.top||(targetWindow.getBoundingClientRect().top-viewport.top);
                    let oldLeft=targetWindow.getAttribute("oldLeft")||targetWindow.style.left||(targetWindow.getBoundingClientRect().left-viewport.left);
                    
                    oldWidth = oldWidth + "";
                    oldTop = oldTop + "";
                    oldLeft = oldLeft + "";
                    
                    cssRoot.style.setProperty("--destWidth",`${oldWidth.includes('px')?oldWidth:oldWidth+'px'}`);
                    cssRoot.style.setProperty("--destTop",`${oldTop.includes('px')?oldTop:oldTop+'px'}`);
                    cssRoot.style.setProperty("--destLeft",`${oldLeft.includes('px')?oldLeft:oldLeft+'px'}`);
                    if(animatable){
                        animatable.classList.add("animating");
                        setTimeout(()=>animatable.classList.remove("animating"),250)
                    }
                }

            }
        },
        defocusAllWindows: function(){const focusedWindowId=this._windowStack[this._windowStack.length-1];if(focusedWindowId&&this._windows[focusedWindowId]){this._windows[focusedWindowId].classList.add("inactive");if(this._taskButtons[focusedWindowId])this._taskButtons[focusedWindowId].classList.remove("active")}},
        toggleStartMenu: function(){if(!this._startButton||!this._startMenu)return;this._startButton.classList.toggle("active");this._startMenu.classList.toggle("hidden")},
        closeStartMenu: function(){if(!this._startButton||!this._startMenu)return;this._startButton.classList.remove("active");this._startMenu.classList.add("hidden")},   
        isStartMenuHidden: function(){return this._startMenu?this._startMenu.classList.contains("hidden"):true},
        openOverlay: function(){if(!this._overlay||!this._desktop||!this._logon)return;this._overlay.classList.remove("inactive");this._desktop.classList.add("fadetogray");this._logon.classList.add("fadetogray")},
        closeOverlay: function(){if(!this._overlay||!this._desktop||!this._logon)return;this._overlay.classList.add("inactive");this._desktop.classList.remove("fadetogray");this._logon.classList.remove("fadetogray")},
        openPowerOptions: function(isFromLogon){if(!isFromLogon)this.closeStartMenu();const sd=this._overlay?.querySelector("#shutdown"),lo=this._overlay?.querySelector("#logoff");if(sd)sd.classList.remove("inactive");if(lo)lo.classList.add("inactive")},
        openLogoffOptions: function(isFromLogon){if(!isFromLogon)this.closeStartMenu();const sd=this._overlay?.querySelector("#shutdown"),lo=this._overlay?.querySelector("#logoff");if(sd)sd.classList.add("inactive");if(lo)lo.classList.remove("inactive")},
        fullscreenViewport: function(){if(!document.fullscreenElement&&!document.mozFullScreenElement&&!document.webkitFullscreenElement&&!document.msFullscreenElement){const el=document.documentElement;if(el.requestFullscreen)el.requestFullscreen();else if(el.mozRequestFullScreen)el.mozRequestFullScreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);else if(el.msRequestFullscreen)el.msRequestFullscreen()}else{if(document.exitFullscreen)document.exitFullscreen();else if(document.mozCancelFullScreen)document.mozCancelFullScreen();else if(document.webkitExitFullscreen)document.webkitExitFullscreen();else if(document.msExitFullscreen)document.msExitFullscreen()}}
    }
})();