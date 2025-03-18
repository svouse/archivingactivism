document.addEventListener("DOMContentLoaded", function () {
    const carouselTrack = document.getElementById("carousel-track");
    let images = Array.from(carouselTrack.children);
    let imageWidth, trackWidth, positionX = 0;

    let baseSpeed =.2;
    let hoverSpeed = 2;
    let currentSpeed = baseSpeed;
    let targetSpeed = baseSpeed;
    let scrollDirection = -1;
    let animationFrame;

    function computeDimensions() {
        images = Array.from(carouselTrack.children);
        imageWidth = images[0].offsetWidth;
        trackWidth = imageWidth * images.length;

        while (carouselTrack.scrollWidth < window.innerWidth * 2) {
            images.forEach(img => {
                let clone = img.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                carouselTrack.appendChild(clone);
            });
        }

        trackWidth = carouselTrack.scrollWidth / 2;
    }

    function updateScroll() {
        currentSpeed += (targetSpeed - currentSpeed) * 0.1;
        positionX += scrollDirection * currentSpeed;

        // **Modulo trick applied in both directions**
        if (positionX <= -trackWidth) {
            positionX += trackWidth;
        } else if (positionX >= 0) {
            positionX -= trackWidth;
        }

        carouselTrack.style.transform = `translate3d(${positionX}px, 0, 0)`;

        animationFrame = requestAnimationFrame(updateScroll);
    }

    function startAutoScroll() {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(updateScroll);
    }

    function stopScrolling() {
        cancelAnimationFrame(animationFrame);
    }

    function startHoverScroll(direction) {
        scrollDirection = direction;
        targetSpeed = hoverSpeed;
        startAutoScroll();
    }

    function stopHoverScroll() {
        targetSpeed = baseSpeed;
        startAutoScroll();
    }

    function initializeCarousel() {
        if (images.every(img => img.complete)) {
            computeDimensions();
            startAutoScroll();
        } else {
            let loadedImages = 0;
            images.forEach(img => {
                img.addEventListener("load", () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        computeDimensions();
                        startAutoScroll();
                    }
                });
            });
        }
    }

    initializeCarousel();

    document.querySelector(".left-zone").addEventListener("mouseenter", () => startHoverScroll(1));
    document.querySelector(".right-zone").addEventListener("mouseenter", () => startHoverScroll(-1));
    document.querySelector(".left-zone").addEventListener("mouseleave", stopHoverScroll);
    document.querySelector(".right-zone").addEventListener("mouseleave", stopHoverScroll);
});
