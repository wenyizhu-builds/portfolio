/*
 * All site content lives here. Replace text without touching layout code.
 *
 * Status of copy (2026-09-27): PLACEHOLDER / DRAFT.
 * - Case summaries and results are condensed from each case file's
 *   "Current Working Case" in JS_workspace/career/cases/. They keep the
 *   source's led/supported distinction and scope notes, but are not
 *   owner-approved public copy.
 * - Chinese (zh) is only filled for navigation labels. Body text falls
 *   back to English with a "Chinese version in preparation" note.
 * - Nothing here comes from internal datasets or full campaign reports.
 */

export type Lang = 'en' | 'zh';
export type T = { en: string; zh?: string };

export type NodeType =
  | 'root'
  | 'branch'
  | 'sub'
  | 'case'
  | 'ai'
  | 'creative'
  | 'role'
  | 'school'
  | 'info';

export type Status = 'prep' | 'planned';

export interface Section {
  title: T;
  items: T[];
}

export interface Media {
  src?: string; // leave empty for a placeholder tile
  alt: T;
  caption?: T;
}

export interface SiteNode {
  id: string;
  type: NodeType;
  parent?: string;
  label: T;
  kicker?: T; // small uppercase line under the title
  period?: string;
  markets?: string[];
  role?: T;
  summary?: T;
  sections?: Section[];
  results?: T[];
  media?: Media[];
  status?: Status;
  featured?: boolean;
  related?: string[]; // dotted connections
  headline?: { num: string; label: T }; // the one result a recruiter should see first
  org?: string; // the role (experience node) this work was done in
}

const prep: T = { en: 'Showcase in preparation', zh: '作品准备中' };

export const site = {
  name: 'Wenyi Zhu',
  tag: { en: 'Growth Marketer · Creative Strategist', zh: '增长营销 · 创意策略' } as T,
  // One-line intro at the top of the sticky note (and the phone hero). [Draft]
  intro: {
    en: 'I turn audience insight into creative that converts — and build AI tools to do it faster.',
    zh: '我把用户洞察变成能带来转化的创意，并用自己搭建的 AI 工具让这件事更快。',
  } as T,
  linkedin: 'https://www.linkedin.com/in/wenyi-zhu-mktg/',
  email: '', // PLACEHOLDER: owner will provide a public email
  resumePdf: '', // PLACEHOLDER: put the file in public/ and use a relative path, e.g. 'wenyi-zhu-resume.pdf'
  // false = still a prototype: shows the PROTOTYPE label. `npm run check -- --launch` refuses to pass
  // while this is false or any [Placeholder]/[Draft] text, empty email or empty résumé remains.
  launched: false,
  // Share / search preview (index.html is filled from these at build time).
  metaDescription: {
    en: 'Wenyi Zhu — growth marketer and creative strategist. Case studies from three years of global marketing at HoYoverse, plus AI tools I build.',
  } as T,
  // Key numbers in the INDEX (the bio card that opens on arrival). Figures come from the case files. [Draft]
  note: [
    { num: '3 yrs', label: { en: 'global marketing at HoYoverse', zh: '米哈游全球营销' } },
    { num: '80M+', label: { en: 'views from a JP creator matrix I scaled', zh: '我扩展的日服创作者矩阵播放' } },
    { num: '1% → 15%', label: { en: 'Brand share of UA spend', zh: '品牌素材 UA 花费占比' } },
    { num: 'EN · JP · CN', label: { en: 'markets I work across', zh: '覆盖市场' } },
  ] as { num: string; label: T }[],
};

