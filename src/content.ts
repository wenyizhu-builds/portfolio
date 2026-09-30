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
  floating?: boolean;
  thumbnail?: string;
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
  tags?: T[];
  context?: T;
  role?: T;
  summary?: T;
  team?: T;
  sections?: Section[];
  results?: (T & { metric?: string; highlight?: string })[];
  media?: Media[];
  status?: Status;
  featured?: boolean;
  diagram?: { src: string; alt: T }; // shown in the card as "How it worked"; click to enlarge
  related?: string[]; // dotted connections
  headline?: { num: string; label: T; highlight?: string }; // the one result a recruiter should see first
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
  introHighlight: { en: 'converts', zh: '转化' } as T,
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
    id: 'more-growth',
    type: 'sub',
    parent: 'growth',
    label: { en: 'More cases', zh: '更多案例' },
    kicker: { en: 'Practice', zh: '方向' },
    summary: { en: 'Launches, creator campaigns and account growth work. [Placeholder copy]' },
  },

  {
    id: 'ua-creative-strategy',
    team: { en: "UGC Creative Strategy (my role), UA Strategy x1, UA Execution x2, Agency Partners x4" },
    type: 'case',
    period: 'Jun 2025 – Jun 2026',
    parent: 'growth',
    featured: true,
    headline: { num: '~3.7×', label: { en: 'projected LTV vs UA-team creatives' } },
    label: { en: 'UA Creative Strategy' },
    kicker: { en: 'Genshin Impact · Google Ads' },
    markets: ['JP', 'NA', 'EU'],
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'Google Ads' }],
    summary: {
      en: 'Built a Brand-to-UA testing pipeline that turned creator videos into measurable user-acquisition performance for Genshin Impact.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "UA needed more high-performing UGC creatives for new-user acquisition. Previous tests showed creator-style ads could be a competitive acquisition format, but Brand and UA did not yet have a mature workflow to turn Brand's creator resources and production budget into measurable UA impact." },
          { en: "The challenge was to build that pipeline from scratch: align both teams on performance metrics, learn what high-converting UGC looked like across target markets, and prove that Brand-side creative could drive not just more volume, but stronger acquisition efficiency and user quality." },
        ],
      },
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
      { metric: '99', en: 'creator videos delivered across UA tests' },
      { metric: '1% → 15%', highlight: '15%', en: 'Brand creative share of UA spend' },
      { metric: '+13%', en: '365-day ROI vs non-Brand creatives' },
      { metric: '~3.3x', en: 'LTV vs non-Brand creatives' },
    ],
    diagram: {
      src: 'media/ua-creative-strategy/ua-system-diagram.png',
      alt: { en: 'How the pipeline worked: one creative testing loop per game version, supported by the AI Marketing Dashboard' },
    },
    related: ['ai-workbench'],
  },
  {
    id: 'xbox-launch',
    team: { en: "Creative Strategy (my role), Media Strategy x1, Creative Producers x2, Agency Partner x1" },
    type: 'case',
    period: 'Nov 2024', // Confirmed launch month; full production start/end not established.
    parent: 'more-growth',
    headline: { num: '+338%', label: { en: 'CTR vs the earlier benchmark' } },
    label: { en: 'Xbox Launch Paid Campaign' },
    kicker: { en: 'Genshin Impact · Meta, YouTube, TikTok, X' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'Meta' }, { en: 'YouTube' }, { en: 'TikTok' }, { en: 'X' }],
    markets: ['US', 'DE', 'FR'],
    summary: {
      en: 'Structured a localized creative test around four value propositions to move console players from interest to landing-page action.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "For the Xbox launch, paid media needed to drive landing-page traffic, not just awareness. The goal was to improve CTR and identify which creative messages could move console players from interest to action across YouTube, X, Meta, and TikTok." },
          { en: "The challenge was execution-heavy: our team had to turn existing brand materials into a large localized creative test while keeping platform specs, language needs, and approval requirements aligned." },
        ],
      },
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
      { metric: '+338%', en: 'CTR versus the earlier benchmark.' },
      { metric: '66%', en: 'lower CPC versus the earlier benchmark.' },
      { metric: '120M+', en: 'impressions across the campaign.' },
      { metric: '~700K', en: 'landing-page clicks across the campaign.' },
    ],
    media: [{ src: 'media/xbox-launch/genshin-xbox-banner-en-qr-blurred.jpg',
      thumbnail: 'media/xbox-launch/genshin-xbox-thumb.jpg', floating: true, alt: { en: 'Genshin Impact Xbox launch promotional visual — QR code blurred' } }],
  },
  {
    id: 'influencer-activation',
    team: { en: "Influencer Strategy & Execution (my role), Execution Support x2, Agency Partners x2" },
    type: 'case',
    parent: 'more-growth',
    headline: { num: '~3x', label: { en: 'engagement vs the prior paid benchmark, at ~40% lower cost' } },
    label: { en: 'Influencer Activation Campaign' },
    kicker: { en: 'Genshin Impact · X' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'X' }],
    markets: ['EN', 'JP', 'KR'],
    summary: {
      en: 'Redesigned creator targeting for a flagship character campaign, shifting from broad amplification to creator-native content for core players.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "As Genshin became a more mature live-service title, recurring character campaigns on X were becoming harder to energize, especially in EN." },
          { en: "An earlier activation showed that paid creator campaigns could help revive momentum, but its creator and content mix was too broad to consistently re-engage core players. Ahead of a major character launch, the challenge was to refresh the strategy: redesign creator targeting and content direction so the campaign felt native to X, useful to players, and connected to the hashtag activity and in-game reward-code flow." },
        ],
      },
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
      { metric: '56', en: 'creators, 78 UGC pieces, 13M+ creator-led exposure, 8%+ engagement' },
      { metric: '~3x', en: 'benchmark engagement at ~40% lower exposure cost' },
    ],
    media: [{ alt: { en: 'Creator content examples' } }],
  },
  {
    id: 'gip-testing',
    team: { en: "Me (testing strategy and project lead), 2 TikTok platform liaisons and 1 data operations specialist" },
    type: 'case',
    parent: 'growth',
    featured: true,
    headline: { num: '80M+', label: { en: 'views in three test rounds — then a data-led stop decision' } },
    label: { en: 'Organic UA Testing: TikTok GIP' },
    kicker: { en: 'Genshin Impact · TikTok' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'TikTok' }],
    markets: ['US', 'JP'],
    summary: {
      en: 'Three structured test rounds to decide whether TikTok’s Gaming Incentive Program could scale as an acquisition channel.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Genshin Impact had historically relied heavily on brand-style creatives and official assets. We wanted to test whether a more UGC-driven TikTok product could reach incremental audiences and create content that converted beyond existing UA approaches." },
          { en: "GIP showed strong organic UA potential, but its ability to consistently generate relevant creator submissions and efficient acquisition was unproven. The challenge was to test whether GIP's large creator pool could deliver content that converts, not just views and submission volume." },
        ],
      },
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
      { metric: '80M+', en: 'views across three testing rounds' },
      { metric: '500K+', en: 'creator submissions across the program' },
      { metric: '66%', en: 'lower CPM versus the earlier benchmark' },
      { metric: '', en: 'Decided to stop the initiative' },
    ],
  },
  {
    id: 'zzz-jp-accounts',
    team: { en: "Me (social strategy), 2 Japanese content reviewers and 3 agency partners" },
    type: 'case',
    parent: 'growth',
    featured: true,
    headline: { num: '80M+', label: { en: 'organic views across 9 channels' } },
    label: { en: 'Zenless Zone Zero: JP Account Growth' },
    kicker: { en: 'YouTube, X' },
    context: { en: 'Zenless Zone Zero' },
    tags: [{ en: 'YouTube' }, { en: 'X' }],
    period: '2024 Q3 – 2025 Q2',
    markets: ['JP'],
    summary: {
      en: 'Took over an early-stage Japanese creator-account matrix and scaled it into a repeatable growth system before handover.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Zenless Zone Zero was still in an early JP growth stage, and official brand channels alone were not enough to drive always-on discovery. The goal of the creator-account matrix was to build non-official discovery channels that felt native to YouTube and X, helped players understand the game, and kept player discussion active beyond campaign moments." },
          { en: "The team had limited precedent for operating brand-managed, third-party-style creator accounts as growth channels in JP. When I took over the early-stage matrix, the challenge was to identify which account positions and content formats could grow, then turn scattered experiments into a repeatable growth system before handover." },
        ],
      },
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
      { metric: '80M+', en: 'organic views' },
      { metric: '50K+', en: 'followers' },
      { metric: '50%', en: 'lower CPM' },
    ],
    media: [{
      src: 'media/zzz-jp-accounts/gentle-house.jpg',
      thumbnail: 'media/zzz-jp-accounts/gentle-house-thumb.jpg',
      floating: true,
      alt: { en: 'Zenless Zone Zero — Gentle House character artwork' },
    }],
    diagram: {
      src: 'media/zzz-jp-accounts/zzz-system-diagram.png',
      alt: { en: 'How the channels launched and grew: map the market, position channels, brief and produce, review, adapt winners, hand over' },
    },
  },
  {
    id: 'genshin-en-accounts',
    team: { en: "Growth Strategy Support & Content Review (my role), Growth Strategy Lead x1, Agency Partner x1" },
    type: 'case',
    parent: 'more-growth',
    headline: { num: '136%', label: { en: 'of view KPI on established accounts' } },
    label: { en: 'Genshin Impact: EN Social Growth' },
    kicker: { en: 'TikTok, YouTube' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'TikTok' }, { en: 'YouTube' }],
    period: 'Q4 2023',
    markets: ['NA'],
    summary: {
      en: 'Helped refresh content direction for plateauing EN creator-style accounts and set lanes for three new ones.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Genshin Impact used creator-style matrix accounts to keep players engaged outside official brand channels. These accounts distributed useful game content, maintained platform buzz between major campaigns, and created low-cost social reach for active players." },
          { en: "The 5 established EN accounts I supported had already built audiences, but growth was slowing: formats were becoming repetitive, follower interest was weakening, and traffic rose around major game updates but softened in quieter periods. The goal was to refresh established account direction while helping 3 new accounts find clearer verticals and content directions, all while keeping CPM efficient." },
        ],
      },
    ],
    results: [
      { metric: '5', en: 'established accounts: +45K followers, 21M new views, 136% of view KPI' },
      { metric: '3', en: 'new accounts: 19K followers, 14M views' },
    ],
    media: [{
      src: 'media/genshin-en-accounts/genshin-social-growth.jpg',
      thumbnail: 'media/genshin-en-accounts/genshin-social-growth-thumb.jpg',
      floating: true,
      alt: { en: 'Genshin Impact artwork featuring Aether and Lumine' },
    }],
  },
  {
    id: 'giveaway-campaign',
    team: { en: "Campaign Lead & Strategy Owner (my role), Execution Support x2, Agency Partners x4" },
    type: 'case',
    parent: 'more-growth',
    headline: { num: '~900K', label: { en: 'in-game code redemptions, ~4x the goal' } },
    label: { en: 'Giveaway & Cross-Platform Influencer Campaign' },
    kicker: { en: 'Genshin Impact 5.0 · X, TikTok, Instagram' },
    context: { en: 'Genshin Impact 5.0' },
    tags: [{ en: 'X' }, { en: 'TikTok' }, { en: 'Instagram' }],
    markets: ['NA', 'JP'],
    summary: {
      en: 'Tested a third-party, reward-based giveaway with in-game codes as a measurable conversion layer.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Regular community activations on official channels were repeatedly reaching the same core audience. For a major version launch, the team needed to explore new activation formats that could expand topic exposure, reach semi-active and lapsed players, and create measurable engagement beyond standard official-account posting." },
          { en: "We wanted to test whether a more entertainment-oriented, lower-funnel social format could activate player participation and distribute in-game redemption codes through third-party communities. Even if the format did not fully work, the test would clarify what kind of incentive and participation mechanic could move players outside the official-channel loop." },
        ],
      },
    ],
    results: [
      { metric: '33M+', en: 'impressions (56% above target); ~900K code redemptions (~4x goal)' },
      { en: 'Learning: quote participation underperformed — platform-native, simple actions matter' },
    ],
  },
  {
    id: 'interactive-filter',
    team: { en: "Filter Creative Development & Influencer Activation Support (my role), Campaign Lead x1, TikTok/Snapchat Platform Liaisons x2, Agency Partners x3" },
    type: 'case',
    parent: 'more-growth',
    headline: { num: '600M+', label: { en: 'global views, 600K+ submissions' } },
    label: { en: 'Interactive Filter Campaign' },
    kicker: { en: 'Genshin Impact 4.4 · TikTok, Snapchat' },
    context: { en: 'Genshin Impact 4.4' },
    tags: [{ en: 'TikTok' }, { en: 'Snapchat' }],
    markets: ['JP', 'SEA', 'US'],
    summary: {
      en: 'Helped shape two gesture-based filters and brief 70+ creators for the first Snapchat Lens expansion.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "To promote Lantern Rite and drive version buzz, Genshin needed interactive filters that could feel festive, engaging, and easy for users to recreate across TikTok and Snapchat. Because this was also the first Snapchat Lens expansion, the creative had to work across different platform behaviors while still feeling native to the event." },
          { en: "My support challenge was to help turn the theme into two playable filter ideas, coordinate with platform liaisons and designers to bring them to life, and support creator activation within a tight seed-content window so users could quickly understand how to join the trend." },
        ],
      },
    ],
    results: [
      { metric: '600M+', en: 'global views, 600K+ submissions' },
      { metric: '#1', en: 'in Snapchat’s commercial Lens ranking' },
    ],
    media: [{ alt: { en: 'Filter previews' } }],
  },
  {
    id: 'landing-page',
    team: { en: "Creative Development Support (role), Landing Page Strategy Lead x1, Web Production x2" },
    type: 'case',
    parent: 'more-growth',
    headline: { num: '9.5M+', label: { en: 'UV and 1.8M+ lottery participants' } },
    label: { en: 'Landing Page Gamification' },
    kicker: { en: 'Genshin Impact 5.0 · Web' },
    context: { en: 'Genshin Impact 5.0' },
    tags: [{ en: 'Web' }],
    markets: ['Global'],
    summary: {
      en: 'Helped design the first gamified launch page: a three-question quiz with shareable results and a reward loop.',
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "The launch landing page was expected to receive 1B+ impressions, but previous version pages were mostly informational. The traffic opportunity could have stopped at passive awareness instead of driving engagement or downloads." },
          { en: "As the team's first interactive landing page attempt, the challenge was to create a mechanic that felt native to Genshin Impact while supporting rewards, sharing, and the download CTA." },
        ],
      },
    ],
    results: [
      { metric: '9.5M+', en: 'UV, 1.8M+ lottery participants' },
      { metric: '1.4M+', en: 'UV driven by sharing (4.1 visits per share)' },
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
    team: { en: 'AI-assisted tool development (my role); handover to the UA content team.' },
    type: 'ai',
    parent: 'ai',
    headline: { num: 'Shipped', label: { en: 'built with AI-assisted coding, handed over to the UA content team' } },
    label: { en: 'AI Creative Intelligence Dashboard' },
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
    related: ['ua-creative-strategy'],
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
  { id: 'hoyoverse', type: 'role', parent: 'experience', label: { en: 'HoYoverse' }, role: { en: 'Global Marketing' }, kicker: { en: 'Global Marketing' }, period: 'Sep 2023 – Aug 2026', markets: ['NA', 'JP'], summary: { en: 'UGC strategy for paid campaigns, social growth for third-party accounts, and cross-platform campaigns.' }, related: ['growth', 'ai-workbench'] },
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

/* The three flagship Growth Marketing cases, in reading order (01, 02, 03). */
export const featuredOrder = ['ua-creative-strategy', 'zzz-jp-accounts', 'gip-testing'];

export const rolesOrder = ['hoyoverse', 'seminary-coop', 'nike', 'weber-shandwick', 'nowness'];
export const schoolsOrder = ['uchicago', 'xjtlu'];

export const byId = new Map(nodes.map((n) => [n.id, n]));

/* All Growth Marketing cases and the AI Workbench were done at HoYoverse. */
nodes.forEach((n) => {
  if (['case', 'ai', 'creative'].includes(n.type)) n.team ??= { en: '' };
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
