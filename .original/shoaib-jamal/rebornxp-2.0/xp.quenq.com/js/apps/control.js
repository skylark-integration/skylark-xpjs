// App: cplui.exe

(function() {
    
    const windowTemplate = window.explorer.windowContent;
    const itemTemplate = window.explorer.iconContent;
    const sidebarTemplate = `
        <div class="sidebargroup">
            <div class="groupheader">
                <span>Control Panel</span>
                <div class="collapser"><span>>></span></div>
            </div>
            <ul>
                <li id="classicview"><img src="res/icons/tray/control.png">Switch to Classic View</li>
                <li id="catview"><img src="res/icons/tray/control.png">Switch to Category View</li>
            </ul>
        </div>
        <div class="sidebargroup">
            <div class="groupheader">
                <span>See Also</span>
                <div class="collapser"><span>>></span></div>
            </div>
            <ul>
                <li id="winupdate"><img src="res/icons/tray/winupdate.png">Windows Update</li>
                <li id="help"><img src="res/icons/tray/help.png">Help and About</li>
                <li id="othercpl"><img src="res/icons/tray/othersettings.png">Other Control Panel Options</li>
            </ul>
        </div>
    `;
    const cplItems = [
        // format: app name, icon name, display name
      
        ["desk", "displayprops", "Display"],
        ["folderopt", "folderprops", "Folder Options"],
        ["fonts", "fonts", "Fonts", "explorer.open('C:/WINDOWS/Fonts')"],
        ["tasks", "tasks", "Scheduled Tasks", "explorer.open('C:/WINDOWS/Tasks')"],
        ["appwiz", "install", "Add or Remove Programs"],
        ["sndvol32", "sound", "Sounds and Audio Devices"],
        ["startprops", "startmenu", "Taskbar and Start Menu"],
        ["systemprops", "systemprops", "System"],
        ["timedate", "timedate", "Date and Time"],
        ["userprops", "users", "User Accounts"]
    ];

    registerApp({
        _template: null,
        _itemTemplate: null,

        /// set up app
        setup: async function() {
            console.log("cplui: init");
            // set up the window template
            this._template = document.createElement("template");
             this._itemTemplate = document.createElement("template");
            this._template.innerHTML = windowTemplate;
            this._itemTemplate.innerHTML = itemTemplate;
            console.log("cplui: init done");
        },

        /// open up app
        /// @return window handle
        start: function() {
            console.log("cplui: starting up");
            // clone the template; the firstElementChild is required to get the actual <appcontentholder> as it's surrounded by text fragments
            var hWnd = wm.createNewWindow("cplui", this._template.content.firstElementChild.cloneNode(true));

            // get a reference to our own window
            var selfWindow = wm._windows[hWnd];

            // update title bar
            wm.setIcon(hWnd, "control.png");
            wm.setCaption(hWnd, "Control Panel");
            wm.setSize(hWnd, 640, 480);

            //revise sidebar content from template
            let sidebar = selfWindow.querySelector("sidebarcontents");
            sidebar.innerHTML = sidebarTemplate;

            //set window address
            let addressBar = selfWindow.querySelector("combobox");
            addressBar.innerHTML = `<img src="res/icons/tray/control.png">Control Panel`

            //populate control panel list items
            let contentFrame = selfWindow.querySelector("fscontents").querySelector("items");
            let itemData;

            cplItems.forEach(item => {
                itemData = document.createElement("fsicon");
                itemData.innerHTML = this._itemTemplate.innerHTML;

                itemData.querySelector("icon").innerHTML = `<img src="res/icons/${item[1]}.png">`
                itemData.querySelector("icontitle").innerHTML = item[2];
                contentFrame.appendChild(itemData);
                if (item[3]) {
                    itemData.addEventListener("dblclick", e => {
                        eval(item[3]);
                    });
                } else
                itemData.addEventListener("dblclick", e => {
                    apps.load(item[0]).then((app) => {app.start();});
                });
            });

            return hWnd;
        },
    })
})();


