document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('[data-simulations]');
    if (!container) return;
    try {
        const response = await fetch('data/simulations.json');
        if (!response.ok) throw new Error(`Failed to load simulations: ${response.status}`);
        const simulations = await response.json();
        simulations.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        const limit = Number(container.dataset.limit) || simulations.length;
        container.replaceChildren();
        for (const simulation of simulations.slice(0, limit)) {
            const card = document.createElement('article');
            card.className = 'simulation-card';
            const preview = document.createElement('div');
            preview.className = 'simulation-preview';
            const image = document.createElement('img');
            image.src = simulation.image;
            image.alt = simulation.imageAlt;
            image.width = 520;
            image.height = 320;
            image.loading = 'lazy';
            preview.append(image);
            const content = document.createElement('div');
            content.className = 'simulation-card-content';
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = simulation.category;
            const heading = document.createElement(container.dataset.heading || 'h2');
            heading.textContent = simulation.title;
            const description = document.createElement('p');
            description.textContent = simulation.description;
            const link = document.createElement('a');
            link.className = 'btn-primary';
            link.href = simulation.url;
            link.textContent = 'Launch simulation →';
            content.append(badge, heading, description, link);
            card.append(preview, content);
            container.append(card);
        }
        if (!simulations.length) container.textContent = 'New experiments will appear here as they are added.';
    } catch (error) {
        console.error(error);
        const message = document.createElement('p');
        message.textContent = 'The simulation list could not load. ';
        const link = document.createElement('a');
        link.href = 'temperature.html';
        link.className = 'card-link';
        link.textContent = 'Open the temperature experiment';
        message.append(link);
        container.replaceChildren(message);
    }
});
