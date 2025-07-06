let rebornXpUsernameGlobal = null;
let installedAppsMapGlobal = new Map(); // Will now store { version: "1.0" }
let allAppsData = [];
let currentCategoryFilter = "all";
let currentSearchTerm = "";
let currentFeaturedSlide = 0;
let featuredInterval;

const appListContainer = document.getElementById('app-list-container');
const appDetailModal = document.getElementById('appDetailModal');
const modalAppName = document.getElementById('modalAppName');
const modalAppIcon = document.getElementById('modalAppIcon');
const modalAppCategory = document.getElementById('modalAppCategory');
const modalAppDescription = document.getElementById('modalAppDescription');
const modalInstallButton = document.getElementById('modalInstallButton');
const modalAppVersion = document.getElementById('modalAppVersion'); // New element for version
const categoryFiltersContainer = document.getElementById('categoryFilters');
const searchInput = document.getElementById('searchInput');
const featuredSlider = document.getElementById('featuredSlider');

function closeAppDetailModal() {
    if (appDetailModal) appDetailModal.style.display = "none";
}

function showAppDetailModal(app) {
    if (!app || !appDetailModal) return;
    modalAppName.textContent = app.displayName;
    modalAppIcon.src = app.iconBase64 || 'res/icons/defaultapp.png';
    modalAppCategory.textContent = "Category: " + (app.category || "N/A");
    modalAppDescription.textContent = app.description || "No description available.";
    
    // Display version info in the modal
    const appInternalName = generateInternalNameFromDisplay(app.displayName);
    const installedInfo = installedAppsMapGlobal.get(appInternalName);
    if (installedInfo) {
        modalAppVersion.textContent = `Installed: v${installedInfo.version} | Latest: v${app.version}`;
        modalAppVersion.style.display = 'block';
    } else {
        modalAppVersion.textContent = `Latest: v${app.version}`;
        modalAppVersion.style.display = 'block';
    }

    modalInstallButton.dataset.appId = app.id;
    updateModalInstallButtonState(app.id, app.displayName, app.version);
    appDetailModal.style.display = "block";
}

function generateInternalNameFromDisplay(displayName) {
    return displayName.replace(/[^a-zA-Z0-9_-]/g, '');
}

function updateModalInstallButtonState(appId, appDisplayName, appVersion) {
    const appInternalName = generateInternalNameFromDisplay(appDisplayName);
    const installedInfo = installedAppsMapGlobal.get(appInternalName);

    if (installedInfo) {
        if (installedInfo.version !== appVersion) {
            modalInstallButton.textContent = 'Update';
            modalInstallButton.onclick = function() {
                installAppFromStore(appId, appInternalName, true); // isUpdate = true
                closeAppDetailModal();
            };
        } else {
            modalInstallButton.textContent = 'Uninstall';
            modalInstallButton.onclick = function() {
                uninstallAppFromStore(appId, appInternalName);
                closeAppDetailModal();
            };
        }
    } else {
        modalInstallButton.textContent = 'Install';
        modalInstallButton.onclick = function() {
            installAppFromStore(appId, appInternalName, false); // isUpdate = false
            closeAppDetailModal();
        };
    }
}

function installAppFromStore(appId, appInternalName, isUpdate = false) {
    const appData = allAppsData.find(app => app.id === appId);
    if (!appData) {
        alert("Error: App data not found.");
        return;
    }
    window.parent.postMessage({
        action: 'install_app_from_store_flatfile',
        payload: { appData: appData, appNameInternal: appInternalName, isUpdate: isUpdate }
    }, '*');
}

function uninstallAppFromStore(appId, appInternalName) {
    window.parent.postMessage({
        action: 'uninstall_app_from_store_flatfile',
        payload: { appNameInternal: appInternalName, appId: appId }
    }, '*');
}

function renderApps() {
    if (!appListContainer) return;

    let filteredApps = allAppsData;
    if (currentCategoryFilter !== "all") {
        filteredApps = filteredApps.filter(app => app.category === currentCategoryFilter);
    }
    if (currentSearchTerm) {
        const searchTermLower = currentSearchTerm.toLowerCase();
        filteredApps = filteredApps.filter(app =>
            app.displayName.toLowerCase().includes(searchTermLower) ||
            app.description.toLowerCase().includes(searchTermLower)
        );
    }

    if (filteredApps.length === 0) {
        appListContainer.innerHTML = '<p class="info-message">No apps match your criteria.</p>';
        return;
    }
    let html = '';
    filteredApps.forEach(app => {
        const appInternalName = generateInternalNameFromDisplay(app.displayName);
        const installedInfo = installedAppsMapGlobal.get(appInternalName);
        let buttonText = 'Install';
        let buttonAction = 'install';

        if (installedInfo) {
            if (installedInfo.version !== app.version) {
                buttonText = `Update to v${app.version}`;
                buttonAction = 'update';
            } else {
                buttonText = 'Uninstall';
                buttonAction = 'uninstall';
            }
        }

        html += `
            <div class="app-card" data-app-id="${app.id}">
                <img src="${app.iconBase64 || 'res/icons/defaultapp.png'}" alt="${app.displayName}" class="app-icon">
                <h3 class="app-title">${app.displayName}</h3>
                <p class="app-version">v${app.version}</p>
                <p class="app-category">${app.category || 'N/A'}</p>
                <p class="app-description">${app.description.substring(0, 70)}${app.description.length > 70 ? '...' : ''}</p>
                <button class="action-button app-action-button-list" data-action="${buttonAction}" data-app-id="${app.id}" data-app-name-internal="${appInternalName}">
                    ${buttonText}
                </button>
            </div>`;
    });
    appListContainer.innerHTML = html;

    document.querySelectorAll('.app-card .app-title').forEach(titleEl => {
        titleEl.onclick = () => {
            const appId = titleEl.closest('.app-card').dataset.appId;
            const appData = allAppsData.find(app => app.id === appId);
            if (appData) showAppDetailModal(appData);
        };
    });

    document.querySelectorAll('.app-action-button-list').forEach(button => {
        const action = button.dataset.action;
        const appId = button.dataset.appId;
        const appInternalName = button.dataset.appNameInternal;
        if (action === 'uninstall') {
            button.onclick = () => uninstallAppFromStore(appId, appInternalName);
        } else if (action === 'update') {
            button.onclick = () => installAppFromStore(appId, appInternalName, true);
        } else {
            button.onclick = () => installAppFromStore(appId, appInternalName, false);
        }
    });
}

