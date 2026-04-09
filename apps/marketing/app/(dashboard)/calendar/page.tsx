"use client";

import { useState } from "react";
import { Calendar, Sparkles, FileText, RefreshCw, Copy, Check } from "lucide-react";

interface CalendarItem {
  day: string;
  type: string;
  idea: string;
  hook: string;
  cta: string;
}

interface GeneratedContent {
  copy: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  script: string;
}

export default function CalendarPage() {
  const [calendar, setCalendar] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatingIdx, setGeneratingIdx] = useState<number | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<number, GeneratedContent>>({});
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  async function loadCalendar() {
    setLoading(true);
    setError("");

    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json() as {
        data?: { business?: { type: string; objective: string; level: string; niche?: string; description?: string } };
      };
      const business = meData.data?.business;
      if (!business) { setError("Completa tu perfil primero."); return; }

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

      const data = await res.json() as {
        success: boolean;
        error?: string;
        data?: { content_plan: CalendarItem[] };
      };

      if (!res.ok || !data.success) { setError(data.error ?? "Error al cargar"); return; }
      setCalendar(data.data?.content_plan ?? []);
      setGeneratedContent({});
      setActiveItem(null);
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function generateForItem(idx: number, item: CalendarItem) {
    setGeneratingIdx(idx);
    setActiveItem(idx);

    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json() as { data?: { business?: { type: string } } };
      const businessType = meData.data?.business?.type ?? "negocio";

      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: item.idea,
          tipo: item.type.toLowerCase().includes("reel") ? "reel"
            : item.type.toLowerCase().includes("carrusel") ? "carrusel"
            : item.type.toLowerCase().includes("histor") ? "historia"
            : item.type.toLowerCase().includes("email") ? "email"
            : "post",
          negocio: businessType,
          tono: "profesional",
        }),
      });

      const data = await res.json() as { success: boolean; error?: string; data?: GeneratedContent };
      if (!res.ok || !data.success) { setError(data.error ?? "Error al generar"); return; }
      if (data.data) {
        setGeneratedContent((prev) => ({ ...prev, [idx]: data.data! }));
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setGeneratingIdx(null);
    }
  }

  async function copyContent(idx: number) {
    const content = generatedContent[idx];
    if (!content) return;
    await navigator.clipboard.writeText(`${content.hook}\n\n${content.body}\n\n${content.cta}\n\n${(content.hashtags ?? []).join(" ")}`);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  const TYPE_COLORS: Record<string, string> = {
    reel: "bg-pink-500/10 border-pink-500/20 text-pink-300",
    carrusel: "bg-violet-500/10 border-violet-500/20 text-violet-300",
    historia: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    post: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
    email: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  };

  function getTypeColor(type: string) {
    const key = Object.keys(TYPE_COLORS).find((k) => type.toLowerCase().includes(k));
    return key ? TYPE_COLORS[key] : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300";
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Calendario de Contenido</h1>
          <p className="text-slate-400 text-sm">Tu plan semanal de publicaciones generado por IA</p>
        </div>
        <button
          onClick={loadCalendar}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          {loading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          {calendar.length > 0 ? "Regenerar" : "Generar Calendario"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">{error}</div>
      )}

      {calendar.length === 0 && !loading && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Tu calendario está vacío</h2>
          <p className="text-slate-400 text-sm mb-6">
            Genera tu primer calendario de contenido con un clic
          </p>
          <button
            onClick={loadCalendar}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Generar mi calendario
          </button>
        </div>
      )}

      {calendar.length > 0 && (
        <div className="grid gap-4">
          {calendar.map((item, i) => (
            <div
              key={i}
              className={`bg-white/[0.03] border rounded-2xl overflow-hidden transition-all duration-300 ${
                activeItem === i ? "border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]" : "border-white/[0.08]"
              }`}
            >
              <div className="px-6 py-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <span className="text-indigo-400 text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-semibold text-white text-sm">{item.day}</p>
                    <span className={`text-xs font-medium border px-2 py-0.5 rounded-md ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{item.idea}</p>
                  <p className="text-slate-500 text-xs italic">&ldquo;{item.hook}&rdquo;</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => generateForItem(i, item)}
                    disabled={generatingIdx === i}
                    className="flex items-center gap-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/25 text-indigo-300 text-xs font-medium px-3 py-2 rounded-xl transition-all disabled:opacity-50"
                  >
                    {generatingIdx === i ? (
                      <div className="w-3 h-3 rounded-full border-2 border-indigo-300/20 border-t-indigo-300 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    {generatingIdx === i ? "Generando..." : "Crear contenido"}
                  </button>
                </div>
              </div>

              {/* Generated Content */}
              {generatedContent[i] && (
                <div className="px-6 pb-5 border-t border-white/[0.06] pt-4 animate-fade-in">
                  <div className="bg-white/[0.02] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Contenido generado</p>
                      <button
                        onClick={() => copyContent(i)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        {copied === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === i ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Hook</p>
                      <p className="text-indigo-300 text-sm font-medium">{generatedContent[i].hook}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Cuerpo</p>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{generatedContent[i].body}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">CTA</p>
                      <p className="text-emerald-300 text-sm">{generatedContent[i].cta}</p>
                    </div>
                    {generatedContent[i].hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {generatedContent[i].hashtags.map((h, hi) => (
                          <span key={hi} className="text-xs text-slate-500 bg-white/[0.04] px-2 py-1 rounded-md">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => generateForItem(i, item)}
                    disabled={generatingIdx === i}
                    className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
