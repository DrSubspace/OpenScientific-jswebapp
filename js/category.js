document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const categoryTitle = document.getElementById('category-title');

    // Search Elements
    const searchToggle = document.getElementById('search-toggle');
    const searchClose = document.getElementById('search-close');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');

    let currentSearchQuery = '';

    function renderCategoryPage() {
        let articles = window.articlesData || [];
        let displayTitle = 'All Articles';

        // 1. Filter by Category
        if (category) {
            const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
            displayTitle = `${displayCategory} News`;
            articles = articles.filter(article => article.category === category);
        }

        categoryTitle.textContent = displayTitle;

        // 2. Filter by Search
        if (currentSearchQuery.trim() !== '') {
            if (typeof searchArticles === 'function') {
                articles = searchArticles(articles, currentSearchQuery);
            } else {
                // Fallback simple search if main.js not loaded yet
                const lowerQuery = currentSearchQuery.toLowerCase();
                articles = articles.filter(article =>
                    article.title.toLowerCase().includes(lowerQuery) ||
                    article.excerpt.toLowerCase().includes(lowerQuery)
                );
            }
        }

        renderArticles(articles);
    }

    // Search Event Listeners
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            searchBar.classList.add('active');
            searchInput.focus();
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchBar.classList.remove('active');
            searchInput.value = '';
            currentSearchQuery = '';
            renderCategoryPage();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            renderCategoryPage();
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchBar.classList.remove('active');
                searchInput.value = '';
                currentSearchQuery = '';
                renderCategoryPage();
            }
        });
    }

    // Initial Load
    if (window.articlesData && window.articlesData.length > 0) {
        renderCategoryPage();
    } else {
        window.addEventListener('articlesLoaded', renderCategoryPage);
    }
});

function renderArticles(articles) {
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = '';

    if (articles.length === 0) {
        newsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p class="error-msg">No articles found matching your criteria.</p>
                <a href="index.html" class="btn-secondary">Go Back Home</a>
            </div>
        `;
        return;
    }

    articles.forEach(article => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
                <span class="card-category">${article.category}</span>
            </div>
            <div class="card-content">
                <span class="card-date">${article.date}</span>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <a href="article.html?id=${article.id}" class="card-link">Read More <i class="fa-solid fa-arrow-right"></i></a>
            </div>
        `;
        newsGrid.appendChild(card);
    });
}
