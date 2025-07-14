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