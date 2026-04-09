"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard, Sparkles, Calendar, FileText, Settings,
  LogOut, Zap, TrendingUp, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/strategy", label: "Estrategia", icon: TrendingUp },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/content", label: "Contenido", icon: FileText },
  { href: "/settings", label: "Configuración", icon: Settings },
];

const PLAN_COLORS: Record<string, string> = {
  FREE: "text-slate-400",
  BASIC: "text-cyan-400",
  PRO: "text-indigo-400",
  PREMIUM: "text-amber-400",
};

interface SidebarNavProps {
  user: { name: string; email: string; plan: string };
  usage: { text: number; textLimit: number; image: number; imageLimit: number };
}

export function SidebarNav({ user, usage }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const textPct = Math.min((usage.text / Math.max(usage.textLimit, 1)) * 100, 100);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#090915] border-r border-white/[0.07] flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">Axionix</p>
            <p className="text-xs text-indigo-400 font-medium leading-tight">Marketing</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <Icon className={clsx("w-4 h-4 shrink-0 transition-colors", active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Usage */}
      <div className="px-4 py-4 border-t border-white/[0.07]">
        <div className="bg-white/[0.04] rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Generaciones</span>
            <span className="text-xs font-semibold text-white">{usage.text}/{usage.textLimit}</span>
          </div>
          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${textPct}%` }}
            />
          </div>
          {textPct >= 90 && (
            <p className="text-xs text-amber-400 mt-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Casi en el límite
            </p>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className={clsx("text-xs font-semibold", PLAN_COLORS[user.plan] ?? "text-slate-400")}>
              Plan {user.plan}
            </p>
          </div>
        </div>

        {user.plan === "FREE" && (
          <Link
            href="/settings"
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold py-2 rounded-xl transition-all mb-2"
          >
            <Zap className="w-3 h-3" />
            Mejorar Plan
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-400 text-xs font-medium rounded-xl hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
