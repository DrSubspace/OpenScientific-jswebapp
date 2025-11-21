// Shared functionality for all pages

// Toast Notification
function showToast(message) {
    // Check if toast already exists
    let toast = document.querySelector('.toast');

    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-info-circle"></i> <span>${message}</span>`;

    // Trigger reflow
    void toast.offsetWidth;

    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Subscribe Button Handler
document.addEventListener('DOMContentLoaded', () => {
    const subscribeButtons = document.querySelectorAll('.btn-primary');

    subscribeButtons.forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === 'subscribe') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Subscription feature coming soon!');
            });
        }
    });
});

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

// Mobile Menu Logic (Shared)
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navCloseBtn = document.querySelector('.nav-close-btn');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.add('active');
        });
    }

    if (navCloseBtn && navLinks) {
        navCloseBtn.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    }

    // Close mobile menu when clicking a link
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        }
    });
});
