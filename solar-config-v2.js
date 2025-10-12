// Solar Admin Portal V2 - Data Bridge
// This file connects the admin portal data to the main website

// Data structure from admin portal V2
let adminPortalData = null;

// Load data from localStorage (where admin portal stores it)
async function loadAdminPortalData() {
    try {
        const savedData = localStorage.getItem('stp-solar-pricing');
        if (savedData) {
            adminPortalData = JSON.parse(savedData);
            console.log('Admin portal data loaded from localStorage:', adminPortalData);
            return true;
        }
    } catch (error) {
        console.error('Error loading admin portal data:', error);
    }
    
    return false;
}

// Fallback hardcoded configuration (in case JSON loading fails)
function loadHardcodedFallback() {
    console.log('Loading hardcoded fallback configuration...');
    
    adminPortalData = {
        "inverters": [
            {"id": "1760086985630", "name": "Sunsynk 5kw Inverter", "price": 18501},
            {"id": "1760094530867", "name": "Sunsynk 8kw Inverter", "price": 29850}
        ],
        "batteries": [
            {"id": "1760086997776", "name": "Sunsynk 5kwh Battery", "price": 18500},
            {"id": "1760088163979", "name": "Sunsynk 10kwh Battery", "price": 49000}
        ],
        "panels": [
            {"id": "JA-Solar-565W", "name": "JA-Solar-565W", "price": 668},
            {"id": "Canadian-Solar-565W", "name": "Canadian-Solar-565W", "price": 898}
        ],
        "rooftypes": [
            {"id": "1760087030225", "name": "IBR/Tile", "price": 1200},
            {"id": "1760087725944", "name": "Concrete", "price": 2200}
        ],
        "phases": [
            {"id": "1760087039882", "name": "Three Phase"},
            {"id": "1760087693534", "name": "Single Phase"}
        ],
        "accessories": [
            {"id": "1760087048300", "name": "Accessories", "price": 12500}
        ],
        "installation": [
            {"id": "1760087063540", "name": "Installation", "price": 12500}
        ],
        "systems": [
            {
                "id": "1760087099409",
                "name": "Sunsynk 5kw System",
                "inverter": "1760086985630",
                "batteries": ["1760086997776", "1760088163979"],
                "batteryMin": 1,
                "batteryMax": 10,
                "panels": ["JA-Solar-565W", "Canadian-Solar-565W"],
                "panelMin": 6,
                "panelMax": 50,
                "rooftypes": ["1760087030225", "1760087725944"],
                "defaultRoofType": "1760087030225",
                "phase": "1760087693534",
                "accessories": "1760087048300",
                "installation": "1760087063540"
            },
            {
                "id": "1760094621418",
                "name": "Sunsynk 8kw System",
                "inverter": "1760094530867",
                "batteries": ["1760086997776", "1760088163979"],
                "batteryMin": 1,
                "batteryMax": 10,
                "panels": ["JA-Solar-565W", "Canadian-Solar-565W"],
                "panelMin": 6,
                "panelMax": 50,
                "rooftypes": ["1760087030225", "1760087725944"],
                "defaultRoofType": "1760087725944",
                "phase": "1760087693534",
                "accessories": "1760087048300",
                "installation": "1760087063540"
            }
        ]
    };
    
    console.log('Hardcoded fallback loaded successfully');
    console.log('Number of systems:', adminPortalData.systems.length);
    return true;
}

