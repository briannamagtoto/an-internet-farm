// loading screen for internal navigation
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="articles"], a[href^="a-zine"], a[href="https://notes.aninternet.farm/"]');
    
    internalLinks.forEach(link => {
        function handleNavigation(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
            }
            
            setTimeout(() => {
                if (link.href === "https://notes.aninternet.farm/") {
                    window.open(link.href, '_blank');
                    const loadingScreen = document.getElementById('loading-screen');
                    if (loadingScreen) {
                        loadingScreen.style.display = 'none';
                    }
                } else {
                    window.location.href = link.href;
                }
            }, 2500);
        }
        
        link.addEventListener('click', handleNavigation);
        link.addEventListener('touchstart', handleNavigation, { passive: false });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const articles = document.querySelectorAll('.article-section');
    
    function positionArticles() {
        const container = document.querySelector('.articles-container');
        if (!container || articles.length === 0) return;
        
        const screenWidth = window.innerWidth;
        
        // Mobile: vertical stack (no positioning needed)
        if (screenWidth <= 480) {
            articles.forEach(article => {
                article.style.position = 'static';
                article.style.top = 'auto';
                article.style.left = 'auto';
                article.style.width = '100%';
                article.style.marginBottom = '1rem';
                // Remove drag functionality on mobile
                article.style.cursor = 'default';
                article.draggable = false;
            });
            return;
        }
        
        let gridCols, gridRows, spacing;
        
        if (screenWidth <= 780) {
            // Tablet layout
            gridCols = 3;
            gridRows = 3;
            spacing = { vertical: 25, horizontal: 28 };
        } else if (screenWidth <= 1200) {
            // Small desktop
            gridCols = 4;
            gridRows = 3;
            spacing = { vertical: 25, horizontal: 22 };
        } else {
            // Large desktop
            gridCols = 5;
            gridRows = 3;
            spacing = { vertical: 30, horizontal: 18 };
        }
        
        const positions = [];
        
        for(let row = 0; row < gridRows; row++) {
            for(let col = 0; col < gridCols; col++) {
                positions.push({
                    top: (row * spacing.vertical) + 15 + '%',
                    left: (col * spacing.horizontal) + 5 + '%'
                });
            }
        }
        
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        const placedArticles = [];
        
        function isArticlePositionSafe(left, top, width, height) {
            const articleRight = left + width;
            const articleBottom = top + height;
            
            return !placedArticles.some(placedArticle => {
                return !(articleRight <= placedArticle.left || left >= placedArticle.right || 
                        articleBottom <= placedArticle.top || top >= placedArticle.bottom);
            });
        }
        
        articles.forEach((article, index) => {
            if(positions[index]) {
                const articleWidth = screenWidth <= 780 ? 28 : 22;
                const articleHeight = 15;
                
                const leftPercent = parseFloat(positions[index].left);
                const topPercent = parseFloat(positions[index].top);
                
                let positionIndex = index;
                let attempts = 0;
                let positioned = false;
                
                while (attempts < positions.length && !positioned) {
                    const testLeft = parseFloat(positions[positionIndex].left);
                    const testTop = parseFloat(positions[positionIndex].top);
                    
                    if (isArticlePositionSafe(testLeft, testTop, articleWidth, articleHeight)) {
                        article.style.position = 'absolute';
                        article.style.top = positions[positionIndex].top;
                        article.style.left = positions[positionIndex].left;
                        article.style.width = articleWidth + '%';
                        article.style.marginBottom = '0';
                        article.style.cursor = 'move';
                        
                        placedArticles.push({
                            left: testLeft,
                            top: testTop,
                            right: testLeft + articleWidth,
                            bottom: testTop + articleHeight
                        });
                        
                        positioned = true;
                    } else {
                        positionIndex = (positionIndex + 1) % positions.length;
                        attempts++;
                    }
                }
                
                if (!positioned) {
                    article.style.position = 'absolute';
                    article.style.top = positions[index].top;
                    article.style.left = positions[index].left;
                    article.style.width = articleWidth + '%';
                    article.style.marginBottom = '0';
                    article.style.cursor = 'move';
                }
            }
        });
    }
    
    function makeDraggable() {
        const container = document.querySelector('.articles-container');
        if (!container) return;
        
        let isDragging = false;
        let currentArticle = null;
        let offset = { x: 0, y: 0 };
        
        articles.forEach(article => {
            article.addEventListener('mousedown', startDrag);

            article.addEventListener('touchstart', startDrag, { passive: false });
        });
        
        function startDrag(e) {
            if (window.innerWidth <= 480) return;
            
            e.preventDefault();
            isDragging = true;
            currentArticle = e.target.closest('.article-section');
            
            if (!currentArticle) return;
            
            currentArticle.style.zIndex = '1000';
            currentArticle.style.opacity = '0.8';
            
            const rect = currentArticle.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            let clientX, clientY;
            if (e.type === 'mousedown') {
                clientX = e.clientX;
                clientY = e.clientY;
            } else {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            
            offset.x = clientX - rect.left;
            offset.y = clientY - rect.top;
            
            // Add global event listeners
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', stopDrag);
        }
        
        function drag(e) {
            if (!isDragging || !currentArticle) return;
            
            e.preventDefault();
            
            const containerRect = container.getBoundingClientRect();
            
            let clientX, clientY;
            if (e.type === 'mousemove') {
                clientX = e.clientX;
                clientY = e.clientY;
            } else {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            
            let newLeft = clientX - containerRect.left - offset.x;
            let newTop = clientY - containerRect.top - offset.y;
            
            const articleRect = currentArticle.getBoundingClientRect();
            const maxLeft = containerRect.width - articleRect.width;
            const maxTop = containerRect.height - articleRect.height;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            const leftPercent = (newLeft / containerRect.width) * 100;
            const topPercent = (newTop / containerRect.height) * 100;
            
            currentArticle.style.left = leftPercent + '%';
            currentArticle.style.top = topPercent + '%';
        }
        
        function stopDrag() {
            if (!isDragging || !currentArticle) return;
            
            isDragging = false;
            currentArticle.style.zIndex = 'auto';
            currentArticle.style.opacity = '1';
            currentArticle = null;
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', stopDrag);
        }
    }
    
    positionArticles();

    makeDraggable();
    
    
    setTimeout(() => {
        if (typeof addRandomAsciiArt === 'function') {
            addRandomAsciiArt();
        }
    }, 100);
    
    window.addEventListener('resize', () => {
        positionArticles();
        makeDraggable();
        setTimeout(() => {
            if (typeof addRandomAsciiArt === 'function') {
                addRandomAsciiArt();
            }
        }, 100);
    });
});