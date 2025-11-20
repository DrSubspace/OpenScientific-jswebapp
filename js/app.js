// DOM Elements
const tabs = document.querySelectorAll('.tab');
const searchToggle = document.getElementById('search-toggle');
const searchClose = document.getElementById('search-close');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');

// Search state
let currentSearchQuery = '';
let currentFilter = 'all';

// Render Hero Section
function renderHero() {
    const heroHeader = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (!heroContent || !window.articlesData || window.articlesData.length === 0) return;

    // Select the first article as featured, or find one marked as featured
    // For now, we'll use the first article
    const featuredArticle = window.articlesData[0];

    // Update Hero Background (Optional: could set a specific background image)
    // heroHeader.style.backgroundImage = `url(${featuredArticle.image})`; 
    // Note: The current CSS uses a gradient overlay .hero-bg, so we might want to keep that 
    // or dynamically set the background of .hero-bg if we want the image there.
    // For this design, let's update the text content.

    heroContent.innerHTML = `
        <span class="badge">Featured Story</span>
        <h1>${featuredArticle.title}</h1>
        <p>${featuredArticle.excerpt}</p>
        <div class="hero-actions">
            <a href="article.html?id=${featuredArticle.id}" class="btn-primary">Read Article</a>
            <a href="category.html?category=${featuredArticle.category}" class="btn-secondary">Explore Topic</a>
        </div>
    `;
}

// Render Articles Function
function renderArticles(filter = 'all', searchQuery = '') {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) {
        console.error('News grid element not found!');
        return;
    }
    newsGrid.innerHTML = '';

    // Use global data from data.js
    const articles = window.articlesData || [];

    if (articles.length === 0) {
        newsGrid.innerHTML = '<p class="error-msg">No articles found.</p>';
        return;
    }

    // Filter by category
    let filteredArticles = filter === 'all'
        ? articles
        : articles.filter(article => article.category === filter);

    // Filter by search query
    if (searchQuery.trim() !== '') {
        filteredArticles = searchArticles(filteredArticles, searchQuery);
    }

    if (filteredArticles.length === 0) {
        newsGrid.innerHTML = '<p class="error-msg">No articles match your search.</p>';
        return;
    }

    filteredArticles.forEach(article => {
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

// Event Listeners for Tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        // Filter articles with current search query
        currentFilter = tab.getAttribute('data-category');
        renderArticles(currentFilter, currentSearchQuery);
    });
});

// Search Toggle Event Listeners
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
        renderArticles(currentFilter, '');
    });
}

// Search Input Event Listener
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderArticles(currentFilter, currentSearchQuery);
    });

    // Close search on Escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchBar.classList.remove('active');
            searchInput.value = '';
            currentSearchQuery = '';
            renderArticles(currentFilter, '');
        }
    });
}

// Initial Render - wait for both DOM and articles to be ready
document.addEventListener('DOMContentLoaded', () => {
    // If articles are already loaded, render immediately
    if (window.articlesData && window.articlesData.length > 0) {
        renderHero();
        renderArticles();
    } else {
        // Otherwise, wait for the articlesLoaded event
        window.addEventListener('articlesLoaded', () => {
            renderHero();
            renderArticles();
        });
    }
});
