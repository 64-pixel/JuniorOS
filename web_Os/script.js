
document.addEventListener("DOMContentLoaded", () => {
    const welcomeButton = document.getElementById("welcomeButton");
    const welcomeContent = document.getElementById("welcomeContent");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const desktop = document.getElementById("desktop");

    // Tlačítko Welcome – přechod na plochu OS
    if (welcomeButton && welcomeContent && welcomeScreen && desktop) {
        welcomeButton.addEventListener("click", () => {
            if (welcomeContent.classList.contains("zoom-out")) return;

            welcomeContent.classList.add("zoom-out");

            setTimeout(() => {
                welcomeScreen.classList.add("hidden");
                desktop.classList.remove("hidden");
            }, 1800);
        });
    }

    // Jméno Daniel – zobrazení sociálních sítí
    const myName = document.getElementById("myName");
    const socials = document.getElementById("socials");

    if (myName && socials) {
        myName.addEventListener("click", () => {
            myName.classList.toggle("zoomed");
            socials.classList.toggle("show");
        });
    }

    // Tlačítko OS – zapnutí/vypnutí kreslení svítivé vody
    const osButton = document.getElementById("osButtonDesktop");

    if (osButton) {
        osButton.addEventListener("click", () => {
            setWaterEffect(!settingsState.waterEffect);
        });
    }
    const apps = {
        about: {
            title: "about me",
            content: "<h2> Hello, my name is Daniel!</h2><p>Welcome to my JuniorOS.</p>"
        },
        projects: {
            title: "projects",
            content: `
                <div class="projects-app">
                    <div class="projects-toolbar">
                        <button type="button" data-project-action="folder">
                            + New folder
                        </button>

                        <button type="button" data-project-action="note">
                            + New note
                        </button>
                    </div>

                    <div class="projects-breadcrumb"></div>
                    <div class="projects-list"></div>
                    <div class="projects-dialog hidden">
                        <div class="projects-dialog-box">
                            <h3 class="projects-dialog-title">New folder</h3>

                            <input
                                type="text"
                                class="projects-dialog-input"
                                placeholder="Enter name..."
                            >

                            <textarea
                                class="projects-dialog-textarea hidden"
                                placeholder="Write your note..."
                            ></textarea>

                            <div class="projects-dialog-actions">
                                <button type="button" data-dialog-action="cancel">
                                    Cancel
                                </button>
                                <button type="button" data-dialog-action="save">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>

                    <p class="projects-status">
                        Changes save automatically.
                    </p>
            `
        },
        notebook: {
            title:"notebook",
            content: `
                <div class="notebook-app">
                    <p>Write here</p>
                    <textarea
                        class="notebook-editor"
                        placeholder="Begin to write..."
                    ></textarea>
                    <p class="notebook-status">Text saves automatically</p>
                </div>
            `
        },
        settings: {
            title: "settings",
            content: `
                <div class="settings-app">
                    <h2>Settings JuniorOS</h2>

                    <section class="settings-section">
                        <h3>Background</h3>
                        <label for="desktopBackground">Color:</label>
                        <input type="color" id="desktopBackground" value="#14202b">

                        <div class="theme-presets">
                            <button type="button" data-bg="#14202b">Ocean</button>
                            <button type="button" data-bg="#18251c">Forest</button>
                            <button type="button" data-bg="#251b35">Purple</button>
                            <button type="button" data-bg="#252525">Dark</button>
                        </div>
                    </section>

                    <section class="settings-section">
                        <h3>Date and time</h3>
                        <label for="customDateTime">Date and time:</label>
                        <input type="datetime-local" id="customDateTime">

                        <label class="settings-checkbox">
                            <input type="checkbox" id="useRealTime" checked>
                            Use real time
                        </label>

                    </section>

                    <section class="settings-section">
                        <h3> Look</h3>
                        <label for="systemTheme">System theme:</label>
                        <select id="systemTheme">
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </section>

                    <section class="settings-section">
                        <h3> Effect</h3>
                        <label class="settings-checkbox">
                            <input type="checkbox" id="waterEffectSetting">
                            Moving water after your mouse
                        </label>
                    </section>

                    <section class="settings-section">
                        <button type="button" id="resetSettings">
                            Reset settings choices
                        </button>
                    </section>

                    <p class="settings-status" id="settingsStatus">
                        Settings saves automatically
                    </p>
                </div>
            `
        },
    };
    let highestZIndex = 10;
    let windowOffset = 0;

    const settingsStorageKey="juniorOS-settings";

    const defaultSettings = {
        background: "#14202b",
        theme: "dark",
        useRealTime: true,
        customTime: Date.now(),
        customTimeSetAt: Date.now(),
        waterEffect: false
    };

    let settingsState = { ...defaultSettings};

    try {
        const savedSettings = localStorage.getItem(settingsStorageKey);
        if(savedSettings){
            settingsState={
                ...defaultSettings,
                ...JSON.parse(savedSettings)
            };
        }
    } catch (error){
        console.warn("Failed to load settings:", error);
    }
    function saveSettings(){
        try {
            localStorage.setItem(
                settingsStorageKey,
                JSON.stringify(settingsState)
            );
        } catch (error){
            console.warn("Failed to save settings:", error);
        }
    }

    function setWaterEffect(enabled){
        settingsState.waterEffect = enabled;

        document.dispatchEvent(
            new CustomEvent("toggleWaterEffect", {
                detail: enabled
            })
        );

        if (osButton) {
            osButton.classList.toggle("active", enabled);
        }

        saveSettings();
    }
    function applySettings(){
        desktop.style.backgroundColor = settingsState.background;
        document.body.style.backgroundColor = settingsState.background;
        document.documentElement.dataset.juniorTheme = settingsState.theme;
        desktop.style.backgroundImage = "none";

        setWaterEffect(settingsState.waterEffect);
    }

    function updateSystemClock(){
        const clock = document.getElementById("timeElement");
        if (!clock)return;

        const now = settingsState.useRealTime
            ? new Date()
            : new Date(
                settingsState.customTime +
                (Date.now() - settingsState.customTimeSetAt)
            );
        clock.textContent = now.toLocaleString("cs-CZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }
    applySettings();
    updateSystemClock();
    setInterval(updateSystemClock, 1000);

    function toLocalDateTimeValue(timestamp){
        const date = new Date(timestamp);

        const pad = number => String(number).padStart(2,"0");

        return(
            date.getFullYear() + "-" +
            pad(date.getMonth() + 1) + "-" +
            pad(date.getDate()) + "T" +
            pad(date.getHours()) + ":" +
            pad(date.getMinutes())
        );
    }
    
function initializeProjectsApp(appWindow) {
    const storageKey = "juniorOS-projects";

    const list = appWindow.querySelector(".projects-list");
    const breadcrumb = appWindow.querySelector(".projects-breadcrumb");
    const status = appWindow.querySelector(".projects-status");

    let currentFolderId = "root";

    const createId = () =>
        "item-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);

    const defaultData = {
        id: "root",
        name: "My Projects",
        type: "folder",
        children: [
            {
                id: createId(),
                name: "Solar charger",
                type: "folder",
                children: []
            },
            {
                id: createId(),
                name: "Smart Home",
                type: "folder",
                children: []
            }
        ]
    };

    function loadData() {
        try {
            const saved = localStorage.getItem(storageKey);

            if (saved) {
                const data = JSON.parse(saved);

                if (
                    data &&
                    data.id === "root" &&
                    data.type === "folder" &&
                    Array.isArray(data.children)
                ) {
                    return data;
                }
            }
        } catch (error) {
            console.warn("Could not load projects:", error);
        }

        return defaultData;
    }

    let data = loadData();

    function saveData() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
            status.textContent = "Saved automatically";
        } catch (error) {
            console.error("Could not save projects:", error);
            status.textContent = "Could not save changes";
        }
    }

    function findFolder(folderId, folder = data) {
        if (folder.id === folderId) return folder;
        if (folder.type !== "folder") return null;

        for (const child of folder.children) {
            if (child.type !== "folder") continue;

            const result = findFolder(child.id, child);
            if (result) return result;
        }

        return null;
    }

    function findParent(itemId, folder = data) {
        for (const child of folder.children) {
            if (child.id === itemId) return folder;

            if (child.type === "folder") {
                const result = findParent(itemId, child);
                if (result) return result;
            }
        }

        return null;
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function getPath(folderId) {
        const path = [];
        let folder = findFolder(folderId);

        while (folder) {
            path.unshift(folder);
            if (folder.id === "root") break;
            folder = findParent(folder.id);
        }

        return path;
    }

    function render() {
        const folder = findFolder(currentFolderId);

        if (!folder) {
            currentFolderId = "root";
            render();
            return;
        }

        breadcrumb.innerHTML = getPath(currentFolderId)
            .map((item, index, path) => `
                <button
                    type="button"
                    data-project-action="navigate"
                    data-id="${escapeHTML(item.id)}"
                    ${index === path.length - 1 ? "disabled" : ""}
                >${escapeHTML(item.name)}</button>
            `)
            .join('<span class="projects-separator"> / </span>');

        if (folder.children.length === 0) {
            list.innerHTML = `
                <p class="projects-empty">
                    This folder is empty. Create a folder or a note!
                </p>
            `;
            return;
        }

        list.innerHTML = folder.children.map(item => `
            <div class="project-item">
                <button
                    type="button"
                    class="project-open"
                    data-project-action="${item.type === "folder" ? "navigate" : "edit"}"
                    data-id="${escapeHTML(item.id)}"
                    title="${item.type === "folder" ? "Open folder" : "Edit note"}"
                >
                    <span class="project-item-icon">
                        ${item.type === "folder" ? "📁" : "📝"}
                    </span>
                    <span class="project-item-name">
                        ${escapeHTML(item.name)}
                    </span>
                </button>

                <div class="project-item-actions">
                    <button
                        type="button"
                        data-project-action="rename"
                        data-id="${escapeHTML(item.id)}"
                        title="Rename"
                    >Rename</button>

                    <button
                        type="button"
                        data-project-action="delete"
                        data-id="${escapeHTML(item.id)}"
                        title="Delete"
                    >Delete</button>
                </div>
            </div>
        `).join("");
    }

    function addItem(type) {
        const folder = findFolder(currentFolderId);
        if (!folder) return;

        const dialog = appWindow.querySelector(".projects-dialog");
        const title = appWindow.querySelector(".projects-dialog-title");
        const input = appWindow.querySelector(".projects-dialog-input");
        const textarea = appWindow.querySelector(".projects-dialog-textarea");

        title.textContent = type === "folder"
            ? "Create new folder"
            : "Create new note";

        input.value = "";
        input.placeholder = type === "folder"
            ? "Folder name..."
            : "Note name...";

        textarea.value = "";

        input.classList.remove("hidden");
        textarea.classList.toggle("hidden", type !== "note");

        dialog.classList.remove("hidden");

        const saveButton = dialog.querySelector('[data-dialog-action="save"]');

        saveButton.onclick = () => {
            const name = input.value.trim();

            if (!name) {
                input.focus();
                return;
            }

            const item = {
                id: createId(),
                name,
                type
            };

            if (type === "folder") {
                item.children = [];
            } else {
                item.content = textarea.value;
            }

            folder.children.push(item);

            saveData();
            render();

            dialog.classList.add("hidden");
        };

        input.onkeydown = event => {
            if (event.key === "Enter" && type === "folder") {
                event.preventDefault();
                saveButton.click();
            }

            if (event.key === "Escape") {
                dialog.classList.add("hidden");
            }
        };

        textarea.onkeydown = event => {
            if (event.key === "Escape") {
                dialog.classList.add("hidden");
            }
        };

        dialog.querySelector('[data-dialog-action="cancel"]').onclick = () => {
            dialog.classList.add("hidden");
        };

        input.focus();
    }

    function editNote(item) {
        const dialog = appWindow.querySelector(".projects-dialog");
        const title = appWindow.querySelector(".projects-dialog-title");
        const input = appWindow.querySelector(".projects-dialog-input");
        const textarea = appWindow.querySelector(".projects-dialog-textarea");
        const saveButton = dialog.querySelector('[data-dialog-action="save"]');

        title.textContent = "Edit note";

        input.value = item.name;
        input.placeholder = "Note name...";
        input.classList.remove("hidden");

        textarea.value = item.content || "";
        textarea.classList.remove("hidden");

        dialog.classList.remove("hidden");

        saveButton.onclick = () => {
            const name = input.value.trim();

            if (!name) {
                input.focus();
                return;
            }

            item.name = name;
            item.content = textarea.value;

            saveData();
            render();

            dialog.classList.add("hidden");
        };

        input.onkeydown = event => {
            if (event.key === "Enter") {
                event.preventDefault();
                saveButton.click();
            }

            if (event.key === "Escape") {
                dialog.classList.add("hidden");
            }
        };

        textarea.focus();
    }

    
appWindow.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest("[data-project-action]");

    if (!button || !appWindow.contains(button)) return;

    const action = button.dataset.projectAction;
    const id = button.dataset.id;

    console.log("My Projects clicked:", action);

    // Vytvoření složky nebo poznámky
    if (action === "folder" || action === "note") {
        addItem(action);
        return;
    }

    // Otevření složky nebo návrat přes cestu
    if (action === "navigate") {
        const folder = findFolder(id);

        if (folder) {
            currentFolderId = folder.id;
            render();
        }

        return;
    }

    // Najdeme položku a její nadřazenou složku
    const parent = findParent(id);
    const item = parent?.children.find(child => child.id === id);

    if (!item) return;

    // Úprava poznámky
    if (action === "edit" && item.type === "note") {
        editNote(item);
    }

    // Přejmenování položky
    else if (action === "rename") {
        const dialog = appWindow.querySelector(".projects-dialog");
        const title = appWindow.querySelector(".projects-dialog-title");
        const input = appWindow.querySelector(".projects-dialog-input");
        const textarea = appWindow.querySelector(".projects-dialog-textarea");
        const saveButton = dialog.querySelector('[data-dialog-action="save"]');

        title.textContent = "Rename item";
        input.value = item.name;
        input.placeholder = "New name...";
        input.classList.remove("hidden");
        textarea.classList.add("hidden");

        dialog.classList.remove("hidden");

        saveButton.onclick = () => {
            const name = input.value.trim();

            if (!name) {
                input.focus();
                return;
            }

            item.name = name;

            saveData();
            render();

            dialog.classList.add("hidden");
        };

        input.onkeydown = event => {
            if (event.key === "Enter") {
                event.preventDefault();
                saveButton.click();
            }

            if (event.key === "Escape") {
                dialog.classList.add("hidden");
            }
        };

        input.focus();
    }

    else if (action === "delete") {
        const confirmed = window.confirm
            ? window.confirm(`Delete "${item.name}" and its contents?`)
            : false;

        if (!confirmed) {
            status.textContent = "Deletion cancelled";
            return;
        }

        parent.children = parent.children.filter(
            child => child.id !== id
        );

        saveData();
        render();
    }
}, true);


    render();
}


    function openApp(appId){
        const app = apps[appId];
        if (!app) return;

        const appWindow = document.createElement("div");
        appWindow.className = "app-window";

        const offset = (windowOffset % 8) * 30;
        windowOffset++;

        appWindow.style.left = `${100 + offset}px`;
        appWindow.style.top = `${80 + offset}px`;
        appWindow.style.zIndex = ++highestZIndex;

        appWindow.innerHTML = `
            <div class="window-header">
                <span>${app.title}</span>
                <button class="close-window" type="button">X</button>
            </div>
            <div class="window-content">${app.content}</div>    
        `;
        document.getElementById("desktop").appendChild(appWindow);

        if (appId === "projects"){
            initializeProjectsApp(appWindow);
        }

        if (appId === "settings"){
            const get = id => appWindow.querySelector(`#${id}`);

            const background = get("desktopBackground");
            const dateTime = get("customDateTime");
            const realTime = get("useRealTime");
            const theme = get("systemTheme");
            const water = get("waterEffectSetting");
            const status = get("settingsStatus");

            background.value = settingsState.background;
            realTime.checked = settingsState.useRealTime;
            theme.value = settingsState.theme;
            water.checked = settingsState.waterEffect;

            realTime.addEventListener("change", () => {
                settingsState.useRealTime = realTime.checked;

                if(realTime.checked){
                    dateTime.value = "";
                }
                showSaved();
                updateSystemClock();
            });

            dateTime.addEventListener("change", () =>{
                if(!dateTime.value)return;

                const selectedDate = new Date(dateTime.value);

                if (!Number.isNaN(selectedDate.getTime()))return;

                settingsState.customTime = selectedDate.getTime();
                settingsState.customTimeSetAt = Date.now();
                settingsState.useRealTime = false;

                realTime.checked = false;

                showSaved();
                updateSystemClock();
            });

            function showSaved(){
                saveSettings();
                status.textContent = "Saved";
            }

            function applyBackground(color){
                settingsState.background = color;
                desktop.style.backgroundColor = color;
                desktop.style.backgroundImage = "none";
                document.body.style.backgroundColor = color;
                background.value = color;
                showSaved();
            }

            background.addEventListener("input", () =>{
                applyBackground(background.value);
            });

            appWindow.querySelectorAll("[data-bg]").forEach(button => {
                button.addEventListener("click", () =>{
                    applyBackground(button.dataset.bg);
                });
            });

            realTime.addEventListener("change", () =>{
                settingsState.useRealTime = realTime.checked;
                showSaved();
                updateSystemClock();
            });
            dateTime.addEventListener("change", () => {
                if (!dateTime.value) return;

                const selectedTime = new Date(dateTime.value).getTime();
                if (!Number.isFinite(selectedTime)) return;

                settingsState.customTime = selectedTime;
                settingsState.customTimeSetAt = Date.now();
                settingsState.useRealTime = false;
                realTime.checked = false;   

                showSaved();
                updateSystemClock();
            });

            theme.addEventListener("change", () =>{
                settingsState.theme = theme.value;
                document.documentElement.dataset.juniorTheme = theme.value;
                showSaved();
            });

            water.addEventListener("change", () =>{
                setWaterEffect(water.checked);
                status.textContent = "saved";
            });

            get("resetSettings").addEventListener("click", () =>{
                settingsState = {
                    ...defaultSettings,
                    customTime: Date.now(),
                    customTimeSetAt: Date.now()
                };
                applySettings();

                background.value = settingsState.background;
                realTime.checked = true;
                dateTime.value = "";
                theme.value = settingsState.theme;
                water.checked = false;

                status.textContent = "Default settings enabled";
            });

        }

        if (appId == "notebook"){
            const editor = appWindow.querySelector(".notebook-editor");
            const status = appWindow.querySelector(".notebook-status");
            const storageKey = "juniorOS-notebook-content";
            editor.value = localStorage.getItem(storageKey) || "";
            editor.addEventListener("input", () => {
                localStorage.setItem(storageKey, editor.value);
                status.textContent = "Saved";
            });

        }

        const header = appWindow.querySelector(".window-header");
        const closeButton = appWindow.querySelector(".close-window");

        closeButton.addEventListener("click", () => {
            appWindow.remove();
        });

        appWindow.addEventListener("pointerdown", () =>{
            appWindow.style.zIndex = ++highestZIndex;
        });

        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        header.addEventListener("pointerdown", event =>{
            if (event.target.closest("button"))return;

            dragging = true;
            const rect = appWindow.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;

            header.setPointerCapture(event.pointerId);
            event.preventDefault();
        });

        header.addEventListener("pointermove", event =>{
            if (!dragging)return;

            const maxX = window.innerWidth - appWindow.offsetWidth;
            const maxY = window.innerHeight - appWindow.offsetHeight;

            const x = Math.max(
                0,
                Math.min(event.clientX - offsetX, maxX)
            );

            const y = Math.max(
                0,
                Math.min(event.clientY - offsetY, maxY)
            );

            appWindow.style.left = `${x}px`;
            appWindow.style.top = `${y}px`;
        });
        function stopDragging(){
            dragging = false;
        }

        header.addEventListener("pointerup", stopDragging);
        header.addEventListener("pointercancel", stopDragging);
        header.addEventListener("lostpointercapture", stopDragging);
    }
    document.querySelectorAll(".desktop-icon").forEach(icon =>{
        icon.addEventListener("click", () =>{
            openApp(icon.dataset.app);
        });
    });
});
