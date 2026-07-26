document.addEventListener('DOMContentLoaded', function() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const navHamburger = document.getElementById('navHamburger');

    // Function to open the mobile navigation
    function openMobileNav() {
        mobileNav.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Function to close the mobile navigation
    function closeMobileNav() {
        mobileNav.classList.remove('open');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    // Event listeners for opening and closing the mobile navigation
    navHamburger.addEventListener('click', openMobileNav);
    mobileNavClose.addEventListener('click', closeMobileNav);

    // Close mobile nav when clicking outside of it
    mobileNav.addEventListener('click', function(event) {
        if (event.target === mobileNav) {
            closeMobileNav();
        }
    });
});