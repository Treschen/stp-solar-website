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
    console.log('System builder initialized');
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
    const singlePhaseSystems = [];
    const threePhaseSystems = [];
    
    // Get available components from pricing data
    const inverters = currentPricing.inverters || {};
    const batteries = currentPricing.batteries || {};
    const panels = currentPricing.panels || {};
    const installation = currentPricing.installation || {};
    const markup = currentPricing.markup || {};
    
    // Create systems for each available inverter
    Object.entries(inverters).forEach(([inverterKey, inverterData]) => {
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
        
        const system = {
            id: `${isThreePhase ? 'three' : 'single'}-${capacity}kw`,
            name: `${capacity}kW ${inverterName} System`,
            inverter: { 
                name: inverterName, 
                price: (inverterPrice || 25000) * (markup.inverter || 1.2) 
            },
            battery: { 
                name: batteryKey.replace(/-/g, ' '), 
                price: (batteries[batteryKey] || 45000) * (markup.battery || 1.15), 
                quantity: batteryQuantity 
            },
            panel: { 
                name: panelKey.replace(/-/g, ' '), 
                price: (panels[panelKey] || 2500) * (markup.panels || 1.1), 
                quantity: panelQuantity 
            },
            installation: (() => {
                // Use installation costs from inverter definition or fallback to system-specific costs
                let baseCost, accessoriesCost;
                
                if (typeof inverterData === 'object' && inverterData.installation) {
                    // New format - use installation costs from inverter definition
                    baseCost = inverterData.installation.base || 0;
                    accessoriesCost = inverterData.installation.accessories || 0;
                    
                    // If linked to an installation package, use that instead
                    if (inverterData.linkedInstallation && currentPricing.installationDefinitions) {
                        const linkedInstallation = currentPricing.installationDefinitions[inverterData.linkedInstallation];
                        if (linkedInstallation) {
                            baseCost = linkedInstallation.base || baseCost;
                            accessoriesCost = linkedInstallation.accessories || accessoriesCost;
                        }
                    }
                } else {
                    // Old format - use system-specific installation costs
                    const baseKey = isThreePhase ? 'three-base-installation' : 'single-base-installation';
                    const accessoriesKey = isThreePhase ? 'three-accessories' : 'single-accessories';
                    baseCost = installation[baseKey] || (isThreePhase ? 12000 : 8500);
                    accessoriesCost = installation[accessoriesKey] || (isThreePhase ? 20000 : 15000);
                }
                
                const total = (baseCost + accessoriesCost) * (markup.installation || 1);
                console.log(`Installation calculation for ${inverterKey}: base=${baseCost}, accessories=${accessoriesCost}, total=${total}`);
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
            const system = {
                id: `single-${batteryKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: `${batteryKey.replace(/-/g, ' ')} System`,
                inverter: null, // Tesla Powerwall doesn't need an inverter
                battery: { 
                    name: batteryKey.replace(/-/g, ' '), 
                    price: (batteryPrice || 180000) * (markup.battery || 1.15), 
                    quantity: 1 
                },
                panel: null, // Solar panels are optional
                installation: ((installation['tesla-base-installation'] || 10000) + 
                             (installation['tesla-accessories'] || 18000)) * (markup.installation || 1)
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
    updatePricing();
}

function adjustPanels(change) {
    const quantityEl = document.getElementById('panels-quantity');
    let currentQuantity = parseInt(quantityEl.textContent);
    let newQuantity = currentQuantity + change;
    
    if (newQuantity >= 0 && newQuantity <= 50) {
        quantityEl.textContent = newQuantity;
        updatePricing();
    }
}

function adjustBatteries(change) {
    const quantityEl = document.getElementById('batteries-quantity');
    let currentQuantity = parseInt(quantityEl.textContent);
    let newQuantity = currentQuantity + change;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantityEl.textContent = newQuantity;
        updatePricing();
    }
}

function updatePricing() {
    if (!currentSystem) return;
    
    const panelQuantity = parseInt(document.getElementById('panels-quantity').textContent);
    const batteryQuantity = parseInt(document.getElementById('batteries-quantity').textContent);
    
    const inverterPrice = currentSystem.inverter.price;
    const batteryPrice = currentSystem.battery.price * batteryQuantity;
    const panelPrice = currentSystem.panel.price * panelQuantity;
    const installationPrice = currentSystem.installation;
    
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

function calculateSystemPrice(system) {
    let total = 0;
    if (system.inverter) total += system.inverter.price;
    if (system.battery) total += (system.battery.price * system.battery.quantity);
    if (system.panel) total += (system.panel.price * system.panel.quantity);
    if (system.installation) total += system.installation;
    return total;
}

// Old hardcoded systemConfigs removed - now using dynamic systems from pricing data

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

// Test functions removed - now using the main system builder functionality

function displaySystems(phase) {
    // Use the dynamically generated systems instead of hardcoded systemConfigs
    const phaseSystems = systems[phase];
    systemsGrid.innerHTML = '';
    
    if (phaseSystems && phaseSystems.length > 0) {
        phaseSystems.forEach(system => {
            const systemCard = createSystemCard(system);
            systemsGrid.appendChild(systemCard);
        });
    } else {
        console.warn('No systems found for phase:', phase);
        systemsGrid.innerHTML = '<p>No systems available for this phase.</p>';
    }
}

function createSystemCard(system) {
    const card = document.createElement('div');
    card.className = 'system-card';
    card.dataset.systemId = system.id;
    
    // Calculate total price for the system
    const totalPrice = calculateSystemPrice(system);
    
    card.innerHTML = `
        <h4>${system.name}</h4>
        ${system.inverter ? `<p><strong>Inverter:</strong> ${system.inverter.name}</p>` : ''}
        <p><strong>Batteries:</strong> ${system.battery.quantity}x ${system.battery.name}</p>
        ${system.panel ? `<p><strong>Panels:</strong> ${system.panel.quantity}x ${system.panel.name}</p>` : '<p><strong>Panels:</strong> Optional (add separately)</p>'}
        <div class="system-price">R${totalPrice.toLocaleString('en-ZA')}</div>
    `;
    
    card.addEventListener('click', function() {
        selectSystem(system);
    });
    
    return card;
}

function selectSystem(system) {
    console.log('System selected:', system.name);
    currentSystem = system;
    
    // Update system selection UI
    document.querySelectorAll('.system-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    document.querySelector(`[data-system-id="${system.id}"]`).classList.add('selected');
    
    // Initialize customization
    initializeCustomization(system);
    
    // Show customization section
    const customizationSection = document.getElementById('customization-section');
    if (customizationSection) {
        customizationSection.style.display = 'block';
    }
}

// Old system customization functions removed - now using the main system builder

function compareSystems() {
    // This would open a comparison modal or redirect to a comparison page
    alert('System comparison feature coming soon!');
}

function calculateSolarSavings() {
    const monthlyBill = parseFloat(monthlyBillInput.value) || 0;
    const roofSize = parseFloat(roofSizeInput.value) || 0;
    const location = locationSelect.value;
    const systemType = systemTypeSelect.value;

    if (monthlyBill <= 0) {
        hideResults();
        return;
    }

    // Solar calculation logic
    const results = performSolarCalculation(monthlyBill, roofSize, location, systemType);
    displayResults(results);
}

function performSolarCalculation(monthlyBill, roofSize, location, systemType) {
    // Current electricity cost in South Africa (R/kWh) - Updated 2024
    const electricityCost = 3.2; // R/kWh (increased from load shedding and inflation)
    
    // Average daily sun hours by location (South African data)
    const sunHours = {
        'jhb': 6.8, // Johannesburg - High sun exposure
        'cpt': 6.2, // Cape Town - Good sun, some winter clouds
        'dbn': 5.8, // Durban - Good sun, some humidity
        'pta': 6.9, // Pretoria - Excellent sun exposure
        'other': 6.3 // Default - Average South African sun
    };
    
    // System efficiency factors based on STP Solar equipment
    const efficiencyFactors = {
        'grid-tie': 0.88, // JA Solar/Canadian Solar panels with Sigenstor/Sunsynk inverters
        'hybrid': 0.85,   // With battery storage
        'off-grid': 0.82  // Full off-grid with Tesla Powerwall 3
    };
    
    // Calculate monthly kWh consumption
    const monthlyKwh = monthlyBill / electricityCost;
    
    // Calculate required system size (kW)
    const dailyKwh = monthlyKwh / 30;
    const systemSize = Math.min(
        dailyKwh / (sunHours[location] * efficiencyFactors[systemType]),
        roofSize * 0.18 // Max 180W per m² (modern panels)
    );
    
    // Round to nearest 0.5kW and ensure minimum viable size
    const roundedSystemSize = Math.max(Math.round(systemSize * 2) / 2, 3.0);
    
    // Calculate monthly generation
    const monthlyGeneration = roundedSystemSize * sunHours[location] * 30 * efficiencyFactors[systemType];
    
    // Calculate savings (assuming 95% of generation is used)
    const monthlySavings = Math.min(monthlyGeneration * 0.95 * electricityCost, monthlyBill * 0.95);
    const annualSavings = monthlySavings * 12;
    
    // STP Solar pricing (R/kW) - Real market pricing 2024
    const systemCosts = {
        'grid-tie': 18000, // R18,000 per kW - JA Solar/Canadian Solar + Sigenstor/Sunsynk
        'hybrid': 25000,   // R25,000 per kW - With battery backup
        'off-grid': 35000  // R35,000 per kW - Tesla Powerwall 3 system
    };
    
    const systemCost = roundedSystemSize * systemCosts[systemType];
    const paybackPeriod = systemCost / annualSavings;
    
    // Calculate 25-year savings
    const twentyFiveYearSavings = (annualSavings * 25) - systemCost;
    
    // Get system recommendations
    const recommendations = getSystemRecommendations(roundedSystemSize, systemType, location);
    
    return {
        systemSize: roundedSystemSize,
        monthlySavings: monthlySavings,
        annualSavings: annualSavings,
        paybackPeriod: paybackPeriod,
        systemCost: systemCost,
        twentyFiveYearSavings: twentyFiveYearSavings,
        recommendations: recommendations,
        monthlyGeneration: monthlyGeneration
    };
}

function getSystemRecommendations(systemSize, systemType, location) {
    const recommendations = {
        panels: [],
        inverters: [],
        batteries: [],
        accessories: []
    };
    
    // Panel recommendations based on system size
    if (systemSize <= 5) {
        recommendations.panels = [
            { brand: 'JA Solar', model: 'JAM60S20-540/MR', quantity: Math.ceil(systemSize * 1000 / 540), power: '540W' },
            { brand: 'Canadian Solar', model: 'CS3K-540MS', quantity: Math.ceil(systemSize * 1000 / 540), power: '540W' }
        ];
    } else if (systemSize <= 10) {
        recommendations.panels = [
            { brand: 'JA Solar', model: 'JAM72S20-550/MR', quantity: Math.ceil(systemSize * 1000 / 550), power: '550W' },
            { brand: 'Canadian Solar', model: 'CS3K-550MS', quantity: Math.ceil(systemSize * 1000 / 550), power: '550W' }
        ];
    } else {
        recommendations.panels = [
            { brand: 'JA Solar', model: 'JAM72S20-600/MR', quantity: Math.ceil(systemSize * 1000 / 600), power: '600W' },
            { brand: 'Canadian Solar', model: 'CS3K-600MS', quantity: Math.ceil(systemSize * 1000 / 600), power: '600W' }
        ];
    }
    
    // Inverter recommendations
    if (systemType === 'grid-tie') {
        recommendations.inverters = [
            { brand: 'Sigenstor', model: 'SG5K-DT', capacity: '5kW', price: 15000 },
            { brand: 'Sunsynk', model: '5K-SG01LP1', capacity: '5kW', price: 18000 }
        ];
    } else if (systemType === 'hybrid') {
        recommendations.inverters = [
            { brand: 'Sunsynk', model: '5K-SG01LP1', capacity: '5kW Hybrid', price: 25000 },
            { brand: 'Sigenstor', model: 'SG5K-DT-H', capacity: '5kW Hybrid', price: 22000 }
        ];
    } else {
        recommendations.inverters = [
            { brand: 'Tesla', model: 'Powerwall 3', capacity: '13.5kWh', price: 180000 }
        ];
    }
    
    // Battery recommendations for hybrid/off-grid
    if (systemType !== 'grid-tie') {
        recommendations.batteries = [
            { brand: 'Tesla', model: 'Powerwall 3', capacity: '13.5kWh', price: 180000 },
            { brand: 'Sunsynk', model: '5.12kWh Battery', capacity: '5.12kWh', price: 45000 }
        ];
    }
    
    // Accessories
    recommendations.accessories = [
        'DC Isolator Switches',
        'AC Distribution Board',
        'Earthing System',
        'Lightning Protection',
        'Monitoring System'
    ];
    
    return recommendations;
}

function displayResults(results) {
    const systemSizeEl = document.getElementById('system-size');
    const monthlySavingsEl = document.getElementById('monthly-savings');
    const annualSavingsEl = document.getElementById('annual-savings');
    const paybackPeriodEl = document.getElementById('payback-period');
    
    systemSizeEl.textContent = `${results.systemSize}kW`;
    monthlySavingsEl.textContent = `R${results.monthlySavings.toLocaleString('en-ZA', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
    annualSavingsEl.textContent = `R${results.annualSavings.toLocaleString('en-ZA', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
    paybackPeriodEl.textContent = `${results.paybackPeriod.toFixed(1)} years`;
    
    // Add detailed system information
    displaySystemDetails(results);
    
    calculatorResults.style.display = 'block';
    calculatorResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displaySystemDetails(results) {
    // Create or update system details section
    let detailsSection = document.getElementById('system-details');
    if (!detailsSection) {
        detailsSection = document.createElement('div');
        detailsSection.id = 'system-details';
        detailsSection.className = 'system-details';
        calculatorResults.appendChild(detailsSection);
    }
    
    detailsSection.innerHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <h4>System Cost</h4>
                <p>R${results.systemCost.toLocaleString('en-ZA', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
            </div>
            <div class="detail-item">
                <h4>25-Year Savings</h4>
                <p>R${results.twentyFiveYearSavings.toLocaleString('en-ZA', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
            </div>
            <div class="detail-item">
                <h4>Monthly Generation</h4>
                <p>${results.monthlyGeneration.toFixed(0)} kWh</p>
            </div>
        </div>
        
        <div class="recommendations">
            <h4>Recommended Equipment</h4>
            <div class="equipment-grid">
                <div class="equipment-category">
                    <h5>Solar Panels</h5>
                    ${results.recommendations.panels.map(panel => `
                        <div class="equipment-item">
                            <strong>${panel.brand} ${panel.model}</strong><br>
                            ${panel.quantity} panels × ${panel.power}
                        </div>
                    `).join('')}
                </div>
                
                <div class="equipment-category">
                    <h5>Inverters</h5>
                    ${results.recommendations.inverters.map(inverter => `
                        <div class="equipment-item">
                            <strong>${inverter.brand} ${inverter.model}</strong><br>
                            ${inverter.capacity}
                        </div>
                    `).join('')}
                </div>
                
                ${results.recommendations.batteries.length > 0 ? `
                <div class="equipment-category">
                    <h5>Battery Storage</h5>
                    ${results.recommendations.batteries.map(battery => `
                        <div class="equipment-item">
                            <strong>${battery.brand} ${battery.model}</strong><br>
                            ${battery.capacity}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

function hideResults() {
    calculatorResults.style.display = 'none';
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
