// js/apps/cmd.js
(function() {
    const cmdTemplate = `
        <appcontentholder>
            <div class="cmd-main cmd-bg-0 cmd-fg-7">
                <div class="cmd-backlog">
                </div>
            </div>
        </appcontentholder>
    `;

    const cmdCss = `
        @font-face {
            font-family: vga8x14;
            src: url('res/fonts/Web437_IBM_VGA_8x14.woff');
        }
        .cmd-main {
            font-family: vga8x14, "IBM VGA 8x14", Fixedsys, Monaco, monospace;
            font-size: 14px;
            line-height: 12px;
            letter-spacing: 0;
            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            cursor: text;
        }
        .cmd-line {
            height: 12px;
            white-space: pre;
        }
        .cmd-editor {
            display: inline-block;
            outline: 0px transparent;
            user-select: text;
            -webkit-user-select: text;
            min-width: 1px;
        }
        .cmd-fg-0 { color: #000000; } .cmd-fg-1 { color: #000080; }
        .cmd-fg-2 { color: #008000; } .cmd-fg-3 { color: #008080; }
        .cmd-fg-4 { color: #800000; } .cmd-fg-5 { color: #800080; }
        .cmd-fg-6 { color: #808000; } .cmd-fg-7 { color: #c0c0c0; }
        .cmd-fg-8 { color: #808080; } .cmd-fg-9 { color: #0000ff; }
        .cmd-fg-a { color: #00ff00; } .cmd-fg-b { color: #00ffff; }
        .cmd-fg-c { color: #ff0000; } .cmd-fg-d { color: #ff00ff; }
        .cmd-fg-e { color: #ffff00; } .cmd-fg-f { color: #ffffff; }
        .cmd-bg-0 { background-color: #000000; } .cmd-bg-1 { background-color: #000080; }
        .cmd-bg-2 { background-color: #008000; } .cmd-bg-3 { background-color: #008080; }
        .cmd-bg-4 { background-color: #800000; } .cmd-bg-5 { background-color: #800080; }
        .cmd-bg-6 { background-color: #800000; } .cmd-bg-7 { background-color: #c0c0c0; }
        .cmd-bg-8 { background-color: #808080; } .cmd-bg-9 { background-color: #0000ff; }
        .cmd-bg-a { background-color: #00ff00; } .cmd-bg-b { background-color: #00ffff; }
        .cmd-bg-c { background-color: #ff0000; } .cmd-bg-d { background-color: #ff00ff; }
        .cmd-bg-e { background-color: #ffff00; } .cmd-bg-f { background-color: #ffffff; }
    `;

    const VERSION_STR = "Microsoft Windows XP [Version 5.1.2600]";
    const COPYRIGHT_STR = "(C) Copyright 1985-2001 Microsoft Corp.";

    const initializeCmdState = (appElement, hWnd) => {
        const currentUser = shell._currentUser || "Administrator";
        const state = {
            hWnd: hWnd,
            currentPath: `C:/Documents and Settings/${currentUser}`,
            backlogElement: appElement.querySelector(".cmd-backlog"),
            mainElement: appElement.querySelector(".cmd-main"),
            editorElement: null,
            envVars: {
                PROMPT: "$P$G", PATH: "C:/WINDOWS/system32;C:/WINDOWS;",
                TEMP: "C:/WINDOWS/Temp", TMP: "C:/WINDOWS/Temp",
                USERNAME: currentUser, USERPROFILE: `C:/Documents and Settings/${currentUser}`,
                SystemDrive: "C:", SystemRoot: "C:/WINDOWS", WINDIR: "C:/WINDOWS",
                ComSpec: "C:/WINDOWS/system32/cmd.exe", ERRORLEVEL: "0"
            },
            commandHistory: [], historyIndex: -1,
            isExecutingBat: false, batScriptLines: [], batLabelMap: {}, batLinePointer: 0,
            echoOn: true, currentColors: { fg: '7', bg: '0' },
            _eventListenersAttached: false
        };
        appElement._cmdState = state;
        return state;
    };

    const getCmdState = (hWnd) => {
        const appElement = wm._windows[hWnd];
        return appElement ? appElement._cmdState : null;
    };

    const utils = {
        escapeHtml: (text) => {
            if (typeof text !== 'string') text = String(text);
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        },
        clear: (state) => {
            state.backlogElement.innerHTML = "";
            utils.newLine(state, false);
        },
        print: (state, text, rawHtml = false) => {
            if (!state || !state.backlogElement) return;
            let lastLine = state.backlogElement.lastElementChild;
            if (!lastLine) lastLine = utils.newLine(state, false);
            const editor = lastLine.querySelector(".cmd-editor");
            if (editor) lastLine.removeChild(editor);
            const textToPrint = rawHtml ? text : utils.escapeHtml(text);
            const lines = textToPrint.split('\n');
            lines.forEach((part, index) => {
                lastLine.innerHTML += part;
                if (index < lines.length - 1) lastLine = utils.newLine(state, false);
            });
            if (editor && lastLine) lastLine.appendChild(editor); // Check if lastLine still exists
            utils.scrollToBottom(state);
        },
        println: (state, text, rawHtml = false) => {
            if (!state) return;
            if (text === undefined || text === null) text = "";
            utils.print(state, text, rawHtml);
            if (String(text).indexOf('\n') === -1) utils.newLine(state);
        },
        newLine: (state, scroll = true) => {
            if (!state || !state.backlogElement || !state.editorElement) return null;
            if (state.editorElement.parentElement) state.editorElement.parentElement.removeChild(state.editorElement);
            const newLineElement = document.createElement("div");
            newLineElement.classList.add("cmd-line");
            state.backlogElement.appendChild(newLineElement);
            newLineElement.appendChild(state.editorElement);
            if (scroll) utils.scrollToBottom(state);
            return newLineElement;
        },
        getPrompt: (state) => {
            let promptStr = state.envVars.PROMPT || "$P$G";
            promptStr = promptStr.replace(/\$P/gi, state.currentPath.replace(/\//g, '\\'));
            promptStr = promptStr.replace(/\$G/gi, ">");
            promptStr = promptStr.replace(/\$T/gi, new Date().toLocaleTimeString());
            promptStr = promptStr.replace(/\$D/gi, new Date().toLocaleDateString());
            promptStr = promptStr.replace(/\$V/gi, VERSION_STR);
            promptStr = promptStr.replace(/\$N/gi, state.currentPath.split(':')[0]);
            promptStr = promptStr.replace(/\$Q/gi, "=");
            promptStr = promptStr.replace(/\$\$/gi, "$");
            promptStr = promptStr.replace(/\$_/gi, "\n");
            return promptStr;
        },
        printPrompt: (state) => {
            if (!state || !state.editorElement) return;
            if (state.echoOn && !state.isExecutingBat) {
                let currentLine = state.editorElement.parentElement;
                if (!currentLine || !currentLine.classList.contains("cmd-line")) { // Should not happen with new newLine logic
                    currentLine = utils.newLine(state, false);
                }
                currentLine.insertBefore(document.createTextNode(utils.getPrompt(state)), state.editorElement);
                utils.scrollToBottom(state);
            }
        },
        scrollToBottom: (state) => {
            if (state && state.mainElement) state.mainElement.scrollTop = state.mainElement.scrollHeight;
        },
        sleep: async (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        resolvePath: (state, inputPath) => {
            if (!inputPath) return state.currentPath;
            const expandedPath = utils.expandEnvVars(state, inputPath);
            if (/^[A-Za-z]:/.test(expandedPath.substring(0,2))) {
                 try { return dm._normalizeAndSplitPath(expandedPath).fullPath; }
                 catch { return expandedPath; }
            }
            return dm.join(state.currentPath, expandedPath);
        },
        expandEnvVars: (state, text) => {
            if (typeof text !== 'string') return text;
            return text.replace(/%([^%]+)%/gi, (match, varName) => {
                const upperVarName = varName.toUpperCase();
                return state.envVars[upperVarName] !== undefined ? state.envVars[upperVarName] : match;
            });
        },
        parseArgs: (argsString) => {
            return (argsString.match(/(?:[^\s"]+|"[^"]*")+/g) || []).map(arg => arg.replace(/"/g, ''));
        }
    };

    const builtins = {
        cd: async (state, argsInput) => { const args = utils.parseArgs(argsInput); const targetArg = args[0] || ""; if (!targetArg || targetArg === '.' || targetArg ==='./') { utils.println(state, state.currentPath.replace(/\//g, '\\')); return; } if (targetArg === '..') { const parentPath = dm.dirname(state.currentPath); if (parentPath !== state.currentPath) { state.currentPath = parentPath; } return; } const targetPath = utils.resolvePath(state, targetArg); try { const node = await dm.open(targetPath); if (node && node.type === 'folder') { state.currentPath = node.id; } else if (node && node.type === 'file') { utils.println(state, `The directory name is invalid.`); } else { utils.println(state, `The system cannot find the path specified.`); } } catch { utils.println(state, `The system cannot find the path specified.`); } },
        chdir: async (state, args) => builtins.cd(state, args),
        cls: async (state) => { utils.clear(state); if (!state.isExecutingBat || state.batScriptLines.length <= state.batLinePointer) { utils.printPrompt(state); } },
        color: async (state, argsInput) => { const args = argsInput.trim(); if (!args) { state.mainElement.className = "cmd-main cmd-bg-0 cmd-fg-7"; state.currentColors = { bg: '0', fg: '7' }; return; } if (args.toLowerCase() === "me surprised") { for (let i = 0; i < 16; i++) { let fg = Number(i).toString(16).toLowerCase(); let line = ""; for (let j = 0; j < 16; j++) { let bg = Number(j).toString(16).toLowerCase(); line += `<span class="cmd-bg-${bg} cmd-fg-${fg}"> ${bg}${fg} </span>`; } utils.println(state, line, true); } return; } let newBg = state.currentColors.bg, newFg = state.currentColors.fg; if (args.length === 1 && /^[0-9a-f]$/i.test(args)) newFg = args.toLowerCase(); else if (args.length === 2 && /^[0-9a-f]{2}$/i.test(args)) { newBg = args[0].toLowerCase(); newFg = args[1].toLowerCase(); } else { utils.println(state, "Invalid color attribute specified."); return; } state.mainElement.className = `cmd-main cmd-bg-${newBg} cmd-fg-${newFg}`; state.currentColors = { bg: newBg, fg: newFg }; },
        dir: async (state, argsInput) => { const args = utils.parseArgs(argsInput); const targetArg = args[0] || ""; const targetPath = targetArg ? utils.resolvePath(state, targetArg) : state.currentPath; let node; try { node = await dm.open(targetPath); } catch {} if (!node) { utils.println(state, "File Not Found"); return; } if (node.type === 'file') { utils.println(state, ` ${new Date(node.modifiedAt).toLocaleDateString()}  ${new Date(node.modifiedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} ${node.content instanceof Blob ? String(node.content.size).padStart(14) : String(node.content?.length || 0).padStart(14)} ${node.name}`); utils.println(state, `\n${String(1).padStart(16)} File(s) ${String(node.content instanceof Blob ? node.content.size : (node.content?.length || 0)).padStart(14)} bytes`); utils.println(state, `${String(0).padStart(16)} Dir(s)  ${String("2,147,483,648").padStart(14)} bytes free`); return; } utils.println(state, ` Volume in drive ${targetPath.charAt(0)} has no label.`); utils.println(state, ` Volume Serial Number is FAKE-BEEF`); utils.println(state, `\n Directory of ${targetPath.replace(/\//g, '\\')}\n`); const items = await dm.list(targetPath); let fileCount = 0, dirCount = 0, totalSize = 0; const dirItems = items.filter(item => item.type === 'folder'); const fileItems = items.filter(item => item.type === 'file'); [...dirItems, ...fileItems].forEach(item => { const date = new Date(item.modifiedAt).toLocaleDateString(); const time = new Date(item.modifiedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); if (item.type === 'folder') { utils.println(state, ` ${date}  ${time}    <DIR>          ${item.name === '' ? '.' : item.name}`); dirCount++; } else { const size = item.content instanceof Blob ? item.content.size : (item.content ? new TextEncoder().encode(item.content).length : 0); utils.println(state, ` ${date}  ${time} ${String(size).padStart(16)} ${item.name}`); fileCount++; totalSize += size; } }); utils.println(state, `\n${String(fileCount).padStart(16)} File(s) ${String(totalSize).padStart(14)} bytes`); utils.println(state, `${String(dirCount).padStart(16)} Dir(s)  ${String("2,147,483,648").padStart(14)} bytes free`); },
        echo: async (state, args) => { const expandedArgs = utils.expandEnvVars(state, args); if (expandedArgs.toLowerCase() === "off") state.echoOn = false; else if (expandedArgs.toLowerCase() === "on") state.echoOn = true; else if (state.echoOn || args.length > 0) utils.println(state, expandedArgs); },
        exit: async (state) => wm.closeWindow(state.hWnd),
        help: async (state, argsInput) => { const cmdName = (argsInput || "").trim().toLowerCase(); if (cmdName && helpTopics[cmdName]) utils.println(state, helpTopics[cmdName]); else if (cmdName) utils.println(state, `This command is not supported by the help utility.`); else { utils.println(state, "For more information on a specific command, type HELP command-name\n"); Object.keys(builtins).sort().forEach(cmd => { const desc = helpTopics[cmd] ? helpTopics[cmd].split('\n')[0] : `Executes the ${cmd.toUpperCase()} command.`; utils.println(state, ` ${cmd.toUpperCase().padEnd(12)} ${desc}`); }); } },
        md: async (state, argsInput) => { const pathArg = utils.parseArgs(argsInput)[0]; if (!pathArg) { utils.println(state, "The syntax of the command is incorrect."); return; } const targetPath = utils.resolvePath(state, pathArg); try { await dm.mkdir(targetPath); state.envVars.ERRORLEVEL = "0"; } catch (e) { utils.println(state, e.message.includes("already exists") ? `A subdirectory or file ${dm.basename(targetPath)} already exists.` : e.message ); state.envVars.ERRORLEVEL = "1"; } },
        mkdir: async (state, args) => builtins.md(state, args),
        rd: async (state, argsInput) => { const pathArg = utils.parseArgs(argsInput)[0]; if (!pathArg) { utils.println(state, "The syntax of the command is incorrect."); return; } const targetPath = utils.resolvePath(state, pathArg); try { const node = await dm.open(targetPath); if (!node) { utils.println(state, "The system cannot find the file specified."); state.envVars.ERRORLEVEL = "1"; return; } if (node.type !== 'folder') { utils.println(state, `The directory name is invalid.`); state.envVars.ERRORLEVEL = "1"; return; } const items = await dm.list(targetPath); if (items.length > 0) { utils.println(state, "The directory is not empty."); state.envVars.ERRORLEVEL = "1"; return; } await dm.permanentDelete(targetPath); state.envVars.ERRORLEVEL = "0"; } catch (e) { utils.println(state, `Error: ${e.message}`); state.envVars.ERRORLEVEL = "1"; } },
        rmdir: async (state, args) => builtins.rd(state, args),
        del: async (state, argsInput) => { const pathArg = utils.parseArgs(argsInput)[0]; if (!pathArg) { utils.println(state, "The syntax of the command is incorrect."); return; } const targetPath = utils.resolvePath(state, pathArg); try { const node = await dm.open(targetPath); if (!node) { utils.println(state, `Could Not Find ${targetPath.replace(/\//g, '\\')}`); state.envVars.ERRORLEVEL = "1"; return; } if (node.type === 'folder') { utils.println(state, `${targetPath.replace(/\//g, '\\')} is a directory. Use RMDIR.`); state.envVars.ERRORLEVEL = "1"; return; } await dm.permanentDelete(targetPath); state.envVars.ERRORLEVEL = "0"; } catch (e) { utils.println(state, `Error: ${e.message}`); state.envVars.ERRORLEVEL = "1"; } },
        erase: async (state, args) => builtins.del(state, args),
        rem: async () => {},
        start: async (state, argsInput) => { const args = utils.parseArgs(argsInput); if (args.length === 0) { utils.println(state, "No application specified."); return; } let appToRun = args[0]; const appParams = args.slice(1).join(" "); if (window.apps.defaultAction.hasOwnProperty(appToRun.toLowerCase())) { const action = window.apps.defaultAction[appToRun.toLowerCase()]; if (!action) apps.load(appToRun, {arguments: appParams}).then(app => { if(app && typeof app.start === 'function') app.start({arguments: appParams}) }); else try { eval(action); } catch (e) { utils.println(state, `Error executing '${appToRun}': ${e.message}`); } } else if (appToRun.toLowerCase().endsWith('.exe') || appToRun.toLowerCase().endsWith('.com')) { const appNameOnly = appToRun.replace(/\.(exe|com)$/i, ''); const resolvedPath = utils.resolvePath(state, appToRun); apps.load(appNameOnly, {filePath: resolvedPath, arguments: appParams}).then(app => { if(app && typeof app.start === 'function') app.start({filePath: resolvedPath, arguments: appParams}); }); } else { const resolvedPath = utils.resolvePath(state, appToRun); const node = await dm.open(resolvedPath); if (node && node.type === 'file') { const ext = node.name.split('.').pop().toLowerCase(); if (window.explorer && window.explorer.handlers[ext]) window.explorer.handlers[ext](resolvedPath); else utils.println(state, `'${appToRun}' is not recognized.`); } else utils.println(state, `'${appToRun}' is not recognized.`); } state.envVars.ERRORLEVEL = "0"; },
        title: async (state, args) => { const newTitle = args ? args : "C:\\WINDOWS\\System32\\cmd.exe"; wm.setCaption(state.hWnd, newTitle); },
        type: async (state, argsInput) => { const pathArg = utils.parseArgs(argsInput)[0]; if (!pathArg) { utils.println(state, "The syntax of the command is incorrect."); return; } const targetPath = utils.resolvePath(state, pathArg); try { const node = await dm.open(targetPath); if (!node) { utils.println(state, "The system cannot find the file specified."); return; } if (node.type === 'folder') { utils.println(state, "Access is denied."); return; } let content = node.content; if (content instanceof Blob) content = await content.text(); utils.println(state, content || ""); } catch (e) { utils.println(state, "The system cannot find the file specified."); } },
        ver: async (state) => utils.println(state, `\n${VERSION_STR}\n`),
        call: async(state, argsInput) => {
            const batFileName = utils.parseArgs(argsInput)[0];
            if (!batFileName) { utils.println(state, "The syntax of the command is incorrect. No batch file specified."); return; }
            const targetPathForCall = utils.resolvePath(state, batFileName);
            try {
                const node = await dm.open(targetPathForCall);
                if (!node || node.type !== 'file' || !node.name.toLowerCase().endsWith('.bat')) { utils.println(state, `The batch file ${dm.basename(targetPathForCall)} cannot be found.`); return; }
                let content = node.content; if (content instanceof Blob) content = await content.text();
                state.batScriptLines = content.split(/\r\n|\r|\n/); state.batLinePointer = 0; state.batLabelMap = {};
                state.batScriptLines.forEach((line, index) => { const trimmedLine = line.trim(); if (trimmedLine.startsWith(':')) state.batLabelMap[trimmedLine.substring(1).toLowerCase()] = index; });
                await processBatQueue(state);
            } catch (e) { utils.println(state, `Error loading batch file: ${e.message}`); }
        },
        goto: async(state, argsInput) => { if (!state.isExecutingBat) { utils.println(state, "'goto' is only valid in a batch file."); return; } const label = argsInput.trim().toLowerCase(); if (state.batLabelMap[label] !== undefined) state.batLinePointer = state.batLabelMap[label]; else { utils.println(state, `Label ${argsInput.trim()} not found.`); state.batLinePointer = state.batScriptLines.length; } },
        set: async(state, argsInput) => { const args = argsInput.trim(); if (!args) { Object.entries(state.envVars).sort((a,b) => a[0].localeCompare(b[0])).forEach(([key, value]) => utils.println(state, `${key}=${value}`)); return; } const parts = args.split('='); if (parts.length >= 1) { const varName = parts[0].trim().toUpperCase(); if (!varName) { utils.println(state, "Environment variable name cannot be empty."); return;} if (parts.length === 1) { if (state.envVars[varName] !== undefined) utils.println(state, `${varName}=${state.envVars[varName]}`); else utils.println(state, `Environment variable ${varName} not defined`); } else { const value = parts.slice(1).join('=').trim(); state.envVars[varName] = value; } } },
        path: async(state, args) => { if (!args.trim()) utils.println(state, `PATH=${state.envVars.PATH || ""}`); else state.envVars.PATH = args.trim(); },
        prompt: async(state, args) => { const newPrompt = args.trim(); if (!newPrompt) utils.println(state, `Current prompt is: ${state.envVars.PROMPT || "$P$G"}`); else state.envVars.PROMPT = newPrompt; },
        date: async(state) => utils.println(state, `The current date is: ${new Date().toLocaleDateString()}`),
        time: async(state) => utils.println(state, `The current time is: ${new Date().toLocaleTimeString()}`),
        copy: async(state, argsInput) => { const args = utils.parseArgs(argsInput); if (args.length < 2) { utils.println(state, "The syntax of the command is incorrect."); return; } const source = utils.resolvePath(state, args[0]); const destArg = args.slice(1).join(" "); let dest = utils.resolvePath(state, destArg); try { const sourceNode = await dm.open(source); if (!sourceNode || sourceNode.type === 'folder') { utils.println(state, "The system cannot find the file specified."); return;} let destNode = await dm.open(dest); if (destNode && destNode.type === 'folder') dest = dm.join(dest, dm.basename(source)); else if (!destNode && (destArg.endsWith('/') || destArg.endsWith('\\'))) { utils.println(state, "The system cannot find the path specified."); return; } await dm.copy(source, dm.dirname(dest)); utils.println(state, "        1 file(s) copied."); } catch (e) { utils.println(state, e.message); } },
        move: async(state, argsInput) => { const args = utils.parseArgs(argsInput); if (args.length < 2) { utils.println(state, "The syntax of the command is incorrect."); return; } const source = utils.resolvePath(state, args[0]); const destArg = args.slice(1).join(" "); let dest = utils.resolvePath(state, destArg); try { const sourceNode = await dm.open(source); if (!sourceNode) { utils.println(state, "The system cannot find the file specified."); return;} let destNode = await dm.open(dest); let destPathFinalDir = dm.dirname(dest); let newName = dm.basename(dest); if (destNode && destNode.type === 'folder') { destPathFinalDir = dest; newName = dm.basename(source); } else if (!destNode && (destArg.endsWith('/') || destArg.endsWith('\\'))) { await dm.mkdir(dest); destPathFinalDir = dest; newName = dm.basename(source); } if (dm.dirname(source) === destPathFinalDir && dm.basename(source) !== newName) await dm.rename(source, newName); else { await dm.move(source, destPathFinalDir); if (dm.basename(source) !== newName && destPathFinalDir !== dm.dirname(source)) await dm.rename(dm.join(destPathFinalDir, dm.basename(source)), newName); } utils.println(state, `        1 file(s) moved.`); } catch (e) { utils.println(state, e.message); } },
        ren: async(state, argsInput) => { const args = utils.parseArgs(argsInput); if (args.length !== 2) { utils.println(state, "The syntax of the command is incorrect."); return; } const oldPath = utils.resolvePath(state, args[0]); const newName = args[1]; try { await dm.rename(oldPath, newName); } catch (e) { utils.println(state, e.message); } },
        rename: async(state, args) => builtins.ren(state, args),
        ping: async(state, argsInput) => { const args = utils.parseArgs(argsInput); let count = 4; let target = "127.0.0.1"; for (let i = 0; i < args.length; i++) { if (args[i].toLowerCase() === '-n' && args[i+1]) { count = parseInt(args[i+1]) || 4; i++; } else if (!args[i].startsWith('-')) target = args[i]; } utils.println(state, `\nPinging ${target} with 32 bytes of data:`); for (let i = 0; i < count; i++) { await utils.sleep(1000); utils.println(state, `Reply from ${target}: bytes=32 time<1ms TTL=128`); } utils.println(state, `\nPing statistics for ${target}:\n    Packets: Sent = ${count}, Received = ${count}, Lost = 0 (0% loss),`); },
        mode: async(state, argsInput) => { utils.println(state, `Simulated MODE command: ${argsInput}`); }
    };
    const helpTopics = { "cd": "Displays the name of or changes the current directory.", "chdir": "Displays the name of or changes the current directory.", "cls": "Clears the screen.", "color": "Sets the default console foreground and background colors.", "copy": "Copies one or more files to another location.", "date": "Displays or sets the date.", "del": "Deletes one or more files.", "dir": "Displays a list of files and subdirectories in a directory.", "echo": "Displays messages, or turns command echoing on or off.", "erase": "Deletes one or more files. (Same as DEL)", "exit": "Quits the CMD.EXE program (command interpreter).", "help": "Provides Help information for Windows XP commands.", "md": "Creates a directory.", "mkdir": "Creates a directory.", "move": "Moves files and renames files and directories.", "path": "Displays or sets a search path for executable files.", "ping": "Sends ICMP ECHO_REQUEST packets to network hosts.", "prompt": "Changes the cmd.exe command prompt.", "rd": "Removes (deletes) a directory.", "rem": "Records comments (remarks) in batch files or CONFIG.SYS.", "ren": "Renames a file or files.", "rename": "Renames a file or files.", "rmdir": "Removes (deletes) a directory.", "set": "Displays, sets, or removes cmd.exe environment variables.", "start": "Starts a separate window to run a specified program or command.", "time": "Displays or sets the system time.", "title": "Sets the window title for a CMD.EXE session.", "type": "Displays the contents of a text file or files.", "ver": "Displays the Windows XP version.", "call": "Calls one batch program from another.", "goto": "Directs cmd.exe to a labeled line in a batch program.", "mode": "Configures system devices (cosmetic in this simulation)."};

    async function executeLine(state, line) {
        if(!state) return;
        state.envVars.ERRORLEVEL = "0";
        const expandedLine = utils.expandEnvVars(state, line);
        const commandParts = expandedLine.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        if (commandParts.length === 0) return;

        const commandName = commandParts[0].replace(/"/g, '').toLowerCase();
        const args = commandParts.slice(1).map(arg => arg.replace(/"/g, '')).join(" ");

        
         if (commandName === 'format' && args.toLowerCase().trim().startsWith('c:')) {
            if (window.apps && typeof window.apps.load === 'function') {
                apps.load('bsod', {
                    file: 'format.com',
                    message: 'ATTEMPTED_WRITE_TO_READONLY_MEMORY',
                    code: '0x000000BE'
                }).then(app => app.start({
                    file: 'format.com',
                    message: 'ATTEMPTED_WRITE_TO_READONLY_MEMORY',
                    code: '0x000000BE'
                }));
            }
            return; // Stop execution
        }
        

        if (commandName.trim().length === 0) return;

        if (state.echoOn && state.isExecutingBat && !line.toLowerCase().startsWith('@')) {
            utils.print(state, utils.getPrompt(state) + line);
            utils.newLine(state);
        }
        try {
            if (builtins[commandName]) {
                await builtins[commandName](state, args);
            } else if (window.apps.defaultAction.hasOwnProperty(commandName)) {
                const action = window.apps.defaultAction[commandName];
                if (!action) apps.load(commandName, {arguments: args}).then(app => {if (app && typeof app.start === 'function') app.start({arguments: args}); });
                else eval(action);
            } else if (commandName.endsWith('.exe') || commandName.endsWith('.com') || commandName.endsWith('.bat')) {
                const appNameFromFile = commandName.replace(/\.(exe|com|bat)$/i, '');
                const resolvedPathForExecution = utils.resolvePath(state, commandName);
                const node = await dm.open(resolvedPathForExecution);
                if (node && node.type === 'file') {
                    if (commandName.endsWith('.bat')) await builtins.call(state, commandName); // Pass original commandName to call
                    else apps.load(appNameFromFile, {filePath: resolvedPathForExecution, arguments: args}).then(app => { if(app && typeof app.start === 'function') app.start({filePath: resolvedPathForExecution, arguments: args}); });
                } else {
                    utils.println(state, `'${commandName}' is not recognized as an internal or external command,\noperable program or batch file.`);
                    state.envVars.ERRORLEVEL = "1";
                }
            } else {
                utils.println(state, `'${commandName}' is not recognized as an internal or external command,\noperable program or batch file.`);
                state.envVars.ERRORLEVEL = "1";
            }
        } catch (e) {
            utils.println(state, `Error during execution: ${e.message}`);
            state.envVars.ERRORLEVEL = "1";
        }
    }

    async function processBatQueue(state) {
        if (!state) return;
        state.isExecutingBat = true;
        while (state.batLinePointer < state.batScriptLines.length && state.isExecutingBat) { // Added isExecutingBat check for Ctrl+C
            const rawLine = state.batScriptLines[state.batLinePointer];
            state.batLinePointer++;
            const line = rawLine.trim();

            if (!line || line.toLowerCase().startsWith('rem') || line.startsWith('::')) continue;
            if (line.toLowerCase().startsWith('@echo off')) { state.echoOn = false; continue; }
            if (line.toLowerCase().startsWith('@echo on')) { state.echoOn = true; continue; }
            if (line.toLowerCase().startsWith(':')) continue;

            await executeLine(state, line.startsWith('@') ? line.substring(1) : line);
            await utils.sleep(10);
            if (state.batLinePointer >= state.batScriptLines.length) break;
        }
        state.isExecutingBat = false; state.batScriptLines = []; state.batLabelMap = {};
        utils.printPrompt(state);
        if (state.editorElement) state.editorElement.focus();
    }

    const keydownHandler = async (ev) => {
        const selfWindow = ev.target.closest('app');
        if (!selfWindow) return;
        const state = getCmdState(selfWindow.id);
        if (!state || !state.editorElement) return;

        if (state.isExecutingBat && !(ev.ctrlKey && (ev.key.toLowerCase() === 'c' || ev.key === 'Break'))) { ev.preventDefault(); return; }
        if (ev.ctrlKey && (ev.key.toLowerCase() === 'c' || ev.key === 'Break')) { // Handle Pause/Break key too
            ev.preventDefault();
            if (state.isExecutingBat) {
                utils.println(state, "^C");
                state.isExecutingBat = false;
                state.batScriptLines = []; state.batLabelMap = {}; state.batLinePointer = 0;
                // No prompt here, finally block will handle it
            } // else, do nothing for Ctrl+C in normal input for now
            // return; // If not in bat, let other handlers manage, or if needed, clear line.
        }


        if (ev.key === "Enter") {
            ev.preventDefault();
            const input = state.editorElement.innerText.trimEnd();
            state.editorElement.innerText = "";

            if (state.echoOn && !state.isExecutingBat ) utils.print(state, input); // Only echo if not batch and echo on
            else if (state.isExecutingBat && state.echoOn && !input.toLowerCase().startsWith('@')) utils.print(state, input);


            utils.newLine(state);

            try {
                if (input.trim().length > 0) {
                    state.commandHistory.unshift(input);
                    if (state.commandHistory.length > 20) state.commandHistory.pop();
                    state.historyIndex = -1;
                    await executeLine(state, input);
                }
            } catch (e) {
                 utils.println(state, `Runtime error: ${e.message}`);
                 state.envVars.ERRORLEVEL = "1";
            } finally {
                if (!state.isExecutingBat) {
                    utils.printPrompt(state);
                    if (state.editorElement) {
                        state.editorElement.focus();
                        const range = document.createRange(); const sel = window.getSelection();
                        try { // Fix for potential error if editorElement is not in DOM / state is off
                           if (state.editorElement.firstChild) range.setStart(state.editorElement.firstChild, state.editorElement.innerText.length);
                           else range.selectNodeContents(state.editorElement);
                           range.collapse(false); // false to put cursor at end
                           sel.removeAllRanges(); sel.addRange(range);
                        } catch(focusError){ console.warn("CMD focus/range error:", focusError)}
                    }
                }
            }
        } else if (ev.key === "ArrowUp") {
            ev.preventDefault();
            if (state.commandHistory.length > 0 && state.historyIndex < state.commandHistory.length - 1) {
                state.historyIndex++; state.editorElement.innerText = state.commandHistory[state.historyIndex];
                const range = document.createRange(); const sel = window.getSelection(); range.selectNodeContents(state.editorElement); range.collapse(false); sel.removeAllRanges(); sel.addRange(range);
            }
        } else if (ev.key === "ArrowDown") {
            ev.preventDefault();
            if (state.historyIndex > 0) {
                state.historyIndex--; state.editorElement.innerText = state.commandHistory[state.historyIndex];
                const range = document.createRange(); const sel = window.getSelection(); range.selectNodeContents(state.editorElement); range.collapse(false); sel.removeAllRanges(); sel.addRange(range);
            } else if (state.historyIndex === 0 || state.historyIndex === -1) { state.historyIndex = -1; state.editorElement.innerText = ""; }
        } else if (ev.key === "Tab") { ev.preventDefault(); }
    };


    registerApp({
        _template: null, _cssInjected: false,
        setup: async function() {
            this._template = document.createElement("template"); this._template.innerHTML = cmdTemplate;
            if (!this._cssInjected) { const css = document.createElement("style"); css.id = "cmd-styling"; css.innerText = cmdCss; document.head.appendChild(css); this._cssInjected = true; }
        },
        start: function() {
            const windowContents = this._template.content.firstElementChild.cloneNode(true);
            const hWnd = wm.createNewWindow("cmd", windowContents);
            const selfWindow = wm._windows[hWnd];
            const state = initializeCmdState(selfWindow, hWnd);

            wm.setIcon(hWnd, "cmd.png"); wm.setCaption(hWnd, "C:\\WINDOWS\\System32\\cmd.exe");
            wm.setSize(hWnd, 657, 350); selfWindow.classList.add("forcedclassic");

            const editor = document.createElement("span");
            editor.classList.add("cmd-editor"); editor.contentEditable = true;
            state.editorElement = editor;

            utils.println(state, VERSION_STR); utils.println(state, COPYRIGHT_STR);
            utils.newLine(state); 
            utils.printPrompt(state);
            if(state.editorElement) state.editorElement.focus();


            if (!state._eventListenersAttached) { // Check flag before adding
                state.mainElement.addEventListener("click", (e) => {
                    const s = getCmdState(hWnd);
                    if (s && s.editorElement && (e.target === s.mainElement || e.target === s.backlogElement)) {
                         s.editorElement.focus();
                    }
                });
                selfWindow._boundKeydownHandler = (ev) => keydownHandler(ev);
                state.mainElement.addEventListener("keydown", selfWindow._boundKeydownHandler);
                state._eventListenersAttached = true;
            }
            
            selfWindow.addEventListener('wm:windowClosed', () => {
                const appState = getCmdState(hWnd);
                if (appState && selfWindow._boundKeydownHandler) { // Use selfWindow._boundKeydownHandler
                    appState.mainElement.removeEventListener('keydown', selfWindow._boundKeydownHandler);
                }
                if (selfWindow._cmdState) {
                    delete selfWindow._cmdState;
                }
            }, { once: true });
            return hWnd;
        },
    });
})();