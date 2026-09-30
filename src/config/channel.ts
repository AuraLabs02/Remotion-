// Channel data shown in the reel. Edit freely: every screen reads from here.
//
// Real artwork: drop files into public/brand/ and they replace the built-in
// stand-ins automatically (see src/ui/assets.ts):
//   public/brand/avatar.png   channel logo (square, ≥ 800px)
//   public/brand/banner.jpg   channel banner (2560×423 safe area crop)
//   public/brand/thumb-1.jpg … thumb-8.jpg   video thumbnails (16:9)
//   public/brand/members-1.jpg … members-3.jpg   members-only thumbnails

export type ThumbIcon =
  | 'gauge'
  | 'layers'
  | 'gpu'
  | 'bolt'
  | 'rocket'
  | 'cloud'
  | 'container'
  | 'terminal'
  | 'code'
  | 'mic';

export type ThumbArt = {
  big: string;
  small: string;
  tag: string;
  icon: ThumbIcon;
  accent: string;
  base: string;
};

export type Video = {
  title: string;
  duration: string;
  views: string;
  age: string;
  art: ThumbArt;
};

export const CHANNEL = {
  name: 'Cloud Codes',
  handle: '@Cloud-Codes',
  url: 'youtube.com/@Cloud-Codes',
  subscribers: '12.4K subscribers',
  videoCount: '86 videos',
  description:
    'Cloud engineering, AI automation, DevOps and modern software development. Learn to build scalable systems and automate your workflows.',
  link: 'github.com/cloud-codes',
  moreLinks: 'and 2 more links',
  tagline: 'Cloud · AI Automation · DevOps',
};

/** Stand-in brand palette (swap for the channel's exact colours). */
export const BRAND = {
  cyan: '#22d3ee',
  sky: '#38bdf8',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  pink: '#ec4899',
  deep: '#070b1d',
  night: '#0b1130',
  gradient: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 48%, #8b5cf6 100%)',
  gradientSoft:
    'linear-gradient(135deg, rgba(34,211,238,0.9) 0%, rgba(59,130,246,0.9) 50%, rgba(139,92,246,0.9) 100%)',
};

export const VIEWER = {
  name: 'Alex Carter',
  handle: '@alexbuilds',
  initial: 'A',
  color: '#7c4dff',
};

export type Tier = {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  level: 0 | 1 | 2;
  popular?: boolean;
  perks: string[];
};

export const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Cloud Starter',
    price: '$0.99',
    priceValue: 0.99,
    level: 0,
    perks: ['Loyalty badges next to your name', 'Custom emoji in comments & chat'],
  },
  {
    id: 'pro',
    name: 'Cloud Pro',
    price: '$4.99',
    priceValue: 4.99,
    level: 1,
    popular: true,
    perks: ['Everything in Cloud Starter', 'Members-only videos', 'Early access to new uploads'],
  },
  {
    id: 'architect',
    name: 'Cloud Architect',
    price: '$9.99',
    priceValue: 9.99,
    level: 2,
    perks: ['Everything in Cloud Pro', 'Monthly live Q&A', 'Full source code & templates'],
  },
];

export const SELECTED_TIER = 1;

/** Membership perks, as YouTube lists them in the join dialog. */
export const PERKS = [
  {icon: 'badge', title: 'Loyalty badges', text: 'next to your name in comments and live chat'},
  {icon: 'emoji', title: 'Custom emoji', text: 'to use in comments and live chat'},
  {icon: 'video', title: 'Members-only videos', text: 'deep dives, full builds & replays'},
  {icon: 'bolt', title: 'Early access', text: 'watch new uploads before everyone else'},
] as const;

