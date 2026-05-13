// app/(public)/contact/page.tsx

"use client";

import { useState } from "react";
import { Mail, MessageSquare, DollarSign, Wrench, Send, Check } from "lucide-react";

const contactReasons = [
  { value: "general", label: "General Inquiry" },
  { value: "advertise", label: "Advertise / Sponsorship" },
  { value: "affiliate", label: "Affiliate Program" },
  { value: "guest-post", label: "Guest Post Pitch" },
  { value: "tool-submission", label: "Submit AI Tool for Review" },
  { value: "feedback", label: "Feedback" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "general",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // In production: POST to /api/contact endpoint
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="badge badge-blue mb-4">Get in Touch</div>
        <h1 className="text-4xl font-bold font-display text-white mb-4">Contact Us</h1>
        <p className="text-zinc-400 text-lg">
          Have a question, partnership idea, or want to submit your tool for review?
          We read every message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { icon: DollarSign, title: "Advertising", desc: "Reach 50,000+ small business owners with targeted placements.", id: "advertise" },
          { icon: Wrench, title: "Tool Reviews", desc: "Submit your AI tool for an honest, in-depth review.", id: "tool-submission" },
          { icon: MessageSquare, title: "Guest Posts", desc: "Share your expertise with our audience of entrepreneurs.", id: "guest-post" },
        ].map((item) => (
          <div key={item.id} className="card p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-electric/15 border border-blue-electric/25 flex items-center justify-center mx-auto mb-3">
              <item.icon className="w-5 h-5 text-blue-electric" />
            </div>
            <h3 className="font-bold text-white mb-1.5">{item.title}</h3>
            <p className="text-xs text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="card p-8">
        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-zinc-400">We'll get back to you within 1-2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-electric transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-electric transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Reason *</label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-electric transition-colors"
              >
                {contactReasons.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-electric transition-colors resize-none"
                placeholder="Tell us more..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full justify-center"
            >
              {status === "loading" ? "Sending..." : (
                <>
                  Send Message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-zinc-500 text-sm">
          Or email us directly at{" "}
          <a href="mailto:hello@autopilotsmb.com" className="text-blue-electric hover:underline">
            hello@autopilotsmb.com
          </a>
        </p>
      </div>
    </div>
  );
}
