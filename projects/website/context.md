# Qube Website -- Build Context

## Brief
Marketing website for Qube -- India's physical AI data collection company.
Three audiences on one site: AI companies/buyers, agencies/partners, and contributors.
All form submissions and call bookings go to: ldrago@0xqube.xyz

---

## Domain
0xqube.xyz (existing, point to Vercel)

## Tech Stack
- **Next.js 14** (App Router) + **Tailwind CSS**
- Deploy on **Vercel**
- Forms: **Resend** (email delivery) or **Formspree** (no backend needed -- simpler)
- Single-page site with anchor navigation (no separate routes needed)

---

## Design Direction

### Colors (from brand -- match one-pager exactly)
- Primary orange: `#FF7A2F`
- Dark text / body: `#232832`
- Muted label: `#64748B`
- Light background: `#FAFAFA`
- Section divider: `#E0E4EE`
- Orange light (table alternating): `#FFF4EE`

### Typography
- Display / headings: Clean sans-serif, heavy weight -- Inter or Geist
- Body: Same family, regular weight, 16-17px, generous line height
- Section labels: uppercase, small, orange, letter-spaced (same treatment as one-pager)

### Tone
- Professional, confident, not startup-y
- No buzzwords, no flashy animations
- Credibility over style -- this goes to AI labs and agencies

---

## Site Structure (single page, anchor nav)

```
/ (single page)
  #hero
  #what-are-we
  #what-we-do
  #how-we-do-it
  #annotations
  #capabilities
  #regions
  #partner       ← form + book a call
  #contributor   ← separate form
  footer
```

**Nav links:** What We Do / Annotations / Capabilities / Partner With Us / Become a Contributor

---

## Section Content

### Hero
**Headline:** India's physical AI data collection company
**Subline:** Task-specific, consent-clean egocentric data from real manufacturing environments. Built for robotics and embodied AI.
**CTAs:** [Partner With Us] [Become a Contributor]
- Background: dark or off-white, large QUBE wordmark in orange

---

### What Are We
Qube is a data collection company built for physical AI. We source, record, and deliver egocentric (first-person POV) training data from real-world environments in India -- the kind of data that teaches robots and autonomous systems how humans actually move and work.

---

### What We Do
We run end-to-end data collection projects -- from contributor briefing and recording to QA review and annotation delivery. Our focus is task-specific, environment-specific data from Indian manufacturing settings: auto components, electronics assembly, and pharma packaging.

---

### How We Do It
Four bullet points:
1. **In-house execution team** -- trained contributors with head-mounted rigs, briefed on narration and hand visibility standards
2. **Factory floor access** -- direct relationships with manufacturing facilities across India, with employer-level consent frameworks
3. **Structured QA pipeline** -- every video reviewed against narration quality, PII checks, hand visibility, and file standards before delivery
4. **Annotation** -- temporal/action labels, object annotation, pose/keypoint, and task state labels on top of raw footage

---

### Annotation Types
Visual section -- show the 5 tiers as a progression. Each tier adds a layer on top of the previous.

| Tier | What's Included |
|---|---|
| Tier 1 | Raw narrated video -- head-mounted POV, contributor narration, QA-passed |
| Tier 2 | + Action segments + Object state change |
| Tier 3 | + HOI (Hand Object Interaction) -- frame-by-frame hand contact log |
| Tier 4 | + Phase decomposition, teleoperation demonstrations |
| Tier 5 | + Gaze data (hardware-dependent) |

Also list the annotation types individually (can be cards or a simple grid):
- **Narration** -- timestamped contributor description synchronized to video
- **Action Segments** -- verb + noun + start/end timestamps for each action
- **Object State Change** -- before/after states of objects (bolt: loose to tight)
- **HOI** -- frame-by-frame: which hand, what object, grip type, contact state
- **Gaze** -- fixation and saccade data, x/y coordinates per frame
- **Bounding Boxes** -- spatial object localization per frame
- **Keypoints** -- hand and body landmark coordinates (21-point hand model)

---

### Capabilities
Three capability items in a clean table or card layout:

| | |
|---|---|
| **Languages** | Hindi, Bengali, Odia, Tamil, Kannada, Gujarati, Punjabi, Marathi, Nepali, Bhojpuri, Assamese, Manipuri, English -- 13 languages across all major Indian regions |
| **Project Start** | Ready to begin within 1-2 weeks of project brief and sample approval |
| **Volume** | Pilot runs from 500 hours. Scale up to 10,000+ approved hours per month |

---

### Regions
Map or visual showing:
- **India** -- Active. Manufacturing environments: auto components, electronics assembly, pharma packaging
- **South America + Philippines** -- Exploring
- **SEA + Japan** -- Planned

Keep it simple -- a labeled world map or just a clean grid of regions with status badges.

---

### Partner With Us
**Heading:** Work with us
**Subtext:** If you need India-sourced physical AI training data -- as a direct buyer or as an agency partner -- fill in the form below or book a call.

**Form fields:**
- Name (text)
- Company (text)
- Email (text)
- I am a: (radio) AI company / Data agency / Other
- What I need: (dropdown) Egocentric video data / Voice and speech data / Annotation only / Not sure yet / Other
- Tell us about your project: (textarea, optional)
- [Submit] button

**Below form:**
Prefer a call? [Book a call] (links to Calendly -- Srijan to add URL, or fallback to mailto:ldrago@0xqube.xyz)

All submissions email to: ldrago@0xqube.xyz

---

### Become a Contributor
**Heading:** Contribute to the network
**Subtext:** We pay contributors to record daily tasks and activities using a head-mounted camera. Flexible hours, work from your environment.

**Form fields:**
- Name (text)
- City and state (text)
- Device: (checkboxes) iPhone 11 or newer / iPhone older than 11 / Android / Other
- Hours available per day: (dropdown) 1-2 hrs / 2-4 hrs / 4+ hrs
- How did you hear about us: (text, optional)
- Phone or email to reach you: (text)
- [Submit] button

All submissions email to: ldrago@0xqube.xyz

---

### Footer
**Left:** QUBE -- India's physical AI data collection company
**Center:** Nav links (What We Do, Annotations, Capabilities, Partner, Contribute)
**Right:** Srijan -- ldrago@0xqube.xyz -- @Srijan0x

---

## What NOT to include
- Pricing (not on website -- discuss on call)
- Traction numbers or client names (not public yet)
- KGeN / KGen mentioned anywhere -- do not name them
- AutoGTM or any outreach tool references
- "Web3" or crypto language anywhere

---

## Forms Implementation Note
Use Formspree (formspree.io) for simplest setup:
- Create two forms on Formspree (one for partner, one for contributor)
- Each form gets a Formspree endpoint URL
- On submit, Formspree emails ldrago@0xqube.xyz
- No backend needed, works with static Next.js export

---

## Existing reference
One-pager at: `C:\Users\Srijan\Qube\projects\qube-agency\qube-onepager.docx`
Copy is exact source of truth for What Are We / What We Do / How We Do It / Why Choose Us content.
