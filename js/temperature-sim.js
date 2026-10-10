/* TemperatureSimulation — dependency-free Canvas 2D, MIT licensed. */
(function (root) {
  'use strict';

  const G = Object.freeze({ width: 900, height: 410, left: 235, right: 665, cy: 208, radius: 168, neck: 34, mid: 450 });
  const R = 4.2;
  const CELL = R * 2;
  const COLS = Math.ceil(G.width / CELL);
  const ROWS = Math.ceil(G.height / CELL);
  const CUT = Math.sqrt(G.radius ** 2 - G.neck ** 2);
  const ANGLE = Math.asin(G.neck / G.radius);
  // An illustrative scale: mean(vx² + vy²) / SPEED_SCALE² = temperature in K.
  const SPEED_SCALE = 7;
  const STEP = 1 / 240;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function temperature(value, fallback) { return Number.isFinite(value) ? clamp(value, 40, 600) : fallback; }

  class GasPhysics {
    constructor(options = {}) {
      this.count = clamp(Math.round(Number(options.particleCount) || 120), 20, 240);
      if (this.count % 2) this.count++;
      this.random = options.random || Math.random;
      this.heads = new Int32Array(COLS * ROWS);
      this.next = new Int32Array(this.count);
      this.initial = [temperature(options.leftTemperature, 600), temperature(options.rightTemperature, 40)];
      this.reset();
    }

    reset(left = this.initial[0], right = this.initial[1]) {
      this.initial = [temperature(left, 600), temperature(right, 40)];
      this.open = false;
      this.time = 0;
      this.particles = [];
      for (let side = 0; side < 2; side++) {
        const start = this.particles.length;
        const cx = side ? G.right : G.left;
        for (let i = 0; i < this.count / 2; i++) {
          let x, y, attempts = 0;
          do {
            const a = this.random() * Math.PI * 2;
            const d = Math.sqrt(this.random()) * (G.radius - R - 3);
            x = cx + Math.cos(a) * d;
            y = G.cy + Math.sin(a) * d;
            if (++attempts > 10000) throw new Error('Could not place particles; random must return values across [0, 1).');
          } while (this.particles.some(p => (p.x - x) ** 2 + (p.y - y) ** 2 < (2 * R + 1) ** 2));
          // Box–Muller gives Gaussian velocity components (a 2D Maxwell distribution).
          const magnitude = Math.sqrt(-2 * Math.log(Math.max(1e-10, this.random())));
          const angle = this.random() * Math.PI * 2;
          this.particles.push({ x, y, vx: magnitude * Math.cos(angle), vy: magnitude * Math.sin(angle) });
        }
        const group = this.particles.slice(start);
        const meanX = group.reduce((sum, p) => sum + p.vx, 0) / group.length;
        const meanY = group.reduce((sum, p) => sum + p.vy, 0) / group.length;
        let energy = 0;
        for (const p of group) { p.vx -= meanX; p.vy -= meanY; energy += p.vx ** 2 + p.vy ** 2; }
        const scale = Math.sqrt(this.initial[side] * SPEED_SCALE ** 2 * group.length / energy);
        for (const p of group) { p.vx *= scale; p.vy *= scale; }
      }
    }

    contains(x, y) {
      return (x - G.left) ** 2 + (y - G.cy) ** 2 <= G.radius ** 2 ||
        (x - G.right) ** 2 + (y - G.cy) ** 2 <= G.radius ** 2 ||
        (x >= G.left + CUT && x <= G.right - CUT && Math.abs(y - G.cy) <= G.neck);
    }

    // Closest point on the actual exterior: two circular arcs and two passage walls.
    nearestWall(x, y) {
      let bx = 0, by = 0, best = Infinity;
      const consider = (qx, qy) => {
        const d2 = (x - qx) ** 2 + (y - qy) ** 2;
        if (d2 < best) { best = d2; bx = qx; by = qy; }
      };
      for (const cx of [G.left, G.right]) {
        const a = Math.atan2(y - G.cy, x - cx);
        const onArc = cx === G.left ? Math.abs(a) >= ANGLE : Math.abs(a) <= Math.PI - ANGLE;
        if (onArc) consider(cx + G.radius * Math.cos(a), G.cy + G.radius * Math.sin(a));
        else {
          const portX = cx === G.left ? cx + CUT : cx - CUT;
          consider(portX, G.cy - G.neck);
          consider(portX, G.cy + G.neck);
        }
      }
      const qx = clamp(x, G.left + CUT, G.right - CUT);
      consider(qx, G.cy - G.neck);
      consider(qx, G.cy + G.neck);
      return { x: bx, y: by, distance: Math.sqrt(best) };
    }

    walls(p, previousX = p.x) {
      if (!this.open && Math.abs(p.x - G.mid) < R && Math.abs(p.y - G.cy) < G.neck + R) {
        const side = previousX <= G.mid ? -1 : 1;
        p.x = G.mid + side * (R + 0.00001);
        if (p.vx * side < 0) p.vx = -p.vx;
      }
      const wall = this.nearestWall(p.x, p.y);
      const inside = this.contains(p.x, p.y);
      if (wall.distance < R || !inside) {
        const d = Math.max(wall.distance, 1e-10);
        const sign = inside ? 1 : -1;
        const nx = (p.x - wall.x) / d * sign;
        const ny = (p.y - wall.y) / d * sign;
        p.x = wall.x + nx * (R + 0.00001);
        p.y = wall.y + ny * (R + 0.00001);
        const normalSpeed = p.vx * nx + p.vy * ny;
        if (normalSpeed < 0) { p.vx -= 2 * normalSpeed * nx; p.vy -= 2 * normalSpeed * ny; }
      }
    }

    collide(a, b) {
      // The partition prevents interactions between particles on its opposite sides.
      if (!this.open && (a.x < G.mid) !== (b.x < G.mid)) return;
      let dx = b.x - a.x, dy = b.y - a.y;
      const d2 = dx * dx + dy * dy;
      if (d2 >= 4 * R * R) return;
      let d = Math.sqrt(d2);
      if (d < 1e-10) { dx = 1; dy = 0; d = 1; }
      const nx = dx / d, ny = dy / d;
      const correction = (2 * R - d) * 0.5 + 0.00001;
      a.x -= nx * correction; a.y -= ny * correction;
      b.x += nx * correction; b.y += ny * correction;
      const relative = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      if (relative > 0) {
        // Equal masses, restitution = 1: exchange the normal velocity components.
        a.vx -= relative * nx; a.vy -= relative * ny;
        b.vx += relative * nx; b.vy += relative * ny;
      }
    }

    step(dt = STEP) {
      // Adaptive substeps keep even unusually fast particles from tunnelling.
      let maxSpeed = 0;
      for (const p of this.particles) maxSpeed = Math.max(maxSpeed, Math.hypot(p.vx, p.vy));
      const substeps = Math.max(1, Math.ceil(maxSpeed * dt / (R * 0.65)));
      const h = dt / substeps;
      for (let sub = 0; sub < substeps; sub++) {
        this.heads.fill(-1);
        for (let i = 0; i < this.count; i++) {
          const p = this.particles[i], previousX = p.x;
          p.x += p.vx * h; p.y += p.vy * h;
          this.walls(p, previousX);
          const col = clamp(Math.floor(p.x / CELL), 0, COLS - 1);
          const row = clamp(Math.floor(p.y / CELL), 0, ROWS - 1);
          const cell = row * COLS + col;
          this.next[i] = this.heads[cell]; this.heads[cell] = i;
        }
        for (let i = 0; i < this.count; i++) {
          const p = this.particles[i];
          const col = clamp(Math.floor(p.x / CELL), 0, COLS - 1);
          const row = clamp(Math.floor(p.y / CELL), 0, ROWS - 1);
          for (let y = Math.max(0, row - 1); y <= Math.min(ROWS - 1, row + 1); y++) {
            for (let x = Math.max(0, col - 1); x <= Math.min(COLS - 1, col + 1); x++) {
              for (let j = this.heads[y * COLS + x]; j !== -1; j = this.next[j]) {
                if (j > i) this.collide(p, this.particles[j]);
              }
            }
          }
        }
        for (const p of this.particles) this.walls(p);
      }
      this.time += dt;
    }

    stats() {
      const counts = [0, 0], energy = [0, 0];
      for (const p of this.particles) {
        const side = p.x < G.mid ? 0 : 1;
        counts[side]++;
        energy[side] += (p.vx ** 2 + p.vy ** 2) / SPEED_SCALE ** 2;
      }
      return { counts, temperatures: energy.map((e, i) => counts[i] ? e / counts[i] : null), totalTemperature: (energy[0] + energy[1]) / this.count };
    }
  }

  let serial = 0;
  class TemperatureSimulation {
    constructor(container, options = {}) {
      if (!container || container.nodeType !== 1) throw new TypeError('Provide a container element.');
      this.container = container;
      this.physics = new GasPhysics(options);
      this.destroyed = false;
      this.inView = true;
      this.abort = new AbortController();
      this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.paused = options.paused === undefined ? this.motionPreference.matches : Boolean(options.paused);
      this.accumulator = 0;
      this.last = 0;
      this.readingTime = 0;
      const id = 'ts-' + (++serial);
      container.innerHTML = `<section class="ts-sim" aria-label="Interactive temperature simulation">
        <div class="ts-topline"><span class="ts-live"><span class="ts-dot" aria-hidden="true"></span><span data-role="play-state">Particles in motion</span></span><span class="ts-model">2D IDEAL GAS · ${this.physics.count} PARTICLES</span></div>
        <div class="ts-readings">
          <div><span class="ts-chamber-label">Left chamber</span><span class="ts-reading"><span data-role="left-reading"></span> <span class="ts-unit">K</span></span><span class="ts-count" data-role="left-count"></span></div>
          <div><span class="ts-chamber-label">Right chamber</span><span class="ts-reading"><span data-role="right-reading"></span> <span class="ts-unit">K</span></span><span class="ts-count" data-role="right-count"></span></div>
        </div>
        <canvas class="ts-canvas" role="img" aria-label="Particles bouncing in two round gas chambers joined by a passage. Faster particles are warmer in color.">Your browser needs Canvas 2D to display the particles.</canvas>
        <div class="ts-legend"><span>Slower</span><span class="ts-spectrum" aria-hidden="true"></span><span>Faster</span></div>
        <div class="ts-controls">
          <div class="ts-sliders">
            <div><label class="ts-slider-label" for="${id}-left"><span>Left starting temperature</span><output for="${id}-left" data-role="left-setting"></output></label><input class="ts-range" id="${id}-left" data-role="left-slider" type="range" min="40" max="600" step="10" value="${this.physics.initial[0]}" aria-describedby="${id}-hint"></div>
            <div><label class="ts-slider-label" for="${id}-right"><span>Right starting temperature</span><output for="${id}-right" data-role="right-setting"></output></label><input class="ts-range" id="${id}-right" data-role="right-slider" type="range" min="40" max="600" step="10" value="${this.physics.initial[1]}" aria-describedby="${id}-hint"></div>
          </div>
          <div class="ts-actions">
            <button class="ts-button ts-primary" type="button" data-role="gate" aria-pressed="false">Open connection</button>
            <button class="ts-button" type="button" data-role="pause">Pause</button>
            <button class="ts-button" type="button" data-role="reset">Reset</button>
            <span class="ts-state"><span class="ts-state-dot" data-role="gate-dot" data-open="false" aria-hidden="true"></span><span data-role="gate-state">Connection closed</span></span>
          </div>
          <p class="ts-hint" id="${id}-hint">Changing a starting temperature restarts the experiment.</p>
        </div>
        <p class="ts-sr-only" data-role="announcement" role="status" aria-live="polite"></p>
      </section>`;
      this.el = container.firstElementChild;
      this.ui = {};
      for (const element of this.el.querySelectorAll('[data-role]')) this.ui[element.dataset.role] = element;
      this.canvas = this.el.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d', { alpha: false });
      if (!this.ctx) throw new Error('Canvas 2D is unavailable.');
      // Cyan → lilac → warm orange; the legend uses these same three stops.
      const stops = [[0, 218, 255], [169, 155, 255], [255, 151, 105]];
      this.colors = Array.from({ length: 64 }, (_, i) => {
        const position = i / 63 * 2;
        const segment = Math.min(1, Math.floor(position));
        const t = position - segment;
        return `rgb(${stops[segment].map((value, channel) => Math.round(value + (stops[segment + 1][channel] - value) * t)).join(',')})`;
      });
      const on = (element, name, fn) => element.addEventListener(name, fn, { signal: this.abort.signal });
      on(this.ui.gate, 'click', () => this.setConnection(!this.physics.open));
      on(this.ui.pause, 'click', () => this.setPaused(!this.paused));
      on(this.ui.reset, 'click', () => this.reset());
      for (const side of ['left', 'right']) {
        on(this.ui[side + '-slider'], 'input', () => this.reset(false));
        on(this.ui[side + '-slider'], 'change', () => this.announce('Starting temperatures updated. Connection closed.'));
      }
      on(document, 'visibilitychange', () => this.schedule());
      on(this.motionPreference, 'change', event => { if (event.matches) this.setPaused(true); });
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(entries => { this.inView = entries[0].isIntersecting; this.schedule(); });
        this.intersectionObserver.observe(this.el);
      }
      this.sync();
      this.resize();
      this.schedule();
    }

    announce(message) { this.ui.announcement.textContent = message; }

    sync() {
      const open = this.physics.open;
      this.ui.gate.textContent = open ? 'Close connection' : 'Open connection';
      this.ui.gate.setAttribute('aria-pressed', String(open));
      this.ui['gate-state'].textContent = open ? 'Connection open' : 'Connection closed';
      this.ui['gate-dot'].dataset.open = String(open);
      this.ui.pause.textContent = this.paused ? 'Play' : 'Pause';
      this.ui['play-state'].textContent = this.paused ? 'Experiment paused' : 'Particles in motion';
      for (const side of ['left', 'right']) {
        this.ui[side + '-setting'].textContent = this.ui[side + '-slider'].value + ' K';
        this.ui[side + '-slider'].setAttribute('aria-valuetext', this.ui[side + '-slider'].value + ' kelvin');
      }
      this.updateReadings();
    }

    updateReadings() {
      const stats = this.physics.stats();
      ['left', 'right'].forEach((side, i) => {
        this.ui[side + '-reading'].textContent = stats.temperatures[i] === null ? '—' : Math.round(stats.temperatures[i]);
        this.ui[side + '-count'].textContent = stats.counts[i] + ' particles';
      });
    }

    reset(announce = true) {
      if (this.destroyed) return;
      this.physics.reset(Number(this.ui['left-slider'].value), Number(this.ui['right-slider'].value));
      this.accumulator = 0;
      this.sync(); this.draw();
      if (announce) this.announce('Experiment reset. Connection closed.');
    }

    setConnection(open) {
      if (this.destroyed) return;
      this.physics.open = Boolean(open);
      if (!this.physics.open) for (const p of this.physics.particles) this.physics.walls(p);
      this.sync(); this.draw();
      this.announce(this.physics.open ? 'Connection open. Particles can mix and exchange energy.' : 'Connection closed. The gases are separated.');
    }

    setPaused(paused) {
      if (this.destroyed) return;
      this.paused = Boolean(paused);
      this.sync(); this.schedule();
      this.announce(this.paused ? 'Experiment paused.' : 'Experiment playing.');
    }

    resize() {
      if (this.destroyed) return;
      this.refreshTheme();
      const width = this.canvas.getBoundingClientRect().width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.max(1, Math.round(width * dpr));
      this.canvas.height = Math.max(1, Math.round(width * G.height / G.width * dpr));
      this.draw();
    }

    // Resolve CSS once when the component is sized, rather than on each frame.
    // Hosts can also call this after changing their theme variables.
    refreshTheme() {
      if (this.destroyed) return;
      const style = getComputedStyle(this.el);
      this.theme = Object.fromEntries(['surface', 'chamber-center', 'chamber-edge', 'wall', 'primary', 'gate-open']
        .map(name => [name, style.getPropertyValue('--ts-' + name).trim()]));
      this.draw();
    }

    schedule() {
      cancelAnimationFrame(this.frame);
      this.last = 0;
      if (!this.destroyed && !this.paused && !document.hidden && this.inView) this.frame = requestAnimationFrame(t => this.tick(t));
    }

    tick(now) {
      if (this.destroyed || this.paused || document.hidden || !this.inView) return;
      if (this.last) this.accumulator += Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      while (this.accumulator >= STEP) { this.physics.step(STEP); this.accumulator -= STEP; }
      this.draw();
      if (now - this.readingTime > 200) { this.updateReadings(); this.readingTime = now; }
      this.frame = requestAnimationFrame(t => this.tick(t));
    }

    draw() {
      const ctx = this.ctx;
      if (!ctx || !this.theme || this.destroyed) return;
      ctx.setTransform(this.canvas.width / G.width, 0, 0, this.canvas.height / G.height, 0, 0);
      ctx.fillStyle = this.theme.surface; ctx.fillRect(0, 0, G.width, G.height);
      const path = () => {
        ctx.beginPath();
        ctx.arc(G.left, G.cy, G.radius, ANGLE, Math.PI * 2 - ANGLE);
        ctx.lineTo(G.right - CUT, G.cy - G.neck);
        ctx.arc(G.right, G.cy, G.radius, Math.PI + ANGLE, Math.PI * 3 - ANGLE);
        ctx.closePath();
      };
      ctx.save(); path(); ctx.clip();
      ctx.fillStyle = this.theme['chamber-edge']; ctx.fillRect(0, 0, G.width, G.height);
      for (const cx of [G.left, G.right]) {
        const glow = ctx.createRadialGradient(cx, G.cy, 20, cx, G.cy, G.radius);
        glow.addColorStop(0, this.theme['chamber-center']); glow.addColorStop(1, this.theme['chamber-edge']);
        ctx.fillStyle = glow; ctx.fillRect(cx - G.radius, G.cy - G.radius, 2 * G.radius, 2 * G.radius);
      }
      for (const p of this.physics.particles) {
        const speed = Math.hypot(p.vx, p.vy);
        const color = this.colors[Math.round(clamp(speed / 250, 0, 1) * 63)];
        ctx.strokeStyle = color; ctx.globalAlpha = 0.24; ctx.lineWidth = R * 1.1; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.028, p.y - p.vy * 0.028); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      path(); ctx.strokeStyle = this.theme.wall; ctx.lineWidth = 1.7; ctx.stroke();
      const top = G.cy - G.neck, bottom = G.cy + G.neck;
      ctx.strokeStyle = this.physics.open ? this.theme['gate-open'] : this.theme.primary;
      ctx.lineWidth = this.physics.open ? 3 : 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(G.mid, top - 6); ctx.lineTo(G.mid, this.physics.open ? top + 5 : bottom + 6);
      if (this.physics.open) { ctx.moveTo(G.mid, bottom - 5); ctx.lineTo(G.mid, bottom + 6); }
      ctx.stroke();
    }

    destroy() {
      this.destroyed = true;
      cancelAnimationFrame(this.frame);
      this.abort.abort();
      this.resizeObserver.disconnect();
      this.intersectionObserver?.disconnect();
      this.el.remove();
    }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { GasPhysics, TemperatureSimulation, geometry: G, particleRadius: R };
  else root.TemperatureSimulation = TemperatureSimulation;
})(typeof window === 'undefined' ? globalThis : window);
