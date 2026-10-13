
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("fireworks");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
        alpha: false
    });
    const osButton = document.getElementById("osButton");
    let drawingEnabled = false;

    if(osButton){
      osButton.addEventListener("click",()=>{
        drawingEnabled = !drawingEnabled;
        osButton.style.textShadow = drawingEnabled
          ? "0 0 12px aqua"
          : "none";
      });

    }
    window.addEventListener("pointermove", (e)=>{
      if(!drawingEnabled){
        lastX = null;
        lastY = null;
        return;
      }
      if (lastX !== null && lastY !== null) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        if (Math.hypot(dx,dy) > 2){
          addInk(e.clientX, e.clientY, dx,dy);
        }
      }
      
      lastX =e.clientX;
      lastY = e.clientY;
    }, { passive:true });
    

    let width, height;
    let lastX = null;
    let lastY = null;
    let hue = 190;

    // Omezuje zátěž grafiky
    const MAX_PARTICLES = 350;
    const PARTICLES_PER_MOVE = 3;
    const trails = [];

    function resize() {
        // Nižší rozlišení výrazně zrychluje vykreslování.
        const scale = Math.min(window.devicePixelRatio || 1, 1.25);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
    }

    resize();
    window.addEventListener("resize", resize);

    class Trail {
        constructor(x, y, angle, color) {
            this.x = x;
            this.y = y;
            this.px = x;
            this.py = y;
            this.angle = angle;
            this.color = color;
            this.life = 1;
            this.speed = 0.8 + Math.random() * 1.8;
            this.phase = Math.random() * 6.28;
            this.wave = 0.03 + Math.random() * 0.05;
            this.width = 1 + Math.random() * 2;
        }

        update() {
            this.px = this.x;
            this.py = this.y;

            this.phase += this.wave;

            const angle = this.angle + Math.sin(this.phase) * 0.5;

            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;

            this.life -= 0.012;
        }

        draw() {
            ctx.globalAlpha = this.life;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(this.px, this.py);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
        }
    }

    function addInk(x, y, dx, dy) {
        const angle = Math.atan2(dy, dx);

        hue = (hue + 3) % 360;

        for (let i = 0; i < PARTICLES_PER_MOVE; i++) {
            if (trails.length >= MAX_PARTICLES) {
                trails.shift();
            }

            const spread = (Math.random() - 0.5) * 1.2;
            const offset = (Math.random() - 0.5) * 8;

            trails.push(new Trail(
                x - Math.sin(angle) * offset,
                y + Math.cos(angle) * offset,
                angle + spread,
                `hsl(${(hue + Math.random() * 30) % 360}, 100%, 65%)`
            ));
        }
    }

    window.addEventListener("pointermove", (e) => {
        if (lastX !== null && lastY !== null) {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;

            if (Math.hypot(dx, dy) > 2) {
                addInk(e.clientX, e.clientY, dx, dy);
            }
        }

        lastX = e.clientX;
        lastY = e.clientY;
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
        lastX = null;
        lastY = null;
    });

    let previousTime = 0;

    function animate(time) {
        requestAnimationFrame(animate);

        // Přeskočíme zbytečně časté vykreslování.
        if (time - previousTime < 1000 / 60 - 1) return;
        previousTime = time;

        // Jemné mizení stop
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = "lighter";

        for (let i = trails.length - 1; i >= 0; i--) {
            const p = trails[i];

            p.update();
            p.draw();

            if (p.life <= 0) {
                trails.splice(i, 1);
            }
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
    }

    requestAnimationFrame(animate);
});
