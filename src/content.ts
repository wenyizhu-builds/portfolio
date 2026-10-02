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
  platforms?: PlatformKey[]; // which platform filter(s) this work matches; regions come from `markets` (regionOfMarket)
  note?: T; // hand-written note beside the point on the map; a line break starts a new line. Placement: NOTES in map.ts
}

const prep: T = { en: 'Showcase in preparation', zh: '作品准备中' };

/* Filters (v60): two rows in the desktop header, a swipe row on the phone. Nothing selected = everything. */
export type PlatformKey = 'global' | 'cn' | 'paid';
export type RegionKey = 'na' | 'eu' | 'jp' | 'cn';
export const filterAll: T = { en: 'All', zh: '全部' }; // the phone's drop-downs start here
export const filterSets = {
  platform: {
    label: { en: 'Platform', zh: '平台' } as T,
    options: { global: { en: 'Global social', zh: '海外社媒' }, cn: { en: 'Chinese social', zh: '中国社媒' }, paid: { en: 'Paid ads', zh: '付费广告' } } as Record<PlatformKey, T>,
  },
  region: {
    label: { en: 'Region', zh: '地区' } as T,
    options: { na: { en: 'North America', zh: '北美' }, eu: { en: 'Europe', zh: '欧洲' }, jp: { en: 'Japan', zh: '日本' }, cn: { en: 'China', zh: '中国' } } as Record<RegionKey, T>,
  },
};
/** Which region filter a market code counts towards (codes not listed belong to none). */
export const regionOfMarket: Record<string, RegionKey> = { NA: 'na', US: 'na', EN: 'na', EU: 'eu', DE: 'eu', FR: 'eu', UK: 'eu', JP: 'jp', CN: 'cn' };

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
    platforms: ['paid'],
    note: { en: '~3.7× projected LTV\nvs benchmark', zh: '预估 LTV\n约为基准 3.7 倍' },
    team: { en: "UGC Creative Strategy (my role), UA Strategy x1, UA Execution x2, Agency Partners x4" },
    type: 'case',
    period: 'Jun 2025 – Jun 2026',
    parent: 'growth',
    featured: true,
    headline: { num: '~3.7×', label: { en: 'projected LTV vs UA-team creatives' } },
    label: { en: 'Creator Ad Pipeline' },
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
    platforms: ['paid'],
    team: { en: "Me (creative strategy), 1 media strategist, 2 creative producers and 1 agency partner" },
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
    platforms: ['global'],
    team: { en: "Me (influencer strategy and execution), 2 execution support specialists and 2 agency partners" },
    type: 'case',
    period: 'Jan 2026',
    parent: 'more-growth',
    headline: { num: '~3x', label: { en: 'engagement vs the last creator campaign' } },
    label: { en: 'X Creator Campaign' },
    kicker: { en: 'Genshin Impact · X' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'X' }, { en: 'Creator marketing' }],
    markets: ['EN', 'JP'],
    summary: {
      en: "I rebuilt the creator strategy for a flagship Genshin Impact character launch on X, focusing on the creators core players actually follow. The campaign delivered 13M+ views at 8%+ engagement, about 3x the previous creator campaign at 39% lower CPM.",
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Engagement on Genshin Impact’s recurring character campaigns on X was flattening, and it was weakest among English-speaking players. Our previous creator campaign aimed for broad appeal: many of its creators reached general gaming audiences rather than core Genshin players, so it brought reach but under 3% engagement. For a major character launch, I needed to refocus creators on core players and drive them to the official X event and its in-game reward codes." },
        ],
      },
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: "Rebuilt the creator strategy: Shifted spend from broad-appeal creators to the artists, cosplayers, streamers and Genshin news creators that core players follow, so 80% of the lineup reached core players. I also grew English-language creators to half the lineup and briefed a US agency on art styles North American players respond to." },
          { en: "Led execution and benchmarking: Managed budget, creator sourcing, timelines and approvals with two agencies, then benchmarked results against the previous creator campaign to decide what to scale next." },
        ],
      },
    ],
    results: [
      { metric: "13M+", en: "views across 56 creators and 78 posts" },
      { metric: "~3x", en: "engagement vs the last creator campaign" },
      { metric: "39%", en: "lower CPM than the last creator campaign" },
      { metric: "+88%", en: "EN impressions vs a comparable launch" },
    ],
    media: [{ src: 'media/influencer-activation/moonlit-support-banner.jpg',
      thumbnail: 'media/influencer-activation/moonlit-support-thumb.jpg', floating: true, alt: { en: 'Genshin Impact "Moon Maiden" Moonlit Support event banner, the official X event the creator campaign drove players to' } }],
  },
  {
    id: 'gip-testing',
    platforms: ['global'],
    note: { en: 'my framework\nfor testing\nnew channels', zh: '我的\n新渠道测试框架' },
    team: { en: "Me (testing strategy and project lead) and 1 data operations specialist, working with 2 platform liaisons from TikTok" },
    type: 'case',
    period: 'Dec 2024 – Nov 2025',
    parent: 'growth',
    featured: true,
    headline: { num: '80M+', label: { en: 'views across three test rounds' } },
    label: { en: 'TikTok UGC Incentive Program' },
    kicker: { en: 'Genshin Impact · TikTok' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'TikTok' }, { en: 'UGC' }],
    markets: ['US', 'JP', 'KR', 'TW'],
    summary: {
      en: "I designed and ran a three-round testing framework to see whether TikTok’s UGC incentive program could boost installs efficiently and supply videos that meet our standard for UA creative.",
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Genshin Impact’s UA relied mainly on brand creatives. TikTok’s UGC incentive program opened up a new possibility: could it boost installs efficiently as a UA channel, and could its videos work as UA creatives? I needed to design a testing framework to find out." },
        ],
      },
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: "Designed the test framework: Built a three-round roadmap, setting each round’s payout model (CPM or CPA), markets, themes, budgets and success metrics against our UA benchmarks." },
          { en: "Led campaign execution: Owned all three rounds end to end, from task setup and creator briefs to progress tracking, submission reviews and recaps." },
          { en: "Raised content quality: Rewrote task pages with clearer requirements and official reference videos, and flagged off-brief videos to free up the prize pool for better ones." },
          { en: "Evaluated performance and drove the decision: Measured reach, CPI, user quality and content relevance against our UA benchmarks, then recommended stopping the program and shifting budget to creator ads for UA." },
        ],
      },
    ],
    results: [
      { metric: "80M+", en: "views across three test rounds" },
      { metric: "500K+", en: "UGC submissions" },
      { metric: "~60%", en: "lower CPM in Round 3 than Round 1" },
      { metric: "", en: "Program stopped; budget shifted to creator ads for UA" },
    ],
    diagram: {
      src: 'media/gip-testing/gip-rounds-diagram.png',
      alt: { en: 'How I ran the tests: set goals, design the round, run it, evaluate the full funnel; findings shape the next round' },
    },
  },
  {
    id: 'zzz-jp-accounts',
    platforms: ['global'],
    note: { en: '0 → 80M+\norganic views', zh: '0 → 8000 万+\n自然播放' },
    team: { en: "Me (social strategy), 2 Japanese-language content reviewers and 3 agency partners" },
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
    platforms: ['global'],
    team: { en: "Me (growth strategy support and content review), 1 growth strategy lead and 1 agency partner" },
    type: 'case',
    parent: 'more-growth',
    headline: { num: '35M+', label: { en: 'views across 8 channels' } },
    label: { en: 'EN Social Channel Growth' },
    kicker: { en: 'Genshin Impact · TikTok, YouTube' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'TikTok' }, { en: 'YouTube' }],
    period: 'Q4 2023',
    markets: ['EN'],
    summary: {
      en: "I helped grow a network of 8 English-language Genshin Impact channels on TikTok and YouTube, refreshing the strategy for channels that had plateaued and building it from scratch for new ones. Together they drew 35M+ views and 64K+ new followers at about 30% below target CPM.",
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Genshin Impact ran a network of English-language social channels on TikTok and YouTube to keep players engaged between major updates. The established channels had stalled: formats were getting repetitive, fewer viewers were following, and views dropped between updates. At the same time, new channels needed a social strategy built from scratch, all while keeping CPM under target." },
        ],
      },
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: "Diagnosed what stalled growth: Used Tubular and monthly reports to compare TikTok trends, competitor channels and each channel’s performance, and pinpointed the gaps: too few evergreen topics, stale formats and weak follower conversion." },
          { en: "Refreshed the content mix: Turned the findings into changes for each channel. Guide channels that leaned on time-sensitive patch tutorials added short, entertaining gameplay tips and varied their covers, so views no longer depended on update days." },
          { en: "Built strategy for the new channels: Defined each channel’s audience, positioning, content pillars, formats and posting cadence from platform research and competitor benchmarks, then refined them on early performance data before scaling production." },
          { en: "Ran monthly reviews: Tracked KPIs, reviewed English content and kept the agency’s output aligned with each channel’s growth goals." },
        ],
      },
    ],
    results: [
      { metric: "35M+", en: "views across 8 channels" },
      { metric: "+64K", en: "new followers" },
      { metric: "~30%", en: "below target CPM" },
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
    platforms: ['global'],
    team: { en: "Me (campaign lead and strategy), 2 execution support specialists and 4 agency partners" },
    type: 'case',
    period: 'Aug 2024',
    parent: 'more-growth',
    headline: { num: '~900K', label: { en: 'code redemptions, about 4x the goal' } },
    label: { en: 'Cross-Platform Community Giveaway' },
    kicker: { en: 'Genshin Impact · X, TikTok, Instagram' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'X' }, { en: 'TikTok' }, { en: 'Instagram' }, { en: 'Creator marketing' }],
    markets: ['NA', 'JP'],
    summary: {
      en: "For a major Genshin Impact update, I led a giveaway with the biggest Genshin fan account on X, backed by 67 creators across X, TikTok and Instagram, to reach players beyond official channels. It drew 33M+ impressions and about 900K in-game code redemptions, roughly 4x the goal.",
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Genshin Impact’s community events on official channels kept reaching the same core players. For a major update, I wanted to test whether a giveaway hosted by a big fan account could reach casual and lapsed players and get them to act." },
        ],
      },
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: "Designed the campaign: Partnered with the biggest Genshin fan account on X (1M+ followers). To enter, players quote-posted the giveaway with their own creative take, and in-game reward codes turned views into a measurable action." },
          { en: "Activated creators across platforms: Coordinated 67 creators across X, TikTok and Instagram, who posted their own entries first to show players how to join." },
          { en: "Led execution and the recap: Aligned four agencies on briefs, content review, timelines and tracking. Code redemptions beat the goal, but fewer players entered the giveaway itself because quote-posting a creative entry took too much effort on X. The lesson: giveaways run with fan accounts need one-tap actions, like a repost or a reply." },
        ],
      },
    ],
    results: [
      { metric: "33M+", en: "impressions, 56% above target" },
      { metric: "~900K", en: "code redemptions, about 4x the goal" },
      { metric: "~50%", en: "lower CPM than target" },
      { metric: "99%", en: "positive sentiment" },
    ],
  },
  {
    id: 'interactive-filter',
    platforms: ['global'],
    note: { en: '600M+ views', zh: '6 亿+ 播放' },
    team: { en: "Filter Creative Development & Influencer Activation Support (my role), Campaign Lead x1, TikTok/Snapchat Platform Liaisons x2, Agency Partners x3" },
    type: 'case',
    parent: 'more-growth',
    headline: { num: '600M+', label: { en: 'global views, 600K+ submissions' } },
    label: { en: 'Interactive Filter Campaign' },
    kicker: { en: 'Genshin Impact · TikTok, Snapchat' },
    context: { en: 'Genshin Impact' },
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
    platforms: ['global'],
    team: { en: "Creative Development Support (role), Landing Page Strategy Lead x1, Web Production x2" },
    type: 'case',
    parent: 'more-growth',
    headline: { num: '9.5M+', label: { en: 'UV and 1.8M+ lottery participants' } },
    label: { en: 'Landing Page Gamification' },
    kicker: { en: 'Genshin Impact · Web' },
    context: { en: 'Genshin Impact' },
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
      { metric: '1.4M+', en: 'unique visitors from shares' },
    ],
    media: [{ alt: { en: 'Landing page screens' } }],
  },

  /* ---------------- AI ---------------- */
  {
    id: 'ai',
    note: { en: 'tools I built\nwith AI', zh: '我用 AI\n搭建的工具' },
    type: 'branch',
    parent: 'root',
    label: { en: 'AI Projects', zh: 'AI 项目' },
    kicker: { en: 'Area of work', zh: '工作领域' },
    summary: { en: 'How I use AI to work faster and think better — tools I build and use myself. [Placeholder copy]' },
  },
  {
    id: 'ai-workbench',
    platforms: ['paid'],
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
  { id: 'hoyoverse', type: 'role', platforms: ['global', 'paid'], parent: 'experience', label: { en: 'HoYoverse' }, role: { en: 'Global Marketing' }, kicker: { en: 'Global Marketing' }, period: 'Sep 2023 – Aug 2026', markets: ['NA', 'JP'], summary: { en: 'UGC strategy for paid campaigns, social growth for third-party accounts, and cross-platform campaigns.' }, related: ['growth', 'ai-workbench'] },
  { id: 'seminary-coop', type: 'role', platforms: ['global'], parent: 'experience', label: { en: 'Seminary Co-op Bookstores' }, kicker: { en: 'Marketing & Events Intern' }, period: 'Jul – Sep 2023', markets: ['US'], summary: { en: 'Summer Gift Guide campaign across web, social and newsletters.' } },
  { id: 'nike', type: 'role', platforms: ['cn'], parent: 'experience', label: { en: 'Nike' }, kicker: { en: 'Social Media Marketing Intern' }, period: 'Dec 2021 – Aug 2022', markets: ['CN'], summary: { en: 'Xiaohongshu campaigns, hashtag and influencer strategy for Nike Women launches.' } },
  { id: 'weber-shandwick', type: 'role', platforms: ['cn'], parent: 'experience', label: { en: 'Weber Shandwick' }, kicker: { en: 'Public Relations Intern' }, period: 'Jun – Sep 2021', markets: ['CN'], summary: { en: 'Market research and social listening for client PR strategy.' } },
  { id: 'nowness', type: 'role', platforms: ['cn'], parent: 'experience', label: { en: 'NOWNESS' }, kicker: { en: 'Social Media Content Strategy Intern' }, period: 'Sep – Nov 2020', markets: ['CN'], summary: { en: 'WeChat and Weibo content and publishing for art and culture pieces.' } },

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
