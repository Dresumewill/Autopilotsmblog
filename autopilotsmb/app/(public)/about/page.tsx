// app/(public)/about/page.tsx

import { buildMetadata } from "@/lib/seo";
import { NewsletterCTA } from "@/components/CTA";
import { Users, Target, Zap, Award, BookOpen, Wrench } from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "About AutoPilotSMB",
  description: "Learn about AutoPilotSMB — the #1 resource for AI tools and automation strategies for small businesses.",
  slug: "about",
});

const stats = [
  { value: "200+", label: "AI Tools Reviewed" },
  { value: "50k+", label: "Monthly Readers" },
  { value: "12k+", label: "Newsletter Subscribers" },
  { value: "3 yrs", label: "Of Research" },
];

const team = [
  { name: "Alex Rivera", role: "Founder & Editor-in-Chief", bio: "Former software engineer who discovered AI automation could replace 60% of manual work. Now helps small businesses do the same." },
  { name: "Jordan Lee", role: "AI Tools Reviewer", bio: "Has tested 500+ AI tools across marketing, productivity, and automation. Only recommends what actually works." },
  { name: "Sam Chen", role: "Automation Strategist", bio: "Built automated systems for 100+ small businesses. Specializes in no-code workflows and AI integrations." },
];

const values = [
  { icon: Target, title: "Honest Reviews", desc: "We test every tool ourselves. We only recommend what we'd use in our own business." },
  { icon: Users, title: "SMB-First", desc: "Every guide is written for small business owners, not enterprise teams with unlimited budgets." },
  { icon: Zap, title: "Actionable Advice", desc: "No theory. Every article includes step-by-step instructions you can implement today." },
  { icon: Award, title: "Independent", desc: "Affiliate links fund us, but never influence our ratings. Honest scores, always." },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="badge badge-blue mb-4">Our Mission</div>
        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-5 leading-tight">
          We Help Small Businesses<br />Run on Autopilot
        </h1>
        <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl mx-auto">
          AutoPilotSMB was built for entrepreneurs who want to leverage AI and
          automation — without wasting months testing tools that don't work.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6 text-center">
            <p className="text-4xl font-bold font-display text-white mb-1">{stat.value}</p>
            <p className="text-sm text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold font-display text-white mb-6">Our Story</h2>
        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed space-y-4">
          <p>
            AutoPilotSMB started in 2022 when our founder, Alex Rivera, realized that the AI
            revolution wasn't being translated for the people who needed it most — small business
            owners juggling every role with limited time and budget.
          </p>
          <p>
            After spending six months testing hundreds of AI tools and building automation
            workflows for his own consulting business, Alex began sharing what actually worked
            in a simple newsletter. Within a year, 12,000 entrepreneurs were subscribed.
          </p>
          <p>
            Today, AutoPilotSMB is the destination for small business owners who want to use AI
            strategically — not chase every new tool. We publish weekly guides, in-depth reviews,
            and practical automation tutorials written by practitioners, not journalists.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold font-display text-white mb-6">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <div key={v.title} className="card card-glow p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-electric/15 border border-blue-electric/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <v.icon className="w-5 h-5 text-blue-electric" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1.5">{v.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold font-display text-white mb-6">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {team.map((member) => (
            <div key={member.name} className="card p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-electric/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-electric">{member.name[0]}</span>
              </div>
              <h3 className="font-bold text-white mb-0.5">{member.name}</h3>
              <p className="text-xs text-blue-electric mb-3 font-semibold">{member.role}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclosure */}
      <div className="card p-6 bg-zinc-900/50 mb-12">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-electric" />
          Affiliate Disclosure
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed">
          AutoPilotSMB participates in affiliate marketing programs. Some links on this site
          may earn us a commission at no additional cost to you. This never influences our
          editorial ratings or recommendations — we only promote tools we've tested and
          genuinely believe in.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Link href="/blog" className="btn-primary justify-center flex">
          <BookOpen className="w-4 h-4" />
          Read Free Guides
        </Link>
        <Link href="/tools" className="btn-secondary justify-center flex">
          <Wrench className="w-4 h-4" />
          Browse AI Tools
        </Link>
      </div>

      <NewsletterCTA source="about-page" />
    </div>
  );
}
