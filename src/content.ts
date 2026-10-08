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

import { galleryImages } from './gallery-images.ts';

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
  open?: boolean; // shown unfolded when the card opens (sections are folded by default)
}

export interface Media {
  floating?: boolean;
  thumbnail?: string;
  src?: string; // leave empty for a placeholder tile
  alt: T;
  caption?: T;
}

/** One picture in a gallery: the grid shows `thumb`, the lightbox `src`. */
export interface Photo { src: string; thumb: string; w: number; h: number; tag: string; large?: string; lw?: number } // large: the 2400px copy, lw its width
/** A set inside a gallery (a photo series, a magazine issue). `unit` names what the count counts. */
export interface GallerySet { id: string; title: T; meta?: T; unit: 'photos' | 'pages' | 'posters' | 'screens'; items: Photo[] }

export interface SiteNode {
  id: string;
  type: NodeType;
  parent?: string;
  label: T;
  kicker?: T; // small uppercase line under the title
  period?: string;
  markets?: string[];
  platforms?: PlatformKey[]; // v71: for the Platform filter (structured, not read from the tag text, L8)
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
  related?: string[]; // dotted connections, drawn when one end is selected
  alwaysLinked?: string[]; // also shown (faded, with its dotted line) whenever this point's group is open (owner, v64.14)
  headline?: { num: string; label: T; note?: T; highlight?: string }; // the one result a recruiter should see first
  org?: string; // the role (experience node) this work was done in
  links?: { label: T; href: string }[]; // public pages a reader can open (event page, an example post)
  gallery?: GallerySet[]; // photos / pages shown as a grid: beside the card on desktop, inside it on the phone (v63)
  prototype?: { src: string; poster: string; video: string[] }; // desktop: the promo video (sources in order of preference, with its poster frame) in the map's place, and an app icon that opens the clickable prototype `src` in a pop-up (v64.4); the phone shows `gallery` instead
  mapLabel?: T; // shorter name on the metro map (v70), e.g. XJTLU
  mapTag?: T; // v70.2: the result tag under a key station on the metro map (replaces the hand-written note there), in the line's colour
  note?: T; // hand-written note beside the point on the map; a line break starts a new line. Placement: NOTES in map.ts
}


/** A gallery set from the image list in gallery-images.ts (`key` = its folder under public/media). */
function set(id: string, key: string, unit: GallerySet['unit'], title: T, meta?: T): GallerySet {
  const rows = galleryImages[key] || [];
  // prototype screens have no separate small copy (v69): the 1600px screenshot is already light, and the preview's file limit is tight
  return { id, title, meta, unit, items: rows.map(([f, w, h, tag, lw]) => ({ src: `media/${key}/${f}.jpg`, thumb: unit === 'screens' ? `media/${key}/${f}.jpg` : `media/${key}/${f}-t.jpg`, w, h, tag, ...(lw ? { large: `media/${key}/${f}-l.jpg`, lw } : {}) })) };
}

/* Curate your ride (v71, replaces the Region filter): ready-made rides, target market and platform.
   Desktop: a panel under the ✳ button; phone: three drop-downs. Nothing selected = everything. */
