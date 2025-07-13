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