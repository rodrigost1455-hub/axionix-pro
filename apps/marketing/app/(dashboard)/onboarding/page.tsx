"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

const BUSINESS_TYPES = [
  "Restaurante / Café",
  "E-commerce / Tienda Online",
  "Gimnasio / Salud y Bienestar",
  "Consultoría / Servicios",
  "Educación / Cursos",
  "Moda / Ropa",
  "Belleza / Estética",
  "Tecnología / SaaS",
  "Inmobiliaria",
  "Coaching / Mentoría",
  "Otro",
];

const OBJECTIVES = [
  { value: "sales", label: "Aumentar ventas" },
  { value: "branding", label: "Construir marca" },
  { value: "followers", label: "Ganar seguidores" },
  { value: "traffic", label: "Generar tráfico web" },
  { value: "engagement", label: "Mejorar engagement" },
];

const LEVELS = [
  { value: "beginner", label: "Principiante", desc: "Empezando en redes sociales" },
  { value: "intermediate", label: "Intermedio", desc: "Ya tengo presencia activa" },
  { value: "advanced", label: "Avanzado", desc: "Quiero escalar lo que ya funciona" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "",
    objective: "",
    level: "",
    niche: "",
    description: "",
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 1) return form.type.length > 0;
    if (step === 2) return form.objective.length > 0;
    if (step === 3) return form.level.length > 0;
    return false;
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canNext() && step < 4) return;

    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json() as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Error al guardar la información");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060611] flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Cuéntanos sobre tu negocio</h1>
          <p className="text-slate-400 text-sm">Así generaremos estrategias específicas para ti</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? "bg-indigo-500" : "bg-white/[0.08]"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Business Type */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-lg font-semibold text-white mb-1">¿Qué tipo de negocio tienes?</h2>
              <p className="text-slate-400 text-sm mb-5">Selecciona la categoría que mejor describe tu negocio</p>
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {BUSINESS_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => update("type", type)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      form.type === type
                        ? "bg-indigo-600/20 border border-indigo-500/50 text-indigo-300"
                        : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.07]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="O escribe tu tipo de negocio aquí..."
                  value={BUSINESS_TYPES.includes(form.type) ? "" : form.type}
                  onChange={(e) => update("type", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 2: Objective */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-lg font-semibold text-white mb-1">¿Cuál es tu objetivo principal?</h2>
              <p className="text-slate-400 text-sm mb-5">La IA optimizará la estrategia según este objetivo</p>
              <div className="space-y-2.5">
                {OBJECTIVES.map((obj) => (
                  <button
                    key={obj.value}
                    type="button"
                    onClick={() => update("objective", obj.value)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      form.objective === obj.value
                        ? "bg-indigo-600/20 border border-indigo-500/50 text-indigo-300"
                        : "bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.07]"
                    }`}
                  >
                    {obj.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Level + extras */}
          {step === 3 && (
            <div className="animate-slide-up space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">¿Cuál es tu nivel actual?</h2>
                <p className="text-slate-400 text-sm mb-4">Adapta la estrategia a tu experiencia</p>
                <div className="space-y-2.5">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => update("level", lvl.value)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        form.level === lvl.value
                          ? "bg-indigo-600/20 border border-indigo-500/50"
                          : "bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07]"
                      }`}
                    >
                      <p className={`text-sm font-medium ${form.level === lvl.value ? "text-indigo-300" : "text-slate-300"}`}>
                        {lvl.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Nicho o especialidad <span className="text-slate-500">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Comida vegana, Ropa deportiva femenina..."
                  value={form.niche}
                  onChange={(e) => update("niche", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Cuéntanos más <span className="text-slate-500">(opcional)</span>
                </label>
                <textarea
                  placeholder="Describe brevemente tu negocio, producto estrella, o lo que te diferencia..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 h-11 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white font-semibold rounded-xl text-sm transition-all"
              >
                Atrás
              </button>
            )}
            <button
              type="submit"
              disabled={!canNext() || loading}
              className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Guardando...
                </>
              ) : step < 3 ? (
                <>Siguiente <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Ir al Dashboard <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
