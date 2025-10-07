# How to Add Real Google Reviews to Your STP Solar Website

## 🔍 Finding Your Real Google Reviews

### Method 1: Direct Google Business Profile
1. Go to [Google Business Profile](https://business.google.com)
2. Search for "STP Solar" in your area
3. Click on your business listing
4. Go to the "Reviews" tab
5. Copy the review text, customer names, and ratings

### Method 2: Google Maps
1. Open [Google Maps](https://maps.google.com)
2. Search for "STP Solar" + your city
3. Click on your business
4. Scroll down to see reviews
5. Copy the reviews you want to feature

### Method 3: Google Search
1. Search "STP Solar reviews" on Google
2. Look for your business in the results
3. Click on the reviews section

## 📝 How to Update the Website Reviews

### Step 1: Edit the HTML File
Open `stp-solar/index.html` and find the reviews section (around line 280-440).

### Step 2: Replace Sample Reviews
Replace the sample reviews with real ones. Here's the format:

```html
<div class="review-card">
    <div class="review-header">
        <div class="reviewer-info">
            <div class="reviewer-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="reviewer-details">
                <h4>Customer Name</h4>
                <p>City, Province</p>
            </div>
        </div>
        <div class="review-rating">
            <div class="stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <span class="rating-text">5.0</span>
        </div>
    </div>
    <div class="review-content">
        <p>"Put the actual customer review text here..."</p>
    </div>
    <div class="review-source">
        <i class="fab fa-google"></i>
        <span>Google Review</span>
    </div>
</div>
```

### Step 3: Update Statistics
Update the review statistics to match your real numbers:
- Average Rating (e.g., 4.8, 4.9, 5.0)
- Number of Happy Customers
- Satisfaction Rate

### Step 4: Add Your Google Business Link
Replace this line in the HTML:
```html
<a href="https://g.page/r/your-google-business-link" target="_blank" class="btn btn-outline">
```

With your actual Google Business profile URL.

## 🎯 Tips for Great Reviews

### What Makes a Good Review Display:
1. **Mix of ratings** - Include some 4-star and 5-star reviews
2. **Specific details** - Reviews that mention specific services or results
3. **Location variety** - Reviews from different cities/areas
4. **Recent reviews** - Include recent feedback when possible
5. **Authentic language** - Keep the original customer language

### Example Real Review Format:
```html
<p>"STP Solar installed our 8kW Sunsynk system last month. The team was professional, on time, and the installation was clean. Our electricity bill has dropped from R2,500 to R400 per month. Highly recommend their services!"</p>
```

## 🔧 Quick Update Instructions

1. **Find 5-7 of your best reviews** from Google
2. **Copy the customer name, location, rating, and review text**
3. **Replace the sample reviews** in the HTML file
4. **Update the statistics** to match your real numbers
5. **Add your Google Business profile link**
6. **Test the website** to make sure everything looks good

## 📞 Need Help?

If you need assistance updating the reviews, I can help you:
- Format the reviews properly
- Update the statistics
- Add more review cards
- Customize the styling

Just provide me with the real review text and I'll help you implement it!
