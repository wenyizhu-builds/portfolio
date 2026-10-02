import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { ancestors, byId, childrenOf, nodes, rolesOrder, ui, type SiteNode } from './content';
import { esc, filtering, isDone, matches, reducedMotion, state, t } from './state';
import { shapeFor } from './shapes';

interface SimNode extends SimulationNodeDatum {
  id: string;
  depth: number;
  rad: number;
  bend: number; // which way this node's link elbows
  box: { w: number; top: number; bottom: number }; // shape + label, around the node's centre (world units)
}
interface SimLink extends SimulationLinkDatum<SimNode> {
  kind: 'tree' | 'related';
  dist: number;
  key: string;
}

const SVGNS = 'http://www.w3.org/2000/svg';

/* The home map, fixed (owner-approved layout, v40). World units, ✳ at 0,0.
   On arrival the map starts exactly here, and whenever nothing is selected a gentle
   pull brings every point back, so home always looks the same. Link lengths between
   these points are derived from the same numbers, so the forces agree with the layout. */
const HOME_LAYOUT: Record<string, [number, number]> = {
  growth: [242, -123],
  'ua-creative-strategy': [205, -262],
  'zzz-jp-accounts': [400, -205],
  'gip-testing': [430, -70],
  'more-growth': [300, 15],
  info: [-149, -90],
  education: [-239, -158],
  experience: [-310, -8],
  ai: [-22, 203],
  'ai-workbench': [-140, 290],
  'ai-slot-1': [-17, 328],
  'ai-slot-2': [86, 292],
  creative: [181, 166],
};
const homeOf = (id: string): [number, number] | undefined => (id === 'root' ? [0, 0] : HOME_LAYOUT[id]);
/** Link length from the home layout, when both ends have a home position. */
function homeDist(parent: string, child: string): number | undefined {
  const a = homeOf(parent), b = homeOf(child);
  return a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : undefined;
}
/* Areas that open on arrival vs. stay folded until clicked. */
/* Camera tuning. Like the reference, the map does not zoom in on a selection: it
   shows fewer points instead, so the scale stays steady and every link of the
   selection — including dotted connections — stays on screen. The scale only
   shrinks (down to `min`) when what must be shown doesn't fit. */
const CAMERA = {
  max: 1.1, // the normal, steady scale
  min: 0.7, // never smaller than this, however much has to fit
  pad: { x: 110, top: 40, bottom: 70 }, // room kept around the shown points for their labels
  ease: 0.06, // camera easing per frame
  still: 0.3, // px: closer than this counts as arrived, and drawing stops
};

/* Hand-written notes (v55). Where each note sits beside its point, in world units from the
   point's centre: `text` is where the first line starts; the arrow runs from → via → to
   (a gentle curve through `via`). The words live in content.ts (`note`). */
type NotePlace = { text: [number, number]; from: [number, number]; via: [number, number]; to: [number, number]; rot: number };
const NOTES: Record<string, NotePlace> = {
  'ua-creative-strategy': { text: [-262, -96], from: [-118, -56], via: [-66, -46], to: [-22, -20], rot: -6 },
  'zzz-jp-accounts': { text: [-150, -112], from: [-60, -66], via: [-34, -46], to: [-20, -20], rot: -5 },
  'gip-testing': { text: [-46, 118], from: [4, 92], via: [12, 74], to: [4, 56], rot: 3 },
  ai: { text: [-160, -70], from: [-70, -26], via: [-46, -16], to: [-22, -6], rot: -5 },
};
const NOTE = { reaim: 80, tailGap: 8, bend: 14, tipGap: 22, outward: 70, outwardText: 14, edge: 12, size: 27, line: 1.1, head: 12, headAngle: 0.5 };

/* Layout tuning — every other layout number lives here. */
const LAYOUT = {
  homePull: 0.12, // strength of the pull back to HOME_LAYOUT while nothing is selected
  spawnDist: 50, // a new node appears this far from its parent
  roleStep: 105, roleStepOdd: 20, roleSwing: [90, -100, 80, -110, 85], // career path zig-zag
  roleLink: 95, roleLinkVar: 45, // link length between roles (+ up to var)
  areaLink: 170, practiceLink: 100, leafLink: 86, relatedLink: 220, // default link lengths
  linkJitter: [0.7, 0.8] as const, // leaf links: base + up to var, so children sit near and far
  treeStrength: 0.5, relatedStrength: 0.02,
  charge: [-1100, -700, -380] as const, chargeMax: 420, // root / area / everything else
  centre: { root: 0.15, x: 0.01, y: 0.014 },
  pathPull: 0.08,
  radius: { root: 70, min: 34, max: 72, perChar: 3.6 }, // collision radius from label length
  hit: { root: 30, other: 20 }, // click target radius
  labelY: { root: 36, other: 25, line: 15 }, labelWrap: 20,
  // keeping points and lines apart (v47)
  charW: 6.9, shapeHalf: 13, kickLine: 13, // label box estimate: width per character, shape half-size, date line
  boxGap: 10, boxPush: 0.5, // two points' boxes keep this gap; how hard they are pushed apart
  leverMin: 0.3, // when a line's loose end moves to clear a point, it moves at most 1/leverMin times as far
  lineClear: 10, linePush: 0.35, // a point's box (shape + label) keeps this far from any line that isn't its own
  // keeping lines apart from each other (v48)
  fanMin: 0.62, fanPush: 0.5, // two lines leaving the same point keep at least this angle (radians, ≈35°)
  crossGap: 16, crossPush: 0.35, // a line that crosses another is pulled back to one side, this far clear
  moveRelated: 1, moveTree: 0.3, // how readily a dotted-line end / a tree child moves to make room
  siblingRing: 110, // an end point's siblings sit about this far round their parent
  groupRing: 175, groupStagger: 35, groupMin: 4, groupSiblingSpread: 0.62, // an opened group of groupMin+ ends: a full radial fan, alternate ends a little further out (v62); with one of its ends open, a half fan (radians apart)
  relatedPull: 0.15, relatedSpread: 0.75, // connections gather on the far side of the selection from its chain, this far apart (radians)
  chainBend: 2.0, chainPull: 0.25, // the selection's chain (root → … → selection) never folds back sharper than this (radians, ≈115°)
  velocityDecay: 0.5, alphaDecay: 0.05, alphaStart: 0.7, dragAlpha: 0.3, dragSlop: 4,
  firstTicks: 120, reducedTicks: 300,
  collide: { strength: 0.9, iterations: 2 },
  spawnJitter: 1.4, // radians of randomness when a child first appears
  elbow: { at: 0.42, max: 42, slope: 0.28, min: 16 }, // link shape: bend point, step size
};

