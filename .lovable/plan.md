
# Vyxlo MVP Plan

## 1. Product Overview

**One-liner Vision:**
Vyxlo gives 𝕏 creators a daily system — ideas, drafts, and a schedule — so they never run out of things to post.

**Core User Pain Point:**
Creators know they need to post consistently to grow, but the daily grind of coming up with ideas, writing them well, and remembering to actually publish is exhausting. Most give up not from lack of talent, but lack of a system.

---

## 2. Current State Audit (Honest Baseline)

Before the roadmap, this is exactly what exists today:

| Area | Status |
|---|---|
| Landing Page | Complete — Hero, Problem, Features, Pricing, Testimonials, CTA, Footer |
| Authentication | Functional — Email/password sign up & sign in, email confirmation flow |
| Dashboard Shell | Complete — Sidebar nav with 8 pages, protected routes |
| Inspiration Page | UI complete — 12 mock tweets, search, sort, bookmark, category filter |
| Content Studio | UI shell only — Editor exists, AI buttons are non-functional |
| Post Queue | UI shell only — Calendar grid with hardcoded mock posts |
| Analytics | UI shell only — Hardcoded metric cards and bar chart |
| Library | UI shell only — Hardcoded saved tweets with local filter |
| Context Page | UI shell only — Static form fields, save button does nothing |
| Database | Only 1 table: `profiles` (id, email, full_name, avatar_url) |
| Payments | Nothing implemented |
| AI Integration | Zero — no edge functions, no model calls |
| X/Twitter API | Not connected |

**Completion Level: ~20% of a competitive product.**

---

## 3. Finalized MVP Features

The MVP must prove the core loop: **Inspire → Write → Schedule → Analyze.** Everything else is post-MVP.

### TIER A — Must Have for MVP (Build Now)

**A1. AI Content Generation (Content Studio)**
- "Generate with AI" button sends user's topic + tone + context to an AI model and returns a ready-to-post tweet or thread draft
- "Rewrite with AI" takes existing text and improves it based on selected tone (Professional, Casual, Witty, etc.)
- Powered by Lovable AI (Gemini 2.5 Flash — no API key needed)
- Output streamed back to the editor textarea

**A2. Context Persistence (Context Page → Database)**
- User fills in Brand Voice, Target Audience, Topics
- Data saved to a new `user_contexts` table in the database
- AI generation reads this context to personalize outputs
- Without this, AI outputs are generic and worthless

**A3. Draft & Post Storage**
- New `posts` table: stores user drafts with status (`draft`, `scheduled`, `published`)
- Content Studio "Save Draft" saves to database
- Post Queue pulls from `posts` table — no more hardcoded mock data

**A4. Post Scheduling (Post Queue)**
- User picks date + time for a post
- Scheduled posts stored in `posts` table with `scheduled_for` timestamp
- A backend function runs on a timer to check for due posts (or at minimum, display a publish reminder)

**A5. Subscription & Payment (Midtrans)**
- Free tier: 10 AI generations/month, no scheduling
- PRO ($39/month): Unlimited AI, scheduling, analytics
- ADVANCED ($29/month early bird): All PRO features + Auto-Retweet, Auto-Plug, Auto-Delete
- Midtrans Snap popup on upgrade click
- `subscriptions` table tracks user plan, status, and expiry
- Feature gating in the UI — locked features show upgrade prompt

### TIER B — Important but Post-MVP (Build Next Sprint)

**B1. Analytics Connection**
- Replace hardcoded numbers with real data from `posts` table (drafts count, scheduled count, published count)
- Full 𝕏 API analytics requires API access — defer to post-MVP

**B2. Library Save Flow**
- "Use Tweet" on Inspiration page opens Content Studio pre-filled with that tweet as inspiration
- "Save to Library" actually writes to a `library_items` table

**B3. Mobile Responsive Dashboard**
- Sidebar collapses to hamburger on mobile
- All dashboard pages scroll correctly on small screens

**B4. Email Onboarding Sequence**
- After sign up, send a 3-email welcome sequence (Day 0, Day 1, Day 3)
- Guides user through: set context → generate first tweet → schedule it

### TIER C — Competitive Differentiators (Build to Beat SuperX)

- Chrome Extension (clip tweets from 𝕏 directly into Library)
- 𝕏 API integration (real follower count, impressions, auto-schedule via API)
- Algorithm Simulator (predict tweet performance before posting)
- Auto-Retweet / Auto-Plug / Auto-Delete automation
- AI Chat Mode (conversational content assistant)

---

## 4. Detailed User Journey

### Morning Ritual (7:00 AM — 15 minutes)

```text
1. User opens Vyxlo dashboard → lands on Inspiration page
2. Sees 12 curated tweet suggestions filtered by their context (niche + topics)
3. Finds one that resonates → clicks "Use Tweet"
4. Content Studio opens pre-filled with the inspiration tweet as a prompt
5. Clicks "Generate with AI" — AI writes a personalized version in their tone
6. User edits, adjusts, happy with it
7. Clicks "Schedule" → picks today at 12:00 PM or tomorrow morning
8. Post saved to queue. Done. 15 minutes. No blank screen.
```

