import { kindOf, type NodeType, type SiteNode } from './content';

/* The ✳ mark: one drawing, used at these sizes. stroke = line weight in the 36-unit box. */
export const AST = {
  map: { stroke: 4.6 }, // centre of the map (and the favicon)
  index: { px: 12, stroke: 4.2 }, // the INDEX heading in the panel
  phoneHero: { px: 64, stroke: 4.2 },
};
const AST_R = 15, AST_BOX = 36;

/** The ✳ as a standalone <svg>. */
export function astSvg(size: { px: number; stroke: number }, cls = ''): string {
  const h = AST_BOX / 2;
  return `<svg${cls ? ` class="${cls}"` : ''} width="${size.px}" height="${size.px}" viewBox="${-h} ${-h} ${AST_BOX} ${AST_BOX}" aria-hidden="true">${asterisk(AST_R, size.stroke)}</svg>`;
}

/** Favicon markup (vite.config.ts), same drawing as the map centre. */
export function astIcon(color: string): string {
  const h = AST_BOX / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-h} ${-h} ${AST_BOX} ${AST_BOX}" stroke="${color}">${asterisk(AST_R, AST.map.stroke)}</svg>`;
}

/** Asterisk mark (four strokes). */
export function asterisk(r: number, width: number, cls = 'ast'): string {
  let s = `<g class="${cls}">`;
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 4;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    s += `<line x1="${(-x).toFixed(2)}" y1="${(-y).toFixed(2)}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" stroke-width="${width}" stroke-linecap="round"/>`;
  }
  return s + '</g>';
}

/* One size for every point (owner decision v33): shapes differ, sizes don't. */
const SIZE = { r: 10, hex: 11.5, num: 9, square: 17, eye: 2.4, tri: 1.25, triCounted: 1.55 }; // hex: a hexagon reads smaller than a square of the same radius

function poly(n: number, r: number, rot = 0): string {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 2 * Math.PI) / n;
    pts.push(`${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/*
 * Shape vocabulary (like a diagram legend):
 *   root      asterisk (cobalt, the brightest point)
 *   Information = solid dot. Every other group (area, practice, Experience, Education)
 *   takes its family's shape with a number inside (see kindOf in content.ts).
 *   One shape per family, the same on the map and in the INDEX (filled there):
 *   case      square    — Growth Marketing work
 *   ai        circle with a centre point — AI projects
 *   creative  diamond   — Creative work
 *   role      triangle  — Experience
 *   school    hexagon   — Education
 *   Prepared-later items are drawn dashed.
 *   info      small solid dot
 */
export function shape(type: NodeType, opts: { num?: number; featured?: boolean; special?: boolean; solid?: boolean } = {}): string {
  // solid = the filled glyph used as a category heading (INDEX); outline otherwise
  const c = opts.solid ? 'shp shp-solid' : 'shp';
  const num = (fs: number) =>
    opts.num != null && !opts.solid ? `<text class="num" y="${(fs * 0.36).toFixed(1)}" font-size="${fs}" text-anchor="middle">${opts.num}</text>` : '';
  const h = SIZE.square / 2;
  switch (type) {
    case 'root':
      return asterisk(AST_R, AST.map.stroke);
    case 'branch':
      if (opts.special) return `<circle class="shp shp-solid" r="${SIZE.r}"/><circle class="shp-eye" r="${SIZE.eye}"/>`;
      return `<polygon class="${c}" points="${poly(6, SIZE.hex)}"/>${num(SIZE.num)}`;
    case 'sub':
      return `<polygon class="${c}" points="${poly(6, SIZE.hex)}"/>${num(SIZE.num)}`;
    case 'case': // Growth Marketing work (and the Growth Marketing point, with its count)
      return `<rect class="${c}" x="${-h}" y="${-h}" width="${SIZE.square}" height="${SIZE.square}"/>${num(SIZE.num)}`;
    case 'ai': // AI projects: a circle with a centre point (the count replaces the point)
      return `<circle class="${c}" r="${SIZE.r}"/>${opts.num != null || opts.solid ? num(SIZE.num) : `<circle class="shp-dot" r="${SIZE.eye}"/>`}`;
    case 'creative': // Creative work: a diamond
      return `<polygon class="${c}" points="${poly(4, SIZE.r * 1.15, -Math.PI / 2)}"/>${num(SIZE.num)}`;
    case 'role': // Experience: a triangle
    {
      // A triangle's middle is small, so a triangle holding a count grows to fit a normal-size number,
      // which sits on the triangle's centroid (its visual centre), same as every other shape
      const counted = opts.num != null && !opts.solid;
      const r = SIZE.r * (counted ? SIZE.triCounted : SIZE.tri);
      return `<polygon class="${c}" points="${poly(3, r, -Math.PI / 2)}"/>${counted ? num(SIZE.num) : ''}`;
    }
    case 'school': // Education: a hexagon
      return `<polygon class="${c}" points="${poly(6, SIZE.hex)}"/>${num(SIZE.num)}`;
    case 'info':
      return `<circle class="shp shp-solid" r="4"/>`;
  }
}

export function shapeFor(n: SiteNode, num?: number): string {
  return shape(kindOf(n.id), { num, featured: n.featured, special: n.id === 'info' });
}

export function iconFor(n: SiteNode, px = 14, solid = false): string {
  return icon(kindOf(n.id), px, n.id === 'info', solid);
}

/** Small standalone SVG icon for panels, legend and phone menu. */
export function icon(type: NodeType, px = 14, special = false, solid = false): string {
  const vb = type === 'root' ? 36 : type === 'branch' ? 28 : 22;
  return `<svg class="ico ico-${type}" width="${px}" height="${px}" viewBox="${-vb / 2} ${-vb / 2} ${vb} ${vb}" aria-hidden="true">${shape(type, { special, solid })}</svg>`;
}
