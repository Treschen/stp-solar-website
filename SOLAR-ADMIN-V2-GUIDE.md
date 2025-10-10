# Solar Admin Portal V2 - Complete Guide

## Overview
The Solar Admin Portal V2 is a complete system builder that allows you to define all pricing components and create flexible solar systems without any hardcoded values. This system gives you full control over your product offerings.

## Features

### 1. **Price Definitions** (7 Categories)
Define all your pricing components once, then use them across multiple systems:

- **Inverters** - Define inverter types with prices
- **Batteries** - Define battery types with prices  
- **Solar Panels** - Define solar panel types with prices
- **Roof Types** - Define roof types with mounting kit prices (per panel)
- **Installation Phases** - Define single/3-phase with prices
- **Accessories** - Define accessory packages with prices
- **Installation** - Define installation types with prices

### 2. **System Builder**
Create complete systems by combining components:
- Select 1 inverter (required)
- Select multiple battery types (with min/max quantity rules)
- Select multiple panel types (with min/max quantity rules)
- Select multiple roof types (customer chooses 1)
- Select 1 installation phase (required)
- Select 1 accessory package
- Select 1 installation type

### 3. **Import/Export**
- Export your complete configuration as JSON
- Import configurations to restore or transfer settings
- Perfect for backups and testing

## Getting Started

### Step 1: Define Your Components

1. **Open the Admin Portal**
   - Navigate to `admin-pricing-v2.html`
   - The portal opens directly (no login required in standalone version)

2. **Add Inverters**
   - Click "Inverters" tab
   - Click "Add Inverter"
   - Enter name (e.g., "Sunsynk 5kW") and price (e.g., 25000)
   - Click "Save"
   - Repeat for all your inverter types

3. **Add Batteries**
   - Click "Batteries" tab
   - Click "Add Battery"
   - Enter name (e.g., "Sunsynk 5.12kWh") and price (e.g., 45000)
   - Click "Save"
   - Repeat for all battery types

4. **Add Solar Panels**
   - Click "Solar Panels" tab
   - Click "Add Solar Panel"
   - Enter name (e.g., "JA Solar 565W") and price (e.g., 2500)
   - Click "Save"
   - Repeat for all panel types

5. **Add Roof Types**
   - Click "Roof Types" tab
   - Click "Add Roof Type"
   - Enter name (e.g., "Slate Roof") and mounting kit price per panel (e.g., 250)
   - Click "Save"
   - Repeat for all roof types (IBR, Tile, Concrete, etc.)

6. **Add Installation Phases**
   - Click "Installation Phases" tab
   - Click "Add Phase Type"
   - Enter name (e.g., "Single Phase") and price (e.g., 8500)
   - Click "Save"
   - Add "3 Phase" with its price

7. **Add Accessories**
   - Click "Accessories" tab
   - Click "Add Accessory"
   - Enter name (e.g., "Standard Accessories Package") and price (e.g., 15000)
   - Click "Save"
   - Repeat for different accessory packages

8. **Add Installation Types**
   - Click "Installation" tab
   - Click "Add Installation Type"
   - Enter name (e.g., "Standard Installation") and price (e.g., 12000)
   - Click "Save"
   - Repeat for different installation options

### Step 2: Build Your Systems

1. **Click "System Builder" Tab**

2. **Click "Create New System"**

3. **Enter System Name**
   - Example: "Sunsynk System", "Deye System", "Tesla Powerwall System"

4. **Select Components:**

   **Inverter (Choose 1):**
   - Click the radio button next to the inverter for this system
   - Only one can be selected

   **Batteries (Choose Multiple):**
   - Check all battery types that can be used with this system
   - Set Min Batteries: 
     - `0` = Batteries NOT allowed (shows "not available" on website)
     - `1+` = Minimum required
   - Set Max Batteries: Maximum allowed for this system

   **Solar Panels (Choose Multiple):**
   - Check all panel types that can be used with this system
   - Set Min Panels:
     - `0` = Panels optional (customer can select 0)
     - `6+` = Minimum required if customer wants panels
   - Set Max Panels: Maximum allowed for this system

   **Roof Types (Choose Multiple):**
   - Check all roof types available for this system
   - Customer will select only 1 on the main website
   - Price multiplies by panel quantity automatically

   **Installation Phase (Choose 1):**
   - Select Single Phase or 3 Phase
   - This determines what shows in "Select your power type" on main site

   **Accessories (Choose 1):**
   - Select the accessory package for this system

   **Installation (Choose 1):**
   - Select the installation type for this system

5. **Click "Save System"**

### Step 3: Save & Export

1. **Click "Save All Changes"** in the top toolbar
   - This saves to browser localStorage

2. **Export Configuration** (Recommended)
   - Click "Export Config"
   - Downloads a JSON file with timestamp
   - Keep this as a backup!

## How It Works on the Main Website

### Panel Quantity Logic:
- If `panelMin = 0`: Customer can select 0 panels
  - At 0 panels: Panel price = R0, Mounting Kit = R0
  - At 1+ panels: Must jump to minimum (e.g., 6 panels)
