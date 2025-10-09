// STP Solar Pricing Configuration
// This file contains all pricing data for the solar system builder

const pricingConfig = {
    // Inverter Prices (R)
    inverters: {
        'Sunsynk-5K': 25000,
        'Sunsynk-5K-name': 'Sunsynk 5kW Inverter'
    },
    
    // Battery Prices (R)
    batteries: {
        'Sunsynk-5.12kWh': 45000,
        'Sunsynk-5.12kWh-name': 'Sunsynk 5.12kWh Battery',
        'Sunsynk-10kWh': 90000,
        'Sunsynk-10kWh-name': 'Sunsynk 10kWh Battery'
    },
    
    // Solar Panel Prices (R)
    panels: {
        'JA-Solar-565W': 2500,
        'JA-Solar-565W-name': 'JA Solar 565W Panel',
        'Canadian-Solar-565W': 2600,
        'Canadian-Solar-565W-name': 'Canadian Solar 565W Panel'
    },
    
    // Installation Costs (R)
    installation: {
        'single-base-installation': 8500,
        'single-accessories': 15000,
        'single-per-panel': 900,  // Additional cost per panel
        'three-base-installation': 12000,
        'three-accessories': 20000,
        'three-per-panel': 1000,  // Additional cost per panel
        'tesla-base-installation': 10000,
        'tesla-accessories': 18000,
        'tesla-per-panel': 950    // Additional cost per panel
    },
    
    // System Limits
    limits: {
        'single-panels-min': 6,
        'single-panels-max': 50,
        'single-batteries-min': 1,
        'single-batteries-max': 10,
        'three-panels-min': 8,
        'three-panels-max': 100,
        'three-batteries-min': 2,
        'three-batteries-max': 20,
        'tesla-panels-min': 0,
        'tesla-panels-max': 40,
        'tesla-units-max': 4
    },
    
    // System Markup (percentage)
    markup: {
        'inverter': 1, // 0% markup
        'battery': 1, // 0% markup
        'panels': 1, // 0% markup
        'installation': 1 // 0% markup
    }
};

// Function to calculate system price
function calculateSystemPrice(systemConfig) {
    let totalPrice = 0;
    
    // Inverter price with markup
    const inverterKey = `${systemConfig.inverter.brand}-${systemConfig.inverter.capacity}`;
    const inverterBasePrice = pricingConfig.inverters[inverterKey] || 0;
    const inverterPrice = inverterBasePrice * pricingConfig.markup.inverter;
    totalPrice += inverterPrice;
    
    // Battery prices with markup
    systemConfig.batteries.forEach(battery => {
        const batteryKey = `${battery.brand}-${battery.capacity}`;
        const batteryBasePrice = pricingConfig.batteries[batteryKey] || 0;
        const batteryPrice = (batteryBasePrice * battery.quantity) * pricingConfig.markup.battery;
        totalPrice += batteryPrice;
    });
    
    // Panel prices with markup
    systemConfig.panels.forEach(panel => {
        const panelKey = `${panel.brand}-${panel.capacity}W`;
        const panelBasePrice = pricingConfig.panels[panelKey] || 0;
        const panelPrice = (panelBasePrice * panel.quantity) * pricingConfig.markup.panels;
        totalPrice += panelPrice;
    });
    
    // Installation cost with markup
    const installationBasePrice = pricingConfig.installation[systemConfig.installation.type] || 0;
    const installationPrice = installationBasePrice * pricingConfig.markup.installation;
    totalPrice += installationPrice;
    
    return totalPrice;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pricingConfig, calculateSystemPrice };
}