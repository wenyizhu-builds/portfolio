/*
 * Case diagrams: how a system worked, drawn instead of showing internal screenshots.
 * Colours and type sizes come from CSS classes (.dg-*), never from here. Coordinates are a
 * fixed viewBox about as wide as the card's text column, so 1 unit ≈ 1 px.
 */
import type { T } from './content';

type Box = { col: number; row: number; t: T; ai?: boolean }; // label lines split on "\n"
type Diagram = { boxes: Box[]; loopLabel: T; aria: T };

const COLS = 3, W = 96, H = 60, GAP_X = 24, GAP_Y = 44, LINE = 17;
const X = (c: number) => c * (W + GAP_X);
const Y = (r: number) => r * (H + GAP_Y);
const VB_W = COLS * W + (COLS - 1) * GAP_X, VB_H = 2 * H + GAP_Y;

/* A two-row loop: steps 1–3 left to right on top, 4–6 right to left below, then back to 1. */
const diagrams: Record<string, Diagram> = {
  'ua-loop': {
    boxes: [
      { col: 0, row: 0, t: { en: 'Brand\ncreative', zh: '品牌\n素材' } },
      { col: 1, row: 0, t: { en: 'UA\ntest', zh: '买量\n测试' } },
      { col: 2, row: 0, t: { en: 'AI\ntagging', zh: 'AI\n打标' }, ai: true },
      { col: 2, row: 1, t: { en: 'Winning\npatterns', zh: '跑赢\n规律' }, ai: true },
      { col: 1, row: 1, t: { en: 'Briefs +\nscripts', zh: 'Brief\n与脚本' } },
      { col: 0, row: 1, t: { en: 'Scale\nor stop', zh: '放量\n或停投' } },
    ],
    loopLabel: { en: 'next round', zh: '下一轮' },
    aria: { en: 'The creative testing loop, with AI tagging and pattern finding', zh: '创意测试循环，含 AI 打标与规律识别' },
  },
};

export function hasDiagram(key?: string): boolean {
  return !!key && key in diagrams;
}

export function diagramSvg(key: string, tx: (t: T) => string): string {
  const d = diagrams[key];
  const box = (b: Box, i: number) => {
    const x = X(b.col), y = Y(b.row), lines = tx(b.t).split('\n');
    const y0 = y + H / 2 + 5 - ((lines.length - 1) * LINE) / 2 + 5;
    return `<rect class="dg-box${b.ai ? ' dg-ai' : ''}" x="${x + 0.5}" y="${y + 0.5}" width="${W - 1}" height="${H - 1}" rx="4"/>` +
      `<text class="dg-n" x="${x + 8}" y="${y + 15}">${String(i + 1).padStart(2, '0')}</text>` +
      lines.map((l, k) => `<text class="dg-t" x="${x + 8}" y="${y0 + k * LINE}">${l}</text>`).join('');
  };
  const arrow = (x1: number, y1: number, x2: number, y2: number, cls = 'dg-line') =>
    `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#dg-a-${cls})"/>`;
  const marker = (cls: string) => `<marker id="dg-a-${cls}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path class="${cls}-head" d="M0 0 L7 3.5 L0 7z"/></marker>`;
  const midY0 = Y(0) + H / 2, midY1 = Y(1) + H / 2, pad = 3;
  const arrows = [
    arrow(X(0) + W + pad, midY0, X(1) - pad, midY0),
    arrow(X(1) + W + pad, midY0, X(2) - pad, midY0),
    arrow(X(2) + W / 2, Y(0) + H + pad, X(2) + W / 2, Y(1) - pad),
    arrow(X(2) - pad, midY1, X(1) + W + pad, midY1),
    arrow(X(1) - pad, midY1, X(0) + W + pad, midY1),
    arrow(X(0) + W / 2, Y(1) - pad, X(0) + W / 2, Y(0) + H + pad, 'dg-loop'),
  ].join('');
  const loopText = `<text class="dg-lt" x="${X(0) + W / 2 + 8}" y="${Y(0) + H + GAP_Y / 2 + 4}">${tx(d.loopLabel)}</text>`;
  return `<figure class="dg"><svg viewBox="0 0 ${VB_W} ${VB_H}" role="img" aria-label="${tx(d.aria)}"><defs>${marker('dg-line')}${marker('dg-loop')}</defs>${arrows}${loopText}${d.boxes.map(box).join('')}</svg></figure>`;
}
