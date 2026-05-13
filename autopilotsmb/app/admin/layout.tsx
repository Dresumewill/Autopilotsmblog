// app/admin/layout.tsx
// Admin layout — checks auth, renders sidebar navigation

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard, FileText, Package, Link2,
  BarChart2, Settings, LogOut, Zap, Users,
} from "lucide-react";

const adminNav = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/posts", icon: FileText, label: "Blog Posts" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/tools", icon: Zap, label: "AI Tools" },
  { href: "/admin/subscribers", icon: Users, label: "Subscribers" },
  { href: "/admin/affiliates", icon: Link2, label: "Affiliate Links" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B]">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#111113] border-r border-zinc-800 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-zinc-800">
          <div className="w-7 h-7 bg-blue-electric rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">AutoPilotSMB</span>
            <span className="text-[10px] text-zinc-600 block">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-blue-electric/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-electric">
                {session.user.name?.[0] || session.user.email?.[0] || "A"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-300 truncate">
                {session.user.name || "Admin"}
              </p>
              <p className="text-[10px] text-zinc-600 truncate">{session.user.email}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
