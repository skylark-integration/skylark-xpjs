(function() {
    const notepadTemplate = `
        <appcontentholder class="notepad">
            <appnavigation>
                <ul class="appmenus">
                    <li id="np-file-menu">File
                        <ul class="submenu">
                            <li data-action="new">New</li>
                            <li data-action="open">Open...</li>
                            <li data-action="save">Save</li>
                            <li data-action="saveas">Save As...</li>
                            <li class="divider"></li>
                            <li data-action="pagesetup" class="disabled">Page Setup...</li>
                            <li data-action="print" class="disabled">Print...</li>
                            <li class="divider"></li>
                            <li data-action="exit">Exit</li>
                        </ul>
                    </li>
                    <li id="np-edit-menu">Edit
                        <ul class="submenu">
                            <li data-action="undo" class="disabled">Undo</li>
                            <li class="divider"></li>
                            <li data-action="cut" class="disabled">Cut</li>
                            <li data-action="copy" class="disabled">Copy</li>
                            <li data-action="paste" class="disabled">Paste</li>
                            <li data-action="delete" class="disabled">Delete</li>
                            <li class="divider"></li>
                            <li data-action="find" class="disabled">Find...</li>
                            <li data-action="findnext" class="disabled">Find Next</li>
                            <li data-action="replace" class="disabled">Replace...</li>
                            <li data-action="goto" class="disabled">Go To...</li>
                            <li class="divider"></li>
                            <li data-action="selectall">Select All</li>
                            <li data-action="datetime">Time/Date</li>
                        </ul>
                    </li>
                    <li id="np-format-menu">Format
                        <ul class="submenu">
                            <li data-action="wordwrap">Word Wrap</li>
                            <li data-action="font">Font...</li>
                        </ul>
                    </li>
                    <li id="np-view-menu">View
                        <ul class="submenu">
                            <li id="np-zoom-menu" class="submenuholder">Zoom
                                <ul class="submenu">
                                    <li data-action="zoom-in">Zoom In</li>
                                    <li data-action="zoom-out">Zoom Out</li>
                                    <li data-action="zoom-reset">Restore Default Zoom</li>
                                </ul>
                            </li>
                            <li data-action="statusbar" class="disabled">Status Bar</li>
                        </ul>
                    </li>
                    <li id="np-help-menu" class="disabled">Help
                        <ul class="submenu">
                            <li data-action="help-view">Help Topics</li>
                            <li class="divider"></li>
                            <li data-action="help-about">About Notepad</li>
                        </ul>
                    </li>
                </ul>
            </appnavigation>
            <div name="contentinput" contenteditable="true" spellcheck="false" style="height: calc(100% - 21px); user-select: text; -webkit-user-select: text; font-family: 'Lucida Console', 'Courier New', monospace; font-size: 14px; cursor: text; padding: 0px 3px;"></div>
        </appcontentholder>
    `;

    const availableFonts = [
        { name: "Arial", weight: "normal", style: "normal" }, { name: "Arial Black", weight: "900", style: "normal" },
        { name: "Arial", weight: "bold", style: "normal" }, { name: "Arial", weight: "bold", style: "italic" },
        { name: "Arial", weight: "normal", style: "italic" }, { name: "Comic Sans MS", weight: "normal", style: "normal" },
        { name: "Comic Sans MS", weight: "bold", style: "normal" }, { name: "Courier New", weight: "normal", style: "normal" },
        { name: "Courier New", weight: "bold", style: "normal" }, { name: "Courier New", weight: "bold", style: "italic" },
        { name: "Courier New", weight: "normal", style: "italic" }, { name: "Franklin Gothic Medium", weight: "500", style: "normal" },
        { name: "Franklin Gothic Medium", weight: "500", style: "italic" }, { name: "Impact", weight: "normal", style: "normal" },
        { name: "Tahoma", weight: "normal", style: "normal" }, { name: "Tahoma", weight: "bold", style: "normal" },
        { name: "Times New Roman", weight: "normal", style: "normal" }, { name: "Times New Roman", weight: "bold", style: "normal" },
        { name: "Times New Roman", weight: "bold", style: "italic" }, { name: "Times New Roman", weight: "normal", style: "italic" },
        { name: "Trebuchet MS", weight: "normal", style: "normal" }, { name: "Trebuchet MS", weight: "bold", style: "normal" },
        { name: "Trebuchet MS", weight: "bold", style: "italic" }, { name: "Trebuchet MS", weight: "normal", style: "italic" },
        { name: "Lucida Console", weight: "normal", style: "normal"}
    ];

    const fontDialogTemplate = (currentFontFamily, currentFontStyle, currentFontWeight, currentFontSize) => `
        <div style="padding: 15px; font-family: Tahoma, sans-serif; font-size: 11px; width:420px;">
            <div style="display: flex; margin-bottom: 10px;">
                <div style="margin-right: 10px; width: 170px;">
                    <label for="notepad-font-family">Font:</label><br>
                    <input type="text" id="notepad-font-family-input" list="notepad-font-family-list" value="${currentFontFamily}" style="width:100%; margin-bottom:5px;">
                    <datalist id="notepad-font-family-list">
                        ${[...new Set(availableFonts.map(f => f.name))].map(name => `<option value="${name}">`).join('')}
                    </datalist>
                    <select id="notepad-font-family-select" size="4" style="width:100%; height: 80px;">
                        ${[...new Set(availableFonts.map(f => f.name))].map(name => `<option>${name}</option>`).join('')}
                    </select>
                </div>
                <div style="margin-right: 10px; width: 110px;">
                    <label for="notepad-font-style">Font style:</label><br>
                    <input type="text" id="notepad-font-style-input" list="notepad-font-style-list" value="${currentFontWeight === 'bold' && currentFontStyle === 'italic' ? 'Bold Italic' : currentFontWeight === 'bold' ? 'Bold' : currentFontStyle === 'italic' ? 'Italic' : 'Regular'}" style="width:100%; margin-bottom:5px;">
                    <datalist id="notepad-font-style-list">
                        <option value="Regular">
                        <option value="Italic">
                        <option value="Bold">
                        <option value="Bold Italic">
                    </datalist>
                    <select id="notepad-font-style-select" size="4" style="width:100%; height: 80px;">
                        <option>Regular</option>
                        <option>Italic</option>
                        <option>Bold</option>
                        <option>Bold Italic</option>
                    </select>
                </div>
                <div style="width: 70px;">
                    <label for="notepad-font-size">Size:</label><br>
                    <input type="text" id="notepad-font-size-input" list="notepad-font-size-list" value="${currentFontSize}" style="width:100%; margin-bottom:5px;">
                    <datalist id="notepad-font-size-list">
                        ${[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72].map(s => `<option value="${s}">`).join('')}
                    </datalist>
                    <select id="notepad-font-size-select" size="4" style="width:100%; height: 80px;">
                        ${[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72].map(s => `<option>${s}</option>`).join('')}
                    </select>
                </div>
            </div>
            <fieldset style="margin-bottom: 10px; padding: 10px;">
                <legend>Sample</legend>
                <div id="notepad-font-sample" style="height: 50px; overflow: hidden; background-color: white; text-align: center; line-height: 50px; font-size:16px;">AaBbYyZz</div>
            </fieldset>
            <div style="text-align: right; margin-top: 15px;">
                <winbutton id="notepad-font-ok" class="default" style="margin-right: 5px;"><btnopt>OK</btnopt></winbutton>
                <winbutton id="notepad-font-cancel"><btnopt>Cancel</btnopt></winbutton>
            </div>
        </div>
    `;

    const applyFontAndSize = (state) => {
        if (state && state.textfield) {
            state.textfield.style.fontFamily = state.currentFontFamily;
            state.textfield.style.fontSize = state.currentFontSize;
            state.textfield.style.fontStyle = state.currentFontStyle;
            state.textfield.style.fontWeight = state.currentFontWeight;
        }
    };

    const getNotepadState = (hWnd) => {
        const appElement = wm._windows[hWnd];
        if (!appElement) return null;
        if (!appElement._notepadState) {
            appElement._notepadState = {
                currentFilePath: null,
                isDirty: false,
                wordWrapEnabled: localStorage.getItem('notepadWordWrap') === null ? true : localStorage.getItem('notepadWordWrap') === 'true', 
                currentZoomLevel: 100,
                currentFontFamily: localStorage.getItem('notepadDefaultFontFamily') || 'Lucida Console',
                currentFontSize: localStorage.getItem('notepadDefaultFontSize') || '12px',
                currentFontStyle: localStorage.getItem('notepadDefaultFontStyle') || 'normal',
                currentFontWeight: localStorage.getItem('notepadDefaultFontWeight') || 'normal',
                textfield: appElement.querySelector('[name=contentinput]')
            };
        }
        return appElement._notepadState;
    };

    const updateDirtyStar = (hWnd, isDirty, currentFilePath) => {
        const appElement = wm._windows[hWnd];
        if (!appElement) return;
        const captionSpan = appElement.querySelector("appheader span");
        if (!captionSpan) return;
        let baseTitle = currentFilePath ? dm.basename(currentFilePath) : "Untitled";
        let fullTitle = `${baseTitle} - Notepad`;
        if (isDirty) {
            fullTitle = `*${fullTitle}`;
        }
        wm.setCaption(hWnd, fullTitle.replace(" - Notepad - Notepad", " - Notepad"));
    };

    const loadFile = async (hWnd, filePath) => {
        const state = getNotepadState(hWnd);
        if (!filePath || !state) return;
        try {
            const node = await dm.open(filePath);
            if (!node) throw new Error("File not found.");
            if (node.type !== 'file') throw new Error("Cannot open a folder in Notepad.");
            let textContent = node.content;
            const knownTextualMimeTypes = [
                'text/plain', 'text/html', 'text/css', 'text/xml', 'application/json',
                'application/javascript', 'application/x-javascript', 'application/ecmascript',
                'application/xml', 'image/svg+xml'
            ];
            if (textContent instanceof Blob) {
                if (textContent.type && !knownTextualMimeTypes.includes(textContent.type.toLowerCase()) &&
                    textContent.type !== 'application/octet-stream' && textContent.type !== '') {
                     const proceed = await new Promise(resolve => {
                        dialogHandler.spawnDialog({
                            icon: "warning", title: "File Type Warning",
                            text: `File "${dm.basename(filePath)}" might not be a plain text file (type: ${textContent.type}).<br>Do you want to try to open it anyway?`,
                            buttons: [
                                ["Yes", (e) => { wm.closeWindow(e.target.closest("app").id); resolve(true); }],
                                ["No", (e) => { wm.closeWindow(e.target.closest("app").id); resolve(false); }]
                            ]
                        });
                    });
                    if (!proceed) return;
                }
                textContent = await textContent.text();
            } else if (typeof textContent !== 'string') {
                throw new Error("File content is not readable as text.");
            }
            state.textfield.innerText = textContent;
            state.currentFilePath = filePath;
            state.isDirty = false;
            updateDirtyStar(hWnd, state.isDirty, state.currentFilePath);
        } catch (e) {
            dialogHandler.spawnDialog({
                icon: "error", title: "Open Error",
                text: `Could not open "${dm.basename(filePath)}":<br>${e.message}`,
                buttons: [["OK", (dlg) => wm.closeWindow(dlg.target.closest("app").id)]]
            });
        }
    };

    const saveFile = async (hWnd, filePathToSave) => {
        const state = getNotepadState(hWnd);
        if (!filePathToSave || !state) return false;
        try {
            await dm.writeFile(filePathToSave, state.textfield.innerText);
            state.currentFilePath = filePathToSave;
            state.isDirty = false;
            updateDirtyStar(hWnd, state.isDirty, state.currentFilePath);
            return true;
        } catch (e) {
            dialogHandler.spawnDialog({
                icon: "error", title: "Save Error",
                text: `Could not save to "${dm.basename(filePathToSave)}":<br>${e.message}`,
                buttons: [["OK", (dlg) => wm.closeWindow(dlg.target.closest("app").id)]]
            });
            return false;
        }
    };

    const promptSaveChanges = (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state) return Promise.resolve('cancel');
        return new Promise((resolve) => {
            const fileName = state.currentFilePath ? dm.basename(state.currentFilePath) : "Untitled";
            dialogHandler.spawnDialog({
                title: "Notepad",
                text: `Do you want to save changes to ${fileName}?`,
                icon: "question",
                buttons: [
                    ["Save", (e) => { wm.closeWindow(e.target.closest("app").id); resolve('save'); }],
                    ["Don't Save", (e) => { wm.closeWindow(e.target.closest("app").id); resolve('dontsave'); }],
                    ["Cancel", (e) => { wm.closeWindow(e.target.closest("app").id); resolve('cancel'); }]
                ]
            });
        });
    };

    const handleNew = async (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state) return;
        if (state.isDirty) {
            const choice = await promptSaveChanges(hWnd);
            if (choice === 'cancel') return;
            if (choice === 'save') {
                const saved = await handleSave(hWnd);
                if (!saved) return;
            }
        }
        state.textfield.innerText = "";
        state.currentFilePath = null;
        state.isDirty = false;
        updateDirtyStar(hWnd, state.isDirty, state.currentFilePath);
    };

    const handleOpen = async (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state) return;
        if (state.isDirty) {
            const choice = await promptSaveChanges(hWnd);
            if (choice === 'cancel') return;
            if (choice === 'save') {
                const saved = await handleSave(hWnd);
                if (!saved) return;
            }
        }
        const initialUserPath = `C:/Documents and Settings/${window.shell?._currentUser || "Administrator"}/My Documents`;
        const selectedPath = await wm.openFileDialog({
            title: "Open",
            initialPath: state.currentFilePath ? dm.dirname(state.currentFilePath) : initialUserPath,
            filters: [
                { name: "Text Documents (*.txt, *.log, *.ini, etc.)", extensions: ["txt", "log", "ini", "bat", "sys", "js", "css", "html", "htm", "json", "xml", "md", "inf", "reg", "url", "vbs"] },
                { name: "All Files (*.*)", extensions: ["*.*"] }
            ]
        });
        if (selectedPath) {
            await loadFile(hWnd, selectedPath);
        }
    };

    const handleSave = async (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state) return false;
        if (!state.currentFilePath) {
            return await handleSaveAs(hWnd);
        } else {
            return await saveFile(hWnd, state.currentFilePath);
        }
    };

    const handleSaveAs = async (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state) return false;
        const initialUserPath = `C:/Documents and Settings/${window.shell?._currentUser || "Administrator"}/My Documents`;
        const selectedPath = await wm.saveFileDialog({
            title: "Save As",
            initialPath: state.currentFilePath ? dm.dirname(state.currentFilePath) : initialUserPath,
            defaultName: state.currentFilePath ? dm.basename(state.currentFilePath) : "Untitled.txt",
            filters: [
                { name: "Text Documents (*.txt)", extensions: ["txt"] },
                { name: "All Files (*.*)", extensions: ["*.*"] }
            ]
        });
        if (selectedPath) {
            return await saveFile(hWnd, selectedPath);
        }
        return false;
    };

    const handleExit = async (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state) { wm.closeWindow(hWnd); return; }
        if (state.isDirty) {
            const choice = await promptSaveChanges(hWnd);
            if (choice === 'cancel') return;
            if (choice === 'save') {
                const saved = await handleSave(hWnd);
                if (!saved) return;
            }
        }
        wm.closeWindow(hWnd);
    };

    const insertDateTime = (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state) return;
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString();
        const dateTimeString = `${time} ${date}`;
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (state.textfield.contains(range.commonAncestorContainer)) {
                range.deleteContents();
                range.insertNode(document.createTextNode(dateTimeString));
                range.collapse(false);
            } else {
                state.textfield.innerText += dateTimeString;
            }
        } else {
            state.textfield.innerText += dateTimeString;
        }
        state.isDirty = true;
        updateDirtyStar(hWnd, state.isDirty, state.currentFilePath);
    };

    const toggleWordWrap = (hWnd, menuItemElement) => {
        const state = getNotepadState(hWnd);
        if (!state) return;
        state.wordWrapEnabled = !state.wordWrapEnabled;
        state.textfield.style.whiteSpace = state.wordWrapEnabled ? 'pre-wrap' : 'pre';
        state.textfield.style.overflowX = state.wordWrapEnabled ? 'hidden' : 'auto';
        if (menuItemElement) {
            menuItemElement.innerHTML = state.wordWrapEnabled ? '<span>✓ Word Wrap</span>' : '<span>Word Wrap</span>';
        }
    };

    const zoom = (hWnd, direction) => {
        const state = getNotepadState(hWnd);
        if (!state) return;
        if (direction === 'in') state.currentZoomLevel += 10;
        else if (direction === 'out') state.currentZoomLevel -= 10;
        else state.currentZoomLevel = 100;
        if (state.currentZoomLevel < 10) state.currentZoomLevel = 10;
        if (state.currentZoomLevel > 500) state.currentZoomLevel = 500;
        state.textfield.style.zoom = `${state.currentZoomLevel}%`;
    };

    const handleFont = async (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state) return;

        const dialogContent = document.createElement('div');
        dialogContent.innerHTML = fontDialogTemplate(
            state.currentFontFamily,
            state.currentFontStyle,
            state.currentFontWeight,
            parseInt(state.currentFontSize)
        );

        const fontDialogHWnd = wm.createNewWindow('notepadFontDialog', dialogContent, { parent: hWnd, skipIteratedPosition: true });
        wm.setCaption(fontDialogHWnd, "Font");
        wm.setSize(fontDialogHWnd, "auto", "auto");
        wm.setDialog(fontDialogHWnd);
        wm.removeIcon(fontDialogHWnd);

        const familyInput = dialogContent.querySelector('#notepad-font-family-input');
        const familySelect = dialogContent.querySelector('#notepad-font-family-select');
        const styleInput = dialogContent.querySelector('#notepad-font-style-input');
        const styleSelect = dialogContent.querySelector('#notepad-font-style-select');
        const sizeInput = dialogContent.querySelector('#notepad-font-size-input');
        const sizeSelect = dialogContent.querySelector('#notepad-font-size-select');
        const sampleText = dialogContent.querySelector('#notepad-font-sample');

        const updateSample = () => {
            let fontWeight = 'normal';
            let fontStyle = 'normal';
            const selectedStyle = styleInput.value.toLowerCase();

            if (selectedStyle.includes('bold')) fontWeight = 'bold';
            if (selectedStyle.includes('italic')) fontStyle = 'italic';

            sampleText.style.fontFamily = familyInput.value || 'Lucida Console';
            sampleText.style.fontSize = (sizeInput.value || '14') + 'px';
            sampleText.style.fontWeight = fontWeight;
            sampleText.style.fontStyle = fontStyle;
        };
        
        familySelect.value = state.currentFontFamily;
        if (state.currentFontWeight === 'bold' && state.currentFontStyle === 'italic') styleSelect.value = "Bold Italic";
        else if (state.currentFontWeight === 'bold') styleSelect.value = "Bold";
        else if (state.currentFontStyle === 'italic') styleSelect.value = "Italic";
        else styleSelect.value = "Regular";
        sizeSelect.value = parseInt(state.currentFontSize).toString();
        
        familyInput.value = familySelect.value;
        styleInput.value = styleSelect.value;
        sizeInput.value = sizeSelect.value;
        updateSample();

        familyInput.oninput = updateSample;
        styleInput.oninput = updateSample;
        sizeInput.oninput = updateSample;
        familyInput.onchange = () => { familySelect.value = familyInput.value; updateSample();};
        styleInput.onchange = () => { styleSelect.value = styleInput.value; updateSample();};
        sizeInput.onchange = () => { sizeSelect.value = sizeInput.value; updateSample();};
        familySelect.onchange = () => { familyInput.value = familySelect.value; updateSample();};
        styleSelect.onchange = () => { styleInput.value = styleSelect.value; updateSample();};
        sizeSelect.onchange = () => { sizeInput.value = sizeSelect.value; updateSample();};

        dialogContent.querySelector('#notepad-font-ok').onclick = () => {
            state.currentFontFamily = familyInput.value || 'Lucida Console';
            const selectedStyle = styleInput.value.toLowerCase();
            state.currentFontWeight = selectedStyle.includes('bold') ? 'bold' : 'normal';
            state.currentFontStyle = selectedStyle.includes('italic') ? 'italic' : 'normal';
            state.currentFontSize = (sizeInput.value || '14') + 'px';
            
            applyFontAndSize(state);
            localStorage.setItem('notepadDefaultFontFamily', state.currentFontFamily);
            localStorage.setItem('notepadDefaultFontSize', state.currentFontSize);
            localStorage.setItem('notepadDefaultFontStyle', state.currentFontStyle);
            localStorage.setItem('notepadDefaultFontWeight', state.currentFontWeight);
            wm.closeWindow(fontDialogHWnd);
        };
        dialogContent.querySelector('#notepad-font-cancel').onclick = () => {
            wm.closeWindow(fontDialogHWnd);
        };
    };
    
    const handleSelectAll = (hWnd) => {
        const state = getNotepadState(hWnd);
        if (!state || !state.textfield) return;
        try {
            state.textfield.focus();
            const range = document.createRange();
            range.selectNodeContents(state.textfield);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        } catch(e) {
            if (state.textfield.select) state.textfield.select();
        }
    };

    registerApp({
        _template: null,
        setup: async function() {
            this._template = document.createElement("template");
            this._template.innerHTML = notepadTemplate;
        },
        start: async function(options = {}) {
            const windowContents = this._template.content.firstElementChild.cloneNode(true);
            const hWnd = wm.createNewWindow("notepad", windowContents);
            const selfWindow = wm._windows[hWnd];

            const state = getNotepadState(hWnd);
            state.currentFilePath = options.filePath || null;
            state.isDirty = false;
state.wordWrapEnabled = localStorage.getItem('notepadWordWrap') === null ? true : localStorage.getItem('notepadWordWrap') === 'true';
            state.currentZoomLevel = parseInt(localStorage.getItem('notepadZoomLevel')) || 100;
            
            state.textfield.style.whiteSpace = state.wordWrapEnabled ? 'pre-wrap' : 'pre';
            state.textfield.style.overflowX = state.wordWrapEnabled ? 'hidden' : 'auto';
            state.textfield.style.zoom = `${state.currentZoomLevel}%`;
            applyFontAndSize(state);

            wm.setIcon(hWnd, "notepad.png");
            wm.setSize(hWnd, 657, 397);

            if (state.currentFilePath) {
                await loadFile(hWnd, state.currentFilePath);
            } else if (options && typeof options.contents === 'string') {
                state.textfield.innerText = options.contents;
                updateDirtyStar(hWnd, state.isDirty, state.currentFilePath);
            } else {
                updateDirtyStar(hWnd, state.isDirty, state.currentFilePath);
            }

            state.textfield.oninput = () => {
                if (!state.isDirty) {
                    state.isDirty = true;
                    updateDirtyStar(hWnd, state.isDirty, state.currentFilePath);
                }
            };
            
            const wordWrapMenuItem = selfWindow.querySelector('[data-action="wordwrap"]');
            if (wordWrapMenuItem) {
                 wordWrapMenuItem.innerHTML = state.wordWrapEnabled ? '<span>✓ Word Wrap</span>' : '<span>Word Wrap</span>';
            }

            selfWindow.querySelectorAll('[data-action]').forEach(item => {
                const action = item.dataset.action;
                item.onclick = null; 
                switch (action) {
                    case 'new': item.onclick = () => handleNew(hWnd); break;
                    case 'open': item.onclick = () => handleOpen(hWnd); break;
                    case 'save': item.onclick = () => handleSave(hWnd); break;
                    case 'saveas': item.onclick = () => handleSaveAs(hWnd); break;
                    case 'exit': item.onclick = () => handleExit(hWnd); break;
                    case 'datetime': item.onclick = () => insertDateTime(hWnd); break;
                    case 'wordwrap': item.onclick = () => { toggleWordWrap(hWnd, item); localStorage.setItem('notepadWordWrap', state.wordWrapEnabled); }; break;
                    case 'font': item.onclick = () => handleFont(hWnd); break;
                    case 'zoom-in': item.onclick = () => { zoom(hWnd, 'in'); localStorage.setItem('notepadZoomLevel', state.currentZoomLevel);}; break;
                    case 'zoom-out': item.onclick = () => { zoom(hWnd, 'out'); localStorage.setItem('notepadZoomLevel', state.currentZoomLevel);}; break;
                    case 'zoom-reset': item.onclick = () => { zoom(hWnd, 'reset'); localStorage.setItem('notepadZoomLevel', state.currentZoomLevel);}; break;
                    case 'selectall': item.onclick = () => handleSelectAll(hWnd); break;
                    case 'help-about':
                        item.onclick = () => {
                            apps.load('winver').then(app => {
                                if (app && typeof app.start === 'function') {
                                    app.start({
                                        appName: "Microsoft® Notepad",
                                        dialogTitle: "Notepad",
                                        appIconPath: "notepad.png",
                                        headerIconPath: "res/icons/notepad.png"
                                    });
                                }
                            });
                        };
                        break;
                }
            });

            const closeButton = selfWindow.querySelector('appcontrols .closebtn');
            if (closeButton) {
                const newCloseButton = closeButton.cloneNode(true);
                closeButton.parentNode.replaceChild(newCloseButton, closeButton);
                newCloseButton.onclick = async (e) => {
                    e.stopPropagation();
                    await handleExit(hWnd);
                };
            }
            
            selfWindow.addEventListener('wm:windowClosed', () => {
                if (selfWindow._notepadState) {
                    delete selfWindow._notepadState;
                }
            }, { once: true });

            return hWnd;
        },
    })
})();