export const nodes: SiteNode[] = [
  { id: 'root', type: 'root', label: { en: 'Wenyi Zhu', zh: 'Wenyi Zhu' } },

  /* ---------------- Growth Marketing ---------------- */
  {
    id: 'growth',
    type: 'branch',
    parent: 'root',
    label: { en: 'Growth Marketing', zh: '增长营销' },
    kicker: { en: 'Area of work', zh: '工作领域' },
    summary: {
      en: 'Three years of global marketing at HoYoverse, across paid social, creators and campaigns — always measured against acquisition and cost efficiency. [Placeholder copy]',
    },
  },
  {
    id: 'paid-social',
    type: 'sub',
    parent: 'growth',
    label: { en: 'Paid Social & Creative Strategy', zh: '付费社媒与创意策略' },
    kicker: { en: 'Practice', zh: '方向' },
    summary: { en: 'Turning performance data into the next creative brief. [Placeholder copy]' },
  },
  {
    id: 'ugc-influencer',
    type: 'sub',
    parent: 'growth',
    label: { en: 'UGC & Influencer', zh: 'UGC 与达人营销' },
    kicker: { en: 'Practice', zh: '方向' },
    summary: { en: 'Creator-led content built for platforms and for conversion. [Placeholder copy]' },
  },
  {
    id: 'account-growth',
    type: 'sub',
    parent: 'growth',
    label: { en: 'Account Growth', zh: '账号增长' },
    kicker: { en: 'Practice', zh: '方向' },
    summary: { en: 'Growing creator-style account matrices into repeatable systems. [Placeholder copy]' },
  },
  {
    id: 'campaigns',
    type: 'sub',
    parent: 'growth',
    label: { en: 'Campaigns', zh: '整合活动' },
    kicker: { en: 'Practice', zh: '方向' },
    summary: { en: 'Launch campaigns with a measurable action at the end. [Placeholder copy]' },
  },

  {
    id: 'ua-creative-strategy',
    type: 'case',
    parent: 'paid-social',
    headline: { num: '1% → 15%', label: { en: 'Brand creative share of UA spend' } },
    label: { en: 'UA Creative Strategy' },
    kicker: { en: 'Genshin Impact · Google Ads' },
    markets: ['JP', 'NA', 'EU'],
    role: { en: 'Led — UGC creative strategy' },
    summary: {
      en: 'Built a Brand-to-UA testing pipeline that turned creator videos into measurable user-acquisition performance for Genshin Impact.',
    },
    sections: [
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: 'Aligned Brand and UA on key metrics and translated them into four creative variables: hook, value proposition, script structure and format.' },
          { en: 'Ran the work as Explore → Refine → Scale, doubling down only on directions proven in data.' },
          { en: 'Turned test learnings into a repeatable workflow for briefing creators and building regional playbooks.' },
        ],
      },
    ],
    results: [
      { en: '99 creator videos delivered across UA tests' },
      { en: 'Brand creative spend share: 1% → 15%' },
      { en: '13% higher 365-day ROI and ~3.3x LTV vs non-Brand creatives' },
    ],
    media: [{ alt: { en: 'Creative examples' } }],
    related: ['ai-workbench'],
  },
  {
    id: 'xbox-launch',
    type: 'case',
    parent: 'paid-social',
    headline: { num: '+338%', label: { en: 'CTR vs the earlier benchmark' } },
    label: { en: 'Xbox Launch Paid Campaign' },
    kicker: { en: 'Genshin Impact · Meta, YouTube, TikTok, X' },
    markets: ['US', 'DE', 'FR'],
    role: { en: 'Led — creative strategy' },
    summary: {
      en: 'Structured a localized creative test around four value propositions to move console players from interest to landing-page action.',
    },
    sections: [
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: 'Built the test around four messages: open world, global community, cloud gaming across devices, free content.' },
          { en: 'Adapted brand materials into 16 cuts, localized into 144 EN / FR / DE assets.' },
          { en: 'Reviewed results by channel, region and message with Media Strategy.' },
        ],
      },
    ],
    results: [
      { en: '120M+ impressions, 52M+ video views, ~700K landing-page clicks' },
      { en: 'CTR +338% and click cost −66% vs the earlier benchmark' },
    ],
    media: [{ alt: { en: 'Localized creative set' } }],
  },
  {
    id: 'influencer-activation',
    type: 'case',
    parent: 'ugc-influencer',
    headline: { num: '~3x', label: { en: 'engagement vs the prior paid benchmark, at ~40% lower cost' } },
    label: { en: 'Influencer Activation Campaign' },
    kicker: { en: 'Genshin Impact · X' },
    markets: ['EN', 'JP', 'KR'],
    role: { en: 'Led — influencer strategy and execution' },
    summary: {
      en: 'Redesigned creator targeting for a flagship character campaign, shifting from broad amplification to creator-native content for core players.',
    },
    sections: [
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: 'Prioritized mid-tier creators with clear content roles: fan art, gameplay, cosplay, comics, guides.' },
          { en: 'Strengthened EN coverage while keeping JP momentum; briefed player-facing formats.' },
          { en: 'Led budget, sourcing, timeline and approvals; benchmarked against the prior paid activation.' },
        ],
      },
    ],
    results: [
      { en: '56 creators, 78 UGC pieces, 13M+ creator-led exposure, 8%+ engagement' },
      { en: '~3x benchmark engagement at ~40% lower exposure cost' },
    ],
    media: [{ alt: { en: 'Creator content examples' } }],
  },
  {
    id: 'gip-testing',
    type: 'case',
    parent: 'ugc-influencer',
    headline: { num: '80M+', label: { en: 'views in three test rounds — then a data-led stop decision' } },
    label: { en: 'Organic UA Testing: TikTok GIP' },
    kicker: { en: 'Genshin Impact · TikTok' },
    markets: ['US', 'JP'],
    role: { en: 'Led — testing strategy, project owner' },
    summary: {
      en: 'Three structured test rounds to decide whether TikTok’s Gaming Incentive Program could scale as an acquisition channel.',
    },
    sections: [
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: 'Designed the roadmap: CPM vs CPA models, themes, budgets, regional setup, success metrics.' },
          { en: 'Owned task setup, briefs, submission review, data collection and recaps.' },
          { en: 'Compared CPM, CPA/CPI, attribution, retention and content relevance to judge viability.' },
        ],
      },
    ],
    results: [
      { en: '80M+ views, 500K+ submissions, ~2K attributed acquisitions' },
      { en: 'Later rounds: CPM −60%, submissions +200%' },
      { en: 'Decision: stopped GIP as a standalone channel; moved budget to higher-quality creator videos' },
    ],
  },
  {
    id: 'zzz-jp-accounts',
    type: 'case',
    parent: 'account-growth',
    headline: { num: '80M+', label: { en: 'views across 9 accounts, CPM −50%+ without paid boosting' } },
    label: { en: 'Zenless Zone Zero: JP Account Growth' },
    kicker: { en: 'YouTube, X' },
    period: '2024 Q3 – mid-2025',
    markets: ['JP'],
    role: { en: 'Led — scale-up of an early-stage account matrix' },
    summary: {
      en: 'Took over an early-stage Japanese creator-account matrix and scaled it into a repeatable growth system before handover.',
    },
    sections: [
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: 'Set account positioning across guide, entertainment and lore lanes; closed weak directions.' },
          { en: 'Ran performance reviews on hooks, topics, packaging and platform fit; redirected stalled accounts.' },
          { en: 'Documented SOPs, KPI logic and routines for handover.' },
        ],
      },
    ],
    results: [
      { en: '9 active accounts, 80M+ cumulative views' },
      { en: '50K+ followers (+50%+), CPM −50%+ without paid boosting' },
    ],
    media: [{ alt: { en: 'Account content examples' } }],
  },
  {
    id: 'genshin-en-accounts',
    type: 'case',
    parent: 'account-growth',
    headline: { num: '136%', label: { en: 'of view KPI on established accounts' } },
    label: { en: 'Genshin Impact: EN Social Growth' },
    kicker: { en: 'TikTok, YouTube' },
    period: 'Q4 2023',
    markets: ['NA'],
    role: { en: 'Supported — growth strategy and content review' },
    summary: {
      en: 'Helped refresh content direction for plateauing EN creator-style accounts and set lanes for three new ones.',
    },
    results: [
      { en: '5 established accounts: +45K followers, 21M new views, 136% of view KPI' },
      { en: '3 new accounts: 19K followers, 14M views' },
    ],
  },
  {
    id: 'giveaway-campaign',
    type: 'case',
    parent: 'campaigns',
    headline: { num: '~900K', label: { en: 'in-game code redemptions, ~4x the goal' } },
    label: { en: 'Giveaway & Cross-Platform Influencer Campaign' },
    kicker: { en: 'Genshin Impact 5.0 · X, TikTok, Instagram' },
    markets: ['NA', 'JP'],
    role: { en: 'Led — campaign strategy' },
    summary: {
      en: 'Tested a third-party, reward-based giveaway with in-game codes as a measurable conversion layer.',
    },
    results: [
      { en: '33M+ impressions (56% above target); ~900K code redemptions (~4x goal)' },
      { en: 'Learning: quote participation underperformed — platform-native, simple actions matter' },
    ],
  },
  {
    id: 'interactive-filter',
    type: 'case',
    parent: 'campaigns',
    headline: { num: '600M+', label: { en: 'global views, 600K+ submissions' } },
    label: { en: 'Interactive Filter Campaign' },
    kicker: { en: 'Genshin Impact 4.4 · TikTok, Snapchat' },
    markets: ['JP', 'SEA', 'US'],
    role: { en: 'Supported — filter creative and creator activation' },
    summary: {
      en: 'Helped shape two gesture-based filters and brief 70+ creators for the first Snapchat Lens expansion.',
    },
    results: [
      { en: '600M+ global views, 600K+ submissions' },
      { en: '#1 in Snapchat’s commercial Lens ranking' },
    ],
    media: [{ alt: { en: 'Filter previews' } }],
  },
  {
    id: 'landing-page',
    type: 'case',
    parent: 'campaigns',
    headline: { num: '9.5M+', label: { en: 'UV and 1.8M+ lottery participants' } },
    label: { en: 'Landing Page Gamification' },
    kicker: { en: 'Genshin Impact 5.0 · Web' },
    markets: ['Global'],
    role: { en: 'Supported — creative development' },
    summary: {
      en: 'Helped design the first gamified launch page: a three-question quiz with shareable results and a reward loop.',
    },
    results: [
      { en: '9.5M+ UV, 1.8M+ lottery participants' },
      { en: 'Sharing drove 1.4M+ UV (4.1 visits per share)' },
    ],
    media: [{ alt: { en: 'Landing page screens' } }],
  },

  /* ---------------- AI ---------------- */
  {
    id: 'ai',
    type: 'branch',
    parent: 'root',
    label: { en: 'AI Projects', zh: 'AI 项目' },
    kicker: { en: 'Area of work', zh: '工作领域' },
    summary: { en: 'How I use AI to work faster and think better — tools I build and use myself. [Placeholder copy]' },
  },
  {
    id: 'ai-workbench',
    type: 'ai',
    parent: 'ai',
    headline: { num: 'Shipped', label: { en: 'built with AI-assisted coding, handed over to the UA content team' } },
    label: { en: 'AI Marketing Workbench' },
    kicker: { en: 'AI-assisted internal tool' },
    role: { en: 'Built with AI-assisted coding; primary user' },
    summary: {
      en: 'An internal workbench for creative analysis, script production and campaign reviews. I used it in my own UA workflow and handed it over to the UA content team.',
    },
    sections: [
      {
        title: { en: 'What it does', zh: '功能' },
        items: [
          { en: 'AI tagging of video creatives, with field rules and human review' },
          { en: 'Performance aggregation by version and creative scope for reviews' },
          { en: 'Knowledge retrieval that feeds strategy and script drafting' },
        ],
      },
    ],
    media: [{ alt: { en: 'Workbench demo (synthetic data)' } }],
    related: ['paid-social', 'ua-creative-strategy'],
  },
  { id: 'ai-slot-1', type: 'ai', parent: 'ai', status: 'prep', label: { en: 'AI project', zh: 'AI 项目' }, kicker: prep },
  { id: 'ai-slot-2', type: 'ai', parent: 'ai', status: 'prep', label: { en: 'AI project', zh: 'AI 项目' }, kicker: prep },

  /* ---------------- Creative Work ---------------- */
  {
    id: 'creative',
    type: 'branch',
    parent: 'root',
    label: { en: 'Creative Work', zh: '创意作品' },
    kicker: { en: 'Area of work', zh: '工作领域' },
    summary: { en: 'Things I make with my own hands and tools. [Placeholder copy]' },
  },
  { id: 'photography', type: 'creative', parent: 'creative', status: 'prep', label: { en: 'Photography', zh: '摄影' }, kicker: prep },
  { id: 'design', type: 'creative', parent: 'creative', status: 'prep', label: { en: 'Design', zh: '设计' }, kicker: prep },
  { id: 'video-editing', type: 'creative', parent: 'creative', status: 'prep', label: { en: 'Video & Editing', zh: '视频剪辑' }, kicker: prep },
  { id: 'ai-videos', type: 'creative', parent: 'creative', status: 'prep', label: { en: 'AI Creative Videos', zh: 'AI 创意视频' }, kicker: prep, related: ['ai'] },

  /* ---------------- Information ---------------- */
  {
    id: 'info',
    type: 'branch',
    parent: 'root',
    label: { en: 'Information', zh: '关于我' },
    kicker: { en: 'About & path', zh: '简介与经历' },
    summary: {
      en: "Hi, I'm Wenyi. I'm a growth marketer who thinks like a creative — I turn audience insight into stories that actually convert, across English, Japanese and Chinese markets. Lately, I've been building AI workflows to make that work faster and smarter. [Draft]",
    },
  },
  {
    id: 'experience',
    type: 'sub',
    parent: 'info',
    label: { en: 'Experience', zh: '工作经历' },
    kicker: { en: 'Path', zh: '路径' },
    summary: { en: 'From PR and social internships to global marketing at HoYoverse. [Placeholder copy]' },
  },
  {
    id: 'education',
    type: 'sub',
    parent: 'info',
    label: { en: 'Education', zh: '教育' },
    kicker: { en: 'Path', zh: '路径' },
  },

  // Roles — dates and titles from the LinkedIn snapshot (2026-09-11).
  { id: 'hoyoverse', type: 'role', parent: 'experience', label: { en: 'HoYoverse' }, kicker: { en: 'Global Marketing — Genshin Impact' }, period: 'Sep 2023 – Aug 2026', markets: ['NA', 'JP'], summary: { en: 'UGC strategy for paid campaigns, social growth for third-party accounts, and cross-platform campaigns.' }, related: ['growth', 'ai-workbench'] },
  { id: 'seminary-coop', type: 'role', parent: 'experience', label: { en: 'Seminary Co-op Bookstores' }, kicker: { en: 'Marketing & Events Intern' }, period: 'Jul – Sep 2023', markets: ['US'], summary: { en: 'Summer Gift Guide campaign across web, social and newsletters.' } },
  { id: 'nike', type: 'role', parent: 'experience', label: { en: 'Nike' }, kicker: { en: 'Social Media Marketing Intern' }, period: 'Dec 2021 – Aug 2022', markets: ['CN'], summary: { en: 'Xiaohongshu campaigns, hashtag and influencer strategy for Nike Women launches.' } },
  { id: 'weber-shandwick', type: 'role', parent: 'experience', label: { en: 'Weber Shandwick' }, kicker: { en: 'Public Relations Intern' }, period: 'Jun – Sep 2021', markets: ['CN'], summary: { en: 'Market research and social listening for client PR strategy.' } },
  { id: 'nowness', type: 'role', parent: 'experience', label: { en: 'NOWNESS' }, kicker: { en: 'Social Media Content Strategy Intern' }, period: 'Sep – Nov 2020', markets: ['CN'], summary: { en: 'WeChat and Weibo content and publishing for art and culture pieces.' } },

  { id: 'uchicago', type: 'school', parent: 'education', label: { en: 'University of Chicago' }, kicker: { en: 'MA, Humanities' }, period: '2022 – 2023' },
  { id: 'xjtlu', type: 'school', parent: 'education', label: { en: "Xi'an Jiaotong-Liverpool University" }, kicker: { en: 'BA, Communication and Media Studies' }, period: '2017 – 2021' },

];

