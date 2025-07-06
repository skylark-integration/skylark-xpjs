(function() {
    registerApp({
        _webamp: null,
        _hWnd: null,

        setup: async function() {
            let promise = new Promise(resolve => {
                var app = document.createElement('script');
                app.setAttribute('src', 'https://unpkg.com/webamp');
                app.onload = function() {
                    resolve();
                }
                document.head.appendChild(app);
            })
            await promise;
        },

        start: function(options = {}) {
            if (this._webamp) {
                this._webamp.reopen();
                wm._taskButtons[this._hWnd].style.display = "";
                wm.focusWindow(this._hWnd);
                if (options.skinId) {
                    this.loadSkinById(options.skinId);
                }
                if (options.vfsTracks) {
                    this.addVfsTracks(options.vfsTracks);
                }
                return this._webamp;
            }

            var foo = document.createElement('div');
            var hWnd = wm.createNewWindow("webamp", foo);
            this._hWnd = hWnd;
            wm.setIcon(hWnd, "winamp.png");
            wm.setCaption(hWnd, "Winamp");

            const wmWindow = document.getElementById(hWnd);
            wmWindow.style.display = "none";
            this._webamp = new Webamp({
                zIndex: 9001,
            });
            this._webamp.onClose(() => {
                wm._taskButtons[this._hWnd].style.display = "none";
            });
            this._webamp.onMinimize(() => {
                wm._taskButtons[this._hWnd].classList.add("minimized");
            });

            function waitForElm(selector) {
                return new Promise(resolve => {
                    if (document.querySelector(selector)) {
                        return resolve(document.querySelector(selector));
                    }
                    const observer = new MutationObserver(mutations => {
                        if (document.querySelector(selector)) {
                            observer.disconnect();
                            resolve(document.querySelector(selector));
                        }
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                });
            }

            this._webamp.renderWhenReady(foo).then(async () => {
                let realWebamp = await waitForElm('#webamp');
                if (wm._windowspace) {
                    wm._windowspace.appendChild(realWebamp);
                }
                realWebamp.style.zIndex = wmWindow.style.zIndex;
                realWebamp.style.pointerEvents = "all";
                realWebamp.dataset.windowId = hWnd;
                wm._windows[hWnd] = realWebamp;
                wmWindow.remove();
                realWebamp.addEventListener('mousedown', (ev) => {
                    wm.focusWindow(hWnd);
                });

                if (options.skinId) {
                    this.loadSkinById(options.skinId);
                }
                if (options.vfsTracks) {
                    this.addVfsTracks(options.vfsTracks);
                }
            });
            return this._webamp;
        },

        loadSkinById: function(skinId) {
            if (!this._webamp) {
                this.start({ skinId: skinId });
                return;
            }
            const url = `https://cdn.webampskins.org/skins/${skinId}.wsz`;
            this._webamp.setSkinFromUrl(url);
        },

        addVfsTracks: async function(tracks) {
            if (!this._webamp) {
                this.start({ vfsTracks: tracks });
                return;
            }

            const webampTracks = tracks.map(track => ({
                blob: track.blob,
                defaultName: track.defaultName
            }));

            if (webampTracks.length > 0) {
                await this._webamp.appendTracks(webampTracks);
                if (this._webamp.store.getState().media.status !== 'PLAYING') {
                    this._webamp.play();
                }
            }
        }
    })
})();