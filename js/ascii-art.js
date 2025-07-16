const asciiArt1 = `
           .--._.--.
          ( O     O )
          /   . .   \\
         .\`._______.\`.
        /(           )\\
      _/  \\  \\   /  /  \\_
   .~   \`  \\  \\ /  /  \`   ~.
  {    -.   \\  V  /   .-    }
_ _\`.    \\  |  |  |  /    .\` _ _
>_       _} |  |  | {_       _<
 /. - ~ ,_-\`  .^.  \`-_, ~ - .\\
         \`-\`|/   \\|\`-\`
`;

const asciiArt2 = `
              \\     /
          \\    o ^ o    /
            \\ (     ) /
 ____________(%%%%%%%)____________
(     /   /  )%%%%%%%(  \\   \\     )
(___/___/__/           \\__\\___\\___)
   (     /  /(%%%%%%%)\  \\     )
    (__/___/ (%%%%%%%) \\___\\__)
            /(       )\\
          /   (%%%%%)   \\
               (%%%)
                 !
`;

const asciiArt3 = `
    .----.   @   @
   / .-"-.\\. \\v/
   | | '\\ \\ \\_/ )
 ,-\\ \`-.\` /.\`  /
\`---\`----\`----\`
`;

const asciiArt4 = `
                           .    .
                            )  (
      _ _ _ _ _ _ _ _ _ _ _(.--.)
    {{ { { { { { { { { { { ( \`_\`)
jgs  >>>>>>>>>>>>>>>>>>>>>>>\`--\`>
`;

const asciiArt5 = `
    ____         ____
   /. . \\       / . .\\
 / .-~-.\ \\_/ /.-~-. \\
   \\ \`._.\`.(___)/.\`._.\` /
    \\. ..-. |=| .-.. ./
   \\  \`-\` |=| \`-\`  /
     \\____/|=|\\____/
        /.-..|=|..-./
     /.\`-\`./^\\\`-\`./
     \\____/   \\____/
`;

const asciiArt6 = `
                         ,.
                        (\\(\\)
        ,_              ;  o >
         {\`-.          /  (_) 
         \`={\`-._____/\`   |
          \`-{ /    -=\`\\   |
        .="\`={  -= = _/   /\`"-.
       (M==M=M==M=M==M==M==M==M)
        \\=N=N==N=N==N=N==N=NN=/
         \\M==M=M==M=M==M===M=/
          \\N=N==N=N==N=NN=N=/
           \\M==M==M=M==M==M/
            \`-------------\`
`;

const asciiArt7 = `
             _ (.".) _
            \`-\`/. .\\\`-\`
              /_   _\\     _...._
             (\` o o \`)---\`   .::'.
              /"---"\` .::\`    \`   \\
              |:  .::.     /  .::;|
              |\`  ::\`   .:|    \`:||
               \\   \\  \\ \`\\     /\\
                \\\`;-\`| |-.-\`-,  \\ |)
                 ( | ( | \`-uu ( |
                  ||  ||    || ||
                 /_( /_(   /_(/_(
`;

// Array containing all ASCII arts
const asciiArts = [
    asciiArt1,
    asciiArt2,
    asciiArt3,
    asciiArt4,
    asciiArt5,
    asciiArt6,
    asciiArt7
];

function addRandomAsciiArt() {
    const container = document.querySelector('.articles-container');
    if (!container) return;
    
    const screenWidth = window.innerWidth;
    
    // Remove existing ASCII art
    const existingArt = container.querySelectorAll('.ascii-art');
    existingArt.forEach(art => art.remove());
    
    // Don't add ASCII art on mobile
    if (screenWidth <= 480) return;
    
    // Determine number of ASCII arts based on screen size
    let numArts;
    if (screenWidth <= 780) {
        numArts = 3; // Tablet
    } else if (screenWidth <= 1200) {
        numArts = 5; // Small desktop
    } else {
        numArts = 7; // Large desktop
    }
    
    // Create safe zones around articles
    const articles = container.querySelectorAll('.article-section');
    const safeZones = [];
    
    articles.forEach(article => {
        const rect = article.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0) {
            const padding = 60;
            safeZones.push({
                left: ((rect.left - containerRect.left - padding) / containerRect.width) * 100,
                top: ((rect.top - containerRect.top - padding) / containerRect.height) * 100,
                right: ((rect.right - containerRect.left + padding) / containerRect.width) * 100,
                bottom: ((rect.bottom - containerRect.top + padding) / containerRect.height) * 100
            });
        }
    });
    
    // Function to check if position is safe
    function isPositionSafe(left, top, width, height) {
        const artRight = left + width;
        const artBottom = top + height;
        
        return !safeZones.some(zone => {
            return !(artRight < zone.left || left > zone.right || 
                    artBottom < zone.top || top > zone.bottom);
        });
    }
    
    // Track placed ASCII art positions to prevent overlaps
    const placedArts = [];
    
    // Function to check if position overlaps with other ASCII art
    function isPositionSafeFromArts(left, top, width, height) {
        const artRight = left + width;
        const artBottom = top + height;
        
        return !placedArts.some(placedArt => {
            return !(artRight < placedArt.left || left > placedArt.right || 
                    artBottom < placedArt.top || top > placedArt.bottom);
        });
    }
    
    // Add ASCII arts
    for (let i = 0; i < numArts; i++) {
        const art = document.createElement('pre');
        art.className = 'ascii-art';
        art.textContent = asciiArts[Math.floor(Math.random() * asciiArts.length)];
        
        let attempts = 0;
        let positioned = false;
        
        while (attempts < 100 && !positioned) { // Increased attempts
            const left = Math.random() * 75; // Reduced range for better spacing
            const top = Math.random() * 70;
            const width = 20; // Increased padding between arts
            const height = 25;
            
            // Check both article safe zones and other ASCII art positions
            const safeFromArticles = safeZones.length === 0 || isPositionSafe(left, top, width, height);
            const safeFromOtherArts = isPositionSafeFromArts(left, top, width, height);
            
            if (safeFromArticles && safeFromOtherArts) {
                art.style.left = left + '%';
                art.style.top = top + '%';
                
                // Add this position to the tracking array
                placedArts.push({
                    left: left,
                    top: top,
                    right: left + width,
                    bottom: top + height
                });
                
                positioned = true;
            }
            attempts++;
        }
        
        if (positioned) {
            container.appendChild(art);
        }
    }
}