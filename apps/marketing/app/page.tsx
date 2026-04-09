import Link from "next/link";
import {
  Zap, Calendar, FileText, BarChart3, ArrowRight, Check,
  Star, Sparkles, Target, TrendingUp
} from "lucide-react";

const FEATURES = [
  {
    icon: <Target className="w-5 h-5 text-indigo-400" />,
    title: "Estrategia con IA",
    desc: "Genera estrategias completas con canales, KPIs y tácticas específicas para tu negocio en segundos.",
  },
  {
    icon: <FileText className="w-5 h-5 text-violet-400" />,
    title: "Contenido que Convierte",
    desc: "Copies, hooks, CTAs y scripts creados por IA entrenada en las marcas más exitosas del mundo.",
  },
  {
    icon: <Calendar className="w-5 h-5 text-cyan-400" />,
    title: "Calendario Inteligente",
    desc: "Plan de contenido diario durante 30 días. Qué publicar, cuándo y con qué ángulo.",
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    title: "Recomendaciones Accionables",
    desc: "Quick wins y acciones concretas que puedes implementar esta misma semana.",
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    title: "Generación de Imágenes",
    desc: "Crea imágenes de marketing profesionales con DALL-E 3 directamente desde tu dashboard.",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-pink-400" />,
    title: "Videos con IA",
    desc: "Genera videos cortos para Reels y TikTok con inteligencia artificial. Próximamente.",
  },
];

const PLANS = [
  {
    id: "FREE",
    name: "Gratis",
    price: 0,
    desc: "Para empezar a explorar",
    features: ["3 generaciones/mes", "Estrategia básica", "Calendario de contenido"],
    cta: "Empezar Gratis",
    highlighted: false,
  },
  {
    id: "BASIC",
    name: "Básico",
    price: 19,
    desc: "Para emprendedores activos",
    features: ["20 generaciones/mes", "Estrategias completas", "Calendario avanzado", "Generación de copies"],
    cta: "Comenzar",
    highlighted: false,
  },
  {
    id: "PRO",
    name: "Pro",
    price: 49,
    desc: "El favorito de los negocios",
    features: ["60 generaciones/mes", "20 imágenes IA/mes", "Todo lo de Básico", "Soporte prioritario"],
    cta: "Obtener Pro",
    highlighted: true,
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: 99,
    desc: "Para escalar sin límites",
    features: ["60 generaciones/mes", "20 imágenes IA/mes", "5 videos IA/mes", "Todo lo de Pro", "Acceso anticipado"],
    cta: "Ir Premium",
    highlighted: false,
  },
];

const TESTIMONIALS = [
  {
    name: "María González",
    role: "Dueña de boutique",
    text: "En 10 minutos tenía una estrategia completa para Instagram. Antes le pagaba $800/mes a una agencia por menos.",
    stars: 5,
  },
  {
    name: "Carlos Reyes",
    role: "Coach de negocios",
    text: "Los copies que genera son increíbles. Mis posts tienen 3x más engagement desde que uso Axionix.",
    stars: 5,
  },
  {
    name: "Ana Martínez",
    role: "E-commerce founder",
    text: "El calendario de contenido me salvó. Ahora sé exactamente qué publicar cada día sin pensar.",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060611] text-slate-100">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] backdrop-blur-2xl bg-[#060611]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">
              Axionix{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Marketing
              </span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Empezar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[80px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Tu agencia de marketing con IA
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6">
            Crea tu estrategia<br />de marketing con{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Inteligencia Artificial
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sin agencias caras. Sin adivinanzas. Solo estrategias concretas, contenido que engancha
            y resultados medibles para tu negocio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
            >
              Empezar Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.10] text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200"
            >
              Ver cómo funciona
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Sin tarjeta de crédito</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> 3 generaciones gratis</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Cancela cuando quieras</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[.15em] uppercase text-indigo-400 mb-3">Funcionalidades</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Todo lo que necesita tu negocio
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Una plataforma completa que reemplaza a tu agencia de marketing con inteligencia artificial.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[.15em] uppercase text-indigo-400 mb-3">Precios</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Planes para cada etapa</h2>
            <p className="text-slate-400 text-lg">Escala cuando tu negocio crece.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? "bg-indigo-600/10 border border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.15)]"
                    : "bg-white/[0.03] border border-white/[0.08]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MÁS POPULAR
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-lg text-white mb-1">{plan.name}</h3>
                  <p className="text-slate-500 text-xs">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400 text-sm">/mes</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`w-full text-center font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      : "bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[.15em] uppercase text-indigo-400 mb-3">Testimonios</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm text-white">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-b from-indigo-600/20 to-violet-600/10 border border-indigo-500/20 rounded-3xl p-12">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:32px_32px] rounded-3xl [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
            <h2 className="relative text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Empieza hoy. <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Es gratis.
              </span>
            </h2>
            <p className="relative text-slate-400 text-lg mb-8">
              3 generaciones gratis. Sin tarjeta. Sin compromisos.
            </p>
            <Link
              href="/register"
              className="relative inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Crear mi cuenta gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">Axionix Marketing</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Axionix. Todos los derechos reservados.</p>
          <div className="flex gap-4 text-slate-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
