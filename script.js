// Desktop/laptop scrolling
window.addEventListener('wheel', function(event) {
    event.preventDefault();
    
    // Detect if it's a trackpad (smaller deltaY values) or mouse wheel
    let scrollAmount = Math.abs(event.deltaY) < 50 ? event.deltaY * 8 : event.deltaY * 0.6;
    
    window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
    });
}, { passive: false });

// loading screen for internal navigation
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="articles"], a[href^="a-zine"], a[href^="notes"]');
    
    internalLinks.forEach(link => {
        function handleNavigation(event) {
            event.preventDefault();
            event.stopPropagation();
            
            document.getElementById('loading-screen').style.display = 'flex';
            
            setTimeout(() => {
                window.location.href = link.href;
            }, 2500);
        }
        
        link.addEventListener('click', handleNavigation);
        link.addEventListener('touchstart', handleNavigation, { passive: false });
    });
});