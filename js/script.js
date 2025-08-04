// loading screen for internal navigation
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="a-zine"], a[href="https://notes.aninternet.farm/"], a[href="https://notes.aninternet.farm/articles"]');
    
    internalLinks.forEach(link => {
        function handleNavigation(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
            }
            
            setTimeout(() => {
                if (link.href === "https://notes.aninternet.farm/" || link.href === "https://notes.aninternet.farm/articles" || 
                    link.getAttribute('href') === "https://notes.aninternet.farm/" || link.getAttribute('href') === "https://notes.aninternet.farm/articles") {
                    const newWindow = window.open(link.href, '_blank');
                    // Fallback for mobile if window.open is blocked
                    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        window.location.href = link.href;
                    } else {
                        const loadingScreen = document.getElementById('loading-screen');
                        if (loadingScreen) {
                            loadingScreen.style.display = 'none';
                        }
                    }
                } else {
                    window.location.href = link.href;
                }
            }, 2500);
        }
        
        link.addEventListener('click', handleNavigation);
        link.addEventListener('touchstart', handleNavigation, { passive: false });
    });
    
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }
    });
    
    window.addEventListener('focus', function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    });
});