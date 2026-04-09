"use client";

import { useState, FormEvent } from "react";
import { FileText, Sparkles, Copy, Check, RefreshCw, Hash } from "lucide-react";

const CONTENT_TYPES = [
  { value: "reel", label: "Reel / TikTok" },
  { value: "carrusel", label: "Carrusel" },
  { value: "historia", label: "Historia" },
  { value: "post", label: "Post / Feed" },
  { value: "email", label: "Email" },
  { value: "tweet", label: "Tweet / X" },
  { value: "guion", label: "Guion Video" },
  { value: "caption", label: "Caption general" },
];

const TONES = [
  { value: "profesional", label: "Profesional" },
  { value: "casual", label: "Casual" },
  { value: "humorístico", label: "Humorístico" },
  { value: "inspiracional", label: "Inspiracional" },
  { value: "urgente", label: "Urgente" },
];

interface ContentResult {
  copy: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  script: string;
  variations: string[];
}

export default function ContentPage() {
  const [form, setForm] = useState({
    idea: "",
    tipo: "reel",
    negocio: "",
    tono: "profesional",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"copy" | "script" | "variations">("copy");

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.idea.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Auto-fill business type if empty
      let negocio = form.negocio.trim();
      if (!negocio) {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json() as { data?: { business?: { type: string } } };
        negocio = meData.data?.business?.type ?? "mi negocio";
        setForm((prev) => ({ ...prev, negocio }));
      }

      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, negocio }),
      });

      const data = await res.json() as { success: boolean; error?: string; data?: ContentResult };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Error al generar el contenido");
        return;
      }

      setResult(data.data ?? null);
      setActiveTab("copy");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Generador de Contenido</h1>
        <p className="text-slate-400 text-sm">Copies, scripts y hooks listos para publicar</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Configura tu contenido
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Idea o tema del contenido *</label>
              <textarea
                value={form.idea}
                onChange={update("idea")}
                placeholder="Ej: Los 3 errores que cometen los dueños de restaurantes en redes sociales..."
                rows={3}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo de contenido</label>
                <select
                  value={form.tipo}
                  onChange={update("tipo")}
                  className="w-full h-10 px-3 rounded-xl text-sm text-white bg-[#0D0D1E] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-[#0D0D1E]">{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tono</label>
                <select
                  value={form.tono}
                  onChange={update("tono")}
                  className="w-full h-10 px-3 rounded-xl text-sm text-white bg-[#0D0D1E] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  {TONES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-[#0D0D1E]">{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Tipo de negocio <span className="text-slate-500">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.negocio}
                onChange={update("negocio")}
                placeholder="Se auto-completa con tu perfil"
                className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || !form.idea.trim()}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Generando contenido...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generar Contenido
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className={`transition-all duration-500 ${result ? "opacity-100" : "opacity-40"}`}>
          {result ? (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden animate-slide-up">
              {/* Tabs */}
              <div className="flex border-b border-white/[0.08]">
                {(["copy", "script", "variations"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeTab === tab
                        ? "text-indigo-400 border-b-2 border-indigo-500 -mb-px bg-indigo-500/5"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab === "copy" ? "Copy" : tab === "script" ? "Script" : "Variaciones"}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-4">
                {activeTab === "copy" && (
                  <>
                    <Section
                      label="Hook"
                      content={result.hook}
                      onCopy={() => copy(result.hook, "hook")}
                      copied={copied === "hook"}
                      accent="indigo"
                    />
                    <Section
                      label="Cuerpo"
                      content={result.body}
                      onCopy={() => copy(result.body, "body")}
                      copied={copied === "body"}
                      accent="violet"
                    />
                    <Section
                      label="CTA"
                      content={result.cta}
                      onCopy={() => copy(result.cta, "cta")}
                      copied={copied === "cta"}
                      accent="emerald"
                    />
                    {result.hashtags?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Hash className="w-3 h-3" />
                          Hashtags
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.hashtags.map((h, i) => (
                            <span key={i} className="text-xs bg-white/[0.06] text-slate-400 px-2 py-1 rounded-lg cursor-pointer hover:bg-white/[0.10] transition-colors" onClick={() => copy(h, `h-${i}`)}>
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        copy(`${result.hook}\n\n${result.body}\n\n${result.cta}\n\n${(result.hashtags ?? []).join(" ")}`, "all")
                      }
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/25 text-indigo-300 text-sm font-medium py-2.5 rounded-xl transition-all"
                    >
                      {copied === "all" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === "all" ? "Copiado" : "Copiar todo"}
                    </button>
                  </>
                )}

                {activeTab === "script" && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Guion completo</p>
                      <button onClick={() => copy(result.script, "script")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                        {copied === "script" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === "script" ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-4">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{result.script || result.copy}</p>
                    </div>
                  </div>
                )}

                {activeTab === "variations" && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Variaciones alternativas</p>
                    {result.variations?.map((v, i) => (
                      <div key={i} className="bg-white/[0.03] rounded-xl p-4 flex items-start justify-between gap-3">
                        <p className="text-slate-300 text-sm flex-1">{v}</p>
                        <button onClick={() => copy(v, `v-${i}`)} className="text-slate-600 hover:text-slate-300 transition-colors shrink-0">
                          {copied === `v-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleSubmit as unknown as React.MouseEventHandler}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-300 py-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerar
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center p-12 text-center">
              <div>
                <Sparkles className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-600 text-sm">Tu contenido aparecerá aquí</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  label, content, onCopy, copied, accent,
}: {
  label: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
  accent: "indigo" | "violet" | "emerald";
}) {
  const colors = {
    indigo: "text-indigo-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-xs font-semibold uppercase tracking-wider ${colors[accent]}`}>{label}</p>
        <button onClick={onCopy} className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <div className="bg-white/[0.03] rounded-xl p-3.5">
        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}
