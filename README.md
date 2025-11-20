# OpenScientific

A modern, responsive science and technology news website built for GitHub Pages.

![OpenScientific Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=300)

## 🚀 Features

- **Clean, Modern Design** - Beautiful UI with smooth animations
- **Responsive** - Works perfectly on desktop, tablet, and mobile
- **Easy Content Management** - Add articles by editing a single JSON file
- **Category Filtering** - Technology, Science, and Space categories
- **Fast Loading** - Optimized images and efficient code
- **SEO Friendly** - Proper meta tags and semantic HTML

## 📝 Adding New Articles

Articles are managed through a simple JSON file. No coding knowledge required!

1. Open `data/articles.json`
2. Add your article following the template
3. Commit and push to GitHub
4. Your site updates automatically in 1-2 minutes

**See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for detailed instructions.**

### Quick Example

```json
{
  "id": 7,
  "title": "Your Article Title",
  "excerpt": "Brief description here",
  "category": "tech",
  "date": "Nov 20, 2025",
  "image": "https://images.unsplash.com/photo-...",
  "content": "<p>Full article content with HTML...</p>"
}
```

## 🌐 Deployment to GitHub Pages

### First Time Setup

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

3. **Access Your Site**
   - Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
   - Wait 2-3 minutes for the first deployment

### Updating Content

Simply edit `data/articles.json` and push:

```bash
git add data/articles.json
git commit -m "Add new article"
git push
```

GitHub Pages will rebuild automatically!

## 🏗️ Project Structure

```
openscientific/
├── index.html              # Homepage
├── article.html            # Article detail page
├── category.html           # Category listing page
├── css/
│   └── styles.css         # All styles
├── js/
│   ├── data.js            # Loads articles from JSON
│   ├── app.js             # Homepage logic
│   ├── article.js         # Article page logic
│   ├── category.js        # Category page logic
│   └── main.js            # Global functionality (subscribe toast)
├── data/
│   └── articles.json      # ⭐ EDIT THIS to add articles
├── CONTENT_GUIDE.md       # Detailed content management guide
└── README.md              # This file
```

## 💻 Local Development (Optional)

If you want to test changes locally before pushing:

### Option 1: Python (Recommended)

```bash
# Navigate to project folder
cd openscientific

# Python 3
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

### Option 2: Node.js

```bash
# Install live-server globally
npm install -g live-server

# Run in project folder
live-server
```

### Option 3: VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

## 🎨 Customization

### Changing Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary: #00f2ff;      /* Main accent color */
    --bg-dark: #0a0a12;      /* Background */
    --text-main: #ffffff;     /* Text color */
}
```

### Adding New Categories

1. Add articles with the new category in `articles.json`
2. Add category link to navigation in all HTML files
3. Update filter tabs on homepage

## 📋 Article Format Reference

Each article needs these fields:

| Field | Required | Type | Example |
|-------|----------|------|---------|
| `id` | ✅ Yes | Number | `7` |
| `title` | ✅ Yes | String | `"Article Title"` |
| `excerpt` | ✅ Yes | String | `"Brief description"` |
| `category` | ✅ Yes | String | `"tech"` `"science"` `"space"` |
| `date` | ✅ Yes | String | `"Nov 20, 2025"` |
| `image` | ✅ Yes | URL | `"https://..."` |
| `content` | ✅ Yes | HTML | `"<p>Content...</p>"` |

## 🖼️ Images

**Recommended source**: [Unsplash](https://unsplash.com/) (free, high-quality images)

**Optimize URLs** with these parameters:
```
?auto=format&fit=crop&q=80&w=800
```

**Example**:
```
https://images.unsplash.com/photo-1234567890?auto=format&fit=crop&q=80&w=800
```

## 🐛 Troubleshooting

### Articles not loading?
- Check `data/articles.json` is valid JSON ([use jsonlint.com](https://jsonlint.com/))
- Make sure file is in `data/` folder
- Check browser console for errors (F12)

### GitHub Pages not updating?
- Wait 2-3 minutes for rebuild
- Check GitHub Actions tab for build status
- Hard refresh browser (Ctrl+Shift+R)

### Images not showing?
- Verify image URL works in browser
- Check URL has proper parameters
- Use HTTPS URLs only

## 📄 License

Feel free to use this template for your own projects! 

## 🤝 Contributing

This is a template project. Fork it and make it your own!

---

**Built with ❤️ for GitHub Pages**

For detailed content management instructions, see [CONTENT_GUIDE.md](CONTENT_GUIDE.md)
