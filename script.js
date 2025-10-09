// STP Solar Website JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// System Builder Elements
const systemSelection = document.getElementById('system-selection');
const systemsGrid = document.getElementById('systems-grid');
const customizationSection = document.getElementById('customization-section');

// Quote Form Elements
const quoteForm = document.getElementById('quote-form');

// Cache busting for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Add timestamp to prevent caching during development
    const timestamp = new Date().getTime();
    console.log('Development mode detected - Cache busting enabled:', timestamp);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Clear pricing cache first to ensure we use the latest config
    // This ensures pricing matches the admin portal configuration
    clearPricingCache();
    
    initializeNavigation();
    initializeSystemBuilder();
    initializeQuoteForm();
    initializeScrollEffects();
    initializeAnimations();
    
    // Debug: Check if phase options exist
    console.log('Phase options found:', document.querySelectorAll('.phase-option').length);
    console.log('System selection element:', document.getElementById('system-selection'));
    console.log('Systems grid element:', document.getElementById('systems-grid'));
    
    // Test if we can find the customization section
    const customizationSection = document.getElementById('system-customization');
    console.log('Customization section found:', customizationSection);
    
    if (customizationSection) {
        console.log('Customization section HTML:', customizationSection.innerHTML);
    }
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Prevent body scroll when mobile menu is open
    navToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            document.body.classList.remove('menu-open');
        } else {
            document.body.classList.add('menu-open');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scrolling for navigation links (only for hash links on the same page)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            const isSamePageHash = href.startsWith('#');
            const isIndexHash = href.startsWith('index.html#');

            // Allow normal navigation for external pages (e.g., privacy-policy.html)
            if (!(isSamePageHash || isIndexHash)) {
                return; // do not preventDefault
            }

            e.preventDefault();
            const targetId = isIndexHash ? href.replace('index.html', '') : href;
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else if (isIndexHash) {
                // If link includes index.html# but we're not on index, navigate to index
                window.location.href = href;
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// System Builder Functions
function initializeSystemBuilder() {
    console.log('Initializing system builder...');
    
    // Add event listeners to phase options
    const phaseOptions = document.querySelectorAll('.phase-option');
    console.log('Found phase options:', phaseOptions.length);
    
    phaseOptions.forEach((option, index) => {
        console.log(`Adding listener to phase option ${index}:`, option.dataset.phase);
        option.addEventListener('click', function() {
            console.log('Phase option clicked:', this.dataset.phase);
            const phase = this.dataset.phase;
            selectPhase(phase);
        });
    });
    
    // Populate system type dropdown
    const systemTypeSelect = document.getElementById('system-type-select');
    if (systemTypeSelect) {
        systemTypeSelect.innerHTML = '<option value="">Select System Type</option>';
        systemTypeSelect.innerHTML += '<option value="sunsynk">Sunsynk Systems</option>';
        systemTypeSelect.innerHTML += '<option value="tesla">Tesla Powerwall</option>';
    }
    
    // Auto-select single phase if systems are available
    if (systems && systems.single && systems.single.length > 0) {
        console.log('Auto-selecting single phase with', systems.single.length, 'systems');
        selectPhase('single');
    } else if (systems && systems.three && systems.three.length > 0) {
        console.log('Auto-selecting three phase with', systems.three.length, 'systems');
        selectPhase('three');
    }
    
    console.log('System builder initialized');
}

// System Type Selection Function
function selectSystemType() {
    const systemTypeSelect = document.getElementById('system-type-select');
    const selectedType = systemTypeSelect.value;
    
    console.log('System type selected:', selectedType);
    
    if (selectedType === 'sunsynk') {
        // Show phase selection for Sunsynk systems
        document.getElementById('phase-selection').style.display = 'block';
        document.getElementById('tesla-configuration').style.display = 'none';
    } else if (selectedType === 'tesla') {
        // Show Tesla configuration
        document.getElementById('phase-selection').style.display = 'none';
        document.getElementById('tesla-configuration').style.display = 'block';
    } else {
        // Hide both
        document.getElementById('phase-selection').style.display = 'none';
        document.getElementById('tesla-configuration').style.display = 'none';
    }
}

// Quote Modal Functions
function showQuoteModal() {
    console.log('showQuoteModal called!');
    console.log('currentSystem:', currentSystem);
    console.log('Document ready state:', document.readyState);
    
    if (!currentSystem) {
        alert('Please select a system first!');
        return;
    }
    
    // Wait for DOM to be ready if needed
    if (document.readyState === 'loading') {
        console.log('DOM still loading, waiting...');
        document.addEventListener('DOMContentLoaded', showQuoteModal);
        return;
    }
    
    // Show modal
    const modal = document.getElementById('quoteModal');
    console.log('Modal element found:', modal);
    console.log('All elements with id quoteModal:', document.querySelectorAll('#quoteModal'));
    
    if (!modal) {
        console.error('Modal element not found!');
        console.log('Available elements:', document.querySelectorAll('[id*="quote"]'));
        return;
    }
    
    // Populate system details in modal
    const modalDetails = document.getElementById('modal-system-details');
    if (modalDetails) {
        const panelQty = parseInt(document.getElementById('panels-quantity').textContent);
        const batteryQty = parseInt(document.getElementById('batteries-quantity').textContent);
        const installationTotal = calculateInstallationCost(panelQty, currentSystem.phase || 'single');
        const totalPrice = currentSystem.inverter.price + (currentSystem.battery.price * batteryQty) + (currentSystem.panel.price * panelQty) + installationTotal;
        
        modalDetails.innerHTML = `
            <div class="system-detail">
                <strong>System:</strong> ${currentSystem.name}
            </div>
            <div class="system-detail">
                <strong>Inverter:</strong> ${currentSystem.inverter.name} - R${currentSystem.inverter.price.toLocaleString('en-ZA')}
            </div>
            <div class="system-detail">
                <strong>Battery:</strong> ${batteryQty}x ${currentSystem.battery.name} - R${(currentSystem.battery.price * batteryQty).toLocaleString('en-ZA')}
            </div>
            <div class="system-detail">
                <strong>Panels:</strong> ${panelQty}x ${currentSystem.panel.name} - R${(currentSystem.panel.price * panelQty).toLocaleString('en-ZA')}
            </div>
            <div class="system-detail">
                <strong>Installation:</strong> R${installationTotal.toLocaleString('en-ZA')}
            </div>
            <div class="system-detail total">
                <strong>Total Price:</strong> R${totalPrice.toLocaleString('en-ZA')}
            </div>
        `;
    }
    
    console.log('Adding show class to modal');
    modal.classList.add('show');
    modal.style.display = ''; // Remove inline display: none
    console.log('Modal classes after adding show:', modal.className);
    console.log('Modal style after removing display none:', modal.style.display);
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none'; // Restore display: none when closing
    }
}

// Handle quote form submission
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('modal-quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(quoteForm);
            const customerName = formData.get('name');
            const customerEmail = formData.get('email');
            const customerPhone = formData.get('phone');
            const customerLocation = formData.get('location') || 'South Africa';
            const customerMessage = formData.get('message') || '';
            
            // Validate email
            if (!isValidEmail(customerEmail)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Close modal
            closeQuoteModal();
            
            // Send quote request
            await sendQuoteRequest(customerName, customerEmail, customerPhone, customerLocation, customerMessage);
        });
    }
});

