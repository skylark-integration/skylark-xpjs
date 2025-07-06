// App: regedit.exe
(function() {
    const baseRegistryStructure = {
        "HKEY_LOCAL_MACHINE": {
            _isHive: true,
            _displayName: "HKEY_LOCAL_MACHINE",
            "SOFTWARE": {
                "Microsoft": {
                    "Windows": {
                        "CurrentVersion": {
                            "Explorer": {
                                "Advanced": {
                                    "OpenFoldersInNewWindow": { _type: "REG_BOOL_LS", _localStorageKey: "openFoldersInNewWindow", _defaultValue: "false", _tooltip: "Open each folder in its own window (true/false).", _global: true }
                                }
                            }
                        }
                    }
                }
            },
            "SYSTEM": {
                "Setup": {
                    "BootDelay": { _type: "REG_SZ_NUMBER", _localStorageKey: "bootDelay", _defaultValue: "4000", _tooltip: "Boot screen animation delay in milliseconds.", _global: true }
                },
                "UI": {
                    "Display": {
                        "ColorDepth": { _type: "REG_SZ", _localStorageKey: "colorDepth", _defaultValue: "default", _tooltip: "Color depth. Valid: 1,3,3+,4,4+,8,8+,16,default.", _global: true },
                        "CRTFilterEnabled": { _type: "REG_BOOL_LS", _localStorageKey: "CRTFilter", _defaultValue: "false", _tooltip: "Enable CRT scanline effect (true/false).", _global: true }
                    }
                }
            }
        },
        "HKEY_CURRENT_USER": {
            _isHive: true,
            _displayName: "HKEY_CURRENT_USER",
            _dynamicUserHive: "CURRENT"
        },
        "HKEY_USERS": {
            _isHive: true,
            _displayName: "HKEY_USERS",
            _dynamicUserRoot: true
        }
    };

    const userSettingDefinitions = {
        "classicStart": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "ClassicStartMenu", _type: "REG_BOOL_LS", _defaultValue: "false", _tooltip: "Use classic Start Menu (true/false)." },
        "taskbarAutoHide": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "TaskbarAutoHide", _type: "REG_BOOL_LS", _defaultValue: "false", _tooltip: "Auto-hide the taskbar (true/false)." },
        "quickLaunch": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "QuickLaunchEnabled", _type: "REG_BOOL_LS", _defaultValue: "true", _tooltip: "Show Quick Launch toolbar (true/false)." },
        "noClock": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "ClockHidden", _type: "REG_BOOL_LS", _defaultValue: "false", _tooltip: "Hide clock in sys tray (true means hidden)." },
        "taskbarOnTop": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "TaskbarOnTop", _type: "REG_BOOL_LS", _defaultValue: "true", _tooltip: "Keep taskbar on top (true/false)." },
        "noExplorerSidebar": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "ClassicFolders", _type: "REG_BOOL_LS", _defaultValue: "false", _tooltip: "Use classic folders (no sidebar) (true/false)." },
        "showHiddenContents": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "ShowHiddenFiles", _type: "REG_BOOL_LS", _defaultValue: "false", _tooltip: "Show hidden files and folders (true/false)." },
        "showFileExtensions": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "HideFileExtensions", _type: "REG_BOOL_LS_INVERTED", _defaultValue: "false", _tooltip: "Hide extensions for known file types (true means hide)." },
        "fullPathInTitle": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Explorer", "Advanced"], name: "FullPathInTitleBar", _type: "REG_BOOL_LS", _defaultValue: "false", _tooltip: "Display full path in Explorer title bar (true/false)." },
        "userTheme": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Themes"], name: "CurrentTheme", _type: "REG_SZ_RO", _defaultValue: "luna", _tooltip: "Current visual theme (read-only via regedit)." },
        "userStyle": { path: ["Software", "Microsoft", "Windows", "CurrentVersion", "Themes"], name: "CurrentStyle", _type: "REG_SZ_RO", _defaultValue: "blue", _tooltip: "Current theme style (read-only via regedit)." },
        "userWallpaper": { path: ["Control Panel", "Desktop"], name: "Wallpaper", _type: "REG_SZ_RO", _defaultValue: "stock-wallpapers/Bliss.jpg", _tooltip: "Current wallpaper (read-only via regedit)." },
        "userWallpaperMode": { path: ["Control Panel", "Desktop"], name: "WallpaperStyle", _type: "REG_SZ_RO", _defaultValue: "stretch", _tooltip: "Wallpaper display mode (read-only via regedit)." }
    };

    const windowTemplate = `
        <appcontentholder class="regedit">
            <appnavigation>
                <ul class="appmenus">
                    <li>File</li>
                    <li>Edit</li>
                    <li>View</li>
                    <li>Favorites</li>
                    <li>Help</li>
                </ul>
            </appnavigation>
            <contentpane class="sidebar">
                <ul class="root"></ul>
            </contentpane>
            <resizer></resizer>
            <contentpane class="data">
                <items>
                    <entry class="details-header">
                        <icon></icon>
                        <name>Name</name>
                        <type>Type</type>
                        <data>Data</data>
                    </entry>
                </items>
            </contentpane>
            <statusbar>
                <span id="currentRegPath">My Computer</span>
                <div id="grabber"></div>
            </statusbar>
        </appcontentholder>
    `;

    let currentSelectedRegNodeInfo = { path: [], isDynamicUserPath: false, usernameForPath: null };
    let selfRegWindow = null;

    function getObjectByPathParts(obj, pathPartsArray) {
        let current = obj;
        for (const key of pathPartsArray) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return undefined;
            }
        }
        return current;
    }

    function buildFullDynamicUserStructure(userSettingsDefs) {
        const treeFragment = {};
        for (const lsKey in userSettingsDefs) {
            const settingDef = userSettingsDefs[lsKey];
            let currentLevel = treeFragment;
            settingDef.path.forEach(part => {
                currentLevel[part] = currentLevel[part] || {};
                currentLevel = currentLevel[part];
            });
            currentLevel[settingDef.name] = {
                _type: settingDef._type,
                _localStorageKey: lsKey,
                _defaultValue: settingDef._defaultValue,
                _tooltip: settingDef._tooltip,
                _isLeafValue: true, // Mark it as a leaf value for collection
                _global: false // Explicitly mark as non-global for dynamic user context
            };
        }
        return treeFragment;
    }


    function buildDynamicUserTree(treeFragment, parentUlElement, basePathParts, username) {
        renderRegistryTree(treeFragment, parentUlElement, basePathParts, true, username);
    }

    function renderRegistryTree(data, parentUlElement, currentPathParts = [], isDynamicSubtree = false, usernameForDynamicPath = null) {
        if (!isDynamicSubtree) {
             parentUlElement.innerHTML = '';
        }

        for (const key in data) {
            if (key.startsWith('_') && key !== '_dynamicUserHive' && key !== '_dynamicUserRoot') continue;

            const node = data[key];
            const li = document.createElement('li');
            const itemDiv = document.createElement('item');
            const iconDiv = document.createElement('div');
            iconDiv.classList.add('icon');
            const span = document.createElement('span');
            span.textContent = node._displayName || key;

            itemDiv.appendChild(iconDiv);
            itemDiv.appendChild(span);
            li.appendChild(itemDiv);

            const newPathParts = [...currentPathParts, key];
            itemDiv.dataset.path = JSON.stringify(newPathParts);
            if (isDynamicSubtree) {
                 itemDiv.dataset.isDynamicUserPath = "true";
                 itemDiv.dataset.usernameForPath = usernameForDynamicPath;
            }

            const childrenKeys = Object.keys(node).filter(k => !k.startsWith('_') || k === '_dynamicUserHive' || k === '_dynamicUserRoot');
            const hasStaticChildren = childrenKeys.some(k => !['_dynamicUserHive', '_dynamicUserRoot'].includes(k) && !node[k]._isLeafValue);
            const isPotentiallyDynamic = node._dynamicUserHive || node._dynamicUserRoot;
            const isFolder = hasStaticChildren || isPotentiallyDynamic || node._isHive;


            if (isFolder) {
                const expander = document.createElement('div');
                expander.classList.add('expander');
                li.appendChild(expander);

                const subUl = document.createElement('ul');
                 if (node._isHive || (currentPathParts.length === 0 && key === "HKEY_USERS")) {
                    li.classList.add('active');
                    subUl.classList.add('active');
                }

                expander.onclick = (e) => {
                    e.stopPropagation();
                    const currentlyActive = subUl.classList.toggle('active');
                    li.classList.toggle('active');

                    if (currentlyActive && (node._dynamicUserHive || node._dynamicUserRoot) && subUl.innerHTML === '') {
                        if (node._dynamicUserHive === "CURRENT") {
                            if (shell._currentUser) {
                                buildDynamicUserTree(buildFullDynamicUserStructure(userSettingDefinitions), subUl, newPathParts, shell._currentUser);
                            } else {
                                subUl.innerHTML = "<li><item><span>(No user logged in)</span></item></li>";
                            }
                        } else if (node._dynamicUserRoot) {
                            const users = JSON.parse(localStorage.getItem('users') || '[]');
                            if (users.length > 0) {
                                users.forEach(user => {
                                    const userLi = document.createElement('li');
                                    const userItemDiv = document.createElement('item');
                                    const userIconDiv = document.createElement('div');
                                    userIconDiv.classList.add('icon');
                                    const userSpan = document.createElement('span');
                                    userSpan.textContent = user.username;
                                    userItemDiv.appendChild(userIconDiv); userItemDiv.appendChild(userSpan); userLi.appendChild(userItemDiv);

                                    const userPathParts = [...newPathParts, user.username];
                                    userItemDiv.dataset.path = JSON.stringify(userPathParts);
                                    userItemDiv.dataset.isDynamicUserPath = "true";
                                    userItemDiv.dataset.usernameForPath = user.username;

                                    const userExpander = document.createElement('div'); userExpander.classList.add('expander'); userLi.appendChild(userExpander);
                                    const userSubUl = document.createElement('ul'); userLi.appendChild(userSubUl);

                                    userExpander.onclick = (ev) => {
                                        ev.stopPropagation();
                                        const userCurrentlyActive = userSubUl.classList.toggle('active');
                                        userLi.classList.toggle('active');
                                        if (userCurrentlyActive && userSubUl.innerHTML === '') {
                                            buildDynamicUserTree(buildFullDynamicUserStructure(userSettingDefinitions), userSubUl, userPathParts, user.username);
                                        }
                                    };
                                    userItemDiv.onclick = (ev) => {
                                        ev.stopPropagation();
                                        selfRegWindow.querySelectorAll('.sidebar item.selected').forEach(el => el.classList.remove('selected'));
                                        userItemDiv.classList.add('selected');
                                        currentSelectedRegNodeInfo = { path: JSON.parse(userItemDiv.dataset.path), isDynamicUserPath: true, usernameForPath: user.username };
                                        updateStatusBarPath();
                                        renderKeyValues(currentSelectedRegNodeInfo);
                                    };
                                    subUl.appendChild(userLi);
                                });
                            } else {
                                subUl.innerHTML = "<li><item><span>(No users defined)</span></item></li>";
                            }
                        }
                    }
                };

                itemDiv.onclick = (e) => {
                    e.stopPropagation();
                    selfRegWindow.querySelectorAll('.sidebar item.selected').forEach(el => el.classList.remove('selected'));
                    itemDiv.classList.add('selected');

                    const clickedPathParts = JSON.parse(itemDiv.dataset.path);
                    const isDynamicItem = itemDiv.dataset.isDynamicUserPath === "true";
                    const usernameForItem = itemDiv.dataset.usernameForPath || null;
                    currentSelectedRegNodeInfo = { path: clickedPathParts, isDynamicUserPath: isDynamicItem, usernameForPath: usernameForItem };

                    updateStatusBarPath();
                    renderKeyValues(currentSelectedRegNodeInfo);


                    if (expander && !subUl.classList.contains('active') && (node._dynamicUserHive || node._dynamicUserRoot)) {
                         expander.click();
                    }
                };

                if (hasStaticChildren) {
                    renderRegistryTree(node, subUl, newPathParts, false, null);
                }
                 if (node._isHive && subUl.innerHTML === '' && subUl.classList.contains('active')) {
                     if (node._dynamicUserHive === "CURRENT") {
                         if (shell._currentUser) {
                             buildDynamicUserTree(buildFullDynamicUserStructure(userSettingDefinitions), subUl, newPathParts, shell._currentUser);
                         } else {
                             subUl.innerHTML = "<li><item><span>(No user logged in)</span></item></li>";
                         }
                     } else if (node._dynamicUserRoot) {
                         expander.click();
                         expander.click();
                     }
                 }
                li.appendChild(subUl);
            }
            parentUlElement.appendChild(li);
        }
    }


    function updateStatusBarPath() {
        const pathSpan = selfRegWindow.querySelector('#currentRegPath');
        if (pathSpan) {
            if (currentSelectedRegNodeInfo.path.length === 0) {
                pathSpan.textContent = "My Computer";
            } else {
                pathSpan.textContent = currentSelectedRegNodeInfo.path.join('\\');
            }
        }
    }

    function collectAndDisplayValuesRecursive(container, currentKeyObject, currentPathPrefix, usernameForDynamic) {
        if (!currentKeyObject || typeof currentKeyObject !== 'object') return;

        for (const keyName in currentKeyObject) {
            if (keyName.startsWith('_')) continue;

            const node = currentKeyObject[keyName];
            const valueDisplayName = currentPathPrefix ? `${currentPathPrefix}\\${keyName}` : keyName;


            if (node._localStorageKey && node._isLeafValue !== false) {
                let fullStorageKey = node._localStorageKey;
                if (!node._global && usernameForDynamic) {
                    fullStorageKey = `user_${usernameForDynamic}.${node._localStorageKey}`;
                } else if (!node._global && !usernameForDynamic) {
                    continue;
                }
                displayValueEntry(container, valueDisplayName, node, fullStorageKey, usernameForDynamic);
            } else if (typeof node === 'object' && !node._localStorageKey) {
                collectAndDisplayValuesRecursive(container, node, valueDisplayName, usernameForDynamic);
            }
        }
    }

    function renderKeyValues(selectedNodeInfo) {
        const { path: selectedPathParts, isDynamicUserPath, usernameForPath } = selectedNodeInfo;
        const valuesContainer = selfRegWindow.querySelector('.data items');
        valuesContainer.innerHTML = `
            <entry class="details-header">
                <icon></icon>
                <name>Name</name>
                <type>Type</type>
                <data>Data</data>
            </entry>`;
        const statusbar = selfRegWindow.querySelector('#currentRegPath');

        const defaultEntry = document.createElement('entry');
        defaultEntry.innerHTML = `
            <icon><img src="res/ui/regedit/sz.png"></icon>
            <name>(Default)</name>
            <type>REG_SZ</type>
            <data>(value not set)</data>
        `;
        defaultEntry.onclick = () => {
             if (statusbar) statusbar.setAttribute('title', 'The default, unnamed value for this key.');
        }
        valuesContainer.appendChild(defaultEntry);

        let rootObjectForSearch;
        let basePathForDisplayName = "";

        if (isDynamicUserPath) {
            if (!usernameForPath) {
                const noUserLi = document.createElement('li');
                const noUserSpan = document.createElement('span');
                noUserSpan.textContent = "Select a user or log in to see values.";
                noUserLi.appendChild(noUserSpan);
                valuesContainer.appendChild(noUserLi);
                return;
            }
            rootObjectForSearch = buildFullDynamicUserStructure(userSettingDefinitions);
            const userSpecificPathParts = selectedPathParts.slice(2); // Skip HKEY_USERS and Username
            const targetObject = getObjectByPathParts(rootObjectForSearch, userSpecificPathParts);
            collectAndDisplayValuesRecursive(valuesContainer, targetObject, userSpecificPathParts.join("\\"), usernameForPath);

        } else if (selectedPathParts[0] === "HKEY_CURRENT_USER") {
             if (!shell._currentUser) {
                const noUserLi = document.createElement('li');
                const noUserSpan = document.createElement('span');
                noUserSpan.textContent = "Log in to see HKEY_CURRENT_USER values.";
                noUserLi.appendChild(noUserSpan);
                valuesContainer.appendChild(noUserLi);
                return;
             }
             rootObjectForSearch = buildFullDynamicUserStructure(userSettingDefinitions);
             const hkcuRelativePathParts = selectedPathParts.slice(1); // Skip HKEY_CURRENT_USER
             const targetObject = getObjectByPathParts(rootObjectForSearch, hkcuRelativePathParts);
             collectAndDisplayValuesRecursive(valuesContainer, targetObject, hkcuRelativePathParts.join("\\"), shell._currentUser);

        } else { // HKEY_LOCAL_MACHINE or other static hives
            rootObjectForSearch = baseRegistryStructure;
            const targetObject = getObjectByPathParts(rootObjectForSearch, selectedPathParts);
            collectAndDisplayValuesRecursive(valuesContainer, targetObject, selectedPathParts.slice(1).join("\\") , null);
        }
    }


    function displayValueEntry(container, valueDisplayName, valueDef, fullStorageKey, usernameForContext) {
        const entry = document.createElement('entry');
        const iconImg = document.createElement('img');
        let displayType = valueDef._type;
        let currentValue = localStorage.getItem(fullStorageKey);
        if (currentValue === null && valueDef._defaultValue !== undefined) {
            currentValue = valueDef._defaultValue;
        } else if (currentValue === null) {
            currentValue = "";
        }

        if (valueDef._type.startsWith("REG_BOOL_LS")) {
            iconImg.src = "res/ui/regedit/dword.png";
            displayType = "REG_DWORD";
        } else if (valueDef._type === "REG_SZ_NUMBER") {
            iconImg.src = "res/ui/regedit/dword.png";
            displayType = "REG_DWORD";
        } else {
            iconImg.src = "res/ui/regedit/sz.png";
        }

        let displayValue = currentValue;
        if (valueDef._type === "REG_BOOL_LS") {
            displayValue = (currentValue === "true") ? "0x00000001 (1)" : "0x00000000 (0)";
        } else if (valueDef._type === "REG_BOOL_LS_INVERTED") {
            displayValue = (currentValue === "true") ? "0x00000000 (0)" : "0x00000001 (1)";
        }

        entry.innerHTML = `
            <icon></icon>
            <name>${valueDisplayName || valueDef._localStorageKey}</name>
            <type>${displayType}</type>
            <data class="editable-value">${displayValue}</data>
        `;
        entry.querySelector('icon').appendChild(iconImg);
        entry.dataset.valueName = valueDisplayName || valueDef._localStorageKey;


        entry.onclick = () => {
            const statusbar = selfRegWindow.querySelector('#currentRegPath');
            if (statusbar) statusbar.setAttribute('title', valueDef._tooltip || valueDisplayName);
        }

        const dataCell = entry.querySelector('.editable-value');
        if (valueDef._type !== "REG_SZ_RO") {
            dataCell.ondblclick = () => makeEditable(dataCell, valueDisplayName, valueDef, fullStorageKey, currentValue, usernameForContext);
        } else {
            dataCell.style.cursor = "default";
        }
        container.appendChild(entry);
    }

    function makeEditable(cell, valueName, valueDef, storageKey, originalValueStr, usernameForContext) {
        const oldValueDisplay = cell.textContent;
        cell.innerHTML = '';
        const input = document.createElement('input');
        input.type = 'text';

        if (valueDef._type === "REG_BOOL_LS") {
            input.value = (originalValueStr === "true") ? "1" : "0";
        } else if (valueDef._type === "REG_BOOL_LS_INVERTED") {
            input.value = (originalValueStr === "true") ? "0" : "1";
        } else {
            input.value = originalValueStr;
        }

        cell.appendChild(input);
        input.focus();
        input.select();

        const saveValue = () => {
            let newValueFromInput = input.value.trim();
            let newStorageValue = newValueFromInput;

            if (valueDef._type.startsWith("REG_BOOL_LS")) {
                if (newValueFromInput === "1" || newValueFromInput.toLowerCase() === "true") {
                    newStorageValue = valueDef._type === "REG_BOOL_LS_INVERTED" ? "false" : "true";
                } else if (newValueFromInput === "0" || newValueFromInput.toLowerCase() === "false") {
                    newStorageValue = valueDef._type === "REG_BOOL_LS_INVERTED" ? "true" : "false";
                } else {
                    alert("Invalid boolean value. Use 0 or 1 (or true/false).");
                    cell.innerHTML = oldValueDisplay;
                    return;
                }
            } else if (valueDef._type === "REG_SZ_NUMBER") {
                if (isNaN(parseInt(newValueFromInput))) {
                    alert("Invalid number.");
                    cell.innerHTML = oldValueDisplay;
                    return;
                }
                newStorageValue = parseInt(newValueFromInput).toString();
            } else if (valueDef._type === "REG_SZ" && valueDef._localStorageKey === "colorDepth") {
                 const validDepths = ["1","3","3+","4","4+","8","8+","16","default"];
                 if (!validDepths.includes(newValueFromInput)) {
                    alert(`Invalid color depth. Must be one of: ${validDepths.join(', ')}`);
                    cell.innerHTML = oldValueDisplay;
                    return;
                 }
            }

            localStorage.setItem(storageKey, newStorageValue);

            let displayValue = newStorageValue;
            if (valueDef._type === "REG_BOOL_LS") {
                displayValue = (newStorageValue === "true") ? "0x00000001 (1)" : "0x00000000 (0)";
            } else if (valueDef._type === "REG_BOOL_LS_INVERTED") {
                displayValue = (newStorageValue === "true") ? "0x00000000 (0)" : "0x00000001 (1)";
            }
            cell.innerHTML = displayValue;

            const baseStorageKey = valueDef._localStorageKey;
            const isCurrentUserBeingEdited = usernameForContext && usernameForContext === shell._currentUser;
            const isGlobalKey = valueDef._global === true;

            if ((isCurrentUserBeingEdited || isGlobalKey) && shell && typeof shell.handleToggle === 'function' && shell.toggleStorage && shell.toggleStorage[baseStorageKey]) {
                shell.handleToggle(baseStorageKey, newStorageValue);
            } else if (isGlobalKey) {
                if (baseStorageKey === "bootDelay") {
                } else if (baseStorageKey === "colorDepth" && shell && typeof shell.setColorDepth === 'function') {
                    shell.setColorDepth(newStorageValue);
                } else if (baseStorageKey === "CRTFilter" && shell && typeof shell.setCRTFilter === 'function') {
                    shell.setCRTFilter(newStorageValue === "true");
                }
            }

            window.dispatchEvent(new StorageEvent('storage', {
                key: storageKey,
                oldValue: originalValueStr,
                newValue: newStorageValue,
                storageArea: localStorage
            }));
        };

        input.onblur = saveValue;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                input.blur();
            } else if (e.key === 'Escape') {
                cell.innerHTML = oldValueDisplay;
                input.onblur = null;
                input.onkeydown = null;
            }
        };
    }

    registerApp({
        _template: null,
        setup: async function() {
            this._template = document.createElement("template");
            this._template.innerHTML = windowTemplate;
        },
        start: function() {
            var windowContents = this._template.content.firstElementChild.cloneNode(true);
            var hWnd = wm.createNewWindow("regedit", windowContents);
            selfRegWindow = wm._windows[hWnd];

            wm.setIcon(hWnd, "regedit.png");
            wm.setCaption(hWnd, "Registry Editor");
            wm.setSize(hWnd, 657, 397);
            selfRegWindow.querySelector("appcontents").style.backgroundColor = "var(--mainColor)";

            const sidebarUl = selfRegWindow.querySelector(".sidebar ul.root");
            renderRegistryTree(baseRegistryStructure, sidebarUl);

            const firstHiveKey = Object.keys(baseRegistryStructure)[0];
            if (firstHiveKey) {
                currentSelectedRegNodeInfo = { path: [firstHiveKey], isDynamicUserPath: false, usernameForPath: null };
                updateStatusBarPath();
                renderKeyValues(currentSelectedRegNodeInfo);

                const firstHiveItem = sidebarUl.querySelector(`item[data-path='${JSON.stringify([firstHiveKey])}']`);
                if (firstHiveItem) {
                    firstHiveItem.classList.add('selected');
                    const parentLi = firstHiveItem.closest('li');
                    if (parentLi) {
                        parentLi.classList.add('active');
                        const subUlAssociated = parentLi.querySelector('ul');
                        if (subUlAssociated) subUlAssociated.classList.add('active');
                    }
                }
            }

            const resizeGrabber = selfRegWindow.querySelector("resizer");
            const windowBody = selfRegWindow.querySelector("appcontentholder");
            const sidebarBody = selfRegWindow.querySelector(".sidebar");

            function sidebarResize(e) {
                let prevX = e.clientX;
                function doResize(ev) {
                    const rect = sidebarBody.getBoundingClientRect();
                    const newWidth = rect.width - (prevX - ev.clientX);
                    if (newWidth > 40 && newWidth < (windowBody.offsetWidth - 50) ) {
                         windowBody.style.gridTemplateColumns = `${newWidth}px 4px auto`;
                    }
                    prevX = ev.clientX;
                }
                function endResize() {
                    window.removeEventListener("pointermove", doResize);
                    window.removeEventListener("pointerup", endResize);
                }
                window.addEventListener("pointermove", doResize);
                window.addEventListener("pointerup", endResize);
            }
            resizeGrabber.addEventListener("mousedown", sidebarResize);

            return hWnd;
        },
    })
})();