const FOLDED_AT_HOME = new Set(['creative']);

/** Stable pseudo-random number in [0,1) from an id, so the layout is varied but repeatable. */
function hash(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

const depthOf = (id: string) => ancestors(id).length;

/** Node fade length, read from CSS (--fade-node) so removal waits exactly as long as the fade. */
const fadeMs = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fade-node')) || 0;

/** Count of work items (leaves) under a node — shown inside hexagons. */
function leafCount(id: string): number {
  const kids = childrenOf(id);
  if (!kids.length) return 1;
  return kids.reduce((s, k) => s + (childrenOf(k.id).length ? leafCount(k.id) : 1), 0);
}

/** Link parent used for layout: roles form a chain (a timeline) instead of a star. */
/** A group whose ends are laid out as an even fan when it is opened (v54). */
const isGroup = (id: string) => {
  const kids = childrenOf(id);
  return kids.length >= LAYOUT.groupMin && kids.every((c) => !childrenOf(c.id).length && c.type !== 'role' && c.type !== 'school');
};
const isGroupEnd = (parent: string, id: string) => isGroup(parent) && byId.get(id)?.parent === parent;
/** A group's ends spread all the way round it, leaving one gap for the line back to its parent (v62). */
const groupSpread = (id: string) => (2 * Math.PI) / (childrenOf(id).length + 1);
/** Alternate ends of a group sit a little further out, so neighbouring labels never meet. */
function groupRadius(parent: string, id: string): number {
  const i = childrenOf(parent).findIndex((c) => c.id === id);
  return LAYOUT.groupRing + (i % 2 ? LAYOUT.groupStagger : 0);
}
function layoutParent(n: SiteNode): string | undefined {
  if (n.type === 'role') {
    const i = rolesOrder.indexOf(n.id);
    return i > 0 ? rolesOrder[i - 1] : n.parent;
  }
  return n.parent;
}

function wrap(label: string, max = LAYOUT.labelWrap): string[] {
  // Keep parenthesized names together: Hoyoverse / (Genshin Impact).
  const words = label.match(/\([^)]*\)|\S+/g) || [];
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

export interface MapApi {
  setFocus(id: string | null): void;
  refilter(): void;
  setViewport(area: { x: number; y: number; w: number; h: number }): void;
  rerenderLabels(): void;
}

export function createMap(host: HTMLElement, onSelect: (id: string) => void): MapApi {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.classList.add('map');
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', t(ui.mapLabel));
  const world = document.createElementNS(SVGNS, 'g');
  const gLinks = document.createElementNS(SVGNS, 'g');
  const gNodes = document.createElementNS(SVGNS, 'g');
  const gNotes = document.createElementNS(SVGNS, 'g');
  gNotes.classList.add('map-notes');
  world.append(gLinks, gNotes, gNodes);
  svg.append(world);
  host.append(svg);

  // Area of the screen the map may use (excludes the reading panel).
  let area = { x: 0, y: 0, w: host.clientWidth, h: host.clientHeight }; // replaced by setViewport() at once
  let cam = { x: host.clientWidth / 2, y: host.clientHeight / 2, k: 1 };
  let focus: string | null = null;
  let near = new Set<string>();

  const simNodes = new Map<string, SimNode>();
  const els = new Map<string, SVGGElement>();
  let links: SimLink[] = [];
  const linkEls = new Map<string, SVGPathElement>();

  /* The point held at the centre: the selection — except a single role, where holding
     it would fold the career path onto itself (there the path's start, Experience, holds),
     and an end point, where its parent holds so its siblings stay put around it. */
  const anchorId = () => {
    if (!focus) return 'root';
    const n = byId.get(focus);
    if (n?.type === 'role') return 'experience';
    // an end point holds its parent at the centre, so moving between siblings keeps the map steady
    if (n && !childrenOf(focus).length && n.parent && n.parent !== 'root') return n.parent;
    return focus;
  };

  const sim: Simulation<SimNode, SimLink> = forceSimulation<SimNode, SimLink>([])
    .velocityDecay(LAYOUT.velocityDecay)
    .force(
      'link',
      forceLink<SimNode, SimLink>([])
        .id((d) => d.id)
        .distance((l) => l.dist)
        .strength((l) => (l.kind === 'tree' ? LAYOUT.treeStrength : LAYOUT.relatedStrength)),
    )
    .force('charge', forceManyBody<SimNode>().strength((d) => LAYOUT.charge[Math.min(d.depth, 2)]).distanceMax(LAYOUT.chargeMax))
    .force('collide', forceCollide<SimNode>().radius((d) => d.rad).strength(LAYOUT.collide.strength).iterations(LAYOUT.collide.iterations))
    .force('x', forceX<SimNode>(0).strength((d) => (d.id === anchorId() ? LAYOUT.centre.root : LAYOUT.centre.x)))
    .force('y', forceY<SimNode>(0).strength((d) => (d.id === anchorId() ? LAYOUT.centre.root : LAYOUT.centre.y)))
    .force('home', (alpha: number) => {
      // nothing selected: every point drifts back to its place in HOME_LAYOUT
      if (focus) return;
      simNodes.forEach((n) => {
        const h = homeOf(n.id);
        if (!h || n.fx != null) return;
        n.vx! += (h[0] - n.x!) * LAYOUT.homePull * alpha;
        n.vy! += (h[1] - n.y!) * LAYOUT.homePull * alpha;
      });
    })
    .force('boxes', (alpha: number) => {
      // No two points (shape + label) overlap: overlapping boxes are pushed apart along
      // the axis where they overlap least. Circles alone let wide labels collide.
      const ns = [...simNodes.values()];
      for (let i = 0; i < ns.length; i++)
        for (let j = i + 1; j < ns.length; j++) {
          const a = ns[i], b = ns[j];
          const ox = (a.box.w + b.box.w) / 2 + LAYOUT.boxGap - Math.abs(a.x! - b.x!);
          const ay0 = a.y! + a.box.top, ay1 = a.y! + a.box.bottom, by0 = b.y! + b.box.top, by1 = b.y! + b.box.bottom;
          const oy = Math.min(ay1, by1) - Math.max(ay0, by0) + LAYOUT.boxGap;
          if (ox <= 0 || oy <= 0) continue;
          const k = LAYOUT.boxPush * alpha;
          if (ox < oy) {
            const s = Math.sign(a.x! - b.x!) || 1;
            if (a.fx == null) a.vx! += s * ox * k;
            if (b.fx == null) b.vx! -= s * ox * k;
          } else {
            const s = Math.sign(a.y! + (a.box.top + a.box.bottom) / 2 - (b.y! + (b.box.top + b.box.bottom) / 2)) || 1;
            if (a.fx == null) a.vy! += s * oy * k;
            if (b.fx == null) b.vy! -= s * oy * k;
          }
        }
    })
    .force('lines', (alpha: number) => {
      // Lines don't run through points that aren't theirs: a point too close to another
      // link is pushed off it, sideways. (The link is treated as a straight segment.)
      for (const l of links) {
        const s = l.source as unknown as SimNode, t = l.target as unknown as SimNode;
        if (typeof s !== 'object' || typeof t !== 'object') continue;
        const dx = t.x! - s.x!, dy = t.y! - s.y!, len2 = dx * dx + dy * dy || 1;
        simNodes.forEach((n) => {
          if (n === s || n === t) return;
          // measure from the line to the point's whole box (shape + label), not just its centre
          const cx = n.x!, cy = n.y! + (n.box.top + n.box.bottom) / 2;
          const hw = n.box.w / 2, hh = (n.box.bottom - n.box.top) / 2;
          const u = Math.max(0, Math.min(1, ((cx - s.x!) * dx + (cy - s.y!) * dy) / len2));
          if (u <= 0 || u >= 1) return;
          const px = s.x! + u * dx, py = s.y! + u * dy;
          let ex = cx - px, ey = cy - py;
          const gap = Math.hypot(Math.max(0, Math.abs(ex) - hw), Math.max(0, Math.abs(ey) - hh));
          const inside = Math.abs(ex) < hw && Math.abs(ey) < hh;
          if (!inside && gap >= LAYOUT.lineClear) return;
          const need = inside ? LAYOUT.lineClear + Math.min(hw - Math.abs(ex), hh - Math.abs(ey)) : LAYOUT.lineClear - gap;
          if (Math.hypot(ex, ey) < 1e-3) { ex = -dy; ey = dx; } // exactly on the line: step to one side
          // step off sideways (perpendicular to the line)
          const nx = -dy, ny = dx, side = Math.sign(ex * nx + ey * ny) || 1, nl = Math.hypot(nx, ny) || 1;
          const k = need * LAYOUT.linePush * alpha;
          // the selection's chain holds its shape: when a line runs through one of its points,
          // the line's loose end steps aside instead (pushing the chain is what folded it)
          const chain = n.fx != null || (!!focus && (n.id === 'root' || isCtx(n))); // held points don't move either
          const loose = chain ? [s, t].filter(movable) : [];
          if (n.fx == null && (!chain || !loose.length)) {
            n.vx! += (side * nx / nl) * k;
            n.vy! += (side * ny / nl) * k;
          }
          for (const e of loose) {
            // lever: moving an end by x moves the line at this point by x × (share of the line on that end's side)
            const lever = Math.max(LAYOUT.leverMin, e === t ? u : 1 - u);
            e.vx! -= (side * nx / nl) * (k / lever);
            e.vy! -= (side * ny / nl) * (k / lever);
          }
        });
      }
    })
    .force('fan', (alpha: number) => {
      // Lines that leave the same point spread out: no two run along each other.
      const byEnd = new Map<SimNode, { o: SimNode; w: number }[]>();
      for (const l of links) {
        const s = l.source as unknown as SimNode, t = l.target as unknown as SimNode;
        if (typeof s !== 'object' || typeof t !== 'object') continue;
        const w = l.kind === 'related' ? LAYOUT.moveRelated : LAYOUT.moveTree;
        (byEnd.get(s) || byEnd.set(s, []).get(s)!).push({ o: t, w: movable(t) ? w : 0 });
        (byEnd.get(t) || byEnd.set(t, []).get(t)!).push({ o: s, w: movable(s) ? w : 0 });
      }
      byEnd.forEach((ends, c) => {
        for (let i = 0; i < ends.length; i++)
          for (let j = i + 1; j < ends.length; j++) {
            const A = ends[i], B = ends[j];
            if (!A.w && !B.w) continue;
            const aa = Math.atan2(A.o.y! - c.y!, A.o.x! - c.x!), ab = Math.atan2(B.o.y! - c.y!, B.o.x! - c.x!);
            let d = ab - aa;
            d = Math.atan2(Math.sin(d), Math.cos(d)); // signed, in (-π, π]
            const gap = LAYOUT.fanMin - Math.abs(d);
            if (gap <= 0) continue;
            const sgn = Math.sign(d) || 1;
            const turn = (e: { o: SimNode; w: number }, dir: number, share: number) => {
              const rx = e.o.x! - c.x!, ry = e.o.y! - c.y!;
              const k = gap * share * LAYOUT.fanPush * alpha * dir;
              e.o.vx! += -ry * k; // tangential: rotate about c
              e.o.vy! += rx * k;
            };
            const sum = A.w + B.w;
            turn(A, -sgn, A.w / sum);
            turn(B, sgn, B.w / sum);
          }
      });
    })
    .force('uncross', (alpha: number) => {
      // Two lines that cross (and share no point) are untangled: the end that moves
      // most readily is pulled back to the other line's near side.
      const segs = links
        .map((l) => ({ s: l.source as unknown as SimNode, t: l.target as unknown as SimNode, kind: l.kind }))
        .filter((g) => typeof g.s === 'object' && typeof g.t === 'object');
      const free = (g: (typeof segs)[number]) => {
        const w = g.kind === 'related' ? LAYOUT.moveRelated : LAYOUT.moveTree;
        // a dotted line moves its far end (the one outside the selection's chain); a tree line moves the child
        const [q, p] = g.kind === 'related' && isCtx(g.t) && !isCtx(g.s) ? [g.s, g.t] : [g.t, g.s];
        if (movable(q)) return { q, p, w };
        if (movable(p)) return { q: p, p: q, w: w * LAYOUT.moveTree };
        return null;
      };
      for (let i = 0; i < segs.length; i++)
        for (let j = i + 1; j < segs.length; j++) {
          const A = segs[i], B = segs[j];
          if (A.s === B.s || A.s === B.t || A.t === B.s || A.t === B.t) continue;
          if (!crosses(A.s, A.t, B.s, B.t)) continue;
          const fa = free(A), fb = free(B);
          const pick = fa && (!fb || fa.w >= fb.w) ? { f: fa, other: B } : fb ? { f: fb, other: A } : null;
          if (!pick) continue;
          const { q, p } = pick.f, C = pick.other.s, D = pick.other.t;
          const lx = D.x! - C.x!, ly = D.y! - C.y!, len = Math.hypot(lx, ly) || 1;
          const nx = -ly / len, ny = lx / len; // unit normal of the other line
          const side = (n: SimNode) => (n.x! - C.x!) * nx + (n.y! - C.y!) * ny;
          const want = Math.sign(side(p)) || 1; // go to the side the line's fixed end is on
          const need = want * side(q) >= 0 ? 0 : Math.abs(side(q)) + LAYOUT.crossGap;
          const k = need * LAYOUT.crossPush * alpha * want;
          q.vx! += nx * k;
          q.vy! += ny * k;
        }
    })
    .force('chain', (alpha: number) => {
      // The chain from the root to the selection reads outward: where it folds back on
      // itself (a parent sitting past its child), its two ends swing round the
      // middle point, so the other lines don't have to cross it.
      if (!focus || byId.get(focus)?.type === 'role') return; // roles: the career path force shapes it
      const chain: SimNode[] = [];
      // from the centred point back: for an end point that is its parent, so siblings aren't swung about
      for (let id: string | undefined = anchorId(); id; id = layoutParent(byId.get(id)!)) {
        const n = simNodes.get(id);
        if (n) chain.unshift(n);
      }
      for (let i = 1; i < chain.length - 1; i++) {
        const p = chain[i - 1], m = chain[i], c = chain[i + 1];
        const a1 = Math.atan2(p.y! - m.y!, p.x! - m.x!), a2 = Math.atan2(c.y! - m.y!, c.x! - m.x!);
        const bend = Math.abs(Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1)));
        if (bend >= LAYOUT.chainBend || m.fx != null) continue;
        const k = ((LAYOUT.chainBend - bend) / LAYOUT.chainBend) * LAYOUT.chainPull * alpha;
        // open the fold: both ends swing round the middle point towards a straight line
        const open = (e: SimNode, other: SimNode) => {
          if (e.fx != null) return;
          const r = Math.hypot(e.x! - m.x!, e.y! - m.y!);
          const ox = m.x! - other.x!, oy = m.y! - other.y!, ol = Math.hypot(ox, oy) || 1;
          e.vx! += (m.x! + (ox / ol) * r - e.x!) * k;
          e.vy! += (m.y! + (oy / ol) * r - e.y!) * k;
        };
        open(p, c);
        open(c, p);
      }
    })
    .force('related', (alpha: number) => {
      // A selection's connections sit on its open side — away from the chain that leads
      // back to the ✳ — fanned out, so their dotted lines never have to cross the chain.
      if (!focus || byId.get(focus)?.type === 'role') return; // roles: the career path decides
      fanOut(focus, relatedOf(focus), () => LAYOUT.relatedLink, LAYOUT.relatedSpread, alpha, movable);
      // an end point: it and its siblings fan out on the parent's open side too (v53), so the
      // line back to the ✳ never runs through one of them
      // an opened group (e.g. More cases): its ends fan out evenly, alternately near and far
      if (focus && isGroup(focus)) fanOut(focus, childrenOf(focus).map((c) => c.id), (id) => groupRadius(focus!, id), groupSpread(focus), alpha, movable);
      const a = anchorId();
      if (a !== focus && a !== 'experience')
        fanOut(a, childrenOf(a).map((c) => c.id), isGroup(a) ? (id) => groupRadius(a, id) : () => LAYOUT.siblingRing, isGroup(a) ? LAYOUT.groupSiblingSpread : LAYOUT.relatedSpread, alpha, (n) => n.fx == null);
    })
    .force('path', (alpha: number) => {
      // The career path zig-zags away from Experience instead of forming a straight line:
      // each step goes further out and swings alternately to one side, by uneven amounts.
      const ex = simNodes.get('experience');
      const info = simNodes.get('info');
      if (!ex || !info) return;
      let dx = ex.x! - info.x!, dy = ex.y! - info.y!;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len; dy /= len;
      const px = -dy, py = dx;
      const swing = LAYOUT.roleSwing;
      rolesOrder.forEach((id, i) => {
        const n = simNodes.get(id);
        if (!n || n.fx != null) return;
        const out = LAYOUT.roleStep * (i + 1) + (i % 2 ? LAYOUT.roleStepOdd : 0);
        const tx = ex.x! + dx * out + px * swing[i % swing.length];
        const ty = ex.y! + dy * out + py * swing[i % swing.length];
        n.vx! += (tx - n.x!) * LAYOUT.pathPull * alpha;
        n.vy! += (ty - n.y!) * LAYOUT.pathPull * alpha;
      });
    })
    .alphaDecay(LAYOUT.alphaDecay)
    .on('tick', wake)
    .on('end', wake);


  /** Pull `ids` onto an arc round `centerId`, on the side facing away from the chain back to
      the ✳, in their current order (so points don't swap), travelling round the centre. */
  function fanOut(centerId: string, ids: string[], radius: (id: string) => number, spread: number, alpha: number, ok: (n: SimNode) => boolean) {
    const f = simNodes.get(centerId);
    if (!f) return;
    const back = ['root', ...ancestors(centerId)].filter((id) => id !== centerId).map((id) => simNodes.get(id)).filter((n): n is SimNode => !!n);
    if (!back.length) return;
    const bx = back.reduce((a, n) => a + n.x!, 0) / back.length, by = back.reduce((a, n) => a + n.y!, 0) / back.length;
    const base = Math.atan2(f.y! - by, f.x! - bx);
    const off = (x: number) => Math.atan2(Math.sin(x - base), Math.cos(x - base)); // angle from the open side
    const at = (n: SimNode) => off(Math.atan2(n.y! - f.y!, n.x! - f.x!));
    const pts = ids.map((id) => simNodes.get(id)).filter((n): n is SimNode => !!n && ok(n)).sort((a, b) => at(a) - at(b));
    pts.forEach((n, i) => {
      const want = (i - (pts.length - 1) / 2) * spread;
      const rx = n.x! - f.x!, ry = n.y! - f.y!, r = Math.hypot(rx, ry) || 1;
      const turn = want - at(n); // never passes behind the centre (the chain)
      const k = LAYOUT.relatedPull * alpha;
      const R = radius(n.id);
      n.vx! += ((-ry / r) * turn * r + (rx / r) * (R - r)) * k;
      n.vy! += ((rx / r) * turn * r + (ry / r) * (R - r)) * k;
    });
  }

  /** A point that may move to make room for a line: not held by a drag, not the centre, and not
      the selection's own chain (root → … → selection), which stays put so the view doesn't flip. */
  function movable(n: SimNode): boolean {
    if (!focus && homeOf(n.id)) return false; // the home map is laid out by hand (HOME_LAYOUT)
    return n.fx == null && n.id !== anchorId() && n.id !== 'root' && !isCtx(n);
  }
  function isCtx(n: SimNode): boolean {
    return !!focus && (n.id === focus || ancestors(focus).includes(n.id));
  }
  /** Do segments ab and cd cross (strictly inside both)? */
  function crosses(a: SimNode, b: SimNode, c: SimNode, d: SimNode): boolean {
    const den = (b.x! - a.x!) * (d.y! - c.y!) - (b.y! - a.y!) * (d.x! - c.x!);
    if (Math.abs(den) < 1e-9) return false;
    const u = ((c.x! - a.x!) * (d.y! - c.y!) - (c.y! - a.y!) * (d.x! - c.x!)) / den;
    const v = ((c.x! - a.x!) * (b.y! - a.y!) - (c.y! - a.y!) * (b.x! - a.x!)) / den;
    return u > 0 && u < 1 && v > 0 && v < 1;
  }

  function relatedOf(id: string): string[] {
    const out = new Set<string>(byId.get(id)?.related || []);
    nodes.forEach((o) => o.related?.includes(id) && out.add(o.id));
    return [...out];
  }

  /* ---------- what is visible ---------- */
  function visibleSet(f: string | null): Set<string> {
    const vis = new Set<string>(['root']);
    for (const b of childrenOf('root')) {
      vis.add(b.id);
      if (!FOLDED_AT_HOME.has(b.id) || f === b.id || (f && ancestors(f).includes(b.id)))
        childrenOf(b.id).forEach((c) => vis.add(c.id));
    }
    if (f && f !== 'root') {
      // A selection shows only its own chain: the way back to the ✳, what's inside it,
      // and what it connects to. Everything else steps away, so nothing needs zooming.
      vis.clear();
      vis.add('root');
      vis.add(f);
      ancestors(f).forEach((a) => vis.add(a));
      childrenOf(f).forEach((c) => vis.add(c.id));
      relatedOf(f).forEach((r) => vis.add(r));
      // An end point (a single piece of work) keeps its siblings on the map, so the reader can
      // go from one to the next directly instead of stepping up to the parent and back down (v53).
      const par = byId.get(f)?.parent;
      if (!childrenOf(f).length && par && par !== 'root') childrenOf(par).forEach((c) => vis.add(c.id));
    }
    // a filter on the home map unfolds every matching piece of work and the way to it (v61)
    if (!f && filtering())
      for (const n of nodes)
        if (!childrenOf(n.id).length && matches(n.id)) [n.id, ...ancestors(n.id)].forEach((a) => vis.add(a));
    // a visible role needs its whole chain back to Experience
    if ((f && (f === 'experience' || byId.get(f)?.type === 'role')) || rolesOrder.some((r) => vis.has(r))) rolesOrder.forEach((r) => vis.add(r));
    return vis;
  }

  /* Points drawn at full strength. Everything shown belongs to the current view, so all of them. */
  /** What stays at full strength. An open end point keeps its siblings on the map (v53), but greyed,
      so the chosen piece of work stands out and the next one is still one click away. */
  function nearSet(vis: Set<string>, f: string | null): Set<string> {
    if (!f || childrenOf(f).length) return vis;
    const par = byId.get(f)?.parent;
    if (!par || par === 'root') return vis;
    const sibs = new Set(childrenOf(par).map((c) => c.id).filter((id) => id !== f));
    return new Set([...vis].filter((id) => !sibs.has(id)));
  }

  /** The box a point takes up — its shape plus its label lines — for keeping points apart. */
  function boxOf(n: SiteNode): SimNode['box'] {
    const lines = n.type === 'root' ? [t(n.label)] : wrap(t(n.label));
    const kick = !n.status && (n.type === 'case' || n.type === 'role') ? LAYOUT.kickLine : 0;
    const y0 = n.type === 'root' ? LAYOUT.labelY.root : LAYOUT.labelY.other;
    const w = Math.max(LAYOUT.shapeHalf * 2, Math.max(...lines.map((l) => l.length)) * LAYOUT.charW);
    return { w, top: -LAYOUT.shapeHalf, bottom: y0 + (lines.length - 1) * LAYOUT.labelY.line + kick + 4 };
  }

  function spawn(n: SiteNode): SimNode {
    const d = depthOf(n.id);
    let x = 0;
    let y = 0;
    const lp = layoutParent(n);
    const p = lp ? simNodes.get(lp) : undefined;
    const home = homeOf(n.id);
    if (home) {
      [x, y] = home;
    } else if (p) {
      const gp = lp ? layoutParent(byId.get(lp)!) : undefined;
      const g = gp ? simNodes.get(gp) : undefined;
      const ang = g ? Math.atan2(p.y! - g.y!, p.x! - g.x!) : hash(n.id + ':a') * Math.PI * 2;
      const jitter = (hash(n.id + ':j') - 0.5) * LAYOUT.spawnJitter; // repeatable: same id, same place
      x = p.x! + Math.cos(ang + jitter) * LAYOUT.spawnDist;
      y = p.y! + Math.sin(ang + jitter) * LAYOUT.spawnDist;
    }
    const longest = Math.max(...wrap(n.label.en).map((l) => l.length));
    const Rr = LAYOUT.radius;
    const rad = n.id === 'root' ? Rr.root : Math.max(Rr.min, Math.min(Rr.max, longest * Rr.perChar)) ;
    return { id: n.id, x, y, vx: 0, vy: 0, depth: d, rad, bend: hash(n.id + ':b') < 0.5 ? -1 : 1, box: boxOf(n) };
  }

  function nodeEl(n: SiteNode): SVGGElement {
    const g = document.createElementNS(SVGNS, 'g');
    g.classList.add('node', `t-${n.type}`);
    if (n.id === 'info') g.classList.add('is-info');
    if (n.status) g.classList.add('is-prep');
    if (n.featured) g.classList.add('is-featured');
    if (n.id === 'growth') g.classList.add('is-key'); // the main area gets a cobalt outline
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.dataset.id = n.id;
    const num = n.type === 'branch' || n.type === 'sub' ? leafCount(n.id) : undefined;
    g.innerHTML = `<circle class="hit" r="${n.type === 'root' ? LAYOUT.hit.root : LAYOUT.hit.other}"/><g class="shape-wrap"><g class="shape"><g>${shapeFor(
      n,
      n.id === 'info' ? undefined : num,
    )}</g></g></g><text class="lbl-halo" text-anchor="middle" aria-hidden="true"></text><text class="lbl" text-anchor="middle"></text>`;
    fillLabel(g, n);
    attachPointer(g, n.id);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(n.id);
      }
    });
    return g;
  }

  function fillLabel(g: SVGGElement, n: SiteNode) {
    const text = g.querySelector('text.lbl') as SVGTextElement;
    const label = t(n.label);
    g.setAttribute('aria-label', n.type === 'case' && n.period ? `${label}, ${n.period}` : label);
    const lines = n.type === 'root' ? [label] : wrap(label);
    const Y = LAYOUT.labelY;
    const y0 = n.type === 'root' ? Y.root : Y.other; // every point is the same size, so every label sits the same distance below
    let html = lines.map((l, i) => `<tspan x="0" y="${y0 + i * Y.line}">${esc(l)}</tspan>`).join('');
    if (!n.status && n.period && (n.type === 'case' || n.type === 'role')) {
      // items still in preparation show only their name; the dashed outline says the rest
      const k = n.period;
      html += `<tspan class="kick${n.type === 'case' ? ' case-date' : ''}" x="0" y="${y0 + lines.length * Y.line}">${esc(k)}</tspan>`;
    }
    text.innerHTML = html;
    (g.querySelector('text.lbl-halo') as SVGTextElement).innerHTML = html;
  }

  /* ---------- pointer: click vs drag ---------- */
  function toWorld(cx: number, cy: number) {
    const r = svg.getBoundingClientRect();
    return { x: (cx - r.left - cam.x) / cam.k, y: (cy - r.top - cam.y) / cam.k };
  }

  function attachPointer(g: SVGGElement, id: string) {
    let start: { x: number; y: number } | null = null;
    let dragging = false;
    // Every way a gesture can end goes through here, so a node is never left pinned
    // and the simulation never left running hot.
    const end = (select: boolean) => {
      if (!start) return;
      const n = simNodes.get(id);
      if (dragging) {
        if (n) { n.fx = null; n.fy = null; }
        g.classList.remove('dragging');
        sim.alphaTarget(0);
      } else if (select) onSelect(id);
      start = null;
      dragging = false;
    };
    g.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return; // right / middle click do nothing
      start = { x: e.clientX, y: e.clientY };
      dragging = false;
      g.setPointerCapture(e.pointerId);
    });
    g.addEventListener('pointermove', (e) => {
      if (!start) return;
      const n = simNodes.get(id);
      if (!n) return;
      if (!dragging && Math.hypot(e.clientX - start.x, e.clientY - start.y) > LAYOUT.dragSlop) {
        dragging = true;
        g.classList.add('dragging');
        sim.alphaTarget(LAYOUT.dragAlpha).restart();
      }
      if (dragging) {
        const w = toWorld(e.clientX, e.clientY);
        n.fx = w.x;
        n.fy = w.y;
      }
    });
    g.addEventListener('pointerup', () => end(true));
    g.addEventListener('pointercancel', () => end(false));
    g.addEventListener('lostpointercapture', () => end(false));
  }

  /* ---------- update graph for a focus ---------- */
  let firstEntrance = true;
  function update() {
    const stagger = firstEntrance && !reducedMotion.matches
      ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entrance-step')) || 0 : 0;
    const reveal = (el: SVGElement, order: number) => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (stagger) setTimeout(() => el.classList.remove('entering'), order * stagger);
        else el.classList.remove('entering');
      }));
    };
    const vis = visibleSet(focus);
    near = nearSet(vis, focus);


    for (const id of [...simNodes.keys()]) {
      if (!vis.has(id)) {
        simNodes.delete(id);
        const el = els.get(id)!;
        el.classList.add('leaving');
        els.delete(id);
        setTimeout(() => el.remove(), fadeMs()); // wait for the CSS fade to finish
      }
    }
    // spawn parents before children
    const ordered = nodes.filter((n) => vis.has(n.id)).sort((a, b) => depthOf(a.id) - depthOf(b.id));
    const rolesFirst = ordered.filter((n) => n.type !== 'role').concat(rolesOrder.map((r) => byId.get(r)!).filter((n) => vis.has(n.id)));
    for (const n of rolesFirst) {
      if (!simNodes.has(n.id)) {
        simNodes.set(n.id, spawn(n));
        const el = nodeEl(n);
        el.classList.add('entering');
        gNodes.append(el);
        els.set(n.id, el);
        reveal(el, rolesFirst.indexOf(n));
      }
    }

    const next: SimLink[] = [];
    for (const n of ordered) {
      const lp = layoutParent(n);
      if (lp && vis.has(lp)) {
        const d = depthOf(n.id);
        const jitter = LAYOUT.linkJitter[0] + hash(n.id) * LAYOUT.linkJitter[1]; // some children sit close, some far
        const dist = n.type === 'role'
          ? LAYOUT.roleLink + hash(n.id) * LAYOUT.roleLinkVar
          : (lp === focus || lp === anchorId()) && isGroupEnd(lp, n.id) ? groupRadius(lp, n.id)
          : homeDist(lp, n.id) ?? (d === 1 ? LAYOUT.areaLink : (d === 2 ? LAYOUT.practiceLink : LAYOUT.leafLink) * jitter);
        next.push({ source: lp, target: n.id, kind: 'tree', dist, key: `t:${lp}>${n.id}` });
      }
      (n.related || []).forEach((r) => {
        const key = `r:${[n.id, r].sort().join('~')}`;
        // only the selection's own connections: an ancestor's dotted lines are its business, not this view's
        if (vis.has(r) && (n.id === focus || r === focus) && !next.some((l) => l.key === key))
          next.push({ source: n.id, target: r, kind: 'related', dist: LAYOUT.relatedLink, key });
      });
    }
    links = next;
    const keys = new Set(links.map((l) => l.key));
    for (const l of links) {
      if (!linkEls.has(l.key)) {
        const path = document.createElementNS(SVGNS, 'path');
        path.classList.add('lk', `lk-${l.kind}`, 'entering');
        gLinks.append(path);
        linkEls.set(l.key, path);
        reveal(path, ordered.findIndex((n) => n.id === l.target));
      }
    }
    for (const [k, el] of [...linkEls]) {
      if (!keys.has(k)) {
        el.remove();
        linkEls.delete(k);
      }
    }

    paintFar();
    els.forEach((el, id) => {
      el.classList.toggle('is-current', id === (focus || 'root'));
      el.classList.toggle('is-visited', id !== 'root' && isDone(id) && id !== focus);
      const par = byId.get(id)?.parent;
      el.classList.toggle('show-kick', !!focus && (id === focus || par === focus || par === byId.get(focus)?.parent));
    });

    firstEntrance = false;
    sim.nodes([...simNodes.values()]);
    (sim.force('link') as ReturnType<typeof forceLink<SimNode, SimLink>>).links(links);
    if (reducedMotion.matches) {
      sim.alpha(1).stop();
      for (let i = 0; i < LAYOUT.reducedTicks; i++) sim.tick();
      wake();
    } else {
      sim.alphaTarget(0).alpha(LAYOUT.alphaStart).restart(); // settle, then stay still
      wake();
    }
  }

  /* An elbowed link: a short straight run, a horizontal step, then on to the target. */
  function linkPath(s: SimNode, tg: SimNode, id: string): string {
    const f = (v: number) => v.toFixed(1);
    // A line leaving a point downward starts under that point's label, and one arriving from
    // below ends under it, so a line never runs through its own point's name.
    const below = (n: SimNode, other: SimNode) => other.y! > n.y! + n.box.bottom;
    const sx = s.x!, tx = tg.x!;
    const sy = below(s, tg) ? s.y! + s.box.bottom : s.y!;
    const ty = below(tg, s) ? tg.y! + tg.box.bottom : tg.y!;
    const dx = tx - sx, dy = ty - sy;
    void id;
    const E = LAYOUT.elbow;
    const ax = sx + dx * E.at, ay = sy + dy * E.at;
    let st = Math.max(-E.max, Math.min(E.max, dx * E.slope));
    if (Math.abs(st) < E.min) st = E.min * (Math.sign(st) || s.bend); // no tiny notches
    const bx = ax + st;
    return `M${f(sx)},${f(sy)}L${f(ax)},${f(ay)}L${f(bx)},${f(ay)}L${f(tx)},${f(ty)}`;
  }

  /* Camera: frame every point that is shown, at a steady scale. The focus pulls
     itself to the middle through the centring force; the camera centres on the
     whole shown chain so both ends of every link stay in view. */
  function baseCamera() {
    const pts = [...simNodes.values()];
    if (!pts.length) return cam;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach((n) => {
      x0 = Math.min(x0, n.x!); x1 = Math.max(x1, n.x!);
      y0 = Math.min(y0, n.y!); y1 = Math.max(y1, n.y!);
    });
    const P = CAMERA.pad;
    const w = x1 - x0 + P.x * 2, h = y1 - y0 + P.top + P.bottom;
    const k = Math.max(CAMERA.min, Math.min(CAMERA.max, area.w / w, area.h / h));
    const cx = (x0 + x1) / 2, cy = (y0 - P.top + y1 + P.bottom) / 2;
    return { x: area.x + area.w / 2 - cx * k, y: area.y + area.h / 2 - cy * k, k };
  }

  function targetCamera() {
    return baseCamera();
  }

  /* Drawing is on demand: a frame is requested only while something moves (the
     simulation or the camera easing). Once both are still, nothing runs at all. */
  let raf = 0;
  function wake() {
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function frame() {
    raf = 0;
    const moving = render();
    if (moving || sim.alpha() >= sim.alphaMin()) wake();
  }

  /** Draw one frame; returns true while the camera is still easing. */
  /** Grey a point when it's off to the side of the selection, or doesn't match the chosen filters (v60). */
  function paintFar() {
    const lit = (id: string) => near.has(id) && matches(id);
    els.forEach((el, id) => el.classList.toggle('is-far', !lit(id)));
    for (const l of links) {
      const el = linkEls.get(l.key)!;
      const s = typeof l.source === 'object' ? (l.source as SimNode).id : (l.source as string);
      const tg = typeof l.target === 'object' ? (l.target as SimNode).id : (l.target as string);
      el.classList.toggle('is-far', !(lit(s) && lit(tg)));
    }
  }

  function render(): boolean {
    const tc = targetCamera();
    const e = reducedMotion.matches ? 1 : CAMERA.ease;
    const moving = Math.abs(tc.x - cam.x) > CAMERA.still || Math.abs(tc.y - cam.y) > CAMERA.still || Math.abs(tc.k - cam.k) > CAMERA.still / 1000;
    cam = moving ? { x: cam.x + (tc.x - cam.x) * e, y: cam.y + (tc.y - cam.y) * e, k: cam.k + (tc.k - cam.k) * e } : tc;
    world.setAttribute('transform', `translate(${cam.x.toFixed(1)},${cam.y.toFixed(1)}) scale(${cam.k.toFixed(3)})`);
    simNodes.forEach((n, id) => els.get(id)?.setAttribute('transform', `translate(${n.x!.toFixed(1)},${n.y!.toFixed(1)})`));
    for (const l of links) {
      const s = l.source as unknown as SimNode;
      const tg = l.target as unknown as SimNode;
      if (typeof s !== 'object' || typeof tg !== 'object') continue;
      linkEls.get(l.key)?.setAttribute('d', linkPath(s, tg, l.key));
    }
    drawNotes();
    return moving;
  }

  /* ---------- hand-written notes (v55) ---------- */
  const noteEls = new Map<string, SVGGElement>();
  const lines = (s: string, size: number) =>
    s.split('\n').map((l, i) => `<tspan x="0" dy="${i ? size * NOTE.line : 0}">${esc(l)}</tspan>`).join('');
  function arrowPath(p: NotePlace): string {
    const [a, m, b] = [p.from, p.via, p.to];
    const c = [2 * m[0] - (a[0] + b[0]) / 2, 2 * m[1] - (a[1] + b[1]) / 2];
    const ang = Math.atan2(b[1] - c[1], b[0] - c[0]);
    const tip = (s: number) => `${b[0] - NOTE.head * Math.cos(ang + s * NOTE.headAngle)},${b[1] - NOTE.head * Math.sin(ang + s * NOTE.headAngle)}`;
    return `M${a} Q${c} ${b} M${tip(-1)} L${b} L${tip(1)}`;
  }
  function buildNotes() {
    gNotes.replaceChildren();
    noteEls.clear();
    for (const n of nodes) {
      if (!n.note) continue;
      const g = document.createElementNS(SVGNS, 'g');
      g.classList.add('is-hidden');
      g.dataset.id = n.id;
      g.innerHTML = `<path/><text font-size="${NOTE.size}">${lines(t(n.note), NOTE.size)}</text>`;
      gNotes.append(g);
      noteEls.set(n.id, g);
    }
  }
  /** Notes: the hand-placed ones (NOTES) show on the home map only; a case's other note shows while its group is open.
      Either way a note is nudged back inside the map's free area, so the card, the header or the window edge never hides it. */
  function drawNotes() {
    const shown = (id: string) => simNodes.has(id) && near.has(id) && matches(id);
    noteEls.forEach((g, id) => {
      const n = simNodes.get(id);
      const hand = NOTES[id];
      const here = hand ? !focus && !filtering() : focus === byId.get(id)?.parent; // home notes step aside while a filter unfolds the map
      g.classList.toggle('is-hidden', !shown(id) || !here);
      if (!n || !shown(id) || !here) return;
      g.setAttribute('transform', `translate(${n.x!.toFixed(1)},${n.y!.toFixed(1)})`);
      let p = hand;
      let anchor = 'start';
      if (!p) {
        // points here move, so the note sits outward from the parent: arrow beside the shape, words beyond
        const par = simNodes.get(byId.get(id)?.parent ?? '');
        if (!par) return;
        const dx = n.x! - par.x!, dy = n.y! - par.y!, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        const to: [number, number] = [ux * NOTE.tipGap, uy * NOTE.tipGap];
        const from: [number, number] = [to[0] + ux * NOTE.outward, to[1] + uy * NOTE.outward];
        const via: [number, number] = [(to[0] + from[0]) / 2 - uy * 12, (to[1] + from[1]) / 2 + ux * 12];
        const text: [number, number] = [from[0] + (ux >= 0 ? NOTE.outwardText : -NOTE.outwardText), from[1] + (uy >= 0 ? NOTE.size * 0.8 : 0)];
        p = { text, from, via, to, rot: -3 };
        anchor = ux >= 0 ? 'start' : 'end';
      }
      placeNote(g, p, anchor);
    });
  }
  /** Draw a note, then shift its words (and the arrow's tail with them) back inside the free map area. */
  function placeNote(g: SVGGElement, p: NotePlace, anchor: string) {
    const path = g.querySelector('path')!, text = g.querySelector('text')!;
    text.setAttribute('text-anchor', anchor);
    const draw = (sx: number, sy: number) => {
      path.setAttribute('d', arrowPath({ ...p, from: [p.from[0] + sx, p.from[1] + sy], via: [p.via[0] + sx / 2, p.via[1] + sy / 2] }));
      text.setAttribute('transform', `translate(${(p.text[0] + sx).toFixed(1)},${(p.text[1] + sy).toFixed(1)}) rotate(${p.rot})`);
    };
    draw(0, 0);
    const r = text.getBoundingClientRect(), o = svg.getBoundingClientRect(), E = NOTE.edge;
    const x0 = r.left - o.left, x1 = r.right - o.left, y0 = r.top - o.top, y1 = r.bottom - o.top;
    const fit = (lo: number, hi: number, min: number, max: number) => (hi > max ? max - hi : 0) || (lo < min ? min - lo : 0);
    const dx = fit(x0, x1, area.x + E, area.x + area.w - E), dy = fit(y0, y1, area.y + E, area.y + area.h - E);
    if (!dx && !dy) return;
    const sx = dx / cam.k, sy = dy / cam.k;
    draw(sx, sy);
    if (Math.hypot(sx, sy) < NOTE.reaim) return; // a small nudge: the arrow's tail just moves with the words
    // the words moved far, so the arrow restarts from the edge of the words nearest its point
    const n = simNodes.get(g.dataset.id!)!;
    const w = (px: number, py: number): [number, number] => [(px - cam.x) / cam.k - n.x!, (py - cam.y) / cam.k - n.y!];
    const r2 = text.getBoundingClientRect();
    const [bx0, by0] = w(r2.left - o.left, r2.top - o.top), [bx1, by1] = w(r2.right - o.left, r2.bottom - o.top);
    const G = NOTE.tailGap;
    // tail: the words' nearest corner or edge to the point; tip: just beside the point, facing the words
    const from: [number, number] = [Math.min(Math.max(0, bx0 - G), bx1 + G), Math.min(Math.max(0, by0 - G), by1 + G)];
    // tip: where the line towards the words leaves the point's shape-and-label box
    const hx = n.box.w / 2 + G, top = n.box.top - G, bot = n.box.bottom + G;
    const k = Math.min(from[0] ? hx / Math.abs(from[0]) : Infinity, from[1] < 0 ? top / from[1] : from[1] > 0 ? bot / from[1] : Infinity, 1);
    const to: [number, number] = [from[0] * k, from[1] * k];
    const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
    const via: [number, number] = [(to[0] + from[0]) / 2 + ((to[1] - from[1]) / len) * NOTE.bend, (to[1] + from[1]) / 2 - ((to[0] - from[0]) / len) * NOTE.bend];
    path.setAttribute('d', arrowPath({ ...p, from, via, to }));
  }
  buildNotes();

  update();
  // settle the first layout off-screen so the intro fades in on a calm map
  for (let i = 0; i < LAYOUT.firstTicks; i++) sim.tick();
  cam = targetCamera();
  render();

  return {
    setFocus(id) {
      focus = id && id !== 'root' ? id : null;
      if (focus) state.visited.add(focus);
      update();
    },
    setViewport(a) {
      area = a;
      wake();
    },
    refilter() {
      update(); // the set of points changes: matches unfold on the home map
    },
    rerenderLabels() {
      els.forEach((el, id) => fillLabel(el, byId.get(id)!));
      buildNotes();
      drawNotes();
    },
  };
}
