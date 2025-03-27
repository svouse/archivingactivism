document.addEventListener("DOMContentLoaded", function () {
    const carouselTrack = document.getElementById("carousel-track");
    let images = Array.from(carouselTrack.children);
    let imageWidth, trackWidth, positionX = 0;

    let baseSpeed = 1; // Smooth default scrolling speed
    let hoverSpeed = 2.6;  // Faster on hover
    let currentSpeed = baseSpeed;
    let targetSpeed = baseSpeed;
    let scrollDirection = -1;
    let animationFrame;
    let isHovering = false; // Track hover state

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
        // **Smooth easing to mimic inertia**
        currentSpeed += (targetSpeed - currentSpeed) * 0.07; // Lower factor = smoother acceleration & deceleration

        positionX += scrollDirection * currentSpeed;

        // **Seamless looping without jumps**
        if (positionX <= -trackWidth) {
            positionX += trackWidth;
        } else if (positionX >= 0) {
            positionX -= trackWidth;
        }

        carouselTrack.style.transform = `translate3d(${positionX}px, 0, 0)`;

        animationFrame = requestAnimationFrame(updateScroll);
    }

    function startAutoScroll() {
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(updateScroll);
        }
    }

    function stopScrolling() {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    function startHoverScroll(direction) {
        if (!isHovering) {
            isHovering = true;
            scrollDirection = direction;
            targetSpeed = hoverSpeed;
        }
    }

    function stopHoverScroll() {
        if (isHovering) {
            isHovering = false;
            targetSpeed = baseSpeed * 0.8; // **Let it "coast" before settling back to base speed**
            setTimeout(() => {
                targetSpeed = baseSpeed;
            }, 300); // Delay full reset for a more natural feel
        }
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
