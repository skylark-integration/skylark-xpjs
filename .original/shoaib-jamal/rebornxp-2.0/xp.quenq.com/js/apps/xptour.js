(function() {
    const windowTemplate = `
        <appcontentholder class="xptour-dialog" style="font-size: 13px; display: flex; flex-direction: column; background-color: #ECE9D8; height: 100%;">
            
            <!-- Main content area for the two panes -->
            <div class="xptour-content-area" style="display: flex; flex-grow: 1; overflow: hidden;">
                <!-- Left Pane with correct image -->
                <div class="xptour-left-pane" style="width: 164px; flex-shrink: 0; background-color: #4A608A;">
                    <img src="res/ui/side.png" alt="Windows XP Logo" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                
                <div class="xptour-right-pane" style="padding: 20px 25px; flex-grow: 1; background-color: #fff;">
                    <h1 style="font-family: 'Tahoma', sans-serif; font-size: 18px; font-weight: normal; margin: 0 0 15px 0;">Welcome to the Windows XP Tour!</h1>
                    <p style="margin-bottom: 20px;">The tour is available in two formats. Which format do you prefer?</p>
                    
                    <form id="tour-format-form" style="flex-grow: 1;">
                        <li style="margin-bottom: 10px; list-style:none;">
                            <label for="tour-animated" style="display: flex; align-items: start; cursor: pointer;">
                                <input type="radio" name="tourFormat" id="tour-animated" value="animated" checked>
                                <winradio></winradio>
                                <span style="margin-left: 8px;">Play the animated tour that features text, animation, music, and voice narration.</span>
                            </label>
                        </li>
                        <li style="list-style:none;">
                            <label for="tour-html" style="display: flex; align-items: start; cursor: pointer;">
                                <input type="radio" name="tourFormat" id="tour-html" value="html">
                                <winradio></winradio>
                                <span style="margin-left: 8px;">Play the non-animated tour that features text and images only.</span>
                            </label>
                        </li>
                    </form>
                </div>
            </div>

            <div class="xptour-footer" style="padding: 10px; border-top: 1px solid #fff; text-align: right; flex-shrink: 0;">
                <winbutton id="tour-back-btn" class="disabled" style="min-width: 75px; margin-right: 5px;"><btnopt>< Back</btnopt></winbutton>
                <winbutton id="tour-next-btn" class="default" style="min-width: 75px; margin-right: 5px;"><btnopt>Next ></btnopt></winbutton>
                <winbutton id="tour-cancel-btn" style="min-width: 75px;"><btnopt>Cancel</btnopt></winbutton>
            </div>
        </appcontentholder>
    `;

    const animatedTourWindowTemplate = `
        <appcontentholder class="xptour-animated-player">
            <iframe src="res/sites/mmTour/index.html" style="width: 100%; height: 100%; border: none;"></iframe>
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
            var hWnd = wm.createNewWindow("xptour-chooser", windowContents);
            var selfWindow = wm._windows[hWnd];

            wm.setIcon(hWnd, "xptour.png");
            wm.setCaption(hWnd, "Windows XP Tour");
            wm.setSize(hWnd, 500, 350);

            // Add click handlers to the labels for better usability
            selfWindow.querySelectorAll('form label').forEach(label => {
                label.addEventListener('click', (e) => {
                    const radio = document.getElementById(label.getAttribute('for'));
                    if (radio) radio.checked = true;
                });
            });

            const nextButton = selfWindow.querySelector('#tour-next-btn');
            const cancelButton = selfWindow.querySelector('#tour-cancel-btn');

            nextButton.onclick = () => {
                const selectedFormat = selfWindow.querySelector('input[name="tourFormat"]:checked').value;
                wm.closeWindow(hWnd);

                if (selectedFormat === 'animated') {
                    const tourPlayerContent = document.createElement('div');
                    tourPlayerContent.innerHTML = animatedTourWindowTemplate;
                    const tourHWnd = wm.createNewWindow("xptour-animated", tourPlayerContent.firstElementChild);
                    const tourWindowElement = wm._windows[tourHWnd];

                    wm.setIcon(tourHWnd, "xptour.png");
                    wm.setCaption(tourHWnd, "Windows XP Tour - Animated");
                    wm.setSize(tourHWnd, "fullscreen");
                    
                    if (tourWindowElement) {
                        tourWindowElement.classList.add("xptour-animated-fullscreen");
                    }

                    const messageHandler = (event) => {
                        if (event.source !== tourWindowElement.querySelector('iframe')?.contentWindow) {
                            return;
                        }
                        
                        if (event.data && event.data.action === 'xptour_finished') {
                            wm.closeWindow(tourHWnd);
                            window.removeEventListener('message', messageHandler);
                        }
                    };
                    
                    window.addEventListener('message', messageHandler);

                    tourWindowElement.addEventListener('wm:windowClosed', () => {
                        window.removeEventListener('message', messageHandler);
                    }, { once: true });

                } else if (selectedFormat === 'html') {
                    apps.load('iexplore').then(app => {
                        if (app && app.start) {
                            app.start({ contents: 'C:/WINDOWS/Help/Tours/htmlTour/default.htm' });
                        }
                    });
                }
            };

            cancelButton.onclick = () => {
                wm.closeWindow(hWnd);
            };

            return hWnd;
        }
    });
})();