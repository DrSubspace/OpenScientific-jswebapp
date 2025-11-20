const articleContainer = document.getElementById('article-content');

// Get Article ID from URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = parseInt(urlParams.get('id'));

// Fetch and Render Article
function loadArticle() {
    try {
        // Use global data from data.js
        const articles = window.articlesData || [];
        const article = articles.find(a => a.id === articleId);

        if (article) {
            renderArticle(article);
        } else {
            articleContainer.innerHTML = `
                <div class="error-state">
                    <h2>Article Not Found</h2>
                    <p>The article you are looking for does not exist.</p>
                    <a href="index.html" class="btn-primary">Go Home</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading article:', error);
        articleContainer.innerHTML = '<p class="error-msg">Failed to load article.</p>';
    }
}

function renderArticle(article) {
    document.title = `${article.title} | OpenScientific`;

    articleContainer.innerHTML = `
        <header class="article-header">
            <span class="article-category">${article.category}</span>
            <h1>${article.title}</h1>
            <div class="article-meta">
                <span class="date"><i class="fa-regular fa-calendar"></i> ${article.date}</span>
                <span class="author"><i class="fa-regular fa-user"></i> Editorial Team</span>
            </div>
        </header>
        
        <div class="article-featured-image">
            <img src="${article.image}" alt="${article.title}">
        </div>
        
        <div class="article-body">
            <p class="lead">${article.excerpt}</p>
            ${article.content}
        </div>
        
        <div class="article-actions">
            <a href="index.html" class="btn-secondary"><i class="fa-solid fa-arrow-left"></i> Back to News</a>
        </div>
    `;
}

// Initialize - wait for articles to load
document.addEventListener('DOMContentLoaded', () => {
    if (window.articlesData && window.articlesData.length > 0) {
        loadArticle();
    } else {
        window.addEventListener('articlesLoaded', loadArticle);
    }
});
