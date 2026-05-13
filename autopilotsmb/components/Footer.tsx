// components/Footer.tsx
// Full-featured footer with links, newsletter, and trust signals

import Link from "next/link";
import { Zap, Twitter, Linkedin, Youtube, Mail } from "lucide-react";
import { siteConfig } from "@/lib/seo";

const footerLinks = {
  Content: [
    { label: "Blog", href: "/blog" },
    { label: "AI Tools Directory", href: "/tools" },
    { label: "Resources", href: "/resources" },
    { label: "Newsletter", href: "#newsletter" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Advertise", href: "/contact#advertise" },
    { label: "Affiliate Program", href: "/contact#affiliate" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclosure", href: "/disclosure" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  Categories: [
    { label: "AI Automation", href: "/blog?category=ai-automation" },
    { label: "Content AI", href: "/blog?category=content-ai" },
    { label: "Marketing Tools", href: "/blog?category=marketing-ai" },
    { label: "Productivity", href: "/blog?category=productivity" },
  ],
};

const socials = [
  { icon: Twitter, href: "https://twitter.com/AutoPilotSMB", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/autopilotsmb", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@autopilotsmb", label: "YouTube" },
  { icon: Mail, href: "mailto:hello@autopilotsmb.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0B] border-t border-zinc-800/60">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-8 h-8 bg-blue-electric rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                AutoPilot<span className="text-blue-electric">SMB</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-xs">
              The #1 resource for AI tools, automation strategies, and
              productivity systems for small businesses and solopreneurs.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all duration-150"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-zinc-600 text-xs">
            <span className="text-zinc-500">Disclosure:</span> Some links are
            affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