export type RegionKey = 'na' | 'eu' | 'jp' | 'cn';
export type PlatformKey = 'tiktok' | 'youtube' | 'x' | 'instagram' | 'snapchat' | 'meta' | 'google' | 'xhs';
export type RideKey = 'must' | 'creator' | 'ai' | 'journey';
/** Ready-made rides: the stations a ride stops at. The order on the map comes from the track (metro.ts), not from this list. */
export const rides: Record<RideKey, { label: T; stops: string[] }> = {
  must: { label: { en: 'Must-stops' }, stops: ['gip-testing', 'ua-creative-strategy', 'zzz-jp-accounts', 'interactive-filter', 'ai-workbench'] },
  creator: { label: { en: 'Creator marketing' }, stops: ['gip-testing', 'ua-creative-strategy', 'giveaway-campaign', 'influencer-activation', 'interactive-filter'] },
  ai: { label: { en: 'Built with AI' }, stops: ['xhs-ai-channel', 'creator-workbench', 'ai-workbench'] },
  // one way along the track, so no Paid & UA cases (the train can't turn back at HoYoverse)
  journey: { label: { en: 'The whole journey' }, stops: ['xjtlu', 'nowness', 'weber-shandwick', 'nike', 'seminary-coop', 'hoyoverse', 'zzz-jp-accounts', 'interactive-filter', 'xhs-ai-channel', 'creator-workbench', 'ai-workbench'] },
};
export const filterAll: T = { en: 'All', zh: '全部' }; // the phone's drop-downs start here
export const filterSets = {
  ride: {
    label: { en: 'Rides' } as T,
    options: Object.fromEntries(Object.entries(rides).map(([k, r]) => [k, r.label])) as Record<RideKey, T>,
  },
  region: {
    label: { en: 'Target market', zh: '目标市场' } as T,
    options: { na: { en: 'North America', zh: '北美' }, eu: { en: 'Europe', zh: '欧洲' }, jp: { en: 'Japan', zh: '日本' }, cn: { en: 'China', zh: '中国' } } as Record<RegionKey, T>,
  },
  platform: {
    label: { en: 'Platform' } as T,
    options: { tiktok: { en: 'TikTok' }, youtube: { en: 'YouTube' }, x: { en: 'X' }, instagram: { en: 'Instagram' }, snapchat: { en: 'Snapchat' }, meta: { en: 'Meta' }, google: { en: 'Google Ads' }, xhs: { en: 'Xiaohongshu' } } as Record<PlatformKey, T>,
  },
};
/** Which region filter a market code counts towards (codes not listed belong to none). */
export const regionOfMarket: Record<string, RegionKey> = { NA: 'na', US: 'na', EU: 'eu', DE: 'eu', FR: 'eu', UK: 'eu', JP: 'jp', CN: 'cn' };

export const site = {
  name: 'Wenyi Zhu',
  tag: { en: 'Growth Marketer · Creative Strategist', zh: '增长营销 · 创意策略' } as T,
  // One-line intro at the top of the sticky note (and the phone hero). [Draft]
  intro: {
    en: "I'm a growth marketer on the creative side: I find out which ads and content actually drive installs and engagement, then scale them. I spent three years at HoYoverse, the studio behind Genshin Impact, running campaigns across North America, Europe and Japan. Lately I've been building my own AI tools to do it faster.", // [Draft] final bio written last (owner)
    zh: '',
  } as T,
  introHighlight: { en: 'drive installs and engagement' } as T,
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
};

