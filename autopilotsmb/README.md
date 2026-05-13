# AutoPilotSMB — AI Tools & Automation Publication Platform

A production-grade Next.js 15 blog platform built for the **AI Tools & Automation for Small Businesses** niche.

> Built to rank, monetize, and scale. Everything a real startup-grade AI publication needs.

---

## 🚀 Features

- **MDX Blog Engine** — Full-featured blog with syntax highlighting, TOC, reading time, tags, categories
- **Admin Dashboard** — Create, edit, publish posts; manage products and affiliate links
- **AI Tool Directory** — Searchable directory with pricing labels, ratings, and affiliate CTAs
- **Digital Products** — Stripe-powered checkout for eBooks, templates, courses, and toolkits
- **Newsletter** — Lead capture with API-ready integration to your ESP
- **SEO-Ready** — Metadata, JSON-LD schemas, XML sitemap, robots.txt, canonical URLs
- **AdSense-Ready** — Ad slot components pre-placed throughout the site
- **Affiliate Tracking** — Click tracking with database logging for all affiliate links
- **Responsive** — Mobile-first design that looks great on every device

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | Auth.js v5 (NextAuth) |
| Blog | MDX (next-mdx-remote) |
| Payments | Stripe |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📦 Installation

### Prerequisites

- Node.js 18.17+ (or 20+)
- PostgreSQL database (local or [Neon](https://neon.tech) for free cloud)
- Stripe account (for payments)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/autopilotsmb.git
cd autopilotsmb
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Fill in your `.env` file:

```env
# Database (get a free PostgreSQL from https://neon.tech)
DATABASE_URL="postgresql://username:password@host/autopilotsmb"

# Auth (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="AutoPilotSMB"

# Admin credentials (used by seed script)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="change-me-immediately!"

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# AdSense (optional)
NEXT_PUBLIC_ADSENSE_ID="ca-pub-XXXXXXXXXX"
```

### 3. Database Setup

```bash
# Push schema to database
npx prisma db push

# Seed with sample data
npx prisma db seed

# (Optional) Open Prisma Studio to browse data
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
- **Blog**: http://localhost:3000/blog
- **Tools**: http://localhost:3000/tools

---

## 🔐 Admin Access

After running the seed script:

1. Go to `/admin/login`
2. Login with the email and password from your `.env` file
3. **Immediately change your password** in the admin settings

Default credentials if not set in env:
- Email: `admin@autopilotsmb.com`
- Password: `admin123!`

---

## 📝 Adding Blog Content

### Method 1: MDX Files (Static)

Create `.mdx` files in `content/posts/`:

```mdx
---
title: "Your Post Title"
slug: "your-post-slug"
excerpt: "Brief description for SEO and cards"
coverImage: "https://your-image-url.com/image.jpg"
publishedAt: "2025-01-15"
featured: false
category: "AI Tools"
tags: ["ai", "tools", "small-business"]
author: "AutoPilotSMB"
metaTitle: "SEO Title (max 70 chars)"
metaDescription: "SEO description (max 160 chars)"
readingTime: 8
---

Your content here in Markdown/MDX...
```

### Method 2: Admin Dashboard (Dynamic)

1. Go to `/admin/posts`
2. Click "New Post"
3. Fill in the form and publish

---

## 🔄 Prisma Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply a migration
npx prisma migrate dev --name "your-migration-name"

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open database browser
npx prisma studio
```

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/autopilotsmb.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Add all environment variables from your `.env` file
3. Set `NEXTAUTH_URL` to your Vercel domain (e.g., `https://autopilotsmb.com`)
4. Deploy!

### 3. Database for Production

Use [Neon](https://neon.tech) (free PostgreSQL) or [Supabase](https://supabase.com):

```bash
# After getting your production DATABASE_URL, run:
npx prisma migrate deploy
npx prisma db seed
```

### 4. Stripe Webhook

In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://yourdomain.com/api/stripe`
- Events: `checkout.session.completed`, `payment_intent.succeeded`
- Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5. Custom Domain

In Vercel project settings → Domains → Add your domain, then update DNS records.

---

## 💰 Monetization Strategy

This platform supports 4 revenue streams:

### 1. Affiliate Marketing (Highest ROI to Start)

**Target programs:**
| Tool | Commission | Program |
|------|-----------|---------|
| Make.com | 20% recurring | [Apply here](https://www.make.com/en/affiliate) |
| Surfer SEO | 25% recurring | [Partner portal](https://surferseo.com/partners/) |
| Jasper | 30% recurring | [Jasper partners](https://jasper.ai/affiliates) |
| Tidio | 30% recurring | [Tidio affiliate](https://www.tidio.com/affiliate/) |
| Canva | $36/signup | [Canva affiliates](https://www.canva.com/affiliates/) |

**How to set up in AutoPilotSMB:**
1. Go to `/admin` → create affiliate links
2. Add links to tool pages using `<AffiliateBox>` component
3. Track clicks in the affiliate analytics dashboard

**Revenue projection**: 100 monthly clicks × 5% conversion × $30 avg commission = **$150/month** per tool

### 2. Google AdSense

1. Apply at [adsense.google.com](https://adsense.google.com)
2. Add your publisher ID to `NEXT_PUBLIC_ADSENSE_ID`
3. Ad slots are pre-placed in blog posts, tool listings, and sidebar

**Revenue projection**: 10,000 monthly page views × $5 RPM = **$50/month** to start

### 3. Digital Products (Stripe)

Current products in seed data:
- **AI Automation Toolkit**: $27 (Make.com templates)
- **Content Marketing Playbook**: $17 (AI content system)
- **SOP Template Pack**: $12 (25 templates)

**How to add products:**
1. Create product in [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Copy Product ID and Price ID
3. Add in `/admin/products`

**Revenue projection**: 1,000 visitors/month × 0.5% conversion × $20 avg = **$100/month**

### 4. Newsletter (Long-Term Asset)

Every visitor you capture to email is worth ~$1–2/month in future revenue.

Connect your ESP:
- **ConvertKit**: Add API key to `.env` → trigger sequences from `api/newsletter/subscribe`
- **Mailchimp**: Use their API in the subscribe handler
- **Beehiiv**: Growing option for content businesses

**Revenue projection**: 500 subscribers × $1.50/subscriber/month = **$750/month**

### 30-Day Growth Plan

| Week | Focus | Target |
|------|-------|--------|
| 1 | Launch site, publish 5 posts | 0 → live |
| 2 | Apply to affiliate programs | 3-5 approvals |
| 3 | Start email list, push to social | 50+ subscribers |
| 4 | Publish 5 more posts, SEO optimize | First rankings |

---

## 🔒 Security Notes

- All admin routes are protected by session middleware
- API routes validate authentication before mutations
- Environment variables are never exposed to the client (check `NEXT_PUBLIC_` prefix)
- Stripe webhooks verify signatures before processing
- Rate limiting is implemented on the newsletter endpoint
- For production: add Redis-based rate limiting (Upstash is excellent + free tier)

---

## 📊 Performance

The platform is optimized for:
- **LCP**: Images use `next/image` with proper sizing
- **CLS**: Layout stabilized with proper aspect ratios
- **FID/INP**: Minimal client-side JS; server components by default
- **TTFB**: Static generation for blog posts; ISR for dynamic content

Run a Lighthouse check:
```bash
npm run build
npx lighthouse http://localhost:3000 --output=json
```

---

## 🧱 Project Structure

```
autopilotsmb/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── blog/          # Blog listing + post pages
│   │   ├── tools/         # AI tool directory
│   │   ├── resources/     # Digital products page
│   │   ├── about/         # About page
│   │   └── contact/       # Contact form
│   ├── admin/             # Password-protected admin
│   │   ├── dashboard/     # Analytics overview
│   │   ├── posts/         # Post management
│   │   └── products/      # Product management
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout with fonts/GA
│   ├── globals.css        # Global styles + CSS vars
│   ├── sitemap.ts         # Dynamic XML sitemap
│   └── robots.ts          # robots.txt
├── components/            # Shared UI components
├── content/
│   ├── posts/             # MDX blog posts
│   └── tools/             # MDX tool profiles
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # Auth.js configuration
│   ├── seo.ts             # SEO utilities + schemas
│   └── affiliate.ts       # Affiliate tracking utilities
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample data seeder
└── .env.example           # Environment variable template
```

---

## 🤝 Contributing

This is a template project. Fork it, customize it, make it yours.

---

## 📄 License

MIT — use it however you want.

---

Built with ❤️ for the small business AI community.
