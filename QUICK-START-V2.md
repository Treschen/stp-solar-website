# Solar Admin Portal V2 - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### What You Have
1. **admin-pricing-v2.html** - Your admin portal to manage everything
2. **solar-config-v2.js** - JavaScript library for your website
3. **demo-integration-v2.html** - Working example of integration
4. **SOLAR-ADMIN-V2-GUIDE.md** - Complete documentation

---

## Step 1: Open Admin Portal (2 minutes)

1. Open `admin-pricing-v2.html` in your browser
2. You'll see 8 tabs at the top

---

## Step 2: Add Your Components (2 minutes)

Click each tab and add at least one item:

### ⚡ Inverters Tab
- Click "Add Inverter"
- Name: `Sunsynk 5kW`
- Price: `25000`
- Click "Save"

### 🔋 Batteries Tab
- Click "Add Battery"
- Name: `Sunsynk 5.12kWh`
- Price: `45000`
- Click "Save"

### ☀️ Solar Panels Tab
- Click "Add Solar Panel"
- Name: `JA Solar 565W`
- Price: `2500`
- Click "Save"

### 🏠 Roof Types Tab
- Click "Add Roof Type"
- Name: `Slate Roof`
- Price: `250` (price per panel for mounting kit)
- Click "Save"

### 🔌 Installation Phases Tab
- Click "Add Phase Type"
- Name: `Single Phase`
- Price: `8500`
- Click "Save"

### 🛠️ Accessories Tab
- Click "Add Accessory"
- Name: `Standard Package`
- Price: `15000`
- Click "Save"

### 🔧 Installation Tab
- Click "Add Installation Type"
- Name: `Standard Installation`
- Price: `12000`
- Click "Save"

---

## Step 3: Build Your First System (1 minute)

### 🎯 System Builder Tab
1. Click "Create New System"
2. Name: `Sunsynk System`
3. Select your inverter (radio button)
4. Check your battery type
   - Min: `1`, Max: `10`
5. Check your panel type
   - Min: `6`, Max: `50`
6. Check your roof type
7. Select your phase (radio button)
8. Select your accessory (radio button)
9. Select your installation (radio button)
10. Click "Save System"

---

## Step 4: Save Everything

Click **"Save All Changes"** button (top right, green button)

---

## Step 5: Test It!

1. Open `demo-integration-v2.html` in your browser
2. Select "Sunsynk System" from dropdown
3. Choose your options
4. See the price calculate automatically!

---

## ✅ You're Done!

Your system is now working. You can:

### Add More Systems
- Create "Deye System"
- Create "Tesla System"
- Each with different components and pricing

### Update Prices
- Go to any component tab
- Click Edit (pencil icon)
- Change price
- All systems using that component update automatically!

### Export Backup
- Click "Export Config" (top toolbar)
- Save the JSON file somewhere safe

### Import Backup
- Click "Import Config"
- Select your JSON file
- Everything restores instantly

---

## 🎨 Integration with Your Website

In your `index.html`, add:

```html
<!-- Add this script -->
<script src="solar-config-v2.js"></script>

<!-- Your calculator code -->
<script>
// Get all systems for dropdown
const systems = solarConfigV2.getSystems();

// Populate your system dropdown
systems.forEach(system => {
    // Add to your dropdown
    console.log(system.name, system.id);
});

// When user selects a system
const system = solarConfigV2.getSystemById(selectedSystemId);

// Get available batteries for this system
system.batteries.forEach(battery => {
    console.log(battery.name, battery.price);
});

// Calculate price when user changes options
const price = solarConfigV2.calculateSystemPrice(systemId, {
    batteryType: selectedBatteryId,
    batteryQuantity: 2,
    panelType: selectedPanelId,
    panelQuantity: 12,
    roofType: selectedRoofId
});

// Get detailed breakdown
const breakdown = solarConfigV2.getPriceBreakdown(systemId, config);
breakdown.items.forEach(item => {
    console.log(item.name, item.totalPrice);
});
</script>
```

---

## 📋 Important Rules

### Battery Quantities
- **Min = 0**: Batteries NOT allowed (shows "not available")
- **Min = 1+**: Customer must select at least this many

### Panel Quantities
- **Min = 0**: Panels optional (customer can select 0)
  - At 0 panels → Panel cost = R0, Mounting kit = R0
  - At 1+ → Jumps to minimum defined
- **Min = 6**: Customer must select at least 6 panels

### Mounting Kit
- Automatically = Roof Type Price × Panel Quantity
- If panels = 0, mounting kit = R0

---

## 🆘 Troubleshooting

### "No systems showing in demo"
- Did you click "Save All Changes" in admin portal?
- Try refreshing the page
- Check browser console for errors

### "Prices not calculating"
- Make sure all components have prices
- Make sure system has all required fields selected
- Check browser console for errors

### "Data disappeared"
- Browser localStorage was cleared
- Import your backup JSON file
- Always keep backups!

---

## 💡 Pro Tips

1. **Always Export After Major Changes**
   - Keep dated backups
   - `solar-config-2025-01-15.json`

2. **Test Before Going Live**
   - Use demo-integration-v2.html
   - Try all quantity ranges
   - Verify pricing calculations

3. **Name Things Clearly**
   - ✅ "Sunsynk 5kW Single Phase System"
   - ❌ "System 1"

4. **One Change at a Time**
   - Update one price
   - Test it
   - Then update another

5. **Document Your Systems**
   - Keep notes on what each system is for
   - Screenshot your configurations

---

## 📞 Next Steps

1. ✅ Complete the quick start above
2. 📖 Read SOLAR-ADMIN-V2-GUIDE.md for full details
3. 🎨 Check demo-integration-v2.html for integration examples
4. 🔗 Integrate with your main website
5. 🧪 Test thoroughly before going live

---

## 🎯 Common Scenarios

### Scenario 1: Tesla Powerwall (No Batteries)
```
System Name: Tesla Powerwall System
Inverter: Tesla Powerwall 3
Batteries: (none checked)
Battery Min: 0, Max: 0
Panels: Check all available
Panel Min: 0, Max: 40
```

### Scenario 2: Budget System (Small Range)
```
System Name: Budget Single Phase
Inverter: Basic 5kW
Batteries: Basic Battery Only
Battery Min: 1, Max: 4
Panels: Basic Panels Only
Panel Min: 6, Max: 20
```

### Scenario 3: Premium System (Large Range)
```
System Name: Premium 3 Phase
Inverter: Premium 15kW
Batteries: All premium batteries
Battery Min: 4, Max: 20
Panels: All premium panels
Panel Min: 12, Max: 100
```

---

## 🎉 You're Ready!

You now have a complete, flexible solar system builder with:
- ✅ No hardcoded values
- ✅ Easy price updates
- ✅ Multiple system configurations
- ✅ Full control over everything
- ✅ Import/Export functionality
- ✅ Professional admin interface

**Happy Building! ☀️**

