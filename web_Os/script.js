
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
            content: "<h2>My projects</h2><p>Here are some of my projects: Solar charger, Smart Home, and more.</p>"
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
                        <select for="systemTheme">
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
        customTimeSetAt: Date.now,
        waterEffect: FontFaceSetLoadEvent
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

        setWaterEffect(settingsState.waterEffect);
    }

    function updateSystemClock(){
        const clock = document.getElementById("systemClock");
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

        if (appId === "settings"){
            const get = id => appWindow.querySelector(`#${id}`);

            const background = get("desktopBackground");
            const dateTime = get("customDateTime");
            const realTime = get("useRealTime");
            const theme = get("systemTheme");
            const water = get("waterEffectSetting");
            const status = get("settingsStatus");

            background.value = settingsState.background;
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
