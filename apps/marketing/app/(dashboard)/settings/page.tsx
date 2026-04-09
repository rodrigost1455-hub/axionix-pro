import { redirect } from "next/navigation";
import { getCurrentUser, getMonthlyUsage } from "@/lib/auth";
import { getPlan, PLANS } from "@axionix/core";
import type { Plan } from "@axionix/core";
import { Check, Zap, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const usage = await getMonthlyUsage(user.id);
  const currentPlan = getPlan(user.plan as Plan);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Configuración</h1>
        <p className="text-slate-400 text-sm">Gestiona tu cuenta y plan</p>
      </div>

      {/* Account */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Información de cuenta</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Nombre</p>
            <p className="text-white text-sm">{user.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Email</p>
            <p className="text-white text-sm">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Plan actual</p>
            <p className="text-indigo-400 text-sm font-semibold">{currentPlan.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Miembro desde</p>
            <p className="text-white text-sm">{new Date(user.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Uso este mes</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Generaciones de texto", used: usage.textCount, limit: currentPlan.limits.textGenerations },
            { label: "Imágenes IA", used: usage.imageCount, limit: currentPlan.limits.imageGenerations },
            { label: "Videos IA", used: usage.videoCount, limit: currentPlan.limits.videoGenerations },
          ].map((item) => {
            const pct = item.limit > 0 ? Math.min(Math.round((item.used / item.limit) * 100), 100) : 0;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-xs font-semibold text-white">
                    {item.limit === 0 ? "No incluido" : `${item.used}/${item.limit}`}
                  </p>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-indigo-500"
                    }`}
                    style={{ width: item.limit === 0 ? "0%" : `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-base font-semibold text-white mb-5">Planes disponibles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(PLANS).map((plan) => {
            const isCurrentPlan = plan.id === user.plan;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-5 flex flex-col ${
                  isCurrentPlan
                    ? "bg-indigo-600/10 border border-indigo-500/40"
                    : "bg-white/[0.03] border border-white/[0.08]"
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-2.5 left-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    ACTUAL
                  </div>
                )}
                <h3 className="font-bold text-white mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-500 text-xs">/mes</span>
                </div>
                <ul className="space-y-2 flex-1 mb-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrentPlan ? (
                  <div className="text-center text-xs font-semibold text-indigo-400 py-2">Plan activo</div>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-1.5 bg-white/[0.05] border border-white/[0.10] text-slate-400 text-xs font-semibold py-2.5 rounded-xl cursor-not-allowed"
                  >
                    <Lock className="w-3 h-3" />
                    Próximamente
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-slate-600 text-xs mt-4 text-center flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          Los pagos con Stripe estarán disponibles próximamente. Contacta soporte para actualizar tu plan.
        </p>
      </div>
    </div>
  );
}
