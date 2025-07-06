(function() {
    let body = document.getElementsByTagName("body")[0];
    let pixelType = true;
    let running = true;
    let lastUsedTheme = null;

    const themesData = {
        luna: {
            name: "Windows XP style",
            cssFolder: "luna",
            schemes: { blue: "Default (blue)", homestead: "Olive Green", metallic: "Silver" }
        },
        royale: {
            name: "Royale",
            cssFolder: "luna",
            schemes: { royale: "Royale", noir: "Noir" }
        },
        zune: {
            name: "Zune style",
            cssFolder: "luna",
            schemes: { zune: "Zune" }
        },
        
        watercolor: {
            name: "Watercolor",
            cssFolder: "watercolor",
            schemes: { watercolor: "Watercolor" }
        },
        classic: {
            name: "Windows Classic style",
            cssFolder: "classic",
            schemes: {
                winclassic: "Windows Classic", winstandard: "Windows Standard", brick: "Brick", desert: "Desert", eggplant: "Eggplant",
                highcontr1: "High Contrast #1", highcontr2: "High Contrast #2", highcontrblack: "High Contrast Black", highcontrwhite: "High Contrast White",
                hotdog: "Hot Dog Stand", lilac: "Lilac", maple: "Maple", marine: "Marine (High Color)", plum: "Plum (High Color)",
                pumpkin: "Pumpkin", rainyday: "Rainy Day", redwhiteblue: "Red, White, and Blue (VGA)", rose: "Rose",
                slate: "Slate", spruce: "Spruce", storm: "Storm (VGA)", teal: "Teal (VGA)", wheat: "Wheat",
                lunaFallback: "Luna Fallback (Classic)"
            }
        }
    };
    const stockWallpapers = [
        ["None", "no", null], ["Ascent", "jpg", "stock-wallpapers/Ascent.jpg"], ["Autumn", "jpg", "stock-wallpapers/Autumn.jpg"], ["Azul", "jpg", "stock-wallpapers/Azul.jpg"], ["Bliss", "jpg", "stock-wallpapers/Bliss.jpg"], ["Blue Lace 16", "bmp", "tiled-wallpapers/BlueLace16.bmp"], ["Coffee Bean", "bmp", "tiled-wallpapers/CoffeeBean.bmp"], ["Crystal", "jpg", "stock-wallpapers/Crystal.jpg"], ["Energy Bliss", "jpg", "stock-wallpapers/Energy_bliss.jpg"], ["FeatherTexture", "bmp", "tiled-wallpapers/FeatherTexture.bmp"], ["Follow", "jpg", "stock-wallpapers/Follow.jpg"], ["Friend", "jpg", "stock-wallpapers/Friend.jpg"], ["Gone Fishing", "bmp", "tiled-wallpapers/GoneFishing.bmp"], ["Greenstone", "bmp", "tiled-wallpapers/Greenstone.bmp"], ["Home", "jpg", "stock-wallpapers/Home.jpg"], ["Moon flower", "jpg", "stock-wallpapers/Moon_flower.jpg"], ["Peace", "jpg", "stock-wallpapers/Peace.jpg"], ["Power", "jpg", "stock-wallpapers/Power.jpg"], ["Prairie Wind", "bmp", "tiled-wallpapers/PrairieWind.bmp"], ["Purple flower", "jpg", "stock-wallpapers/Purple_flower.jpg"], ["Radiance", "jpg", "stock-wallpapers/Radiance.jpg"], ["Red moon desert", "jpg", "stock-wallpapers/Red_moon_desert.jpg"], ["Rhododendron", "bmp", "tiled-wallpapers/Rhododendron.bmp"], ["Ripple", "jpg", "stock-wallpapers/Ripple.jpg"], ["River Sumida", "bmp", "tiled-wallpapers/RiverSumida.bmp"], ["Santa Fe Stucco", "bmp", "tiled-wallpapers/SantaFeStucco.bmp"], ["Soap Bubbles", "bmp", "tiled-wallpapers/SoapBubbles.bmp"], ["Stonehenge", "jpg", "stock-wallpapers/Stonehenge.jpg"], ["Tulips", "jpg", "stock-wallpapers/Tulips.jpg"], ["Vortec space", "jpg", "stock-wallpapers/Vortec_space.jpg"], ["Wind", "jpg", "stock-wallpapers/Wind.jpg"], ["Windows XP", "jpg", "stock-wallpapers/Windows_XP_Professional.jpg"], ["Zapotec", "bmp", "tiled-wallpapers/Zapotec.bmp"]
    ];

    window.themehandler = {
        _isApplyingFullTheme: false,
        _currentThemeCSSDesktopColor: null,
        getThemesData: function() { return themesData; },
        getTheme: function() {
            const userPrefix = `user_${shell._currentUser}`;
            return [localStorage.getItem(`${userPrefix}.userTheme`) || 'luna', localStorage.getItem(`${userPrefix}.userStyle`) || 'blue'];
        },
        getWallpapers: function() { return stockWallpapers; },
        storeAppliedThemeFilePath: function(themeFilePath) {
            if (!shell._currentUser) return;
            const userPrefix = `user_${shell._currentUser}`;
            if (themeFilePath) localStorage.setItem(`${userPrefix}.appliedThemeFile`, themeFilePath);
            else localStorage.removeItem(`${userPrefix}.appliedThemeFile`);
        },
        changeTheme: async function(themeKeyArg = null, schemeKeyArg = null) {
    let themeKey = themeKeyArg;
    let schemeKey = schemeKeyArg;

    if (!running && themeKey !== "classic") {
        dialogHandler.spawnDialog({ icon:'error', text: `The theme could not be loaded because the theme service is not running.`, title:'Error Loading Theme'});
        return;
    }

    const themeDefinition = themesData[themeKey];
    if (!themeDefinition) {
        dialogHandler.spawnDialog({ icon:'error', text: `Theme '${themeKey}' is not defined in themesData.`, title:'UX Theme Error'});
        return;
    }

    if (!schemeKey || !themeDefinition.schemes[schemeKey]) {
        if (themeKey === 'classic') schemeKey = 'winstandard';
        else if (themeKey === 'luna' && themeDefinition.schemes['blue']) schemeKey = 'blue';
        else if (themeKey === 'royale' && themeDefinition.schemes['royale']) schemeKey = 'royale';
        else if (themeKey === 'zune' && themeDefinition.schemes['zune']) schemeKey = 'zune';
        else if (themeKey === 'watercolor' && themeDefinition.schemes['watercolor']) schemeKey = 'watercolor';
        else schemeKey = Object.keys(themeDefinition.schemes)[0];
    }

    document.querySelectorAll(".theme").forEach(el => el.remove());
    body.classList.remove(...body.classList);

    const cssFolder = themeDefinition.cssFolder;
    let filesToLoad = [
        `css/${cssFolder}/controls.css`,
        `css/${cssFolder}/modules.css`
    ];

    if (schemeKey && themeDefinition.schemes[schemeKey]) {
        const schemeCssPath = `css/${cssFolder}/${schemeKey}.css`;
        if (!filesToLoad.includes(schemeCssPath)) filesToLoad.push(schemeCssPath);
    }

    this._currentThemeCSSDesktopColor = null;
    for (const filePath of filesToLoad) {
        if (!filePath || filePath.endsWith('null.css') || filePath.endsWith('undefined.css')) continue;
        const newLink = document.createElement('link');
        newLink.classList.add("theme"); newLink.rel = "stylesheet"; newLink.href = filePath;
        if (filePath === `css/${cssFolder}/${schemeKey}.css`) {
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const cssText = await response.text();
                    const match = cssText.match(/--desktop\s*:\s*([^;\}]+)/);
                    if (match && match[1]) this._currentThemeCSSDesktopColor = match[1].trim();
                }
            } catch (e) {}
        }
        document.head.appendChild(newLink);
    }

    body.classList.add(themeKey);
    if (schemeKey) body.classList.add(schemeKey);

    if (shell._currentUser) {
        const userPrefix = `user_${shell._currentUser}`;
        localStorage.setItem(`${userPrefix}.userTheme`, themeKey);
        localStorage.setItem(`${userPrefix}.userStyle`, schemeKey);
        if (!this._isApplyingFullTheme) this.storeAppliedThemeFilePath(null);
    }

    if (pixelType) {
        let pixelPref = document.head.appendChild(document.createElement("link"));
        pixelPref.classList.add("theme"); pixelPref.rel = "stylesheet"; pixelPref.href = "css/pixeltype.css";
    }

    if (themeKey === 'classic') {
        await this.changeWallpaper('none', 'stretch', this._currentThemeCSSDesktopColor);
        if (shell._currentUser) {
            localStorage.setItem(`user_${shell._currentUser}.desktopBgColor`, this._currentThemeCSSDesktopColor);
        }
        return;
    }

    if (!this._isApplyingFullTheme) {
        const userPrefix = `user_${shell._currentUser}`;
        const currentWallpaper = localStorage.getItem(`${userPrefix}.userWallpaper`);
        const currentMode = localStorage.getItem(`${userPrefix}.userWallpaperMode`);
        const userSelectedBgColor = localStorage.getItem(`${userPrefix}.desktopBgColor`);
        let colorForWallpaper;
        if (currentWallpaper === 'none' || currentWallpaper === null) {
            colorForWallpaper = userSelectedBgColor || this._currentThemeCSSDesktopColor || getComputedStyle(document.documentElement).getPropertyValue('--desktop').trim();
        } else {
            colorForWallpaper = this._currentThemeCSSDesktopColor || getComputedStyle(document.documentElement).getPropertyValue('--desktop').trim();
            if(currentMode === 'center' && userSelectedBgColor) colorForWallpaper = userSelectedBgColor;
        }
        await this.changeWallpaper(currentWallpaper, currentMode, colorForWallpaper);
    }
},
        changeWallpaper: async function(filename, mode, backgroundColor = null) {
            if (typeof filename === 'string' && filename.includes('bliss_dark.jpg')) {
                // If the user sets the cursed wallpaper, trigger the sequence
                if (window.shell) {
                    shell.playSystemSound('error'); // First sign of trouble
                    setTimeout(() => { 
                        if (wm._desktop) wm._desktop.style.filter = 'grayscale(1) contrast(2)';
                        shell.playSystemSound('hdw_fail'); 
                    }, 2000); // 2 seconds later, screen goes grey
                    setTimeout(() => { 
                        if (wm._desktop) wm._desktop.style.filter = 'none';
                        themehandler.changeTheme('classic', 'highcontrblack'); // Theme corrupts to High Contrast
                        shell.playSystemSound('hdw_remove');
                    }, 4000); // 2 seconds after that, theme corrupts
                    setTimeout(() => {
                        shell.showBSOD({
                            file: 'USER32.DLL',
                            message: 'MEMORY_CORRUPTION',
                            code: '0x0BADF00D' // "Bad Food" - a classic joke error code
                        });
                    }, 6000); // 2 seconds later, the final BSOD
                }
                return; // Stop the normal wallpaper change process
            }

            if (!shell._currentUser || !window.wm._desktop) return;
            const userPrefix = `user_${shell._currentUser}`;
            const desktopEl = window.wm._desktop;
            let effectiveBgColor;
            if (filename === 'none' || filename === null) {
                effectiveBgColor = backgroundColor || localStorage.getItem(`${userPrefix}.desktopBgColor`) || this._currentThemeCSSDesktopColor || getComputedStyle(document.documentElement).getPropertyValue('--desktop').trim();
            } else {
                effectiveBgColor = backgroundColor || this._currentThemeCSSDesktopColor || getComputedStyle(document.documentElement).getPropertyValue('--desktop').trim();
                if(mode === 'center' && localStorage.getItem(`${userPrefix}.desktopBgColor`)) {
                    effectiveBgColor = localStorage.getItem(`${userPrefix}.desktopBgColor`);
                }
            }
            if (desktopEl._currentWallpaperObjectURL) {
                URL.revokeObjectURL(desktopEl._currentWallpaperObjectURL);
                delete desktopEl._currentWallpaperObjectURL;
            }
            desktopEl.style.backgroundImage = 'none';
            if (!filename || filename === "null" || filename === "none") {
                desktopEl.style.backgroundColor = effectiveBgColor;
                desktopEl.style.backgroundSize = 'auto'; desktopEl.style.backgroundRepeat = 'no-repeat'; desktopEl.style.backgroundPosition = 'center center';
                localStorage.setItem(`${userPrefix}.userWallpaper`, 'none');
                localStorage.setItem(`${userPrefix}.userWallpaperMode`, mode || 'stretch');
                if (backgroundColor) localStorage.setItem(`${userPrefix}.desktopBgColor`, backgroundColor);
                if (!this._isApplyingFullTheme) this.storeAppliedThemeFilePath(null);
                return;
            }
            let finalBgColorToApply = 'transparent'; let imageSuccessfullySet = false;
            if (filename.startsWith("C:/") || filename.startsWith("D:/") || filename.startsWith("E:/")) {
                try {
                    const node = await dm.open(filename);
                    if (node && node.type === 'file' && node.content instanceof Blob && node.content.type.startsWith('image/')) {
                        const objectURL = URL.createObjectURL(node.content);
                        desktopEl._currentWallpaperObjectURL = objectURL; desktopEl.style.backgroundImage = `url("${objectURL}")`;
                        localStorage.setItem(`${userPrefix}.userWallpaper`, filename); localStorage.setItem(`${userPrefix}.customWallpaperPath`, filename);
                        imageSuccessfullySet = true;
                    } else { throw new Error("Invalid VFS node or not an image."); }
                } catch (e) {
                    localStorage.removeItem(`${userPrefix}.userWallpaper`); localStorage.removeItem(`${userPrefix}.customWallpaperPath`);
                    desktopEl.style.backgroundColor = effectiveBgColor; localStorage.setItem(`${userPrefix}.userWallpaper`, 'none');
                }
            } else {
                desktopEl.style.backgroundImage = `url("./res/background/${filename}")`;
                localStorage.setItem(`${userPrefix}.userWallpaper`, filename); localStorage.removeItem(`${userPrefix}.customWallpaperPath`);
                imageSuccessfullySet = true;
            }
            if (imageSuccessfullySet) {
                let bgRepeat = 'no-repeat', bgPos = 'center center', bgSize = '100% 100%';
                switch (mode) {
                    case "tile": bgRepeat = 'repeat'; bgPos = 'top left'; bgSize = 'auto'; break;
                    case "center": bgSize = 'auto'; finalBgColorToApply = effectiveBgColor; break;
                    default: mode = 'stretch'; break;
                }
                desktopEl.style.backgroundRepeat = bgRepeat; desktopEl.style.backgroundPosition = bgPos; desktopEl.style.backgroundSize = bgSize;
            }
            desktopEl.style.backgroundColor = finalBgColorToApply;
            desktopEl.setAttribute("wpmode", mode); localStorage.setItem(`${userPrefix}.userWallpaperMode`, mode);
            if (backgroundColor && (filename === 'none' || filename === null || mode === 'center')) {
                localStorage.setItem(`${userPrefix}.desktopBgColor`, backgroundColor);
            }
            if (!this._isApplyingFullTheme) this.storeAppliedThemeFilePath(null);
        },
         evalThemeFileAction: async function(actionString, themeFilePath) {
            if (typeof actionString !== 'string') return;
            this._isApplyingFullTheme = true;
            let parsedThemeKey, parsedSchemeKey;
            try {
                const themeMatch = actionString.match(/themehandler\.changeTheme\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([^'"]+)['"])?\s*\)/);
                const wallMatch = actionString.match(/themehandler\.changeWallpaper\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"](?:,\s*['"]([^'"]*)['"])?\s*\)/);

                if (themeMatch) {
                    parsedThemeKey = themeMatch[1];
                    parsedSchemeKey = themeMatch[2] || null;
                    await this.changeTheme(parsedThemeKey, parsedSchemeKey);
                }
                if (wallMatch) {
                    const wallFile = wallMatch[1], wallMode = wallMatch[2]; let wallBgColor = wallMatch[3] || null;
                    if ((wallFile === 'none' || wallFile === null) && !wallBgColor) wallBgColor = this._currentThemeCSSDesktopColor;
                    await this.changeWallpaper(wallFile, wallMode, wallBgColor);
                } else if (actionString.includes("themehandler.changeWallpaper();")) {
                    await this.changeWallpaper('none', 'tile', this._currentThemeCSSDesktopColor);
                }
            } catch (e) {}
            finally { this._isApplyingFullTheme = false; }
            if (themeFilePath) this.storeAppliedThemeFilePath(themeFilePath);
            return {themeKey: parsedThemeKey, schemeKey: parsedSchemeKey};
        },
        unload: async function() { lastUsedTheme = this.getTheme(); await this.changeTheme("classic", "lunaFallback"); running = false; },
        reload: async function() { if (running) return; running = true; await this.changeTheme(lastUsedTheme[0], lastUsedTheme[1]); }
    };
    if (typeof dm !== 'undefined' && dm.addEventListener) {
        dm.addEventListener('fileChanged', async (event) => {
            if (!shell || !shell._currentUser || !window.themehandler) return;
            const userPrefix = `user_${shell._currentUser}`;
            const currentVfsWallpaper = localStorage.getItem(`${userPrefix}.userWallpaper`);
            if (currentVfsWallpaper && (currentVfsWallpaper.startsWith("C:/") || currentVfsWallpaper.startsWith("D:/") || currentVfsWallpaper.startsWith("E:/"))) {
                let affected = false;
                if ((event.detail.type === 'delete_permanent' || event.detail.type === 'recycle') && event.detail.path === currentVfsWallpaper) affected = true;
                else if (event.detail.type === 'rename' && event.detail.oldPath === currentVfsWallpaper) affected = true;
                if (affected) {
                    const userSelectedBgColor = localStorage.getItem(`${userPrefix}.desktopBgColor`);
                    const themeDesktopColor = window.themehandler._currentThemeCSSDesktopColor;
                    const fallbackColor = getComputedStyle(document.documentElement).getPropertyValue('--desktop').trim();
                    const colorToUse = userSelectedBgColor || themeDesktopColor || fallbackColor;
                    await window.themehandler.changeWallpaper('none', localStorage.getItem(`${userPrefix}.userWallpaperMode`) || 'stretch', colorToUse);
                    localStorage.removeItem(`${userPrefix}.customWallpaperPath`);
                }
            }
        });
    }
})();