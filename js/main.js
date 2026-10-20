// Shared news search for the News and category pages.
// Keep older externally hosted article images from breaking preview cards.
document.addEventListener('error', (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.fallback) return;
    if (!image.closest('.home-news-card, .card-image, .article-featured-image, .hero-image')) return;
    image.dataset.fallback = 'true';
    image.src = 'images/news-placeholder.svg';
    image.alt = 'Science illustration; article image unavailable';
}, true);

// Search Articles Function
function searchArticles(articles, query) {
    const lowerQuery = query.toLowerCase();
    return articles.filter(article => {
        return article.title.toLowerCase().includes(lowerQuery) ||
            article.excerpt.toLowerCase().includes(lowerQuery) ||
            article.category.toLowerCase().includes(lowerQuery) ||
            (article.content && article.content.toLowerCase().includes(lowerQuery));
    });
}
