# STP Solar Gallery Setup Guide

## 📁 Folder Structure

Create the following folder structure on your Afrihost server:

```
your-website/
├── index.html
├── styles.css
├── script.js
├── gallery-data.json
├── images/
│   └── gallery/
│       ├── residential/
│       │   ├── sunsynk/
│       │   │   ├── sunsynk-cape-town-1.jpg
│       │   │   ├── sunsynk-cape-town-2.jpg
│       │   │   ├── complete-system-port-elizabeth-1.jpg
│       │   │   ├── professional-install-bloemfontein-1.jpg
│       │   │   └── sunsynk-backup-kimberley-1.jpg
│       │   ├── tesla/
│       │   │   ├── tesla-johannesburg-1.jpg
│       │   │   ├── tesla-ecosystem-cape-town-2.jpg
│       │   │   └── tesla-duo-stellenbosch-1.jpg
│       │   ├── sigenergy/
│       │   │   └── sigenergy-residential-cape-town-1.jpg
│       │   └── general/
│       │       └── ja-solar-durban-1.jpg
│       └── commercial/
│           ├── sunsynk/
│           │   └── commercial-sunsynk-pretoria-1.jpg
│           ├── sigenergy/
│           │   └── sigenergy-commercial-johannesburg-1.jpg
│           └── general/
│               └── large-commercial-east-london-1.jpg
```

## 📸 Image Specifications

### **Recommended Settings:**
- **Format**: JPG (best compression) or WebP (modern, smaller)
- **Dimensions**: 800x600px (4:3 aspect ratio)
- **File Size**: Under 200KB per image
- **Quality**: 85-90% (good balance of quality vs size)

### **Naming Convention:**
Use descriptive names that match the JSON data:
- `sunsynk-cape-town-1.jpg`
- `tesla-johannesburg-1.jpg`
- `commercial-sunsynk-pretoria-1.jpg`

## 🛠️ How to Add New Projects

### **Step 1: Add Images**
1. Take high-quality photos of your installations
2. Optimize them using tools like:
   - **Online**: TinyPNG, Compressor.io
   - **Desktop**: GIMP, Photoshop
   - **Mobile**: Snapseed, VSCO
3. Upload to the appropriate folder

### **Step 2: Update JSON Data**
Edit `gallery-data.json` and add a new item:

```json
{
  "id": 11,
  "title": "Your Project Title",
  "description": "Brief description of the installation",
  "image": "images/gallery/residential/sunsynk/your-image-name.jpg",
  "categories": ["residential", "sunsynk"],
  "tags": ["Residential", "Sunsynk", "Location"],
  "date": "2024-03-15",
  "location": "Your City",
  "systemSize": "5kW",
  "components": ["Component 1", "Component 2", "Component 3"],
  "customerQuote": "Customer testimonial (optional)"
}
```

### **Step 3: Upload Files**
1. Upload the new image to your server
2. Upload the updated `gallery-data.json`
3. Refresh your website

## 🎯 Image Optimization Tools

### **Free Online Tools:**
- **TinyPNG**: https://tinypng.com/
- **Compressor.io**: https://compressor.io/
- **Squoosh**: https://squoosh.app/ (Google's tool)

### **Desktop Software:**
- **GIMP**: Free, powerful image editor
- **Photoshop**: Professional (paid)
- **Canva**: Easy online editor

### **Mobile Apps:**
- **Snapseed**: Google's photo editor
- **VSCO**: Professional photo editing
- **Lightroom Mobile**: Adobe's mobile editor

## 📱 Mobile Optimization

The gallery is fully responsive and will:
- Show 1 column on mobile
- Show 2 columns on tablet
- Show 3-4 columns on desktop
- Automatically resize images

## 🔧 Troubleshooting

### **Images Not Showing:**
1. Check file paths in `gallery-data.json`
2. Verify images are uploaded to correct folders
3. Check file permissions (should be 644)
4. Ensure image file names match exactly

### **Gallery Not Loading:**
1. Check browser console for errors
2. Verify `gallery-data.json` is valid JSON
3. Ensure file is uploaded to root directory

### **Performance Issues:**
1. Optimize images (reduce file size)
2. Use WebP format if supported
3. Consider lazy loading for many images

## 📊 Current Gallery Items

The gallery includes 12 sample projects:
1. Sunsynk Hybrid System (Cape Town)
2. Tesla Powerwall 3 (Johannesburg)
3. JA Solar Panel Array (Durban)
4. Commercial Solar System (Pretoria)
5. Complete Home System (Port Elizabeth)
6. Tesla Energy Ecosystem (Cape Town)
7. Professional Installation (Bloemfontein)
8. Large Commercial Array (East London)
9. Sunsynk Residential Backup (Kimberley)
10. Tesla Powerwall Duo (Stellenbosch)
11. Sigenergy Residential System (Cape Town)
12. Sigenergy Commercial Installation (Johannesburg)

## 🚀 Next Steps

1. **Create the folder structure** on your server
2. **Take photos** of your actual installations
3. **Optimize images** using the tools above
4. **Upload images** to the correct folders
5. **Update gallery-data.json** with real project data
6. **Test the gallery** on your website

## 💡 Pro Tips

- **Take photos** from multiple angles (wide shot, close-up, components)
- **Include before/after** shots if possible
- **Get customer permission** before using their property photos
- **Keep consistent lighting** and composition
- **Show the quality** of your workmanship
- **Include system components** in photos when possible

The dynamic gallery will automatically update when you modify the JSON file, making it easy to showcase your latest projects!
