// js/apps/wmp.js
(function() {
    const windowTemplate = `
        <appcontentholder>
            <appnavigation>
                <ul class="appmenus">
                    <li id="wmp-file-menu">File
                        <ul class="submenu">
                            <li data-action="open-media-files">Open Media File(s)...</li>
                            <li class="divider"></li>
                            <li data-action="clear-playlist">Clear Current Playlist</li>
                            <li class="divider"></li>
                            <li data-action="exit-wmp">Exit</li>
                        </ul>
                    </li>
                    <li id="viewmenu" title="Change WMP Appearance">Skin</li>
                    <li title="Not Implemented">Play</li>
                    <li title="Not Implemented">Tools</li>
                    <li id="helpmenu">Help</li>
                </ul>
            </appnavigation>
            <wmpmainframe>
                <wmpcolorifier>
                <div class="shapeshader hideable" id="topleft">
                    <div class="wmpshape"></div>
                </div>
                <div class="wmpshapeholder hideable" id="topleft">
                    <div class="wmpshape"></div>
                </div>
                <div class="shapeshader" id="topright">
                    <div class="wmpshape"></div>
                </div>
                <div class="wmpshapeholder" id="topright">
                    <div class="wmpshape"></div>
                    <select class="hasicons" id="playlistselector" title="Current Playlist">
                        <option id="wmp-currentplaylist-option"><img src="res/icons/tray/wmskin.png">Current Playlist</option>
                    </select>
                    <div id="windowcontrols">
                        <div id="minimize" title="Minimize">_</div><div id="maximize" title="Maximize">🗖</div><div id="close" title="Close">✕</div>
                    </div>
                </div>
                <div class="shapeshader hideable" id="bottomleft">
                    <div class="wmpshape"></div>
                </div>
                <div class="wmpshapeholder hideable" id="bottomleft">
                    <div class="wmpshape"></div>
                </div>
                <div id="brand"><img src="res/ui/wmp/xplogo_small.png"></div>
                <div class="shapeshader" id="ctrlleft">
                    <div class="wmpshape"></div>
                </div>
                <div class="wmpshapeholder" id="ctrlleft">
                    <div class="wmpshape"></div>
                </div>
                <div class="shapeshader" id="ctrlmid">
                    <div class="wmpshape"></div>
                </div>
                <div class="wmpshapeholder" id="ctrlmid">
                    <div class="wmpshape"></div>
                </div>
                <div class="shapeshader" id="ctrlright">
                    <div class="wmpshape"></div>
                </div>
                <div class="wmpshapeholder" id="ctrlright">
                    <div class="wmpshape"></div>
                </div>
                <div id="navcollapsed"></div>
                <div id="nav" class="hideable">
                    <div id="nowplaying" class="navitem expands selected">Now Playing<div class="expander"></div></div>
                    <div id="guide" class="navitem">Media Guide</div>
                    <div id="rip" class="navitem">Copy from CD</div>
                    <div id="library" class="navitem">Media Library</div>
                    <div id="radio" class="navitem">Radio Tuner</div>
                    <div id="burn" class="navitem">Copy to CD or Device</div>
                    <div id="premium" class="navitem expands">Premium Services<div class="expander"></div></div>
                    <div id="skins" class="navitem">Skin Chooser</div>
                    <div id="brand"><img src="res/ui/wmp/xplogo_small.png"></div>
                </div>
                <div id="navtoggle" title="Toggle Navigation Pane"><div id="arrow">></div></div>
                <div id="topmetal">
                    <div class="metaledge left"></div>
                    <fnbutton id="toggleUIFrame" class="active" title="Show/Hide Menu Bar and Frame"></fnbutton>
                    <div class="metaledge right"></div>
                    <fnbutton id="shuffle" title="Shuffle (Not Implemented)"></fnbutton>
                    <fnbutton id="equalizer" title="Equalizer (Not Implemented)"></fnbutton>
                    <fnbutton id="playlist" class="active" title="Show/Hide Playlist"></fnbutton>
                </div>
                <div id="tinyblue"></div>
                <div id="sidemetal">
                    <div class="metaledge top"></div>
                </div>
                <div id="lowermetal">
                    <div class="metaledge left"></div>
                    <fnbutton id="colorswitch" title="Cycle Color Scheme"></fnbutton>
                    <fnbutton id="skinmode" title="Switch to Skin Mode (Mini Player)"></fnbutton>
                </div>
                <div id="cornermetal">
                    <div id="wmpresizer"></div>
                </div>
                <wmpcontent>
                    <div id="playbackcontainer"> 
                        <span id="artistname"></span>
                        <span id="songname"></span>
                        <canvas id="visualizer"></canvas>
                        <video id="playbackHolder" src="" crossorigin="anonymous" style="display:none; width:100%; height:100%; object-fit:contain;"></video>
                        <div id="viscontrols">
                            <fnbutton id="visgroups" title="Cycle Visualization Group (Not Implemented)"><buttonbody></buttonbody></fnbutton>
                            <fnbutton id="prevvis" title="Previous Visualization"><buttonbody></buttonbody></fnbutton>
                            <fnbutton id="nextvis" title="Next Visualization"><buttonbody></buttonbody></fnbutton>
                            <span id="visName">Bars and Waves: Bars</span>
                            <fnbutton id="fullscreen" title="Toggle Fullscreen Visualization/Video"><buttonbody></buttonbody></fnbutton>
                        </div>
                    </div>
                    <div id="playlistcontainer"><ul></ul></div>
                    <div id="statusbar"><span id="info">Ready</span></div>
                </wmpcontent>
                <playbackcontrols>
                    <div id="rewind" title="Rewind (Previous Track)"></div>
                    <div id="seekbar">
                        <div id="seekbg"></div>
                        <div id="seekfill"></div>
                        <div id="seekpointer"></div>
                    </div>
                    <div id="ffwd" title="Fast Forward (Next Track)"></div>
                    <fnbutton id="playpause" title="Play/Pause"><buttonbody></buttonbody></fnbutton>
                    <fnbutton id="stop" title="Stop"><buttonbody></buttonbody></fnbutton>
                    <fnbutton id="prev" title="Previous Track"><buttonbody></buttonbody></fnbutton>
                    <fnbutton id="next" title="Next Track"><buttonbody></buttonbody></fnbutton>
                    <fnbutton id="mute" title="Mute/Unmute"><buttonbody></buttonbody></fnbutton>
                    <div id="volbar">
                        <div id="volbg"></div>
                        <div id="volfill"></div>
                        <div id="volpointer"></div>
                    </div>
                </playbackcontrols>
                <div id="progress">00:00</div>
                </wmpcolorifier>
            </wmpmainframe>
            <div id="wmp9brand"><img src="res/ui/wmp/xplogo_small.png"></div>
        </appcontentholder>
    `;

    const wmpCSS = ["wmp8.css", "wmp9.css", "wmp10.css"];
    const wmpIcon = ["wmplayer.png", "wmplayer.png", "wmp10.png"];
    const wmpNavWidth = [80, 83, 0];
    const wmpColorHues = [0, 86.5, 115, 143, 143, 164, 172, 172, -143, -143, -115, -115, -57, -57, -28, -28, 0, 0, 0, 28, 28, 57, 57, 270];
    const wmpColorSats = [0, 1, 1, 1, 0.5, 1.8, 1, 0.3, 1, 0.48, 1, 0.51, 1, 0.51, 1, 0.51, 0.51, 0.3, 0.045, 1, 0.46, 1, 0.48, 1.5];
    
    const defaultSamplePlaylist = {
        name: "Sample Playlist",
        songDisplayNames: [
            "Windows Welcome Music", 
            "David Byrne - Like Humans Do", 
            "New Stories - Highway Blues", 
            "Beethoven's Symphony No. 9 (Scherzo)"
        ],
        songVFSPaths: [
            "C:/WINDOWS/system32/oobe/images/title.wma", 
            "C:/Documents and Settings/All Users/Shared Music/Sample Music/David Byrne - Like Humans Do.mp3",
            "C:/Documents and Settings/All Users/Shared Music/Sample Music/New Stories - Highway Blues.mp3",
            "C:/Documents and Settings/All Users/Shared Music/Sample Music/Beethoven's Symphony No. 9 (Scherzo).mp3"
        ]
    };

    let getWmpState = (appOriginElement) => {
        if (!appOriginElement._wmpState) {
            appOriginElement._wmpState = {
                hWnd: appOriginElement.id,
                currentColorSet: 0,
                currentUI: 0,
                navPaneVisible: true,
                miniPlayerEnabled: false,
                UIFrameHidden: false,
                playlistHidden: false,
                visualizers: ["Bars", "Ocean Mist", "Fire Storm", "Cover Art"],
                selectedVis: 0,
                currentCoverArtImage: null,
                songDisplayNames: [], 
                songPlayableSources: [], 
                songVFSPaths: [], 
                songBlobs: [], 
                songCoverArtData: [], 
                songIndex: 0,
                playing: false,
                killVizProcess: false,
                audioContext: null,
                audioAnalyzer: null,
                audioSource: null,
                currentObjectUrls: new Set() 
            };
            if (localStorage.getItem(`${shell._currentUser}.wmpVersion`) != null) {
                appOriginElement._wmpState.currentUI = parseInt(localStorage.getItem(`${shell._currentUser}.wmpVersion`));
            }
        }
        return appOriginElement._wmpState;
    };

    registerApp({
        _template: null,
        _singleInstance: true,
        _instanceIdentifier: "wmp", 
        
        setup: async function() {
            this._template = document.createElement("template");
            this._template.innerHTML = windowTemplate;
        },

        handleNewData: async function(options = {}) {
            const wmpWindow = wm._desktop.querySelector(`app#${this.hWnd}`);
            if (!wmpWindow || !wmpWindow._wmpState) {
                return;
            }
            if (options.filePath && wmpWindow._wmpAppInstance && typeof wmpWindow._wmpAppInstance.addMediaByVFSPath === 'function') {
                await wmpWindow._wmpAppInstance.addMediaByVFSPath(options.filePath, false);
            }
        },

        start: async function(options = {}) {
            var windowContents = this._template.content.firstElementChild.cloneNode(true);
            var hWndFromWM = wm.createNewWindow("wmp", windowContents);
            var selfWindow = wm._windows[hWndFromWM];

            const state = getWmpState(selfWindow);
            state.hWnd = hWndFromWM;
            this.hWnd = hWndFromWM; 
            
            selfWindow._wmpAppInstance = this;

            let wmpUiCssLink = document.getElementById(`wmpCSS_instance_${state.hWnd}`);
            if (!wmpUiCssLink) {
                wmpUiCssLink = document.createElement("link");
                wmpUiCssLink.id = `wmpCSS_instance_${state.hWnd}`;
                wmpUiCssLink.rel = "stylesheet";
                wmpUiCssLink.type = "text/css";
                document.head.appendChild(wmpUiCssLink);
            }
            wmpUiCssLink.href = `css/${wmpCSS[state.currentUI]}`;

            const appFrame = selfWindow.querySelector("wmpmainframe");
            const colorFrame = selfWindow.querySelector("wmpcolorifier");
            const appContent = selfWindow.querySelector("wmpcontent");
            const navToggle = selfWindow.querySelector("#navtoggle");
            const navBorder = selfWindow.querySelector("#navcollapsed");
            const uiFrameToggle = selfWindow.querySelector("#toggleUIFrame");
            const playlistToggle = selfWindow.querySelector("#playlist");
            const resizer = selfWindow.querySelector("#wmpresizer");
            const dragHandle = selfWindow.querySelector("#topmetal");
            const minButton = selfWindow.querySelector("#minimize");
            const maxButton = selfWindow.querySelector("#maximize");
            const closeButton = selfWindow.querySelector("#close");
            const colorChooser = selfWindow.querySelector("#colorswitch");
            const skinChooserButton = selfWindow.querySelector("#skinmode");
            const playbackHolder = selfWindow.querySelector("#playbackHolder");
            const playlistHolder = selfWindow.querySelector("#playlistcontainer ul");
            const viewpicker = selfWindow.querySelector("#viewmenu");
            const helpmenu = selfWindow.querySelector("#helpmenu");
            const artistNameEl = selfWindow.querySelector("#artistname");
            const songNameEl = selfWindow.querySelector("#songname");
            const statusBar = selfWindow.querySelector("#statusbar #info");
            const timeProgress = selfWindow.querySelector("#progress");
            const visualizer = selfWindow.querySelector("#visualizer");
            const visPicker = selfWindow.querySelector("#visgroups");
            const prevVis = selfWindow.querySelector("#prevvis");
            const nextVis = selfWindow.querySelector("#nextvis");
            const visNameEl = selfWindow.querySelector("#visName");
            const fullscreenBtn = selfWindow.querySelector("#fullscreen");
            const playBtn = selfWindow.querySelector("#playpause");
            const stopBtn = selfWindow.querySelector("#stop");
            const prevBtn = selfWindow.querySelector("#prev");
            const nextBtn = selfWindow.querySelector("#next");
            const muteBtn = selfWindow.querySelector("#mute");
            const seekBar = selfWindow.querySelector("#seekbar");
            const seekFill = selfWindow.querySelector("#seekfill");
            const seekPointer = selfWindow.querySelector("#seekpointer");
            const volBar = selfWindow.querySelector("#volbar");
            const volFill = selfWindow.querySelector("#volfill");
            const volPointer = selfWindow.querySelector("#volpointer");
            const frameCloseBtn = selfWindow.querySelector("appcontrols .closebtn");
            const playlistSelector = selfWindow.querySelector("#playlistselector");
            const navSkinChooser = selfWindow.querySelector("#nav #skins");

            selfWindow.style = "";
            wm.setIcon(state.hWnd, wmpIcon[state.currentUI]);
            wm.setCaption(state.hWnd, "Windows Media Player");
            wm.setSize(state.hWnd, 640, 532);
            wm.focusWindow(state.hWnd);

            toggleAppWrapper(false); 

            let ctx = visualizer.getContext("2d");
            initVisualizer();
            
            this.addMediaByVFSPath = async (vfsPath, clearCurrentPlaylist = true) => {
                if (vfsPath) {
                    await addVFSFilesToPlaylist([vfsPath], true, clearCurrentPlaylist);
                }
            };
            
            if (options && options.filePath) {
                await this.addMediaByVFSPath(options.filePath, true);
            } else {
                clearPlaylist();
                for (const vfsPath of defaultSamplePlaylist.songVFSPaths) {
                    const node = await dm.open(vfsPath);
                    if (node && node.content instanceof Blob) {
                        const displayName = defaultSamplePlaylist.songDisplayNames[defaultSamplePlaylist.songVFSPaths.indexOf(vfsPath)] || dm.basename(vfsPath);
                        state.songDisplayNames.push(displayName);
                        state.songVFSPaths.push(vfsPath);
                        state.songBlobs.push(node.content);
                        state.songCoverArtData.push(null);
                    }
                }
                populatePlaylist();
                if (state.songDisplayNames.length > 0) {
                    await changeSong(0);
                }
            }
            updateVolume();
            updateSkinModeButtonVisibility();
            changeVis(); 

            async function addVFSFilesToPlaylist(vfsPaths, playFirstNew = false, clearCurrent = false) {
                if (clearCurrent) {
                    clearPlaylist();
                }
                let firstNewSongIndex = state.songDisplayNames.length;
                let newFilesAdded = false;

                for (const vfsPath of vfsPaths) {
                    const node = await dm.open(vfsPath);
                    if (node && node.type === 'file') {
                        if (!(node.content instanceof Blob)) {
                            dialogHandler.spawnDialog({icon: "error", title: "Load Error", text: `Cannot play "${dm.basename(vfsPath)}". File content is not in expected Blob format.`});
                            continue;
                        }
                        state.songDisplayNames.push(dm.basename(vfsPath));
                        state.songVFSPaths.push(vfsPath);
                        state.songBlobs.push(node.content);
                        state.songCoverArtData.push(null);
                        newFilesAdded = true;
                    } else {
                        dialogHandler.spawnDialog({icon: "error", title: "Load Error", text: `Could not open or find file: "${vfsPath}"`});
                    }
                }

                if (newFilesAdded) {
                    populatePlaylist();
                    if (playFirstNew && state.songDisplayNames.length > 0) {
                        const playIndex = clearCurrent ? 0 : firstNewSongIndex;
                        if (playIndex < state.songDisplayNames.length) {
                            await changeSong(playIndex);
                        }
                    } else if (!state.playing && state.songDisplayNames.length > 0 && state.songIndex < state.songDisplayNames.length) {
                        await changeSong(state.songIndex);
                    }
                }
            }
            
            function clearPlaylist() {
                stopSong();
                revokeAllObjectUrls();
                state.songDisplayNames = [];
                state.songPlayableSources = [];
                state.songVFSPaths = [];
                state.songBlobs = [];
                state.songCoverArtData = [];
                state.songIndex = 0;
                state.currentCoverArtImage = null;
                playbackHolder.src = "";
                artistNameEl.textContent = "";
                songNameEl.textContent = "Playlist Cleared";
                statusBar.textContent = "Ready";
                timeProgress.textContent = "00:00";
                populatePlaylist();
                if (ctx) ctx.clearRect(0, 0, visualizer.width, visualizer.height);
            }

            function populatePlaylist() {
                playlistHolder.innerHTML = "";
                for(let i = 0; i < state.songDisplayNames.length; i++) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = state.songDisplayNames[i] || "Untitled Track";
                    listItem.dataset.index = i;
                    playlistHolder.appendChild(listItem);
                    listItem.addEventListener("dblclick", async function () {
                        const newIndex = parseInt(this.dataset.index);
                        if (!isNaN(newIndex)) {
                            await changeSong(newIndex);
                        }
                    });
                }
                 if (state.songDisplayNames.length > 0) {
                     highlightPlaylist(state.songIndex);
                 }
            }

            function highlightPlaylist(songItemIndex) {
                Array.from(playlistHolder.childNodes).forEach(child => child.classList.remove("selected"));
                if(playlistHolder.childNodes[songItemIndex]) {
                    playlistHolder.childNodes[songItemIndex].classList.add("selected");
                }
            }

            async function changeSong(newSongIndex) {
                if (newSongIndex < 0 || newSongIndex >= state.songDisplayNames.length) {
                    if (state.songDisplayNames.length === 0) stopSong();
                    return;
                }
                stopSong(); 
                revokeAllObjectUrls(); 

                state.songIndex = newSongIndex;
                const vfsPath = state.songVFSPaths[state.songIndex];
                const displayName = state.songDisplayNames[state.songIndex] || dm.basename(vfsPath || "Untitled Track");
                
                let mediaBlob = state.songBlobs[state.songIndex];

                if (!mediaBlob && vfsPath) { 
                    const node = await dm.open(vfsPath);
                    if (node && node.content instanceof Blob) {
                        mediaBlob = node.content;
                        state.songBlobs[state.songIndex] = mediaBlob;
                    } else {
                        dialogHandler.spawnDialog({icon: "error", title: "Playback Error", text: `Could not load media content for "${displayName}".`});
                        statusBar.textContent = `Error loading: ${displayName}`;
                        return;
                    }
                }
                
                if (!mediaBlob) {
                     dialogHandler.spawnDialog({icon: "error", title: "Playback Error", text: `No media data found for "${displayName}".`});
                     statusBar.textContent = `No data for: ${displayName}`;
                     return;
                }

                const objectURL = URL.createObjectURL(mediaBlob);
                addCurrentObjectUrl(objectURL);
                state.songPlayableSources[state.songIndex] = objectURL;

                const fileType = getFileType(vfsPath || displayName);
                state.currentCoverArtImage = null;

                if (fileType === 'video') {
                    appContent.classList.add("videomode");
                    visualizer.style.display = 'none';
                    playbackHolder.style.display = 'block';
                    if(ctx) ctx.clearRect(0, 0, visualizer.width, visualizer.height);
                } else { 
                    appContent.classList.remove("videomode");
                    visualizer.style.display = 'block';
                    playbackHolder.style.display = 'none';
                    if (mediaBlob) { 
                        await loadCoverArtForSong(state.songIndex, mediaBlob);
                    }
                    if (state.visualizers[state.selectedVis] === "Cover Art") {
                        if (state.currentCoverArtImage && ctx) drawCoverArt();
                        else if (ctx) displayNoCoverArtMessage();
                    }
                }
                
                playbackHolder.src = objectURL;
                artistNameEl.textContent = ""; 
                songNameEl.textContent = displayName;
                statusBar.textContent = `Loading: ${displayName}`; 
                highlightPlaylist(state.songIndex);
                setVisSize();
                playbackHolder.load(); 
                playSong(); 
            }

            async function loadCoverArtForSong(songIdx, mediaFileBlob) {
                state.currentCoverArtImage = null;
                const updateUIAfterCoverArtAttempt = (reason) => {
                    if (state.visualizers[state.selectedVis] === "Cover Art" && ctx) {
                        if (state.currentCoverArtImage) {
                            drawCoverArt();
                        } else {
                            displayNoCoverArtMessage();
                        }
                    }
                };

                if (state.songCoverArtData[songIdx]) {
                    const img = new Image();
                    img.onload = () => { state.currentCoverArtImage = img; updateUIAfterCoverArtAttempt("cache_load_success"); };
                    img.onerror = () => { 
                        state.currentCoverArtImage = null; state.songCoverArtData[songIdx] = null; 
                        updateUIAfterCoverArtAttempt("cache_load_error"); 
                    };
                    img.src = state.songCoverArtData[songIdx];
                    return;
                }

                if (!mediaFileBlob || !(mediaFileBlob instanceof Blob)) {
                    updateUIAfterCoverArtAttempt("no_media_blob");
                    return;
                }
                
                if (typeof jsmediatags === 'undefined') {
                    updateUIAfterCoverArtAttempt("jsmediatags_not_loaded");
                    return;
                }
                try {
                    const tags = await new Promise((resolve, reject) => {
                        jsmediatags.read(mediaFileBlob, { 
                            onSuccess: (tagObject) => {
                                resolve(tagObject);
                            }, 
                            onError: (error) => {
                                reject(error);
                            }
                        });
                    });

                    if (tags && tags.tags && tags.tags.picture) {
                        const picture = tags.tags.picture;
                        
                        let picData = picture.data; 
                        const format = picture.format;
                        let byteArray;
            
                        if (picData instanceof ArrayBuffer) {
                            byteArray = new Uint8Array(picData);
                        } else if (Array.isArray(picData)) { 
                            byteArray = new Uint8Array(picData);
                        } else {
                            updateUIAfterCoverArtAttempt("tag_invalid_pic_data_type");
                            return;
                        }
            
                        if (byteArray && byteArray.length > 0 && format) {
                            let binaryString = '';
                            const CHUNK_SIZE = 0x8000; 
                            for (let i = 0; i < byteArray.length; i += CHUNK_SIZE) {
                                binaryString += String.fromCharCode.apply(null, byteArray.subarray(i, i + CHUNK_SIZE));
                            }
                            const base64String = window.btoa(binaryString);
                            const dataUrl = `data:${format};base64,${base64String}`;
                            state.songCoverArtData[songIdx] = dataUrl; 
                            
                            const img = new Image();
                            img.onload = () => { 
                                state.currentCoverArtImage = img; 
                                updateUIAfterCoverArtAttempt("tag_load_success"); 
                            };
                            img.onerror = (e) => { 
                                state.currentCoverArtImage = null; 
                                state.songCoverArtData[songIdx] = null; 
                                updateUIAfterCoverArtAttempt("tag_load_error_data_url"); 
                            };
                            img.src = dataUrl;
                        } else { 
                            updateUIAfterCoverArtAttempt("tag_invalid_processed_pic_data"); 
                        }
                    } else { 
                        updateUIAfterCoverArtAttempt("tag_no_picture"); 
                    }
                } catch (error) { 
                    updateUIAfterCoverArtAttempt("tag_processing_exception"); 
                }
            }

            function getFileType(filePathOrName) {
                if (!filePathOrName || typeof filePathOrName !== 'string') return 'unknown';
                const extension = filePathOrName.split('.').pop().toLowerCase();
                const videoExtensions = ['mp4', 'webm', 'ogv', 'mov', 'mkv', 'avi', 'wmv'];
                const audioExtensions = ['mp3', 'ogg', 'opus', 'oga', 'aac', 'wav', 'flac', 'm4a', 'wma', 'mid'];
                if (videoExtensions.includes(extension)) return 'video';
                if (audioExtensions.includes(extension)) return 'audio';
                return 'unknown';
            }

            function revokeAllObjectUrls() {
                state.currentObjectUrls.forEach(url => URL.revokeObjectURL(url));
                state.currentObjectUrls.clear();
            }

            function addCurrentObjectUrl(url) {
                if (url && url.startsWith('blob:')) {
                    state.currentObjectUrls.add(url);
                }
            }

            function setVisSize() {
                const playbackContainerRect = visualizer.parentElement.getBoundingClientRect();
                if (playbackContainerRect.width <=0 || playbackContainerRect.height <= 0) return; 
                visualizer.width = playbackContainerRect.width;
                visualizer.height = playbackContainerRect.height;
                if (playbackHolder) {
                    playbackHolder.width = playbackContainerRect.width;
                    playbackHolder.height = playbackContainerRect.height;
                }
                if (state.visualizers[state.selectedVis] === "Cover Art" && ctx) {
                    if (state.currentCoverArtImage) drawCoverArt();
                    else displayNoCoverArtMessage();
                }
            }
            
            function drawCoverArt() {
                if (!ctx || !state.currentCoverArtImage || !visualizer.width || !visualizer.height) return;
                ctx.clearRect(0, 0, visualizer.width, visualizer.height);
                const hRatio = visualizer.width / state.currentCoverArtImage.width;
                const vRatio = visualizer.height / state.currentCoverArtImage.height;
                const ratio = Math.min(hRatio, vRatio);
                const centerShift_x = (visualizer.width - state.currentCoverArtImage.width * ratio) / 2;
                const centerShift_y = (visualizer.height - state.currentCoverArtImage.height * ratio) / 2;
                ctx.drawImage(state.currentCoverArtImage, 0, 0, state.currentCoverArtImage.width, state.currentCoverArtImage.height,
                              centerShift_x, centerShift_y, state.currentCoverArtImage.width * ratio, state.currentCoverArtImage.height * ratio);
            }
            
            function displayNoCoverArtMessage() {
                 if (!ctx || !visualizer.width || !visualizer.height) return;
                ctx.clearRect(0, 0, visualizer.width, visualizer.height);
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, visualizer.width, visualizer.height);
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.font = "12px sans-serif";
                ctx.fillText("No Cover Art Available", visualizer.width / 2, visualizer.height / 2);
            }

            function changeVis(decrement = false) {
                if (decrement) {
                    state.selectedVis -= 1;
                    if (state.selectedVis < 0) state.selectedVis = state.visualizers.length -1;
                } else {
                    state.selectedVis += 1;
                    if (state.selectedVis > state.visualizers.length -1) state.selectedVis = 0;
                }
                if (state.visualizers[state.selectedVis] === "Cover Art") {
                    visNameEl.innerText = `Visualizer: Cover Art`;
                    if (state.currentCoverArtImage && ctx) drawCoverArt();
                    else if (ctx) displayNoCoverArtMessage();
                } else {
                    visNameEl.innerText = `Bars and waves: ${state.visualizers[state.selectedVis]}`;
                }
            }

            function initVisualizer() {
                if (!state.audioContext && typeof (window.AudioContext || window.webkitAudioContext) !== "undefined") {
                    try {
                        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        state.audioAnalyzer = state.audioContext.createAnalyser();
                        ctx.translate(0.5, 0.5); 
                        ctx.mozImageSmoothingEnabled = false; 
                        state.audioSource = state.audioContext.createMediaElementSource(playbackHolder);
                        state.audioSource.connect(state.audioAnalyzer);
                        state.audioAnalyzer.connect(state.audioContext.destination);
                    } catch (e) { state.audioContext = null; }
                } else if (!state.audioContext) return;
                setVisSize();
                
                let then = performance.now(); 
                let peaks = []; 

                requestAnimationFrame(visualizerLoop);
                
                function visualizerLoop(newtime) {
                    if (state.killVizProcess) return;
                    requestAnimationFrame(visualizerLoop);

                    const currentSongPath = state.songVFSPaths[state.songIndex] || state.songDisplayNames[state.songIndex];
                    if (state.visualizers[state.selectedVis] === "Cover Art" || getFileType(currentSongPath) === 'video') {
                         if (getFileType(currentSongPath) === 'video' && ctx) ctx.clearRect(0, 0, visualizer.width, visualizer.height);
                        return;
                    }
                    if (!state.playing || !state.audioAnalyzer) return;

                    const fps = 24; const fpsinterval = 1000 / fps;
                    let elapsed, now;
                    let barColor, peakColor, barWidth, barOffset, peakFalloff, maxBars, sampleSize;

                    if (state.selectedVis == 0) { 
                        barWidth = 5; barOffset = 1; maxBars = 48; sampleSize = 128;
                        barColor = getComputedStyle(document.documentElement).getPropertyValue("--visualizerBars");
                        peakColor = getComputedStyle(document.documentElement).getPropertyValue("--visualizerPeaks");
                        peakFalloff = 1;
                    } else if (state.selectedVis == 1) { 
                        barWidth = 1; barOffset = 0; maxBars = 1024; sampleSize = 4096; peakFalloff = 2;
                        barColor = "#00f"; peakColor = "#fff";
                    } else if (state.selectedVis == 2) { 
                        barWidth = 1; barOffset = 0; maxBars = 1024; sampleSize = 4096; peakFalloff = 2;
                        barColor = "#ffa500"; peakColor = "#f00";
                    } else { return; }
                    
                    now = newtime; elapsed = now - then;

                    if (elapsed > fpsinterval) {
                        then = now - (elapsed % fpsinterval);
                        state.audioAnalyzer.fftSize = sampleSize;
                        let fbc_array = new Uint8Array(state.audioAnalyzer.frequencyBinCount);
                        state.audioAnalyzer.getByteFrequencyData(fbc_array);
                        if (state.selectedVis == 0) ctx.clearRect(0, 0, visualizer.width, visualizer.height);
                        else { ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(0, 0, visualizer.width, visualizer.height); }
                        
                        let bars = Math.floor(visualizer.width / barWidth);
                        if (bars > maxBars) bars = maxBars;
                        let barSum = barWidth + barOffset;
                        let offset = Math.ceil((visualizer.width - (bars * barSum))/2);

                        for (let i = 0; i < bars; i++) {
                            let bar_x = i * barSum + offset;
                            if (state.selectedVis !== 0) ctx.fillRect(bar_x, Math.floor(visualizer.height + peaks[i]), barWidth, 1);
                            let bar_height = Math.floor(-(fbc_array[i] / 2) * (visualizer.height / 200));
                            if (!peaks[i] || peaks[i] > bar_height) peaks[i] = bar_height - 2;
                            else if (peaks[i] >= -1) peaks[i] = -1;
                            else peaks[i] = peaks[i] + peakFalloff;
                            ctx.fillStyle = barColor; ctx.fillRect(bar_x, visualizer.height, barWidth, bar_height);
                            ctx.fillStyle = peakColor; ctx.fillRect(bar_x, Math.ceil(visualizer.height + peaks[i]), barWidth, 1);
                        }
                    }
                }
            }

            function wmpDrag(e) {
                var el = selfWindow;
                window.addEventListener("pointermove", doDrag);
                window.addEventListener("pointerup", endDrag);
                let pos3 = e.clientX; let pos4 = e.clientY;
                function doDrag(eDrag) {
                    let pos1 = pos3 - eDrag.clientX; let pos2 = pos4 - eDrag.clientY;
                    pos3 = eDrag.clientX; pos4 = eDrag.clientY;
                    el.style.top = (el.offsetTop - pos2) + "px"; el.style.left = (el.offsetLeft - pos1) + "px";
                }
                function endDrag() {
                    window.removeEventListener("pointermove", doDrag); window.removeEventListener("pointerup", endDrag);
                }
            }
            function wmpResize(e) {
                var elToResize = selfWindow.querySelector("appcontents");
                let prevX = e.clientX; let prevY = e.clientY;
                window.addEventListener("pointermove", doResize); window.addEventListener("pointerup", endResize);
                function doResize(eResize) {
                    const rect = elToResize.getBoundingClientRect();
                    elToResize.style.width = rect.width - (prevX - eResize.clientX) + "px"; 
                    elToResize.style.height = rect.height - (prevY - eResize.clientY) + "px";
                    prevX = eResize.clientX; prevY = eResize.clientY;
                }
                function endResize() {
                    window.removeEventListener("pointermove", doResize); window.removeEventListener("pointerup", endResize);
                    setVisSize();
                }
            }

            function visFullscreen() {
                const currentPath = state.songVFSPaths[state.songIndex] || state.songDisplayNames[state.songIndex];
                if (getFileType(currentPath) === 'video') playbackHolder.requestFullscreen();
                else visualizer.requestFullscreen();
            }

            function toggleNavPane() {
                var curWidth = parseInt(selfWindow.querySelector("appcontents").style.width, 10);
                var curHeight = parseInt(selfWindow.querySelector("appcontents").style.height, 10);
                let widthToggle = wmpNavWidth[state.currentUI]; 
                let currentPos = wm.getPosition(state.hWnd); 
                let posX = currentPos ? currentPos[0] : 0;
                let posY = currentPos ? currentPos[1] : 0;

                if (state.navPaneVisible){
                    selfWindow.classList.add("collapsed"); navBorder.classList.add("collapsed"); navToggle.classList.add("collapsed");
                    wm.setSize(state.hWnd, (curWidth - widthToggle), curHeight); 
                    wm.setPosition(state.hWnd, parseInt(posX) + widthToggle, posY);
                } else {
                    selfWindow.classList.remove("collapsed"); navBorder.classList.remove("collapsed"); navToggle.classList.remove("collapsed");
                    wm.setSize(state.hWnd, (curWidth + widthToggle), curHeight); 
                    wm.setPosition(state.hWnd, parseInt(posX) - widthToggle, posY);
                }
                state.navPaneVisible = !state.navPaneVisible;
                setTimeout(setVisSize, 50);
            }
            function togglePlaylist() {
                if (!state.playlistHidden){
                    selfWindow.classList.add("playlisthidden"); appContent.classList.add("playlisthidden"); playlistToggle.classList.remove("active");
                } else {
                    selfWindow.classList.remove("playlisthidden"); appContent.classList.remove("playlisthidden"); playlistToggle.classList.add("active");
                }
                state.playlistHidden = !state.playlistHidden;
                setTimeout(setVisSize, 50);
            }
            function toggleAppWrapper(initialCall = false) {
                if (!initialCall) state.UIFrameHidden = !state.UIFrameHidden;

                if (state.UIFrameHidden){ selfWindow.classList.add("framehidden"); uiFrameToggle.classList.remove("active");}
                else { selfWindow.classList.remove("framehidden"); uiFrameToggle.classList.add("active");}
            }
            function toggleMiniPlayer() {
                if (state.currentUI === 2) return;
                if (selfWindow.classList.contains("maximized")) wm.toggleMaximizeWindow(state.hWnd);
                if (!state.miniPlayerEnabled) selfWindow.classList.add("miniplayer");
                else selfWindow.classList.remove("miniplayer");
                state.miniPlayerEnabled = !state.miniPlayerEnabled;
                setTimeout(setVisSize, 150);
            }
            function changePlayerColors() {
                state.currentColorSet += 1;
                if (state.currentColorSet > wmpColorHues.length - 1) state.currentColorSet = 0;
                if (state.currentColorSet == 0) colorFrame.style.filter = "none";
                else colorFrame.style.filter = `hue-rotate(${wmpColorHues[state.currentColorSet]}deg) saturate(${wmpColorSats[state.currentColorSet]})`;
            }

            function playSong() {
                if (!playbackHolder.src || playbackHolder.src === window.location.href || playbackHolder.src.endsWith("#") || playbackHolder.src.endsWith("/")) {
                    return;
                }
                if (state.audioContext && state.audioContext.state === 'suspended') {
                    state.audioContext.resume().catch(err => {});
                }
                playbackHolder.play().then(() => {
                    state.playing = true; playBtn.classList.add("playing");
                    if (state.songDisplayNames.length > 0 && state.songDisplayNames[state.songIndex]) {
                         statusBar.textContent = `Playing: ${state.songDisplayNames[state.songIndex]}`;
                    } else {
                         statusBar.textContent = `Playing`;
                    }
                }).catch((err) => {
                    state.playing = false; playBtn.classList.remove("playing");
                     if (state.songDisplayNames.length > 0 && state.songDisplayNames[state.songIndex]) {
                        statusBar.textContent = `Error: Could not play ${state.songDisplayNames[state.songIndex]}`;
                    } else {
                        statusBar.textContent = `Error: Could not play media`;
                    }
                });
            }
            function pauseSong() {
                playbackHolder.pause(); state.playing = false; playBtn.classList.remove("playing");
                if (state.songDisplayNames.length > 0 && state.songDisplayNames[state.songIndex]) {
                    statusBar.textContent = `Paused: ${state.songDisplayNames[state.songIndex]}`;
                } else if (state.songDisplayNames.length > 0) {
                     statusBar.textContent = `Paused`;
                } else {
                    statusBar.textContent = "Ready";
                }
            }
            function stopSong() {
                pauseSong(); 
                if(playbackHolder) playbackHolder.currentTime = 0;
                statusBar.textContent = "Stopped";
            }
            async function prevSong() {
                if (state.songDisplayNames.length === 0) return;
                let newIndex = state.songIndex - 1;
                if(newIndex < 0) newIndex = state.songDisplayNames.length - 1;
                await changeSong(newIndex);
            }
            async function nextSong() {
                if (state.songDisplayNames.length === 0) return;
                let newIndex = state.songIndex + 1;
                if(newIndex > state.songDisplayNames.length - 1) newIndex = 0;
                await changeSong(newIndex);
            }
            function toggleMute() {
                playbackHolder.muted = !playbackHolder.muted; updateMute();
            }
            function updateMute() {
                if (playbackHolder.muted || playbackHolder.volume === 0) muteBtn.classList.add("active");
                else muteBtn.classList.remove("active");
            }
            function updateProgress(e) {
                const {duration, currentTime} = e.srcElement;
                if (duration > 0 && !isNaN(duration) && currentTime >= 0) {
                    const progressPercent = (currentTime / duration) * 100;
                    seekFill.style.width = `${progressPercent}%`; seekPointer.style.left = `${progressPercent}%`;
                    elapsedTime(currentTime);
                } else {
                    seekFill.style.width = `0%`; seekPointer.style.left = `0%`; timeProgress.textContent = "00:00";
                }
            }
            function setProgress(e) {
                const seekWidth = seekBar.clientWidth; 
                if (seekWidth === 0) return;
                const seekClick = e.offsetX;
                const duration = playbackHolder.duration;
                if (duration > 0 && !isNaN(duration)) {
                    playbackHolder.currentTime = (seekClick / seekWidth) * duration;
                }
            }
            function setVolume(e) {
                const volWidth = volBar.clientWidth; 
                if (volWidth === 0) return;
                const volClick = e.offsetX;
                let newVolume = volClick / volWidth;
                if (newVolume < 0) newVolume = 0; if (newVolume > 1) newVolume = 1;
                playbackHolder.volume = newVolume;
                volPointer.style.left = newVolume * 100 + "%"; volFill.style.width = newVolume * 100 + "%";
                if(newVolume > 0) playbackHolder.muted = false;
                updateMute(); 
            }
            function updateVolume() {
                volPointer.style.left = playbackHolder.volume * 100 + "%";
                volFill.style.width = playbackHolder.volume * 100 + "%";
                updateMute();
            }
            function formatTime(timeInSeconds) {
                if (isNaN(timeInSeconds) || timeInSeconds === Infinity || timeInSeconds < 0) return "00:00";
                const minutes = Math.floor(timeInSeconds / 60); const seconds = Math.floor(timeInSeconds % 60);
                return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
            function elapsedTime(currentTime) { timeProgress.innerHTML = formatTime(currentTime); }
            
            function updateSkinModeButtonVisibility() {
                if (state.currentUI === 2) {
                    skinChooserButton.style.display = 'none';
                } else {
                    skinChooserButton.style.display = '';
                }
            }

            function changeSkin() {
                state.currentUI += 1; if (state.currentUI > wmpCSS.length - 1) state.currentUI = 0;
                if (wmpUiCssLink) wmpUiCssLink.setAttribute("href", `css/${wmpCSS[state.currentUI]}`);
                wm.setIcon(state.hWnd, wmpIcon[state.currentUI]);
                localStorage.setItem(`${shell._currentUser}.wmpVersion`, state.currentUI);
                updateSkinModeButtonVisibility();
                setTimeout(setVisSize, 50);
            }

            async function openMediaFilesFromVFS() {
                const userDocsPath = `C:/Documents and Settings/${shell._currentUser}/My Documents`;
                let initialDialogPath = userDocsPath;
                if (state.songVFSPaths.length > 0 && state.songVFSPaths[state.songVFSPaths.length - 1]) {
                     initialDialogPath = dm.dirname(state.songVFSPaths[state.songVFSPaths.length -1]);
                }
                
                const selectedPathOrPaths = await wm.openFileDialog({
                    title: "Open Media File(s)",
                    initialPath: initialDialogPath,
                    filters: [
                        { name: "All Media Files", extensions: ["mp3", "mp4", "wav", "ogg", "webm", "aac", "flac", "wma", "wmv", "mid"] },
                        { name: "Audio Files", extensions: ["mp3", "wav", "ogg", "aac", "flac", "wma", "mid"] },
                        { name: "Video Files", extensions: ["mp4", "webm", "wmv"] },
                        { name: "All Files", extensions: ["*.*"] }
                    ],
                });

                if (selectedPathOrPaths) {
                    const pathsArray = Array.isArray(selectedPathOrPaths) ? selectedPathOrPaths : [selectedPathOrPaths];
                    if (pathsArray.length > 0) {
                         await addVFSFilesToPlaylist(pathsArray, true, false); 
                    }
                }
            }
            
            playBtn.addEventListener("pointerup", () => { if (state.playing) pauseSong(); else playSong(); });
            stopBtn.addEventListener("pointerup", stopSong);
            prevBtn.addEventListener("pointerup", prevSong);
            selfWindow.querySelector("#rewind").addEventListener("pointerup", prevSong);
            nextBtn.addEventListener("pointerup", nextSong);
            selfWindow.querySelector("#ffwd").addEventListener("pointerup", nextSong);
            muteBtn.addEventListener("pointerup", toggleMute);

            playbackHolder.addEventListener("timeupdate", updateProgress);
            playbackHolder.addEventListener("ended", nextSong);
            playbackHolder.addEventListener("volumechange", updateVolume);
            playbackHolder.addEventListener('loadedmetadata', (e) => { 
                updateProgress(e); 
                setVisSize(); 
            });
            playbackHolder.addEventListener('canplay', () => {
                 setVisSize();
                 playSong();
            });
            playbackHolder.addEventListener('error', (e) => {
                const currentTrackName = state.songDisplayNames[state.songIndex] || "current track";
                statusBar.textContent = `Error playing ${currentTrackName}. Unsupported format or file error.`;
            });

            seekBar.addEventListener("pointerdown", (e) => {
                if (!playbackHolder.duration || isNaN(playbackHolder.duration)) return;
                seekBar.setPointerCapture(e.pointerId); 
                const wasPlaying = state.playing;
                if (state.playing) { // Only pause if it was actively playing
                    playbackHolder.pause(); // Pause immediately for smoother seeking UX
                }
                seekPointer.style.pointerEvents = "none"; 
                setProgress(e); 
                const moveHandler = (moveEvent) => { if(moveEvent.pressure > 0) setProgress(moveEvent); };
                const upHandler = () => {
                    seekBar.removeEventListener("pointermove", moveHandler); 
                    seekBar.onpointerup = null; 
                    seekBar.releasePointerCapture(e.pointerId); 
                    seekPointer.style.pointerEvents = "";
                    if (wasPlaying) { // If it was playing before seek, resume.
                        playSong();
                    } else if (playbackHolder.readyState >= 3) { // HAVE_FUTURE_DATA or more
                        // If paused and seeked, often users expect it to stay paused.
                        // However, if you want it to play after seeking when paused:
                        // playSong(); 
                    }
                };
                seekBar.addEventListener("pointermove", moveHandler); 
                seekBar.onpointerup = upHandler; 
            });

            volBar.addEventListener("pointerdown", (e) => {
                volBar.setPointerCapture(e.pointerId); volPointer.style.pointerEvents = "none"; setVolume(e);
                const moveHandler = (moveEvent) => { if(moveEvent.pressure > 0) setVolume(moveEvent); };
                const upHandler = () => {
                    volBar.removeEventListener("pointermove", moveHandler); 
                    volBar.onpointerup = null;
                    volBar.releasePointerCapture(e.pointerId); volPointer.style.pointerEvents = "";
                };
                volBar.addEventListener("pointermove", moveHandler); 
                volBar.onpointerup = upHandler;
            });

            navToggle.addEventListener("pointerup", toggleNavPane);
            minButton.addEventListener("pointerup", () => window.wm.minimizeWindow(state.hWnd) );
            maxButton.addEventListener("pointerup", () => { window.wm.toggleMaximizeWindow(state.hWnd); setTimeout(setVisSize, 150); });
            
            const handleCloseWMP = () => {
                state.killVizProcess = true;
                if (state.audioContext && state.audioContext.state !== 'closed') {
                    state.audioContext.close().catch(err => {});
                }
                revokeAllObjectUrls();
                state.songDisplayNames = []; state.songPlayableSources = []; state.songVFSPaths = [];
                state.songBlobs = []; state.songCoverArtData = []; state.currentCoverArtImage = null;
                const instanceCss = document.getElementById(`wmpCSS_instance_${state.hWnd}`);
                if (instanceCss) instanceCss.remove();
                if (selfWindow._wmpState) delete selfWindow._wmpState;
                window.wm.closeWindow(state.hWnd);
            };
            closeButton.addEventListener("pointerup", handleCloseWMP);
            if(frameCloseBtn) frameCloseBtn.onclick = handleCloseWMP;
            selfWindow.addEventListener('wm:windowClosed', handleCloseWMP, {once: true});

            colorChooser.addEventListener("pointerup", changePlayerColors);
            skinChooserButton.addEventListener("pointerup", toggleMiniPlayer);
            if (navSkinChooser) {
                navSkinChooser.addEventListener("click", changeSkin);
            }

            resizer.addEventListener("pointerdown", wmpResize);
            dragHandle.addEventListener("pointerdown", wmpDrag);
            visPicker.addEventListener("pointerup", setVisSize);
            prevVis.addEventListener("pointerup", () => changeVis(true));
            nextVis.addEventListener("pointerup", () => changeVis(false));
            fullscreenBtn.addEventListener("pointerup", visFullscreen);
            document.addEventListener('fullscreenchange', () => setTimeout(setVisSize, 150) );

            uiFrameToggle.addEventListener("pointerup", () => toggleAppWrapper());
            playlistToggle.addEventListener("pointerup", togglePlaylist);
            
            selfWindow.querySelectorAll('#wmp-file-menu [data-action]').forEach(item => {
                const action = item.dataset.action;
                switch(action) {
                    case 'open-media-files': item.onclick = openMediaFilesFromVFS; break;
                    case 'clear-playlist': item.onclick = clearPlaylist; break;
                    case 'exit-wmp': item.onclick = handleCloseWMP; break;
                }
            });

            viewpicker.addEventListener("pointerup", changeSkin);
            helpmenu.addEventListener("pointerup", () => {
                dialogHandler.spawnDialog({
                    icon:'info', title:'Windows Media Player Help',
                    text: 'Use "File > Open Media File(s)..." to add songs from your virtual drives to the playlist. <br>Use Explorer to upload songs from your computer to your virtual drives first.',
                    windowSize: [390, 'auto'], buttons:[['OK', (e) => window.wm.closeWindow(e.target.closest('app').id)]]
                });
            });
            
            const appContentElement = selfWindow.querySelector("appcontents") || selfWindow;
            const observer = new ResizeObserver(() => setTimeout(setVisSize, 50) );
            observer.observe(appContentElement);

            return state.hWnd;
        },
    })
})();