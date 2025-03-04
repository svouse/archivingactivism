document.addEventListener("DOMContentLoaded", () => {
    const photos = document.querySelectorAll(".photo");
    const container = document.querySelector(".photo-pile-container");

    const containerRect = container.getBoundingClientRect();

    photos.forEach(photo => {
        // Random positions within the container's bounds
        const randomX = Math.random() * (containerRect.width - 150); // Width minus image size
        const randomY = Math.random() * (containerRect.height - 150); // Height minus image size

        // Random rotation for a natural scattered effect
        const randomAngle = (Math.random() - 0.5) * 50;

        // Apply styles
        photo.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomAngle}deg)`;
    });
});
