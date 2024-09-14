document.addEventListener("DOMContentLoaded", () => {
    // Day/Night Theme Toggle
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeToggle.checked = currentTheme === "dark";

    themeToggle.addEventListener("change", () => {
        const theme = themeToggle.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    });

    // Smooth Scrolling for Navigation
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Smooth slide down transition for Learn More button
    const learnMoreButton = document.querySelector('.cta-button');
    learnMoreButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Scroll-triggered animations for slide-in sections
    const slideSections = document.querySelectorAll('.slide-in');
    const slideObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    slideSections.forEach(section => slideObserver.observe(section));

    // Interactive project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const details = card.querySelector('.project-details');
            details.classList.toggle('hidden');
        });
    });

    // Scroll to Top Button
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    document.getElementById('backToTop').addEventListener('click', scrollToTop);
});