### Midday Check (12:00 PM — 5 minutes)

```text
1. Notification or reminder: "Your post is scheduled to go out now"
2. User opens Post Queue, sees today's scheduled post
3. Optionally edits or confirms → publishes (MVP: manual publish; V2: auto via X API)
4. Checks Analytics → sees yesterday's post performance (impressions, likes)
```

### Weekly Review (Sunday, 20 minutes)

```text
1. Opens Analytics → sees top performing post of the week
2. Notes what category it was (Growth, Mindset, etc.)
3. Opens Content Studio → generates 5 drafts for next week in bulk
4. Schedules all 5 in Post Queue across Mon–Fri
5. Sets next week. Closes laptop. Done.
```

---

## 5. Monetization Plan

### Free Plan — "Starter"
**Price: $0 / month**

| Feature | Limit |
|---|---|
| AI Generations | 10 per month |
| Scheduled Posts | 3 active at a time |
| Inspiration Feed | Full access (read only) |
| Content Studio | Full access, limited AI |
| Analytics | Basic (last 7 days) |
| Library | Save up to 20 tweets |
| Context | 1 context profile |
| Post Queue | Manual publish only |
| Chrome Extension | No |
| Auto-Retweet/Plug | No |
| Support | Email (48h response) |

**Goal of Free Plan:** Get users addicted to the core loop. The 10 AI generation limit is designed to be hit within the first week of active use.

---

### PRO Plan — "Creator"
**Price: $39 / month (no discount)**

| Feature | Limit |
|---|---|
| AI Generations | Unlimited |
| Scheduled Posts | Unlimited |
| Inspiration Feed | Full access + personalized |
| Content Studio | All tones + thread generation |
| Analytics | Full (30 days + top posts) |
| Library | Unlimited saves |
| Context | 3 context profiles |
| Post Queue | Auto-publish via X API (V2) |
| Chrome Extension | Yes |
| Auto-Retweet/Plug | No (ADVANCED only) |
| Support | Priority email (24h) |

---

### ADVANCED Plan — "Power Creator"
**Price: $29 / month (Early Adopter, normally $49)**

| Feature | Limit |
|---|---|
| Everything in PRO | Included |
| Auto-Retweet | Yes |
| Auto-Plug | Yes |
| Auto-Delete | Yes |
| Algorithm Simulator | Yes |
| Context Profiles | Unlimited |
| Analytics | Advanced + engagement scoring |
| Support | Priority chat |
| Badge | Early Adopter badge on profile |

**Note on ADVANCED pricing psychology:** The $29 early adopter price vs $49 regular creates urgency. Show a countdown timer or "Only 47 spots left at this price" to drive conversion. Raise to $49 after first 100 paying users.

---

### Conversion Funnel

```text
Landing Page → Sign Up (Free) → Onboarding → Hit AI Limit → Upgrade Prompt → Midtrans Checkout → PRO/ADVANCED
```

**Target Conversion Rate:**
- Free → PRO: 5–8% (industry average for creator tools: 3–5%)
- PRO → ADVANCED: 30% (upsell at checkout with "Add $0 more/month for automation")

**Revenue Milestones:**
- 50 ADVANCED users = $1,450 MRR
- 100 PRO + 50 ADVANCED = $5,350 MRR
- 300 PRO + 150 ADVANCED = $20,550 MRR (product-market fit signal)

---

## 6. Technical Implementation Order

This is the exact build sequence to reach a shippable MVP:

```text
Step 1 — Database schema
  Create: user_contexts, posts, subscriptions tables
  Add RLS policies for each

Step 2 — Context Page
  Wire form to user_contexts table (save + load per user)

Step 3 — AI Content Studio
  Edge function: receive topic + tone + user context → call Gemini 2.5 Flash → return tweet draft
  Wire "Generate with AI" and "Rewrite with AI" buttons

Step 4 — Draft Persistence
  Content Studio "Save Draft" → writes to posts table
  Post Queue reads from posts table

Step 5 — Midtrans Payment
  Edge function: create Midtrans Snap token
  Frontend: Snap popup → webhook → update subscriptions table
  Feature gating: wrap locked features in subscription check

Step 6 — Upgrade prompts
  When Free user hits AI limit → show modal with upgrade CTA
  When Free user tries to schedule post 4+ → show upgrade modal

Step 7 — Mobile nav
  Hamburger menu for dashboard sidebar on screens < 768px
```

---

## 7. Definition of "MVP Complete"

Vyxlo MVP is done when a new user can:

1. Sign up with email
2. Set their brand context (saved to database)
3. Browse inspiration tweets
4. Click "Use Tweet" → Content Studio generates a personalized tweet using AI
5. Save the tweet as a draft (persisted to database)
6. Schedule it for a future time (stored in database)
7. See it in the Post Queue calendar
8. Hit the free tier AI limit and see a Midtrans-powered upgrade flow
9. Complete payment and have their plan upgraded in the database

**That is the MVP. Everything else is growth.**
