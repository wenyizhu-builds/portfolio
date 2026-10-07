/* Filter view on desktop (v70, owner): while a region is chosen, the map steps aside. Every case
   lies in a loose pile along the floor; the ones that match fly up into tidy rows, and the
   rest stay in the pile, faded. Clearing the filter drops them back and the map returns.
   Physics: matter-js. Runs only while the view is open and something is moving (L4). */
import Matter from 'matter-js';
import { filterSets, nodes, ui, type SiteNode } from './content';
import { esc, filters, matches, reducedMotion, t } from './state';
import { iconFor } from './shapes';

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const cssPx = (name: string) => parseFloat(cssVar(name)) || 0;

type Tile = {
  n: SiteNode; el: HTMLButtonElement; body: Matter.Body; w: number; h: number;
  up: boolean; slot: { x: number; y: number } | null; from: { x: number; y: number; a: number }; t0: number;
};

export type FlyupApi = { update(on: boolean, current: string | null): void };

export function createFlyup(host: HTMLElement, side: HTMLElement, open: (id: string) => void): FlyupApi {
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;
  const layer = document.createElement('div');
  layer.className = 'flyup';
  const count = document.createElement('p');
  count.className = 'fly-count lab';
  count.setAttribute('aria-live', 'polite');
  layer.append(count);
  host.append(layer);

  const engine = Engine.create({ gravity: { x: 0, y: 1.1 }, enableSleeping: true });
  let walls: Matter.Body[] = [];
  let tiles: Tile[] = [];
  let on = false;
  let raf = 0;
  let dragged = false;

  /** The free area: left of the card column, between the header and the legend. */
  function area() {
    const W = layer.clientWidth, H = layer.clientHeight;
    const left = cssPx('--map-inset');
    const right = Math.max(left + 200, side.getBoundingClientRect().left - cssPx('--map-inset'));
    const floor = H - cssPx('--bottom-h');
    return { W, H, left, right, floor };
  }

  function makeWalls() {
    Composite.remove(engine.world, walls);
    const { H, left, right, floor } = area(), t = 400;
    walls = [
      Bodies.rectangle((left + right) / 2, floor + t / 2, (right - left) * 3, t, { isStatic: true }),
      Bodies.rectangle(left - t / 2, H / 2, t, H * 4, { isStatic: true }),
      Bodies.rectangle(right + t / 2, H / 2, t, H * 4, { isStatic: true }),
    ];
    Composite.add(engine.world, walls);
  }

  function build() {
    makeWalls();
    const { left, right } = area();
    tiles = nodes.filter((n) => n.type === 'case' && !n.status).map((n) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'fly-tile';
      el.innerHTML = `${iconFor(n, 14)}<span>${esc(t(n.label))}</span>${n.headline ? `<span class="fly-num">${esc(n.headline.num)}</span>` : ''}`;
      layer.append(el);
      const w = el.offsetWidth, h = el.offsetHeight;
      const x = left + w / 2 + Math.random() * Math.max(1, right - left - w);
      const y = -h - Math.random() * 360; // first time: they rain in from above
      const body = Bodies.rectangle(x, y, w, h, { chamfer: { radius: 8 }, friction: 0.6, frictionAir: 0.015, restitution: 0.15, angle: (Math.random() - 0.5) * 0.9 });
      Composite.add(engine.world, body);
      const tile: Tile = { n, el, body, w, h, up: false, slot: null, from: { x, y, a: 0 }, t0: 0 };
      el.addEventListener('click', () => { if (tile.up && !dragged) open(n.id); });
      return tile;
    });
    // drag the pile around
    const mouse = Mouse.create(layer);
    const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } as Matter.IConstraintDefinition });
    Composite.add(engine.world, mc);
    Events.on(mc, 'startdrag', () => { dragged = false; });
    Events.on(mc, 'mousemove', () => { if (mc.body) { dragged = true; wake(); } });
    Events.on(mc, 'enddrag', () => setTimeout(() => (dragged = false), 0));
    const m = mouse as unknown as { mousewheel: EventListener };
    mouse.element.removeEventListener('wheel', m.mousewheel);
    layer.addEventListener('pointerdown', wake);
  }

  /** Matches rise into centred rows under the header; the rest stay in (or drop back to) the pile. */
  function lift() {
    const hit = tiles.filter((x) => matches(x.n.id));
    tiles.forEach((x) => { if (!hit.includes(x) && x.up) drop(x); });
    const { left, right } = area();
    const gap = cssPx('--fly-gap'), top = cssPx('--top-h') + cssPx('--fly-top');
    const maxW = Math.min(right - left, cssPx('--fly-row-max'));
    const rows: [Tile[], number][] = [];
    let row: Tile[] = [], rw = 0;
    hit.forEach((x) => { if (row.length && rw + gap + x.w > maxW) { rows.push([row, rw]); row = []; rw = 0; } rw += (row.length ? gap : 0) + x.w; row.push(x); });
    if (row.length) rows.push([row, rw]);
    const now = performance.now(), mid = (left + right) / 2;
    let k = 0;
    rows.forEach(([r, w], ri) => {
      let x = mid - w / 2;
      r.forEach((tile) => {
        const target = { x: x + tile.w / 2, y: top + ri * (tile.h + gap) + tile.h / 2 };
        x += tile.w + gap;
        if (!tile.up || !tile.slot || Math.hypot(tile.slot.x - target.x, tile.slot.y - target.y) > 1) {
          tile.from = { x: tile.body.position.x, y: tile.body.position.y, a: tile.body.angle };
          tile.t0 = now + (tile.up ? 0 : k++ * cssPx('--fly-stagger'));
        }
        tile.slot = target;
        if (!tile.up) { tile.up = true; Body.setStatic(tile.body, true); tile.body.collisionFilter.mask = 0; tile.el.classList.add('is-up'); }
      });
    });
    tiles.forEach((x) => x.el.classList.toggle('is-dim', !hit.includes(x)));
    const region = filters.region ? t(filterSets.region.options[filters.region]) : '';
    count.innerHTML = `<b>${hit.length}</b> ${esc(t(hit.length === 1 ? ui.flyOne : ui.flyMany))} ${esc(region)}`;
    count.style.left = `${mid}px`;
    count.style.top = `${top - cssPx('--fly-gap') * 3}px`;
  }

  function drop(x: Tile) {
    x.up = false; x.slot = null;
    x.el.classList.remove('is-up', 'is-current');
    Body.setStatic(x.body, false);
    x.body.collisionFilter.mask = 0xffffffff;
    Matter.Sleeping.set(x.body, false); // a body that was static counts as asleep and would hang in the air
    Body.setVelocity(x.body, { x: (Math.random() - 0.5) * 6, y: -2 });
    Body.setAngularVelocity(x.body, (Math.random() - 0.5) * 0.2);
  }

  const backOut = (x: number) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  let last = 0;
  function frame(now: number) {
    raf = 0;
    Engine.update(engine, Math.min(32, now - (last || now - 16)));
    last = now;
    const dur = cssPx('--fly-rise');
    let moving = false;
    for (const x of tiles) {
      if (x.up && x.slot) {
        const d = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (now - x.t0) / dur));
        const e = reducedMotion.matches ? 1 : backOut(d);
        Body.setPosition(x.body, { x: x.from.x + (x.slot.x - x.from.x) * e, y: x.from.y + (x.slot.y - x.from.y) * e });
        Body.setAngle(x.body, x.from.a * (1 - Math.min(1, d * 1.4)));
        if (d < 1) moving = true;
      } else if (!x.body.isSleeping) moving = true;
      const { x: bx, y: by } = x.body.position;
      x.el.style.transform = `translate(${bx - x.w / 2}px,${by - x.h / 2}px) rotate(${x.body.angle}rad)`;
    }
    if (moving || dragged) raf = requestAnimationFrame(frame);
    else last = 0; // everything has settled: stop until something moves again (L4)
  }
  function wake() { if (!raf) raf = requestAnimationFrame(frame); }

  addEventListener('resize', () => { if (!tiles.length) return; makeWalls(); if (on) lift(); wake(); });

  return {
    update(next, current) {
      if (next && !tiles.length) build();
      if (next) lift();
      else tiles.forEach((x) => { if (x.up) drop(x); });
      tiles.forEach((x) => x.el.classList.toggle('is-current', next && x.up && x.n.id === current));
      if (next !== on) { on = next; layer.classList.toggle('is-on', on); }
      if (tiles.length) wake();
    },
  };
}
