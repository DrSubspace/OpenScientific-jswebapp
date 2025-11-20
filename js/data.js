// Fetch articles from JSON file
// This makes it easy to add/edit articles without touching code

async function loadArticles() {
    try {
        const response = await fetch('data/articles.json');
        if (!response.ok) {
            throw new Error(`Failed to load articles: ${response.status}`);
        }
        const articles = await response.json();
        window.articlesData = articles;

        // Trigger a custom event so pages know data is ready
        window.dispatchEvent(new Event('articlesLoaded'));

        console.log(`✅ Loaded ${articles.length} articles successfully`);
    } catch (error) {
        console.error('❌ Error loading articles:', error);

        // Check if it's a CORS/file protocol issue
        if (window.location.protocol === 'file:') {
            console.warn('⚠️ You are viewing this page locally without a web server.');
            console.warn('📝 To test locally, run: python -m http.server 8000');
            console.warn('🌐 Or deploy to GitHub Pages for full functionality.');
        }

        // Fallback to empty array so the site doesn't break
        window.articlesData = [];
        window.dispatchEvent(new Event('articlesLoaded'));
    }
}

// Initialize articles data as empty array
window.articlesData = [];

// Start loading articles immediately
loadArticles();
