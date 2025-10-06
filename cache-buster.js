/**
 * STP Solar - Cache Busting Utility
 * Use this script during development to prevent browser caching
 */

(function() {
    'use strict';
    
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('dev') ||
                         window.location.hostname.includes('test');
    
    if (isDevelopment) {
        console.log('🔧 Development mode detected - Cache busting active');
        
        // Add cache-busting parameters to all resource links
        function addCacheBuster() {
            const timestamp = Date.now();
            
            // Update CSS links
            const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
            cssLinks.forEach(link => {
                if (link.href && !link.href.includes('?')) {
                    link.href += '?v=' + timestamp;
                }
            });
            
            // Update JS scripts
            const jsScripts = document.querySelectorAll('script[src]');
            jsScripts.forEach(script => {
                if (script.src && !script.src.includes('?')) {
                    script.src += '?v=' + timestamp;
                }
            });
            
            // Update images
            const images = document.querySelectorAll('img[src]');
            images.forEach(img => {
                if (img.src && !img.src.includes('?')) {
                    img.src += '?v=' + timestamp;
                }
            });
        }
        
        // Run cache buster on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addCacheBuster);
        } else {
            addCacheBuster();
        }
        
        // Add a visual indicator in development
        const devIndicator = document.createElement('div');
        devIndicator.innerHTML = '🔧 DEV MODE';
        devIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ff6b6b;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            z-index: 9999;
            font-family: monospace;
        `;
        document.body.appendChild(devIndicator);
        
        // Add keyboard shortcut for manual cache clear
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+R or Cmd+Shift+R for hard refresh
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                console.log('🔄 Manual cache clear triggered');
                window.location.reload(true);
            }
        });
        
        console.log('💡 Tip: Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) for hard refresh');
    }
})();