/* Chronological order for the path line and the résumé (newest first). */
/**
 * The shape a node is drawn with. One rule everywhere (v36): a family keeps its shape
 * all the way down. Growth Marketing, its practices and its cases are all squares;
 * AI is all circles; Creative all diamonds; Experience triangles; Education hexagons.
 * A shape with a number is a group (the number = items inside); without, a single item.
 * Used by the map, the INDEX, the phone page and the legend, so they always match.
 */
export function kindOf(id: string): NodeType {
  const n = byId.get(id)!;
  const isGroup = (n.type === 'branch' && id !== 'info') || n.type === 'sub';
  if (!isGroup) return n.type;
  let leaf = n;
  while (childrenOf(leaf.id).length) leaf = childrenOf(leaf.id)[0];
  return leaf.type;
}

/* The INDEX card lists these sections, in this order, below the bio. */
export const indexSections = ['growth', 'ai', 'creative', 'experience', 'education'];

export const rolesOrder = ['hoyoverse', 'seminary-coop', 'nike', 'weber-shandwick', 'nowness'];
export const schoolsOrder = ['uchicago', 'xjtlu'];

export const byId = new Map(nodes.map((n) => [n.id, n]));

/* All Growth Marketing cases and the AI Workbench were done at HoYoverse. */
nodes.forEach((n) => {
  if ((n.type === 'case' || n.id === 'ai-workbench') && !n.org) n.org = 'hoyoverse';
});
/** Work done in a role, grouped by practice. */
export function workOf(roleId: string): SiteNode[] {
  return nodes.filter((n) => n.org === roleId);
}
export const childrenOf = (id: string) => nodes.filter((n) => n.parent === id);

