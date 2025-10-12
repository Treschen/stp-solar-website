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
    
    // Fallback: try to load from the exported JSON file
    return await loadFromJSONFile();
}

// Fallback function to load from exported JSON (for live server)
async function loadFromJSONFile() {
    try {
        console.log('Attempting to load from solar-config-live.json...');
        const response = await fetch('solar-config-live.json');
        if (response.ok) {
            const jsonData = await response.json();
            console.log('Admin portal data loaded from solar-config-live.json');
            
            // Save to localStorage for future use
            localStorage.setItem('stp-solar-pricing', JSON.stringify(jsonData));
            console.log('Data saved to localStorage for future use');
            
            adminPortalData = jsonData;
            return true;
        } else {
            console.warn('Failed to load solar-config-live.json:', response.status);
        }
    } catch (error) {
        console.error('Error loading solar-config-live.json:', error);
    }
    
    console.log('No admin portal data found - using fallback configuration');
    return false;
}

// Get available system types
function getSystemTypes() {
    if (!adminPortalData || !adminPortalData.systems) {
        return [];
    }
    
    return adminPortalData.systems.map(system => ({
        id: system.id,
        name: system.name,
        phase: system.phase
    }));
}

// Get system configuration by ID
function getSystemConfig(systemId) {
    if (!adminPortalData || !adminPortalData.systems) {
        return null;
    }
    
    return adminPortalData.systems.find(system => system.id === systemId);
}

// Get default roof type for a system
function getSystemDefaultRoofType(systemId) {
    const system = getSystemConfig(systemId);
    if (!system || !system.defaultRoofType) {
        return null;
    }
    
    return system.defaultRoofType;
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
    
    // Battery prices
    if (systemConfig.batteries && quantities.batteryCount) {
        systemConfig.batteries.forEach(batteryId => {
            const battery = getComponent(batteryId, 'batteries');
            if (battery) {
                totalPrice += (parseFloat(battery.price) || 0) * quantities.batteryCount;
            }
        });
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
    console.log('Initializing Solar Admin Portal V2 data bridge...');
    
    const dataLoaded = await loadAdminPortalData();
    if (dataLoaded) {
        console.log('Admin portal data bridge initialized successfully');
        console.log('Available systems:', getSystemTypes());
    } else {
        console.log('No admin portal data found - using fallback configuration');
    }
    
    return dataLoaded;
}

// Export functions for use in main website
window.SolarConfigV2 = {
    loadAdminPortalData,
    getSystemTypes,
    getSystemConfig,
    getPhaseInfo,
    getComponent,
    getSystemInverters,
    getSystemBatteries,
    getSystemPanels,
    getSystemRoofTypes,
    getSystemLimits,
    getSystemDefaultRoofType,
    calculateDynamicSystemPrice,
    validateSystemLimits,
    getSystemDisplayName,
    getPhaseDisplayName,
    initializeDataBridge
};

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', async function() {
    await initializeDataBridge();
});

console.log('Solar Admin Portal V2 data bridge loaded');