// Send quote request function
async function sendQuoteRequest(customerName, customerEmail, customerPhone, customerLocation, customerMessage) {
    if (!currentSystem) {
        alert('Please select a system first!');
        return;
    }
    
    // Get current quantities from the UI
    const panelQty = parseInt(document.getElementById('panels-quantity').textContent);
    const batteryQty = parseInt(document.getElementById('batteries-quantity').textContent);
    
    // Calculate prices
    const inverterTotal = currentSystem.inverter.price;
    const batteryTotal = currentSystem.battery.price * batteryQty;
    const panelTotal = currentSystem.panel.price * panelQty;
    
    // Recalculate installation cost based on current panel quantity
    const installationTotal = calculateInstallationCost(panelQty, currentSystem.phase || 'single');
    const totalPrice = inverterTotal + batteryTotal + panelTotal + installationTotal;
    
    // Calculate separate accessories and installation costs
    const installation = currentPricing.installation || {};
    const markup = currentPricing.markup || {};
    
    let accessoriesCost, baseInstallationCost, perPanelCost;
    
    if (currentSystem.phase === 'three') {
        accessoriesCost = installation['three-accessories'] || 20000;
        baseInstallationCost = installation['three-base-installation'] || 12000;
        perPanelCost = installation['three-per-panel'] || 1000;
    } else if (currentSystem.phase === 'tesla') {
        accessoriesCost = installation['tesla-accessories'] || 18000;
        baseInstallationCost = installation['tesla-base-installation'] || 10000;
        perPanelCost = installation['tesla-per-panel'] || 950;
    } else {
        // Single phase (default)
        accessoriesCost = installation['single-accessories'] || 15000;
        baseInstallationCost = installation['single-base-installation'] || 8500;
        perPanelCost = installation['single-per-panel'] || 900;
    }
    
    // Calculate separate costs
    const accessoriesTotal = accessoriesCost * (markup.installation || 1);
    const panelInstallationCost = panelQty * perPanelCost * (markup.installation || 1);
    const baseInstallationTotal = baseInstallationCost * (markup.installation || 1);
    const totalInstallationCost = accessoriesTotal + baseInstallationTotal + panelInstallationCost;
    
    console.log('🔧 Webhook cost breakdown:');
    console.log(`   Accessories: R${accessoriesTotal}`);
    console.log(`   Base Installation: R${baseInstallationTotal}`);
    console.log(`   Panel Installation (${panelQty} × R${perPanelCost}): R${panelInstallationCost}`);
    console.log(`   Total Installation: R${totalInstallationCost}`);
    
    // Build the webhook payload (new format for n8n workflow)
    const quoteData = {
        // Customer Info
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_location: customerLocation,
        customer_message: customerMessage,
        
        // System Info
        system_name: currentSystem.name,
        phase: currentPhase,
        
        // Line 1: Inverter
        line1_item_name: currentSystem.inverter.name,
        line1_description: `1x ${currentSystem.inverter.name}`,
        line1_amount: currentSystem.inverter.price,
        line1_quantity: 1,
        
        // Line 2: Battery
        line2_item_name: currentSystem.battery.name,
        line2_description: `${batteryQty}x ${currentSystem.battery.name}`,
        line2_amount: currentSystem.battery.price * batteryQty,
        line2_quantity: batteryQty,
        
        // Line 3: Panels
        line3_item_name: currentSystem.panel.name,
        line3_description: `${panelQty}x ${currentSystem.panel.name}`,
        line3_amount: currentSystem.panel.price * panelQty,
        line3_quantity: panelQty,
        
        // Line 4: Accessories
        line4_item_name: 'Accessories',
        line4_description: 'Installation Accessories',
        line4_amount: accessoriesTotal,
        line4_quantity: 1,
        
        // Line 5: Installation
        line5_item_name: 'Installation',
        line5_description: `Base Installation + ${panelQty} Panels`,
        line5_amount: baseInstallationTotal + panelInstallationCost,
        line5_quantity: 1,
        
        // Total
        total_price: totalPrice
    };
    
    // Show loading state
    const btn = document.getElementById('request-quote-btn');
    if (!btn) {
        console.error('Request Quote button not found!');
        return;
    }
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    
    try {
        console.log('Sending quote to n8n:', quoteData);
        
        // Send to n8n webhook
        const response = await fetch('https://n8n01.stpsolar.co.za/webhook/solar-quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quoteData)
        });
        
        if (response.ok) {
            const result = await response.json();
            alert('✅ Quote request sent successfully! We will contact you within 24 hours with your formal estimate.');
            console.log('n8n response:', result);
        } else {
            throw new Error('Failed to send quote request');
        }
    } catch (error) {
        console.error('Error sending quote:', error);
        alert('⚠️ Sorry, there was an error sending your quote request. Please try again or call us directly at +27 82 123 4567.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Load pricing from localStorage or use default from pricing-config.js
function loadPricing() {
    const savedPricing = localStorage.getItem('stp-solar-pricing');
    if (savedPricing) {
        return JSON.parse(savedPricing);
    }
    return pricingConfig;
}

// Get current pricing
let currentPricing = loadPricing();

// Function to refresh pricing from localStorage
function refreshPricing() {
    currentPricing = loadPricing();
    console.log('Pricing refreshed:', currentPricing);
}

// Function to clear cached pricing and reload from config
function clearPricingCache() {
    console.log('🧹 Clearing pricing cache...');
    const oldPricing = localStorage.getItem('stp-solar-pricing');
    console.log('Old cached pricing:', oldPricing ? JSON.parse(oldPricing) : 'None');
    
    localStorage.removeItem('stp-solar-pricing');
    currentPricing = pricingConfig;
    
    console.log('✅ Pricing cache cleared, using config:');
    console.log('   Installation config:', currentPricing.installation);
    console.log('   Markup config:', currentPricing.markup);
    
    updateSystemConfigurations();
}

// Listen for pricing updates
window.addEventListener('pricingUpdated', function(event) {
    currentPricing = event.detail;
    console.log('Pricing updated:', currentPricing);
    // Update system configurations with new pricing
    updateSystemConfigurations();
    // Refresh the page to show new prices
    setTimeout(() => {
        window.location.reload();
    }, 1000);
});

// Function to create system configurations with current pricing
function createSystemConfigurations() {
    console.log('🔧 Creating system configurations...');
    console.log('🔧 Current pricing:', currentPricing);
    
    const singlePhaseSystems = [];
    const threePhaseSystems = [];
    
    // Get available components from pricing data
    const inverters = currentPricing.inverters || {};
    const batteries = currentPricing.batteries || {};
    const panels = currentPricing.panels || {};
    const installation = currentPricing.installation || {};
    const markup = currentPricing.markup || {};
    
    console.log('🔧 Available inverters:', Object.keys(inverters));
    console.log('🔧 Available batteries:', Object.keys(batteries));
    console.log('🔧 Available panels:', Object.keys(panels));
    
    // Create systems for each available inverter
    Object.entries(inverters).forEach(([inverterKey, inverterData]) => {
        // Skip -name entries (descriptive names)
        if (inverterKey.endsWith('-name')) {
            return;
        }
        
        // Skip Tesla inverters - they will be handled as special battery systems
        if (inverterKey.toLowerCase().includes('tesla')) {
            return;
        }
        
        // Handle both old format (price number) and new format (inverter object)
        let inverterPrice, inverterName, inverterType, inverterCapacity;
        
        if (typeof inverterData === 'number') {
            // Old format - just a price
            inverterPrice = inverterData;
            inverterName = inverterKey.replace(/-/g, ' ');
            inverterType = inverterKey.includes('3P') ? 'three' : 'single';
            inverterCapacity = parseFloat(inverterKey.match(/\d+/)?.[0]) || 5;
        } else {
            // New format - rich inverter object
            inverterPrice = inverterData.price || 0;
            inverterName = inverterData.name || inverterKey.replace(/-/g, ' ');
            inverterType = inverterData.type || (inverterKey.includes('3P') ? 'three' : 'single');
            inverterCapacity = inverterData.capacity || parseFloat(inverterKey.match(/\d+/)?.[0]) || 5;
        }
        
        const isThreePhase = inverterType === 'three';
        const systemType = isThreePhase ? threePhaseSystems : singlePhaseSystems;
        
        // Use the capacity from the inverter data
        const capacity = inverterCapacity;
        
        // Determine appropriate battery and quantity based on capacity and limits
        let batteryKey, batteryQuantity;
        const minBatteries = isThreePhase ? (currentPricing.limits?.['three-batteries-min'] || 2) : (currentPricing.limits?.['single-batteries-min'] || 1);
        const maxBatteries = isThreePhase ? (currentPricing.limits?.['three-batteries-max'] || 20) : (currentPricing.limits?.['single-batteries-max'] || 10);
        
        if (capacity <= 5) {
            batteryKey = 'Sunsynk-5.12kWh';
            batteryQuantity = Math.min(maxBatteries, Math.max(minBatteries, 1));
        } else if (capacity <= 10) {
            batteryKey = 'Sunsynk-5.12kWh';
            batteryQuantity = Math.min(maxBatteries, Math.max(minBatteries, 2));
        } else {
            batteryKey = 'Sunsynk-10kWh';
            batteryQuantity = Math.min(maxBatteries, Math.max(minBatteries, capacity <= 16 ? 2 : 3));
        }
        
        // Use first available panel if JA Solar not available
        const panelKey = panels['JA-Solar-565W'] ? 'JA-Solar-565W' : Object.keys(panels)[0] || 'JA-Solar-565W';
        const minPanels = isThreePhase ? (currentPricing.limits?.['three-panels-min'] || 8) : (currentPricing.limits?.['single-panels-min'] || 6);
        const maxPanels = isThreePhase ? (currentPricing.limits?.['three-panels-max'] || 100) : (currentPricing.limits?.['single-panels-max'] || 50);
        const panelQuantity = Math.min(maxPanels, Math.max(minPanels, Math.ceil(capacity * 1000 / 565))); // Within limits, at least minimum panels, or enough for capacity
        
        // Get proper display names from pricing config
        const inverterDisplayName = inverters[`${inverterKey}-name`] || inverterName;
        const batteryDisplayName = batteries[`${batteryKey}-name`] || batteryKey.replace(/-/g, ' ');
        const panelDisplayName = panels[`${panelKey}-name`] || panelKey.replace(/-/g, ' ');
        
        const system = {
            id: `${isThreePhase ? 'three' : 'single'}-${capacity}kw`,
            name: `${capacity}kW Sunsynk System`,
            phase: isThreePhase ? 'three' : 'single',
            inverter: { 
                name: inverterDisplayName, 
                price: (inverterPrice || 25000) * (markup.inverter || 1.2) 
            },
            battery: { 
                name: batteryDisplayName, 
                price: (batteries[batteryKey] || 45000) * (markup.battery || 1.15), 
                quantity: batteryQuantity 
            },
            panel: { 
                name: panelDisplayName, 
                price: (panels[panelKey] || 2500) * (markup.panels || 1.1), 
                quantity: panelQuantity 
            },
            installation: (() => {
                // Use installation costs from inverter definition or fallback to system-specific costs
                let baseCost, accessoriesCost, perPanelCost;
                
                if (typeof inverterData === 'object' && inverterData.installation) {
                    // New format - use installation costs from inverter definition
                    baseCost = inverterData.installation.base || 0;
                    accessoriesCost = inverterData.installation.accessories || 0;
                    perPanelCost = inverterData.installation.perPanel || 0;
                    
                    // If linked to an installation package, use that instead
                    if (inverterData.linkedInstallation && currentPricing.installationDefinitions) {
                        const linkedInstallation = currentPricing.installationDefinitions[inverterData.linkedInstallation];
                        if (linkedInstallation) {
                            baseCost = linkedInstallation.base || baseCost;
                            accessoriesCost = linkedInstallation.accessories || accessoriesCost;
                            perPanelCost = linkedInstallation.perPanel || perPanelCost;
                        }
                    }
                } else {
                    // Old format - use system-specific installation costs
                    const baseKey = isThreePhase ? 'three-base-installation' : 'single-base-installation';
                    const accessoriesKey = isThreePhase ? 'three-accessories' : 'single-accessories';
                    const perPanelKey = isThreePhase ? 'three-per-panel' : 'single-per-panel';
                    
                    baseCost = installation[baseKey] || (isThreePhase ? 12000 : 8500);
                    accessoriesCost = installation[accessoriesKey] || (isThreePhase ? 20000 : 15000);
                    perPanelCost = installation[perPanelKey] || (isThreePhase ? 1000 : 900);
                }
                
                // Calculate total installation cost: base + accessories + (panels × per-panel cost)
                const panelCost = panelQuantity * perPanelCost;
                const total = (baseCost + accessoriesCost + panelCost) * (markup.installation || 1);
                
                console.log(`🔧 Installation calculation for ${inverterKey}:`);
                console.log(`   Base Cost: R${baseCost}`);
                console.log(`   Accessories Cost: R${accessoriesCost}`);
                console.log(`   Panel Cost (${panelQuantity} × R${perPanelCost}): R${panelCost}`);
                console.log(`   Markup: ${markup.installation || 1}`);
                console.log(`   Total: R${total}`);
                return total;
            })()
        };
        
        systemType.push(system);
    });
    
    // Create special systems for premium battery solutions (like Tesla Powerwall)
    Object.entries(batteries).forEach(([batteryKey, batteryPrice]) => {
        // Check if this is a premium battery system (Tesla, etc.)
        if (batteryKey.toLowerCase().includes('tesla') || batteryKey.toLowerCase().includes('powerwall')) {
            // Extract capacity from battery key
            const capacityMatch = batteryKey.match(/(\d+\.?\d*)/);
            const capacity = capacityMatch ? parseFloat(capacityMatch[1]) : 13.5; // Default for Tesla Powerwall 3
            
            // Tesla Powerwall is standalone - no inverter required
            const batteryDisplayName = batteries[`${batteryKey}-name`] || batteryKey.replace(/-/g, ' ');
            
            const system = {
                id: `single-${batteryKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: `Tesla Powerwall System`,
                phase: 'tesla',
                inverter: null, // Tesla Powerwall doesn't need an inverter
                battery: { 
                    name: batteryDisplayName, 
                    price: (batteryPrice || 180000) * (markup.battery || 1.15), 
                    quantity: 1 
                },
                panel: null, // Solar panels are optional
                installation: (() => {
                    const baseCost = installation['tesla-base-installation'] || 10000;
                    const accessoriesCost = installation['tesla-accessories'] || 18000;
                    const perPanelCost = installation['tesla-per-panel'] || 950;
                    const panelCost = panelQuantity * perPanelCost;
                    const total = (baseCost + accessoriesCost + panelCost) * (markup.installation || 1);
                    
                    console.log(`🔧 Tesla Installation calculation:`);
                    console.log(`   Base Cost: R${baseCost}`);
                    console.log(`   Accessories Cost: R${accessoriesCost}`);
                    console.log(`   Panel Cost (${panelQuantity} × R${perPanelCost}): R${panelCost}`);
                    console.log(`   Total: R${total}`);
                    return total;
                })()
            };
            
            singlePhaseSystems.push(system);
        }
    });
    
    // Sort systems by capacity
    singlePhaseSystems.sort((a, b) => {
        const aCap = parseInt(a.id.match(/(\d+)/)?.[1]) || 0;
        const bCap = parseInt(b.id.match(/(\d+)/)?.[1]) || 0;
        return aCap - bCap;
    });
    
    threePhaseSystems.sort((a, b) => {
        const aCap = parseInt(a.id.match(/(\d+)/)?.[1]) || 0;
        const bCap = parseInt(b.id.match(/(\d+)/)?.[1]) || 0;
        return aCap - bCap;
    });
    
    return {
        single: singlePhaseSystems,
        three: threePhaseSystems
    };
}

// Create systems with current pricing
let systems = createSystemConfigurations();
console.log('Dynamic systems created:', systems);
console.log('Single phase systems:', systems.single?.length || 0);
console.log('Three phase systems:', systems.three?.length || 0);

// Function to update system configurations
function updateSystemConfigurations() {
    systems = createSystemConfigurations();
    console.log('System configurations updated:', systems);
}

let currentSystem = null;
let currentPhase = null;

function selectPhase(phase) {
    console.log('Phase selected:', phase);
    currentPhase = phase;
    
    // Update phase selection UI
    document.querySelectorAll('.phase-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select the clicked phase option
    document.querySelector(`[data-phase="${phase}"]`).classList.add('selected');
    
    // Show systems
    displaySystems(phase);
    systemSelection.style.display = 'block';
}

function displaySystems(phase) {
    systemsGrid.innerHTML = '';
    
    systems[phase].forEach(system => {
        const systemCard = document.createElement('div');
        systemCard.className = 'system-card';
        systemCard.innerHTML = `
            <h4>${system.name}</h4>
            ${system.inverter ? `<p><strong>Inverter:</strong> ${system.inverter.name}</p>` : ''}
            <p><strong>Batteries:</strong> ${system.battery.quantity}x ${system.battery.name}</p>
            ${system.panel ? `<p><strong>Panels:</strong> ${system.panel.quantity}x ${system.panel.name}</p>` : '<p><strong>Panels:</strong> Optional (add separately)</p>'}
            <div class="system-price">R${calculateSystemPrice(system).toLocaleString('en-ZA')}</div>
        `;
        
        systemCard.addEventListener('click', (e) => selectSystem(system, e.currentTarget));
        systemsGrid.appendChild(systemCard);
    });
}

function selectSystem(system, clickedElement) {
    console.log('System selected:', system.name);
    currentSystem = system;
    
    // Update system selection UI
    document.querySelectorAll('.system-card').forEach(card => {
        card.classList.remove('selected');
    });
    clickedElement.classList.add('selected');
    
    // Initialize customization
    initializeCustomization(system);
    
    // Show customization section
    customizationSection.style.display = 'block';
}

function initializeCustomization(system) {
    // Set initial values
    document.getElementById('panels-quantity').textContent = system.panel.quantity;
    document.getElementById('batteries-quantity').textContent = system.battery.quantity;
    
    // Update pricing
    updateSystemPrice();
}

function adjustPanels(change) {
    const quantityEl = document.getElementById('panels-quantity');
    let currentQuantity = parseInt(quantityEl.textContent);
    let newQuantity = currentQuantity + change;
    
    if (newQuantity >= 0 && newQuantity <= 50) {
        quantityEl.textContent = newQuantity;
        updateSystemPrice();
    }
}

function adjustBatteries(change) {
    const quantityEl = document.getElementById('batteries-quantity');
    let currentQuantity = parseInt(quantityEl.textContent);
    let newQuantity = currentQuantity + change;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantityEl.textContent = newQuantity;
        updateSystemPrice();
    }
}

function updateSystemPrice() {
    if (!currentSystem) return;
    
    const panelQuantity = parseInt(document.getElementById('panels-quantity').textContent);
    const batteryQuantity = parseInt(document.getElementById('batteries-quantity').textContent);
    
    const inverterPrice = currentSystem.inverter.price;
    const batteryPrice = currentSystem.battery.price * batteryQuantity;
    const panelPrice = currentSystem.panel.price * panelQuantity;
    
    // Recalculate installation cost based on current panel quantity
    const installationPrice = calculateInstallationCost(panelQuantity, currentSystem.phase || 'single');
    
    const totalPrice = inverterPrice + batteryPrice + panelPrice + installationPrice;
    
    // Update displays
    document.getElementById('inverter-price').textContent = 'R' + inverterPrice.toLocaleString('en-ZA');
    document.getElementById('battery-price').textContent = 'R' + batteryPrice.toLocaleString('en-ZA');
    document.getElementById('panel-price').textContent = 'R' + panelPrice.toLocaleString('en-ZA');
    document.getElementById('installation-price').textContent = 'R' + installationPrice.toLocaleString('en-ZA');
    document.getElementById('total-price').textContent = 'R' + totalPrice.toLocaleString('en-ZA');
    
    // Update customization prices
    document.getElementById('panels-price').textContent = 'R' + panelPrice.toLocaleString('en-ZA');
    document.getElementById('batteries-price').textContent = 'R' + batteryPrice.toLocaleString('en-ZA');
}

// Calculate installation cost based on panel quantity and phase
function calculateInstallationCost(panelQuantity, phase = 'single') {
    const installation = currentPricing.installation || {};
    const markup = currentPricing.markup || {};
    
    let baseCost, accessoriesCost, perPanelCost;
    
    if (phase === 'three') {
        baseCost = installation['three-base-installation'] || 12000;
        accessoriesCost = installation['three-accessories'] || 20000;
        perPanelCost = installation['three-per-panel'] || 1000;
    } else if (phase === 'tesla') {
        baseCost = installation['tesla-base-installation'] || 10000;
        accessoriesCost = installation['tesla-accessories'] || 18000;
        perPanelCost = installation['tesla-per-panel'] || 950;
    } else {
        // Single phase (default)
        baseCost = installation['single-base-installation'] || 8500;
        accessoriesCost = installation['single-accessories'] || 15000;
        perPanelCost = installation['single-per-panel'] || 900;
    }
    
    // Calculate total installation cost: base + accessories + (panels × per-panel cost)
    const panelCost = panelQuantity * perPanelCost;
    const total = (baseCost + accessoriesCost + panelCost) * (markup.installation || 1);
    
    console.log(`🔧 Installation recalculation for ${phase} phase:`);
    console.log(`   Panel Quantity: ${panelQuantity}`);
    console.log(`   Base Cost: R${baseCost}`);
    console.log(`   Accessories Cost: R${accessoriesCost}`);
    console.log(`   Panel Cost (${panelQuantity} × R${perPanelCost}): R${panelCost}`);
    console.log(`   Markup: ${markup.installation || 1}`);
    console.log(`   Total: R${total}`);
    
    return total;
}

function calculateSystemPrice(system) {
    let total = 0;
    if (system.inverter) total += system.inverter.price;
    if (system.battery) total += (system.battery.price * system.battery.quantity);
    if (system.panel) total += (system.panel.price * system.panel.quantity);
    if (system.installation) total += system.installation;
    return total;
}

// Tesla System Functions
function adjustTeslaUnits(change) {
    const quantityEl = document.getElementById('tesla-units-quantity');
    let currentQuantity = parseInt(quantityEl.textContent);
    let newQuantity = currentQuantity + change;
    
    if (newQuantity >= 1 && newQuantity <= 4) {
        quantityEl.textContent = newQuantity;
        updateTeslaPricing();
    }
}

function adjustTeslaPanels(change) {
    const quantityEl = document.getElementById('tesla-panels-count');
    let currentQuantity = parseInt(quantityEl.textContent);
    let newQuantity = currentQuantity + change;
    
    if (newQuantity >= 0 && newQuantity <= 40) {
        quantityEl.textContent = newQuantity;
        updateTeslaPricing();
    }
}

function toggleTeslaPanels() {
    const includePanels = document.getElementById('include-panels').checked;
    const panelQuantity = document.getElementById('tesla-panel-quantity');
    
    if (includePanels) {
        panelQuantity.style.display = 'block';
    } else {
        panelQuantity.style.display = 'none';
    }
    
    updateTeslaPricing();
}

function updateTeslaPricing() {
    const units = parseInt(document.getElementById('tesla-units-quantity').textContent);
    const includePanels = document.getElementById('include-panels').checked;
    const panels = includePanels ? parseInt(document.getElementById('tesla-panels-count').textContent) : 0;
    
    // Tesla Powerwall 3 pricing (per unit)
    const teslaUnitPrice = 180000; // R180,000 per unit
    const panelPrice = 2500; // R2,500 per panel
    const installationBase = 10000; // R10,000 base installation
    const installationAccessories = 18000; // R18,000 accessories
    const installationPerPanel = 950; // R950 per panel
    
    const totalUnitsPrice = units * teslaUnitPrice;
    const totalPanelsPrice = panels * panelPrice;
    const totalInstallation = installationBase + installationAccessories + (panels * installationPerPanel);
    const totalPrice = totalUnitsPrice + totalPanelsPrice + totalInstallation;
    
    // Update pricing display (you can add this to your HTML)
    console.log('Tesla System Pricing:', {
        units: units,
        panels: panels,
        totalPrice: totalPrice
    });
}

// Roof Type Functions
function updateRoofType(checkbox) {
    // Uncheck other roof type when one is selected
    const roofOptions = document.querySelectorAll('.roof-option input[type="checkbox"]');
    roofOptions.forEach(option => {
        if (option !== checkbox) {
            option.checked = false;
        }
    });
}

// Quote Form Functions
function initializeQuoteForm() {
    quoteForm.addEventListener('submit', handleQuoteSubmission);
}

function handleQuoteSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(quoteForm);
    
    // Validate form
    const quoteData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        monthlyBill: formData.get('monthly-bill'),
        message: formData.get('message')
    };
    
    if (!validateQuoteForm(quoteData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Send form data to PHP handler
    fetch('contact-handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            quoteForm.reset();
        } else {
            showMessage(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Sorry, there was an error sending your request. Please try again or call us directly.', 'error');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function validateQuoteForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Please enter a valid phone number');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('<br>'));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage() {
    showMessage('Thank you! We\'ll contact you within 24 hours with your free solar quote.', 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    messageEl.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
    `;
    
    // Insert message
    quoteForm.insertBefore(messageEl, quoteForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Scroll Effects
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .feature, .stat');
    animateElements.forEach(el => observer.observe(el));
}

// Animations
function initializeAnimations() {
    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number based on original format
        const originalText = element.textContent;
        if (originalText.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else if (originalText.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else if (originalText.includes('MW')) {
            element.textContent = Math.floor(current) + 'MW+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for form messages
const style = document.createElement('style');
style.textContent = `
    .form-message .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .form-message i {
        font-size: 1.2rem;
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Google Analytics (replace with your tracking ID)
function initializeAnalytics() {
    // Add your Google Analytics code here
    // gtag('config', 'GA_MEASUREMENT_ID');
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAnalytics);