import { DiskManager } from "./DiskManager.js";

export class Shell {
    windowTemplate = `
		<appheader ondblclick="window.wm.toggleMaximizeWindow(this.parentElement.id);" data-has-contextmenu="true">
			<img ondblclick="wm.closeWindow(event.target.closest('app').id)" src="res/icons/tray/defaultapp.png"><span>Runtime Windows Application</span>
			<contextmenu class="hasicons">
				<ul>
					<li class="disabled"><img class="windowcontrols" src="res/ui/classic/restore_classic.png"><span>Restore</span></li>
					<li onclick="window.wm.setPosition(wm._contextParent.closest('app').id,0,0);"><span>Move to origin</span></li>
					<li class="disabled"><span>Size</span></li>
					<li onclick="window.wm.minimizeWindow(wm._contextParent.closest('app').id);"><img class="windowcontrols" src="res/ui/classic/minimize_classic.png"><span>Minimize</span></li>
					<li onclick="window.wm.toggleMaximizeWindow(wm._contextParent.closest('app').id);"><img class="windowcontrols" src="res/ui/classic/maximize_classic.png"><span>Maximize</span></li>
					<li class="divider"></li>
					<li onclick="window.wm.closeWindow(wm._contextParent.closest('app').id);"><img class="windowcontrols" src="res/ui/classic/close_classic.png"><span>Close</span></li>
				</ul>
			</contextmenu>
		</appheader>
		<appanimator><img src="res/icons/tray/defaultapp.png"><span>Runtime Windows Application</span></appanimator>
		<appcontrols>
			<captionbutton class="help"><div></div></captionbutton>
			<captionbutton class="min" onclick="window.wm.minimizeWindow(this.parentElement.parentElement.id);"><div></div></captionbutton>
			<captionbutton class="max" onclick="window.wm.toggleMaximizeWindow(this.parentElement.parentElement.id);"><div></div></captionbutton>
			<captionbutton class="res" onclick="window.wm.toggleMaximizeWindow(this.parentElement.parentElement.id);"><div></div></captionbutton>
			<captionbutton class="closebtn" onclick="window.wm.closeWindow(this.parentElement.parentElement.id);"><div></div></captionbutton>
		</appcontrols>
		<appcontents>
		</appcontents>
		<appresizers>
			<grabber id="n" class="resize n"></grabber>
			<grabber id="s" class="resize s"></grabber>
			<grabber id="w" class="resize w"></grabber>
			<grabber id="e" class="resize e"></grabber>
			<grabber id="nw" class="resize nw"></grabber>
			<grabber id="ne" class="resize ne"></grabber>
			<grabber id="sw" class="resize sw"></grabber>
			<grabber id="se" class="resize se"></grabber>
		</appresizers>
	`;
    taskbarTemplate = `<startbtn><contextmenu class="taskbar-menu"><ul><li class="default" onclick="window.explorer.open(DiskManager.USER_PROFILES_BASE_PATH + '/All Users/Start Menu'); wm.closeStartMenu();"><span>Open</span></li><li class="disabled"><span>Explore</span></li><li class="disabled"><span>Search...</span></li><li class="disabled submenuholder"><span>Share on</span></li><li onclick="apps.load('startprops').then(app => { if(app) app.start(); }); wm.closeStartMenu();"><span>Properties</span></li><li class="divider"></li><li class="disabled"><span>Open All Users</span></li><li class="disabled"><span>Explore All Users</span></li></ul></contextmenu></startbtn><quicklaunch><img onclick="wm.minimizeAllWindows()" src="res/icons/tray/desktop.png"><img onclick="window.explorer.open();" src="res/icons/tray/explorer.png"><img onclick="apps.load('wmp').then(app => { if(app) app.start(); });" src="res/icons/tray/wmplayer.png"></quicklaunch><taskarea><contextmenu class="taskbar-menu"><ul><li class="submenuholder"><span>Toolbars</span><ul><li><span>Links</span></li><li><span>Desktop</span></li><li><span>Quick Launch</span></li><li class="divider"></li><li><span>New Toolbar...</span></li></ul></li><li class="divider"></li><li onclick="wm.cascadeWindows();"><span>Cascade Windows</span></li><li class="disabled"><span>Tile Windows Horizontally</span></li><li class="disabled"><span>Tile Windows Vertically</span></li><li onclick="wm.minimizeAllWindows();"><span>Show the Desktop</span></li><li class="divider"></li><li onclick="apps.load('taskmgr').then(app => { if(app) app.start(); }); wm.closeStartMenu();"><span>Task Manager</span></li><li class="divider"></li><li class="disabled"><span>Lock the Taskbar</span></li><li onclick="apps.load('startprops').then(app => { if(app) app.start(); }); wm.closeStartMenu();"><span>Properties</span></li></ul></contextmenu></taskarea><trayarea><balloonpopup><balloontitle><img class="balloonicon" src="res/icons/tray/info.png">Take a tour of Windows XP</balloontitle><closeballoon onclick="this.parentNode.remove();"><img src="res/ui/luna/close.png"></closeballoon><span class="messagetext" onclick="apps.load('help').then(app => { if(app) app.start(); }); this.parentNode.remove(); wm.closeStartMenu();">To learn about the fun features Windows XP has to offer, click here. To find this info later, click Help and About on the Start menu.</span></balloonpopup><traycontain><img src="res/icons/tray/xptour.png" onclick="apps.load('xptour').then(app => { if(app) app.start(); });"><img src="res/icons/tray/sound.png" ondblclick="apps.load('sndvol32').then(app => { if(app) app.start(); });"><img src="res/icons/tray/security.png" ondblclick="apps.load('tbd').then(app => { if(app) app.start(); });"><span id="clock"></span></traycontain><contextmenu class="taskbar-menu"><ul><li class="submenuholder"><span>Toolbars</span><ul><li><span>Links</span></li><li><span>Desktop</span></li><li><span>Quick Launch</span></li><li class="divider"></li><li><span>New Toolbar...</span></li></ul></li><li class="divider"></li><li><span>Adjust Date/Time</span></li><li><span>Customize Notifications...</span></li><li class="divider"></li><li class="disabled"><span>Cascade Windows</span></li><li class="disabled"><span>Tile Windows Horizontally</span></li><li class="disabled"><span>Tile Windows Vertically</span></li><li><span>Show the Desktop</span></li><li class="divider"></li><li onclick="apps.load('taskmgr').then(app => { if(app) app.start(); }); wm.closeStartMenu();"><span>Task Manager</span></li><li class="divider"></li><li class="disabled"><span>Lock the Taskbar</span></li><li onclick="apps.load('startprops').then(app => { if(app) app.start(); }); wm.closeStartMenu();"><span>Properties</span></li></ul></contextmenu></trayarea>`;
    classicStartmenuTemplate = `<div id="banner"></div><links><ul id="links"><li class="submenuholder"><img src="res/icons/start/programgroup.png">Programs<ul class="submenu" id="start-programs"></ul></li><li class="submenuholder"><img src="res/icons/start/recentfiles.png">Documents<ul id="start-documents"><li data-action="open-mydocs" class="new"><a><img src="res/icons/tray/mydocuments.png">My Documents</a></li></ul></li><li class="submenuholder"><img src="res/icons/start/control.png">Settings<ul id="start-settings"><li data-action="open-control"><a><img src="res/icons/tray/control.png">Control Panel</a></li><li><a><img src="res/icons/tray/connections.png">Network Connections</a></li><li><a><img src="res/icons/tray/printfax.png">Printers and Faxes</a></li><li data-action="open-startprops"><a><img src="res/icons/tray/startmenu.png">Taskbar & Start Menu</a></li></ul></li><li class="submenuholder"><img src="res/icons/start/search.png">Search<ul id="start-find"><li><a><img src="res/icons/tray/rundll.png">For Files or Folders...</a></li><li><a><img src="res/icons/tray/netsearch.png">On the Internet...</a></li><li><a><img src="res/icons/tray/users.png">For People...</a></li></ul></li><li data-action="open-help"><img src="res/icons/start/help.png">Help and Support</li><li data-action="open-run"><img src="res/icons/start/run.png">Run...</li></ul><ul id="poweropt"><li onclick="window.wm.openOverlay(); window.wm.openLogoffOptions();"><img src="res/icons/start/logoff.png">Log Off User...</li><li onclick="window.wm.openOverlay(); window.wm.openPowerOptions();"><img src="res/icons/start/shutdown.png">Shut Down...</li></ul></links>`;
    startmenuTemplate = `<userbar><usericon><img src="res/users/chess.bmp"><span>Administrator</span></usericon></userbar><links><applinks><ul id="pinnedapps"><li data-app-id="iexplore"><img src="res/icons/iexplore.png"><span class="title">Internet</span><span class="name">Internet Explorer</span></li><li data-app-id="outlook"><img src="res/icons/outlook.png"><span class="title">E-mail</span><span class="name">Outlook Express</span></li></ul><ul id="userapps"><li data-app-id="winamp"><img src="res/icons/winamp.png">Winamp</li><li data-app-id="regedit"><img src="res/icons/regedit.png">Registry Editor</li><li data-app-id="xptour"><img src="res/icons/xptour.png">Tour Windows XP</li><li data-app-id="winmine"><img src="res/icons/mines.png">Minesweeper</li><li data-app-id="cmd"><img src="res/icons/cmd.png">Command Prompt</li></ul><ul id="allapps"><li class="submenuHolder">All Programs<progarrow></progarrow><ul class="submenu" id="start-programs"></ul></li></ul></applinks><syslinks><ul id="syslocations"><li data-id="userdocs"><img src="res/icons/mydocuments.png">My Documents</li><li data-id="userrecent" class="disabled"><img src="res/icons/recentfiles.png">My Recent Documents</li><li data-id="userpics"><img src="res/icons/mypictures.png">My Pictures</li><li data-id="usermusic"><img src="res/icons/mymusic.png">My Music</li><li data-action="open-mycomputer"><img src="res/icons/mycomputer.png">My Computer</li></ul><ul id="settings"><li data-action="open-control"><img src="res/icons/control.png">Control Panel</li><li data-action="open-appwiz"><img src="res/icons/defaults.png">Set Program Defaults</li></ul><ul id="support"><li data-action="open-help"><img src="res/icons/help.png">Help and Support</li><li data-action="open-tbd"><img src="res/icons/search.png">Search</li><li data-action="open-run"><img src="res/icons/run.png">Run...</li></ul></syslinks></links><poweropt><powercontain><btncontain onclick="window.wm.openOverlay(); window.wm.openLogoffOptions();"><softbutton class="yellow logoff"></softbutton><span><u>L</u>og Off</span></btncontain><btncontain onclick="window.wm.openOverlay(); window.wm.openPowerOptions();"><softbutton class="red shutdown"></softbutton><span>T<u>u</u>rn Off Computer</span></btncontain></powercontain></poweropt>`;
    desktopTemplate = `<scene_iconspace></scene_iconspace><scene_windowspace></scene_windowspace><scene_shell></scene_shell><contextmenu><ul><li class="submenuholder disabled"><span>Arrange Icons By</span></li><li onclick="if (this.closest('contextmenu.visible')) { this.closest('contextmenu.visible').remove(); } window.explorer.setupDesktop();"><span>Refresh</span></li><li class="divider"></li><li data-action="paste-clipboard" class="disabled"><span>Paste</span></li><li data-action="paste-shortcut" class="disabled"><span>Paste Shortcut</span></li><li class="divider"></li><li class="submenuholder" data-action-group="new"><span>New</span><ul class="submenu"><li data-action="new-folder"><span>Folder</span></li><li data-action="new-txt"><span>Text Document</span></li><li data-action="new-bmp"><span>Bitmap Image</span></li><li class="divider"></li><li data-action="upload-computer"><span>Upload from Computer...</span></li></ul></li><li class="divider"></li><li onclick="apps.load('desk').then(app => { if(app) app.start(); }); if (this.closest('contextmenu.visible')) { this.closest('contextmenu.visible').remove(); }"><span>Properties</span></li></ul></contextmenu>`;
    menuEntryTemplate = `<a><img src="res/icons/tray/default.png"><span>Default Item</span></a>`;
    toggleStorage = {
        taskbarAutoHide: ["if(wm._desktop && wm._desktop.querySelector('taskbar')) wm._desktop.querySelector('taskbar').classList.add('autohide');", "if(wm._desktop && wm._desktop.querySelector('taskbar')) wm._desktop.querySelector('taskbar').classList.remove('autohide');"],
        quickLaunch: ["if(wm._desktop && wm._desktop.querySelector('taskbar quicklaunch')) wm._desktop.querySelector('taskbar quicklaunch').style.display='flex';", "if(wm._desktop && wm._desktop.querySelector('taskbar quicklaunch')) wm._desktop.querySelector('taskbar quicklaunch').style.display='none';"],
        classicStart: ["this.setupStartMenu(this._currentUser);", "this.setupStartMenu(this._currentUser);"],
        noClock: ["if(wm._desktop && wm._desktop.querySelector('taskbar #clock')) wm._desktop.querySelector('taskbar #clock').style.display='none';", "if(wm._desktop && wm._desktop.querySelector('taskbar #clock')) wm._desktop.querySelector('taskbar #clock').style.display='unset';"],
        taskbarOnTop: ["if(wm._desktop && wm._desktop.querySelector('taskbar')) wm._desktop.querySelector('taskbar').style.zIndex='999999';", "if(wm._desktop && wm._desktop.querySelector('taskbar')) wm._desktop.querySelector('taskbar').style.zIndex='0';"],
        noExplorerSidebar: ["this.refreshAllExplorersAndDesktop();", "this.refreshAllExplorersAndDesktop();"],
        showHiddenContents: ["this.refreshAllExplorersAndDesktop();", "this.refreshAllExplorersAndDesktop();"],
        showFileExtensions: ["this.refreshAllExplorersAndDesktop();", "this.refreshAllExplorersAndDesktop();"],
        fullPathInTitle: ["this.refreshAllExplorersAndDesktop();", "this.refreshAllExplorersAndDesktop();"]
    };
    _origin = document.querySelector("scene_holder");
    _dither = document.querySelector("#ditherpixels");
    _crt = document.querySelector("#crteffect");
    _logon = document.querySelector("scene_logon");
    _boot = document.querySelector("scene_bootscreen");
    _userDesktop; _userShell; _desktopInsert; _taskbarInsert; _startmenuInsert;
    _classicStartmenuInsert; _currentUser; _loggedOnUsers = []; _systemDesktop;
    _programInsert; _submenuInsert; _fastlogon = false;
    _availablePfpsForUserAccounts = [
        'airplane.bmp', 'astronaut.bmp', 'ball.bmp', 'beach.bmp', 'butterfly.bmp', 'car.bmp', 'cat.bmp', 'chess.bmp', 'dirt_bike.bmp', 'dog.bmp', 'drip.bmp', 'duck.bmp', 'fish.bmp', 'frog.bmp', 'guest.bmp', 'guitar.bmp', 'horses.bmp', 'kick.bmp', 'lift-off.bmp', 'palm_tree.bmp', 'pink_flower.bmp', 'red_flower.bmp', 'skater.bmp', 'snowflake.bmp'
    ];
    _isDraggingSelectionBox = false;
    _selectionBox = null;
    _selectionStartX = 0;
    _selectionStartY = 0;
    constructor() {
        this.startmenuContents = '';
    }
    async setup() {
        this._desktopInsert = document.createElement("scene_desktop");
        this._desktopInsert.innerHTML = this.desktopTemplate;
        this._taskbarInsert = document.createElement("taskbar");
        this._taskbarInsert.innerHTML = this.taskbarTemplate;
        this._startmenuInsert = document.createElement("startmenu");
        this._startmenuInsert.innerHTML = this.startmenuTemplate;
        this._startmenuInsert.classList.add("hidden");
        this._classicStartmenuInsert = document.createElement("startmenu");
        this._classicStartmenuInsert.innerHTML = this.classicStartmenuTemplate;
        this._classicStartmenuInsert.classList.add("classic");
        this._classicStartmenuInsert.classList.add("hidden");
        this._programInsert = document.createElement("li");
        this._programInsert.innerHTML = this.menuEntryTemplate;
        this._submenuInsert = document.createElement("ul");
        this._submenuInsert.classList.add("submenu");
        this._systemDesktop = document.querySelector("scene_desktop[data-env='system']");
        if (!this._systemDesktop) {
            this._systemDesktop = document.createElement('scene_desktop');
            this._systemDesktop.dataset.env = "system";
            this._systemDesktop.style.background = "none"; this._systemDesktop.style.zIndex = "2"; this._systemDesktop.style.pointerEvents = "none";
            this._origin.insertBefore(this._systemDesktop, this._origin.querySelector('scene_bootscreen'));
        }
        if (!this._systemDesktop.querySelector('scene_windowspace')) {
            const ws = document.createElement('scene_windowspace');
            this._systemDesktop.appendChild(ws);
        }
        if (!this._systemDesktop.querySelector('scene_shell')) {
            const sh = document.createElement('scene_shell');
            sh.style.display = "none"; sh.innerHTML = `<taskbar><taskarea></taskarea></taskbar>`;
            this._systemDesktop.appendChild(sh);
        }
        this._selectionBox = document.getElementById('selection-rectangle');
        if (localStorage.getItem("bootDelay") == null) localStorage.setItem("bootDelay", "4000");
        if (localStorage.getItem("devMode") == "true") { localStorage.setItem("bootDelay", "0"); this._fastlogon = true; }
        dm.addEventListener('fileChanged', (event) => {
            const startMenuPathAllUsers = DiskManager.USER_PROFILES_BASE_PATH + '/All Users/Start Menu';
            const startMenuProgramsPath = `${DiskManager.USER_PROFILES_BASE_PATH}/All Users/Start Menu/Programs`;
            const startMenuPathCurrentUser = this._currentUser ? `${DiskManager.USER_PROFILES_BASE_PATH}/${this._currentUser}/Start Menu` : null;
            let relevantPathForStartMenu = event.detail.path;
            let relevantPathForDesktop = event.detail.path;
            if (event.detail.type === 'rename') {
                if (event.detail.oldPath && (event.detail.oldPath.startsWith(startMenuPathAllUsers) || (startMenuPathCurrentUser && event.detail.oldPath.startsWith(startMenuPathCurrentUser)))) { relevantPathForStartMenu = event.detail.oldPath; }
                else if (event.detail.newPath && (event.detail.newPath.startsWith(startMenuPathAllUsers) || (startMenuPathCurrentUser && event.detail.newPath.startsWith(startMenuPathCurrentUser)))) { relevantPathForStartMenu = event.detail.newPath; }
                if (this._currentUser) {
                    const desktopPrefix = `${DiskManager.USER_PROFILES_BASE_PATH}/${this._currentUser}/Desktop`;
                    if (event.detail.oldPath && event.detail.oldPath.startsWith(desktopPrefix)) { relevantPathForDesktop = event.detail.oldPath; }
                    else if (event.detail.newPath && event.detail.newPath.startsWith(desktopPrefix)) { relevantPathForDesktop = event.detail.newPath; }
                }
            }
            if (relevantPathForStartMenu && (relevantPathForStartMenu.startsWith(startMenuProgramsPath) || (startMenuPathCurrentUser && relevantPathForStartMenu.startsWith(startMenuPathCurrentUser))) && this._currentUser && wm._desktop && wm._desktop.id === this._currentUser) { this.setupStartMenu(this._currentUser); }
            if (this._currentUser && relevantPathForDesktop && relevantPathForDesktop.startsWith(`${DiskManager.USER_PROFILES_BASE_PATH}/${this._currentUser}/Desktop`)) { if (window.explorer) { window.explorer.setupDesktop(); } }
        });
        dm.addEventListener('drivePopulated', (event) => {
            if (event.detail.drive === 'C' && event.detail.type === 'system' && event.detail.status === 'success' && this._currentUser && wm._desktop && wm._desktop.id === this._currentUser) {
                this.setupStartMenu(this._currentUser);
                if (window.explorer && typeof window.explorer.setupDesktop === 'function') { window.explorer.setupDesktop(); }
            }
        });
        window.addEventListener('usersUpdated', () => { this.populateLogonScreen(); });
        if (!window._appStoreGlobalMessageHandler) {
            window.addEventListener('message', handleGlobalAppStoreMessages);
            window._appStoreGlobalMessageHandler = true;
        }
        if (typeof handleFlatFileAppStoreInstallRequest === 'function') { this.handleAppStoreInstallRequest = handleFlatFileAppStoreInstallRequest; }
        if (typeof handleFlatFileAppStoreUninstallRequest === 'function') { this.handleAppStoreUninstallRequest = handleFlatFileAppStoreUninstallRequest; }
    }
    async populateLogonScreen() {
        const logonRightContain = this._logon.querySelector("rightcontain");
        if (!logonRightContain) return;
        logonRightContain.innerHTML = '';
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.length === 0 && localStorage.getItem("oobepassed")) {
            localStorage.removeItem("oobepassed");
            localStorage.removeItem('cDriveSystemVersion');
            localStorage.removeItem('eDriveVersion');
            await this.runOobe();
            return;
        }
        users.forEach(user => {
            const userEl = document.createElement('user');
            userEl.id = user.username;
            userEl.setAttribute('data-theme', user.theme || 'luna');
            userEl.setAttribute('data-style', user.style || 'blue');
            userEl.setAttribute('data-wallpaper', user.wallpaper || 'stock-wallpapers/Bliss.jpg');
            userEl.setAttribute('data-wpmode', user.wpMode || 'stretch');
            userEl.onclick = () => this.logonUser(userEl);
            const pfp = user.pfp || 'res/users/chess.bmp';
            userEl.innerHTML = `<a><usericon><img src="${pfp}"><span class="name">${user.username}</span><span class="apps"></span></usericon></a>`;
            logonRightContain.appendChild(userEl);
        });
    }
    async setupUserProfilesVFS(usersToCreate) {
        await dm.ready();
        const defaultUserTemplatePath = `${DiskManager.USER_PROFILES_BASE_PATH}/Default User`;

        for (const user of usersToCreate) {
            const userBasePath = `${DiskManager.USER_PROFILES_BASE_PATH}/${user.username}`;
            try {
                await dm.mkdir(userBasePath).catch(() => { });
                const myDocsPath = dm.join(userBasePath, "My Documents");
                await dm.mkdir(myDocsPath).catch(() => { });
                const defaultMyDocsPath = dm.join(defaultUserTemplatePath, "My Documents");
                const defaultMyDocsItems = await dm.list(defaultMyDocsPath);
                for (const item of defaultMyDocsItems) {
                    await dm.copy(item.id, myDocsPath);
                }
                const desktopPath = dm.join(userBasePath, "Desktop");
                await dm.mkdir(desktopPath).catch(() => { });
                const startMenuPath = dm.join(userBasePath, "Start Menu");
                await dm.mkdir(startMenuPath).catch(() => { });
                await dm.mkdir(dm.join(startMenuPath, "Programs")).catch(() => { });
                const defaultDesktopPath = dm.join(defaultUserTemplatePath, "Desktop");
                const defaultStartMenuPath = dm.join(defaultUserTemplatePath, "Start Menu");
                const defaultDesktopItems = await dm.list(defaultDesktopPath);
                for (const item of defaultDesktopItems) {
                    await dm.copy(item.id, desktopPath);
                }
                const defaultStartMenuItems = await dm.list(defaultStartMenuPath);
                for (const item of defaultStartMenuItems) {
                    await dm.copy(item.id, startMenuPath);
                }
            } catch (e) {
                console.error(`Failed to set up VFS profile for ${user.username}:`, e);
            }
        }
    }
    createWindowManagerLinks(userInstance, userTaskbar, userStart) {
        window.wm._desktop = userInstance;
        window.wm._windowspace = userInstance.querySelector("scene_windowspace");
        window.wm._taskholder = userTaskbar.querySelector("taskarea");
        window.wm._startButton = userTaskbar.querySelector("startbtn");
        window.wm._startMenu = userStart;
        window.wm._startButton.onclick = () => wm.toggleStartMenu();
        userInstance.addEventListener("click", e => {
            if (e.target === userInstance || e.target.matches('scene_iconspace')) {
                window.wm.defocusAllWindows();
                userInstance.querySelectorAll('fsicon.selected').forEach(icon => icon.classList.remove('selected'));
            }
        });
        window.explorer.addDropHandlers(userInstance, `${DiskManager.USER_PROFILES_BASE_PATH}/${this._currentUser}/Desktop`);
        userInstance.addEventListener('contextmenu', (event) => {
            if (event.target === userInstance || event.target.matches('scene_iconspace')) {
                event.preventDefault();
                event.stopPropagation();
                this._showDesktopContextMenu(event);
            }
        });
        if (this._selectionBox) {
            const startSelection = (e) => {
                if (e.target !== userInstance && e.target !== userInstance.querySelector('scene_iconspace')) {
                    return;
                }
                e.preventDefault();
                userInstance.appendChild(this._selectionBox);
                this._isDraggingSelectionBox = true;
                this._selectionBox.style.display = 'block';
                const desktopRect = userInstance.getBoundingClientRect();
                this._selectionStartX = e.clientX - desktopRect.left;
                this._selectionStartY = e.clientY - desktopRect.top;
                this._selectionBox.style.left = `${this._selectionStartX}px`;
                this._selectionBox.style.top = `${this._selectionStartY}px`;
                this._selectionBox.style.width = '0px';
                this._selectionBox.style.height = '0px';
                document.addEventListener('pointermove', dragSelection);
                document.addEventListener('pointerup', endSelection, { once: true });
            };
            const dragSelection = (e) => {
                if (!this._isDraggingSelectionBox) return;
                e.preventDefault();
                const desktopRect = userInstance.getBoundingClientRect();
                let currentX = e.clientX - desktopRect.left;
                let currentY = e.clientY - desktopRect.top;
                let newLeft = Math.min(currentX, this._selectionStartX);
                let newTop = Math.min(currentY, this._selectionStartY);
                let newWidth = Math.abs(currentX - this._selectionStartX);
                let newHeight = Math.abs(currentY - this._selectionStartY);
                this._selectionBox.style.left = `${newLeft}px`;
                this._selectionBox.style.top = `${newTop}px`;
                this._selectionBox.style.width = `${newWidth}px`;
                this._selectionBox.style.height = `${newHeight}px`;
            };
            const endSelection = (e) => {
                this._isDraggingSelectionBox = false;
                this._selectionBox.style.display = 'none';
                document.removeEventListener('pointermove', dragSelection);
            };
            userInstance.addEventListener('pointerdown', startSelection);
        }
    }
    _showDesktopContextMenu(event) {
        wm._desktop.querySelectorAll("contextmenu.visible:not(.taskbar-menu)").forEach(cm => cm.remove());
        const menuTemplate = this._desktopInsert.querySelector('contextmenu');
        if (!menuTemplate) return;
        const menu = menuTemplate.cloneNode(true);
        menu.classList.add('visible');
        wm._contextParent = wm._desktop;
        menu.querySelectorAll('[data-action-group="new"] li[data-action]').forEach(item => {
            item.onclick = async (e) => {
                e.stopPropagation(); menu.remove();
                const action = item.dataset.action;
                const desktopPath = `${DiskManager.USER_PROFILES_BASE_PATH}/${this._currentUser}/Desktop`;
                await window.explorer._handleNewItem(action, desktopPath, null);
            };
        });
        const pasteItem = menu.querySelector('li[data-action="paste-clipboard"]');
        if (pasteItem) {
            if (window.explorer && window.explorer.clipboard && window.explorer.clipboard.path) {
                pasteItem.classList.remove('disabled');
                pasteItem.onclick = async (e) => {
                    e.stopPropagation(); menu.remove();
                    const desktopPath = `${DiskManager.USER_PROFILES_BASE_PATH}/${this._currentUser}/Desktop`;
                    await window.explorer._handlePaste(desktopPath, null);
                };
            } else { pasteItem.classList.add('disabled'); }
        }
        const propertiesItem = menu.querySelector('li[onclick*="apps.load(\'desk\')"]');
        if (propertiesItem) {
            propertiesItem.onclick = (e) => {
                e.stopPropagation(); menu.remove();
                apps.load('desk').then(app => { if (app) app.start(); });
            };
        }
        const refreshItem = menu.querySelector('li[onclick*="window.explorer.setupDesktop()"]');
        if (refreshItem) {
            refreshItem.onclick = (e) => {
                e.stopPropagation(); menu.remove();
                window.explorer.setupDesktop();
            };
        }
        wm._desktop.appendChild(menu);
        window.explorer._positionContextMenu(event, menu, wm._desktop);
    }
    async _addMenuItemFromNode(node, parentElement) {
        if (node.metadata && node.metadata.hidden && !(localStorage.getItem(`user_${this._currentUser}.showHiddenContents`) === 'true')) { return null; }
        const itemNameWithoutExt = node.name.includes('.') && node.name.toLowerCase().endsWith('.lnk') ? node.name.substring(0, node.name.lastIndexOf('.')) : node.name;
        let menuItem = this._programInsert.cloneNode(true);
        menuItem.querySelector("span").innerText = itemNameWithoutExt;
        menuItem.onclick = null;
        let iconSrcPath = 'res/icons/tray/default.png';
        if (window.ExplorerWindow && typeof window.ExplorerWindow.determineIconName === 'function' && window.explorer && window.explorer._vfsIconObjectUrls) {
            const iconInfo = await window.ExplorerWindow.determineIconName(node, window.explorer._vfsIconObjectUrls);
            if (iconInfo.isVfsObjectUrl) {
                iconSrcPath = iconInfo.src;
            } else { iconSrcPath = `res/icons/tray/${iconInfo.iconNameForWM || 'default.png'}`; }
        } else {
            let fallbackIconName = 'default.png';
            if (node.type === 'folder') {
                fallbackIconName = (node.metadata && node.metadata.icon && !node.metadata.icon.startsWith("C:/")) ? node.metadata.icon : 'programgroup.png';
            } else if (node.type === 'file' && node.metadata && node.metadata.icon) {
                if (node.metadata.icon.startsWith("C:/")) {
                    try {
                        const iconFileNode = await dm.open(node.metadata.icon);
                        if (iconFileNode && iconFileNode.content instanceof Blob) {
                            iconSrcPath = URL.createObjectURL(iconFileNode.content);
                            if (window.explorer && window.explorer._vfsIconObjectUrls) { window.explorer._vfsIconObjectUrls.set(node.metadata.icon, iconSrcPath); }
                        } else { iconSrcPath = `res/icons/tray/${fallbackIconName}`; }
                    } catch (e) { iconSrcPath = `res/icons/tray/${fallbackIconName}`; }
                } else { fallbackIconName = node.metadata.icon; iconSrcPath = `res/icons/tray/${fallbackIconName}`; }
            }
            if (!iconSrcPath.startsWith('blob:')) { iconSrcPath = `res/icons/tray/${fallbackIconName}`; }
        }
        menuItem.querySelector("img").src = iconSrcPath;
        if (node.type === 'folder') {
            menuItem.classList.add("submenuHolder");
            let subMenuUl = this._submenuInsert.cloneNode(true);
            menuItem.appendChild(subMenuUl);
            const subItems = await dm.list(node.id);
            const sortedSubItems = subItems
                .filter(subNode => !(subNode.metadata && subNode.metadata.hidden && !(localStorage.getItem(`user_${this._currentUser}.showHiddenContents`) === 'true')))
                .sort((a, b) => (a.type === 'folder' && b.type !== 'folder') ? -1 : (a.type !== 'folder' && b.type === 'folder') ? 1 : a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            if (sortedSubItems.length === 0) {
                let emptyItem = document.createElement("li");
                emptyItem.classList.add("empty");
                emptyItem.innerHTML = '<a><img src="res/icons/tray/empty.png">(Empty)</a>';
                subMenuUl.appendChild(emptyItem);
            } else {
                for (const subNode of sortedSubItems) { await this._addMenuItemFromNode(subNode, subMenuUl); }
            }
        } else if (node.type === 'file') {
            menuItem.classList.add("new");
            menuItem.addEventListener('click', async (e) => {
                e.preventDefault(); e.stopPropagation();
                await window.explorer._handleItemDoubleClick(node.id, node.type, node.name.split('.').pop(), null, null, node);
                wm.closeStartMenu();
            });
        }
        parentElement.appendChild(menuItem);
        return menuItem;
    }
    async setupStartMenuItems(targetDiv) {
        await dm.ready();
        if (!targetDiv) return;
        targetDiv.innerHTML = "";
        const allUsersStartMenuPath = `${DiskManager.USER_PROFILES_BASE_PATH}/All Users/Start Menu`;
        const currentUserStartMenuPath = `${DiskManager.USER_PROFILES_BASE_PATH}/${this._currentUser}/Start Menu`;
        let itemsProcessedCount = 0;
        const processDirectoryItems = async (dirPath, excludeFolderName = null) => {
            try {
                const nodes = await dm.list(dirPath);
                const sortedNodes = nodes
                    .filter(node => {
                        if (excludeFolderName && node.name.toLowerCase() === excludeFolderName.toLowerCase() && node.type === 'folder') return false;
                        return !(node.metadata && node.metadata.hidden && !(localStorage.getItem(`user_${this._currentUser}.showHiddenContents`) === 'true'));
                    })
                    .sort((a, b) => (a.type === 'folder' && b.type !== 'folder') ? -1 : (a.type !== 'folder' && b.type === 'folder') ? 1 : a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                for (const node of sortedNodes) {
                    await this._addMenuItemFromNode(node, targetDiv);
                    itemsProcessedCount++;
                }
                return sortedNodes.length > 0;
            } catch (e) { return false; }
        };
        await processDirectoryItems(allUsersStartMenuPath, "Programs");
        await processDirectoryItems(currentUserStartMenuPath, "Programs");
        let hasAddedDivider = false;
        if (itemsProcessedCount > 0 && targetDiv.children.length > 0) {
            let divider = document.createElement("li"); divider.classList.add("divider"); targetDiv.appendChild(divider);
            hasAddedDivider = true;
        }
        await processDirectoryItems(`${allUsersStartMenuPath}/Programs`);
        await processDirectoryItems(`${currentUserStartMenuPath}/Programs`);
        if (targetDiv.children.length === 0 || (targetDiv.children.length === 1 && targetDiv.firstElementChild.classList.contains('empty'))) {
            targetDiv.innerHTML = '<li class="empty"><a><img src="res/icons/tray/empty.png">(Empty)</a></li>';
        } else {
            const lastChild = targetDiv.lastElementChild;
            if (lastChild && lastChild.classList.contains('divider') && targetDiv.children.length === itemsProcessedCount + (hasAddedDivider ? 1 : 0)) { lastChild.remove(); }
            if (targetDiv.children.length === 1 && targetDiv.firstElementChild.classList.contains('divider')) { targetDiv.firstElementChild.remove(); }
        }
    }
    async setupStartMenu(username) {
        const userDesktopElement = this._origin.querySelector(`scene_desktop#${CSS.escape(username)}`);
        if (!userDesktopElement) return null;
        const existingStartMenu = userDesktopElement.querySelector("startmenu");
        if (existingStartMenu) existingStartMenu.remove();
        let userStart;
        const userStoragePrefix = `user_${username}`;
        const isClassic = localStorage.getItem(`${userStoragePrefix}.classicStart`) === "true";
        const programsContainerTargetID = "start-programs";
        if (!isClassic) {
            userStart = this._startmenuInsert.cloneNode(true);
            const userbar = userStart.querySelector("userbar");
            if (userbar) {
                userbar.querySelector("span").innerText = username;
                const pfpPath = localStorage.getItem(`${userStoragePrefix}.userIcon`);
                if (pfpPath) userbar.querySelector("img").src = pfpPath;
                else userbar.querySelector("img").src = 'res/users/chess.bmp';
            }
            userStart.querySelectorAll('#pinnedapps li[data-app-id], #userapps li[data-app-id]').forEach(li => {
                li.addEventListener('click', (e) => {
                    e.stopPropagation(); const appId = li.dataset.appId;
                    if (appId) apps.load(appId).then(app => { if (app && typeof app.start === 'function') app.start(); else if (app) console.warn(`${appId} loaded but no start function.`); });
                    wm.closeStartMenu();
                });
            });
            userStart.querySelector("[data-id='userdocs']").onclick = () => { window.explorer.open(`${DiskManager.USER_PROFILES_BASE_PATH}/${username}/My Documents`); wm.closeStartMenu(); };
            userStart.querySelector("[data-id='userpics']").onclick = () => { window.explorer.open(`${DiskManager.USER_PROFILES_BASE_PATH}/${username}/My Documents/My Pictures`); wm.closeStartMenu(); };
            userStart.querySelector("[data-id='usermusic']").onclick = () => { window.explorer.open(`${DiskManager.USER_PROFILES_BASE_PATH}/${username}/My Documents/My Music`); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-mycomputer']").onclick = () => { window.explorer.open(''); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-control']").onclick = () => { apps.load('control').then(a => { if (a) a.start(); }); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-appwiz']").onclick = () => { apps.load('appwiz').then(app => { if (app) app.start(); }); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-help']").onclick = () => { apps.load('help').then(a => { if (a) a.start(); }); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-run']").onclick = () => { apps.load('run').then(a => { if (a) a.start(); }); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-tbd']").onclick = () => { apps.load('tbd').then(a => { if (a) a.start(); }); wm.closeStartMenu(); };
            await this.setupStartMenuItems(userStart.querySelector(`#${programsContainerTargetID}`));
        } else {
            userStart = this._classicStartmenuInsert.cloneNode(true);
            const logoffLi = userStart.querySelector("ul#poweropt li:first-child");
            if (logoffLi) logoffLi.innerHTML = `<img src="res/icons/start/logoff.png">Log off ${username}...`;
            userStart.querySelector("[data-action='open-mydocs']").onclick = () => { window.explorer.open(DiskManager.USER_PROFILES_BASE_PATH + '/' + this._currentUser + '/My Documents'); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-control']").onclick = () => { apps.load('control').then(a => { if (a) a.start(); }); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-startprops']").onclick = () => { apps.load('startprops').then(a => { if (a) a.start(); }); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-help']").onclick = () => { apps.load('help').then(a => { if (a) a.start(); }); wm.closeStartMenu(); };
            userStart.querySelector("[data-action='open-run']").onclick = () => { apps.load('run').then(a => { if (a) a.start(); }); wm.closeStartMenu(); };
            await this.setupStartMenuItems(userStart.querySelector(`#${programsContainerTargetID}`));
        }
        const userShellInDesktop = userDesktopElement.querySelector("scene_shell");
        if (userShellInDesktop) userShellInDesktop.appendChild(userStart);
        if (window.wm._desktop && window.wm._desktop.id === username) { window.wm._startMenu = userStart; }
        return userStart;
    }
    async setupUser(username, pfp, userWallpaper, userWallpaperMode, isCurrentUserSwitch = false) {
        if (!isCurrentUserSwitch) { this._currentUser = username; if (!this._loggedOnUsers.includes(username)) this._loggedOnUsers.push(username); }
        let userInstance = this._desktopInsert.cloneNode(true);
        this._origin.appendChild(userInstance);
        this._userShell = userInstance.querySelector("scene_shell");
        let userTaskbar = this._taskbarInsert.cloneNode(true);
        this._userShell.appendChild(userTaskbar);
        userInstance.id = username;
        const userIndex = this._loggedOnUsers.indexOf(username);
        userInstance.setAttribute("userId", String(userIndex === -1 ? this._loggedOnUsers.length : userIndex));
        let userStart = await this.setupStartMenu(username);
        this.createWindowManagerLinks(userInstance, userTaskbar, userStart);
        themehandler.changeWallpaper(userWallpaper, userWallpaperMode);
        const clockElement = this._userShell.querySelector("#clock");
        if (clockElement) { this._updateClock(clockElement); setInterval(() => this._updateClock(clockElement), 15000); }
        await window.explorer.setupDesktop();
        this._logon.style.display = "none"; this._logon.classList.remove("isLoggingOn");
        const userLogonTile = this._logon.querySelector(`user#${CSS.escape(username)}`);
        if (userLogonTile) {
            userLogonTile.classList.remove("active");
            const appsSpan = userLogonTile.querySelector(".apps");
            if (appsSpan) appsSpan.innerText = "";
        }
        const desktopScene = this._origin.querySelector(`scene_desktop#${CSS.escape(username)}`);
        if (desktopScene) desktopScene.style.display = "block";
        if (!isCurrentUserSwitch) this.playSystemSound("startup");
        setTimeout(() => { this.playSystemSound("balloon"); }, 8000);
        if (localStorage.getItem('showUpdateChangelog') === 'true') {
            setTimeout(() => {
                if (window.apps && typeof apps.load === 'function') {
                    apps.load('help').then(helpApp => {
                        if (helpApp && typeof helpApp.start === 'function') {
                            helpApp.start({ page: 'updates' });
                        }
                    });
                }
                localStorage.removeItem('showUpdateChangelog');
            }, 1500);
        }
    }
    _updateClock(clockElement) {
        if (!clockElement) return;
        var e = new Date(), t = e.getHours(), n = t > 11, r = (n ? t - 12 : t) || 12, a = "" + e.getMinutes();
        a.length < 2 && (a = "0" + a); var c = r + ":" + a + (n ? " PM" : " AM");
        clockElement.innerText = c;
    }
    switchLogon(isTrueLogoff = false) {
        let appCount = 0;
        const userLoggingOff = this._currentUser;
        if (userLoggingOff && window.wm._desktop && window.wm._desktop.id === userLoggingOff && window.wm._windowspace) { appCount = window.wm._windowspace.querySelectorAll("app").length; }
        if (userLoggingOff) {
            let userTile = this._logon.querySelector(`#${CSS.escape(userLoggingOff)}`);
            if (userTile) {
                if (isTrueLogoff) { userTile.classList.remove("running"); }
                else {
                    const appsSpan = userTile.querySelector("span.apps");
                    if (appsSpan) {
                        if (appCount === 0) appsSpan.innerText = `Logged on`;
                        else if (appCount === 1) appsSpan.innerText = `${appCount} program running.`;
                        else appsSpan.innerText = `${appCount} programs running.`;
                    }
                    userTile.classList.add("running");
                }
            }
        }
        if (!isTrueLogoff) this.playSystemSound("logoff");
        wm.closeOverlay();
        this._logon.style.display = "grid";
        if (userLoggingOff) {
            const desktopToHide = this._origin.querySelector(`scene_desktop#${CSS.escape(userLoggingOff)}`);
            if (desktopToHide) desktopToHide.style.display = "none";
        }
        this._currentUser = "";
        if (this._systemDesktop) { this._systemDesktop.style.display = "none"; }
        wm._desktop = this._systemDesktop;
        if (wm._desktop) {
            wm._windowspace = wm._desktop.querySelector("scene_windowspace");
            if (!wm._windowspace) { let tempSpace = document.createElement('scene_windowspace'); wm._desktop.appendChild(tempSpace); wm._windowspace = tempSpace; }
            wm._taskholder = null; wm._startButton = null; wm._startMenu = null;
        } else { wm._windowspace = null; wm._taskholder = null; wm._startButton = null; wm._startMenu = null; }
        themehandler.changeTheme("classic", "lunaFallback");
        window.dispatchEvent(new CustomEvent('shellUserSwitched', { detail: { username: null } }));
    }
    async logonUser(targetElement) {
        const username = targetElement.id;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userData = users.find(u => u.username === username);
        if (!userData) return;
        if (this._currentUser && this._currentUser !== username) {
            const currentDesktop = wm._desktop;
            if (currentDesktop) { currentDesktop.querySelectorAll("audio").forEach(track => { track.pause(); track.currentTime = 0; }); }
        }
        this._currentUser = username;
        const userStoragePrefix = `user_${username}`;
        if (!localStorage.getItem(`${userStoragePrefix}.isSetUp`)) {
            localStorage.setItem(`${userStoragePrefix}.userWallpaper`, userData.wallpaper);
            localStorage.setItem(`${userStoragePrefix}.userWallpaperMode`, userData.wpMode);
            localStorage.setItem(`${userStoragePrefix}.userIcon`, userData.pfp);
            localStorage.setItem(`${userStoragePrefix}.userName`, userData.username);
            localStorage.setItem(`${userStoragePrefix}.userTheme`, userData.theme);
            localStorage.setItem(`${userStoragePrefix}.userStyle`, userData.style);
            localStorage.setItem(`${userStoragePrefix}.isSetUp`, "true");
        }
        let pfpPath = localStorage.getItem(`${userStoragePrefix}.userIcon`) || userData.pfp;
        let userTheme = localStorage.getItem(`${userStoragePrefix}.userTheme`) || userData.theme;
        let userStyle = localStorage.getItem(`${userStoragePrefix}.userStyle`) || userData.style;
        let userWallpaper = localStorage.getItem(`${userStoragePrefix}.userWallpaper`) || userData.wallpaper;
        let userWallpaperMode = localStorage.getItem(`${userStoragePrefix}.userWallpaperMode`) || userData.wpMode;
        if (this._systemDesktop) this._systemDesktop.style.display = "none";
        themehandler.changeTheme(userTheme, userStyle);
        if (this._loggedOnUsers.includes(username)) { this.switchUser(username); }
        else {
            this._logon.classList.add("isLoggingOn");
            const userLogonTile = this._logon.querySelector(`user#${CSS.escape(username)}`);
            if (userLogonTile) {
                userLogonTile.classList.add("active");
                const appsSpan = userLogonTile.querySelector(".apps");
                if (appsSpan) appsSpan.innerText = "Loading your personal settings...";
            }
            const logonDelay = this._fastlogon ? 0 : 4000;
            setTimeout(() => { this.setupUser(username, pfpPath, userWallpaper, userWallpaperMode, false); }, logonDelay);
        }
    }
    async logoffUser(usernameToLogoff) {
        const currentDesktop = wm._desktop;
        if (!currentDesktop || currentDesktop.id !== usernameToLogoff) { }
        else if (currentDesktop && currentDesktop.id === usernameToLogoff && wm._windowspace && wm._windowspace.querySelectorAll("app").length !== 0) {
            dialogHandler.spawnDialog({
                icon: 'question', text: 'There are running programs. Quit anyway?', title: 'Log Off Windows',
                buttons: [['OK', async (e) => { wm.closeWindow(e.target.closest('app').id); if (wm._windowspace) { wm._windowspace.querySelectorAll("app").forEach(app => wm.closeWindow(app.id)); } await this.performActualLogoff(usernameToLogoff); }], ['Cancel', (e) => wm.closeWindow(e.target.closest('app').id)]]
            });
            return;
        }
        await this.performActualLogoff(usernameToLogoff);
    }
    async performActualLogoff(usernameToLogoff) {
        await this.playSystemSound("shutdown"); this.switchLogon(true);
        const userDesktop = document.querySelector(`scene_desktop#${CSS.escape(usernameToLogoff)}`);
        if (userDesktop) {
            if (userDesktop._currentWallpaperObjectURL) { URL.revokeObjectURL(userDesktop._currentWallpaperObjectURL); delete userDesktop._currentWallpaperObjectURL; }
            userDesktop.remove();
        }
        const userLogonTile = this._logon.querySelector(`user#${CSS.escape(usernameToLogoff)}`);
        if (userLogonTile) {
            userLogonTile.classList.remove("running");
            const appsSpan = userLogonTile.querySelector(".apps");
            if (appsSpan) appsSpan.innerText = "";
        }
        this._loggedOnUsers = this._loggedOnUsers.filter(u => u !== usernameToLogoff);
        if (this._currentUser === usernameToLogoff) { this._currentUser = ""; }
    }
    switchUser(username) {
        if (!this._loggedOnUsers.includes(username)) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userData = users.find(u => u.username === username);
            if (userData) {
                const logonTile = this._logon.querySelector(`user#${CSS.escape(username)}`);
                if (logonTile) { this.logonUser(logonTile); }
            }
            return;
        }
        this.playSystemSound("logon"); this._logon.style.display = "none";
        if (this._systemDesktop) this._systemDesktop.style.display = "none";
        const oldCurrentUser = this._currentUser; this._currentUser = username;
        if (oldCurrentUser && oldCurrentUser !== username) {
            const oldDesktop = document.querySelector(`scene_desktop#${CSS.escape(oldCurrentUser)}`);
            if (oldDesktop) oldDesktop.style.display = "none";
        }
        const targetDesktop = document.querySelector(`scene_desktop#${CSS.escape(username)}`);
        if (targetDesktop) {
            document.querySelectorAll("scene_desktop:not([data-env='system'])").forEach(d => d.style.display = "none");
            targetDesktop.style.display = "block";
            window.wm._desktop = targetDesktop; window.wm._windowspace = targetDesktop.querySelector("scene_windowspace");
            window.wm._taskholder = targetDesktop.querySelector("taskarea"); window.wm._startButton = targetDesktop.querySelector("startbtn");
            window.wm._startMenu = targetDesktop.querySelector("startmenu");
            const userStoragePrefix = `user_${username}`;
            themehandler.changeTheme(localStorage.getItem(`${userStoragePrefix}.userTheme`), localStorage.getItem(`${userStoragePrefix}.userStyle`));
            themehandler.changeWallpaper(localStorage.getItem(`${userStoragePrefix}.userWallpaper`), localStorage.getItem(`${userStoragePrefix}.userWallpaperMode`));
        } else {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userData = users.find(u => u.username === username);
            if (userData) {
                const userStoragePrefix = `user_${username}`;
                this.setupUser(username, localStorage.getItem(`${userStoragePrefix}.userIcon`) || userData.pfp, localStorage.getItem(`${userStoragePrefix}.userWallpaper`) || userData.wallpaper, localStorage.getItem(`${userStoragePrefix}.userWallpaperMode`) || userData.wpMode, true);
            } else { this.switchLogon(false); }
        }
    }
    playSystemSound(soundname) {
        let systemAudio = document.getElementById("sound_system");
        if (systemAudio) { systemAudio.src = `res/sounds/${soundname}.wav`; systemAudio.play().catch(e => { }); }
    }
    handleToggle(toggleName, newStatusString) {
        const actions = this.toggleStorage[toggleName];
        const isUserSpecific = ['noExplorerSidebar', 'showHiddenContents', 'showFileExtensions', 'fullPathInTitle', 'classicStart', 'taskbarAutoHide', 'taskbarOnTop', 'quickLaunch', 'noClock'].includes(toggleName);
        let storageKey = toggleName;
        if (isUserSpecific && this._currentUser) { storageKey = `user_${this._currentUser}.${toggleName}`; }
        else if (isUserSpecific && !this._currentUser) { return; }
        if (actions) {
            try { eval(actions[newStatusString === "true" ? 0 : 1]); }
            catch (e) { if (!wm._desktop && (toggleName.includes('taskbar') || toggleName.includes('quickLaunch') || toggleName.includes('noClock') || toggleName.includes('taskbarOnTop'))) { } }
        }
        if (['showHiddenContents', 'showFileExtensions', 'noExplorerSidebar', 'fullPathInTitle'].includes(toggleName)) { this.refreshAllExplorersAndDesktop(); }
    }
    refreshAllExplorersAndDesktop() {
        if (window.explorer && typeof window.explorer.setupDesktop === 'function') { window.explorer.setupDesktop(); }
        document.querySelectorAll('app.explorer').forEach(appInstance => {
            if (appInstance.explorerWindowInstance && typeof appInstance.explorerWindowInstance.reload === 'function') { appInstance.explorerWindowInstance.reload(); }
            const noExplorerSidebarSetting = localStorage.getItem(this._currentUser ? `user_${this._currentUser}.noExplorerSidebar` : 'noExplorerSidebar');
            const appContentHolder = appInstance.querySelector('appcontentholder');
            if (appContentHolder) {
                if (noExplorerSidebarSetting === 'true') { appContentHolder.classList.add('nosidebar'); }
                else { appContentHolder.classList.remove('nosidebar'); }
            }
        });
    }
    async reboot() {
        if (window.wm && typeof window.wm.closeOverlay === 'function') {
            window.wm.closeOverlay();
        }

        this.playSystemSound("shutdown");


        const usersToLogoff = [...this._loggedOnUsers];
        for (const user of usersToLogoff) {
            await this.performActualLogoff(user);
        }

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }



    async _populateVFSForUpdate() {
        await window.dm.ready();

        const lastPopulatedVersion = localStorage.getItem('lastKnownAppVersion') || 'none';
        console.log(`Update detected (${lastPopulatedVersion} -> ${window.APP_VERSION}). Forcing VFS repopulation...`);

        try {
            await window.dm.populateCoreSystemDrive(true);

            if (localStorage.getItem("oobepassed") && localStorage.getItem("addCdGoodies") === "true") {
                await window.dm.populateEDriveFromJSON(true);
            }

            const currentClientVersion = window.APP_VERSION || "0.0.0";
            localStorage.setItem('cDriveSystemVersion', currentClientVersion);

            if (localStorage.getItem("addCdGoodies") === "true") {
                localStorage.setItem('eDriveVersion', currentClientVersion);
            }
            localStorage.setItem('lastKnownAppVersion', currentClientVersion);
            localStorage.setItem('showUpdateChangelog', 'true');

        } catch (vfsUpdateError) {
            console.error("A critical error occurred during VFS update:", vfsUpdateError);
            alert("A problem occurred while updating system files. The virtual drives may be inconsistent. Please try clearing site data if issues persist.");
            throw vfsUpdateError;
        }
    }

    async runOobe() {
        if (!localStorage.getItem("oobepassed")) {
            // Simply launch the OOBE app. It now controls the installation flow.
            const oobeApp = await apps.load("msoobe");
            if (oobeApp) oobeApp.start();
        } else {
            // This is a returning user, show the logon screen.
            await this.populateLogonScreen();
        }
    }

    async dismissBoot() {
        const bootDelay = parseInt(localStorage.getItem("bootDelay") || "4000");

        const proceedAfterBoot = async () => {
            this._boot.classList.add("loaded");

            const lastKnownVersionKey = 'lastKnownAppVersion';
            const lastPopulatedVersion = localStorage.getItem(lastKnownVersionKey);
            const needsUpdate = lastPopulatedVersion !== window.APP_VERSION;
            const isFirstRun = !localStorage.getItem("oobepassed");

            if (needsUpdate && !isFirstRun) {
                // This is a returning user who needs an update. Handle it here.
                const updateScreen = this._origin.querySelector('scene_updatescreen_xp');
                const updateText = updateScreen.querySelector('#update-xp-text');
                updateScreen.classList.add('active');

                const updateProgressListener = (event) => {
                    const { completed, total } = event.detail;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 100;
                    if (updateText) updateText.textContent = `Installing Windows Updates... ${percentage}%`;
                };
                dm.addEventListener('vfs:progress', updateProgressListener);

                await this._populateVFSForUpdate(); // Use the dedicated update function

                dm.removeEventListener('vfs:progress', updateProgressListener);
                await new Promise(resolve => setTimeout(resolve, 1500));
                updateScreen.classList.remove('active');
            }

            this.setColorDepth(localStorage.getItem("colorDepth"));
            if (localStorage.getItem("CRTFilter") == "true") this.setCRTFilter(true);

            await this.runOobe();

            if (localStorage.getItem("oobepassed")) {
                this._logon.style.display = "grid";
            }
        };
        setTimeout(proceedAfterBoot, bootDelay);
    }

    setColorDepth(bits) {
        let ditheredDepths = ["1", "3+", "4+", "8+"]; let val = null;
        switch (bits) {
            case "1": val = "2"; break; case "3": case "3+": val = "8"; break; case "4": case "4+": val = "16"; break;
            case "8": val = "256"; break; case "8+": val = "256+"; break; case "16": val = "15bit"; break;
            default: val = null;
        }
        if (val) {
            this._origin.style.filter = `url(#${val}col)`;
            this._dither.style.display = ditheredDepths.includes(bits) ? "block" : "none";
        } else { this._origin.style.filter = 'unset'; this._dither.style.display = "none"; }
        localStorage.setItem("colorDepth", bits || "default");
    }
    setCRTFilter(enable) {
        this._crt.style.display = enable ? "block" : "none";
        localStorage.setItem("CRTFilter", String(enable));
    }
    showBSOD(customErrorData = {}) {
        const bsodScene = this._origin.querySelector('scene_bsod');
        if (!bsodScene) return;
        this._origin.querySelectorAll('scene_desktop, scene_logon, scene_bootscreen, scene_overlay').forEach(scene => {
            scene.style.display = 'none';
        });
        const preElement = bsodScene.querySelector('pre');
        if (preElement && customErrorData.file) {
            const originalTemplate = `
A problem has been detected and Windows XP has been shut down to prevent damage
to your computer.

The problem seems to be caused by the following file: FILE_PLACEHOLDER

MESSAGE_PLACEHOLDER

If this is the first time you've seen this Stop error screen,
refresh your browser tab. If this screen appears again, follow
these steps:

Check to make sure any new hardware or software is properly installed.
If this is a new installation, ask Quenq or your browser vendor
for any Windows XP modifications you might need.

If problems continue, disable or remove any newly installed hardware
or software. Disable BIOS memory options such as chaching or shadowing.
If you need to use Safe Mode to remove or disable components, refresh
your browser tab, press F8 to select Advanced Startup Options, and then
select Safe Mode.

Technical information:

*** STOP: CODE_PLACEHOLDER (0xFD3094C2,0x00000001,0xFBFE7617,0x00000000)


*** FILE_PLACEHOLDER - Address FDF23422 base at FDF24000, DateStamp 3d6dd67c
        `;
            const stopCode = customErrorData.code || '0x0000007B';
            const message = customErrorData.message || 'INACCESSIBLE_BOOT_DEVICE';
            const newText = originalTemplate
                .replace(/FILE_PLACEHOLDER/g, customErrorData.file.toUpperCase())
                .replace(/MESSAGE_PLACEHOLDER/g, message)
                .replace(/CODE_PLACEHOLDER/g, stopCode);
            preElement.textContent = newText;
        }
        bsodScene.style.display = 'block';
        bsodScene.style.zIndex = '9999999';
        bsodScene.style.cursor = 'none';
        bsodScene.setAttribute('tabindex', '0');
        bsodScene.focus();
        const rebootHandler = () => {
            this.reboot();
        };
        bsodScene.addEventListener('pointerdown', rebootHandler, { once: true });
        bsodScene.addEventListener('keydown', rebootHandler, { once: true });
    }
}


