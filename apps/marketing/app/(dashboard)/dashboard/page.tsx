import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getMonthlyUsage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@axionix/core";
import type { Plan } from "@axionix/core";
import {
  TrendingUp, FileText, Calendar, Zap, ArrowRight,
  Sparkles, Clock, BarChart3,
} from "lucide-react";

export const dynamic = "force-dynamic";

const OBJECTIVES_LABEL: Record<string, string> = {
  sales: "Ventas",
  branding: "Branding",
  followers: "Seguidores",
  traffic: "Tráfico web",
  engagement: "Engagement",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.business) redirect("/onboarding");

  const [usage, recentGenerations] = await Promise.all([
    getMonthlyUsage(user.id),
    prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const planConfig = getPlan(user.plan as Plan);
  const textPct = Math.min(Math.round((usage.textCount / planConfig.limits.textGenerations) * 100), 100);
  const now = new Date();
  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const today = dayNames[now.getDay()];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">
            {today}, {now.toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Hola, {user.name?.split(" ")[0] ?? "aquí"} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {user.business.type} · Objetivo: {OBJECTIVES_LABEL[user.business.objective] ?? user.business.objective}
          </p>
        </div>
        <Link
          href="/strategy"
          className="hidden md:inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          <Sparkles className="w-4 h-4" />
          Generar Estrategia
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Generaciones usadas",
            value: `${usage.textCount}/${planConfig.limits.textGenerations}`,
            sub: `${textPct}% del plan`,
            icon: <Zap className="w-4 h-4 text-indigo-400" />,
            color: "indigo",
          },
          {
            label: "Total generaciones",
            value: recentGenerations.length,
            sub: "Este mes",
            icon: <BarChart3 className="w-4 h-4 text-violet-400" />,
            color: "violet",
          },
          {
            label: "Plan actual",
            value: user.plan,
            sub: `$${planConfig.price}/mes`,
            icon: <TrendingUp className="w-4 h-4 text-cyan-400" />,
            color: "cyan",
          },
          {
            label: "Imágenes IA",
            value: `${usage.imageCount}/${planConfig.limits.imageGenerations}`,
            sub: planConfig.limits.imageGenerations === 0 ? "Requiere plan Pro" : "disponibles",
            icon: <Sparkles className="w-4 h-4 text-amber-400" />,
            color: "amber",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Acciones rápidas</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              href: "/strategy",
              title: "Nueva Estrategia",
              desc: "Genera tu plan de marketing completo con IA",
              icon: <TrendingUp className="w-5 h-5 text-indigo-400" />,
              bg: "from-indigo-600/10 to-violet-600/5",
              border: "border-indigo-500/20",
            },
            {
              href: "/calendar",
              title: "Ver Calendario",
              desc: "Consulta tu plan de contenido para hoy",
              icon: <Calendar className="w-5 h-5 text-cyan-400" />,
              bg: "from-cyan-600/10 to-indigo-600/5",
              border: "border-cyan-500/20",
            },
            {
              href: "/content",
              title: "Crear Contenido",
              desc: "Genera copies y scripts al instante",
              icon: <FileText className="w-5 h-5 text-violet-400" />,
              bg: "from-violet-600/10 to-pink-600/5",
              border: "border-violet-500/20",
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group bg-gradient-to-br ${action.bg} border ${action.border} rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <h3 className="font-semibold text-white mb-1">{action.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{action.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">
                Ir ahora <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Generations */}
      {recentGenerations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Generaciones recientes</h2>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
            {recentGenerations.map((gen, i) => {
              const output = gen.output as Record<string, unknown>;
              const preview =
                typeof output.strategy === "string"
                  ? output.strategy.slice(0, 120) + "..."
                  : typeof output.copy === "string"
                  ? output.copy.slice(0, 120) + "..."
                  : "Generación completada";

              const typeConfig: Record<string, { label: string; color: string }> = {
                STRATEGY: { label: "Estrategia", color: "text-indigo-400 bg-indigo-500/10" },
                CONTENT: { label: "Contenido", color: "text-violet-400 bg-violet-500/10" },
                IMAGE: { label: "Imagen", color: "text-amber-400 bg-amber-500/10" },
                VIDEO: { label: "Video", color: "text-cyan-400 bg-cyan-500/10" },
              };
              const tc = typeConfig[gen.type] ?? { label: gen.type, color: "text-slate-400 bg-slate-500/10" };

              return (
                <div
                  key={gen.id}
                  className={`px-5 py-4 flex items-start gap-4 ${i < recentGenerations.length - 1 ? "border-b border-white/[0.05]" : ""}`}
                >
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg ${tc.color}`}>
                    {tc.label}
                  </span>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1 truncate">{preview}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-600 shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(gen.createdAt).toLocaleDateString("es-ES")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upgrade Banner */}
      {user.plan === "FREE" && (
        <div className="bg-gradient-to-r from-indigo-600/15 to-violet-600/10 border border-indigo-500/25 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white mb-1">¿Listo para más?</h3>
            <p className="text-slate-400 text-sm">Mejora a Pro y obtén 60 generaciones + imágenes IA por $49/mes.</p>
          </div>
          <Link
            href="/settings"
            className="shrink-0 ml-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            <Zap className="w-4 h-4" />
            Mejorar ahora
          </Link>
        </div>
      )}
    </div>
  );
}