export const VIDEOS: Video[] = [
  {
    title: 'Qwen3.8 27B Is 3× Faster With One Hidden Setting (MTP)',
    duration: '14:32',
    views: '48K views',
    age: '2 days ago',
    art: {big: '3×', small: 'FASTER', tag: 'MTP', icon: 'gauge', accent: '#ff7a1a', base: '#1d0b26'},
  },
  {
    title: 'Qwen3.8 27B Architecture Explained: 1M Context With 75% Non-Transformer Layers',
    duration: '22:08',
    views: '31K views',
    age: '5 days ago',
    art: {big: '1M', small: 'CONTEXT', tag: 'QWEN3.8', icon: 'layers', accent: '#22d3ee', base: '#061a2c'},
  },
  {
    title: 'Ornith 1.5 35B Local Test: 170K Context on a Single RTX GPU',
    duration: '18:47',
    views: '27K views',
    age: '1 week ago',
    art: {big: '170K', small: 'ON ONE GPU', tag: 'LOCAL AI', icon: 'gpu', accent: '#7cff4d', base: '#0a1a0c'},
  },
  {
    title: 'Speculative Decoding Explained: How LLMs Generate 2× Faster',
    duration: '11:15',
    views: '19K views',
    age: '2 weeks ago',
    art: {big: '2×', small: 'TOKENS / SEC', tag: 'EXPLAINED', icon: 'bolt', accent: '#ffd400', base: '#1c1400'},
  },
  {
    title: 'I Built an AI Agent That Deploys Itself (Full DevOps Pipeline)',
    duration: '16:40',
    views: '54K views',
    age: '3 weeks ago',
    art: {big: 'AUTO', small: 'DEPLOY', tag: 'AI AGENT', icon: 'rocket', accent: '#ff4f8b', base: '#220817'},
  },
  {
    title: 'Kubernetes + Local LLMs: The Ultimate AI Homelab',
    duration: '25:12',
    views: '22K views',
    age: '1 month ago',
    art: {big: 'K8S', small: 'AI HOMELAB', tag: 'DEVOPS', icon: 'cloud', accent: '#4d8dff', base: '#08122b'},
  },
  {
    title: 'Docker for AI Engineers in 12 Minutes',
    duration: '12:03',
    views: '40K views',
    age: '1 month ago',
    art: {big: '12', small: 'MINUTES', tag: 'DOCKER', icon: 'container', accent: '#00e0ff', base: '#021a22'},
  },
  {
    title: 'Terraform + AI: Infrastructure That Writes Itself',
    duration: '19:26',
    views: '17K views',
    age: '2 months ago',
    art: {big: 'IaC', small: 'WITH AI', tag: 'TERRAFORM', icon: 'terminal', accent: '#b98cff', base: '#150a2b'},
  },
];

export const MEMBER_VIDEOS: Video[] = [
  {
    title: 'Full Source Code: The Self-Deploying AI Agent',
    duration: '32:10',
    views: '3.2K views',
    age: '1 day ago',
    art: {big: 'SOURCE', small: 'FULL BUILD', tag: 'MEMBERS', icon: 'code', accent: '#22d3ee', base: '#07102a'},
  },
  {
    title: 'Live Q&A Replay #12: Building a Local LLM Rig',
    duration: '58:44',
    views: '2.7K views',
    age: '4 days ago',
    art: {big: 'Q&A', small: 'LIVE #12', tag: 'REPLAY', icon: 'mic', accent: '#8b5cf6', base: '#120a2b'},
  },
  {
    title: 'Early Access: Qwen3.8 Deep Dive, Part 2',
    duration: '27:31',
    views: '1.9K views',
    age: '6 days ago',
    art: {big: 'PART 2', small: 'EARLY ACCESS', tag: 'QWEN3.8', icon: 'layers', accent: '#ff7a1a', base: '#1d0b26'},
  },
];

export const CHAT = [
  {name: 'devops_dan', color: '#ff8a65', text: 'this pipeline is so clean'},
  {name: 'Priya Codes', color: '#4fc3f7', text: 'which GPU are you running this on?'},
  {name: 'ml_marco', color: '#aed581', text: 'the MTP trick doubled my tokens/s'},
  {name: 'kube_kid', color: '#ba68c8', text: 'k8s homelab part 2 when??'},
  {name: 'Sara N', color: '#ffb74d', text: 'agent deploying itself is wild'},
];

export const SUBSCRIPTIONS = [
  {name: 'Cloud Codes', color: '#3b82f6', live: true},
  {name: 'Byte Sized', color: '#ef5350'},
  {name: 'Neural Notes', color: '#ab47bc'},
  {name: 'Kernel Panic', color: '#26a69a'},
  {name: 'Stack Stories', color: '#ffa726'},
];
