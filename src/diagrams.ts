/*
 * Case diagrams: how a system worked, drawn instead of showing internal screenshots.
 * Colours come from CSS classes (.dg-*), never from here. Coordinates are a fixed
 * viewBox that scales to the card's text column.
 */
import type { T } from './content';

type Box = { x: number; y: number; t: T; ai?: boolean };
type Diagram = { vb: [number, number]; boxes: Box[]; arrows: [number, number, number, number][]; loop: [number, number, number, number]; loopLabel: T; note: T };

const W = 104, H = 38;
const diagrams: Record<string, Diagram> = {
  'ua-loop': {
    vb: [336, 150],
    boxes: [
      { x: 0, y: 4, t: { en: 'Brand creative', zh: '品牌素材' } },
      { x: 116, y: 4, t: { en: 'UA test', zh: '买量测试' } },
      { x: 232, y: 4, t: { en: 'AI tagging', zh: 'AI 打标' }, ai: true },
      { x: 232, y: 96, t: { en: 'Winning patterns', zh: '跑赢规律' }, ai: true },
      { x: 116, y: 96, t: { en: 'Briefs + scripts', zh: 'Brief 与脚本' } },
      { x: 0, y: 96, t: { en: 'Scale / stop', zh: '放量 / 停投' } },
    ],
    arrows: [[104, 23, 114, 23], [220, 23, 230, 23], [284, 42, 284, 94], [232, 115, 222, 115], [116, 115, 106, 115]],
    loop: [52, 96, 52, 44],
    loopLabel: { en: 'next round', zh: '下一轮' },
    note: { en: 'Highlighted: where the AI dashboard does the work', zh: '高亮：AI 工具负责的环节' },
  },
};

export function hasDiagram(key?: string): boolean {
  return !!key && key in diagrams;
}

export function diagramSvg(key: string, tx: (t: T) => string): string {
  const d = diagrams[key];
  const box = (b: Box) =>
    `<rect class="dg-box${b.ai ? ' dg-ai' : ''}" x="${b.x + 0.5}" y="${b.y + 0.5}" width="${W - 1}" height="${H - 1}" rx="3"/>` +
    `<text class="dg-t" x="${b.x + W / 2}" y="${b.y + H / 2 + 4}" text-anchor="middle">${tx(b.t)}</text>`;
  const arrow = ([x1, y1, x2, y2]: number[], cls = 'dg-line') => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#dg-a-${cls})"/>`;
  const marker = (cls: string) => `<marker id="dg-a-${cls}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path class="${cls}-head" d="M0 0 L6 3 L0 6z"/></marker>`;
  const [lx1, ly1, , ly2] = d.loop;
  return `<figure class="dg"><svg viewBox="0 0 ${d.vb[0]} ${d.vb[1]}" role="img" aria-label="${tx(d.note)}"><defs>${marker('dg-line')}${marker('dg-loop')}</defs>` +
    d.arrows.map((a) => arrow(a)).join('') + arrow(d.loop, 'dg-loop') +
    `<text class="dg-lt" x="${lx1 + 8}" y="${(ly1 + ly2) / 2 + 4}">${tx(d.loopLabel)}</text>` +
    d.boxes.map(box).join('') + `</svg><figcaption class="lab">${tx(d.note)}</figcaption></figure>`;
}
