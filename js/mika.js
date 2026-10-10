(() => {
    'use strict';
    const question = document.getElementById('mika-question');
    const success = document.getElementById('mika-success');
    const choices = document.getElementById('mika-choices');
    const yes = document.getElementById('mika-yes');
    const no = document.getElementById('mika-no');
    const status = document.getElementById('mika-status');
    let hasMoved = false;

    function moveNo() {
        if (question.hidden) return;
        const maxX = Math.max(0, choices.clientWidth - no.offsetWidth);
        const maxY = Math.max(0, choices.clientHeight - no.offsetHeight);
        const oldX = no.offsetLeft;
        const oldY = no.offsetTop;
        const gap = 16;
        const avoidsYes = point => point.x + no.offsetWidth + gap <= yes.offsetLeft ||
            point.x >= yes.offsetLeft + yes.offsetWidth + gap ||
            point.y + no.offsetHeight + gap <= yes.offsetTop ||
            point.y >= yes.offsetTop + yes.offsetHeight + gap;

        // Include safe bottom corners so the button always has somewhere to go,
        // even on narrow screens. Never put it over Yes or outside the answer area.
        const candidates = [{ x: 0, y: maxY }, { x: maxX, y: maxY }];
        for (let i = 0; i < 20; i++) candidates.push({ x: Math.random() * maxX, y: Math.random() * maxY });
        const safe = candidates.filter(avoidsYes);
        safe.sort((a, b) => Math.hypot(b.x - oldX, b.y - oldY) - Math.hypot(a.x - oldX, a.y - oldY));
        const distant = safe.filter(point => Math.hypot(point.x - oldX, point.y - oldY) >= 70);
        const point = distant.length ? distant[Math.floor(Math.random() * distant.length)] : safe[0];
        if (!point) return;
        no.style.left = point.x + 'px';
        no.style.top = point.y + 'px';
        hasMoved = true;
        status.textContent = 'The No button moved to another spot.';
    }

    // Click handles mouse, touch, Enter, and Space; hovering does not move it.
    no.addEventListener('click', moveNo);
    yes.addEventListener('click', () => {
        question.hidden = true;
        success.hidden = false;
        document.title = 'You made my day | OpenScientific';
        document.getElementById('mika-thanks').focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
    });

    const resizeObserver = new ResizeObserver(() => {
        if (hasMoved && !question.hidden) moveNo();
    });
    resizeObserver.observe(choices);
})();