function populateCategories() {
    if (!categoryFiltersContainer || allAppsData.length === 0) return;
    const categories = [...new Set(allAppsData.map(app => app.category))].filter(Boolean).sort();
    categories.forEach(category => {
        const button = document.createElement('button');
        button.dataset.category = category;
        button.textContent = category;
        button.onclick = () => {
            document.querySelectorAll('#categoryFilters button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategoryFilter = category;
            renderApps();
        };
        categoryFiltersContainer.appendChild(button);
    });
    const allButton = categoryFiltersContainer.querySelector('button[data-category="all"]');
    if (allButton) {
      allButton.onclick = () => {
        document.querySelectorAll('#categoryFilters button').forEach(btn => btn.classList.remove('active'));
        allButton.classList.add('active');
        currentCategoryFilter = "all";
        renderApps();
      };
    }
}

function setupFeaturedSlider() {
    if (!featuredSlider || allAppsData.length === 0) return;
    const featuredApps = allAppsData.filter(app => app.featured && app.featuredImage);
    if (featuredApps.length === 0) {
        featuredSlider.style.display = 'none';
        return;
    }
    featuredSlider.innerHTML = '';

    featuredApps.forEach((app, index) => {
        const slide = document.createElement('div');
        slide.classList.add('featured-slide');
        const imagePathInRebornXP = app.featuredImage.startsWith('res/') ? `../../${app.featuredImage}` : app.featuredImage;
        slide.style.backgroundImage = `url('${imagePathInRebornXP}')`;
        slide.dataset.appId = app.id;
        const caption = document.createElement('div');
        caption.classList.add('slide-caption');
        caption.textContent = app.displayName;
        slide.appendChild(caption);
        if (index === 0) slide.classList.add('active');
        featuredSlider.appendChild(slide);
        slide.onclick = () => {
            const appData = allAppsData.find(a => a.id === app.id);
            if (appData) showAppDetailModal(appData);
        };
    });

    if (featuredApps.length > 1) {
        clearInterval(featuredInterval);
        featuredInterval = setInterval(() => {
            const slides = featuredSlider.querySelectorAll('.featured-slide');
            slides[currentFeaturedSlide].classList.remove('active');
            currentFeaturedSlide = (currentFeaturedSlide + 1) % slides.length;
            slides[currentFeaturedSlide].classList.add('active');
        }, 5000);
    }
}

async function fetchAndInitializeStore() {
    if (!appListContainer) return;
    appListContainer.innerHTML = '<p class="loading-text">Loading apps...</p>';
    try {
        const response = await fetch('apps_db.json?v=' + Date.now());
        if (!response.ok) throw new Error(`Failed to fetch apps_db.json: ${response.status}`);
        allAppsData = await response.json();
        populateCategories();
        setupFeaturedSlider();
        renderApps();
    } catch (e) {
        appListContainer.innerHTML = `<p class="error-message">Error loading apps: ${e.message}</p>`;
    }
}

window.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'rebornxp_user_info_flatfile') {
        rebornXpUsernameGlobal = event.data.username || null;
        if (event.data.installedApps) {
            installedAppsMapGlobal = new Map(Object.entries(event.data.installedApps));
            if (allAppsData.length > 0) renderApps();
            if (appDetailModal.style.display === "block" && modalInstallButton.dataset.appId) {
                 const currentAppId = modalInstallButton.dataset.appId;
                 const currentApp = allAppsData.find(a => a.id === currentAppId);
                 if(currentApp) updateModalInstallButtonState(currentApp.id, currentApp.displayName, currentApp.version);
            }
        }
    } else if (event.data && event.data.action === 'app_install_status_update_flatfile') {
         if (event.data.payload.success) {
            const appInternalName = event.data.payload.appNameInternal;
            if (event.data.payload.type === 'install' || event.data.payload.type === 'update') {
                installedAppsMapGlobal.set(appInternalName, { version: event.data.payload.version });
            } else if (event.data.payload.type === 'uninstall') {
                installedAppsMapGlobal.delete(appInternalName);
            }
        }
        if (allAppsData.length > 0) renderApps();
        if (appDetailModal.style.display === "block" && modalInstallButton.dataset.appId) {
             const currentAppId = modalInstallButton.dataset.appId;
             const currentApp = allAppsData.find(a => a.id === currentAppId);
             if(currentApp) updateModalInstallButtonState(currentApp.id, currentApp.displayName, currentApp.version);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchAndInitializeStore();
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            renderApps();
        });
    }
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ action: 'appstore_iframe_ready_flatfile' }, '*');
    }
});

window.onclick = function(event) {
    if (event.target == appDetailModal) {
        closeAppDetailModal();
    }
}