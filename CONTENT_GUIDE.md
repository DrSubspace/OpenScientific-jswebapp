# Content Management Guide

Welcome! This guide will help you add and edit articles for the OpenScientific website.

## Quick Start

To add a new article, simply edit the `data/articles.json` file and push your changes to GitHub. The website will automatically update within 1-2 minutes.

## Article Structure

Each article in `articles.json` follows this format:

```json
{
  "id": 7,
  "title": "Your Article Title Here",
  "excerpt": "A brief 1-2 sentence description that appears on cards",
  "category": "tech",
  "date": "Nov 20, 2025",
  "image": "https://images.unsplash.com/photo-...",
  "content": "<p>Full article content in HTML format...</p>"
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | Number | Unique identifier (increment from last article) | `7` |
| `title` | String | Article headline | `"AI Breakthrough in Medicine"` |
| `excerpt` | String | Short description (1-2 sentences) | `"Researchers develop..."` |
| `category` | String | Must be: `tech`, `science`, or `space` | `"tech"` |
| `date` | String | Publication date | `"Nov 20, 2025"` |
| `image` | URL | Article image (see Image Tips below) | `"https://..."` |
| `content` | HTML | Full article content with HTML tags | `"<p>...</p>"` |

## Step-by-Step: Adding a New Article

### 1. Find the Next ID

Look at the last article in `articles.json` and use the next number. For example, if the last article has `"id": 6`, your new article should have `"id": 7`.

### 2. Copy the Template

Use this template for your new article:

```json
{
  "id": NEXT_NUMBER,
  "title": "YOUR TITLE HERE",
  "excerpt": "Brief description of your article in one or two sentences.",
  "category": "tech",
  "date": "Nov 20, 2025",
  "image": "https://images.unsplash.com/photo-1234567890...",
  "content": "<p>Your article content goes here.</p><h3>Section Heading</h3><p>More content...</p>"
}
```

### 3. Fill in the Details

- **Title**: Write a compelling headline
- **Excerpt**: Summarize the key point in 1-2 sentences
- **Category**: Choose `tech`, `science`, or `space`
- **Date**: Use format like `"Nov 20, 2025"`
- **Image**: See Image Tips below
- **Content**: Write your article in HTML (see Content Formatting below)

### 4. Add to articles.json

1. Open `data/articles.json`
2. Add a comma after the last article's closing `}`
3. Paste your new article before the final `]`
4. Save the file

### 5. Verify the JSON is Valid

Use a JSON validator like [jsonlint.com](https://jsonlint.com/) to ensure your changes are valid. Common errors:
- Missing commas between articles
- Extra comma after the last article
- Unclosed quotes

### 6. Commit and Push

```bash
git add data/articles.json
git commit -m "Add new article: [Your Title]"
git push
```

The website will update automatically within 1-2 minutes!

## Image Tips

### Using Unsplash (Recommended)

1. Go to [unsplash.com](https://unsplash.com/)
2. Search for relevant images
3. Right-click on image → "Copy Image Address"
4. Add these parameters to optimize loading:
   ```
   ?auto=format&fit=crop&q=80&w=800
   ```

**Example:**
```
https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800
```

### Image Requirements

- **Format**: JPG or PNG
- **Size**: Optimized for web (use URL parameters above)
- **Dimensions**: Minimum 800px wide
- **License**: Must be free to use (Unsplash provides free images)

## Content Formatting

Article content uses HTML. Here are the main tags:

### Basic Formatting

```html
<p>This is a paragraph. Use this for regular text.</p>

<h3>Section Heading</h3>

<p>Text with <strong>bold emphasis</strong> for important points.</p>

<p>This is another paragraph with more information.</p>
```

### Lead Paragraph (Optional)

The excerpt is automatically styled as a lead paragraph. Your content should start with regular paragraphs.

### Example Full Content

```html
"<p>Artificial intelligence has reached a new milestone with the development of reasoning systems.</p><h3>What This Means</h3><p>Unlike previous AI models, these new systems can <strong>plan ahead</strong> and verify their own work.</p><h3>The Future</h3><p>This breakthrough could revolutionize fields from medicine to engineering.</p>"
```

### Tips for HTML Content

1. **Always use double quotes** for HTML attributes
2. **Escape quotes in content** using `\"` if needed
3. **Keep it simple**: Stick to `<p>`, `<h3>`, and `<strong>` tags
4. **Test locally** before pushing (see Testing below)

## Categories

Use one of these exact category values:

- `"tech"` - Technology, AI, computing, software
- `"science"` - Biology, chemistry, research, discoveries
- `"space"` - Astronomy, space exploration, planets

**Note**: Currently `"ai"` is not used as a separate category. AI articles should use `"tech"`.

## Testing Before Publishing

### Option 1: Online JSON Validator

1. Copy your entire `articles.json` file
2. Go to [jsonlint.com](https://jsonlint.com/)
3. Paste and click "Validate JSON"
4. Fix any errors shown

### Option 2: Local Testing (Advanced)

If you have a local web server:

```bash
# Navigate to project folder
cd openscientific

# Start a simple web server (Python 3)
python -m http.server 8000

# Open browser to http://localhost:8000
```

## Common Mistakes to Avoid

❌ **Don't:**
- Forget commas between articles
- Use single quotes `'` instead of double quotes `"`
- Forget to escape quotes in HTML content
- Use duplicate IDs
- Leave trailing commas after the last article

✅ **Do:**
- Use a JSON validator before pushing
- Increment IDs sequentially
- Test your changes locally if possible
- Use proper category names
- Optimize images for web

## Example: Complete Article Entry

```json
{
  "id": 7,
  "title": "Fusion Energy Breakthrough Announced",
  "excerpt": "Scientists achieve net positive energy from nuclear fusion, marking a historic milestone in clean energy research.",
  "category": "science",
  "date": "Nov 20, 2025",
  "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
  "content": "<p>For the first time in history, a fusion reactor has produced more energy than it consumed, bringing us one step closer to unlimited clean energy.</p><h3>The Breakthrough</h3><p>The National Ignition Facility achieved fusion ignition using 192 powerful lasers to compress a tiny fuel pellet.</p><h3>What's Next</h3><p>While this is a <strong>major scientific achievement</strong>, commercial fusion power plants are still decades away. However, this proves the concept works.</p>"
}
```

## Need Help?

- **JSON validation errors?** Use [jsonlint.com](https://jsonlint.com/)
- **Image not loading?** Check the URL works in a browser
- **Article not appearing?** Verify the ID is unique and JSON is valid
- **GitHub Pages not updating?** Wait 2-3 minutes and hard refresh (Ctrl+Shift+R)

---

**Pro Tip**: Keep a backup copy of `articles.json` before making changes, especially when first learning!
