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
    if (!mobileMenuBtn || !navLinks) return;

    function setMenuOpen(open, restoreFocus = false) {
        navLinks.classList.toggle('active', open);
        mobileMenuBtn.setAttribute('aria-expanded', String(open));
        if (open) navLinks.querySelector('a').focus();
        else if (restoreFocus) mobileMenuBtn.focus();
    }

    mobileMenuBtn.addEventListener('click', () => {
        setMenuOpen(!navLinks.classList.contains('active'));
    });
    if (navCloseBtn) navCloseBtn.addEventListener('click', () => setMenuOpen(false, true));
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) setMenuOpen(false, true);
    });
    document.addEventListener('click', (event) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            setMenuOpen(false);
        }
    });
    window.matchMedia('(max-width: 1100px)').addEventListener('change', () => setMenuOpen(false));
});
