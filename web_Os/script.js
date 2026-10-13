document.addEventListener("DOMContentLoaded", () =>{
    const myName = document.getElementById("myName");
    const socials = document.getElementById("socials");

    if (!myName || !socials)return;

    myName.addEventListener("click", ()=>{
        myName.classList.toggle("zoomed");
        socials.classList.toggle("show");

    });

    if (myName && socials) {
        myName.addEventListener("click", () => {
            myName.classList.toggle("zoomed");
            socials.classList.toggle("show");
        });
    }

    myName.addEventListener("click", function () {
        myName.classList.toggle("zoomed");
        socials.classList.toggle("show");
    });

    dragElement(document.getElementById("window"));

    function dragElement(element){
        var initialX = 0;
        var initialY = 0;
        var currentX = 0;
        var currentY = 0;
    }
    if(document.getElementById(element.id + "header")){

        document.getElementById(element.id + "header").onmousedown = startDragging;
    }
    else{
        element.onmousedown = startDragging;
    }
    function startDragging(e){  
        e=e|| window.event;
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousedown = gradElement;
    }
    function dragElement(e){
        e = e|| window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        element.style.top = (element.offsetTop - currentX) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging(){
        document.onmouseup = null;
        document.onmousemove = null;
    }
})