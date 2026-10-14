const welcomeButton = document.getElementById("welcomeButton");
    const welcomeContent = document.getElementById("welcomeContent");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const desktop = document.getElementById("desktop");

    if (welcomeButton && welcomeContent && welcomeScreen && desktop) {
        welcomeButton.addEventListener("click", () => {
            welcomeContent.classList.add("zoom-out");

            setTimeout(() => {
                welcomeScreen.classList.add("hidden");
                desktop.classList.remove("hidden");
            }, 1800);
        });
    }

    const myName = document.getElementById("myName");
    const socials = document.getElementById("socials");

    if (myName && socials) {
        myName.addEventListener("click", () => {
            myName.classList.toggle("zoomed");
            socials.classList.toggle("show");
        });
    }