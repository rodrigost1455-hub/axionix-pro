"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const passwordChecks = [
    { label: "Al menos 8 caracteres", ok: form.password.length >= 8 },
    { label: "Una mayúscula", ok: /[A-Z]/.test(form.password) },
    { label: "Un número", ok: /[0-9]/.test(form.password) },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!passwordChecks.every((c) => c.ok)) {
      setError("La contraseña no cumple los requisitos");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json() as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Error al crear la cuenta");
        return;
      }

      router.push("/onboarding");
    } catch {
      setError("Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Crea tu cuenta gratis</h1>
        <p className="text-slate-400 text-sm">Empieza a generar estrategias en minutos</p>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
              placeholder="Tu nombre"
              required
              autoComplete="name"
              className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="Mínimo 8 caracteres"
              required
              autoComplete="new-password"
              className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/[0.05] border border-white/[0.10] focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {form.password.length > 0 && (
              <div className="mt-2.5 space-y-1.5">
                {passwordChecks.map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                        c.ok ? "bg-emerald-500" : "bg-white/10"
                      }`}
                    >
                      {c.ok && <Check className="w-2 h-2 text-white" />}
                    </div>
                    <span className={`text-xs transition-colors ${c.ok ? "text-emerald-400" : "text-slate-500"}`}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta gratis"
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-slate-500 text-xs mt-4">
        Al registrarte aceptas nuestros{" "}
        <a href="#" className="text-indigo-400 hover:text-indigo-300">Términos</a>{" "}
        y{" "}
        <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacidad</a>
      </p>

      <p className="text-center text-slate-500 text-sm mt-4">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
