import {DiskManager} from "./DiskManager.js";

export class Explorer {
    windowContent = `
    <appcontentholder class="explorer">
        <appnavigation class="rich">
            <ul class="appmenus">
                <li>File
                    <ul class="submenu">
                        <li class="submenuholder" data-action-group="new"><span>New</span>
                            <ul class="submenu">
                                <li data-action="new-folder"><span>Folder</span></li>
                                <li data-action="new-txt"><span>Text Document</span></li>
                                <li data-action="new-bmp"><span>Bitmap Image</span></li>
                                <li class="divider"></li>
                                <li data-action="upload-computer"><span>Upload from Computer...</span></li>
                            </ul>
                        </li>
                        <li data-action="create-shortcut" class="disabled"><span>Create Shortcut</span></li>
                        <li data-action="delete-selected" class="disabled"><span>Delete</span></li>
                        <li data-action="rename-selected" class="disabled"><span>Rename</span></li>
                        <li data-action="properties-selected" class="disabled"><span>Properties</span></li>
                        <li class="divider"></li>
                        <li onclick="const app = this.closest('app'); if(app) window.wm.closeWindow(app.id);"><span>Close</span></li>
                    </ul>
                </li>
                <li>Edit
                    <ul class="submenu">
                        <li data-action="undo" class="disabled"><span>Undo</span></li>
                        <li class="divider"></li>
                        <li data-action="cut-selected" class="disabled"><span>Cut</span></li>
                        <li data-action="copy-selected" class="disabled"><span>Copy</span></li>
                        <li data-action="paste-clipboard" class="disabled"><span>Paste</span></li>
                        <li data-action="paste-shortcut" class="disabled"><span>Paste Shortcut</span></li>
                        <li class="divider"></li>
                        <li data-action="select-all"><span>Select All</span></li>
                    </ul>
                </li>
                <li>View
                    <ul class="submenu">
                        <li class="submenuholder disabled"><span>Toolbars</span> <ul class="submenu"><li class="disabled"><span>Standard Buttons</span></li><li class="disabled"><span>Address Bar</span></li><li class="disabled"><span>Links</span></li></ul></li>
                        <li class="disabled"><span>Status Bar</span></li>
                        <li class="submenuholder disabled"><span>Explorer Bar</span> <ul class="submenu"><li class="disabled"><span>Search</span></li><li class="disabled"><span>Favorites</span></li><li class="disabled"><span>History</span></li><li class="disabled"><span>Folders</span></li></ul></li>
                        <li class="divider"></li>
                        <li data-view-action="thumbview"><span>Thumbnails</span></li>
                        <li data-view-action="tileview"><span>Tiles</span></li>
                        <li data-view-action="iconview"><span>Icons</span></li>
                        <li data-view-action="listview"><span>List</span></li>
                        <li class="divider"></li>
                        <li class="submenuholder disabled"><span>Arrange Icons by</span></li>
                        <li class="divider"></li>
                        <li data-action="refresh-view"><span>Refresh</span></li>
                    </ul>
                </li>
                <li>Favorites <ul class="submenu"><li class="disabled"><span>Add to Favorites...</span></li><li class="disabled"><span>Organize Favorites...</span></li></ul></li>
                <li>Tools <ul class="submenu"><li class="disabled"><span>Map Network Drive...</span></li><li class="disabled"><span>Disconnect Network Drive...</span></li><li class="divider"></li><li id="folderopt" onclick="if(window.apps && apps.load) apps.load('folderopt').then(app => { if(app && typeof app.start === 'function') app.start(); else console.error('Folder Options app could not be started.'); })"><span>Folder Options...</span></li></ul></li>
                <li>Help <ul class="submenu"><li id="help" onclick="if(window.apps && apps.load) apps.load('help').then(app => { if(app && typeof app.start === 'function') app.start(); else console.error('Help app could not be started.'); })"><span>Help and About Center</span></li><li class="divider"></li><li data-action="about-explorer" class="disabled"><span>About Windows Explorer</span></li></ul></li>
            </ul>
            <navflag></navflag>
            <ul class="navbuttons">
                <li name="go-previous" class="disabled"><img src="res/ui/nav/back.png">Back <pointer>▼</pointer></li>
                <li name="go-next" class="disabled"><img src="res/ui/nav/forward.png"> <pointer>▼</pointer></li>
                <li name="go-up"><img src="res/ui/nav/up.png"></li>
                <li class="divider"></li>
                <li name="search-button" class="disabled"><img src="res/ui/nav/search.png">Search</li>
                <li name="folders-button" class="disabled"><img src="res/ui/nav/folders.png">Folders</li>
                <li class="divider"></li>
                <li name="viewsmenu"><img src="res/ui/nav/views.png"><pointer>▼</pointer>
                    <xp-popup class="viewpicker"><ul>
                        <li id="thumbview"><span>•</span>Thumbnails</li>
                        <li id="tileview" class="activeView"><span>•</span>Tiles</li>
                        <li id="iconview"><span>•</span>Icons</li>
                        <li id="listview"><span>•</span>List</li>
                    </ul></xp-popup>
                </li>
            </ul>
            <ul class="addressbar">
                <li>Address</li>
                <li><combobox id="explorer-addressbar-combo"><img src="res/icons/tray/folder.png"> <span id="explorer-addressbar-text">C:/</span></combobox></li>
                <li id="explorer-go-btn"><img src="res/ui/nav/go.png">Go</li>
            </ul>
        </appnavigation>
        <sidebarcontents>
            <div class="sidebargroup">
                <div class="groupheader"><span>File and Folder Tasks</span><div class="collapser"><span>»</span></div></div>
                <ul>
                    <li id="sidebar-newfolder"><img src="res/icons/tray/newfolder.png">Make a new folder</li>
                    <li id="sidebar-renameitem" class="disabled"><img src="res/icons/tray/rename.png">Rename this selection</li>
                    <li id="sidebar-deleteitem" class="disabled"><img src="res/icons/tray/delete.png">Delete this selection</li>
                </ul>
            </div>
            <div class="sidebargroup">
                <div class="groupheader"><span>Other Places</span><div class="collapser"><span>»</span></div></div>
                <ul>
                    <li id="sidebar-desktop"><img src="res/icons/tray/desktop.png">Desktop</li>
                    <li id="sidebar-mydocuments"><img src="res/icons/tray/mydocuments.png">My Documents</li>
                    <li id="sidebar-mycomputer"><img src="res/icons/tray/mycomputer.png">My Computer</li>
                    <li id="sidebar-parentfolder" style="display:none;"><img src="res/icons/tray/folder.png"><path>Parent Folder</path></li>
                </ul>
            </div>
            <div class="sidebargroup details collapsed">
                <div class="groupheader"><span>Details</span><div class="collapser"><span>»</span></div></div>
                <ul id="sidebar-details-list">
                    <li class="name"></li>
                    <li class="type"></li>
                    <li class="modified"></li>
                </ul>
            </div>
        </sidebarcontents>
        <fscontents class="tileview">
            <div class="loading-overlay-explorer" style="display:none;">Loading...</div>
            <items></items>
        </fscontents>
    </appcontentholder>
    `;
    iconContent = `<fsicon draggable="true"><icon><img src="res/icons/text.png"></icon><icontitle>Untitled Document</icontitle></fsicon>`;
    template;
    itemTemplate;
    clipboard = null;
    _isSettingUpDesktop = false;
    _desktopSetupQueued = false;
    _recycleBinIconElement = null;
    handlers = {};
    _vfsIconObjectUrls = new Map();
    icons = {
        avi: 'mediafile.png',
        bat: 'batch.png',
        bmp: 'bmp.png',
        cpl: 'default.png',
        dat: 'default.png',
        dll: 'dll.png',
        exe: 'defaultapp.png',
        fon: 'font.png',
        gif: 'gif.png',
        html: 'webpage.png',
        htm: 'webpage.png',
        ini: 'config.png',
        jpg: 'jpg.png',
        jpeg: 'jpg.png',
        lnk: 'shortcut.png',
        log: 'text.png',
        mid: 'mplay32.png',
        mkv: 'mediafile.png',
        mp3: 'mediafile.png',
        mp4: 'mediafile.png',
        msi: 'install.png',
        msstyles: 'theme.png',
        otf: 'opentype.png',
        png: 'gif.png',
        sdb: 'dll.png',
        sys: 'default.png',
        theme: 'theme.png',
        ttf: 'truetype.png',
        txt: 'text.png',
        url: 'webpage.png',
        vbs: 'script.png',
        vmc: 'virtualmachine.png',
        wsz: 'winamp_file.png',
        xml: 'xml.png',
        wav: 'mediafile.png',
        webm: 'mediafile.png',
        wma: 'mediafile.png',
        wpl: 'playlist.png',
        wmz: 'wmskin.png',
        zip: 'zip.png',
        imgviewer: 'imgviewer.png',
        folder: 'folder.png',
        drive: 'drive.png',
        rtf: 'wordpad1.png',
        swf: 'swf.png',
        'folder_gear.png': 'folder_gear.png',
        'recycler empty.png': 'recycler empty.png',
        'recycler full.png': 'recycler full.png',
        'defaults.png': 'defaults.png',
        'catalog.png': 'catalog.png',
        'winupdate.png': 'winupdate.png'
    };
    hiddenFiles = ['thumbs.db'];
    openWithDialogTemplate = `<appcontentholder class="openwith-dialog" style="padding: 12px; font-size: 13px; background-color: var(--dialog-bg); color: var(--text-color, black); display: flex; flex-direction: column; height: 100%; box-sizing: border-box;"><div style="flex-grow: 1; overflow-y: auto;"><div style="display: flex; align-items: center; margin-bottom: 10px;"><img src="res/icons/openwith_doc.png" alt="" style="width: 32px; height: 32px; margin-right: 10px; object-fit: contain;" class="ow-file-icon"><div style="line-height: 1.4;">Choose the program you want to use to open this file:<br>File: <span id="ow-filename" style="font-weight: bold;"></span></div></div><div style="margin-bottom: 10px;"><label style="display: block; margin-bottom: 3px; font-weight: normal;">Programs</label><div style="border: 1px solid var(--input-border-color, #7F9DB9); background-color: var(--input-bg, white); padding: 5px; height: 180px; overflow-y: auto;" class="ow-program-list-box-inline"><p style="margin: 0 0 3px 0; font-weight: bold; color: var(--text-color, black);">Recommended Programs:</p><ul id="ow-recommended-programs" style="list-style: none; padding: 0; margin: 0;"></ul><hr style="border: none; border-top: 1px solid var(--border-light, #DFDFDF); margin: 5px 0;"><p style="margin: 0 0 3px 0; font-weight: bold; color: var(--text-color, black);">Other Programs:</p><ul id="ow-other-programs" style="list-style: none; padding: 0; margin: 0;"></ul></div></div><div style="margin: 10px 0; display: flex; align-items: center;"><input type="checkbox" id="ow-always-use-checkbox" disabled style="margin-right: 5px; vertical-align: middle;"><label for="ow-always-use-checkbox" style="vertical-align: middle;">Always use the selected program to open this kind of file</label></div><div style="line-height: 1.4;">If the program you want is not in the list or on your computer, you can <a href="#" id="ow-look-on-web" style="color: var(--link-color, #003399); text-decoration: underline; cursor: pointer;">look for the appropriate program on the Web</a>.</div></div><btncontainer style="padding-top: 10px; margin-top: 10px; border-top: 1px solid var(--border-light); flex-shrink: 0; text-align: right;"><winbutton id="ow-ok-btn" class="default" disabled><btnopt>OK</btnopt></winbutton><winbutton id="ow-cancel-btn"><btnopt>Cancel</btnopt></winbutton></btncontainer></appcontentholder>`;
    constructor() {
        this.template = document.createElement("template");
        this.template.innerHTML = this.windowContent;
        this.itemTemplate = document.createElement("template");
        this.itemTemplate.innerHTML = this.iconContent;
        this._vfsIconObjectUrls = new Map();
        this.appDisplayInfo = {
            'notepad': {
                name: "Notepad",
                icon: "notepad.png"
            },
            'wordpad': {
                name: "WordPad",
                icon: "wordpad.png"
            },
            'iexplore': {
                name: "Internet Explorer",
                icon: "iexplore.png"
            },
            'imgviewer': {
                name: "Windows Picture and Fax Viewer",
                icon: "imgviewer.png"
            },
            'mspaint': {
                name: "Paint",
                icon: "mspaint.png"
            },
            'wmp': {
                name: "Windows Media Player",
                icon: "wmplayer.png"
            },
            'cmd': {
                name: "Command Prompt",
                icon: "cmd.png"
            },
            'winamp': {
                name: "Winamp",
                icon: "winamp.png"
            },
            'regedit': {
                name: "Registry Editor",
                icon: "regedit.png"
            },
            'fontview': {
                name: "Font Viewer",
                icon: "font.png"
            },
            'sndrec32': {
                name: "Sound Recorder",
                icon: "sound.png"
            }
        };
        this.openWithDefinitions = {
            'html': {
                defaultApp: 'iexplore',
                recommended: ['iexplore', 'notepad', 'wordpad'],
                other: []
            },
            'htm': {
                defaultApp: 'iexplore',
                recommended: ['iexplore', 'notepad', 'wordpad'],
                other: []
            },
            'txt': {
                defaultApp: 'notepad',
                recommended: ['notepad', 'wordpad'],
                other: ['iexplore']
            },
            'log': {
                defaultApp: 'notepad',
                recommended: ['notepad', 'wordpad'],
                other: []
            },
            'ini': {
                defaultApp: 'notepad',
                recommended: ['notepad', 'wordpad'],
                other: []
            },
            'js': {
                defaultApp: 'notepad',
                recommended: ['notepad', 'wordpad'],
                other: []
            },
            'css': {
                defaultApp: 'notepad',
                recommended: ['notepad', 'wordpad'],
                other: []
            },
            'json': {
                defaultApp: 'notepad',
                recommended: ['notepad', 'wordpad'],
                other: []
            },
            'xml': {
                defaultApp: 'notepad',
                recommended: ['notepad', 'wordpad', 'iexplore'],
                other: []
            },
            'bmp': {
                defaultApp: 'imgviewer',
                recommended: ['imgviewer', 'mspaint', 'iexplore'],
                other: []
            },
            'jpg': {
                defaultApp: 'imgviewer',
                recommended: ['imgviewer', 'mspaint', 'iexplore'],
                other: []
            },
            'jpeg': {
                defaultApp: 'imgviewer',
                recommended: ['imgviewer', 'mspaint', 'iexplore'],
                other: []
            },
            'png': {
                defaultApp: 'imgviewer',
                recommended: ['imgviewer', 'mspaint', 'iexplore'],
                other: []
            },
            'gif': {
                defaultApp: 'imgviewer',
                recommended: ['imgviewer', 'mspaint', 'iexplore'],
                other: []
            },
            'rtf': {
                defaultApp: 'wordpad',
                recommended: ['wordpad', 'notepad'],
                other: []
            },
            'mp3': {
                defaultApp: 'wmp',
                recommended: ['wmp', 'winamp', 'sndrec32'],
                other: []
            },
            'wav': {
                defaultApp: 'wmp',
                recommended: ['wmp', 'winamp', 'sndrec32'],
                other: []
            },
            'wma': {
                defaultApp: 'wmp',
                recommended: ['wmp', 'winamp'],
                other: []
            },
            'ogg': {
                defaultApp: 'wmp',
                recommended: ['wmp', 'winamp', 'sndrec32'],
                other: []
            },
            'opus': {
                defaultApp: 'wmp',
                recommended: ['wmp', 'winamp'],
                other: []
            },
            'flac': {
                defaultApp: 'wmp',
                recommended: ['wmp', 'winamp'],
                other: []
            },
            'mkv': {
                defaultApp: 'wmp',
                recommended: ['wmp'],
                other: []
            },
            'mp4': {
                defaultApp: 'wmp',
                recommended: ['wmp'],
                other: []
            },
            'wmv': {
                defaultApp: 'wmp',
                recommended: ['wmp'],
                other: []
            },
            'avi': {
                defaultApp: 'wmp',
                recommended: ['wmp'],
                other: []
            },
            'webm': {
                defaultApp: 'wmp',
                recommended: ['wmp'],
                other: []
            },
            'url': {
                defaultApp: 'iexplore',
                recommended: ['iexplore'],
                other: []
            },
            'theme': {
                defaultApp: 'themehandler',
                recommended: [],
                other: []
            },
            'msstyles': {
                defaultApp: 'themehandler',
                recommended: [],
                other: []
            },
            'wsz': {
                defaultApp: 'winamp',
                recommended: [],
                other: []
            },
            'fon': {
                defaultApp: 'fontview',
                recommended: ['fontview'],
                other: []
            },
            'ttf': {
                defaultApp: 'fontview',
                recommended: ['fontview'],
                other: []
            },
            'otf': {
                defaultApp: 'fontview',
                recommended: ['fontview'],
                other: []
            },
            'zip': {
                defaultApp: 'explorer',
                recommended: [],
                other: []
            },
            '_unknown_': {
                recommended: [],
                other: Object.keys(this.appDisplayInfo)
            }
        };
        this._setupGlobalEventHandlers();
        this._setupAppHandlers();
        window.addEventListener('shellUserSwitched', () => {
            if (shell._currentUser)
                this.setupDesktop();
        }
        );
        window.addEventListener('usersUpdated', () => {
            if (shell._currentUser)
                this.setupDesktop();
        }
        );
        window.addEventListener('storage', (e) => {
            if (shell._currentUser && e.key === `user_${shell._currentUser}.userWallpaper` && e.oldValue !== e.newValue) {
                if (e.newValue === 'none' && e.oldValue && e.oldValue.startsWith("C:/")) {}
            }
            if (e.key === 'openFoldersInNewWindow' || (shell._currentUser && e.key === `user_${shell._currentUser}.noExplorerSidebar`) || (shell._currentUser && e.key === `user_${shell._currentUser}.fullPathInTitle`) || (shell._currentUser && e.key === `user_${shell._currentUser}.showHiddenContents`) || (shell._currentUser && e.key === `user_${shell._currentUser}.showFileExtensions`)) {
                document.querySelectorAll('app.explorer').forEach(expApp => {
                    const expWin = expApp.explorerWindowInstance;
                    if (expWin)
                        expWin.reload();
                }
                );
                if (shell._currentUser && (e.key.includes('showHiddenContents') || e.key.includes('showFileExtensions'))) {
                    this.setupDesktop();
                }
            }
        }
        );
    }
    _revokeAllVfsIconObjectUrls() {
        this._vfsIconObjectUrls.forEach(url => URL.revokeObjectURL(url));
        this._vfsIconObjectUrls.clear();
    }
    _setupGlobalEventHandlers() {
        dm.addEventListener('fileChanged', (event) => {
            document.querySelectorAll('app.explorer').forEach(explorerAppInstance => {
                const explorerWindowObject = explorerAppInstance.explorerWindowInstance;
                if (explorerWindowObject && explorerWindowObject.hWnd && wm._windows[explorerWindowObject.hWnd]) {
                    let primaryPathToCheck = event.detail.path
                      , oldPathForRelevance = null;
                    if (event.detail.type === 'rename') {
                        primaryPathToCheck = event.detail.newPath;
                        oldPathForRelevance = event.detail.oldPath;
                    } else if (['delete', 'recycle', 'delete_permanent', 'restore'].includes(event.detail.type)) {
                        primaryPathToCheck = event.detail.path;
                        if (event.detail.type === 'restore' && event.detail.oldPath)
                            oldPathForRelevance = event.detail.oldPath;
                    }
                    if (!primaryPathToCheck && oldPathForRelevance)
                        primaryPathToCheck = oldPathForRelevance;
                    const currentExplorerPath = explorerWindowObject.pwd;
                    let needsReload = false;
                    if (primaryPathToCheck) {
                        const eventParentPath = dm.dirname(primaryPathToCheck);
                        const isRelevant = () => {
                            if (!currentExplorerPath && currentExplorerPath !== '')
                                return false;
                            if (currentExplorerPath === eventParentPath)
                                return true;
                            if (oldPathForRelevance && currentExplorerPath === dm.dirname(oldPathForRelevance))
                                return true;
                            if (currentExplorerPath === DiskManager.RECYCLE_BIN_PATH && ['restore', 'delete_permanent', 'recycle'].includes(event.detail.type))
                                return true;
                            if (!['delete', 'recycle', 'rename', 'delete_permanent', 'restore'].includes(event.detail.type) && currentExplorerPath === primaryPathToCheck)
                                return true;
                            if (event.detail.type === 'rename' && currentExplorerPath === event.detail.oldPath)
                                return true;
                            if (currentExplorerPath === '' && (primaryPathToCheck.match(/^[A-Z]:\/?$/) || (oldPathForRelevance && oldPathForRelevance.match(/^[A-Z]:\/?$/)))) {
                                return true;
                            }
                            return false;
                        }
                        ;
                        if (isRelevant()) {
                            if (event.detail.type === 'rename' && currentExplorerPath === event.detail.oldPath) {
                                explorerWindowObject.navigate(event.detail.newPath, {
                                    modifyHistory: false
                                });
                            } else {
                                needsReload = true;
                            }
                        }
                    }
                    if (needsReload)
                        explorerWindowObject.reload();
                }
            }
            );
            if (shell._currentUser) {
                const desktopPathPrefix = `C:/Documents and Settings/${shell._currentUser}/Desktop`;
                let pathForDesktopCheck = event.detail.path;
                if (event.detail.type === 'rename') {
                    if ((event.detail.oldPath && event.detail.oldPath.startsWith(desktopPathPrefix)) || (event.detail.newPath && event.detail.newPath.startsWith(desktopPathPrefix)))
                        this.setupDesktop();
                } else if (['recycle', 'restore'].includes(event.detail.type)) {
                    if ((pathForDesktopCheck && pathForDesktopCheck.startsWith(desktopPathPrefix)) || (event.detail.type === 'restore' && event.detail.path?.startsWith(desktopPathPrefix)) || (event.detail.type === 'recycle' && pathForDesktopCheck?.startsWith(desktopPathPrefix)))
                        this.setupDesktop();
                } else if (pathForDesktopCheck?.startsWith(desktopPathPrefix) && (event.detail.type === 'create' || event.detail.type === 'write' || (event.detail.type === 'delete' && dm.dirname(pathForDesktopCheck) === desktopPathPrefix) || (event.detail.type === 'delete_permanent' && dm.dirname(pathForDesktopCheck) === desktopPathPrefix))) {
                    this.setupDesktop();
                } else if (event.detail.type === 'populate' && event.detail.drive === 'C')
                    this.setupDesktop();
            }
        }
        );
        dm.addEventListener('recycleBinChanged', () => {
            this.updateRecycleBinIconState();
            document.querySelectorAll('app.explorer').forEach(expApp => {
                const expWin = expApp.explorerWindowInstance;
                if (expWin && expWin.pwd === DiskManager.RECYCLE_BIN_PATH)
                    expWin.reload();
            }
            );
        }
        );
        dm.addEventListener('drivePopulated', (event) => {
            if (event.detail.drive === 'E' && event.detail.status === 'success') {
                document.querySelectorAll('app.explorer').forEach(expApp => {
                    const expWin = expApp.explorerWindowInstance;
                    if (expWin && expWin.pwd === '')
                        expWin.reloadDrives();
                }
                );
            }
        }
        );
        document.addEventListener('clipboardUpdated', (event) => {
            this.clipboard = event.detail;
            this._updateContextMenuPasteStates();
        }
        );
    }
    async setupDesktop() {
        if (this._isSettingUpDesktop) {
            this._desktopSetupQueued = true;
            return;
        }
        this._isSettingUpDesktop = true;
        this._revokeAllVfsIconObjectUrls();
        const desktopElement = wm._desktop?.querySelector("scene_iconspace");
        if (!desktopElement) {
            this._isSettingUpDesktop = false;
            if (this._desktopSetupQueued) {
                this._desktopSetupQueued = false;
                setTimeout( () => this.setupDesktop(), 0);
            }
            return;
        }
        desktopElement.innerHTML = "";
        await dm.ready();
        if (!shell._currentUser) {
            this._isSettingUpDesktop = false;
            if (this._desktopSetupQueued) {
                this._desktopSetupQueued = false;
                setTimeout( () => this.setupDesktop(), 0);
            }
            return;
        }
        const showHiddenUserPref = localStorage.getItem(shell._currentUser ? `user_${shell._currentUser}.showHiddenContents` : 'showHiddenContents') === "true";
        const desktopPath = `C:/Documents and Settings/${shell._currentUser}/Desktop`;
        this.addDropHandlers(wm._desktop, desktopPath);
        let systemLocations = [{
            name: "My Computer",
            icon: "mycomputer.png",
            action: () => this.open(''),
            isSystem: true,
            pathId: 'MY_COMPUTER_VIRTUAL'
        }];
        systemLocations.forEach(loc => {
            const itemEl = this.itemTemplate.content.firstElementChild.cloneNode(true);
            itemEl.querySelector('icontitle').textContent = loc.name;
            itemEl.querySelector('img').src = `res/icons/${loc.icon}`;
            if (loc.isShortcut)
                itemEl.classList.add("shortcut");
            itemEl.addEventListener('dblclick', loc.action);
            itemEl.dataset.filePath = loc.pathId;
            itemEl.dataset.isSystem = "true";
            itemEl.dataset.itemType = 'folder';
            itemEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this._showItemContextMenu(e, loc.pathId, itemEl, true);
            }
            );
            desktopElement.appendChild(itemEl);
        }
        );
        const rbNode = {
            name: "Recycle Bin",
            action: () => this.open(DiskManager.RECYCLE_BIN_PATH),
            isSystem: true,
            pathId: 'RECYCLE_BIN_VIRTUAL'
        };
        const rbItemEl = this.itemTemplate.content.firstElementChild.cloneNode(true);
        rbItemEl.querySelector('icontitle').textContent = rbNode.name;
        this._recycleBinIconElement = rbItemEl.querySelector('img');
        await this.updateRecycleBinIconState();
        rbItemEl.addEventListener('dblclick', rbNode.action);
        rbItemEl.dataset.filePath = rbNode.pathId;
        rbItemEl.dataset.isSystem = "true";
        rbItemEl.dataset.itemType = 'folder';
        rbItemEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._showRecycleBinContextMenu(e, DiskManager.RECYCLE_BIN_PATH, rbItemEl, true);
        }
        );
        desktopElement.appendChild(rbItemEl);
        try {
            let desktopNodeOnVFS = await dm.open(desktopPath);
            if (!desktopNodeOnVFS || desktopNodeOnVFS.type !== 'folder') {
                try {
                    await dm.mkdir(desktopPath);
                    desktopNodeOnVFS = await dm.open(desktopPath);
                } catch (mkdirError) {
                    this._isSettingUpDesktop = false;
                    if (this._desktopSetupQueued) {
                        this._desktopSetupQueued = false;
                        setTimeout( () => this.setupDesktop(), 0);
                    }
                    return;
                }
            }
            if (!desktopNodeOnVFS) {
                this._isSettingUpDesktop = false;
                if (this._desktopSetupQueued) {
                    this._desktopSetupQueued = false;
                    setTimeout( () => this.setupDesktop(), 0);
                }
                return;
            }
            const showExtensions = localStorage.getItem(shell._currentUser ? `user_${shell._currentUser}.showFileExtensions` : 'showFileExtensions') === "true";
            const childNodesRaw = await dm.list(desktopPath);
            const childNodes = childNodesRaw.filter(node => {
                if (this.hiddenFiles.includes(node.name) && !showHiddenUserPref)
                    return false;
                if (node.metadata && node.metadata.hidden && !showHiddenUserPref)
                    return false;
                return true;
            }
            ).sort( (a, b) => (a.type === 'folder' && b.type !== 'folder') ? -1 : (a.type !== 'folder' && b.type === 'folder') ? 1 : a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            for (const node of childNodes) {
                const itemPath = node.id;
                const itemEl = this.itemTemplate.content.firstElementChild.cloneNode(true);
                itemEl.dataset.filePath = itemPath;
                itemEl.dataset.itemType = node.type;
                itemEl.dataset.isSystem = "false";
                const iconInfo = await ExplorerWindow.determineIconName(node, this._vfsIconObjectUrls);
                itemEl.querySelector('img').src = iconInfo.src;
                if (iconInfo.isVfsObjectUrl) {
                    itemEl.dataset.vfsIconUrl = iconInfo.src;
                    this._vfsIconObjectUrls.set(itemPath, iconInfo.src);
                }
                if (node.metadata && node.metadata.hidden && showHiddenUserPref) {
                    itemEl.style.opacity = "0.7";
                }
                let displayName = node.name;
                const ext = node.name.includes('.') ? node.name.substring(node.name.lastIndexOf('.') + 1).toLowerCase() : '';
                if (node.type === 'file' && !showExtensions && this.icons[ext]) {
                    const dotIdx = displayName.lastIndexOf('.');
                    if (dotIdx > 0)
                        displayName = displayName.substring(0, dotIdx);
                }
                itemEl.querySelector('icontitle').textContent = displayName;
                if (ext === 'lnk')
                    itemEl.classList.add("shortcut");
                itemEl.addEventListener('dblclick', async () => this._handleItemDoubleClick(itemPath, node.type, ext, itemEl, null, node));
                itemEl.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this._showItemContextMenu(e, itemPath, itemEl, true);
                }
                );
                ExplorerWindow.setupItemDragAndDrop(itemEl, itemPath, null);
                desktopElement.appendChild(itemEl);
            }
        } catch (error) {}
        this._isSettingUpDesktop = false;
        if (this._desktopSetupQueued) {
            this._desktopSetupQueued = false;
            setTimeout( () => this.setupDesktop(), 0);
        }
    }
    async updateRecycleBinIconState() {
        if (!this._recycleBinIconElement) {
            const desktopElement = wm._desktop?.querySelector("scene_iconspace");
            if (desktopElement) {
                const rbEl = Array.from(desktopElement.querySelectorAll('fsicon[data-is-system="true"]')).find(el => el.querySelector('icontitle')?.textContent === "Recycle Bin");
                if (rbEl)
                    this._recycleBinIconElement = rbEl.querySelector('img');
            }
            if (!this._recycleBinIconElement)
                return;
        }
        try {
            const status = await dm.getRecycleBinStatus();
            this._recycleBinIconElement.src = `res/icons/${status.isEmpty ? 'recycler empty.png' : 'recycler full.png'}`;
        } catch (e) {
            this._recycleBinIconElement.src = 'res/icons/recycler empty.png';
        }
    }
    _updateContextMenuPasteStates() {
        document.querySelectorAll('app.explorer').forEach(expApp => {
            const expWin = expApp.explorerWindowInstance;
            if (expWin?.window) {
                const activeCtxMenu = expWin.window.querySelector('contextmenu.visible');
                if (activeCtxMenu) {
                    const pasteItem = activeCtxMenu.querySelector('li[data-action="paste-clipboard"]');
                    if (pasteItem)
                        pasteItem.classList.toggle('disabled', !this.clipboard);
                }
            }
        }
        );
        const desktopCtxMenu = wm._desktop?.querySelector('scene_desktop > contextmenu.visible');
        if (desktopCtxMenu) {
            const pasteItem = desktopCtxMenu.querySelector('li[data-action="paste-clipboard"]');
            if (pasteItem)
                pasteItem.classList.toggle('disabled', !this.clipboard);
        }
    }
    _setupAppHandlers() {
        this.handlers = {};
        const genericExeRunner = async (filePath, windowReference, fileNode) => {
            await apps.load(filePath, {
                filePath: filePath,
                fileNode: fileNode
            });
        }
        ;
        this.handlers['exe'] = genericExeRunner;
        this.handlers['com'] = genericExeRunner;
        this.handlers['bat'] = genericExeRunner;
        this.handlers['zip'] = (filePath, windowRef, fileNode) => this._handleExtract(filePath, windowRef ? windowRef.pwd : null);
        this.handlers['lnk'] = async (filePath, windowReference, fileNode) => {
            const node = fileNode || await dm.open(filePath);
            if (!node || node.type !== 'file') {
                dialogHandler.spawnDialog({
                    title: "Error",
                    text: `Shortcut target "${dm.basename(filePath)}" not found or is not a file.`,
                    icon: "error",
                    buttons: [["OK", (e) => wm.closeWindow(e.target.closest("app").id)]]
                });
                return;
            }
            try {
                let contentStr = node.content;
                if (contentStr instanceof Blob)
                    contentStr = await contentStr.text();
                let targetToOpen = null
                  , parsedLinkData = null;
                try {
                    parsedLinkData = JSON.parse(contentStr);
                } catch (e) {}
                if (parsedLinkData?.action) {
                    eval(parsedLinkData.action);
                    return;
                } else if (parsedLinkData?.target)
                    targetToOpen = parsedLinkData.target;
                else if (typeof contentStr === 'string' && (contentStr.startsWith('C:/') || contentStr.startsWith('D:/') || contentStr.startsWith('E:/') || contentStr.startsWith('http:') || contentStr.startsWith('https:')))
                    targetToOpen = contentStr.trim();
                if (targetToOpen) {
                    const targetExt = targetToOpen.split('.').pop().toLowerCase();
                    const openInNewWindow = localStorage.getItem('openFoldersInNewWindow') === 'true';
                    const targetNodeData = await dm.open(targetToOpen).catch( () => null);
                    if (targetNodeData && targetNodeData.type === 'file' && (targetExt === 'exe' || targetExt === 'com' || targetExt === 'bat')) {
                        await apps.load(targetToOpen, {
                            filePath: targetToOpen,
                            fileNode: targetNodeData
                        });
                    } else if (targetNodeData && targetNodeData.type === 'file') {
                        this._handleItemDoubleClick(targetToOpen, targetNodeData.type, targetExt, null, windowReference, targetNodeData);
                    } else if (targetNodeData && targetNodeData.type === 'folder') {
                        if (openInNewWindow || !windowReference) {
                            this.open(targetToOpen);
                        } else if (windowReference?.navigate) {
                            windowReference.navigate(targetToOpen);
                        } else {
                            this.open(targetToOpen);
                        }
                    } else if (targetToOpen.startsWith('http:') || targetToOpen.startsWith('https:')) {
                        await apps.load('iexplore').then(app => {
                            if (app?.start)
                                app.start({
                                    contents: targetToOpen
                                });
                        }
                        );
                    } else {
                        throw new Error("LNK target is not a valid file, folder, or URL, or does not exist.");
                    }
                } else {
                    throw new Error("LNK content invalid or target not specified.");
                }
            } catch (e) {
                dialogHandler.spawnDialog({
                    title: "Error Opening Shortcut",
                    text: `Could not open shortcut: "${dm.basename(filePath)}". ${e.message}`,
                    icon: "error",
                    buttons: [["OK", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                });
            }
        }
        ;

        for (const ext in this.openWithDefinitions) {
            if (ext === '_unknown_' || this.handlers[ext])
                continue;
            const def = this.openWithDefinitions[ext];
            if (def.defaultApp) {
                this.handlers[ext] = async (filePath, windowReference, fileNode) => {
                    const defaultAppId = def.defaultApp;

                    // FIX: Handle special cases like themehandler BEFORE calling apps.load()
                    if (defaultAppId === 'themehandler') {
                        const node = fileNode || await dm.open(filePath);
                        if (!node || node.type !== 'file') {
                            dialogHandler.spawnDialog({
                                title: "Error",
                                text: `File "${dm.basename(filePath)}" not found.`,
                                icon: "error"
                            });
                            return;
                        }
                        try {
                            let contentStr = node.content instanceof Blob ? await node.content.text() : node.content;
                            const parsedContent = JSON.parse(contentStr);
                            if (parsedContent?.action) {
                                await themehandler.evalThemeFileAction(parsedContent.action, filePath);
                            } else {
                                dialogHandler.spawnDialog({
                                    title: "Error",
                                    text: `No action defined for "${dm.basename(filePath)}".`,
                                    icon: "error"
                                });
                            }
                        } catch (e) {
                            dialogHandler.spawnDialog({
                                title: "Error Applying Style/Theme",
                                text: `Could not apply "${dm.basename(filePath)}". ${e.message}`,
                                icon: "error"
                            });
                        }
                        return;
                        // IMPORTANT: Exit here for this special case.
                    }

                    // Default behavior for all other apps
                    const app = await apps.load(defaultAppId, {
                        filePath,
                        fileNode
                    });
                    if (!app)
                        return;

                    // Special logic for apps that ARE loaded but have unique behaviors (like Winamp)
                    if (defaultAppId === 'winamp') {
                        const fileExtension = filePath.split('.').pop().toLowerCase();
                        if (fileExtension === 'wsz') {
                            if (app.loadSkinById) {
                                const node = fileNode || await dm.open(filePath);
                                if (node && typeof node.content === 'string') {
                                    app.loadSkinById(node.content.trim());
                                } else {
                                    dialogHandler.spawnDialog({
                                        title: "Winamp Error",
                                        text: "Invalid skin file.",
                                        icon: "error"
                                    });
                                }
                            }
                        } else if (app.addVfsTracks) {
                            const node = fileNode || await dm.open(filePath);
                            if (node && node.content instanceof Blob) {
                                app.addVfsTracks([{
                                    blob: node.content,
                                    defaultName: node.name
                                }]);
                            } else {
                                dialogHandler.spawnDialog({
                                    title: "Winamp Error",
                                    text: "Could not read the audio file to play.",
                                    icon: "error"
                                });
                            }
                        }
                    } else {
                        // Generic start for all other apps
                        if (typeof app.start === 'function' && !app._handledNewDataInLoad) {
                            await app.start({
                                filePath: filePath,
                                fileNode: fileNode
                            });
                        }
                    }
                }
                ;
            }
        }

    }
    async _handleItemDoubleClick(itemPath, itemType, extension, itemElement, explorerWindowInstance=null, fileNode=null) {
        if (itemElement?.dataset.isSystem === "true")
            return;
        if (itemType === 'folder') {
            const openInNewWindowPrefKey = 'openFoldersInNewWindow';
            const openInNewWindow = localStorage.getItem(openInNewWindowPrefKey) === 'true';
            if (openInNewWindow) {
                this.open(itemPath);
            } else {
                if (explorerWindowInstance && typeof explorerWindowInstance.navigate === 'function') {
                    explorerWindowInstance.navigate(itemPath);
                } else {
                    this.open(itemPath);
                }
            }
        } else if (itemType === 'file') {
            const extLower = extension.toLowerCase();
            const nodeToPass = fileNode || await dm.open(itemPath);
            const dynamicAssocKey = `fileAssoc_${extLower}`;
            const associatedAppJson = localStorage.getItem(dynamicAssocKey);
            if (associatedAppJson) {
                try {
                    const assocInfo = JSON.parse(associatedAppJson);
                    if (assocInfo && assocInfo.exePath) {
                        await apps.load(assocInfo.exePath, {
                            filePath: itemPath,
                            fileNode: nodeToPass
                        });
                        return;
                    }
                } catch (e) {}
            }
            if (extLower === 'exe' || extLower === 'com' || extLower === 'bat') {
                if (this.handlers['exe'])
                    this.handlers['exe'](itemPath, explorerWindowInstance, nodeToPass);
                else
                    this._showOpenWithDialog(itemPath, extLower, nodeToPass);
            } else if (extLower === 'lnk') {
                if (this.handlers['lnk'])
                    this.handlers['lnk'](itemPath, explorerWindowInstance, nodeToPass);
                else
                    this._showOpenWithDialog(itemPath, extLower, nodeToPass);
            } else if (this.handlers[extLower]) {
                this.handlers[extLower](itemPath, explorerWindowInstance, nodeToPass);
            } else {
                this._showOpenWithDialog(itemPath, extLower, nodeToPass);
            }
        }
    }
    open(path='') {
        const expContent = this.template.content.firstElementChild.cloneNode(true);
        const expWin = new ExplorerWindow(expContent,this.itemTemplate,this,path);
        if (wm._windows[expWin.hWnd])
            wm._windows[expWin.hWnd].explorerWindowInstance = expWin;
        return expWin;
    }
    _setClipboard(path, operation='copy') {
        this.clipboard = {
            path,
            operation,
            name: dm.basename(path)
        };
        document.dispatchEvent(new CustomEvent('clipboardUpdated',{
            detail: this.clipboard
        }));
    }
    async _handlePaste(destinationDir, callingInstance) {
        if (!this.clipboard?.path)
            return;
        const sourcePath = this.clipboard.path
          , operation = this.clipboard.operation;
        const showLoading = (msg) => callingInstance?.showLoadingOverlay?.(msg);
        const hideLoading = () => callingInstance?.hideLoadingOverlay?.();
        showLoading(`Pasting "${this.clipboard.name}"...`);
        try {
            if (operation === 'copy')
                await dm.copy(sourcePath, destinationDir);
            else if (operation === 'cut') {
                await dm.move(sourcePath, destinationDir);
                this.clipboard = null;
                document.dispatchEvent(new CustomEvent('clipboardUpdated',{
                    detail: null
                }));
            }
        } catch (e) {
            dialogHandler.spawnDialog({
                title: "Paste Error",
                text: e.message,
                icon: "error",
                buttons: [["OK", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
            });
        } finally {
            hideLoading();
        }
    }
    async _uploadFiles(files, contextPath, callingInstance) {
        if (!files || files.length === 0)
            return;
        const showLoading = (msg) => callingInstance?.showLoadingOverlay?.(msg);
        const hideLoading = () => callingInstance?.hideLoadingOverlay?.();
        showLoading(`Uploading ${files.length} item(s)...`);
        for (const file of files) {
            let targetName = file.name
              , counter = 1
              , finalPath = dm.join(contextPath, targetName);
            while (await dm.open(finalPath)) {
                const ext_val = targetName.includes('.') ? targetName.substring(targetName.lastIndexOf('.')) : '';
                const base = targetName.includes('.') ? targetName.substring(0, targetName.lastIndexOf('.')) : targetName;
                targetName = `${base} (${counter})${ext_val}`;
                finalPath = dm.join(contextPath, targetName);
                counter++;
            }
            try {
                await dm.writeFile(finalPath, file);
            } catch (uploadErr) {
                dialogHandler.spawnDialog({
                    icon: "error",
                    text: `Could not upload ${file.name}: ${uploadErr.message}`,
                    title: "Upload Error"
                });
            }
        }
        hideLoading();
    }
    async _handleNewItem(action, contextPath, callingInstance) {
        const showLoading = (msg) => callingInstance?.showLoadingOverlay?.(msg);
        const hideLoading = () => callingInstance?.hideLoadingOverlay?.();
        try {
            let newNameBase, newExt, defContent, isUpload = false;
            switch (action) {
            case 'new-folder':
                newNameBase = "New Folder";
                newExt = "";
                defContent = null;
                break;
            case 'new-txt':
                newNameBase = "New Text Document";
                newExt = ".txt";
                defContent = "";
                break;
            case 'new-bmp':
                newNameBase = "New Bitmap Image";
                newExt = ".bmp";
                defContent = new Blob([],{
                    type: "image/bmp"
                });
                break;
            case 'upload-computer':
                isUpload = true;
                break;
            default:
                return;
            }
            if (isUpload) {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.onchange = (e) => {
                    this._uploadFiles(e.target.files, contextPath, callingInstance);
                }
                ;
                input.click();
            } else {
                let finalName = newNameBase + newExt
                  , counter = 1
                  , fullPath = dm.join(contextPath, finalName);
                while (await dm.open(fullPath)) {
                    finalName = `${newNameBase} (${counter})${newExt}`;
                    fullPath = dm.join(contextPath, finalName);
                    counter++;
                }
                showLoading(`Creating "${finalName}"...`);
                if (action === 'new-folder')
                    await dm.mkdir(fullPath);
                else
                    await dm.writeFile(fullPath, defContent);
                hideLoading();
                const isDesktop = !callingInstance && contextPath.startsWith(`C:/Documents and Settings/${shell._currentUser}/Desktop`);
                setTimeout( () => {
                    const itemsCont = isDesktop ? wm._desktop.querySelector("scene_iconspace") : callingInstance.window.querySelector('items');
                    const newItemEl = Array.from(itemsCont.querySelectorAll('fsicon')).find(el => el.dataset.filePath === fullPath);
                    if (newItemEl)
                        this._initiateRename(newItemEl, fullPath, isDesktop);
                }
                , 250);
            }
        } catch (err) {
            hideLoading();
            dialogHandler.spawnDialog({
                icon: "error",
                text: `Could not create item: ${err.message}`,
                title: "Error"
            });
        }
    }
    async _initiateRename(itemElement, itemPath, isDesktop=false) {
        const iconTitle = itemElement.querySelector('icontitle')
          , origDisplayTitle = iconTitle.textContent
          , actualFullName = dm.basename(itemPath);
        iconTitle.contentEditable = true;
        iconTitle.textContent = actualFullName;
        iconTitle.focus();
        const sel = window.getSelection()
          , range = document.createRange();
        let endOffset = actualFullName.length;
        const showExtensions = localStorage.getItem(shell._currentUser ? `user_${shell._currentUser}.showFileExtensions` : 'showFileExtensions') === 'true';
        if (!showExtensions && actualFullName.includes('.')) {
            const dotIdx = actualFullName.lastIndexOf('.');
            if (dotIdx > 0)
                endOffset = dotIdx;
        }
        try {
            range.setStart(iconTitle.firstChild || iconTitle, 0);
            range.setEnd(iconTitle.firstChild || iconTitle, endOffset);
        } catch (e) {
            range.selectNodeContents(iconTitle);
        }
        sel.removeAllRanges();
        sel.addRange(range);
        const onEndRename = async (event) => {
            if (event.type === 'blur' || (event.type === 'keydown' && event.key === 'Enter')) {
                event.preventDefault();
                iconTitle.contentEditable = false;
                const newFullName = iconTitle.textContent.trim();
                iconTitle.removeEventListener('blur', onEndRename);
                iconTitle.removeEventListener('keydown', onEndRename);
                if (newFullName && newFullName !== actualFullName) {
                    try {
                        await dm.rename(itemPath, newFullName);
                    } catch (e) {
                        iconTitle.textContent = origDisplayTitle;
                        dialogHandler.spawnDialog({
                            title: "Rename Error",
                            text: e.message,
                            icon: "error",
                            buttons: [["OK", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                        });
                    }
                } else
                    iconTitle.textContent = origDisplayTitle;
            } else if (event.type === 'keydown' && event.key === 'Escape') {
                event.preventDefault();
                iconTitle.contentEditable = false;
                iconTitle.textContent = origDisplayTitle;
                iconTitle.removeEventListener('blur', onEndRename);
                iconTitle.removeEventListener('keydown', onEndRename);
            }
        }
        ;
        iconTitle.addEventListener('blur', onEndRename);
        iconTitle.addEventListener('keydown', onEndRename);
    }
    async _handleDelete(itemPath, callingInstance) {
        if (itemPath.endsWith("_VIRTUAL")) {
            dialogHandler.spawnDialog({
                title: "Error",
                text: "System items cannot be moved to the Recycle Bin.",
                icon: "error",
                buttons: [["OK", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
            });
            return;
        }
        dialogHandler.spawnDialog({
            title: "Confirm File Delete",
            text: `Are you sure you want to send "${dm.basename(itemPath)}" to the Recycle Bin?`,
            icon: "question",
            buttons: [["Yes", async (eDlg) => {
                wm.closeWindow(eDlg.target.closest("app").id);
                const showLoading = (msg) => callingInstance?.showLoadingOverlay?.(msg);
                const hideLoading = () => callingInstance?.hideLoadingOverlay?.();
                showLoading(`Sending "${dm.basename(itemPath)}" to Recycle Bin...`);
                try {
                    await dm.delete(itemPath);
                } catch (err) {
                    dialogHandler.spawnDialog({
                        title: "Error",
                        text: err.message,
                        icon: "error",
                        buttons: [["OK", (eDlgDel) => wm.closeWindow(eDlgDel.target.closest("app").id)]]
                    });
                } finally {
                    hideLoading();
                }
            }
            ], ["No", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
        });
    }
    async _showOpenWithDialog(filePath, extension, fileNode=null) {
        const openWithDialogNode = document.createElement("template");
        openWithDialogNode.innerHTML = this.openWithDialogTemplate;
        const dialogContent = openWithDialogNode.content.firstElementChild.cloneNode(true);
        const fileNameSpan = dialogContent.querySelector("#ow-filename");
        const fileIconImg = dialogContent.querySelector(".ow-file-icon");
        const recommendedUl = dialogContent.querySelector("#ow-recommended-programs");
        const otherUl = dialogContent.querySelector("#ow-other-programs");
        const okBtn = dialogContent.querySelector("#ow-ok-btn");
        const cancelBtn = dialogContent.querySelector("#ow-cancel-btn");
        const lookOnWebLink = dialogContent.querySelector("#ow-look-on-web");
        const actualFileNode = fileNode || await dm.open(filePath);
        fileNameSpan.textContent = actualFileNode ? actualFileNode.name : dm.basename(filePath);
        if (actualFileNode) {
            const iconInfo = await ExplorerWindow.determineIconName(actualFileNode, this._vfsIconObjectUrls);
            fileIconImg.src = iconInfo.src;
            if (iconInfo.isVfsObjectUrl)
                this._vfsIconObjectUrls.set(filePath + "_ow_dialog", iconInfo.src);
        } else {
            fileIconImg.src = `res/icons/default.png`;
        }
        let selectedProgramId = null;
        const extLower = (extension || "").toLowerCase();
        const definition = this.openWithDefinitions[extLower] || this.openWithDefinitions['_unknown_'];
        const recommendedAppIds = definition.recommended || [];
        let otherAppIds = definition.other || [];
        if (otherAppIds.length === 0 && definition !== this.openWithDefinitions['_unknown_']) {
            otherAppIds = Object.keys(this.appDisplayInfo).filter(appId => !recommendedAppIds.includes(appId));
        } else if (definition === this.openWithDefinitions['_unknown_']) {
            otherAppIds = Object.keys(this.appDisplayInfo).filter(appId => !recommendedAppIds.includes(appId));
        }
        const createProgramListItem = (appId) => {
            const appInfo = this.appDisplayInfo[appId];
            if (!appInfo)
                return null;
            const li = document.createElement('li');
            li.style.cssText = "display: flex; align-items: center; padding: 3px 5px; cursor: default; user-select: none; border: 1px solid transparent;";
            const img = document.createElement('img');
            img.src = `res/icons/${appInfo.icon}`;
            img.alt = "";
            img.style.cssText = "width: 16px; height: 16px; margin-right: 5px; object-fit: contain;";
            const span = document.createElement('span');
            span.textContent = appInfo.name;
            li.appendChild(img);
            li.appendChild(span);
            li.dataset.appId = appId;
            li.onclick = () => {
                dialogContent.querySelectorAll('.ow-program-list-box-inline li.selected').forEach(el => {
                    el.classList.remove('selected');
                    el.style.backgroundColor = '';
                    el.style.color = '';
                    el.style.borderColor = 'transparent';
                    const childImg = el.querySelector('img');
                    if (childImg)
                        childImg.style.filter = '';
                }
                );
                li.classList.add('selected');
                li.style.backgroundColor = 'var(--selected-bg, #316AC5)';
                li.style.color = 'var(--selected-text, white)';
                li.style.borderColor = 'var(--selected-border, #000080)';
                img.style.filter = 'brightness(0) invert(1)';
                selectedProgramId = appId;
                okBtn.classList.remove('disabled');
            }
            ;
            li.ondblclick = () => {
                selectedProgramId = appId;
                okBtn.click();
            }
            ;
            li.onmouseover = () => {
                if (!li.classList.contains('selected')) {
                    li.style.backgroundColor = 'var(--hover-bg, #B5D5FF)';
                    li.style.borderColor = 'var(--hover-border, #316AC5)';
                }
            }
            ;
            li.onmouseout = () => {
                if (!li.classList.contains('selected')) {
                    li.style.backgroundColor = 'transparent';
                    li.style.borderColor = 'transparent';
                }
            }
            ;
            return li;
        }
        ;
        recommendedAppIds.forEach(appId => {
            const li = createProgramListItem(appId);
            if (li)
                recommendedUl.appendChild(li);
        }
        );
        otherAppIds.forEach(appId => {
            const li = createProgramListItem(appId);
            if (li)
                otherUl.appendChild(li);
        }
        );
        const dialogHWnd = wm.createNewWindow("openWithDialog", dialogContent, {
            skipIteratedPosition: true,
            noTaskbarButton: true
        });
        wm.setCaption(dialogHWnd, "Open With");
        wm.setSize(dialogHWnd, 380, 'auto');
        wm.setDialog(dialogHWnd);
        wm.removeIcon(dialogHWnd);
        const dialogWindow = wm._windows[dialogHWnd];
        if (dialogWindow) {
            dialogWindow.addEventListener('wm:windowClosed', () => {
                const owDialogIconUrl = this._vfsIconObjectUrls.get(filePath + "_ow_dialog");
                if (owDialogIconUrl) {
                    URL.revokeObjectURL(owDialogIconUrl);
                    this._vfsIconObjectUrls.delete(filePath + "_ow_dialog");
                }
            }
            , {
                once: true
            });
        }
        okBtn.onclick = async () => {
            if (selectedProgramId) {
                await apps.load(selectedProgramId, {
                    filePath: filePath,
                    fileNode: actualFileNode
                }).then(app => {
                    if (app && typeof app.start === 'function' && !app._handledNewDataInLoad)
                        app.start({
                            filePath: filePath,
                            fileNode: actualFileNode
                        });
                }
                );
                wm.closeWindow(dialogHWnd);
            }
        }
        ;
        cancelBtn.onclick = () => wm.closeWindow(dialogHWnd);
        lookOnWebLink.onclick = (e) => {
            e.preventDefault();
            apps.load('iexplore').then(app => {
                if (app?.start)
                    app.start({
                        contents: `https://www.google.com/search?q=open+${extension}+file+online`
                    });
            }
            );
        }
        ;
    }
    async _showItemContextMenu(event, itemPath, itemElement, isDesktop=false) {
        wm._desktop.querySelectorAll("contextmenu.visible:not(.taskbar-menu)").forEach(cm => cm.remove());
        const menu = document.createElement('contextmenu');
        menu.classList.add('visible');
        const ul = document.createElement('ul');
        const nodeType = itemElement.dataset.itemType
          , isSystemItem = itemElement.dataset.isSystem === "true";
        const callingInstance = isDesktop ? null : itemElement.closest('app.explorer')?.explorerWindowInstance;
        const isInRecycleBin = !isDesktop && callingInstance && callingInstance.pwd === DiskManager.RECYCLE_BIN_PATH;
        const ext = nodeType === 'file' ? dm.basename(itemPath).split('.').pop().toLowerCase() : '';
        const isImageFile = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext);
        let items;
        const fileNode = nodeType === 'file' ? (await dm.open(itemPath)) : null;
        if (isInRecycleBin) {
            items = [{
                label: 'Restore',
                action: async () => {
                    if (callingInstance)
                        callingInstance.showLoadingOverlay(`Restoring "${dm.basename(itemPath)}"...`);
                    try {
                        await dm.restoreFromRecycleBin(itemPath);
                    } catch (e) {
                        dialogHandler.spawnDialog({
                            title: "Restore Error",
                            text: e.message,
                            icon: "error",
                            buttons: [["OK", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                        });
                    } finally {
                        if (callingInstance)
                            callingInstance.hideLoadingOverlay();
                    }
                }
                ,
                default: true
            }, {
                type: 'divider'
            }, {
                label: 'Cut',
                action: () => this._setClipboard(itemPath, 'cut'),
                disabled: true
            }, {
                label: 'Copy',
                action: () => this._setClipboard(itemPath, 'copy'),
                disabled: true
            }, {
                type: 'divider'
            }, {
                label: 'Delete',
                action: () => dialogHandler.spawnDialog({
                    title: "Confirm File Delete",
                    text: `Are you sure you want to permanently delete "${dm.basename(itemPath)}"?`,
                    icon: "question",
                    buttons: [["Yes", async (eDlg) => {
                        wm.closeWindow(eDlg.target.closest("app").id);
                        if (callingInstance)
                            callingInstance.showLoadingOverlay(`Deleting "${dm.basename(itemPath)}"...`);
                        try {
                            await dm.permanentDelete(itemPath);
                        } catch (err) {
                            dialogHandler.spawnDialog({
                                title: "Delete Error",
                                text: err.message,
                                icon: "error",
                                buttons: [["OK", (eDlgDel) => wm.closeWindow(eDlgDel.target.closest("app").id)]]
                            });
                        } finally {
                            if (callingInstance)
                                callingInstance.hideLoadingOverlay();
                        }
                    }
                    ], ["No", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                })
            }, {
                label: 'Rename',
                action: () => {}
                ,
                disabled: true
            }, {
                type: 'divider'
            }, {
                label: 'Properties',
                action: async () => {
                    const node = await dm.open(itemPath);
                    if (node?.metadata?.originalPath)
                        dialogHandler.spawnDialog({
                            title: `${node.name} Properties`,
                            text: `Original Location: ${node.metadata.originalPath}<br>Date Deleted: ${new Date(node.metadata.recycledAt || 0).toLocaleString()}<br>Type: ${node.type}`,
                            icon: "info",
                            buttons: [["OK", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                        });
                    else
                        this._showProperties(itemPath);
                }
            }, ];
        } else {
            if (isSystemItem && itemPath === 'RECYCLE_BIN_VIRTUAL') {
                this._showRecycleBinContextMenu(event, DiskManager.RECYCLE_BIN_PATH, itemElement, isDesktop);
                return;
            }
            let openWithSubItems = [];
            let sendToSubItems = [];
            if (nodeType === 'file') {
                const definition = this.openWithDefinitions[ext] || this.openWithDefinitions['_unknown_'];
                const recommendedAppIds = definition.recommended || [];
                recommendedAppIds.forEach(appId => {
                    if (this.appDisplayInfo[appId]) {
                        const isDefaultOpenerForThisExtension = (definition.defaultApp === appId);
                        let actionHandler;
                        if (appId === 'winamp') {
                            actionHandler = async () => {
                                const winampApp = await apps.load('winamp');
                                if (winampApp && typeof winampApp.addVfsTracks === 'function') {
                                    if (fileNode && fileNode.content instanceof Blob) {
                                        winampApp.start({
                                            vfsTracks: [{
                                                blob: fileNode.content,
                                                defaultName: fileNode.name
                                            }]
                                        });
                                    } else {
                                        dialogHandler.spawnDialog({
                                            title: "Winamp Error",
                                            text: "Could not read the audio file to play.",
                                            icon: "error"
                                        });
                                    }
                                }
                            }
                            ;
                        } else {
                            actionHandler = async () => {
                                await apps.load(appId, {
                                    filePath: itemPath,
                                    fileNode: fileNode
                                }).then(app => {
                                    if (app && typeof app.start === 'function' && !app._handledNewDataInLoad) {
                                        app.start({
                                            filePath: itemPath,
                                            fileNode: fileNode
                                        });
                                    }
                                }
                                );
                            }
                            ;
                        }
                        openWithSubItems.push({
                            label: this.appDisplayInfo[appId].name,
                            action: actionHandler,
                            default: isDefaultOpenerForThisExtension
                        });
                    }
                }
                );
                if (openWithSubItems.length > 0)
                    openWithSubItems.push({
                        type: 'divider'
                    });
                openWithSubItems.push({
                    label: 'Choose Program...',
                    action: () => this._showOpenWithDialog(itemPath, ext, fileNode)
                });
            }
            if (ext === 'zip') {
                items = [{
                    label: 'Extract All...',
                    action: () => this._handleExtract(itemPath, isDesktop ? `C:/Documents and Settings/${shell._currentUser}/Desktop` : callingInstance.pwd),
                    default: true
                }, {
                    type: 'divider'
                }];
            } else {
                items = [{
                    label: 'Open',
                    action: () => this._handleItemDoubleClick(itemPath, nodeType, ext, itemElement, callingInstance, fileNode),
                    default: true
                }];
            }
            if (nodeType === 'file' && openWithSubItems.length > 0)
                items.push({
                    label: 'Open With',
                    submenu: openWithSubItems,
                    isSubmenuHolder: true
                });
            if (nodeType === 'folder' && !isSystemItem)
                items.push({
                    label: 'Explore',
                    action: () => this.open(itemPath)
                });
            sendToSubItems.push({
                label: 'Compressed (zipped) Folder',
                action: () => this._handleCompress(itemPath, isDesktop ? `C:/Documents and Settings/${shell._currentUser}/Desktop` : callingInstance.pwd)
            });
            sendToSubItems.push({
                label: 'Local Computer (Download)',
                action: () => this._handleDownload(itemPath)
            });
            items.push({
                label: 'Send To',
                submenu: sendToSubItems,
                isSubmenuHolder: true
            });
            if (isImageFile && !isSystemItem && nodeType === 'file') {
                items.push({
                    type: 'divider'
                });
                items.push({
                    label: 'Set as Desktop Background',
                    action: async () => {
                        if (!shell._currentUser)
                            return;
                        const userPrefix = `user_${shell._currentUser}`;
                        localStorage.setItem(`${userPrefix}.customWallpaperPath`, itemPath);
                        localStorage.setItem(`${userPrefix}.userWallpaper`, itemPath);
                        localStorage.setItem(`${userPrefix}.userWallpaperMode`, 'stretch');
                        const bgColor = localStorage.getItem(`${userPrefix}.desktopBgColor`) || getComputedStyle(document.documentElement).getPropertyValue('--desktop').trim();
                        await themehandler.changeWallpaper(itemPath, 'stretch', bgColor);
                    }
                });
            }
            items.push({
                type: 'divider'
            });
            items.push(...[{
                label: 'Cut',
                action: () => this._setClipboard(itemPath, 'cut'),
                disabled: isSystemItem
            }, {
                label: 'Copy',
                action: () => this._setClipboard(itemPath, 'copy'),
                disabled: isSystemItem
            }, {
                type: 'divider'
            }, {
                label: 'Delete',
                action: () => this._handleDelete(itemPath, callingInstance),
                disabled: isSystemItem
            }, {
                label: 'Rename',
                action: () => this._initiateRename(itemElement, itemPath, isDesktop),
                disabled: isSystemItem
            }, {
                type: 'divider'
            }, {
                label: 'Properties',
                action: () => this._showProperties(itemPath)
            }]);
            items = items.filter(Boolean);
        }
        items.forEach(itemConf => this._addMenuItemToUl(ul, itemConf, menu, callingInstance));
        menu.appendChild(ul);
        const hostElement = isDesktop ? wm._desktop : callingInstance.window;
        hostElement.appendChild(menu);
        this._positionContextMenu(event, menu, hostElement);
    }
    _showRecycleBinContextMenu(event, itemPathActual, itemElement, isDesktop=false) {
        wm._desktop.querySelectorAll("contextmenu.visible:not(.taskbar-menu)").forEach(cm => cm.remove());
        const menu = document.createElement('contextmenu');
        menu.classList.add('visible');
        const ul = document.createElement('ul');
        const items = [{
            label: 'Open',
            action: () => this.open(itemPathActual),
            default: true
        }, {
            label: 'Explore',
            action: () => this.open(itemPathActual)
        }, {
            type: 'divider'
        }, {
            label: 'Empty Recycle Bin',
            action: async () => {
                const status = await dm.getRecycleBinStatus();
                if (status.isEmpty) {
                    dialogHandler.spawnDialog({
                        title: "Recycle Bin",
                        text: "The Recycle Bin is already empty.",
                        icon: "info",
                        buttons: [["OK", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                    });
                    return;
                }
                dialogHandler.spawnDialog({
                    title: "Confirm Action",
                    text: `Are you sure you want to permanently delete all ${status.count} item(s) in the Recycle Bin?`,
                    icon: "question",
                    buttons: [["Yes", async (eDlg) => {
                        wm.closeWindow(eDlg.target.closest("app").id);
                        try {
                            const recycledItems = await dm.list(itemPathActual);
                            for (const item of recycledItems)
                                await dm.permanentDelete(item.id);
                        } catch (err) {
                            dialogHandler.spawnDialog({
                                title: "Error",
                                text: `Could not empty Recycle Bin: ${err.message}`,
                                icon: "error",
                                buttons: [["OK", (eDlgErr) => wm.closeWindow(eDlgErr.target.closest("app").id)]]
                            });
                        }
                    }
                    ], ["No", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                });
            }
        }, {
            type: 'divider'
        }, {
            label: 'Properties',
            action: () => this._showProperties('RECYCLE_BIN_VIRTUAL')
        }, ];
        items.forEach(itemConf => this._addMenuItemToUl(ul, itemConf, menu, null));
        menu.appendChild(ul);
        const hostElement = wm._desktop;
        hostElement.appendChild(menu);
        this._positionContextMenu(event, menu, hostElement);
    }
    async _showFolderBackgroundContextMenu(event, folderPath, callingInstance) {
        wm._desktop.querySelectorAll("contextmenu.visible:not(.taskbar-menu)").forEach(cm => cm.remove());
        const menu = document.createElement('contextmenu');
        menu.classList.add('visible');
        const ul = document.createElement('ul');
        const isRecycleBinView = callingInstance && callingInstance.pwd === DiskManager.RECYCLE_BIN_PATH;
        let items;
        if (isRecycleBinView) {
            items = [{
                label: 'Empty Recycle Bin',
                action: async () => {
                    const status = await dm.getRecycleBinStatus();
                    if (status.isEmpty) {
                        dialogHandler.spawnDialog({
                            title: "Recycle Bin",
                            text: "The Recycle Bin is already empty.",
                            icon: "info",
                            buttons: [["OK", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                        });
                        return;
                    }
                    dialogHandler.spawnDialog({
                        title: "Confirm Action",
                        text: `Are you sure you want to permanently delete all ${status.count} item(s) in the Recycle Bin?`,
                        icon: "question",
                        buttons: [["Yes", async (eDlg) => {
                            wm.closeWindow(eDlg.target.closest("app").id);
                            if (callingInstance)
                                callingInstance.showLoadingOverlay("Emptying Recycle Bin...");
                            try {
                                const recycledItems = await dm.list(DiskManager.RECYCLE_BIN_PATH);
                                for (const item of recycledItems)
                                    await dm.permanentDelete(item.id);
                            } catch (err) {
                                dialogHandler.spawnDialog({
                                    title: "Error",
                                    text: `Could not empty Recycle Bin: ${err.message}`,
                                    icon: "error",
                                    buttons: [["OK", (eDlgErr) => wm.closeWindow(eDlgErr.target.closest("app").id)]]
                                });
                            } finally {
                                if (callingInstance)
                                    callingInstance.hideLoadingOverlay();
                            }
                        }
                        ], ["No", (eDlg) => wm.closeWindow(eDlg.target.closest("app").id)]]
                    });
                }
            }, {
                type: 'divider'
            }, {
                label: 'Refresh',
                action: () => callingInstance ? callingInstance.reload() : this.setupDesktop()
            }, {
                type: 'divider'
            }, {
                label: 'Paste',
                action: () => {}
                ,
                disabled: true
            }, {
                type: 'divider'
            }, {
                label: 'New',
                submenu: [],
                isSubmenuHolder: true,
                disabled: true
            }, {
                type: 'divider'
            }, {
                label: 'Properties',
                action: () => this._showProperties(DiskManager.RECYCLE_BIN_PATH)
            }, ];
        } else {
            const sendToSubItems = [{
                label: 'Compressed (zipped) Folder',
                action: () => this._handleCompress(folderPath, folderPath)
            }, {
                label: 'Local Computer (Download)',
                action: () => this._handleDownload(folderPath)
            }];
            const newSubItems = [{
                label: 'Folder',
                action: () => this._handleNewItem('new-folder', folderPath, callingInstance)
            }, {
                label: 'Text Document',
                action: () => this._handleNewItem('new-txt', folderPath, callingInstance)
            }, {
                label: 'Bitmap Image',
                action: () => this._handleNewItem('new-bmp', folderPath, callingInstance)
            }, {
                type: 'divider'
            }, {
                label: 'Upload from Computer...',
                action: () => this._handleNewItem('upload-computer', folderPath, callingInstance)
            }];
            items = [{
                label: 'Refresh',
                action: () => callingInstance ? callingInstance.reload() : this.setupDesktop()
            }, {
                type: 'divider'
            }, {
                label: 'Paste',
                action: () => this._handlePaste(folderPath, callingInstance),
                disabled: !this.clipboard,
                id: 'contextmenu-paste-item'
            }, {
                type: 'divider'
            }, {
                label: 'New',
                submenu: newSubItems,
                isSubmenuHolder: true
            }, {
                label: 'Send To',
                submenu: sendToSubItems,
                isSubmenuHolder: true
            }, {
                type: 'divider'
            }, {
                label: 'Properties',
                action: () => this._showProperties(folderPath)
            }, ];
        }
        items.forEach(itemConf => this._addMenuItemToUl(ul, itemConf, menu, callingInstance));
        menu.appendChild(ul);
        const hostElement = callingInstance ? callingInstance.window : wm._desktop;
        hostElement.appendChild(menu);
        this._positionContextMenu(event, menu, hostElement);
        if (!isRecycleBinView)
            this._updateContextMenuPasteStates();
    }
    _addMenuItemToUl(ul, itemConfig, contextMenuElement, callingInstance) {
        if (!itemConfig)
            return;
        const li = document.createElement('li');
        if (itemConfig.type === 'divider')
            li.className = 'divider';
        else {
            let spanHtml = itemConfig.label;
            if (itemConfig.default)
                spanHtml = `<strong>${itemConfig.label}</strong>`;
            li.innerHTML = `<span>${spanHtml}</span>`;
            if (itemConfig.id)
                li.id = itemConfig.id;
            if (itemConfig.disabled)
                li.classList.add('disabled');
            if (itemConfig.isSubmenuHolder) {
                li.classList.add('submenuholder');
                const subUl = document.createElement('ul');
                subUl.className = 'submenu';
                itemConfig.submenu.forEach(subItemConfig => this._addMenuItemToUl(subUl, subItemConfig, contextMenuElement, callingInstance));
                li.appendChild(subUl);
            } else if (!itemConfig.disabled && itemConfig.action) {
                li.onclick = () => {
                    contextMenuElement.remove();
                    itemConfig.action();
                }
                ;
            }
        }
        ul.appendChild(li);
    }
    _positionContextMenu(event, menuElement, hostElement) {
        const isTaskbarRelated = hostElement.closest('taskbar') || hostElement.matches('taskbar') || hostElement.matches('startbtn');
        const wasHidden = menuElement.style.display === 'none' || !menuElement.parentElement;
        if (wasHidden) {
            document.body.appendChild(menuElement);
            menuElement.style.visibility = 'hidden';
            menuElement.style.display = 'block';
        }
        const menuRect = menuElement.getBoundingClientRect();
        if (wasHidden) {
            menuElement.remove();
            menuElement.style.display = 'none';
            menuElement.style.visibility = '';
        }
        hostElement.appendChild(menuElement);
        menuElement.style.display = 'block';
        const hostRect = hostElement.getBoundingClientRect()
          , vpWidth = window.innerWidth
          , vpHeight = window.innerHeight;
        let x = event.clientX - hostRect.left
          , y = event.clientY - hostRect.top;
        if (event.clientX + menuRect.width > vpWidth)
            x = (event.clientX - hostRect.left) - menuRect.width;
        if (hostRect.left + x < 0)
            x = -hostRect.left;
        if (x + menuRect.width > vpWidth && x > 0)
            x = vpWidth - menuRect.width - hostRect.left;
        if (x < 0)
            x = 0;
        if (isTaskbarRelated) {
            y = (event.clientY - hostRect.top) - menuRect.height;
            if (hostRect.top + y < 0) {
                y = 0;
                if (hostRect.top + menuRect.height > vpHeight)
                    y = vpHeight - hostRect.top - menuRect.height;
            }
        } else {
            if (event.clientY + menuRect.height > vpHeight)
                y = (event.clientY - hostRect.top) - menuRect.height;
            if (hostRect.top + y < 0) {
                y = -hostRect.top;
                if (y + menuRect.height > vpHeight)
                    y = vpHeight - menuRect.height - hostRect.top;
            }
        }
        let finalX = Math.max(0, Math.min(x, hostRect.width - menuRect.width > 0 ? hostRect.width - menuRect.width : 0));
        let finalY = Math.max(0, Math.min(y, hostRect.height - menuRect.height > 0 ? hostRect.height - menuRect.height : 0));
        menuElement.style.left = `${finalX}px`;
        menuElement.style.top = `${finalY}px`;
        const finalGlobalRect = menuElement.getBoundingClientRect();
        if (finalGlobalRect.right > vpWidth)
            menuElement.style.left = `${parseFloat(menuElement.style.left) - (finalGlobalRect.right - vpWidth)}px`;
        if (finalGlobalRect.left < 0)
            menuElement.style.left = `${parseFloat(menuElement.style.left) - finalGlobalRect.left}px`;
        if (finalGlobalRect.bottom > vpHeight) {
            if (isTaskbarRelated || y > (event.clientY - hostRect.top) - menuRect.height)
                menuElement.style.top = `${parseFloat(menuElement.style.top) - (finalGlobalRect.bottom - vpHeight)}px`;
        }
        if (finalGlobalRect.top < 0)
            menuElement.style.top = `${parseFloat(menuElement.style.top) - finalGlobalRect.top}px`;
        const closeMenuHandler = (clickEvent) => {
            if (!menuElement.contains(clickEvent.target)) {
                menuElement.remove();
                document.removeEventListener('click', closeMenuHandler, true);
                document.removeEventListener('contextmenu', closeMenuHandler, true);
            }
        }
        ;
        setTimeout( () => {
            document.addEventListener('click', closeMenuHandler, true);
            document.addEventListener('contextmenu', closeMenuHandler, true);
        }
        , 0);
    }
    async _showProperties(itemPath) {
        if (itemPath === 'MY_COMPUTER_VIRTUAL') {
            apps.load('systemprops').then(app => {
                if (app)
                    app.start();
            }
            );
            return;
        }
        if (itemPath === 'RECYCLE_BIN_VIRTUAL') {
            const status = await dm.getRecycleBinStatus();
            let dialogText = `<div style="padding:15px; font-family: Tahoma, sans-serif; font-size: 11px;"><p><strong>Name:</strong> Recycle Bin</p><p><strong>Type:</strong> System Folder</p><p><strong>Total items:</strong> ${status.count}</p><p>Recycles files and folders you delete.</p></div>`;
            const propsContentEl = document.createElement('div');
            propsContentEl.innerHTML = dialogText;
            const propsHWnd = wm.createNewWindow('properties', propsContentEl);
            wm.setCaption(propsHWnd, "Recycle Bin Properties");
            wm.setIcon(propsHWnd, status.isEmpty ? 'recycler empty.png' : 'recycler full.png');
            wm.setSize(propsHWnd, 300, 'auto');
            wm.setDialog(propsHWnd);
            return;
        }
        if (itemPath?.endsWith('_VIRTUAL')) {
            const itemName = dm.basename(itemPath).replace('_VIRTUAL', '').replace(/_/g, ' ');
            dialogHandler.spawnDialog({
                title: itemName,
                text: `Type: System Object\nLocation: System`,
                icon: "info",
                buttons: [["OK", (e) => wm.closeWindow(e.target.closest("app").id)]]
            });
            return;
        }
        await dm.ready();
        const node = await dm.open(itemPath);
        if (!node) {
            dialogHandler.spawnDialog({
                title: "Error",
                text: "Item not found.",
                icon: "error",
                buttons: [["OK", (e) => wm.closeWindow(e.target.closest("app").id)]]
            });
            return;
        }
        let content = `<div style="padding:15px; font-family: Tahoma, sans-serif; font-size: 11px;"><p><strong>Name:</strong> ${node.name}</p><p><strong>Type:</strong> ${node.type}</p><p><strong>Full Path:</strong> ${node.id}</p><p><strong>Created:</strong> ${new Date(node.createdAt).toLocaleString()}</p><p><strong>Modified:</strong> ${new Date(node.modifiedAt).toLocaleString()}</p>`;
        if (node.type === 'file' && node.content instanceof Blob) {
            content += `<p><strong>Size:</strong> ${node.content.size} bytes</p><p><strong>MIME Type:</strong> ${node.content.type || 'unknown'}</p>`;
        } else if (node.type === 'file') {
            content += `<p><strong>Size:</strong> ${new TextEncoder().encode(node.content || "").length} bytes (text)</p>`;
        }
        content += `</div>`;
        const propsContentEl = document.createElement('div');
        propsContentEl.innerHTML = content;
        const propsHWnd = wm.createNewWindow('properties', propsContentEl);
        wm.setCaption(propsHWnd, `${node.name} Properties`);
        const iconInfo = await ExplorerWindow.determineIconName(node, this._vfsIconObjectUrls);
        wm.setIcon(propsHWnd, iconInfo.iconNameForWM);
        wm.setSize(propsHWnd, 300, 'auto');
        wm.setDialog(propsHWnd);
    }
    async _handleDownload(vfsPath) {
        const node = await dm.open(vfsPath);
        if (!node) {
            dialogHandler.spawnDialog({
                title: "Download Error",
                text: "File or folder not found.",
                icon: "error"
            });
            return;
        }
        let blob, filename;
        if (node.type === 'file') {
            blob = (node.content instanceof Blob) ? node.content : new Blob([node.content],{
                type: 'text/plain'
            });
            filename = node.name;
        } else if (node.type === 'folder') {
            const zip = new JSZip();
            await this._zipFolderRecursive(zip, node.id, node.name);
            blob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE"
            });
            filename = `${node.name}.zip`;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    async _zipFolderRecursive(zip, folderPath, currentZipPath) {
        const items = await dm.list(folderPath);
        for (const item of items) {
            const itemZipPath = currentZipPath ? `${currentZipPath}/${item.name}` : item.name;
            if (item.type === 'folder') {
                await this._zipFolderRecursive(zip, item.id, itemZipPath);
            } else {
                const content = await dm.readFile(item.id);
                zip.file(itemZipPath, content);
            }
        }
    }
    async _handleCompress(vfsPath, destinationDir) {
        const node = await dm.open(vfsPath);
        if (!node) {
            dialogHandler.spawnDialog({
                title: "Compress Error",
                text: "File or folder not found.",
                icon: "error"
            });
            return;
        }
        const workingDialog = dialogHandler.spawnDialog({
            title: "Compressing...",
            text: `Compressing "${node.name}"... Please wait.`,
            icon: "info",
            noClose: true
        });
        const zip = new JSZip();
        try {
            if (node.type === 'folder') {
                await this._zipFolderRecursive(zip.folder(node.name), node.id, "");
            } else {
                zip.file(node.name, node.content);
            }
            const zipBlob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE"
            });
            const baseName = node.name.split('.')[0];
            let zipFileName = `${baseName}.zip`;
            let counter = 1;
            let finalPath = dm.join(destinationDir, zipFileName);
            while (await dm.open(finalPath)) {
                zipFileName = `${baseName} (${counter++}).zip`;
                finalPath = dm.join(destinationDir, zipFileName);
            }
            await dm.writeFile(finalPath, zipBlob);
        } catch (err) {
            dialogHandler.spawnDialog({
                title: "Compression Error",
                text: `Failed to create zip file: ${err.message}`,
                icon: "error"
            });
        } finally {
            if (wm._windows[workingDialog])
                wm.closeWindow(workingDialog);
        }
    }
    _getMimeType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            'aac': 'audio/aac',
            'abw': 'application/x-abiword',
            'arc': 'application/x-freearc',
            'avi': 'video/x-msvideo',
            'azw': 'application/vnd.amazon.ebook',
            'bin': 'application/octet-stream',
            'bmp': 'image/bmp',
            'bz': 'application/x-bzip',
            'bz2': 'application/x-bzip2',
            'csh': 'application/x-csh',
            'css': 'text/css',
            'csv': 'text/csv',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'eot': 'application/vnd.ms-fontobject',
            'epub': 'application/epub+zip',
            'gz': 'application/gzip',
            'gif': 'image/gif',
            'htm': 'text/html',
            'html': 'text/html',
            'ico': 'image/vnd.microsoft.icon',
            'ics': 'text/calendar',
            'jar': 'application/java-archive',
            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'js': 'text/javascript',
            'json': 'application/json',
            'jsonld': 'application/ld+json',
            'mid': 'audio/midi',
            'midi': 'audio/midi',
            'mjs': 'text/javascript',
            'mp3': 'audio/mpeg',
            'mpeg': 'video/mpeg',
            'mp4': 'video/mp4',
            'mpkg': 'application/vnd.apple.installer+xml',
            'odp': 'application/vnd.oasis.opendocument.presentation',
            'ods': 'application/vnd.oasis.opendocument.spreadsheet',
            'odt': 'application/vnd.oasis.opendocument.text',
            'ogg': 'audio/ogg',
            'ogv': 'video/ogg',
            'ogx': 'application/ogg',
            'opus': 'audio/opus',
            'otf': 'font/otf',
            'png': 'image/png',
            'pdf': 'application/pdf',
            'php': 'application/x-httpd-php',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'rar': 'application/vnd.rar',
            'rtf': 'application/rtf',
            'sh': 'application/x-sh',
            'svg': 'image/svg+xml',
            'swf': 'application/x-shockwave-flash',
            'tar': 'application/x-tar',
            'tif': 'image/tiff',
            'tiff': 'image/tiff',
            'ts': 'video/mp2t',
            'ttf': 'font/ttf',
            'txt': 'text/plain',
            'vsd': 'application/vnd.visio',
            'wav': 'audio/wav',
            'weba': 'audio/webm',
            'webm': 'video/webm',
            'webp': 'image/webp',
            'woff': 'font/woff',
            'woff2': 'font/woff2',
            'xhtml': 'application/xhtml+xml',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xml': 'application/xml',
            'xul': 'application/vnd.mozilla.xul+xml',
            'zip': 'application/zip',
            '3gp': 'video/3gpp',
            '3g2': 'video/3gpp2',
            '7z': 'application/x-7z-compressed'
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }
    async _handleExtract(vfsPath, destinationDir=null) {
        const zipNode = await dm.open(vfsPath);
        if (!zipNode || !(zipNode.content instanceof Blob)) {
            dialogHandler.spawnDialog({
                title: "Extract Error",
                text: "Invalid or empty ZIP file.",
                icon: "error"
            });
            return;
        }
        const workingDialog = dialogHandler.spawnDialog({
            title: "Extracting...",
            text: `Extracting "${zipNode.name}"... Please wait.`,
            icon: "info",
            noClose: true
        });
        try {
            destinationDir = destinationDir || dm.dirname(vfsPath);
            const baseFolderName = zipNode.name.replace(/\.zip$/i, '');
            let finalDestPath = dm.join(destinationDir, baseFolderName);
            let counter = 1;
            while (await dm.open(finalDestPath)) {
                finalDestPath = dm.join(destinationDir, `${baseFolderName} (${counter++})`);
            }
            await dm.mkdir(finalDestPath);
            const zip = await JSZip.loadAsync(zipNode.content);
            for (const relativePath in zip.files) {
                const zipEntry = zip.files[relativePath];
                const fullDestPath = dm.join(finalDestPath, relativePath);
                if (zipEntry.dir) {
                    await dm.mkdir(fullDestPath).catch(e => {}
                    );
                } else {
                    const fileContent = await zipEntry.async("uint8array");
                    const mimeType = this._getMimeType(zipEntry.name);
                    const typedBlob = new Blob([fileContent],{
                        type: mimeType
                    });
                    await dm.writeFile(fullDestPath, typedBlob);
                }
            }
        } catch (err) {
            dialogHandler.spawnDialog({
                title: "Extraction Error",
                text: `Failed to extract zip file: ${err.message}`,
                icon: "error"
            });
        } finally {
            if (wm._windows[workingDialog])
                wm.closeWindow(workingDialog);
        }
    }
    addDropHandlers(element, targetVfsPath) {
        const dropOverlayClass = 'drop-target-active';
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.types.includes('text/plain')) {
                e.dataTransfer.dropEffect = 'move';
            } else {
                e.dataTransfer.dropEffect = 'copy';
            }
            if (element === wm._desktop) {
                wm._desktop.classList.add(dropOverlayClass);
            } else {
                element.classList.add(dropOverlayClass);
            }
        }
        );
        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (element === wm._desktop) {
                wm._desktop.classList.remove(dropOverlayClass);
            } else {
                element.classList.remove(dropOverlayClass);
            }
        }
        );
        element.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (element === wm._desktop) {
                wm._desktop.classList.remove(dropOverlayClass);
            } else {
                element.classList.remove(dropOverlayClass);
            }
            const internalVfsPath = e.dataTransfer.getData('text/plain');
            if (internalVfsPath && /^[A-Z]:\//.test(internalVfsPath)) {
                if (internalVfsPath !== targetVfsPath && !targetVfsPath.startsWith(internalVfsPath + '/')) {
                    try {
                        await dm.move(internalVfsPath, targetVfsPath);
                    } catch (err) {
                        dialogHandler.spawnDialog({
                            title: "Move Error",
                            text: err.message,
                            icon: "error"
                        });
                    }
                }
                return;
            }
            const items = e.dataTransfer.items;
            if (items && items.length > 0) {
                const uploadTasks = [];
                for (let i = 0; i < items.length; i++) {
                    const item = items[i].webkitGetAsEntry();
                    if (item) {
                        uploadTasks.push(this.traverseFileTree(item, targetVfsPath));
                    }
                }
                if (uploadTasks.length > 0) {
                    await Promise.all(uploadTasks);
                }
            }
        }
        );
    }
    async traverseFileTree(item, path) {
        if (item.isFile) {
            return new Promise( (resolve) => {
                item.file(async (file) => {
                    const vfsFinalPath = dm.join(path, file.name);
                    await dm.writeFile(vfsFinalPath, file);
                    resolve();
                }
                );
            }
            );
        } else if (item.isDirectory) {
            const newPath = dm.join(path, item.name);
            await dm.mkdir(newPath).catch(e => {}
            );
            const dirReader = item.createReader();
            const entries = await new Promise(resolve => dirReader.readEntries(resolve));
            for (const entry of entries) {
                await this.traverseFileTree(entry, newPath);
            }
        }
    }
}
class ExplorerWindow {
    itemTemplate;
    hWnd;
    history = {
        previous: [],
        next: []
    };
    pwd = '';
    explorer;
    _isReloading = false;
    _reloadQueued = false;
    _currentVfsIconObjectUrlsInWindow;
    constructor(contents, itemTemplate, explorerInstance, path) {
        this.itemTemplate = itemTemplate;
        this.explorer = explorerInstance;
        this.hWnd = wm.createNewWindow('explorer', contents);
        this._currentVfsIconObjectUrlsInWindow = new Set();
        wm._windows[this.hWnd].explorerWindowInstance = this;
        wm._windows[this.hWnd].addEventListener('wm:windowClosed', () => {
            this._currentVfsIconObjectUrlsInWindow.forEach(url => URL.revokeObjectURL(url));
            this._currentVfsIconObjectUrlsInWindow.clear();
        }
        , {
            once: true
        });
        this._setupEventListeners();
        const noSidebarPrefKey = shell._currentUser ? `user_${shell._currentUser}.noExplorerSidebar` : 'noExplorerSidebar';
        const noSidebar = localStorage.getItem(noSidebarPrefKey) === 'true';
        if (this.window.querySelector("appcontentholder")) {
            this.window.querySelector("appcontentholder").classList.toggle("nosidebar", noSidebar);
        }
        this.navigate(path || '');
        const preferredViewKey = shell._currentUser ? `user_${shell._currentUser}.preferredView` : 'preferredView';
        this.changeFileView(localStorage.getItem(preferredViewKey) || "tileview");
        wm.setSize(this.hWnd, 656, 480);
    }
    get window() {
        return wm._windows[this.hWnd];
    }
    _setupEventListeners() {
        this.window.querySelectorAll(".sidebargroup .collapser").forEach(btn => btn.onclick = (e) => e.target.closest(".sidebargroup").classList.toggle("collapsed"));
        this.window.querySelector('[name=go-previous]').onclick = () => this.goBack();
        this.window.querySelector('[name=go-next]').onclick = () => this.goForward();
        this.window.querySelector('[name=go-up]').onclick = () => this.goUp();
        this.window.querySelector('[name="viewsmenu"]').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleViewPicker();
        }
        );
        this.window.querySelector('xp-popup.viewpicker').querySelectorAll('li').forEach(li => li.addEventListener('click', (e) => {
            e.preventDefault();
            this.changeFileView(li.id);
            this.toggleViewPicker();
        }
        ));
        const addressBarCombo = this.window.querySelector('#explorer-addressbar-combo')
          , addressTextSpan = addressBarCombo.querySelector('#explorer-addressbar-text');
        addressBarCombo.onclick = (e) => {
            if (e.target.tagName === 'IMG' || e.target === addressTextSpan.parentElement) {
                if (addressBarCombo.querySelector('input'))
                    return;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = this.pwd || "My Computer";
                Object.assign(input.style, {
                    width: 'calc(100% - 20px)',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'var(--input-bg, white)',
                    color: 'var(--input-text, black)',
                    fontFamily: 'inherit',
                    fontSize: 'inherit'
                });
                addressTextSpan.style.display = 'none';
                addressBarCombo.appendChild(input);
                input.focus();
                input.select();
                const restoreSpan = () => {
                    if (addressBarCombo.contains(input))
                        addressBarCombo.removeChild(input);
                    addressTextSpan.textContent = this.pwd || "My Computer";
                    addressTextSpan.style.display = '';
                    input.removeEventListener('blur', onBlur);
                    input.removeEventListener('keypress', onKeyPress);
                }
                ;
                const onBlur = () => setTimeout(restoreSpan, 100)
                  , onKeyPress = (ev) => {
                    if (ev.key === 'Enter') {
                        this.navigate(input.value);
                        input.blur();
                    }
                }
                ;
                input.addEventListener('blur', onBlur);
                input.addEventListener('keypress', onKeyPress);
            }
        }
        ;
        this.window.querySelector('#explorer-go-btn').onclick = () => {
            const inputField = addressBarCombo.querySelector('input');
            const pathToGo = inputField ? inputField.value : (addressTextSpan ? addressTextSpan.textContent : this.pwd);
            this.navigate(pathToGo === "My Computer" ? "" : pathToGo);
        }
        ;
        this.window.querySelector('#sidebar-newfolder').onclick = () => this.explorer._handleNewItem('new-folder', this.pwd, this);
        this.window.querySelector('#sidebar-desktop').onclick = () => this.navigate(`C:/Documents and Settings/${shell._currentUser}/Desktop`);
        this.window.querySelector('#sidebar-mydocuments').onclick = () => this.navigate(`C:/Documents and Settings/${shell._currentUser}/My Documents`);
        this.window.querySelector('#sidebar-mycomputer').onclick = () => this.navigate('');
        this.window.querySelector('#sidebar-parentfolder').onclick = () => this.goUp();
        this.window.querySelector('#sidebar-renameitem').onclick = () => {
            const sel = this.window.querySelector('fsicon.selected');
            if (sel)
                this.explorer._initiateRename(sel, sel.dataset.filePath);
        }
        ;
        this.window.querySelector('#sidebar-deleteitem').onclick = () => {
            const sel = this.window.querySelector('fsicon.selected');
            if (sel)
                this.explorer._handleDelete(sel.dataset.filePath, this);
        }
        ;
        this.window.querySelector('fscontents').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.explorer._showFolderBackgroundContextMenu(e, this.pwd, this);
        }
        );
        this.window.querySelector('fscontents > items').addEventListener('click', (e) => {
            const icon = e.target.closest('fsicon');
            this.window.querySelectorAll('fsicon.selected').forEach(s => s.classList.remove('selected'));
            if (icon) {
                icon.classList.add('selected');
                this.updateSidebarTasks(true, icon.dataset.filePath);
            } else
                this.updateSidebarTasks(false);
        }
        );
        this.updateSidebarTasks(false);
    }
    updateSidebarTasks(itemSelected, itemPath=null) {
        const renameBtn = this.window.querySelector('#sidebar-renameitem')
          , deleteBtn = this.window.querySelector('#sidebar-deleteitem');
        const detailsName = this.window.querySelector('#sidebar-details-list .name')
          , detailsType = this.window.querySelector('#sidebar-details-list .type')
          , detailsModified = this.window.querySelector('#sidebar-details-list .modified');
        const detailsGroup = this.window.querySelector('.sidebargroup.details')
          , isSystem = itemPath?.endsWith("_VIRTUAL");
        if (itemSelected && itemPath && !isSystem) {
            renameBtn.classList.remove('disabled');
            deleteBtn.classList.remove('disabled');
            dm.open(itemPath).then(node => {
                if (node) {
                    if (detailsName)
                        detailsName.textContent = node.name || 'Unknown';
                    if (detailsType)
                        detailsType.textContent = node.type ? (node.type.charAt(0).toUpperCase() + node.type.slice(1)) : 'Unknown';
                    if (detailsModified)
                        detailsModified.textContent = `Modified: ${new Date(node.modifiedAt).toLocaleDateString()}`;
                    if (detailsGroup)
                        detailsGroup.classList.remove('collapsed');
                }
            }
            );
        } else {
            renameBtn.classList.add('disabled');
            deleteBtn.classList.add('disabled');
            if (detailsName)
                detailsName.textContent = '';
            if (detailsType)
                detailsType.textContent = '';
            if (detailsModified)
                detailsModified.textContent = '';
            if (detailsGroup)
                detailsGroup.classList.add('collapsed');
        }
    }
    showLoadingOverlay(message="Loading...") {
        const o = this.window.querySelector('.loading-overlay-explorer');
        if (o) {
            o.textContent = message;
            o.style.display = 'flex';
        }
    }
    hideLoadingOverlay() {
        const o = this.window.querySelector('.loading-overlay-explorer');
        if (o) {
            o.style.display = 'none';
        }
    }
    refreshHistoryButtons() {
        this.window.querySelector('[name=go-previous]').classList.toggle('disabled', this.history.previous.length === 0);
        this.window.querySelector('[name=go-next]').classList.toggle('disabled', this.history.next.length === 0);
    }
    historyPush(target) {
        this.history.previous.push(target);
        this.history.next = [];
        this.refreshHistoryButtons();
    }
    historyPopPrevious(current) {
        if (this.history.previous.length === 0)
            return null;
        this.history.next.unshift(current);
        const p = this.history.previous.pop();
        this.refreshHistoryButtons();
        return p;
    }
    historyPopNext(current) {
        if (this.history.next.length === 0)
            return null;
        this.history.previous.push(current);
        const n = this.history.next.shift();
        this.refreshHistoryButtons();
        return n;
    }
    async goBack() {
        const p = this.historyPopPrevious(this.pwd);
        if (p !== null)
            await this.navigate(p, {
                modifyHistory: false
            });
    }
    async goForward() {
        const n = this.historyPopNext(this.pwd);
        if (n !== null)
            await this.navigate(n, {
                modifyHistory: false
            });
    }
    async goUp() {
        const drive = this.pwd?.substring(0, 2);
        if (this.pwd === '' || this.pwd === `${drive}/`) {
            if (this.pwd !== '')
                await this.navigate('');
            return;
        }
        await this.navigate(dm.dirname(this.pwd));
    }
    toggleViewPicker() {
        const picker = this.window.querySelector('xp-popup.viewpicker');
        picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
    }
    changeFileView(viewId) {
        const viewport = this.window.querySelector("fscontents");
        viewport.className = 'fscontents';
        viewport.classList.add(viewId);
        const pickerPopup = this.window.querySelector("xp-popup.viewpicker");
        pickerPopup.querySelectorAll('li.activeView').forEach(li => li.classList.remove('activeView'));
        const activeLi = pickerPopup.querySelector(`li#${viewId}`);
        if (activeLi)
            activeLi.classList.add('activeView');
        const preferredViewKey = shell._currentUser ? `user_${shell._currentUser}.preferredView` : 'preferredView';
        localStorage.setItem(preferredViewKey, viewId);
        this.reload();
    }
    static async determineIconName(node, vfsIconUrlMap=new Map()) {
        if (!node)
            return {
                src: 'res/icons/default.png',
                isVfsObjectUrl: false,
                iconNameForWM: 'default.png'
            };
        let iconName = 'default.png';
        let isVfs = false;
        let finalSrc = '';
        let iconNameForWMResolution = 'default.png';
        if (node.metadata?.icon && window.explorer.icons[node.metadata.icon]) {
            iconName = node.metadata.icon;
            iconNameForWMResolution = iconName;
        } else if (node.metadata?.icon) {
            if (node.metadata.icon.toLowerCase().startsWith("c:/") || node.metadata.icon.toLowerCase().startsWith("e:/") || node.metadata.icon.toLowerCase().startsWith("d:/")) {
                iconName = node.metadata.icon;
                iconNameForWMResolution = iconName;
                isVfs = true;
            } else {
                iconName = node.metadata.icon;
                iconNameForWMResolution = iconName;
            }
        } else if (node.type === 'folder') {
            const nameLower = node.name.toLowerCase();
            if (nameLower === 'my documents')
                iconName = 'mydocuments.png';
            else if (nameLower === 'my music')
                iconName = 'mymusic.png';
            else if (nameLower === 'my pictures')
                iconName = 'mypictures.png';
            else if (nameLower === 'my videos')
                iconName = 'myvideos.png';
            else if (node.id && node.id.match(/^[A-Z]:\/$/) && node.name === '') {
                iconName = (node.id === 'E:/') ? 'cddrive.png' : 'drive.png';
            } else {
                iconName = 'folder.png';
            }
            iconNameForWMResolution = iconName;
        } else {
            const ext = node.name.includes('.') ? node.name.substring(node.name.lastIndexOf('.') + 1).toLowerCase() : '';
            iconNameForWMResolution = window.explorer.icons[ext] || 'default.png';
            if (ext === 'lnk') {
                iconNameForWMResolution = window.explorer.icons.lnk || 'shortcut.png';
                try {
                    let content = node.content;
                    if (content instanceof Blob)
                        content = await content.text();
                    if (typeof content === 'string') {
                        const lnkData = JSON.parse(content);
                        if (lnkData?.vfsIconPath) {
                            iconName = lnkData.vfsIconPath;
                            iconNameForWMResolution = lnkData.vfsIconPath;
                            isVfs = true;
                        } else if (lnkData?.icon && window.explorer.icons[lnkData.icon]) {
                            iconName = lnkData.icon;
                            iconNameForWMResolution = iconName;
                        } else {
                            iconName = window.explorer.icons.lnk || 'shortcut.png';
                        }
                    } else {
                        iconName = window.explorer.icons.lnk || 'shortcut.png';
                    }
                } catch (e) {
                    iconName = window.explorer.icons.lnk || 'shortcut.png';
                }
            } else if (ext === 'exe') {
                iconNameForWMResolution = window.explorer.icons.exe || 'defaultapp.png';
                try {
                    let content = node.content;
                    if (content instanceof Blob)
                        content = await content.text();
                    if (typeof content === 'string') {
                        const exeData = JSON.parse(content);
                        if (exeData?.icon) {
                            if (exeData.icon.toLowerCase().startsWith("c:/") || exeData.icon.toLowerCase().startsWith("e:/") || exeData.icon.toLowerCase().startsWith("d:/")) {
                                iconName = exeData.icon;
                                iconNameForWMResolution = exeData.icon;
                                isVfs = true;
                            } else if (window.explorer.icons[exeData.icon]) {
                                iconName = exeData.icon;
                                iconNameForWMResolution = exeData.icon;
                            } else {
                                iconName = window.explorer.icons.exe || 'defaultapp.png';
                            }
                        } else {
                            iconName = window.explorer.icons.exe || 'defaultapp.png';
                        }
                    } else {
                        iconName = window.explorer.icons.exe || 'defaultapp.png';
                    }
                } catch (e) {
                    iconName = window.explorer.icons.exe || 'defaultapp.png';
                }
            } else {
                iconName = window.explorer.icons[ext] || 'default.png';
                iconNameForWMResolution = iconName;
            }
        }
        if (isVfs) {
            try {
                const iconFileNode = await dm.open(iconName);
                if (iconFileNode && iconFileNode.content instanceof Blob) {
                    const objectURL = URL.createObjectURL(iconFileNode.content);
                    if (vfsIconUrlMap instanceof Map || vfsIconUrlMap instanceof Set) {
                        if (vfsIconUrlMap instanceof Map)
                            vfsIconUrlMap.set(iconName, objectURL);
                        else
                            vfsIconUrlMap.add(objectURL);
                    }
                    finalSrc = objectURL;
                    return {
                        src: finalSrc,
                        isVfsObjectUrl: true,
                        iconNameForWM: iconName
                    };
                } else {
                    finalSrc = `res/icons/${window.explorer.icons.exe || 'defaultapp.png'}`;
                    iconNameForWMResolution = window.explorer.icons.exe || 'defaultapp.png';
                }
            } catch (e) {
                finalSrc = `res/icons/${window.explorer.icons.exe || 'defaultapp.png'}`;
                iconNameForWMResolution = window.explorer.icons.exe || 'defaultapp.png';
            }
        } else {
            finalSrc = `res/icons/${iconName}`;
        }
        return {
            src: finalSrc,
            isVfsObjectUrl: isVfs,
            iconNameForWM: iconNameForWMResolution
        };
    }
    async navigateRoot({modifyHistory=true}={}) {
        this._currentVfsIconObjectUrlsInWindow.forEach(url => URL.revokeObjectURL(url));
        this._currentVfsIconObjectUrlsInWindow.clear();
        this.window.querySelector('[name=go-up]').classList.add('disabled');
        if (modifyHistory && this.pwd !== undefined && this.pwd !== '')
            this.historyPush(this.pwd);
        this.pwd = '';
        this.window.querySelector("#sidebar-parentfolder").style.display = "none";
        const addressImg = this.window.querySelector('#explorer-addressbar-combo img')
          , addressTxt = this.window.querySelector('#explorer-addressbar-combo #explorer-addressbar-text');
        if (addressImg)
            addressImg.src = `res/icons/tray/mycomputer.png`;
        if (addressTxt)
            addressTxt.textContent = "My Computer";
        wm.setIcon(this.hWnd, 'mycomputer.png');
        wm.setCaption(this.hWnd, "My Computer");
        this.showLoadingOverlay("Loading drives...");
        await window.dm.ready();
        if (shell && typeof shell.playSystemSound === 'function')
            shell.playSystemSound("start");
        await this.reloadDrives();
    }
    async navigate(fullPath, {modifyHistory=true}={}) {
        this._currentVfsIconObjectUrlsInWindow.forEach(url => URL.revokeObjectURL(url));
        this._currentVfsIconObjectUrlsInWindow.clear();
        await dm.ready();
        this.showLoadingOverlay("Loading...");
        this.window.querySelector('[name=go-up]').classList.remove('disabled');
        if (fullPath === '' || fullPath === null || fullPath === undefined || fullPath.toLowerCase() === "my computer") {
            this.hideLoadingOverlay();
            return this.navigateRoot({
                modifyHistory
            });
        }
        const {fullPath: normalizedPath} = dm._normalizeAndSplitPath(fullPath);
        const node = await dm.open(normalizedPath);
        if (!node) {
            dialogHandler.spawnDialog({
                title: "Error",
                text: `Windows cannot find '${fullPath}'. Check spelling.`,
                icon: "error",
                buttons: [["OK", (e) => wm.closeWindow(e.target.closest("app").id)]]
            });
            this.hideLoadingOverlay();
            const parentDir = dm.dirname(normalizedPath);
            if (parentDir && parentDir !== normalizedPath && parentDir !== 'C:/' && parentDir !== 'D:/' && parentDir !== 'E:/')
                this.navigate(parentDir, {
                    modifyHistory: false
                });
            else
                this.navigateRoot({
                    modifyHistory: false
                });
            return;
        }
        if (node.type === 'file') {
            this.hideLoadingOverlay();
            const ext = node.name.includes('.') ? node.name.substring(node.name.lastIndexOf('.') + 1).toLowerCase() : '';
            this.explorer._handleItemDoubleClick(normalizedPath, node.type, ext, null, this, node);
            return;
        }
        if (modifyHistory && this.pwd !== undefined && this.pwd !== normalizedPath)
            this.historyPush(this.pwd);
        this.pwd = normalizedPath;
        if (this.pwd) {
            this.explorer.addDropHandlers(this.window.querySelector('fscontents'), this.pwd);
        }
        const iconInfo = await ExplorerWindow.determineIconName(node, this._currentVfsIconObjectUrlsInWindow);
        const addressImg = this.window.querySelector('#explorer-addressbar-combo img')
          , addressTxt = this.window.querySelector('#explorer-addressbar-combo #explorer-addressbar-text');
        if (addressImg)
            addressImg.src = iconInfo.isVfsObjectUrl ? iconInfo.src : `res/icons/tray/${iconInfo.iconNameForWM}`;
        if (iconInfo.isVfsObjectUrl)
            this._currentVfsIconObjectUrlsInWindow.add(iconInfo.src);
        if (addressTxt)
            addressTxt.textContent = this.pwd;
        const sidebarParentLink = this.window.querySelector("#sidebar-parentfolder")
          , driveLetter = this.pwd.substring(0, 1);
        if (this.pwd === `${driveLetter}:/`) {
            if (sidebarParentLink)
                sidebarParentLink.style.display = "none";
            const driveLabel = `${driveLetter === 'A' ? '3½ Floppy' : driveLetter === 'E' ? 'CD Drive' : 'Local Disk'} (${driveLetter}:)`;
            wm.setCaption(this.hWnd, driveLabel);
            wm.setIcon(this.hWnd, driveLetter === 'A' ? 'floppy.png' : driveLetter === 'E' ? 'cddrive.png' : 'drive.png');
        } else {
            if (sidebarParentLink) {
                sidebarParentLink.style.display = "block";
                const parentBase = dm.basename(dm.dirname(this.pwd));
                sidebarParentLink.querySelector('path').textContent = parentBase || `${driveLetter}:\\`;
            }
            const userFullPathInTitlePref = localStorage.getItem(shell._currentUser ? `user_${shell._currentUser}.fullPathInTitle` : 'fullPathInTitle');
            if (userFullPathInTitlePref === "true") {
                wm.setCaption(this.hWnd, this.pwd.replace(/\//g, '\\'));
            } else {
                wm.setCaption(this.hWnd, node.name || `${driveLetter}:`);
            }
            wm.setIcon(this.hWnd, iconInfo.iconNameForWM);
        }
        if (shell && typeof shell.playSystemSound === 'function')
            shell.playSystemSound("start");
        await this.reload();
    }
    async reloadDrives() {
        this._currentVfsIconObjectUrlsInWindow.forEach(url => URL.revokeObjectURL(url));
        this._currentVfsIconObjectUrlsInWindow.clear();
        this.showLoadingOverlay("Loading drives...");
        const itemsCont = this.window.querySelector('items');
        if (!itemsCont) {
            this.hideLoadingOverlay();
            return;
        }
        itemsCont.innerHTML = '';
        this.updateSidebarTasks(false);
        const drivesToShow = Object.keys(window.dm.storages).sort();
        for (const letter of drivesToShow) {
            const isFloppy = letter === 'A';
            const isCD = letter === 'E';
            let driveLabel = `Local Disk (${letter}:)`;
            let driveIconName = 'drive.png';
            if (isFloppy) {
                driveLabel = `3½ Floppy (${letter}:)`;
                driveIconName = 'floppy.png';
            } else if (isCD) {
                driveLabel = `CD Drive (${letter}:)`;
                driveIconName = 'cddrive.png';
            }
            const diskMeta = {
                label: driveLabel,
                icon: driveIconName,
                pathId: `${letter}:/`
            };
            let itemEl = this.itemTemplate.content.firstElementChild.cloneNode(true);
            itemEl.dataset.filePath = diskMeta.pathId;
            itemEl.dataset.itemType = 'folder';
            const iconInfo = await ExplorerWindow.determineIconName({
                type: 'folder',
                id: diskMeta.pathId,
                name: '',
                metadata: {
                    icon: driveIconName
                }
            }, this._currentVfsIconObjectUrlsInWindow);
            const iconDispPath = this.window.querySelector('fscontents').classList.contains('listview') ? (iconInfo.isVfsObjectUrl ? iconInfo.src : `res/icons/tray/${iconInfo.iconNameForWM}`) : iconInfo.src;
            if (iconInfo.isVfsObjectUrl)
                this._currentVfsIconObjectUrlsInWindow.add(iconInfo.src);
            itemEl.querySelector('img').src = iconDispPath;
            itemEl.querySelector('icontitle').textContent = `${diskMeta.label}`;
            itemEl.addEventListener('dblclick', () => this.navigate(diskMeta.pathId));
            itemEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.explorer._showItemContextMenu(e, diskMeta.pathId, itemEl, false);
            }
            );
            ExplorerWindow.setupItemDragAndDrop(itemEl, diskMeta.pathId, this);
            itemsCont.appendChild(itemEl);
        }
        const showHiddenPrefKey = shell._currentUser ? `user_${shell._currentUser}.showHiddenContents` : 'showHiddenContents';
        const showHidden = localStorage.getItem(showHiddenPrefKey) === "true";
        if (showHidden) {
            const systemRootItemsToConsiderForMyComputer = [{
                path: DiskManager.RECYCLE_BIN_PATH,
                defaultIcon: 'recycler empty.png'
            }, ];
            for (const itemInfo of systemRootItemsToConsiderForMyComputer) {
                try {
                    const node = await dm.open(itemInfo.path);
                    if (node && node.metadata && node.metadata.hidden) {
                        let itemEl = this.itemTemplate.content.firstElementChild.cloneNode(true);
                        itemEl.dataset.filePath = node.id;
                        itemEl.dataset.itemType = node.type;
                        const iconInfo = await ExplorerWindow.determineIconName(node, this._currentVfsIconObjectUrlsInWindow);
                        const iconDispPath = this.window.querySelector('fscontents').classList.contains('listview') ? (iconInfo.isVfsObjectUrl ? iconInfo.src : `res/icons/tray/${iconInfo.iconNameForWM}`) : iconInfo.src;
                        itemEl.querySelector('img').src = iconDispPath;
                        if (iconInfo.isVfsObjectUrl) {
                            itemEl.dataset.vfsIconUrl = iconInfo.src;
                            this._currentVfsIconObjectUrlsInWindow.add(iconInfo.src);
                        }
                        itemEl.querySelector('icontitle').textContent = node.name;
                        itemEl.style.opacity = "0.7";
                        itemEl.addEventListener('dblclick', () => this.explorer._handleItemDoubleClick(node.id, node.type, '', itemEl, this, node));
                        itemEl.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.explorer._showItemContextMenu(e, node.id, itemEl);
                        }
                        );
                        if (itemsCont)
                            itemsCont.appendChild(itemEl);
                    }
                } catch (e) {}
            }
        }
        this.hideLoadingOverlay();
    }
    async reload() {
        if (this._isReloading) {
            this._reloadQueued = true;
            return;
        }
        this._isReloading = true;
        this._currentVfsIconObjectUrlsInWindow.forEach(url => URL.revokeObjectURL(url));
        this._currentVfsIconObjectUrlsInWindow.clear();
        const noSidebarPrefKey = shell._currentUser ? `user_${shell._currentUser}.noExplorerSidebar` : 'noExplorerSidebar';
        const noSidebar = localStorage.getItem(noSidebarPrefKey) === 'true';
        if (this.window.querySelector("appcontentholder")) {
            this.window.querySelector("appcontentholder").classList.toggle("nosidebar", noSidebar);
        }
        const fullPathInTitlePrefKey = shell._currentUser ? `user_${shell._currentUser}.fullPathInTitle` : 'fullPathInTitle';
        const userFullPathInTitlePref = localStorage.getItem(fullPathInTitlePrefKey);
        if (this.pwd && this.pwd !== '') {
            const node = await dm.open(this.pwd);
            if (node) {
                if (userFullPathInTitlePref === "true") {
                    wm.setCaption(this.hWnd, this.pwd.replace(/\//g, '\\'));
                } else {
                    const driveLetter = this.pwd.substring(0, 1);
                    wm.setCaption(this.hWnd, node.name || `${driveLetter}:`);
                }
            }
        } else if (this.pwd === '') {
            wm.setCaption(this.hWnd, "My Computer");
        }
        try {
            if (this.pwd === '') {
                await this.reloadDrives();
            } else {
                this.showLoadingOverlay(`Loading "${this.pwd}"...`);
                const itemsCont = this.window.querySelector('items');
                if (!itemsCont) {
                    this.hideLoadingOverlay();
                    this._isReloading = false;
                    if (this._reloadQueued) {
                        this._reloadQueued = false;
                        setTimeout( () => this.reload(), 0);
                    }
                    return;
                }
                itemsCont.innerHTML = '';
                this.updateSidebarTasks(false);
                const childNodesRaw = await dm.list(this.pwd);
                const showHiddenPrefKey = shell._currentUser ? `user_${shell._currentUser}.showHiddenContents` : 'showHiddenContents';
                const showHidden = localStorage.getItem(showHiddenPrefKey) === "true";
                const showExtensionsPrefKey = shell._currentUser ? `user_${shell._currentUser}.showFileExtensions` : 'showFileExtensions';
                const showExtensions = localStorage.getItem(showExtensionsPrefKey) === "true";
                const childNodes = childNodesRaw.filter(node => {
                    if (window.explorer.hiddenFiles.includes(node.name) && !showHidden)
                        return false;
                    if (node.metadata && node.metadata.hidden && !showHidden)
                        return false;
                    return true;
                }
                ).sort( (a, b) => (a.type === 'folder' && b.type !== 'folder') ? -1 : (a.type !== 'folder' && b.type === 'folder') ? 1 : a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                for (const node of childNodes) {
                    const itemPath = node.id;
                    let itemEl = this.itemTemplate.content.firstElementChild.cloneNode(true);
                    itemEl.dataset.filePath = itemPath;
                    itemEl.dataset.itemType = node.type;
                    const iconInfo = await ExplorerWindow.determineIconName(node, this._currentVfsIconObjectUrlsInWindow);
                    const iconDispPath = this.window.querySelector('fscontents').classList.contains('listview') ? (iconInfo.isVfsObjectUrl ? iconInfo.src : `res/icons/tray/${iconInfo.iconNameForWM}`) : iconInfo.src;
                    itemEl.querySelector('img').src = iconDispPath;
                    if (iconInfo.isVfsObjectUrl) {
                        itemEl.dataset.vfsIconUrl = iconInfo.src;
                        this._currentVfsIconObjectUrlsInWindow.add(iconInfo.src);
                    }
                    if (node.metadata && node.metadata.hidden && showHidden) {
                        itemEl.style.opacity = "0.7";
                    }
                    let displayName = node.name;
                    const ext = node.name.includes('.') ? node.name.substring(node.name.lastIndexOf('.') + 1).toLowerCase() : '';
                    if (node.type === 'file' && !showExtensions && this.explorer.icons[ext]) {
                        const dotIdx = displayName.lastIndexOf('.');
                        if (dotIdx > 0)
                            displayName = displayName.substring(0, dotIdx);
                    }
                    itemEl.querySelector('icontitle').textContent = displayName;
                    if (ext === 'lnk')
                        itemEl.classList.add("shortcut");
                    itemEl.addEventListener('dblclick', () => this.explorer._handleItemDoubleClick(itemPath, node.type, ext, itemEl, this, node));
                    itemEl.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.explorer._showItemContextMenu(e, itemPath, itemEl);
                    }
                    );
                    ExplorerWindow.setupItemDragAndDrop(itemEl, itemPath, this);
                    itemsCont.appendChild(itemEl);
                }
                this.hideLoadingOverlay();
            }
        } catch (error) {
            this.hideLoadingOverlay();
            dialogHandler.spawnDialog({
                title: "Error",
                text: `Could not load folder contents: ${error.message}`,
                icon: "error",
                buttons: [["OK", (e) => wm.closeWindow(e.target.closest("app").id)]]
            });
        } finally {
            this._isReloading = false;
            if (this._reloadQueued) {
                this._reloadQueued = false;
                setTimeout( () => this.reload(), 0);
            }
        }
    }
    static setupItemDragAndDrop(itemElement, vfsPath, explorerWindowInstance) {
        itemElement.setAttribute('draggable', 'true');
        itemElement.addEventListener('dragstart', (e) => {
            if (vfsPath && !vfsPath.endsWith('_VIRTUAL')) {
                e.dataTransfer.setData('text/plain', vfsPath);
                e.dataTransfer.effectAllowed = 'move';
                itemElement.style.opacity = '0.5';
            } else {
                e.preventDefault();
            }
        }
        );
        itemElement.addEventListener('dragend', (e) => {
            itemElement.style.opacity = '1';
        }
        );
        if (itemElement.dataset.itemType === 'folder') {
            itemElement.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                itemElement.classList.add('drop-target-active');
            }
            );
            itemElement.addEventListener('dragleave', (e) => {
                itemElement.classList.remove('drop-target-active');
            }
            );
            itemElement.addEventListener('drop', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                itemElement.classList.remove('drop-target-active');
                const sourceVfsPath = e.dataTransfer.getData('text/plain');
                const destFolderPath = itemElement.dataset.filePath;
                if (sourceVfsPath && destFolderPath && sourceVfsPath !== destFolderPath) {
                    if (destFolderPath.startsWith(sourceVfsPath + '/')) {
                        dialogHandler.spawnDialog({
                            title: "Move Error",
                            text: "Cannot move a folder into itself.",
                            icon: "error"
                        });
                        return;
                    }
                    if (explorerWindowInstance)
                        explorerWindowInstance.showLoadingOverlay(`Moving "${dm.basename(sourceVfsPath)}"...`);
                    try {
                        await dm.move(sourceVfsPath, destFolderPath);
                    } catch (err) {
                        dialogHandler.spawnDialog({
                            title: "Move Error",
                            text: err.message,
                            icon: "error"
                        });
                    } finally {
                        if (explorerWindowInstance)
                            explorerWindowInstance.hideLoadingOverlay();
                    }
                }
            }
            );
        }
    }
}
window.ExplorerWindow = ExplorerWindow;
