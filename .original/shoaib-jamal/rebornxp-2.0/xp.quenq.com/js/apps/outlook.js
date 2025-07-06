(function() {
    const emailData = {
        email1: { from: 'Alex Carter <alex.carter@timetraveler.net>', subject: 'Reborn XP is Peak 2002 Vibes!', date: 'Dec 15, 2025', body: 'Yo! I’m messing around with Quenq.com’s Windows XP simulator, Reborn XP, in 2025, and it’s like I’m back in 2002! The CRT filter, that dial-up screech, and Outlook Express; it’s pure nostalgia. Feels like I’m chatting on MSN or hunting for MP3s on Kazaa. You gotta check this out! <br><br>- Alex' },
        email2: { from: 'Quensoft <support@quensoft.com>', subject: 'Welcome to Outlook Express', date: 'Dec 14, 2002', body: 'Welcome to Outlook Express! Enjoy the best email experience with Windows XP. Features include multiple accounts, HTML emails, and an address book. Get started today! <br><br>Best,<br>The Quenq Team' },
        email3: { from: 'Earthlink Support <support@earthlink.net>', subject: 'December Newsletter', date: 'Dec 13, 2002', body: 'Our latest Earthlink Newsletter is here! Check out holiday dial-up deals, XP tips, and community forums. Visit earthlink.net for more. <br><br>- Earthlink Team' },
        email4: { from: 'Doug Muder <doug@muder.com>', subject: 'Catch Up Soon?', date: 'Dec 12, 2002', body: 'Hey! Been a minute. Outlook Express is cool, but I’m drowning in chain emails—you see that one about free Xboxes? 😅 Wanna grab coffee at Starbucks this weekend? <br><br>- Doug' },
        email5: { from: 'Sarah Lee <sarah.lee@email.com>', subject: 'Retro Y2K Party Invite', date: 'Dec 11, 2002', body: 'Yo! Y2K was a flop, but I’m hosting a retro Y2K party this Saturday! Silver clothes, glow sticks, and a *NSYNC-heavy playlist. Bringing my PS2 for some Tekken. You in? <br><br>- Sarah' },
        email6: { from: 'Jenna Brooks <jenna.brooks@aol.com>', subject: 'AIM Tonight?', date: 'Dec 10, 2002', body: 'Hey! Free tonight? Let’s hit up AOL Instant Messenger around 9 PM. Been craving a nostalgia chat—maybe plan a winter break road trip? Lemme know! <br><br>- Jenna' },
        email7: { from: 'Netscape Support <support@netscape.net>', subject: 'Netscape 7.0 is Here!', date: 'Dec 9, 2002', body: 'Upgrade to Netscape 7.0 for a faster, smoother web experience. Better email support and pop-up blocking included. Download at netscape.com! <br><br>- Netscape Team' },
        email8: { from: 'Mike Thompson <mike.thompson@yahoo.com>', subject: 'Kazaa vs. LimeWire?', date: 'Dec 8, 2002', body: 'Dude, Napster’s gone, and I’m torn between Kazaa and LimeWire for music. Kazaa’s got more songs, but LimeWire feels faster. What you using? Hit me up! <br><br>- Mike' },
        email9: { from: 'Lisa Wong <lisa.wong@hotmail.com>', subject: 'My Geocities Page Rules!', date: 'Dec 7, 2002', body: 'Just dropped my new Geocities site! Got spinning GIFs, a guestbook, and a MIDI of “Sweet Child O’ Mine.” Visit geocities.com/lisawong2002 and sign the guestbook! <br><br>- Lisa' },
        email10: { from: 'Tom Harris <tom.harris@msn.com>', subject: 'LAN Party This Weekend', date: 'Dec 6, 2002', body: 'Yo! Hosting a LAN party Saturday. Quake III and Counter-Strike all night. Bring your rig and some Mountain Dew. You down? Reply with your ICQ if you’re coming. <br><br>- Tom' },
        email11: { from: 'Rachel Kim <rachel.kim@aol.com>', subject: 'FWD: Good Luck Chain!', date: 'Dec 5, 2002', body: 'Okay, I know chain emails are dumb, but this one promises good luck if you forward to 10 people. I’m not risking bad vibes! 😜 Pass it on! <br><br>- Rachel' },
        email12: { from: 'Chris Patel <chris.patel@compuserve.com>', subject: 'New XP Theme?', date: 'Dec 4, 2002', body: 'Hey! Found a dope Windows XP theme that makes it look like Windows 95. Kinda retro but clean. Want me to send you the file? Also, you still on ICQ? <br><br>- Chris' },
        email13: { from: 'Emily Chen <emily.chen@yahoo.com>', subject: 'Holiday Mixtape Plans', date: 'Dec 3, 2002', body: 'Yo! I’m burning a holiday mixtape CD—thinking some Blink-182, OutKast, and maybe Avril Lavigne. Got any song recs? Also, wanna swap CDs at the mall? <br><br>- Emily' },
        email14: { from: 'Brian Lee <brian.lee@hotmail.com>', subject: 'Dial-Up Keeps Dropping!', date: 'Dec 2, 2002', body: 'Ugh, my dial-up keeps disconnecting every 20 minutes. AOL’s driving me nuts. You got any tricks to stay online longer? Need to finish downloading this game! <br><br>- Brian' },
        email15: { from: 'Kelly Nguyen <kelly.nguyen@aol.com>', subject: 'Harry Potter Game Night', date: 'Dec 1, 2002', body: 'Hey! Got the new Harry Potter PC game, and it’s awesome. Wanna come over Friday for a game night? We can also play some Sims. Lemme know! <br><br>- Kelly' },
        email16: { from: 'Mark Davis <mark.davis@msn.com>', subject: 'LOTR Two Towers Hype!', date: 'Dec 1, 2002', body: 'Dude, Lord of the Rings: The Two Towers is out soon! Planning to hit the theater opening night. You wanna join? Also, found a sick LOTR fan site on Geocities. <br><br>- Mark' },
        email17: { from: 'Tina Rodriguez <tina.rodriguez@yahoo.com>', subject: 'WebTV Anyone?', date: 'Dec 2, 2002', body: 'Hey! My cousin got a WebTV, and it’s kinda cool but super slow. You ever tried one? Thinking of sticking to my PC for surfing. What’s your setup like? <br><br>- Tina' },
        email18: { from: 'Greg Wilson <greg.wilson@earthlink.net>', subject: 'Winamp Skins Galore', date: 'Dec 3, 2002', body: 'Yo! Found a site with hundreds of Winamp skins. Got one that looks like a retro boombox. Want me to send you some? Also, you going to the LAN party? <br><br>- Greg' },
        email19: { from: 'Amanda Brooks <amanda.brooks@hotmail.com>', subject: 'Petz 4 Tournament?', date: 'Dec 4, 2002', body: 'Hey! Me and some friends are doing a Petz 4 tournament this weekend—virtual cats and dogs showdown! Wanna join? It’s so cheesy but fun. 😄 <br><br>- Amanda' },
        email20: { from: 'Steve Park <steve.park@aol.com>', subject: 'Matrix Reloaded Trailer!', date: 'Dec 5, 2002', body: 'Yo, the trailer for Matrix Reloaded just dropped online! Took forever to download on my 56k, but it’s WORTH it. Wanna watch it together on AIM this weekend? <br><br>- Steve' }
    };

    const outlookAppTemplate = `
<appcontentholder class="outlook-container" style="padding: 0px !important;">
    <style>
    .outlook-container { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }
    .outlook-toolbar { flex-shrink: 0; padding: 4px 2px; border-bottom: 1px solid #c0c0c0; display: flex; flex-wrap: wrap; gap: 3px; }
    .outlook-main-content { display: flex; flex-grow: 1; overflow: hidden; }
    .outlook-left-pane { width: 200px; min-width: 150px; flex-shrink: 0; display: flex; flex-direction: column; padding: 10px; }
    .outlook-left-pane .folder-list, .outlook-left-pane .contact-list { list-style: none; margin: 0; padding: 0; }
    .outlook-left-pane .folder-list li, .outlook-left-pane .contact-list li { padding: 3px 5px; cursor: default; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .outlook-left-pane .folder-list li:hover, .outlook-left-pane .contact-list li:hover { background-color: #e0e0e0; }
    .outlook-left-pane .folder-list li.active { background-color: #316ac5; color: white; }
    .outlook-right-pane { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; padding: 10px; margin-right: 10px; }
    .outlook-right-pane > grouper { display: flex; flex-direction: column; margin-bottom: 15px; }
    .outlook-right-pane > .outlook-email-list-grouper { min-height: 100px; flex-shrink: 0; margin-bottom: 15px; }
    .outlook-right-pane > .outlook-email-preview-grouper { flex-grow: 1; margin-bottom: 15px; }
    .outlook-right-pane > .outlook-email-list-grouper scrollbox { flex-grow: 1; max-height: 100px; overflow-y: auto; }
    .outlook-right-pane > .outlook-email-preview-grouper scrollbox { flex-grow: 1; max-height: 300px; overflow-y: auto; }
    .outlook-email-list-grouper ul { list-style: none; margin: 0; padding: 0; }
    .outlook-email-list-grouper li { padding: 3px 5px; border-bottom: 1px solid #e0e0e0; cursor: default; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .outlook-email-list-grouper li:hover { background-color: #f0f0f0; }
    .outlook-email-list-grouper li.active { background-color: #316ac5; color: white; }
    .outlook-email-preview-content { 
        padding: 5px; 
        font-size: 12px; 
        font-family: Tahoma, sans-serif; /* Changed to Tahoma */
    }
    .outlook-email-preview-content h3 { margin-top: 0; font-size: 1.1em; }
    .outlook-info-section { flex-shrink: 0; display: flex; gap: 5px; }
    .outlook-info-section > grouper { flex-basis: 50%; }
    .outlook-info-section ul { padding-left: 20px; margin-top: 5px; margin-bottom: 5px; }
    .outlook-info-section p { margin-top: 5px; margin-bottom: 5px; }
</style>
    
    <appnavigation>
        <ul class="appmenus">
            <li>File
                <ul class="submenu">
                    <li><span>New</span></li>
                    <li><span>Open</span></li>
                    <li><span>Save</span></li>
                    <li class="divider"></li>
                    <li><span>Exit</span></li>
                </ul>
            </li>
            <li>Edit
                <ul class="submenu">
                    <li><span>Cut</span></li>
                    <li><span>Copy</span></li>
                    <li><span>Paste</span></li>
                </ul>
            </li>
            <li>View
                <ul class="submenu">
                    <li><span>Show All Messages</span></li>
                    <li><span>Layout...</span></li>
                </ul>
            </li>
            <li>Tools
                <ul class="submenu">
                    <li><span>Address Book...</span></li>
                    <li class="divider"></li>
                    <li><span>Options...</span></li>
                </ul>
            </li>
            <li>Message
                <ul class="submenu">
                    <li><span>New Message</span></li>
                    <li><span>Reply</span></li>
                    <li><span>Forward</span></li>
                </ul>
            </li>
            <li>Help
                <ul class="submenu">
                    <li><span>Help Topics</span></li>
                    <li class="divider"></li>
                    <li><span>About Outlook Express</span></li>
                </ul>
            </li>
        </ul>
        <navflag></navflag>
    </appnavigation>

    <div class="outlook-toolbar">
        <winbutton><btnopt>Create Mail</btnopt></winbutton><winbutton><btnopt>Reply</btnopt></winbutton><winbutton><btnopt>Reply All</btnopt></winbutton><winbutton><btnopt>Forward</btnopt></winbutton><winbutton><btnopt>Print</btnopt></winbutton><winbutton><btnopt>Delete</btnopt></winbutton><winbutton><btnopt>Addresses</btnopt></winbutton>
    </div>
    <div class="outlook-main-content">
        <div class="outlook-left-pane">
            <grouper><grouperHeading>Folders</grouperHeading><ul class="folder-list" id="outlookFolderTree"><li data-folder="inbox" class="active">  Inbox</li><li data-folder="sent">  Sent Items</li><li data-folder="deleted">  Deleted Items (7)</li><li data-folder="drafts">  Drafts</li></ul></grouper>
            <br>
            <grouper><grouperHeading>Contacts</grouperHeading><ul class="contact-list" id="outlookContactList"><li>Alex Carter</li><li>Sarah Lee</li><li>Jenna Brooks</li><li>Mike Thompson</li></ul></grouper>
        </div>
        <div class="outlook-right-pane">
            <grouper class="outlook-email-list-grouper"><grouperHeading id="emailListHeader">Inbox</grouperHeading><scrollbox><ul id="outlookEmailListUL"></ul></scrollbox></grouper>
            <grouper class="outlook-email-preview-grouper"><grouperHeading id="emailPreviewHeader">Preview</grouperHeading><scrollbox><div class="outlook-email-preview-content" id="outlookEmailPreviewContent"><p>Select an email to read it.</p></div></scrollbox></grouper>
            <div class="outlook-info-section">
                <grouper><grouperHeading>Microsoft Outlook Express</grouperHeading><p>The solution for all your messaging needs</p><ul><li>E-mail and Newsgroups</li><li>Multiple accounts and Identities</li><li>HTML message support</li><li>Address Book and directory services</li></ul></grouper>
                <grouper><grouperHeading>InfoBeat</grouperHeading><p>Surf, search and sift no more! InfoBeat delivers personalized news straight to your e-mail box. Add your Outlook Express account now!</p></grouper>
            </div>
        </div>
    </div>
</appcontentholder>
    `;

    registerApp({
        _template: null,
        _splashDiv: null,

        setup: async function() {
            console.log("outlook: init");

            this._splashDiv = document.createElement("div");
            this._splashDiv.style.width = "400px";
            this._splashDiv.style.height = "247px";
            this._splashDiv.style.position = "fixed";
            this._splashDiv.style.left = "50%";
            this._splashDiv.style.top = "50%";
            this._splashDiv.style.transform = "translate(-200px, -123.5px)";
            this._splashDiv.style.background = "url('res/ui/outlook/splash.png') no-repeat center center";
            this._splashDiv.style.zIndex = "500";

            if (window.wm && window.wm._windowspace) {
                wm._windowspace.appendChild(this._splashDiv);
            } else {
                document.body.appendChild(this._splashDiv);
            }
            
            await new Promise(resolve => setTimeout(resolve, 4000));

            this._template = document.createElement("template");
            this._template.innerHTML = outlookAppTemplate;
            console.log("outlook: init done");
        },

        start: async function() {
            console.log("outlook: starting up");

            var windowContents = this._template.content.firstElementChild.cloneNode(true);
            var hWnd = wm.createNewWindow("outlook", windowContents);

            var selfWindow = wm._windows[hWnd];
            selfWindow.style = "";

            wm.setIcon(hWnd, "outlook.png");
            wm.setCaption(hWnd, "Outlook Express 6");
            wm.setSize(hWnd, "800", "600");
            wm.setDialog(hWnd);

            const folderTreeElement = windowContents.querySelector('#outlookFolderTree');
            const emailListULElement = windowContents.querySelector('#outlookEmailListUL');
            const emailPreviewContentElement = windowContents.querySelector('#outlookEmailPreviewContent');
            const emailPreviewHeaderElement = windowContents.querySelector('#emailPreviewHeader');
            const emailListHeaderElement = windowContents.querySelector('#emailListHeader');

            function populateEmailList(folderName) {
                emailListULElement.innerHTML = '';
                const displayFolderName = String(folderName || "Inbox");
                emailListHeaderElement.textContent = displayFolderName.charAt(0).toUpperCase() + displayFolderName.slice(1);

                Object.keys(emailData).forEach(emailId => {
                    const email = emailData[emailId];
                    const listItem = document.createElement('li');
                    listItem.dataset.emailId = emailId;
                    listItem.textContent = `From: ${email.from.split('<')[0].trim()} - ${email.subject}`;
                    if (emailId === 'email1' && displayFolderName.toLowerCase() === 'inbox') {
                        listItem.classList.add('active');
                    }
                    emailListULElement.appendChild(listItem);
                });

                const activeItem = emailListULElement.querySelector('.active');
                if (activeItem) {
                    displayEmail(activeItem.dataset.emailId);
                } else if (emailListULElement.firstChild) {
                    emailListULElement.firstChild.classList.add('active');
                    displayEmail(emailListULElement.firstChild.dataset.emailId);
                } else {
                    displayEmail(null);
                }
            }

            function displayEmail(emailId) {
                if (!emailId || !emailData[emailId]) {
                    emailPreviewHeaderElement.textContent = "Preview";
                    emailPreviewContentElement.innerHTML = "<p>Select an email to read it.</p>";
                    return;
                }
                const email = emailData[emailId];
                emailPreviewHeaderElement.textContent = `Subject: ${email.subject}`;
                emailPreviewContentElement.innerHTML = `
                    <p><strong>From:</strong> ${email.from}</p>
                    <p><strong>Date:</strong> ${email.date}</p>
                    <hr>
                    <p>${email.body.replace(/\n/g, '<br>')}</p>
                `;
            }

            folderTreeElement.addEventListener('click', (e) => {
                const listItem = e.target.closest('li');
                if (listItem && listItem.dataset.folder) {
                    const currentActive = folderTreeElement.querySelector('.active');
                    if (currentActive) currentActive.classList.remove('active');
                    listItem.classList.add('active');
                    populateEmailList(listItem.dataset.folder);
                }
            });

            emailListULElement.addEventListener('click', (e) => {
                const listItem = e.target.closest('li');
                if (listItem && listItem.dataset.emailId) {
                    const currentActive = emailListULElement.querySelector('.active');
                    if (currentActive) currentActive.classList.remove('active');
                    listItem.classList.add('active');
                    displayEmail(listItem.dataset.emailId);
                }
            });

            const initialActiveFolder = folderTreeElement.querySelector('.active');
            if (initialActiveFolder && initialActiveFolder.dataset.folder) {
                populateEmailList(initialActiveFolder.dataset.folder);
            } else {
                populateEmailList('inbox');
            }

            if (this._splashDiv) {
                if (this._splashDiv.parentNode) {
                    this._splashDiv.parentNode.removeChild(this._splashDiv);
                }
                this._splashDiv = null;
            }
            return hWnd;
        },
    });
})();