async function handleGlobalAppStoreMessages(event) {
    const data = event.data;
    if (!data || !data.action) return;
    const appStoreIframe = document.querySelector('iframe[name="appStoreFrame"]');
    switch (data.action) {
        case 'appstore_iframe_ready_flatfile':
            if (appStoreIframe && appStoreIframe.contentWindow) {
                const installedApps = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('installedApp_') && key.split('_').length === 2) {
                        const appInternalName = key.substring('installedApp_'.length);
                        const version = localStorage.getItem(`installedAppVersion_${appInternalName}`) || "1.0";
                        installedApps[appInternalName] = { version: version };
                    }
                }
                appStoreIframe.contentWindow.postMessage({ action: 'rebornxp_user_info_flatfile', username: window.shell ? window.shell._currentUser : null, installedApps: installedApps }, '*');
            }
            break;
        case 'install_app_from_store_flatfile':
            if (data.payload && data.payload.appData && data.payload.appNameInternal) { await handleFlatFileAppStoreInstallRequest(data.payload); }
            break;
        case 'uninstall_app_from_store_flatfile':
            if (data.payload && data.payload.appNameInternal) { await handleFlatFileAppStoreUninstallRequest(data.payload); }
            break;
    }
}
async function handleFlatFileAppStoreInstallRequest(appDataPayload) {
    const appData = appDataPayload.appData;
    const appNameInternal = appDataPayload.appNameInternal;
    const appDisplayName = appData.displayName;
    const isUpdate = appDataPayload.isUpdate || false;
    const appStoreIframe = document.querySelector('iframe[name="appStoreFrame"]');
    let statusPayload = { appId: appData.id, appNameInternal: appNameInternal, success: false, message: "", type: isUpdate ? 'update' : 'install', version: appData.version };
    const progressDialogText = document.createElement('div');
    progressDialogText.innerHTML = `<p>${isUpdate ? 'Updating' : 'Installing'} ${appDisplayName}...</p><progress value="0" max="100" style="width: 100%;"></progress>`;
    const workingDialog = dialogHandler.spawnDialog({ icon: "info", title: isUpdate ? "Updating Application" : "Installing Application", text: progressDialogText.innerHTML, buttons: [], noClose: true });
    const progressBar = wm._windows[workingDialog]?.querySelector('progress');
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        if (progressBar) progressBar.value = progress;
        if (progress >= 95) clearInterval(progressInterval);
    }, 100);
    try {
        const appDirVFS = `C:/Program Files/${appDisplayName}`;
        const coreJsVFSPath = `${appDirVFS}/core.js`;
        let iconExt = 'png';
        if (appData.iconBase64) {
            if (appData.iconBase64.startsWith('data:image/png')) iconExt = 'png';
            else if (appData.iconBase64.startsWith('data:image/jpeg')) iconExt = 'jpg';
            else if (appData.iconBase64.startsWith('data:image/gif')) iconExt = 'gif';
            else if (appData.iconBase64.startsWith('data:image/x-icon') || appData.iconBase64.startsWith('data:image/vnd.microsoft.icon')) iconExt = 'ico';
        }
        const iconVFSPath = `${appDirVFS}/icon.${iconExt}`;
        const exeVFSPath = `${appDirVFS}/${appDisplayName}.exe`;
        if (isUpdate) {
            if (window.shell && window.shell._currentUser) {
                const desktopPath = `C:/Documents and Settings/${window.shell._currentUser}/Desktop/${appDisplayName}.lnk`;
                try { await dm.permanentDelete(desktopPath); } catch (e) { }
                const startMenuPath = `C:/Documents and Settings/${window.shell._currentUser}/Start Menu/Programs/${appDisplayName}.lnk`;
                try { await dm.permanentDelete(startMenuPath); } catch (e) { }
            }
        }
        try { await dm.mkdir(appDirVFS); } catch (e) { }
        if (appData.iconBase64) {
            try {
                const fetchRes = await fetch(appData.iconBase64);
                const iconBlob = await fetchRes.blob();
                await dm.writeFile(iconVFSPath, iconBlob);
            } catch (iconError) {
                const defaultIconResponse = await fetch('res/icons/defaultapp.png');
                if (defaultIconResponse.ok) await dm.writeFile(iconVFSPath, await defaultIconResponse.blob());
            }
        } else {
            const defaultIconResponse = await fetch('res/icons/defaultapp.png');
            if (defaultIconResponse.ok) await dm.writeFile(iconVFSPath, await defaultIconResponse.blob());
        }
        let coreJsContent;
        if (appData.appType === 'webview') {
            coreJsContent = generateCoreJsForWebview_flatfile(appNameInternal, appDisplayName, iconVFSPath, appData.config.targetUrl, appData.config.windowWidth, appData.config.windowHeight, appData.config.startMaximized, appData.config.resizable);
        } else if (appData.appType === 'custom' && appData.config.coreJsFilename) {
            const coreJsSourcePath = `js/appstore/${appData.config.coreJsFilename}`;
            try {
                const response = await fetch(coreJsSourcePath);
                if (!response.ok) throw new Error(`Failed to fetch core JS: ${coreJsSourcePath}`);
                coreJsContent = await response.text();
            } catch (fetchErr) { throw new Error(`Could not load core logic for ${appDisplayName}. ${fetchErr.message}`); }
        } else { throw new Error("Unsupported appType or missing configuration."); }
        await dm.writeFile(coreJsVFSPath, coreJsContent);
        const exeJsonContent = JSON.stringify({
            action: `apps.load('${coreJsVFSPath}').then(app => { if(app && typeof app.start === 'function') app.start(window._tempAppOptions || {}); })`,
            icon: iconVFSPath,
            windowSettings: appData.config || {}
        });
        await dm.writeFile(exeVFSPath, exeJsonContent);
        if (appData.fileAssociations && Array.isArray(appData.fileAssociations)) {
            const associationsMade = [];
            appData.fileAssociations.forEach(ext => {
                const assocKey = `fileAssoc_${ext.toLowerCase()}`;
                const assocValue = JSON.stringify({ appNameInternal, displayName: appDisplayName, exePath: exeVFSPath, iconVFSPath });
                localStorage.setItem(assocKey, assocValue);
                associationsMade.push(ext.toLowerCase());
            });
            if (associationsMade.length > 0) { localStorage.setItem(`installedApp_${appNameInternal}_associations`, JSON.stringify(associationsMade)); }
        }
        const shortcutContent = JSON.stringify({ target: exeVFSPath, vfsIconPath: iconVFSPath });
        if (window.shell && window.shell._currentUser) {
            const desktopPath = `C:/Documents and Settings/${window.shell._currentUser}/Desktop/${appDisplayName}.lnk`;
            await dm.writeFile(desktopPath, shortcutContent);
            const startMenuProgramsPath = `C:/Documents and Settings/${window.shell._currentUser}/Start Menu/Programs`;
            try { await dm.mkdir(startMenuProgramsPath); } catch (e) { }
            const startMenuPath = `${startMenuProgramsPath}/${appDisplayName}.lnk`;
            await dm.writeFile(startMenuPath, shortcutContent);
        }
        localStorage.setItem(`installedApp_${appNameInternal}`, "true");
        localStorage.setItem(`installedApp_DisplayName_${appNameInternal}`, appDisplayName);
        localStorage.setItem(`installedAppVersion_${appNameInternal}`, appData.version);
        statusPayload.success = true;
        statusPayload.message = `${appDisplayName} ${isUpdate ? 'updated' : 'installed'} successfully.`;
        if (window.explorer) window.explorer.setupDesktop();
        if (window.shell && window.shell._currentUser) window.shell.setupStartMenu(window.shell._currentUser);
    } catch (error) {
        statusPayload.message = `${isUpdate ? 'Update' : 'Install'} failed: ${error.message}`;
        console.error("App Install/Update Error:", error);
    } finally {
        clearInterval(progressInterval);
        if (progressBar) progressBar.value = 100;
        setTimeout(() => {
            if (wm._windows[workingDialog]) wm.closeWindow(workingDialog);
            dialogHandler.spawnDialog({
                icon: statusPayload.success ? "info" : "error", text: statusPayload.message,
                title: statusPayload.success ? (isUpdate ? "Update Complete" : "Installation Complete") : "Error",
                buttons: [["OK", (e) => wm.closeWindow(e.target.closest("app").id)]]
            });
        }, 500);
    }
    if (appStoreIframe && appStoreIframe.contentWindow) {
        appStoreIframe.contentWindow.postMessage({ action: 'app_install_status_update_flatfile', payload: statusPayload }, '*');
    }
}
async function handleFlatFileAppStoreUninstallRequest(payload) {
    const appNameInternal = payload.appNameInternal;
    const appStoreIframe = document.querySelector('iframe[name="appStoreFrame"]');
    let statusPayload = { appId: payload.appId, appNameInternal: appNameInternal, success: false, message: "", type: 'uninstall' };
    const displayName = localStorage.getItem(`installedApp_DisplayName_${appNameInternal}`) || appNameInternal;
    const workingDialog = dialogHandler.spawnDialog({ icon: "info", title: "App Store", text: `Uninstalling ${displayName}...`, buttons: [], noClose: true });
    try {
        const appDirVFS = `C:/Program Files/${displayName}`;
        const assocKeyForApp = `installedApp_${appNameInternal}_associations`;
        const associatedExtensionsJson = localStorage.getItem(assocKeyForApp);
        if (associatedExtensionsJson) {
            try {
                const associatedExtensions = JSON.parse(associatedExtensionsJson);
                associatedExtensions.forEach(ext => { localStorage.removeItem(`fileAssoc_${ext.toLowerCase()}`); });
                localStorage.removeItem(assocKeyForApp);
            } catch (e) { }
        }
        const node = await dm.open(appDirVFS);
        if (node && node.type === 'folder') await dm.permanentDelete(appDirVFS);
        if (window.shell && window.shell._currentUser) {
            const desktopPath = `C:/Documents and Settings/${window.shell._currentUser}/Desktop/${displayName}.lnk`;
            try { await dm.permanentDelete(desktopPath); } catch (e) { }
            const startMenuPath = `C:/Documents and Settings/${window.shell._currentUser}/Start Menu/Programs/${displayName}.lnk`;
            try { await dm.permanentDelete(startMenuPath); } catch (e) { }
        }
        localStorage.removeItem(`installedApp_${appNameInternal}`);
        localStorage.removeItem(`installedApp_DisplayName_${appNameInternal}`);
        statusPayload.success = true;
        statusPayload.message = `${displayName} uninstalled.`;
        dialogHandler.spawnDialog({ icon: "info", text: statusPayload.message, title: "Uninstall Complete", buttons: [["OK", (e) => wm.closeWindow(e.target.closest("app").id)]] });
        if (window.explorer) window.explorer.setupDesktop();
        if (window.shell && window.shell._currentUser) window.shell.setupStartMenu(window.shell._currentUser);
    } catch (error) {
        statusPayload.message = `Uninstall failed: ${error.message}`;
        dialogHandler.spawnDialog({ icon: "error", text: statusPayload.message, title: "Uninstall Error" });
    } finally { if (wm._windows[workingDialog]) wm.closeWindow(workingDialog); }
    if (appStoreIframe && appStoreIframe.contentWindow) {
        appStoreIframe.contentWindow.postMessage({ action: 'app_install_status_update_flatfile', payload: statusPayload }, '*');
    }
}
function generateCoreJsForWebview_flatfile(appNameInternal, displayName, iconVFSPath, targetUrl, width, height, maximized, resizable) {
    const sanitizedAppNameInternal = appNameInternal.replace(/[^a-zA-Z0-9_-]/g, "");
    const jsDisplayName = displayName.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const jsIconVFSPath = iconVFSPath.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const jsTargetUrl = targetUrl.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const jsWidth = String(width || "800"); const jsHeight = String(height || "600");
    const jsMaximized = maximized ? 'true' : 'false'; const jsResizable = resizable ? 'true' : 'false';
    return `(function() { const webAppTemplate = \` <appcontentholder class="${sanitizedAppNameInternal}-webapp" style="background-color: #f0f0f0; display: flex; flex-direction: column; height:100%;"> <iframe src="${jsTargetUrl}" style="width: 100%; height: 100%; border: none; flex-grow:1;" name="${sanitizedAppNameInternal}Frame" sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms allow-popups-to-escape-sandbox allow-downloads allow-pointer-lock"></iframe> </appcontentholder> \`; window.registerApp({ _template: null, setup: async function() { this._template = document.createElement("template"); this._template.innerHTML = webAppTemplate; }, start: function(options = {}) { var windowContents = this._template.content.firstElementChild.cloneNode(true); var hWnd = wm.createNewWindow("${sanitizedAppNameInternal}", windowContents); wm.setIcon(hWnd, "${jsIconVFSPath}"); wm.setCaption(hWnd, "${jsDisplayName}"); const winSettings = options.windowSettings || { width: "${jsWidth}", height: "${jsHeight}", startMaximized: ${jsMaximized}, resizable: ${jsResizable} }; wm.setSize(hWnd, winSettings.startMaximized ? 'auto' : String(winSettings.width), winSettings.startMaximized ? 'auto' : String(winSettings.height)); if (winSettings.startMaximized) { setTimeout(() => { if(wm._windows[hWnd]) wm.toggleMaximizeWindow(hWnd); }, 200); } if (!winSettings.resizable) { wm.setNoResize(hWnd); } return hWnd; } }); })();`;
}