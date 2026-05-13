// components/Header.tsx
// Main navigation header — sticky, blurred, responsive
// Uses client component for mobile menu state

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Wrench,
  Users,
  FileText,
} from "lucide-react";

const navLinks = [
  {
    label: "Blog",
    href: "/blog",
    icon: BookOpen,
    children: [
      { label: "All Posts", href: "/blog", desc: "Browse all articles" },
      {
        label: "AI Automation",
        href: "/blog?category=ai-automation",
        desc: "Automate your business",
      },
      {
        label: "Productivity",
        href: "/blog?category=productivity",
        desc: "Work smarter, not harder",
      },
      {
        label: "Marketing AI",
        href: "/blog?category=marketing-ai",
        desc: "AI-powered marketing",
      },
    ],
  },
  {
    label: "AI Tools",
    href: "/tools",
    icon: Wrench,
    children: [
      { label: "All Tools", href: "/tools", desc: "Browse tool directory" },
      {
        label: "Writing",
        href: "/tools?category=writing",
        desc: "AI writing assistants",
      },
      {
        label: "Automation",
        href: "/tools?category=automation",
        desc: "Workflow automation",
      },
      {
        label: "Analytics",
        href: "/tools?category=analytics",
        desc: "Data & insights",
      },
    ],
  },
  { label: "Resources", href: "/resources", icon: FileText },
  { label: "About", href: "/about", icon: Users },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-blur" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="w-8 h-8 bg-blue-electric rounded-lg flex items-center justify-center group-hover:glow-blue transition-all duration-300">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              AutoPilot<span className="text-blue-electric">SMB</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    pathname === link.href ||
                    pathname?.startsWith(link.href + "/")
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        activeDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {link.children && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-[#111113] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="p-1.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-sm font-medium text-zinc-200 group-hover:text-white">
                            {child.label}
                          </span>
                          <span className="text-xs text-zinc-500 mt-0.5">
                            {child.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/resources"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Free Resources
            </Link>
            <Link
              href="/blog"
              className="btn-primary text-sm py-2 px-4"
            >
              Start Reading
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-[#111113] border-t border-zinc-800 animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>

                {link.children && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-zinc-800 pl-4">
                    {link.children.slice(1).map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-zinc-800">
              <Link href="/blog" className="btn-primary w-full justify-center">
                Start Reading
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