export const nodes: SiteNode[] = [
  { id: 'root', type: 'root', label: { en: 'Wenyi Zhu', zh: 'Wenyi Zhu' } },

  /* ---------------- Work: two groups, straight off the ✳ (v62.31) ---------------- */
  {
    id: 'growth-paid',
    type: 'branch',
    parent: 'root',
    label: { en: 'Paid & UA Growth', zh: '付费与 UA 增长' },
    kicker: { en: 'Area of work', zh: '工作领域' },
    summary: { en: 'Data-backed creative testing for user acquisition: finding what drives installs, scaling what works and improving ROI.' },
  },
  {
    id: 'ua-creative-strategy',
    mapTag: { en: '3.7× LTV' },
    
    note: { en: '~3.7× projected LTV\nvs benchmark', zh: '预估 LTV\n约为基准 3.7 倍' },
    team: { en: "UGC Creative Strategy (my role), UA Strategy x1, UA Execution x2, Agency Partners x4" },
    type: 'case',
    period: 'Jun 2025 – Jun 2026',
    parent: 'growth-paid',
    featured: true,
    headline: { num: '~3.7×', label: { en: 'projected LTV vs UA-team creatives' } },
    label: { en: 'Creator Ad Pipeline' },
    kicker: { en: 'Genshin Impact · Google Ads' },
    markets: ['JP', 'NA', 'EU'],
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'Google Ads' }],
    platforms: ['google'],
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
    id: 'gip-testing',
    mapLabel: { en: 'UGC Channel Test' }, // v71.2: short name on the metro map (words from the title, in order); the card shows the full title
    
    note: { en: 'my framework\nfor testing\nnew channels', zh: '我的\n新渠道测试框架' },
    team: { en: "Me (testing strategy and project lead) and 1 data operations specialist, working with 2 platform liaisons from TikTok" },
    type: 'case',
    period: 'Dec 2024 – Nov 2025',
    parent: 'growth-paid',
    featured: true,
    headline: { num: '80M+', label: { en: 'views across three test rounds' } },
    label: { en: 'TikTok UGC Incentive Program' },
    kicker: { en: 'Genshin Impact · TikTok' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'TikTok' }, { en: 'UGC' }],
    platforms: ['tiktok'],
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
    id: 'xbox-launch',
    mapLabel: { en: 'Xbox Launch' }, // v71.2: short name on the metro map (words from the title, in order); the card shows the full title
    
    team: { en: "Me (creative strategy), 1 media strategist, 2 creative producers and 1 agency partner" },
    type: 'case',
    period: 'Nov 2024', // Confirmed launch month; full production start/end not established.
    parent: 'growth-paid',
    headline: { num: '+338%', label: { en: 'CTR vs the earlier benchmark' } },
    label: { en: 'Xbox Launch Paid Campaign' },
    kicker: { en: 'Genshin Impact · Meta, YouTube, TikTok, X' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'Meta' }, { en: 'YouTube' }, { en: 'TikTok' }, { en: 'X' }],
    platforms: ['meta', 'youtube', 'tiktok', 'x'],
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
    id: 'landing-page',
    
    team: { en: "Me (creative development support), 1 landing page strategy lead and 2 web developers" },
    type: 'case',
    period: 'Aug – Sep 2024',
    parent: 'growth-paid',
    headline: { num: '9.5M+', label: { en: 'visitors, ~7x benchmark' } },
    label: { en: 'Gamified Landing Page' },
    kicker: { en: 'Genshin Impact · Web' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'Web' }, { en: 'Landing page' }, { en: 'Gamification' }],
    markets: ['NA', 'EU', 'JP'], // global launch page in every language (owner)
    summary: {
      en: "For a major Genshin Impact update, I helped turn the launch landing page from an information page into a game: a short personality quiz with shareable results and a reward draw. It drew 9.5M+ unique visitors and 1.8M+ players into the draw, and converted 3x better than benchmark.",
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Our previous launch landing pages were mostly informational. This time, the team wanted to experiment: add a game and a reward system to make the page interactive, and see whether that would boost conversion. The challenge was designing our first gamified landing page." },
        ],
      },
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: "Benchmarked formats: Studied interactive web campaigns to find a mechanic with shareability built in." },
          { en: "Designed the hook: Chose a personality quiz, a proven viral format, so every player got a personalized result worth sharing, and kept it to three questions to cut drop-off." },
          { en: "Built the viral loop: Tied rewards to referrals. Finishing the quiz unlocked a reward draw and each friend invited earned another, so every share brought in about 4 new visitors." },
        ],
      },
    ],
    results: [
      { metric: "9.5M+", en: "visitors, ~7x benchmark" },
      { metric: "1.8M+", en: "players in the draw, +60% vs benchmark" },
      { metric: "3x", en: "conversion rate vs benchmark" },
      { metric: "~4", en: "visitors per share, 2x the target" },
    ],
    media: [{ src: 'media/landing-page/blaze-to-natlan-banner.jpg',
      thumbnail: 'media/landing-page/blaze-to-natlan-thumb.jpg', floating: true, alt: { en: 'Genshin Impact “Blaze to Natlan” web event banner: take part to win in-game rewards' } }],
    links: [
      { label: { en: 'Event page', zh: '活动页' }, href: 'https://act.hoyoverse.com/ys/event/e20240816natlan-iseatr/index.html?game_biz=hk4e_global' },
    ],
  },

  {
    id: 'growth-social',
    type: 'branch',
    parent: 'root',
    label: { en: 'Creator & Social', zh: '创作者与社媒' },
    kicker: { en: 'Area of work', zh: '工作领域' },
    summary: { en: 'Creator campaigns and always-on social channels across X, TikTok, YouTube, Instagram, Snapchat and Xiaohongshu, for English-speaking, Japanese and Chinese audiences.' },
  },
  {
    id: 'zzz-jp-accounts',
    mapTag: { en: '80M+ views' },
    
    note: { en: '0 → 80M+\norganic views', zh: '0 → 8000 万+\n自然播放' },
    team: { en: "Me (social strategy), 2 Japanese-language content reviewers and 3 agency partners" },
    type: 'case',
    parent: 'growth-social',
    featured: true,
    headline: { num: '80M+', label: { en: 'organic views across 9 channels' } },
    label: { en: 'Zenless Zone Zero: JP Account Growth' },
    kicker: { en: 'YouTube, X' },
    context: { en: 'Zenless Zone Zero' },
    tags: [{ en: 'YouTube' }, { en: 'X' }],
    platforms: ['youtube', 'x'],
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
    id: 'interactive-filter',
    mapLabel: { en: 'Filter Campaign' }, // v71.2: short name on the metro map (words from the title, in order); the card shows the full title
    mapTag: { en: '600M+ views' },
    
    note: { en: '600M+ views', zh: '6 亿+ 播放' },
    team: { en: "Me (filter concepts and creator activation support), 1 campaign lead, 2 platform liaisons from TikTok and Snapchat, and 3 agency partners" },
    type: 'case',
    period: 'Jan – Feb 2024',
    parent: 'growth-social',
    featured: true,
    headline: { num: '600M+', label: { en: 'views across TikTok and Snapchat' } },
    label: { en: 'TikTok & Snapchat Branded Filter Campaign' },
    kicker: { en: 'Genshin Impact · TikTok, Snapchat' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'TikTok' }, { en: 'Snapchat' }, { en: 'AR filters' }, { en: 'Creator marketing' }],
    platforms: ['tiktok', 'snapchat'],
    markets: ['US', 'EU', 'JP'], // creators in Europe too (owner)
    summary: {
      en: "I helped create two AR filters for Lantern Rite, Genshin Impact’s annual Lunar New Year event, and activated 70+ creators to show players how to use them, as the campaign expanded from TikTok to Snapchat for the first time. It drew 600M+ views and 600K+ player videos, and the Snapchat Lens ranked #1 among sponsored Lenses.",
    },
    sections: [
      {
        title: { en: 'The Challenge', zh: '项目挑战' },
        items: [
          { en: "Lantern Rite needed a social moment players could join, and this year the filter challenge was moving beyond TikTok to Snapchat for the first time. The filters had to be fun to use, simple enough for anyone to recreate, and right for two platforms whose users behave differently. We also had only a short window to build momentum and get the trend to take off." },
        ],
      },
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: "Shaped the filter concepts: Researched competitor filters and helped develop two gesture-based ideas: releasing a sky lantern for TikTok and Snapchat, and a lion-mask transformation for a new character on TikTok. I wrote the creative briefs and reviewed each iteration with TikTok’s effects team." },
          { en: "Briefed creators: Turned each filter into simple video ideas for cosplay, beauty, pet, dance and transition creators, so their posts inspired players to make their own." },
          { en: "Supported creator activation: Reviewed creator selection and content for 70+ creators across TikTok and Snapchat, whose videos went live in the first week to kick off the trend." },
        ],
      },
    ],
    results: [
      { metric: "600M+", en: "views across TikTok and Snapchat" },
      { metric: "600K+", en: "player videos made with the filters" },
      { metric: "#1", en: "sponsored Lens on Snapchat" },
      { metric: "180M+", en: "views from 57 TikTok creators" },
    ],
    media: [{ src: 'media/interactive-filter/lantern-rite-event-banner.jpg',
      thumbnail: 'media/interactive-filter/lantern-rite-event-thumb.jpg', floating: true, alt: { en: 'Genshin Impact Lantern Rite submission event banner, the TikTok event players joined with the filters' } }],
    links: [
      { label: { en: 'TikTok event page', zh: 'TikTok 活动页' }, href: 'https://activity.us.tiktok.com/magic/eco/runtime/release/65ae743a08a22502879a1571?appType=muse&magic_page_no=1&use_spark=1&magic_source=usExternal' },
      { label: { en: 'Creator video example', zh: '达人视频示例' }, href: 'https://www.tiktok.com/@claudiaalende/video/7330704427923377450' },
    ],
  },
  {
    id: 'influencer-activation',
    
    team: { en: "Me (influencer strategy and execution), 2 execution support specialists and 2 agency partners" },
    type: 'case',
    period: 'Jan 2026',
    parent: 'growth-social',
    headline: { num: '~3x', label: { en: 'engagement vs the last creator campaign' } },
    label: { en: 'X Creator Campaign' },
    kicker: { en: 'Genshin Impact · X' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'X' }, { en: 'Creator marketing' }],
    platforms: ['x'],
    markets: ['NA', 'JP'],
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
    id: 'giveaway-campaign',
    mapLabel: { en: 'Community Giveaway' }, // v71.2: short name on the metro map (words from the title, in order); the card shows the full title
    
    team: { en: "Me (campaign lead and strategy), 2 execution support specialists and 4 agency partners" },
    type: 'case',
    period: 'Aug 2024',
    parent: 'growth-social',
    headline: { num: '~900K', label: { en: 'code redemptions, about 4x the goal' } },
    label: { en: 'Cross-Platform Community Giveaway' },
    kicker: { en: 'Genshin Impact · X, TikTok, Instagram' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'X' }, { en: 'TikTok' }, { en: 'Instagram' }, { en: 'Creator marketing' }],
    platforms: ['x', 'tiktok', 'instagram'],
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
    links: [
      { label: { en: 'Creator video example', zh: '达人视频示例' }, href: 'https://www.instagram.com/p/C_Myepry5Co/' },
    ],
  },
  {
    id: 'genshin-en-accounts',
    mapLabel: { en: 'English Social Growth' }, // v71.2: short name on the metro map (words from the title, in order); the card shows the full title
    
    team: { en: "Me (growth strategy support and content review), 1 growth strategy lead and 1 agency partner" },
    type: 'case',
    parent: 'growth-social',
    headline: { num: '35M+', label: { en: 'views across 8 channels' } },
    label: { en: 'EN Social Channel Growth' },
    kicker: { en: 'Genshin Impact · TikTok, YouTube' },
    context: { en: 'Genshin Impact' },
    tags: [{ en: 'TikTok' }, { en: 'YouTube' }],
    platforms: ['tiktok', 'youtube'],
    period: 'Q4 2023',
    markets: ['NA'],
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

  /* Her own channel, not a job (v67, owner): last in Creator & Social. No challenge or team: there wasn't one. Never call it a side hustle (v69.8). */
  {
    id: 'xhs-ai-channel',
    mapLabel: { en: 'Xiaohongshu Channel' }, // v71.2: short name on the metro map (words from the title, in order); the card shows the full title
    type: 'case',
    parent: 'growth-social',
    org: '', // her own account, not done at a job
    note: { en: 'my own channel', zh: '我自己的账号' }, // shows beside the point while Creator & Social is open
    headline: { num: '1.8M+', label: { en: 'views across Xiaohongshu and Douyin' } },
    label: { en: 'Xiaohongshu AI Channel' },
    kicker: { en: 'Xiaohongshu · Douyin' },
    tags: [{ en: 'Xiaohongshu' }, { en: 'Douyin' }],
    platforms: ['xhs'],
    period: '2025 – now',
    markets: ['CN'],
    summary: {
      en: "An AI channel I built from zero on Xiaohongshu (RedNote) and Douyin, two of China’s biggest social platforms. I run it like a growth project: find the audience, test what works, scale it, and turn the reach into brand partnerships with China’s leading AI companies.",
    },
    sections: [
      {
        title: { en: 'What I did', zh: '我做了什么' },
        items: [
          { en: "Positioning: Studied the top AI creators and aimed the channel at AI beginners, with one promise: every video ends with something viewers can make themselves." },
          { en: "Content formula: Found what makes people save and follow, and built every video around it: result first, low barrier, clear steps." },
          { en: "Test and scale: Kept testing new formats and topics, cut what didn’t convert, and doubled down on what worked." },
          { en: "Brand partnerships: Won paid partnerships with China’s leading AI companies, including Alibaba’s Qwen, ByteDance’s Jimeng, MiniMax, Moonshot AI’s Kimi, LiblibAI and Lovart." },
          { en: "Content operations system: Built my own AI system for research, scripts and performance reviews, so I can run the whole channel on my own." },
        ],
      },
    ],
    results: [
      { metric: '1.8M+', en: 'views across Xiaohongshu and Douyin' },
      { metric: '100K+', en: 'likes' },
      { metric: '6', en: 'paid partners among China’s top AI brands' },
    ],
    related: ['creator-workbench'], // the system that runs it (v69)
    links: [
      { label: { en: 'Xiaohongshu profile' }, href: 'https://www.xiaohongshu.com/user/profile/62a6b493000000001b02aa8d' },
      { label: { en: 'Breakout video' }, href: 'https://www.xiaohongshu.com/discovery/item/6aa17dcd0000000028029744' },
    ],
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
    mapLabel: { en: 'Creative Dashboard' }, // v71.2: short name on the metro map (words from the title, in order); the card shows the full title
    mapTag: { en: 'Built with AI' },
    type: 'ai',
    parent: 'ai',
    headline: { num: '40%', label: { en: 'less time on creative analysis & production' }, note: { en: "I built it from scratch while running creative strategy for Genshin Impact's creator ads." } }, // note: owner's line under the figure
    label: { en: 'Creative Intelligence Dashboard' },
    tags: [{ en: 'Vibe Coding' }, { en: 'Claude Code' }], // same tag style as the cases' markets and platforms (owner)
    sections: [
      {
        title: { en: 'What it does', zh: '功能' },
        open: true, // owner: unfolded by default on this card
        items: [
          { en: 'AI tagging: Watches every video ad and tags its hook, format, pacing and more, with a human review step.' },
          { en: 'Winning formula: Links tags to performance data to show what top ads have in common, across updates and markets.' },
          { en: 'Script Studio: Turns the winning formula into new scripts, written natively for each market.' },
          { en: 'Campaign planning: Drafts the creative plan for the next campaign from past results.' },
          { en: 'Knowledge Base: Learns from every note, edit and piece of feedback, so results get sharper over time.' },
        ],
      },
    ],
    prototype: { src: 'demo/dashboard.html', poster: 'media/ai-workbench/promo-poster.jpg', video: ['media/ai-workbench/promo.webm', 'media/ai-workbench/promo.mp4'] },
    gallery: [set('dashboard', 'ai-workbench', 'screens', { en: 'Prototype screens' }, { en: 'Sample data' })],
    related: ['ua-creative-strategy'],
    alwaysLinked: ['ua-creative-strategy'], // owner: opening AI Projects shows the Creator Ad Pipeline it grew out of
  },
  {
    id: 'creator-workbench',
    type: 'ai',
    parent: 'ai',
    org: '', // her own project, not done at a job
    label: { en: 'Creator Workbench' },
    context: { en: 'Personal project' },
    tags: [{ en: 'Vibe Coding' }, { en: 'Obsidian' }, { en: 'Claude Code' }, { en: 'Codex' }],
    summary: { en: "The AI system that runs my Xiaohongshu channel, turned into a product for other creators. Agents do the research, analysis and drafting; the creator makes every call, without having to learn how agents work." },
    sections: [
      {
        title: { en: 'What it does', zh: '功能' },
        open: true,
        items: [
          { en: "Built on a proven workflow: Every module is a workflow I already run for my own channel, from research and viral-post breakdowns to scripts and growth reviews." },
          { en: "End to end: Takes content from research to idea, script, review and post-launch analysis in one place, instead of across chats, docs and spreadsheets." },
          { en: "Human in the loop: Agents research, analyse and draft, but nothing gets made until the creator picks the idea, and every draft stops for review." },
          { en: "Built for other creators: Helps new users set up their own content tags from a few sample posts, runs on the AI subscription they already pay for, and works in Chinese and English." },
        ],
      },
    ],
    prototype: { src: 'demo/workbench.html', poster: 'media/creator-workbench/poster.jpg', video: ['media/creator-workbench/promo.webm', 'media/creator-workbench/promo.mp4'] }, // v69.6: promo video, same style as the dashboard's; poster = its end frame
    gallery: [set('workbench', 'creator-workbench', 'screens', { en: 'Prototype screens' }, { en: 'Sample data' })],
    related: ['xhs-ai-channel'],
    alwaysLinked: ['xhs-ai-channel'], // owner (v69.10): opening AI Projects shows the channel this system runs
  },

  /* ---------------- Creative Work ---------------- */
  {
    id: 'creative',
    type: 'branch',
    parent: 'root',
    label: { en: 'Creative Work', zh: '创意作品' },
    kicker: { en: 'Area of work', zh: '工作领域' },
    summary: { en: 'Away from work, I love taking photos and designing things.', zh: '工作之余，我喜欢拍照和做设计。' },
  },
  {
    id: 'photography', type: 'creative', parent: 'creative', label: { en: 'Photography', zh: '摄影' }, period: '2021 – 2024',
    summary: { en: 'Photos from my travels, grouped by place.', zh: '旅行中拍的照片，按地点分组。' },
    gallery: [
      set('huangshi', 'photography/huangshi', 'photos', { en: 'Huangshi, Hubei', zh: '湖北黄石' }, { en: 'Lunar New Year · 2022', zh: '春节 · 2022' }),
      set('japan', 'photography/japan', 'photos', { en: 'Japan', zh: '日本' }, { en: '2024' }),
      set('europe', 'photography/europe', 'photos', { en: 'Europe', zh: '欧洲' }, { en: 'Italy · France · Barcelona · 2024', zh: '意大利 · 法国 · 巴塞罗那 · 2024' }), // owner: three places, one series so it isn't scattered
      set('wuhan', 'photography/wuhan', 'photos', { en: 'Wuhan', zh: '武汉' }, { en: '2021' }),
      set('chicago', 'photography/chicago', 'photos', { en: 'Chicago', zh: '芝加哥' }, { en: '2021 – 2023' }),
      set('new-york', 'photography/new-york', 'photos', { en: 'New York', zh: '纽约' }, { en: '2022' }),
      set('arizona', 'photography/arizona', 'photos', { en: 'Arizona', zh: '亚利桑那' }, { en: '2023' }),
    ],
  },
  {
    id: 'design', type: 'creative', parent: 'creative', label: { en: 'Design', zh: '设计' }, period: '2019 – 2020',
    gallery: [
      set('x-mirror-2', 'design/x-mirror-2', 'pages', { en: 'X Mirror, Issue 2', zh: 'X Mirror 第二期' }, { en: '2019' }),
      set('posters', 'design/posters', 'posters', { en: 'Film screening posters', zh: '电影放映海报' }),
    ],
  },

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
  { id: 'hoyoverse', type: 'role', parent: 'experience', label: { en: 'HoYoverse' }, role: { en: 'Global Marketing' }, kicker: { en: 'Global Marketing' }, period: 'Sep 2023 – Aug 2026', markets: ['NA', 'JP'], summary: { en: 'UGC strategy for paid campaigns, social growth for third-party accounts, and cross-platform campaigns.' } }, // no link to the dashboard: its one direct connection is the Creator Ad Pipeline (owner, v64)
  { id: 'seminary-coop', type: 'role', parent: 'experience', label: { en: 'Seminary Co-op Bookstores' }, mapLabel: { en: 'Seminary Co-op' }, kicker: { en: 'Marketing & Events Intern' }, period: 'Jul – Sep 2023', markets: ['US'], summary: { en: 'Summer Gift Guide campaign across web, social and newsletters.' } },
  { id: 'nike', type: 'role', parent: 'experience', label: { en: 'Nike' }, kicker: { en: 'Social Media Marketing Intern' }, period: 'Dec 2021 – Aug 2022', markets: ['CN'], summary: { en: 'Xiaohongshu campaigns, hashtag and influencer strategy for Nike Women launches.' } },
  { id: 'weber-shandwick', type: 'role', parent: 'experience', label: { en: 'Weber Shandwick' }, kicker: { en: 'Public Relations Intern' }, period: 'Jun – Sep 2021', markets: ['CN'], summary: { en: 'Market research and social listening for client PR strategy.' } },
  { id: 'nowness', type: 'role', parent: 'experience', label: { en: 'NOWNESS' }, kicker: { en: 'Social Media Content Strategy Intern' }, period: 'Sep – Nov 2020', markets: ['CN'], summary: { en: 'WeChat and Weibo content and publishing for art and culture pieces.' } },

  { id: 'uchicago', type: 'school', parent: 'education', label: { en: 'University of Chicago' }, mapLabel: { en: 'UChicago' }, kicker: { en: 'MA, Humanities' }, period: '2022 – 2023' },
  { id: 'xjtlu', type: 'school', parent: 'education', label: { en: "Xi'an Jiaotong-Liverpool University" }, mapLabel: { en: 'XJTLU' }, kicker: { en: 'BA, Communication and Media Studies' }, period: '2017 – 2021' },

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
export const indexSections = ['growth-paid', 'growth-social', 'ai', 'creative', 'experience', 'education'];

/* The three flagship Growth Marketing cases, in reading order (each leads its group; v62.30). */
export const featuredOrder = ['ua-creative-strategy', 'gip-testing', 'zzz-jp-accounts', 'interactive-filter'];

export const rolesOrder = ['hoyoverse', 'seminary-coop', 'nike', 'weber-shandwick', 'nowness'];
export const schoolsOrder = ['uchicago', 'xjtlu'];

export const byId = new Map(nodes.map((n) => [n.id, n]));

/* All Growth Marketing cases and the AI Workbench were done at HoYoverse (the Xiaohongshu channel is her own: org ''). */
nodes.forEach((n) => {
  if (['case', 'ai', 'creative'].includes(n.type) && n.org !== '') n.team ??= { en: '' }; // her own projects (org: '') have no team, not even an empty one in the editor (L50)
  if ((n.type === 'case' || n.id === 'ai-workbench') && n.org === undefined) n.org = 'hoyoverse'; // org: '' = her own work, no employer
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
  more: { en: 'More', zh: '展开' },
  less: { en: 'Less', zh: '收起' },
  prototype: { en: 'Prototype · placeholder copy', zh: '原型 · 占位文案' },
  workHere: { en: 'Work from this role', zh: '这段经历中的作品' },
  viewWork: { en: 'View work', zh: '查看作品' },
  home: { en: 'home', zh: '首页' },
  mapLabel: { en: 'Portfolio map', zh: '作品地图' },
  email: { en: 'Email', zh: '邮箱' },
  linkedin: { en: 'LinkedIn', zh: 'LinkedIn' },
  index: { en: 'Index', zh: '索引' },
  moreAbout: { en: 'More about me', zh: '更多关于我' },
  backToIndex: { en: 'Back to the index', zh: '回到索引' },
  unitPhotos: { en: 'photos', zh: '张' },
  unitPages: { en: 'pages', zh: '页' },
  unitPosters: { en: 'posters', zh: '张' },
  unitScreens: { en: 'screens', zh: '屏' },
  appBarSub: { en: 'Clickable prototype · sample data', zh: '可点击原型 · 示例数据' },
  tryApp: { en: 'Try the prototype', zh: '试用原型' },
  soundOn: { en: 'Turn sound on', zh: '打开声音' },
  play: { en: 'Play', zh: '播放' },
  pause: { en: 'Pause', zh: '暂停' },
  replay: { en: 'Replay', zh: '重新播放' },
  videoProgress: { en: 'Video progress', zh: '播放进度' },
  soundOff: { en: 'Turn sound off', zh: '关闭声音' },
  openApp: { en: 'Open the clickable prototype', zh: '打开可点击原型' },
  protoNote: { en: 'This is a display prototype with sample data. For details on the full project, feel free to get in touch.', zh: '这是展示用原型，数据为示例。想了解完整项目，欢迎联系我。' },
  backToMap: { en: 'Back to the map', zh: '回到地图' },
  mapWord: { en: 'Map', zh: '地图' },
  prev: { en: 'Previous', zh: '上一张' },
  next: { en: 'Next', zh: '下一张' },
  arrangeHint: { en: 'Arrange mode: drag points and notes, then copy the layout and send it to Claude', zh: '排版模式：拖动点和批注，然后复制布局发给 Claude' },
  arrangeCopy: { en: 'Copy layout', zh: '复制布局' },
  arrangeCopied: { en: 'Copied', zh: '已复制' },
  // metro map (v70, branch metro-map): line names, the top station and the legend
  lineCareer: { en: 'Career line' },
  lineCampus: { en: 'Campus line' },
  lineCreative: { en: 'Creative line' },
  linePaid: { en: 'Paid & UA line' },
  lineSocial: { en: 'Creator & Social line' },
  lineAi: { en: 'AI line' },
  nextStop: { en: 'Next stop' },
  legendKeyCase: { en: 'Key case' },
  legendInterchange: { en: 'Interchange' },
  legendOtherStop: { en: 'Other stop' },
  // Curate your ride (v71)
  curateRide: { en: 'Curate your ride' },
  rideClear: { en: 'Clear' },
  rideShow: { en: 'Show my ride' },
  yourRide: { en: 'Your ride' },
  rideStops: { en: '{n} stops' },
  rideStop1: { en: '1 stop' },
  rideStart: { en: 'Start ride →' },
  rideNext: { en: 'Next stop →' },
  rideArriving: { en: 'Arriving…' },
  rideTalk: { en: 'Let’s talk ↗' },
  rideOf: { en: '{i} of {n}' },
  rideNextUp: { en: 'next: {name}' },
  rideLast: { en: 'last stop' },
  rideEnd: { en: 'End of the line ✳' },
  rideThanks: { en: 'You rode all {n} stops. Thanks for riding!' },
  rideNone: { en: 'No stops match' },
  rideNoneHint: { en: 'Try another market or platform' },
  ridePrev: { en: 'Previous stop' },
  rideExit: { en: 'End ride' },
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
