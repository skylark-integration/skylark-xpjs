(function() {
    window.dialogHandler = {
        windowTemplate: `
            <appcontentholder class="dialogsrv-32">
                <img class="dialogicon" src="res/icons/info.png">
                <span class="dialogtext">Default Message Text</span>
                <div class="dialogbuttons"></div>
            </appcontentholder>
        `,
        buttonTemplate: `
            <btnopt>Text</btnopt>
        `,
        windowTitle: "Default Title",
        windowSize: [300, 100],

        spawnDialog: function(dataTable) {
            this.dialogOrigin = document.createElement("template");
            this.dialogOrigin.innerHTML = dialogHandler.windowTemplate;
            this.dialogOrigin = this.dialogOrigin.content.firstElementChild.cloneNode(true);

            this.dialogOrigin.querySelector(".dialogicon").src = `res/icons/${dataTable.icon}.png`;
            this.dialogOrigin.querySelector(".dialogtext").innerHTML = dataTable.text;
            let buttonContent = this.dialogOrigin.querySelector(".dialogbuttons");
            windowTitle = dataTable.title;
            windowSize = dataTable.windowSize || this.windowSize;

            let firstButtonElement = null;

            if (dataTable.buttons && dataTable.buttons.length > 0) {
                for (const [label, fn, state] of dataTable.buttons) {
                    let button = document.createElement("winbutton");
                    button.innerHTML = dialogHandler.buttonTemplate;
                    button.querySelector("btnopt").innerHTML = label;
                    button.addEventListener("click", fn);
                    buttonContent.appendChild(button);
                    if (state) {
                        button.classList.add(state);
                    }
                    if (!firstButtonElement) {
                        firstButtonElement = button;
                    }
                }
            }

            if (firstButtonElement) {
                firstButtonElement.classList.add("default");
            }

            dialogHandler.playSound(dataTable.icon);
            let hWnd = dialogHandler.createWindow();
            return hWnd;
        },

        playSound: function(type) {
            let dialogSound = null;
            switch (type) {
                case "error":
                    dialogSound = "error";
                    break;
                case "info":
                    dialogSound = "alert";
                    break;
                case "question":
                    dialogSound = "exclamation";
                    break;
                case "warning":
                    dialogSound = "exclamation";
                    break;
            }

            if (dialogSound) {
                shell.playSystemSound(dialogSound);
            } else if (typeof dataTable !== 'undefined' && dataTable.sound) {
                shell.playSystemSound(dataTable.sound);
            }
        },

        createWindow: function() {
            let hWnd = wm.createNewWindow("dialog", this.dialogOrigin);
            let selfWindow = wm._windows[hWnd];

            selfWindow.classList.add("dialog");
            wm.setCaption(hWnd, windowTitle);
            wm.removeIcon(hWnd);
            wm.setSize(hWnd, windowSize[0], windowSize[1]);
            wm.setDialog(hWnd);

            if (windowSize[0] == "auto" || windowSize[1] == "auto") {
                let appContentsElement = document.querySelector(`#${hWnd} appcontents`);
                if (appContentsElement) {
                    let dims = appContentsElement.getBoundingClientRect();
                    appContentsElement.style.width = dims.width + "px";
                    appContentsElement.style.height = dims.height + "px";
                }
            }
            return hWnd;
        },

        positionWindow: function(selfWindow, e) {
            let mouseX = e.clientX;
            let mouseY = e.clientY;

            let windowX = selfWindow.offsetWidth;
            let windowY = selfWindow.offsetHeight;

            selfWindow.style.top = (mouseY - (windowY / 2)) + "px";
            selfWindow.style.left = (mouseX - (windowX / 2)) + "px";
        }
    }
})();