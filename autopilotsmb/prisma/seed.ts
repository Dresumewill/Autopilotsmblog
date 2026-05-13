import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin User ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "admin123!",
    12
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@autopilotsmb.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@autopilotsmb.com",
      name: "AutoPilotSMB Admin",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user: ${admin.email}`);

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "ai-tools" },
      update: {},
      create: {
        name: "AI Tools",
        slug: "ai-tools",
        description: "Reviews and guides for the best AI tools for small business",
        color: "#0066FF",
      },
    }),
    prisma.category.upsert({
      where: { slug: "automation" },
      update: {},
      create: {
        name: "Automation",
        slug: "automation",
        description: "Workflow automation strategies and tutorials",
        color: "#7C3AED",
      },
    }),
    prisma.category.upsert({
      where: { slug: "content-marketing" },
      update: {},
      create: {
        name: "Content Marketing",
        slug: "content-marketing",
        description: "AI-powered content marketing for small businesses",
        color: "#059669",
      },
    }),
    prisma.category.upsert({
      where: { slug: "productivity" },
      update: {},
      create: {
        name: "Productivity",
        slug: "productivity",
        description: "AI productivity tools and systems for entrepreneurs",
        color: "#D97706",
      },
    }),
    prisma.category.upsert({
      where: { slug: "sales-growth" },
      update: {},
      create: {
        name: "Sales & Growth",
        slug: "sales-growth",
        description: "AI strategies for growing revenue and acquiring customers",
        color: "#DC2626",
      },
    }),
  ]);

  console.log(`✅ ${categories.length} categories seeded`);

  // ── Tags ─────────────────────────────────────────────────────────────────────
  const tagData = [
    "ai tools", "automation", "small business", "solopreneur",
    "productivity", "content marketing", "seo", "chatbot",
    "no-code", "workflow", "make.com", "zapier", "marketing",
    "customer support", "video editing", "writing",
  ];

  const tags = await Promise.all(
    tagData.map((name) =>
      prisma.tag.upsert({
        where: { slug: name.replace(/\s+/g, "-").replace(/\./g, "") },
        update: {},
        create: {
          name,
          slug: name.replace(/\s+/g, "-").replace(/\./g, ""),
        },
      })
    )
  );

  console.log(`✅ ${tags.length} tags seeded`);

  // ── Sample Blog Posts ────────────────────────────────────────────────────────
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: "best-ai-tools-small-business-2025" },
      update: {},
      create: {
        title: "10 Best AI Tools for Small Business in 2025 (Free & Paid)",
        slug: "best-ai-tools-small-business-2025",
        excerpt:
          "Save 10+ hours a week with these vetted AI tools. From automating customer support to writing marketing copy in minutes.",
        content: "# Coming soon\n\nThis post content is loaded from MDX files.",
        coverImage:
          "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop",
        published: true,
        featured: true,
        publishedAt: new Date("2025-03-15"),
        views: 4721,
        authorId: admin.id,
        categoryId: categories[0].id,
        metaTitle: "10 Best AI Tools for Small Business in 2025 (Free & Paid)",
        metaDescription:
          "Discover the top AI tools that help small businesses save time, cut costs, and scale faster.",
        tags: {
          connect: [
            { slug: "ai-tools" },
            { slug: "small-business" },
            { slug: "productivity" },
          ],
        },
      },
    }),
    prisma.post.upsert({
      where: { slug: "automate-customer-support-small-business" },
      update: {},
      create: {
        title: "How to Automate Customer Support Without Losing the Human Touch",
        slug: "automate-customer-support-small-business",
        excerpt:
          "Learn the exact workflow to automate 70% of your customer support using AI — while keeping customers happy.",
        content: "# Coming soon\n\nThis post content is loaded from MDX files.",
        coverImage:
          "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=630&fit=crop",
        published: true,
        featured: false,
        publishedAt: new Date("2025-03-22"),
        views: 2893,
        authorId: admin.id,
        categoryId: categories[1].id,
        metaTitle:
          "Automate Customer Support for Small Business (Without Losing the Human Touch)",
        metaDescription:
          "Step-by-step guide to automating 70% of your customer support with AI tools.",
        tags: {
          connect: [
            { slug: "automation" },
            { slug: "customer-support" },
            { slug: "chatbot" },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ ${posts.length} sample posts seeded`);

  // ── AI Tools ────────────────────────────────────────────────────────────────
  const tools = await Promise.all([
    prisma.tool.upsert({
      where: { slug: "claude-ai" },
      update: {},
      create: {
        name: "Claude",
        slug: "claude-ai",
        tagline: "AI assistant for writing, analysis, and coding",
        description:
          "Anthropic's AI assistant — best for writing, analysis, strategy, and coding. The top choice for small business owners.",
        website: "https://claude.ai",
        pricing: "FREEMIUM",
        priceFrom: 0,
        pricePro: 20,
        categoryLabel: "AI Assistant",
        rating: 4.9,
        published: true,
        featured: true,
        affiliateLinks: {
          create: {
            name: "Claude Pro",
            url: "https://claude.ai",
            clicks: 0,
          },
        },
      },
    }),
    prisma.tool.upsert({
      where: { slug: "make-automation" },
      update: {},
      create: {
        name: "Make",
        slug: "make-automation",
        tagline: "Visual automation platform connecting 1,500+ apps",
        description:
          "The most powerful visual automation platform for growing businesses. Connect 1,500+ apps without code.",
        website: "https://make.com",
        pricing: "FREEMIUM",
        priceFrom: 0,
        pricePro: 9,
        categoryLabel: "Automation",
        rating: 4.7,
        published: true,
        featured: true,
        affiliateLinks: {
          create: {
            name: "Make Core Plan",
            url: "https://make.com",
            clicks: 0,
          },
        },
      },
    }),
    prisma.tool.upsert({
      where: { slug: "surfer-seo" },
      update: {},
      create: {
        name: "Surfer SEO",
        slug: "surfer-seo",
        tagline: "Data-driven SEO content optimization for Google rankings",
        description:
          "Data-driven content optimization tool that helps small businesses create content that ranks on Google.",
        website: "https://surferseo.com",
        pricing: "PAID",
        priceFrom: 89,
        pricePro: 129,
        categoryLabel: "SEO",
        rating: 4.6,
        published: true,
        featured: false,
      },
    }),
  ]);

  console.log(`✅ ${tools.length} AI tools seeded`);

  // ── Digital Products ─────────────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: "product-automation-kit" },
      update: {},
      create: {
        id: "product-automation-kit",
        slug: "ai-automation-toolkit",
        name: "Small Business AI Automation Toolkit",
        description:
          "15 ready-to-import Make.com scenario templates for the most common small business workflows. Save 20+ hours setting up automation.",
        type: "TOOLKIT",
        price: 2700, // $27.00
        currency: "usd",
        published: true,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "product-content-playbook" },
      update: {},
      create: {
        id: "product-content-playbook",
        slug: "ai-content-marketing-playbook",
        name: "AI Content Marketing Playbook",
        description:
          "The complete system for producing 30 pieces of content per month with AI tools. Includes templates, prompts, and a 90-day calendar.",
        type: "EBOOK",
        price: 1700, // $17.00
        currency: "usd",
        published: true,
        featured: false,
      },
    }),
    prisma.product.upsert({
      where: { id: "product-sop-templates" },
      update: {},
      create: {
        id: "product-sop-templates",
        slug: "ai-sop-template-pack",
        name: "AI SOP Template Pack (25 Templates)",
        description:
          "25 ready-to-customize Standard Operating Procedure templates for common small business processes. Built for use with Claude and Notion.",
        type: "TEMPLATE",
        price: 1200, // $12.00
        currency: "usd",
        published: true,
        featured: false,
      },
    }),
  ]);

  console.log(`✅ ${products.length} products seeded`);

  console.log("\n🎉 Database seeded successfully!");
  console.log(`\n📧 Admin login: ${admin.email}`);
  console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD ?? "admin123!"}`);
  console.log("\n⚠️  Change the admin password immediately after first login!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
