(function () {
    const windowTemplate = `
        <appcontentholder class="msoobe">
            <audio loop id="oobemus" src="./res/audio/title.mp3" autoplay="autoplay"></audio>
            <video id="splash" src="./res/anim/intro.mp4" type="video/mp4" autoplay="autoplay" muted></video>
            <div id="oobecontain" style="visibility: hidden;">
                <div id="oobeheader"><img src="./res/ui/about-logo.png"></div>
                <div class="oobestep active">
                    <h1>Welcome to Microsoft Windows</h1>
                    <p>Thank you for trying out Microsoft Windows XP.<br><br>Let's spend a few minutes setting up your computer.</p>
                </div>
                <div class="oobestep" id="eulastep">
                    <h1>The Endless Useless License Agreement</h1>
                    <p>The Endless Useless License Agreement (EULA) outlines your totally-not-legal rights for using Windows XP.<br><br>Click "accept" to dive into XP nostalgia (or don't, we're not your modem tech).</p>
                    <div id="eula_scroll">
                        <textarea id="eula" readonly>
Microsoft Windows XP (aka Reborn XP)
ENDLESS USELESS LICENSE AGREEMENT

SCROLL PAST THIS (OR NOT): This Endless Useless License Agreement ("EULA") is as legit as a 2003 pop-up promising a free iPod. It’s a goofy homage to the era of clunky taskbars and CRT scanlines, slapped together by yours only, Quenq.com (hey there!). Real EULAs are legal naps that dodge blame if your PC eats your homework. This is just retro giggles.

Windows XP is a nostalgia trip, not a courtroom drama. We don’t own the slick XP interface, those *ding* system sounds, or that chunky Start menu—those are Microsoft’s. We’re just remixing them for fun under “Fair Use” for this entertainment project. If your virtual XP pulls a bluescreen, just reboot and soak in the 2000s magic. We take no warranty.

By clicking “accept,” you’re down to:
- Relive the XP glory days.
- Tweak your virtual desktop vibes.
- Not take this seriously, like, ever.

Thanks for jumping into Windows XP! Do check out our Discord!

SECTION 1: DEFINITIONS
"You" refers to whoever double-clicked setup.exe despite three warnings.
"We" / "Us" means Quenq.com, operating on caffeine and vague nostalgia.
"Software" means this glorious memory emulator of spinning hourglasses and unhelpful tooltips.
"XP" means “eXPerience,” not “Extra Problems” (though we can’t guarantee that).
"Endless" means we wrote too much and couldn’t stop.

SECTION 2: GRANT OF NONSENSE LICENSE
You are hereby granted a limited, non-exclusive, non-sensical, non-serious right to:
- Install this software onto any machine that still somehow has a VGA port.
- Run it until the system crashes, and consider that part of the fun.
- Pretend it’s 2002 and your problems include errors & viruses.

You are NOT granted any rights to:
- Use this for mission-critical computing (unless your mission is to play Pinball).
- Complain if the taskbar glitches out in protest.
- Claim this software is "productive" in any capacity.

SECTION 3: SYSTEM REQUIREMENTS (EMOTIONAL & OTHERWISE)
Minimum Requirements:
- Pentium 4 (or imagination)
- 256MB RAM and a dream
- One (1) mouse with at least one (1) working button
- A fondness for Windows startup sounds

Recommended:
- A desire to relive 800x600 resolution
- A CRT monitor (optional, but spiritually important; though We provide a CRT filter if you have a flat screen)
- That weird clicking noise your old PC used to make

SECTION 4: INSTALLATION RITUALS
Installing this software requires:
1. Clicking “Next” at least six times without reading.
2. Ignoring all warnings from your modern antivirus.
3. Mentally preparing for clashing color schemes.

SECTION 5: LICENSE TERM
This agreement begins the moment you boot into Reborn XP and ends:
- When your nostalgia wears off.
- When your virtual machine explodes.
- When you finally admit XP was never really *that* stable.

SECTION 6: LIMITATIONS OF LIABILITY & GOOD TASTE
We are not responsible for:
- Data loss, time loss, or loss of self while customizing the Bliss wallpaper.
- Unexpected emotional responses to the startup sound.
- The urge to install Winamp skins or play Solitaire for hours.

If you experience symptoms such as goosebumps, deep sighs, or the urge to install Winamp skins, discontinue use only if you’re weak.

SECTION 7: TECHNICAL (NON)SUPPORT
If something breaks, try:
- Turning it off and back on again.
- Screaming internally.
- Posting about it on a dead forum from 2006.
- Contacting us via fax (just kidding, we don’t check that).
If you need help, we recommend:
- Joining our Discord server for support from fellow XP enthusiasts.
https://dsc.gg/quenq

SECTION 8: PROHIBITED USES
You agree NOT to:
- Call this "Windows" in front of lawyers.
- Run modern games on it and act surprised when it doesn’t work.
- Replace the Bliss wallpaper with something “aesthetic.”

Doing any of the above voids your imaginary license and earns you a popup telling you to "try again later."

SECTION 9: FEATURES (REAL & IMAGINED)
This software may include:
- 3D Pinball: Space Cadet
- A calculator with large buttons for serious math
- Internet Explorer 6 (for legally unsafe browsing)
- 11,000 unused fonts
- The ability to open "My Computer" and feel important

SECTION 10: ENDLESS SCROLL CLAUSE
By continuing to scroll, you agree that:
- You have no idea why you’re still reading this.
- You probably miss MSN Messenger.
- You understand this agreement might never end.

SECTION 11: USER OBLIGATIONS YOU WILL IGNORE
- Do not rename “My Documents” to “Just Documents.”
- Keep system tray clutter above 90% for full authenticity.
- Refer to folders as “directories” in public.

SECTION 12: FILE EXTENSION ETHICS
You agree to:
- Respect .bmp files.
- Never double-click a .exe file unless you live dangerously.
- Open .txt files with Notepad, no matter how ugly the font.

Violation of this section may lead to full-screen WordArt penalties.

SECTION 13: RETRO JURISDICTION
This agreement is governed by:
- The Supreme Court of GeoCities
- The Laws of LAN Parties (1999 revision)
- Quenq's Discord Server Rules (which you should read, but probably won’t)

SECTION 14: WINAMP WORSHIP GUIDELINES
Winamp must be honored at least once per session. You may:
- Use it to listen to a .midi file.
- Configure all skins to be pixelated and garish.
- Insist that the only valid way to listen to music is with Winamp.

SECTION 15: ADDITIONAL NOTES
You agree not to:
- Ask if this is “the real Windows XP.”
- Try to make it more "modern" by installing anything newer than IE 6.
- Disable the Startup Sound (you must hear it once a day for the sake of nostalgia).

SECTION 16: THE BACKGROUND MUSIC CLAUSE
Upon installation, your system will randomly play one of the following:
- The Windows XP Welcome Music (title.wma).
- The Windows XP Startup Sound.
- The classic Windows error "ding."
- One (1) midi version of "The Final Countdown."
- A Microsoft "Welcome" message jingle that plays every 5th system boot.

Any attempt to remove or modify the above will result in a continuous loop of Windows startup sounds until your system is rebooted.

SECTION 17: SYSTEM THEME EXPECTATIONS
The Reborn XP theme must:
- Be set to the default "Bliss" wallpaper (with rolling green hills).
- Include a Start Menu that takes 5 clicks to open anything.
- Feature a taskbar with icons so small, they can barely be seen.

You agree that changing these settings is a direct violation of the XP spirit and may result in serious personal consequences.

SECTION 18: PROLIFIC BLOATWARE
The following software comes bundled with the Reborn XP package:
- Viruses
- A free trial of Winamp (good luck).
- One (1) copy of MSN Messenger (which you should *not* attempt to use).

This bloatware may not be removed without causing Windows XP to become emotionally unstable.

SECTION 19: REMAINING CLAUSES
This document will continue endlessly and without purpose until such time as you decide to leave the planet or engage in real work. We encourage you to leave the office, pour a cup of coffee, and appreciate the chaos that is the early 2000s operating system.
                        </textarea>
                    </div>
                    <p>Do you accept the terms of the EULA?</p>
                    <form>
                        <li><label for="eulayes">Yes, I accept<input type="radio" name="fakeeula" id="eulayes" checked><winradio></winradio></label></li>
                        <li><label for="eulano">No, I don't accept<input type="radio" name="fakeeula" id="eulano"><winradio></winradio></label></li>
                    </form>
                </div>
                <div class="oobestep auto" id="internet">
                    <h1>Checking your Internet connectivity</h1>
                    <p>Please wait for a moment while Windows XP simulates checking for an already active internet connection.</p>
                    <img src=./res/ui/oobe/dialup.gif>
                </div>
                <div class="oobestep" id="goodiescd">
                    <h1>Add Goodies CD Drive?</h1>
                    <p>This option will create a virtual CD Drive (E:) containing extra music, videos, pictures, and some fun stuff (easter eggs too).<br><br><strong>Note:</strong> If you choose 'Yes', copying these files may take 1-2 minutes after setup, depending on your internet connection. Please be patient and do not close the tab during this process. You will regret if you don't add the CD Drive, as it contains some of the best content from the early 2000s.</p>
                    <br><br>
                    <form>
                        <li><img src="./res/ui/oobe/greenshd.gif"><label for="cdyes">Yes, add the Goodies CD Drive!<input type="radio" name="addCdGoodies" id="cdyes" value="true" checked><winradio></winradio></label></li>
                        <li><img src="./res/ui/oobe/redshd.gif"><label for="cdno">No thanks, I'll regret this later.<input type="radio" name="addCdGoodies" id="cdno" value="false"><winradio></winradio></label></li>
                    </form>
                </div>
                <div class="oobestep" id="users">
                    <h1>Who will use this computer?</h1>
                    <p>Type the name of each person who will use this computer. Windows XP will create a separate user account for each person so you can personalize the way you want Windows XP to organize and display information, protect your files and computer settings, and customize the desktop.</p>
                    <br>
                    <form>
                        <ul id="oobe-user-list">
                            <li>Your name: <input type="text" name="username" value="Administrator" placeholder="User 1"></li>
                            <li>2nd User: <input type="text" name="username" value="Guest" placeholder="User 2 (optional)"></li>
                            <li>3rd User: <input type="text" name="username" placeholder="User 3 (optional)"></li>
                            <li>4th User: <input type="text" name="username" placeholder="User 4 (optional)"></li>
                            <li>5th User: <input type="text" name="username" placeholder="User 5 (optional)"></li>
                        </ul>
                    </form>
                    <div id="oobe-user-error-message" style="color: #bf0000; font-weight: bold; margin-top: 10px; min-height: 1.2em;"></div>
                    <p style="margin-top: 10px;">These usernames will appear on the Welcome screen in alphabetical order. When you start Windows XP, simply click your name on the Welcome screen to begin. If you want to customize profiles, or add more user accounts after you finish setting up Windows, just click <strong>Control Panel</strong> on the <strong>Start</strong> menu, and then click <strong>User Accounts</strong>.</p>
                </div>
                <div class="oobestep">
                    <h1>Thank you!</h1>
                    <p>Congratulations, you're ready to go! Here's what you just accomplished:</p>
                    <br><br>
                    <p id="oobe-final-status">To learn about the exciting features of Windows XP, take the product tour. You can also find useful information in the <strong>Help and About</strong> Center. These options are located on the <strong>Start</strong> menu.</p>
                </div>
                <div id="oobefooter">
                    <li id="back" class="disabled"><div class="btn"></div>Back</li>
                    <li id="next">Next<div class="btn"></div></li>
                </div>
            </div>
        </appcontentholder>
    `;
    var oobeindex = 0;
    const availablePfps = [
        'airplane.bmp', 'astronaut.bmp', 'ball.bmp', 'beach.bmp', 'butterfly.bmp',
        'car.bmp', 'cat.bmp', 'chess.bmp', 'dirt_bike.bmp', 'dog.bmp', 'drip.bmp',
        'duck.bmp', 'fish.bmp', 'frog.bmp', 'guitar.bmp', 'horses.bmp',
        'kick.bmp', 'lift-off.bmp', 'palm_tree.bmp', 'pink_flower.bmp',
        'red_flower.bmp', 'skater.bmp', 'snowflake.bmp'
    ];
    let usedPfps = [];
    let isFinishing = false;

    function getRandomPfp(username) {
        if (username.toLowerCase() === 'administrator') return 'chess.bmp';
        if (username.toLowerCase() === 'guest') return 'guest.bmp';
        if (usedPfps.length === availablePfps.length) usedPfps = [];
        let pfp;
        do {
            pfp = availablePfps[Math.floor(Math.random() * availablePfps.length)];
        } while (usedPfps.includes(pfp));
        usedPfps.push(pfp);
        return pfp;
    }

    function isValidUsername(username) {
        if (!username || username.length === 0 || username.length > 32) return "Username must be between 1 and 32 characters.";
        const invalidChars = /[\\\/:\*\?"<>\|]/;
        if (invalidChars.test(username)) return "Username contains invalid characters.";
        if (username.trim() !== username) return "Username cannot start or end with a space.";
        const reservedNames = ["con", "prn", "aux", "nul", "com1", "com2", "com3", "com4", "com5", "com6", "com7", "com8", "com9", "lpt1", "lpt2", "lpt3", "lpt4", "lpt5", "lpt6", "lpt7", "lpt8", "lpt9", ".", "..", "Default User"];
        if (reservedNames.includes(username.toLowerCase())) return `"${username}" is a reserved system name.`;
        return true;
    }

    let advancePage = async function (selfWindow, oobepages, oobecontain_ref, inverse = false) {
        if (isFinishing) return;

        const nextButton = selfWindow.querySelector("#next");
        const backButton = selfWindow.querySelector("#back");
        const oobeFooter = selfWindow.querySelector("#oobefooter");

        const internetStepIndex = oobepages.findIndex(p => p.id === 'internet');
        if (!inverse && oobeindex === internetStepIndex - 1) {
            oobepages[oobeindex].classList.remove("active");
            oobeindex = internetStepIndex;
            oobepages[oobeindex].classList.add("active");
            await new Promise(resolve => setTimeout(resolve, 4000));
            await advancePage(selfWindow, oobepages, oobecontain_ref, false);
            return;
        }

        if (oobeindex === oobepages.length - 1 && !inverse) {
            isFinishing = true;
            nextButton.classList.add("disabled");
            backButton.classList.add("disabled");

            if (oobeFooter) oobeFooter.style.display = 'none';
            selfWindow.style.display = 'none';

            const userInputs = oobecontain_ref.querySelectorAll('#oobe-user-list input[name="username"]');
            const usersToCreate = [];
            for (const input of userInputs) {
                const username = input.value.trim();
                if (username) {
                    usersToCreate.push({
                        username: username, pfp: `res/users/${getRandomPfp(username)}`, theme: 'luna', style: 'blue',
                        wallpaper: 'stock-wallpapers/Bliss.jpg', wpMode: 'stretch'
                    });
                }
            }

            const updateScreen = document.querySelector('scene_updatescreen_xp');
            const updateText = updateScreen.querySelector('#update-xp-text');
            if (updateScreen) updateScreen.classList.add('active');

            try {
                localStorage.setItem('oobepassed', 'false');

                if (updateText) updateText.textContent = "Installing system files... 0%";
                const cDriveProgressListener = (event) => {
                    const { completed, total } = event.detail;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 100;
                    if (updateText) updateText.textContent = `Installing system files... ${percentage}%`;
                };
                dm.addEventListener('vfs:progress', cDriveProgressListener);
                await window.dm.populateCoreSystemDrive(true);
                dm.removeEventListener('vfs:progress', cDriveProgressListener);

                const goodiesCdChoice = oobecontain_ref.querySelector('input[name="addCdGoodies"]:checked').value === "true";
                if (goodiesCdChoice) {
                    if (updateText) updateText.textContent = "Copying additional files... 0%";
                    const eDriveProgressListener = (event) => {
                        const { completed, total } = event.detail;
                        const percentage = total > 0 ? Math.round((completed / total) * 100) : 100;
                        if (updateText) updateText.textContent = `Copying additional files... ${percentage}%`;
                    };
                    dm.addEventListener('vfs:progress-e', eDriveProgressListener);
                    await window.dm.populateEDriveFromJSON(true);
                    dm.removeEventListener('vfs:progress-e', eDriveProgressListener);
                }

                const currentClientVersion = window.APP_VERSION || "0.0.0";
                localStorage.setItem('cDriveSystemVersion', currentClientVersion);
                if (goodiesCdChoice) {
                    localStorage.setItem('eDriveVersion', currentClientVersion);
                }
                localStorage.setItem('lastKnownAppVersion', currentClientVersion);
                localStorage.setItem("addCdGoodies", goodiesCdChoice.toString());

                await window.shell.setupUserProfilesVFS(usersToCreate);
                localStorage.setItem('users', JSON.stringify(usersToCreate));
                usedPfps = [];
                localStorage.setItem("oobepassed", "true");

                if (updateScreen) updateScreen.classList.remove('active');
                await window.shell.populateLogonScreen();
                window.shell._logon.style.display = "grid";
                wm.closeWindow(selfWindow.id);

            } catch (error) {
                if (updateScreen) updateScreen.classList.remove('active');
                if (oobeFooter) oobeFooter.style.display = 'flex';
                selfWindow.style.display = '';
                nextButton.classList.remove("disabled");
                backButton.classList.remove("disabled");
                isFinishing = false;
                localStorage.removeItem('oobepassed');
                alert(`A critical error occurred during setup: ${error.message}. Please reload the page and try again.`);
            }
            return;
        }

        oobepages[oobeindex].classList.remove("active");
        if (!inverse) { oobeindex += 1; } else { oobeindex -= 1; }
        if (oobeindex < 0) oobeindex = 0;
        if (oobeindex >= oobepages.length) oobeindex = oobepages.length - 1;
        oobepages[oobeindex].classList.add("active");
        backButton.classList.toggle("disabled", oobeindex <= 0);
        nextButton.innerHTML = (oobeindex === oobepages.length - 1) ? `Finish<div class="btn"></div>` : `Next<div class="btn"></div>`;
        const currentPageIsUsers = oobepages[oobeindex].id === 'users';
        const eulaYes = oobecontain_ref.querySelector("#eulayes");
        if (oobepages[oobeindex].id === "eulastep" && eulaYes && !eulaYes.checked) {
            nextButton.classList.add("disabled");
        } else if (currentPageIsUsers) {
            validateUserInputs(selfWindow);
        } else {
            nextButton.classList.remove("disabled");
        }
    };

    function validateUserInputs(selfWindow) {
        const userInputs = selfWindow.querySelectorAll('#oobe-user-list input[name="username"]');
        const errorMessageDiv = selfWindow.querySelector('#oobe-user-error-message');
        const nextButton = selfWindow.querySelector("#next");
        const enteredUsernames = new Set();
        let allValid = true;
        let errorMessage = "";

        const usernames = Array.from(userInputs).map(input => input.value.trim()).filter(Boolean);

        if (usernames.length === 0) {
            errorMessage = "Please enter a name for at least one user.";
            allValid = false;
        } else {
            for (const input of userInputs) {
                const username = input.value.trim();
                input.style.borderColor = "";
                if (username) {
                    const validationResult = isValidUsername(username);
                    if (validationResult !== true) {
                        errorMessage = validationResult;
                        input.style.borderColor = "#bf0000";
                        allValid = false;
                        break;
                    }
                    if (enteredUsernames.has(username.toLowerCase())) {
                        errorMessage = `The name "${username}" is already in use.`;
                        input.style.borderColor = "#bf0000";
                        allValid = false;
                        break;
                    }
                    enteredUsernames.add(username.toLowerCase());
                }
            }
        }

        errorMessageDiv.textContent = errorMessage;
        nextButton.classList.toggle("disabled", !allValid);
    }

    registerApp({
        _template: null,
        setup: async function () {
            oobeindex = 0;
            isFinishing = false; // Reset the lock on app setup
            this._template = document.createElement("template");
            this._template.innerHTML = windowTemplate;
        },
        start: function () {
            if (localStorage.getItem("oobepassed")) {
                if (window.shell && typeof window.shell.populateLogonScreen === 'function') {
                    window.shell.populateLogonScreen();
                }
                if (window.shell && typeof window.shell.runOobe === 'function') {
                    window.shell.runOobe();
                }
                return;
            }
            oobeindex = 0;
            isFinishing = false; // Reset lock every time the app starts

            var windowContents = this._template.content.firstElementChild.cloneNode(true);
            var hWnd = wm.createNewWindow("msoobe", windowContents);
            var selfWindow = wm._windows[hWnd];
            var oobecontain_ref = selfWindow.querySelector("#oobecontain");
            let oobepages = [...selfWindow.querySelectorAll(".oobestep")];

            const splashVideo = selfWindow.querySelector("#splash");
            const oobeAudio = selfWindow.querySelector("#oobemus");

            if (oobeAudio) {
                oobeAudio.play().catch(e => console.warn("OOBE audio autoplay might have been blocked by the browser."));
            }

            const showOobeContent = () => {
                splashVideo.style.display = 'none';
                oobecontain_ref.style.visibility = 'visible';
            };

            splashVideo.onended = showOobeContent;

            selfWindow.querySelector("#back").classList.add("disabled");

            if (oobepages[0].id === "eulastep" || oobepages[0].classList.contains("mandatory")) {
                const eulaYes = oobecontain_ref.querySelector("#eulayes");
                if (eulaYes && !eulaYes.checked) {
                    selfWindow.querySelector("#next").classList.add("disabled");
                } else {
                    selfWindow.querySelector("#next").classList.remove("disabled");
                }
            }

            let nextstep = selfWindow.querySelector("#next");
            nextstep.addEventListener("click", async e => {
                if (nextstep.classList.contains("disabled")) return;
                try {
                    await advancePage(selfWindow, oobepages, oobecontain_ref);
                } catch (error) { }
            });

            let prevstep = selfWindow.querySelector("#back");
            prevstep.addEventListener("click", async e => {
                if (prevstep.classList.contains("disabled")) return;
                await advancePage(selfWindow, oobepages, oobecontain_ref, true);
            });

            let eularadio_yes = selfWindow.querySelector("#eulayes");
            let eularadio_no = selfWindow.querySelector("#eulano");
            function toggleAdvancementBasedOnEULA() {
                const currentPageIsEula = oobepages[oobeindex] && oobepages[oobeindex].id === "eulastep";
                if (currentPageIsEula) {
                    if (eularadio_no.checked) {
                        nextstep.classList.add("disabled");
                    } else if (eularadio_yes.checked) {
                        nextstep.classList.remove("disabled");
                    }
                }
            }

            if (eularadio_yes && eularadio_no) {
                eularadio_yes.addEventListener("change", toggleAdvancementBasedOnEULA);
                eularadio_no.addEventListener("change", toggleAdvancementBasedOnEULA);
                if (oobepages[oobeindex] && oobepages[oobeindex].id === "eulastep") {
                    toggleAdvancementBasedOnEULA();
                }
            }

            const userInputs = selfWindow.querySelectorAll('#oobe-user-list input[name="username"]');
            userInputs.forEach(input => {
                input.addEventListener('input', () => validateUserInputs(selfWindow));
            });
            validateUserInputs(selfWindow);

            wm.removeIcon(hWnd);
            wm.setCaption(hWnd, "");
            wm.setSize(hWnd, "fullscreen");
            selfWindow.classList.add("noclose");
            return hWnd;
        }
    })
})();