- If `panelMin = 6`: Customer must select at least 6 panels
  - Cannot go to 0

### Battery Quantity Logic:
- If `batteryMin = 0`: System shows "Batteries not available"
- If `batteryMin = 1`: Customer must select at least 1 battery
- Customer can select from 1 to max defined

### Mounting Kit Pricing:
- Automatically calculated as: `roofTypePrice × panelQuantity`
- Shows as separate line item: "Solar Panel Mounting Kit"
- If panels = 0, mounting kit = R0

### System Selection:
On the main website, customers will see:
1. **Choose Your System** - Dropdown showing all system names
2. **Select Your Power Type** - Shows the installation phase (Single/3 Phase)
3. **Customize Your System** - Shows available batteries, panels, roof types

## Example Configurations

### Example 1: Sunsynk System
```
Name: Sunsynk System
Inverter: Sunsynk 5kW (R25,000)
Batteries: 
  - Sunsynk 5.12kWh (R45,000) ✓
  - Sunsynk 10kWh (R90,000) ✓
  Min: 1, Max: 10
Panels:
  - JA Solar 565W (R2,500) ✓
  - Canadian Solar 565W (R2,600) ✓
  Min: 6, Max: 50
Roof Types:
  - Slate (R250/panel) ✓
  - IBR (R200/panel) ✓
  - Tile (R300/panel) ✓
Phase: Single Phase (R8,500)
Accessories: Standard Package (R15,000)
Installation: Standard (R12,000)
```

### Example 2: Tesla Powerwall System (No Batteries)
```
Name: Tesla Powerwall System
Inverter: Tesla Powerwall 3 (R150,000)
Batteries: None available
  Min: 0, Max: 0
Panels:
  - JA Solar 565W (R2,500) ✓
  Min: 0, Max: 40
Roof Types: All types ✓
Phase: 3 Phase (R12,000)
Accessories: Premium Package (R20,000)
Installation: Premium (R15,000)
```

## Import/Export Format

The JSON export contains:
```json
{
  "inverters": [
    {"id": "1234567890", "name": "Sunsynk 5kW", "price": 25000}
  ],
  "batteries": [...],
  "panels": [...],
  "rooftypes": [...],
  "phases": [...],
  "accessories": [...],
  "installation": [...],
  "systems": [
    {
      "id": "1234567891",
      "name": "Sunsynk System",
      "inverter": "1234567890",
      "batteries": ["id1", "id2"],
      "batteryMin": 1,
      "batteryMax": 10,
      "panels": ["id1", "id2"],
      "panelMin": 6,
      "panelMax": 50,
      "rooftypes": ["id1", "id2", "id3"],
      "phase": "phase_id",
      "accessories": "acc_id",
      "installation": "inst_id"
    }
  ]
}
```

## Integration with Main Website

### Required Files:
1. `admin-pricing-v2.html` - Admin portal (this file)
2. `solar-config-v2.js` - Configuration reader/calculator

### In Your Main Website (index.html):
```html
<!-- Add this script -->
<script src="solar-config-v2.js"></script>

<!-- Use the API -->
<script>
  // Get all systems
  const systems = solarConfigV2.getSystems();
  
  // Get specific system
  const system = solarConfigV2.getSystemById('system-id');
  
  // Calculate price
  const price = solarConfigV2.calculateSystemPrice('system-id', {
    batteryType: 'battery-id',
    batteryQuantity: 2,
    panelType: 'panel-id',
    panelQuantity: 12,
    roofType: 'roof-id'
  });
  
  // Get price breakdown
  const breakdown = solarConfigV2.getPriceBreakdown('system-id', config);
  
  // Validate configuration
  const validation = solarConfigV2.validateConfig('system-id', config);
  if (!validation.valid) {
    console.log(validation.errors);
  }
</script>
```

## Tips & Best Practices

1. **Regular Backups**
   - Export your config weekly
   - Keep multiple backup versions

2. **Testing**
   - Create a test system first
   - Verify pricing calculations
   - Check min/max limits work correctly

3. **Price Updates**
   - Update component prices in the definitions
   - All systems using that component update automatically
   - No need to edit each system

4. **System Organization**
   - Use clear, descriptive system names
   - Group similar systems together
   - Document any special configurations

5. **Before Going Live**
   - Test all quantity limits
   - Verify all prices are correct
   - Export a backup
   - Test integration with main website

## Troubleshooting

### Data Not Saving
- Check browser localStorage is enabled
- Try a different browser
- Export and reimport your config

### Systems Not Showing on Main Website
- Ensure `solar-config-v2.js` is included in HTML
- Check browser console for errors
- Verify localStorage data exists

### Prices Not Calculating Correctly
- Check all components have prices defined
- Verify system has all required selections
- Use `getPriceBreakdown()` to debug

## Support

For issues or questions:
1. Check this guide first
2. Verify all components are defined
3. Test with a simple system configuration
4. Export your config for review

## Version History

**V2.0** (Initial Release)
- Complete system builder
- 7 component definition categories
- Import/Export functionality
- No hardcoded values
- Full price calculation system
- Validation and error checking

