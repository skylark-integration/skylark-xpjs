(function() {
    const windowTemplate = `
        <appcontentholder>
            <div id="contain" style="display:grid; grid-template-columns:32px auto; gap:8px;">
                <img class="dialogicon" src="res/icons/info.png">
                <span>
                    This feature’s still in the works.<br>
                    Join our Retro Roll Discord to hang with our hobby crew and stay<br>
                    in the loop on Reborn XP and other Quenq goodies!<br><br>
                    <b>We wanna hear your thoughts!</b><br>
                    <ul style="margin: 8px 0 0 20px; padding: 0;">
                        <li>Got an idea for an app/feature?</li>
                        <li>Found a bug?</li>
                        <li>Wanna toss in some feedback?</li>
                    </ul>
                    Come chill with us on Discord!<br>
                </span><br>
            </div>
            <br>
            <center>
                <winbutton class="default"><btnopt>OK</btnopt></winbutton>
                <winbutton class="default"><btnopt>Join Discord</btnopt></winbutton>
            </center>
        </appcontentholder>
    `;

    registerApp({
        _template: null,

        setup: async function() {
            this._template = document.createElement("template");
            this._template.innerHTML = windowTemplate;
        },

        start: function() {
            var windowContents = this._template.content.firstElementChild.cloneNode(true);
            var hWnd = wm.createNewWindow("template", windowContents);
            var selfWindow = wm._windows[hWnd];

            wm.removeIcon(hWnd);
            wm.setCaption(hWnd, "Under Development!");
            wm.setDialog(hWnd);
            window.playSystemSound("alert");

            let viewport = document.querySelector("scene_desktop").getBoundingClientRect();
            let viewportWidth = viewport.width - 50;
            let viewportHeight = viewport.height - 100;
            selfWindow.style.height = "";

            let okButton = selfWindow.querySelector("winbutton:first-child");
            okButton.addEventListener("click", e => {
                window.wm.closeWindow(hWnd);
            });

            let discordButton = selfWindow.querySelector("winbutton:nth-child(2)");
            discordButton.addEventListener("click", e => {
                window.open("https://discord.gg/9dFx9kKQS6", "_blank");
            });

            return hWnd;
        },
    })
})();