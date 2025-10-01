// STP Solar Pricing Configuration
// Update these prices to keep them current with supplier pricing

const pricingConfig = {
    // Inverter Prices (R)
    inverters: {
        'Sunsynk-5kw': {
            name: 'Sunsynk 5kw',
            brand: 'Sunsynk',
            price: 20000,
            type: 'single',
            capacity: 5,
            compatibleBatteries: ['Sunsynk-5.12kWh'],
            compatiblePanels: ['JA-Solar-565W'],
            installation: {
                base: 8550,
                accessories: 12555
            }
        },
        'Deye-5kw': {
            name: 'Deye 5kw',
            brand: 'Deye',
            price: 18555,
            type: 'single',
            capacity: 5,
            compatibleBatteries: ['Sunsynk-5.12kWh'],
            compatiblePanels: ['JA-Solar-565W'],
            installation: {
                base: 8500,
                accessories: 12555
            }
        },
        'Tesla-PW4': {
            name: 'Tesla Powerwall 3',
            brand: 'Tesla',
            price: 16555,
            type: 'single',
            capacity: 13,
            compatibleBatteries: [],
            compatiblePanels: [],
            installation: {
                base: 0,
                accessories: 0
            }
        }
    },
    
    // Battery Prices (R)
    batteries: {
        'Sunsynk-5.12kWh': 45000,
        'Sunsynk-10kWh': 90000
    },
    
    // Solar Panel Prices (R)
    panels: {
        'JA-Solar-565W': 2500,
        'Canadian-Solar-565W': 2600
    },
    
    // Installation & Accessories (R)
    installation: {
        'panel-installation-per-panel': 850,
        'concrete-roof-multiplier': 1.5
    },
    
    // System Quantity Limits
    limits: {
        'single-batteries-min': 1,
        'single-batteries-max': 10,
        'single-panels-min': 6,
        'single-panels-max': 50,
        'three-batteries-min': 2,
        'three-batteries-max': 20,
        'three-panels-min': 8,
        'three-panels-max': 100,
        'tesla-panels-min': 0,
        'tesla-panels-max': 40,
        'tesla-units-max': 4
    },
    
    // System Markup (percentage)
    markup: {
        'inverter': 1.2, // 20% markup
        'battery': 1.15, // 15% markup
        'panels': 1.1, // 10% markup
        'installation': 1.25 // 25% markup
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
    const panelKey = `${systemConfig.panels.brand}-${systemConfig.panels.wattage}W`;
    const panelBasePrice = pricingConfig.panels[panelKey] || 0;
    const panelPrice = (panelBasePrice * systemConfig.panels.quantity) * pricingConfig.markup.panels;
    totalPrice += panelPrice;
    
    // Installation cost - this function is deprecated, use the new system builder instead
    // The new system builder handles installation costs per system type
    const installationPrice = 0; // Installation is now calculated per system type
    totalPrice += installationPrice;
    
    return Math.round(totalPrice);
}

// Function to update pricing in the main system configs
function updateSystemPricing() {
    // This function would be called to update all system prices
    // when the pricing config is updated
    console.log('Pricing updated - refresh the page to see new prices');
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pricingConfig, calculateSystemPrice, updateSystemPricing };
}