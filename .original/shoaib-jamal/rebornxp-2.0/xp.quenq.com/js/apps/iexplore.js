// js/apps/iexplore.js
(function() {
    var iexploreTemplate = `
        <appcontentholder class="iexplore">
            <appnavigation class="rich">
                <ul class="appmenus">
                    <li>File</li><li>Edit</li><li>View</li><li>Favorites</li><li>Tools</li><li>Help</li>
                </ul>
                <navflag></navflag>
                <ul class="navbuttons">
                    <li name="go-previous" class="inactive"><img src="res/ui/nav/back.png">Back <pointer>▼</pointer></li>
                    <li name="go-next" class="inactive"><img src="res/ui/nav/forward.png"> <pointer>▼</pointer></li>
                    <li name="stopload"><img src="res/ui/nav/stop.png"></li>
                    <li name="reload"><img src="res/ui/nav/refresh.png"></li>
                    <li name="home"><img src="res/ui/nav/home.png"></li>
                    <li class="divider"></li>
                    <li><img src="res/ui/nav/search.png">Search</li>
                    <li><img src="res/ui/nav/favorites.png">Favorites</li>
                    <li name="history"><img src="res/ui/nav/up.png"></li>
                </ul>
                <ul class="addressbar">
                    <li>Address</li>
                    <li><img src="res/icons/tray/webpage.png"><input type="text" id="addressBar" name="addressBar" placeholder="about:home" style="width: calc(100% - 99px);"></li>
                    <li name="go-button" style="cursor: pointer;"><img src="res/ui/nav/go.png"></li>
                </ul>
            </appnavigation>
            <iframecontents>
                <iframe is="x-frame-bypass" name="webview" id="iexploreframe"></iframe>
            </iframecontents>
        </appcontentholder>
    `;

    const X_FRAME_INFO_DIALOG_ID = "iexplore-xframe-info-dialog";
    const X_FRAME_INFO_STORAGE_KEY = "iexploreXFrameInfoDismissed";
    
    function getBrowserExtensionInfo() {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes("firefox")) { return { name: "Ignore X-Frame Options Header (Firefox)", url: "https://addons.mozilla.org/en-US/firefox/addon/ignore-x-frame-options-header/" }; }
        else if (ua.includes("edg/") || ua.includes("chrome") || ua.includes("opr/") || ua.includes("brave")) { return { name: "Ignore X-Frame Headers (Chromium-based)", url: "https://chromewebstore.google.com/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe" }; }
        return null;
    }

    function showXFrameInfoDialog(parentHWnd = null) {
        const isAndroid = /android/i.test(navigator.userAgent);
        if (isAndroid || localStorage.getItem(X_FRAME_INFO_STORAGE_KEY) === "true") { return null; }
        const extensionInfo = getBrowserExtensionInfo();
        if (!extensionInfo) { return null; }
        if (wm._windows[X_FRAME_INFO_DIALOG_ID] && wm._windows[X_FRAME_INFO_DIALOG_ID].id === X_FRAME_INFO_DIALOG_ID) { wm.focusWindow(X_FRAME_INFO_DIALOG_ID); return X_FRAME_INFO_DIALOG_ID; }
        const infoDialogHTML = `
            <appcontentholder>
                <style>
                    .xframe-info-dialog-content { display: flex; flex-direction: column; padding: 15px; font-size: 13px; line-height: 1.6; } .xframe-info-dialog-content h3 { margin-top: 0; margin-bottom: 10px; color: #003399; } .xframe-info-dialog-content p { margin-bottom: 10px; } .xframe-info-dialog-content a { color: #003399; text-decoration: underline; word-break: break-all; } .xframe-info-dialog-content .checkbox-area { margin-top: 15px; margin-bottom: 15px; display: flex; align-items: center;} .xframe-info-dialog-content .checkbox-area input[type="checkbox"] { margin-right: 8px; vertical-align: middle; } .xframe-info-dialog-buttons { text-align: right; padding-top: 10px; border-top: 1px solid #ACA899; margin: 15px -15px -15px -15px; padding: 10px 15px; flex-shrink: 0;}
                </style>
                <div class="xframe-info-dialog-content"><h3><img src="res/icons/info.png" alt="info" style="width:20px; height:20px; vertical-align:middle; margin-right:5px;"> Enhanced Browsing Experience</h3><p>For the best compatibility with all websites, especially those that might restrict embedding, we recommend installing the <strong>"${extensionInfo.name}"</strong> browser extension.</p><p>This extension allows Internet Explorer to display more content correctly.</p><p>You can find it here: <a href="${extensionInfo.url}" target="_blank" onclick="event.stopPropagation();">${extensionInfo.url}</a></p><div class="checkbox-area"><input type="checkbox" id="dontShowAgainXFrameInfo"><label for="dontShowAgainXFrameInfo">Don't show this message again</label></div></div><div class="xframe-info-dialog-buttons"><winbutton class="default" id="xFrameInfoOkBtn"><btnopt>OK</btnopt></winbutton></div>
            </appcontentholder>`;
        const dialogContentElement = document.createElement('appcontentholder'); dialogContentElement.innerHTML = infoDialogHTML;
        const dialogHWnd = wm.createNewWindow(X_FRAME_INFO_DIALOG_ID, dialogContentElement, { dialog: true, resizable: false, parent: parentHWnd });
        wm.setIcon(dialogHWnd, "info.png"); wm.setCaption(dialogHWnd, "Internet Explorer - Tip"); wm.setSize(dialogHWnd, 450, 'auto'); wm.setDialog(dialogHWnd);
        if (window.shell && typeof window.shell.playSystemSound === 'function') window.shell.playSystemSound("alert");
        dialogContentElement.querySelector('#xFrameInfoOkBtn').addEventListener('click', () => { if (dialogContentElement.querySelector('#dontShowAgainXFrameInfo').checked) { localStorage.setItem(X_FRAME_INFO_STORAGE_KEY, "true"); } if (wm._windows[dialogHWnd]) wm.closeWindow(dialogHWnd); });
        dialogContentElement.querySelector('a').addEventListener('click', (e) => { e.stopPropagation(); });
        return dialogHWnd;
    }

    function isVFSPath(text) { return typeof text === 'string' && /^[A-Za-z]:\//i.test(text); }
    function isAbsoluteUrl(url) { if (typeof url !== 'string') return false; if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) return true; if (url.startsWith('//')) return true; return false; }

    registerApp({
        _template: null, _homepageActual: "res/sites/iexplore/index.html", _homepageDisplay: "about:home", _searchUrlTemplate: "https://oldgoogle.neocities.org/2010/search/?q={query}&page=1", _xFrameDialogShownThisSession: false,
        async setup() { this._template = document.createElement("template"); this._template.innerHTML = iexploreTemplate; },
        async start({filePath = null, contents = null}) {
            var windowContents = this._template.content.firstElementChild.cloneNode(true);
            var hWnd = wm.createNewWindow("iexplore", windowContents);
            var selfWindow = wm._windows[hWnd];

            if (!this._xFrameDialogShownThisSession && !/android/i.test(navigator.userAgent)) { showXFrameInfoDialog(hWnd); this._xFrameDialogShownThisSession = true; }

            var webField = selfWindow.querySelector('#iexploreframe');
            var addressInput = selfWindow.querySelector('#addressBar');
            var goButton = selfWindow.querySelector('[name="go-button"]');
            var backBtn = selfWindow.querySelector('[name="go-previous"]');
            var fwBtn = selfWindow.querySelector('[name="go-next"]');
            var homeBtn = selfWindow.querySelector('[name="home"]');
            var reloadBtn = selfWindow.querySelector('[name="reload"]');
            var stopBtn = selfWindow.querySelector('[name="stopload"]');

            wm.setIcon(hWnd, "iexplore.png"); wm.setCaption(hWnd, "Internet Explorer"); wm.setSize(hWnd, "800", "600"); wm.setIFrameApp(hWnd);

            const homepageActualUrl = this._homepageActual; const homepageDisplayUrl = this._homepageDisplay; const searchUrlTemplate = this._searchUrlTemplate;
            let currentMainObjectURL = null; let currentPageAssetObjectUrls = [];
            let currentHistory = []; let historyIndex = -1;
            let currentTopLevelVFSBasePath = null; 

            let navigateTo; let loadUrlInFrame; let _processHtmlAssetsRecursive; let setupLinkInterceptorForDocument; let loadUrlInSpecificFrame;

            function revokePageResources() {
                if (currentMainObjectURL) { try { URL.revokeObjectURL(currentMainObjectURL); } catch(e) {} currentMainObjectURL = null; }
                currentPageAssetObjectUrls.forEach(url => { try { URL.revokeObjectURL(url); } catch(e) {} }); currentPageAssetObjectUrls = [];
            }
            function isLikelyNonSearchUrl(text) { const urlPattern = /^(https?:\/\/|res\/|about:)/i; return urlPattern.test(text) || isVFSPath(text) || (text.includes('.') && !text.includes(' ')); }
            function updateNavButtons() { backBtn.classList.toggle("inactive", historyIndex <= 0); fwBtn.classList.toggle("inactive", historyIndex >= currentHistory.length - 1); }

            _processHtmlAssetsRecursive = async (docToProcess, htmlFileVFSBasePath) => {
                const assetPromises = [];
                const elementSelectors = [
                    { selector: 'img[src]', attribute: 'src', isFrame: false }, { selector: 'link[rel="stylesheet"][href]', attribute: 'href', isFrame: false },
                    { selector: 'script[src]', attribute: 'src', isFrame: false }, { selector: 'source[src]', attribute: 'src', isFrame: false },
                    { selector: 'audio[src]', attribute: 'src', isFrame: false }, { selector: 'video[src]', attribute: 'src', isFrame: false },
                    { selector: 'embed[src]', attribute: 'src', isFrame: false }, { selector: 'object[data]', attribute: 'data', isFrame: false },
                    { selector: 'frame[src]', attribute: 'src', isFrame: true }, { selector: 'iframe[src]', attribute: 'src', isFrame: true },
                ];
                for (const { selector, attribute, isFrame } of elementSelectors) {
                    docToProcess.querySelectorAll(selector).forEach(el => {
                        const originalAttrVal = el.getAttribute(attribute);
                        if (originalAttrVal && !isAbsoluteUrl(originalAttrVal) && !originalAttrVal.startsWith('#') && !originalAttrVal.startsWith('javascript:')) {
                            assetPromises.push(async () => {
                                try {
                                    const assetVfsPath = dm.join(htmlFileVFSBasePath, originalAttrVal);
                                    const assetNode = await dm.open(assetVfsPath);
                                    if (assetNode && assetNode.type === 'file' && assetNode.content instanceof Blob) {
                                        if (isFrame && (assetVfsPath.toLowerCase().endsWith('.htm') || assetVfsPath.toLowerCase().endsWith('.html') || assetNode.content.type.includes('html'))) {
                                            let frameHtmlText = await assetNode.content.text();
                                            const frameParser = new DOMParser(); const frameDoc = frameParser.parseFromString(frameHtmlText, 'text/html');
                                            const nestedFrameVFSBasePath = dm.dirname(assetVfsPath);
                                            await _processHtmlAssetsRecursive(frameDoc, nestedFrameVFSBasePath);
                                            const processedFrameHtml = frameDoc.documentElement.outerHTML;
                                            const onProcessedSubFrameLoad = function() { try { const subFrameDoc = this.contentDocument || this.contentWindow.document; if (subFrameDoc) setupLinkInterceptorForDocument(subFrameDoc, nestedFrameVFSBasePath); } catch (e) {} };
                                            el.removeEventListener('load', onProcessedSubFrameLoad);
                                            el.addEventListener('load', onProcessedSubFrameLoad, { once: true });
                                            if (el.tagName.toLowerCase() === 'iframe') { el.setAttribute('srcdoc', processedFrameHtml); if (el.hasAttribute(attribute)) el.removeAttribute(attribute); }
                                            else if (el.tagName.toLowerCase() === 'frame') { const processedFrameBlob = new Blob([processedFrameHtml], { type: 'text/html' }); const assetObjectUrl = URL.createObjectURL(processedFrameBlob); currentPageAssetObjectUrls.push(assetObjectUrl); el.setAttribute(attribute, assetObjectUrl); }
                                        } else { const assetObjectUrl = URL.createObjectURL(assetNode.content); currentPageAssetObjectUrls.push(assetObjectUrl); el.setAttribute(attribute, assetObjectUrl); }
                                    } else { if (isFrame) el.setAttribute(attribute, 'about:blank'); }
                                } catch (e) { if (isFrame) el.setAttribute(attribute, 'about:blank'); }
                            });
                        }
                    });
                }
                await Promise.all(assetPromises.map(p => p()));
            };

            setupLinkInterceptorForDocument = function(doc, documentVFSBasePath) {
                if (!doc) return;
                const clickableElement = doc.body || doc.documentElement;
                if (!clickableElement) return;
                const existingInterceptorFlag = `iexploreLinkInterceptorAttached_${hWnd}`;
                if (clickableElement.dataset[existingInterceptorFlag] === 'true') return;
                clickableElement.dataset[existingInterceptorFlag] = 'true';
            
                clickableElement.addEventListener('click', async (e) => {
                    const linkElement = e.target.closest('a');
                    if (linkElement && linkElement.hasAttribute('href')) {
                        const href = linkElement.getAttribute('href');
                        const targetFrameName = linkElement.getAttribute('target');
            
                        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                            if (targetFrameName && targetFrameName.toLowerCase() === '_blank') {
                                e.preventDefault(); e.stopPropagation();
                                let targetUrlForNewWindow;
                                if (isAbsoluteUrl(href)) {
                                    targetUrlForNewWindow = href;
                                } else if (documentVFSBasePath && !isVFSPath(href)) { // Relative link from VFS page
                                    targetUrlForNewWindow = dm.join(documentVFSBasePath, href);
                                } else if (isVFSPath(href)) { // Full VFS path given
                                     targetUrlForNewWindow = href;
                                } else { // Relative link but no VFS base path (e.g. res/ from a res/ page)
                                    targetUrlForNewWindow = href; 
                                }
                                
                                // Access the global 'apps' object if it exists, then 'iexplore', then its 'start' method
                                if (window.apps && typeof window.apps.iexplore?.start === 'function') {
                                     window.apps.iexplore.start({ contents: targetUrlForNewWindow });
                                } else {
                                    console.warn("IExplore: Cannot open new window for _blank. 'apps.iexplore.start' is not available.", window.apps);
                                    // Fallback or error
                                    const fallbackWindow = window.open(targetUrlForNewWindow, '_blank');
                                    if (fallbackWindow) fallbackWindow.focus();

                                }
                                return;
                            }

                            if (!isAbsoluteUrl(href)) { // Handle VFS-relative links for other targets
                                if (!documentVFSBasePath && !isVFSPath(href)) return; 
                                e.preventDefault(); e.stopPropagation();
                                let targetVfsPath = isVFSPath(href) ? href : dm.join(documentVFSBasePath, href);
                                if (targetFrameName && targetFrameName.toLowerCase() !== '_self') {
                                    if (targetFrameName.toLowerCase() === '_top' || targetFrameName.toLowerCase() === '_parent') { navigateTo(targetVfsPath); }
                                    else {
                                        let owningWindow = doc.defaultView; let targetFrameElement = null;
                                        try {
                                            targetFrameElement = owningWindow.frames[targetFrameName]?.frameElement;
                                            if (!targetFrameElement) { const framesInDoc = (owningWindow.document || doc).querySelectorAll('frame, iframe'); for (let i = 0; i < framesInDoc.length; i++) { if (framesInDoc[i].name === targetFrameName) { targetFrameElement = framesInDoc[i]; break; } } }
                                        } catch (findFrameError) {}
                                        if (targetFrameElement) { loadUrlInSpecificFrame(targetFrameElement, targetVfsPath); } else { navigateTo(targetVfsPath); }
                                    }
                                } else {
                                    let currentFrameElement = null; try { currentFrameElement = doc.defaultView?.frameElement; } catch (frameError) {}
                                    if (currentFrameElement) { loadUrlInSpecificFrame(currentFrameElement, targetVfsPath); } else { navigateTo(targetVfsPath); }
                                }
                            }
                            // If it's an absolute URL and not target="_blank", let the iframe handle it naturally.
                        }
                    }
                }, true);
            };

            loadUrlInSpecificFrame = async function(targetFrameElement, urlToLoad) {
                if (!targetFrameElement) return;
                let effectiveUrl = String(urlToLoad || "").trim();
                let htmlFileVFSBasePath = null;
            
                const tempObjUrlAttr = `data-iexplore-temp-objurl-${hWnd}`;
                if (targetFrameElement.dataset[tempObjUrlAttr]) { try { URL.revokeObjectURL(targetFrameElement.dataset[tempObjUrlAttr]); } catch(e){} delete targetFrameElement.dataset[tempObjUrlAttr]; }
                
                targetFrameElement.setAttribute('src', 'about:blank');
                if (targetFrameElement.tagName.toLowerCase() === 'iframe') { targetFrameElement.removeAttribute('srcdoc'); }
            
                const onTargetFrameContentLoaded = function() {
                    try {
                        const frameDoc = targetFrameElement.contentDocument || targetFrameElement.contentWindow.document;
                        if (frameDoc && htmlFileVFSBasePath) {
                            const clickable = frameDoc.body || frameDoc.documentElement;
                            if(clickable) delete clickable.dataset[`iexploreLinkInterceptorAttached_${hWnd}`];
                            setupLinkInterceptorForDocument(frameDoc, htmlFileVFSBasePath);
                        }
                    } catch (e) {}
                    if (targetFrameElement.dataset[tempObjUrlAttr]) { try { URL.revokeObjectURL(targetFrameElement.dataset[tempObjUrlAttr]); } catch(e){} delete targetFrameElement.dataset[tempObjUrlAttr]; }
                };
                targetFrameElement.removeEventListener('load', onTargetFrameContentLoaded);
                targetFrameElement.addEventListener('load', onTargetFrameContentLoaded, { once: true });
            
                try {
                    if (isVFSPath(effectiveUrl)) {
                        const node = await dm.open(effectiveUrl);
                        if (node && node.type === 'file') {
                            htmlFileVFSBasePath = dm.dirname(effectiveUrl);
                            let fileData = node.content;
                            if (effectiveUrl.toLowerCase().endsWith('.url') && typeof fileData === 'string') { const match = fileData.match(/URL=(.*)/i); const targetUrlFromLink = (match && match[1]) ? match[1].trim() : fileData.trim(); await loadUrlInSpecificFrame(targetFrameElement, targetUrlFromLink); return; }
                            let isHtmlContent = effectiveUrl.toLowerCase().endsWith('.htm') || effectiveUrl.toLowerCase().endsWith('.html') || (fileData instanceof Blob && fileData.type.includes('html'));
                            if (isHtmlContent) {
                                let htmlText = (fileData instanceof Blob) ? await fileData.text() : String(fileData);
                                const parser = new DOMParser(); const doc = parser.parseFromString(htmlText, 'text/html');
                                await _processHtmlAssetsRecursive(doc, htmlFileVFSBasePath);
                                const finalHtml = doc.documentElement.outerHTML;
                                if (targetFrameElement.tagName.toLowerCase() === 'iframe') { targetFrameElement.setAttribute('srcdoc', finalHtml); }
                                else if (targetFrameElement.tagName.toLowerCase() === 'frame') { const processedBlob = new Blob([finalHtml], { type: 'text/html' }); const objectUrl = URL.createObjectURL(processedBlob); targetFrameElement.setAttribute('src', objectUrl); targetFrameElement.dataset[tempObjUrlAttr] = objectUrl; currentPageAssetObjectUrls.push(objectUrl); }
                            } else if (fileData instanceof Blob) { const objectUrl = URL.createObjectURL(fileData); targetFrameElement.setAttribute('src', objectUrl); targetFrameElement.dataset[tempObjUrlAttr] = objectUrl; currentPageAssetObjectUrls.push(objectUrl); }
                            else if (typeof fileData === 'string') { const textBlob = new Blob([`<pre>${document.createTextNode(fileData).textContent}</pre>`], {type: 'text/html'}); const objectUrl = URL.createObjectURL(textBlob); targetFrameElement.setAttribute('src', objectUrl); targetFrameElement.dataset[tempObjUrlAttr] = objectUrl; currentPageAssetObjectUrls.push(objectUrl); }
                            else { targetFrameElement.setAttribute('src', `data:text/html,Error: Unreadable VFS content for ${effectiveUrl}`); }
                        } else { targetFrameElement.setAttribute('src', `data:text/html,Error: VFS path not found or not a file: ${effectiveUrl}`); }
                    } else { htmlFileVFSBasePath = null; targetFrameElement.setAttribute('src', effectiveUrl); }
                } catch (e) { targetFrameElement.setAttribute('src', `data:text/html,Error loading ${effectiveUrl}: ${e.message}`); }
            };

            navigateTo = async function(urlOrSearchTerm) {
                let targetUrl = String(urlOrSearchTerm || "").trim();
                if (!targetUrl || targetUrl === homepageDisplayUrl) { targetUrl = homepageActualUrl; }
                else if (!isLikelyNonSearchUrl(targetUrl)) { const searchQuery = encodeURIComponent(targetUrl); targetUrl = searchUrlTemplate.replace('{query}', searchQuery); }
                else if (!/^(https?:\/\/|res\/|about:|[A-Za-z]:\/\/?)/i.test(targetUrl) && targetUrl.includes('.')) { targetUrl = 'http://' + targetUrl; }
                await loadUrlInFrame(targetUrl);
            };

            loadUrlInFrame = async function(urlToLoad, updateHistory = true) {
                revokePageResources(); currentTopLevelVFSBasePath = null;
                let effectiveUrl = urlToLoad; let displayUrlInAddressBar = urlToLoad;
                if (!effectiveUrl || effectiveUrl.trim() === "" || effectiveUrl === homepageDisplayUrl) { effectiveUrl = homepageActualUrl; displayUrlInAddressBar = homepageDisplayUrl; }
                else if (effectiveUrl === homepageActualUrl) { displayUrlInAddressBar = homepageDisplayUrl; }
                addressInput.value = displayUrlInAddressBar || "";
                try {
                    const tempObjUrlAttr = `data-iexplore-temp-objurl-${hWnd}`;
                    if (webField.dataset[tempObjUrlAttr]) { try { URL.revokeObjectURL(webField.dataset[tempObjUrlAttr]); } catch(e){} delete webField.dataset[tempObjUrlAttr]; }

                    webField.removeAttribute('srcdoc'); webField.setAttribute('src', 'about:blank');
                    if (isVFSPath(effectiveUrl)) {
                        const node = await dm.open(effectiveUrl);
                        if (node && node.type === 'file') {
                            currentTopLevelVFSBasePath = dm.dirname(effectiveUrl);
                            let fileData = node.content;
                            if (effectiveUrl.toLowerCase().endsWith('.url') && typeof fileData === 'string') { const match = fileData.match(/URL=(.*)/i); const targetUrlFromLink = (match && match[1]) ? match[1].trim() : fileData.trim(); effectiveUrl = targetUrlFromLink; await loadUrlInFrame(effectiveUrl, true); return; }
                            let isHtmlContent = effectiveUrl.toLowerCase().endsWith('.htm') || effectiveUrl.toLowerCase().endsWith('.html') || (fileData instanceof Blob && fileData.type.includes('html'));
                            if (isHtmlContent) {
                                let htmlText = (fileData instanceof Blob) ? await fileData.text() : String(fileData);
                                const parser = new DOMParser(); const doc = parser.parseFromString(htmlText, 'text/html');
                                await _processHtmlAssetsRecursive(doc, currentTopLevelVFSBasePath);
                                const finalHtml = doc.documentElement.outerHTML; webField.setAttribute('srcdoc', finalHtml);
                            } else if (fileData instanceof Blob) { currentMainObjectURL = URL.createObjectURL(fileData); webField.setAttribute('src', currentMainObjectURL); webField.dataset[tempObjUrlAttr] = currentMainObjectURL; }
                            else if (typeof fileData === 'string') { webField.setAttribute('srcdoc', `<pre>${document.createTextNode(fileData).textContent}</pre>`); }
                            else { webField.setAttribute('srcdoc', `Error: Cannot display VFS file type for ${effectiveUrl}`); }
                        } else if (node && node.type === 'directory') { webField.setAttribute('srcdoc', `Cannot display directory listing for: ${effectiveUrl}`); }
                        else { webField.setAttribute('srcdoc', `Error: VFS path not found or invalid: ${effectiveUrl}`); }
                    } else if (effectiveUrl) { webField.setAttribute('src', effectiveUrl); }
                    else { webField.setAttribute('src', homepageActualUrl); addressInput.value = homepageDisplayUrl; effectiveUrl = homepageActualUrl; }
                    if (updateHistory && effectiveUrl) { if (historyIndex < currentHistory.length - 1) { currentHistory = currentHistory.slice(0, historyIndex + 1); } currentHistory.push(effectiveUrl); historyIndex = currentHistory.length - 1; }
                    updateNavButtons();
                } catch (e) { webField.setAttribute('srcdoc', `Error loading ${effectiveUrl}: ${e.message}`); updateNavButtons(); }
            };

            webField.addEventListener('load', () => {
                const loadedUrlInHistory = currentHistory[historyIndex];
                if (loadedUrlInHistory === homepageActualUrl && addressInput.value !== homepageDisplayUrl) { addressInput.value = homepageDisplayUrl; }
                updateNavButtons();
                if (isVFSPath(currentHistory[historyIndex]) && (webField.getAttribute('srcdoc') || webField.getAttribute('src')?.startsWith('blob:'))) {
                    try {
                        const iframeDoc = webField.contentWindow?.document;
                        const baseVfsPathForTopLevelDoc = currentTopLevelVFSBasePath || (isVFSPath(currentHistory[historyIndex]) ? dm.dirname(currentHistory[historyIndex]) : null);
                        if (iframeDoc && baseVfsPathForTopLevelDoc) {
                            const clickable = iframeDoc.body || iframeDoc.documentElement;
                            if(clickable) delete clickable.dataset[`iexploreLinkInterceptorAttached_${hWnd}`];
                            setupLinkInterceptorForDocument(iframeDoc, baseVfsPathForTopLevelDoc);
                        }
                    } catch (err) {}
                }
            });
            
            webField.addEventListener('error', (e) => { let failedUrl = addressInput.value || webField.getAttribute('src') || "Unknown Address"; addressInput.value = failedUrl; webField.removeAttribute('src'); webField.setAttribute('srcdoc', `Error loading: ${failedUrl}. Address may be invalid or unreachable, or the content could not be displayed.`); updateNavButtons(); });
            goButton.addEventListener('click', () => { if (window.shell?.playSystemSound) window.shell.playSystemSound("start"); navigateTo(addressInput.value); });
            addressInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') { event.preventDefault(); if (window.shell?.playSystemSound) window.shell.playSystemSound("start"); navigateTo(addressInput.value); } });
            backBtn.addEventListener('click', () => { if (window.shell?.playSystemSound) window.shell.playSystemSound("start"); if (historyIndex > 0) { historyIndex--; loadUrlInFrame(currentHistory[historyIndex], false); } });
            fwBtn.addEventListener('click', () => { if (window.shell?.playSystemSound) window.shell.playSystemSound("start"); if (historyIndex < currentHistory.length - 1) { historyIndex++; loadUrlInFrame(currentHistory[historyIndex], false); } });
            homeBtn.addEventListener('click', () => { if (window.shell?.playSystemSound) window.shell.playSystemSound("start"); navigateTo(homepageDisplayUrl); });
            reloadBtn.addEventListener('click', () => { if (window.shell?.playSystemSound) window.shell.playSystemSound("start"); if (historyIndex >= 0 && currentHistory[historyIndex]) { const currentUrlToReload = currentHistory[historyIndex]; loadUrlInFrame(currentUrlToReload, false); } else { navigateTo(homepageDisplayUrl); } });
            stopBtn.addEventListener('click', () => { if (window.shell?.playSystemSound) window.shell.playSystemSound("start"); webField.setAttribute('src', 'about:blank'); revokePageResources(); });
            selfWindow.addEventListener('wm:windowClosed', revokePageResources, {once: true});
            let initialTargetUrl = (contents && typeof contents === 'string') ? contents : ((filePath && typeof filePath === 'string') ? filePath : null);
            navigateTo(initialTargetUrl || homepageDisplayUrl);
            return hWnd;
        },
    });
})();