// Fallback function to load from exported JSON (for testing)
async function loadFromJSONFile() {
    try {
        console.log('Fetching solar-config-live.json...');
        const response = await fetch('solar-config-live.json?v=' + Date.now());
        console.log('Fetch response status:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('JSON data received:', data);
            
            // Validate the data structure
            if (data && data.systems && Array.isArray(data.systems)) {
                adminPortalData = data;
                console.log('Admin portal data loaded from JSON file successfully');
                console.log('Number of systems:', data.systems.length);
                return true;
            } else {
                console.error('Invalid data structure in JSON file:', data);
                return false;
            }
        } else {
            console.error('Failed to fetch JSON file:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error loading from JSON file:', error);
        console.error('Error details:', error.message, error.stack);
    }
    
    console.error('Failed to load admin portal data from JSON');
    return false;
}

// Get available system types
function getSystemTypes() {
    console.log('getSystemTypes called, adminPortalData:', adminPortalData);
    
    if (!adminPortalData) {
        console.error('adminPortalData is null or undefined');
        return [];
    }
    
    if (!adminPortalData.systems) {
        console.error('adminPortalData.systems is missing');
        return [];
    }
    
    console.log('Found systems:', adminPortalData.systems);
    
    return adminPortalData.systems.map(system => ({
        id: system.id,
        name: system.name,
        phase: system.phase
    }));
}

// Get available phase types
function getPhaseTypes() {
    console.log('getPhaseTypes called, adminPortalData:', adminPortalData);
    
    if (!adminPortalData) {
        console.error('adminPortalData is null or undefined');
        return [];
    }
    
    if (!adminPortalData.phases) {
        console.error('adminPortalData.phases is missing');
        return [];
    }
    
    console.log('Found phases:', adminPortalData.phases);
    
    return adminPortalData.phases.map(phase => ({
        id: phase.id,
        name: phase.name
    }));
}

// Get system configuration by ID
function getSystemConfig(systemId) {
    if (!adminPortalData || !adminPortalData.systems) {
        return null;
    }
    
    return adminPortalData.systems.find(system => system.id === systemId);
}

// Get phase information by ID
function getPhaseInfo(phaseId) {
    if (!adminPortalData || !adminPortalData.phases) {
        return null;
    }
    
    return adminPortalData.phases.find(phase => phase.id === phaseId);
}

// Get component by ID and type
function getComponent(componentId, type) {
    if (!adminPortalData || !adminPortalData[type]) {
        return null;
    }
    
    return adminPortalData[type].find(item => item.id === componentId);
}

// Get available inverters for a system
function getSystemInverters(systemId) {
    const system = getSystemConfig(systemId);
    if (!system || !system.inverter) {
        return [];
    }
    
    const inverter = getComponent(system.inverter, 'inverters');
    return inverter ? [inverter] : [];
}

// Get available batteries for a system
function getSystemBatteries(systemId) {
    const system = getSystemConfig(systemId);
    if (!system || !system.batteries) {
        return [];
    }
    
    return system.batteries.map(batteryId => getComponent(batteryId, 'batteries')).filter(Boolean);
}

// Get available panels for a system
function getSystemPanels(systemId) {
    const system = getSystemConfig(systemId);
    if (!system || !system.panels) {
        return [];
    }
    
    return system.panels.map(panelId => getComponent(panelId, 'panels')).filter(Boolean);
}

// Get available roof types for a system
function getSystemRoofTypes(systemId) {
    const system = getSystemConfig(systemId);
    if (!system || !system.rooftypes) {
        return [];
    }
    
    return system.rooftypes.map(roofId => getComponent(roofId, 'rooftypes')).filter(Boolean);
}

// Get system default roof type
function getSystemDefaultRoofType(systemId) {
    const system = getSystemConfig(systemId);
    if (!system) {
        return null;
    }
    
    return system.defaultRoofType || null;
}

// Get system quantity limits
function getSystemLimits(systemId) {
    const system = getSystemConfig(systemId);
    if (!system) {
        return null;
    }
    
    return {
        batteryMin: system.batteryMin || 0,
        batteryMax: system.batteryMax || 10,
        panelMin: system.panelMin || 0,
        panelMax: system.panelMax || 50
    };
}

// Calculate system price dynamically
function calculateDynamicSystemPrice(systemConfig, quantities = {}) {
    if (!adminPortalData) {
        return 0;
    }
    
    let totalPrice = 0;
    
    // Inverter price
    if (systemConfig.inverter) {
        const inverter = getComponent(systemConfig.inverter, 'inverters');
        if (inverter) {
            totalPrice += parseFloat(inverter.price) || 0;
        }
    }
    
    // Battery prices - only calculate for the currently selected battery
    if (quantities.batteryId && quantities.batteryCount) {
        const battery = getComponent(quantities.batteryId, 'batteries');
        if (battery) {
            totalPrice += (parseFloat(battery.price) || 0) * quantities.batteryCount;
        }
    }
    
    // Panel prices - only calculate for the currently selected panel
    if (quantities.panelId && quantities.panelCount) {
        const panel = getComponent(quantities.panelId, 'panels');
        if (panel) {
            totalPrice += (parseFloat(panel.price) || 0) * quantities.panelCount;
        }
    }
    
    // Roof type mounting kit price (per panel)
    if (quantities.roofType && quantities.panelCount) {
        const roofType = getComponent(quantities.roofType, 'rooftypes');
        if (roofType) {
            totalPrice += (parseFloat(roofType.price) || 0) * quantities.panelCount;
        }
    }
    
    // Accessories price
    if (systemConfig.accessories) {
        const accessories = getComponent(systemConfig.accessories, 'accessories');
        if (accessories) {
            totalPrice += parseFloat(accessories.price) || 0;
        }
    }
    
    // Installation price
    if (systemConfig.installation) {
        const installation = getComponent(systemConfig.installation, 'installation');
        if (installation) {
            totalPrice += parseFloat(installation.price) || 0;
        }
    }
    
    return Math.round(totalPrice);
}

// Validate system limits
function validateSystemLimits(systemId, quantities) {
    const limits = getSystemLimits(systemId);
    if (!limits) {
        return { valid: false, message: 'System limits not found' };
    }
    
    // Validate battery count
    if (quantities.batteryCount !== undefined) {
        if (quantities.batteryCount < limits.batteryMin || quantities.batteryCount > limits.batteryMax) {
            return { 
                valid: false, 
                message: `Battery count must be between ${limits.batteryMin} and ${limits.batteryMax}` 
            };
        }
    }
    
    // Validate panel count
    if (quantities.panelCount !== undefined) {
        if (quantities.panelCount < limits.panelMin || quantities.panelCount > limits.panelMax) {
            return { 
                valid: false, 
                message: `Panel count must be between ${limits.panelMin} and ${limits.panelMax}` 
            };
        }
    }
    
    return { valid: true };
}

// Get system display name
function getSystemDisplayName(systemId) {
    const system = getSystemConfig(systemId);
    return system ? system.name : 'Unknown System';
}

// Get phase display name
function getPhaseDisplayName(phaseId) {
    const phase = getPhaseInfo(phaseId);
    return phase ? phase.name : 'Unknown Phase';
}

// Initialize the data bridge
async function initializeDataBridge() {
    console.log('=== Initializing Solar Admin Portal V2 data bridge ===');
    
    // First try localStorage
    console.log('Step 1: Trying localStorage...');
    let dataLoaded = await loadAdminPortalData();
    console.log('localStorage result:', dataLoaded);
    
    // If localStorage is empty, try loading from JSON file
    if (!dataLoaded) {
        console.log('Step 2: localStorage empty, trying JSON file...');
        dataLoaded = await loadFromJSONFile();
        console.log('JSON file result:', dataLoaded);
        console.log('adminPortalData after JSON attempt:', adminPortalData);
    }
    
    // If JSON loading failed, use hardcoded fallback
    if (!dataLoaded) {
        console.log('Step 3: JSON failed, using hardcoded fallback...');
        dataLoaded = loadHardcodedFallback();
        console.log('Hardcoded fallback result:', dataLoaded);
        console.log('adminPortalData after fallback:', adminPortalData);
    }
    
    // Final verification
    console.log('=== Data loading complete ===');
    console.log('Final dataLoaded status:', dataLoaded);
    console.log('Final adminPortalData:', adminPortalData);
    
    if (dataLoaded && adminPortalData) {
        console.log('✓ Admin portal data bridge initialized successfully');
        const systemTypes = getSystemTypes();
        console.log('✓ Available system types:', systemTypes);
        console.log('✓ Number of systems:', systemTypes.length);
    } else {
        console.error('✗ CRITICAL: Failed to load any configuration data!');
        console.error('✗ dataLoaded:', dataLoaded, 'adminPortalData:', adminPortalData);
    }
    
    return dataLoaded;
}

// Export functions for use in main website
window.SolarConfigV2 = {
    loadAdminPortalData,
    getSystemTypes,
    getPhaseTypes,
    getSystemConfig,
    getPhaseInfo,
    getComponent,
    getSystemInverters,
    getSystemBatteries,
    getSystemPanels,
    getSystemRoofTypes,
    getSystemDefaultRoofType,
    getSystemLimits,
    calculateDynamicSystemPrice,
    validateSystemLimits,
    getSystemDisplayName,
    getPhaseDisplayName,
    initializeDataBridge
};

// Note: Auto-initialization is now handled in index.html to properly await the async operation

console.log('Solar Admin Portal V2 data bridge loaded');
