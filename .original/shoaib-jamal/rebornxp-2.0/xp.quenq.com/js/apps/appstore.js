(function() {
    const appstoreAppTemplate = `
        <appcontentholder class="appstore-app" style="display: flex; flex-direction: column; height: 100%; overflow: hidden; background-color: #fff;">
            <iframe src="res/sites/appstore/index.html" style="width: 100%; flex-grow: 1; border: none;" name="appStoreFrame" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"></iframe>
        </appcontentholder>
    `;

    registerApp({
        _template: null,
        _hWnd: null,
        _iframe: null,

        setup: async function() {
            this._template = document.createElement("template");
            this._template.innerHTML = appstoreAppTemplate;
            
        },

        start: function() {
            var windowContents = this._template.content.firstElementChild.cloneNode(true);
           
            if (this._hWnd && wm._windows[this._hWnd]) { 
                wm.focusWindow(this._hWnd);
                if (this._iframe && this._iframe.contentWindow) {
                     this._iframe.contentWindow.postMessage({ action: 'appstore_iframe_ready_flatfile' }, '*');
                }
                return this._hWnd;
            }

            this._hWnd = wm.createNewWindow("appstore", windowContents);
            const selfWindow = wm._windows[this._hWnd];
            this._iframe = selfWindow.querySelector('iframe[name="appStoreFrame"]');

            wm.setIcon(this._hWnd, "appstore.png");
            wm.setCaption(this._hWnd, "Quenq App Market");
            wm.setSize(this._hWnd, 850, 700);
            selfWindow.dataset.appName = "appstore";


            selfWindow.addEventListener('wm:windowClosed', () => {
              
                this._iframe = null;

                if (apps._loadedApps["appstore"] === this) { // If this is the registered instance
                    apps._loadedApps["appstore"]._hWnd = null; // Mark its window as closed
                }
            }, { once: true });

            return this._hWnd;
        }
    });
})();