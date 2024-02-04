// This will trigger first
document.addEventListener('DOMContentLoaded', function () {
    
    // Init inventory
    Inventory.init();
    
    // Init session
    Session.init();
});

// Wait for everything to load, then set event for
window.addEventListener('load', function () {
    
});