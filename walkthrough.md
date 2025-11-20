# Category Navigation, Featured Article, and Subscribe Feature Walkthrough

I have implemented a functional category navigation system, a dynamic featured article section, and a "Coming Soon" notification for the subscribe feature.

## Changes

### 1. Subscribe Feature (Coming Soon)
- **Functionality**: Clicking the "Subscribe" button now displays a toast notification saying "Subscription feature coming soon!".
- **Code**: 
    - Created `js/main.js` to handle the click event and toast logic.
    - Added `.toast` styles to `css/styles.css`.
    - Included `js/main.js` in `index.html`, `article.html`, and `category.html`.

### 2. Featured Article (Hero Section)
- **Dynamic Rendering**: The hero section in `index.html` is now populated dynamically by `js/app.js`.
- **Functionality**: 
    - "Read Article" button links to the featured article.
    - "Explore Topic" button links to the category of the featured article.
- **Code**: Added `renderHero()` function in `js/app.js`.

### 3. Category Navigation
- **Created `category.html`**: Displays articles filtered by category.
- **Created `js/category.js`**: Handles the logic for filtering and displaying articles.
- **Updated Navigation**: Links in the navbar now point to `category.html` with the correct query parameters.

### 4. Code Cleanup & Best Practices
- **Refactoring**: Removed duplicate comments and improved error handling in `js/app.js`.
- **Semantic HTML**: Converted hero buttons to `<a>` tags for better accessibility and SEO.
- **Consistency**: Ensured `article.html` and `category.html` share the same navigation structure.

## Verification

### Subscribe Feature
1.  Click the "Subscribe" button in the top right corner of any page.
2.  Verify that a toast notification appears at the bottom right with the message "Subscription feature coming soon!".
3.  Verify the toast disappears automatically after 3 seconds.

### Featured Article
1.  Open `index.html`.
2.  The Hero section should display the first article from the data.
3.  Click "Read Article" -> Should go to `article.html?id=1`.

### Category Navigation
1.  Click "Technology" in navbar -> `category.html?category=tech`.
2.  Click "Science" in navbar -> `category.html?category=science`.
