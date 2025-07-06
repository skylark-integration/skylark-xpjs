const screensaverRegistry = {
    'winxp': {
        name: 'Windows XP',
        type: 'internal-image',
        path: 'res/ui/screensave.png'
    },
    '3d-pipes': {
        name: '3D Pipes',
        type: 'iframe',
        path: 'res/screensavers/pipes/index.html'
    },
    'blank': {
        name: 'Blank',
        type: 'blank',
        path: null
    }
};

let inactivityTimestamp = Date.now();
let autoStartTimer = null;
let activeScreensaverContainer = null;
let isPreviewing = false;
let mainAnimationLoop = null;
let mediaCheckInterval = null;

function handleUserActivity() {
    inactivityTimestamp = Date.now();
    if (activeScreensaverContainer) {
        stopScreensaver();
    }
    resetAutoStartTimer();
}

function getSettings() {
    const user = window.shell?._currentUser || 'default';
    const settings = {
        delay: parseInt(localStorage.getItem(`user_${user}.screensaverDelay`) || '600000', 10), // Default to 600000ms (10 minutes)
        onresume: localStorage.getItem(`user_${user}.screensaverOnResumeLogon`) === 'true',
        type: localStorage.getItem(`user_${user}.screensaverType`) || 'winxp',
        disabled: localStorage.getItem(`user_${user}.screensaverType`) === 'none'
    };
    if (isNaN(settings.delay) || settings.delay < 5000) settings.delay = 600000; // Failsafe to 10 minutes
    return settings;
}

function resetAutoStartTimer() {
    const settings = getSettings();
    if (settings.disabled) {
        clearTimeout(autoStartTimer);
        return;
    }
    clearTimeout(autoStartTimer);
    autoStartTimer = setTimeout(startScreensaverIfNeeded, settings.delay);
}

function isMediaPlaying() {
    const mediaElements = document.querySelectorAll('video, audio');
    for (const media of mediaElements) {
        if (!media.paused && !media.ended && media.currentTime > 0) {
            return true;
        }
    }
    return false;
}

function startScreensaverIfNeeded() {
    const settings = getSettings();
    if (settings.disabled || activeScreensaverContainer) return;

    if (isMediaPlaying()) {
        inactivityTimestamp = Date.now();
        resetAutoStartTimer();
        return;
    }

    if (Date.now() - inactivityTimestamp >= settings.delay) {
        _startScreensaverInternal(settings.type, false);
    }
}

function _startScreensaverInternal(typeKey, isManualPreview) {
    if (activeScreensaverContainer) return;
    isPreviewing = isManualPreview;

    const definition = screensaverRegistry[typeKey] || screensaverRegistry['blank'];
    const sceneHolder = document.querySelector("scene_holder");
    if (!sceneHolder) return;

    activeScreensaverContainer = document.createElement('div');
    activeScreensaverContainer.id = 'screensaver-active-container';
    activeScreensaverContainer.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; z-index:9999998; background:black;';

    let screensaverElement;

    if (definition.type === 'iframe') {
        screensaverElement = document.createElement('iframe');
        screensaverElement.src = `${definition.path}#${encodeURIComponent(JSON.stringify({hideUI: true}))}`;
        screensaverElement.style.cssText = 'width:100%; height:100%; border:none;';
        activeScreensaverContainer.appendChild(screensaverElement);
    } else if (definition.type === 'internal-image') {
        screensaverElement = document.createElement('div');
        screensaverElement.style.cssText = 'width:100%; height:100%; background:black; overflow:hidden;';
        const img = document.createElement('img');
        img.src = definition.path;
        img.style.position = 'absolute';
        screensaverElement.appendChild(img);
        startInternalImageAnimation(img);
        activeScreensaverContainer.appendChild(screensaverElement);
    }
    
    const inputOverlay = document.createElement('div');
    inputOverlay.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; z-index:1; background:transparent; cursor:none;';
    activeScreensaverContainer.appendChild(inputOverlay);
    
    sceneHolder.appendChild(activeScreensaverContainer);
    clearTimeout(autoStartTimer);
}

function stopScreensaver() {
    if (!activeScreensaverContainer) return;
    
    if (mainAnimationLoop) {
        clearInterval(mainAnimationLoop);
        mainAnimationLoop = null;
    }

    const settings = getSettings();
    
    if (activeScreensaverContainer.parentElement) {
        activeScreensaverContainer.remove();
    }
    activeScreensaverContainer = null;
    
    if (settings.onresume && !isPreviewing && window.shell) {
        shell.switchLogon(false);
    }
    
    isPreviewing = false;
    resetAutoStartTimer();
}

function startInternalImageAnimation(imgElement) {
    const moveImage = () => {
        if (!imgElement || !imgElement.closest('#screensaver-active-container')) {
            clearInterval(mainAnimationLoop);
            mainAnimationLoop = null;
            return;
        }
        const container = imgElement.parentElement.parentElement;
        const containerRect = container.getBoundingClientRect();
        const imgWidth = 275;
        const imgHeight = 174;
        const maxLeft = containerRect.width - imgWidth;
        const maxTop = containerRect.height - imgHeight;

        const newLeft = Math.max(0, Math.floor(Math.random() * maxLeft));
        const newTop = Math.max(0, Math.floor(Math.random() * maxTop));

        imgElement.style.left = `${newLeft}px`;
        imgElement.style.top = `${newTop}px`;
    };
    
    imgElement.style.transition = 'none';

    moveImage();
    if (mainAnimationLoop) clearInterval(mainAnimationLoop);
    mainAnimationLoop = setInterval(moveImage, 5000);
}

window.shell.startScreensaverPreview = function() {
    if (activeScreensaverContainer) stopScreensaver();
    
    const deskCpl = document.querySelector('app.desk-cpl');
    let typeToPreview = getSettings().type;
    if (deskCpl) {
        const selector = deskCpl.querySelector('#selectScreensaver');
        if (selector) {
            typeToPreview = selector.value;
        }
    }

    if (typeToPreview && typeToPreview !== 'none') {
        setTimeout(() => _startScreensaverInternal(typeToPreview, true), 50);
    }
};

function initializeScreensaver() {
    const sceneHolder = document.querySelector("scene_holder");
    if (!sceneHolder) {
        console.error("Scrsave: scene_holder not found during initialization.");
        return;
    }
    
    sceneHolder.removeEventListener("pointermove", handleUserActivity);
    sceneHolder.removeEventListener("keydown", handleUserActivity);
    sceneHolder.removeEventListener("click", handleUserActivity);

    sceneHolder.addEventListener("pointermove", handleUserActivity, { capture: true });
    sceneHolder.addEventListener("keydown", handleUserActivity, { capture: true });
    sceneHolder.addEventListener("click", handleUserActivity, { capture: true });
    
    if (mediaCheckInterval) clearInterval(mediaCheckInterval);
    mediaCheckInterval = setInterval(() => {
        if (isMediaPlaying()) {
            inactivityTimestamp = Date.now();
        }
    }, 5000);

    resetAutoStartTimer();
}

window.initializeScreensaver = initializeScreensaver;