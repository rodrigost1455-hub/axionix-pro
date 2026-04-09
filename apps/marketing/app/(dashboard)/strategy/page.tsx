"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Target, Zap, BarChart3, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface ContentPlanItem {
  day: string;
  type: string;
  idea: string;
  hook: string;
  cta: string;
}

interface StrategyResult {
  strategy: string;
  channels: string[];
  kpis: string[];
  content_plan: ContentPlanItem[];
  quick_wins: string[];
}

export default function StrategyPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [error, setError] = useState("");
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  async function generateStrategy() {
    setLoading(true);
    setError("");

    try {
      // Get business data from /api/auth/me
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json() as {
        success: boolean;
        data?: { business?: { type: string; objective: string; level: string; niche?: string; description?: string } };
      };

      const business = meData.data?.business;
      if (!business) {
        setError("Completa tu perfil de negocio primero.");
        return;
      }

      const res = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_negocio: business.type,
          objetivo: business.objective,
          nivel_actual: business.level,
          niche: business.niche,
          description: business.description,
        }),
      });

      const data = await res.json() as { success: boolean; error?: string; data?: StrategyResult };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Error al generar la estrategia");
        return;
      }

      setResult(data.data ?? null);
      setExpandedDay(0);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function copyStrategy() {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Estrategia de Marketing</h1>
          <p className="text-slate-400 text-sm">
            Tu agente de marketing IA genera un plan completo y específico para tu negocio
          </p>
        </div>
        {result && (
          <button
            onClick={copyStrategy}
            className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-slate-300 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        )}
      </div>

      {/* Generate Button */}
      {!result && (
        <div className="bg-gradient-to-br from-indigo-600/10 to-violet-600/5 border border-indigo-500/20 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-5">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Genera tu estrategia completa</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            Canales recomendados, plan de contenido de 7 días, KPIs y acciones rápidas.
            Todo personalizado para tu negocio.
          </p>
          <button
            onClick={generateStrategy}
            disabled={loading}
            className="inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Generando tu estrategia...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generar Estrategia con IA
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400 flex items-center gap-2">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Strategy */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Estrategia Principal</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{result.strategy}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Channels */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-semibold text-white">Canales Recomendados</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.channels?.map((ch, i) => (
                  <span key={i} className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium px-3 py-1.5 rounded-lg">
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <h2 className="text-base font-semibold text-white">KPIs a Medir</h2>
              </div>
              <ul className="space-y-2">
                {result.kpis?.map((kpi, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                    {kpi}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Wins */}
          {result.quick_wins?.length > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Quick Wins — Esta Semana</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.quick_wins.map((win, i) => (
                  <div key={i} className="bg-emerald-500/10 border border-emerald-500/15 rounded-xl px-4 py-3 text-sm text-emerald-300">
                    <span className="text-emerald-500 font-bold mr-2">{i + 1}.</span>
                    {win}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Plan */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">Plan de Contenido — 7 Días</h2>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {result.content_plan?.map((item, i) => (
                <div key={i} className="group">
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors text-left"
                    onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <span className="text-indigo-400 text-xs font-bold">{i + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{item.day}</p>
                        <span className="inline-block text-xs bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-md mt-0.5">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm flex-1 text-right truncate hidden md:block">{item.idea}</p>
                    {expandedDay === i ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {expandedDay === i && (
                    <div className="px-6 pb-5 animate-fade-in">
                      <div className="bg-white/[0.03] rounded-xl p-4 space-y-3.5">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Idea</p>
                          <p className="text-slate-200 text-sm">{item.idea}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hook (apertura)</p>
                          <p className="text-indigo-300 text-sm font-medium italic">&ldquo;{item.hook}&rdquo;</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">CTA</p>
                          <p className="text-emerald-300 text-sm">{item.cta}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Regenerate */}
          <div className="flex justify-center">
            <button
              onClick={generateStrategy}
              disabled={loading}
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-slate-300 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Generando..." : "Generar nueva estrategia"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
