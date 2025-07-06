(function() {
    window.apps = {
        _loadedApps: {},
        setup: function() {},
        load: async function(appNameOrPath, appOptions = null) {
            let appNameKey;
            let isVFSJsPath = false;
            let originalPathForMessages = appNameOrPath;
            let isStoreAppLaunch = false;
            const isVFSPathRegex = /^[A-Za-z]:\//;

            if (typeof appNameOrPath === 'string' &&
                !appNameOrPath.includes('/') &&
                !appNameOrPath.includes(':') &&
                !appNameOrPath.toLowerCase().endsWith('.exe') &&
                !appNameOrPath.toLowerCase().endsWith('.js')) {
                let foundInstalledAppInternalName = null;
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('installedApp_') && key.split('_').length === 2) {
                        const appInternalNameFromStorage = key.substring('installedApp_'.length);
                        const appDisplayNameFromStorage = localStorage.getItem(`installedApp_DisplayName_${appInternalNameFromStorage}`);
                        if (appDisplayNameFromStorage && appDisplayNameFromStorage.toLowerCase() === appNameOrPath.toLowerCase()) {
                            foundInstalledAppInternalName = appInternalNameFromStorage;
                            break;
                        }
                        if (appInternalNameFromStorage.toLowerCase() === appNameOrPath.toLowerCase()) {
                            foundInstalledAppInternalName = appInternalNameFromStorage;
                        }
                    }
                }
                if (foundInstalledAppInternalName) {
                    appNameOrPath = `C:/Program Files/${localStorage.getItem(`installedApp_DisplayName_${foundInstalledAppInternalName}`)}/${localStorage.getItem(`installedApp_DisplayName_${foundInstalledAppInternalName}`)}.exe`;
                    isStoreAppLaunch = true;
                }
            }

            if (typeof appNameOrPath === 'string' && isVFSPathRegex.test(appNameOrPath)) {
                if (appNameOrPath.toLowerCase().endsWith('.js')) {
                    isVFSJsPath = true;
                    appNameKey = appNameOrPath;
                } else {
                    appNameKey = appNameOrPath;
                    isVFSJsPath = false;
                }
            } else {
                appNameKey = appNameOrPath;
            }

            if (!isVFSJsPath && typeof appNameKey === 'string' && !appNameKey.toLowerCase().endsWith('.exe') && !appNameKey.toLowerCase().endsWith('.js') && !isStoreAppLaunch) {
                 if (appNameKey in apps._loadedApps) {
                    const existingApp = apps._loadedApps[appNameKey];
                    const appWindow = wm._desktop ? wm._desktop.querySelector(`app.${appNameKey}, app[data-app-name="${appNameKey}"]`) : null;

                    if (localStorage.getItem("noSingleInstanceLimit") != "true" &&
                        apps.singleInstance.includes(appNameKey) &&
                        appWindow) {
                        wm.focusWindow(appWindow.id);
                        if (appOptions && typeof existingApp.handleNewData === 'function') {
                           await existingApp.handleNewData(appOptions);
                        }
                        return null;
                    } else {
                         if (appOptions && typeof existingApp.handleNewData === 'function') {
                             await existingApp.handleNewData(appOptions);
                             if(appWindow) wm.focusWindow(appWindow.id);
                        }
                        return existingApp;
                    }
                }
            }

            let promise = new Promise(resolveOuter => {
                if (wm._desktop) wm._desktop.style.cursor = "url('./res/ui/cursors/background.cur'), progress";
                const originalRegisterApp = window.registerApp;
                window.registerApp = function(app) {
                    app.setup().then(_ => {
                        if (!isVFSJsPath && typeof appNameKey === 'string' && !appNameKey.toLowerCase().endsWith('.exe') && !appNameKey.toLowerCase().endsWith('.js')) {
                             if(typeof appNameKey === 'string' && !appNameKey.includes('/')) {
                                apps._loadedApps[appNameKey] = app;
                             }
                        }
                        window.registerApp = originalRegisterApp;
                        if (!window.registerApp) delete window.registerApp;
                        resolveOuter(app);
                    }).catch(setupError => {
                        window.registerApp = originalRegisterApp;
                        if (!window.registerApp) delete window.registerApp;
                        resolveOuter(null);
                    });
                };

                if (isVFSPathRegex.test(appNameOrPath) && appNameOrPath.toLowerCase().endsWith('.exe')) {
                    dm.readFile(appNameOrPath)
                        .then(async (fileContent) => {
                            if (typeof fileContent === 'string') {
                                try {
                                    const parsedJsonAction = JSON.parse(fileContent);
                                    if (parsedJsonAction && parsedJsonAction.action) {
                                        window._tempAppOptions = { ...(appOptions || {}) };
                                        if (parsedJsonAction.windowSettings && !window._tempAppOptions.windowSettings) {
                                            window._tempAppOptions.windowSettings = parsedJsonAction.windowSettings;
                                        }
                                        eval(parsedJsonAction.action);
                                    } else { throw new Error("VFS .exe content is not valid JSON action."); }
                                } catch (e) {
                                    window.registerApp = originalRegisterApp; if (!window.registerApp) delete window.registerApp;
                                    if (window._tempAppOptions) delete window._tempAppOptions;
                                    dialogHandler.spawnDialog({icon:"error", text:`${dm.basename(appNameOrPath)} is corrupted or invalid. ${e.message}`, title: dm.basename(appNameOrPath)});
                                    resolveOuter(null);
                                }
                            } else {
                                window.registerApp = originalRegisterApp; if (!window.registerApp) delete window.registerApp;
                                if (window._tempAppOptions) delete window._tempAppOptions;
                                dialogHandler.spawnDialog({icon:"error", text:`${dm.basename(appNameOrPath)} is empty.`, title: dm.basename(appNameOrPath)});
                                resolveOuter(null);
                            }
                        })
                        .catch(readError => {
                            window.registerApp = originalRegisterApp; if (!window.registerApp) delete window.registerApp;
                            if (window._tempAppOptions) delete window._tempAppOptions;
                            dialogHandler.spawnDialog({icon:"error", text:`Cannot access application ${dm.basename(appNameOrPath)}. ${readError.message}`, title: dm.basename(appNameOrPath)});
                            resolveOuter(null);
                        });
                } else if (isVFSJsPath) {
                    dm.readFile(appNameOrPath)
                        .then(async (fileContent) => {
                            if (typeof fileContent === 'string') {
                                const blob = new Blob([fileContent], { type: 'text/javascript' });
                                const blobUrl = URL.createObjectURL(blob);
                                import(blobUrl)
                                    .catch(vfsImportError => {
                                        window.registerApp = originalRegisterApp; if (!window.registerApp) delete window.registerApp;
                                        dialogHandler.spawnDialog({icon:"error", text:`Error in ${dm.basename(appNameOrPath)}. ${vfsImportError.message}`, title: dm.basename(appNameOrPath)});
                                        resolveOuter(null);
                                    })
                                    .finally(() => URL.revokeObjectURL(blobUrl));
                            } else {
                                window.registerApp = originalRegisterApp; if (!window.registerApp) delete window.registerApp;
                                dialogHandler.spawnDialog({icon:"error", text:`${dm.basename(appNameOrPath)} content is invalid.`, title: dm.basename(appNameOrPath)});
                                resolveOuter(null);
                            }
                        })
                        .catch(readError => {
                            window.registerApp = originalRegisterApp; if (!window.registerApp) delete window.registerApp;
                            dialogHandler.spawnDialog({icon:"error", text:`Cannot access file ${dm.basename(appNameOrPath)}. ${readError.message}`, title: dm.basename(appNameOrPath)});   
                            resolveOuter(null);
                        });
                } else if (typeof appNameOrPath === 'string') {
                    const importPath = `./apps/${appNameOrPath}.js`;
                    import(importPath)
                        .then(module => {})
                        .catch((error) => {
                            window.registerApp = originalRegisterApp; if (!window.registerApp) delete window.registerApp;
                            dialogHandler.spawnDialog({
                                icon: "error",
                                text: `${originalPathForMessages}.exe is not a valid Win32 application or could not be found.`,
                                title: `${originalPathForMessages}.exe`
                            });
                            resolveOuter(null);
                        });
                } else {
                    window.registerApp = originalRegisterApp;
                    if (!window.registerApp) delete window.registerApp;
                    resolveOuter(null);
                }
            });
            const loadedApp = await promise;
            if (loadedApp && typeof appNameKey === 'string' && !appNameKey.includes('/')) {
                const appNameForWindow = appNameKey.split('/').pop().replace(/\.js$/i,'').replace(/\.exe$/i,'');
                const appWindowElement = document.querySelector(`app[data-app-name="${appNameForWindow}"]`) || document.querySelector(`app.${appNameForWindow}`);
                if (appWindowElement && !appWindowElement.dataset.appName) {
                    appWindowElement.dataset.appName = appNameForWindow;
                }
            }
            if (wm._desktop) wm._desktop.style.cursor = "unset";
            return loadedApp;
        },
        defaultAction: {
            "accessprops": null, "calc": null,
            "cmd": "apps.load('cmd').then(app => { if(app && app.start) app.start() })",
            "console": null, "control": null,
            "desk.cpl": "apps.load('desk').then(app => { if(app && app.start) app.start() })",
            "nusrmgr.cpl": "apps.load('userprops').then(app => { if(app && app.start) app.start() })",
            "displayprops": null, "explorer": "window.explorer.open()", "folderopt": null, "help": null,
            "iexplore": null, "imgviewer": "return false", "logonprompt": "return false",
            "minesweeper": "apps.load('winmine').then(app => { if(app && app.start) app.start() })",
            "mspaint": null, "notepad": "apps.load('notepad').then(app => { if(app && app.start) app.start({contents: ''}) });",
            "pinball": null, "regedit": null, "run": null, "sndvol32": null, "sol": null, "startprops": null,
            "taskmgr": null, "winamp": null, "winmine": null,
            "wmp": "apps.load('wmp').then(app => { if(app && app.start) app.start() })",
            "wmplayer": "apps.load('wmp').then(app => { if(app && app.start) app.start() })",
            "appwiz.cpl": "apps.load('appwiz').then(app => { if(app && app.start) app.start() })",
            "appstore": "apps.load('appstore').then(app => { if(app && app.start) app.start() })",
            "webappinstaller": "apps.load('webappinstaller').then(app => { if(app && app.start) app.start() })"
        },
        singleInstance: ["accessprops", "desk", "displayprops", "folderopt", "startprops", "sndvol32", "wmp", "taskmgr", "regedit", "appstore", "appwiz", "webappinstaller"],
    }
})();