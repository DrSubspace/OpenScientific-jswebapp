(() => {
    function renderNewsPreviews() {
        const container = document.getElementById('home-news');
        const articles = (window.articlesData || []).slice(0, 3);
        container.replaceChildren();
        if (!articles.length) {
            container.textContent = 'News previews are unavailable right now. Visit News to try again.';
            return;
        }
        for (const article of articles) {
            const card = document.createElement('article');
            card.className = 'home-news-card';
            const image = document.createElement('img');
            image.src = article.image;
            image.alt = article.imageAlt || article.title;
            image.loading = 'lazy';
            const content = document.createElement('div');
            const meta = document.createElement('p');
            meta.className = 'preview-meta';
            meta.textContent = `${article.category} · ${article.date}`;
            const heading = document.createElement('h3');
            const link = document.createElement('a');
            link.href = `article.html?id=${encodeURIComponent(article.id)}`;
            link.textContent = article.title;
            heading.append(link);
            const excerpt = document.createElement('p');
            excerpt.className = 'preview-excerpt';
            excerpt.textContent = article.excerpt;
            content.append(meta, heading, excerpt);
            card.append(image, content);
            container.append(card);
        }
    }
    window.addEventListener('articlesLoaded', renderNewsPreviews);
    document.addEventListener('DOMContentLoaded', () => {
        if (window.articlesData?.length) renderNewsPreviews();
    });
})();