export function ancestors(id: string): string[] {
  const out: string[] = [];
  let cur = byId.get(id)?.parent;
  while (cur) {
    out.push(cur);
    cur = byId.get(cur)?.parent;
  }
  return out;
}

/* UI strings */
export const ui = {
  resume: { en: 'Resume', zh: '履历' },
  contact: { en: "Let's talk", zh: '联系我' },
  role: { en: 'My role', zh: '我的角色' },
  results: { en: 'Results', zh: '结果' },
  connections: { en: 'Connections', zh: '关联' },
  close: { en: 'Close', zh: '关闭' },
  zhPending: { en: '', zh: '中文版准备中，以下为英文内容。' },
  prepBody: { en: 'This piece is being prepared and will be added soon.', zh: '这个作品正在准备中，稍后上线。' },
  visualsPrep: { en: 'Visuals in preparation', zh: '图片准备中' },
  downloadPdf: { en: 'Download PDF', zh: '下载 PDF' },
  pdfPending: { en: 'PDF coming soon', zh: 'PDF 即将提供' },
  emailPending: { en: 'Email — coming soon', zh: '邮箱即将提供' },
  copy: { en: 'Copy', zh: '复制' },
  copied: { en: 'Copied', zh: '已复制' },
  experience: { en: 'Experience', zh: '工作经历' },
  education: { en: 'Education', zh: '教育' },
  viewOnMap: { en: 'View on map', zh: '在地图中查看' },
  menu: { en: 'Menu', zh: '目录' },
  legendCase: { en: 'Growth case', zh: '增长案例' },
  legendAi: { en: 'AI project', zh: 'AI 项目' },
  legendCreative: { en: 'Creative work', zh: '创意作品' },
  legendPath: { en: 'Experience', zh: '经历' },
  more: { en: 'More', zh: '展开' },
  less: { en: 'Less', zh: '收起' },
  prototype: { en: 'Prototype · placeholder copy', zh: '原型 · 占位文案' },
  legendNumSample: { en: '2', zh: '2' }, // sample digit drawn in the legend's hexagon
  legendNum: { en: 'number = how many works inside', zh: '数字 = 里面有几个作品' },
  workHere: { en: 'Work from this role', zh: '这段经历中的作品' },
  viewWork: { en: 'View work', zh: '查看作品' },
  home: { en: 'home', zh: '首页' },
  mapLabel: { en: 'Portfolio map', zh: '作品地图' },
  langName: { en: '中文', zh: 'EN' }, // label of the switch = the language you switch TO
  langAria: { en: '切换到中文', zh: 'Switch to English' },
  email: { en: 'Email', zh: '邮箱' },
  linkedin: { en: 'LinkedIn', zh: 'LinkedIn' },
  index: { en: 'Index', zh: '索引' },
  moreAbout: { en: 'More about me', zh: '更多关于我' },
  backToIndex: { en: 'Back to the index', zh: '回到索引' },
} satisfies Record<string, T>;

/** The small type line on a card. Experience and Education read as their own kind, not "Practice". */
export function kindLabel(id: string): T {
  const n = byId.get(id)!;
  return typeLabel[id === 'experience' || id === 'education' ? kindOf(id) : n.type];
}

export const typeLabel: Record<NodeType, T> = {
  root: { en: 'Home', zh: '首页' },
  branch: { en: 'Area', zh: '领域' },
  sub: { en: 'Practice', zh: '方向' },
  case: { en: 'Case', zh: '案例' },
  ai: { en: 'AI project', zh: 'AI 项目' },
  creative: { en: 'Creative', zh: '创意' },
  role: { en: 'Experience', zh: '经历' },
  school: { en: 'Education', zh: '教育' },
  info: { en: 'Information', zh: '信息' },
};
