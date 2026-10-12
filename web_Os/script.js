
const myName = document.getElementById("myName");
const socials = document.getElementById("socials");

myName.addEventListener("click", function () {
    myName.classList.toggle("zoomed");
    socials.classList.toggle("show");
});