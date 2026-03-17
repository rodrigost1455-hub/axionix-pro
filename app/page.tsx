"use client";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { MessageCircle, Mail, Instagram, ArrowRight, Zap, Bot, Globe, Lock } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-5 h-5 text-cyan-400" />,
    name: "Integración Total",
    desc: "Conecta tus sistemas ERP, CRM y legacy con APIs robustas y conectores nativos sin código.",
  },
  {
    icon: <Bot className="w-5 h-5 text-cyan-400" />,
    name: "IA Operativa",
    desc: "Modelos de IA entrenados sobre tus datos para automatizar decisiones y flujos complejos.",
  },
  {
    icon: <Globe className="w-5 h-5 text-cyan-400" />,
    name: "Escalabilidad Global",
    desc: "Infraestructura multi-región con escalado automático. Crece sin fricciones técnicas.",
  },
  {
    icon: <Lock className="w-5 h-5 text-cyan-400" />,
    name: "Seguridad Enterprise",
    desc: "Cifrado end-to-end, SOC 2 Tipo II, ISO 27001 y controles de acceso granulares.",
  },
];

const team = [
  {
    initial: "R",
    name: "Rodrigo",
    role: "Líder de Soluciones",
    wa: "https://wa.me/526182225975",
    email: "rodrigost1455@gmail.com",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    initial: "D",
    name: "Diego",
    role: "Director de Integración",
    wa: "https://wa.me/526182562935",
    email: "diegocovars960@gmail.com",
    gradient: "from-cyan-500 to-teal-500",
  },
];

export default function Home() {
  return (
    <main className="bg-[#0F172A] text-slate-100 font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-2xl bg-[#0F172A]/80">
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-white to-cyan-400 bg-clip-text text-transparent">
          Axionix
        </span>
        <ul className="hidden md:flex gap-8 text-sm text-slate-400 font-medium list-none">
          <li><a href="#features" className="hover:text-white transition-colors">Plataforma</a></li>
          <li><a href="#team" className="hover:text-white transition-colors">Expertos</a></li>
          <li><a href="#contact" className="hover:text-white transition-colors">Contacto</a></li>
        </ul>
        <button className="bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
          Solicitar Demo
        </button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-24">
        {/* VIDEO BACKGROUND */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        >
          <source src="/axionix-logo.mp4" type="video/mp4" />
        </video>

        {/* GRADIENT ORBS */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/25 blur-[120px]" />
          <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[100px]" />
        </div>

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]" />

        <ContainerScroll
          titleComponent={
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-cyan-400 tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Automatización Empresarial IA
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-balance mb-4">
                Eleva el Flujo de<br />Trabajo de tu Empresa.
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Automatización con Axionix.
                </span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Plataforma enterprise que integra inteligencia artificial operativa con tus sistemas. Eficiencia real, resultados medibles.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5">
                  Comenzar Ahora <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium px-7 py-3.5 rounded-xl backdrop-blur-sm">
                  Ver Demostración
                </button>
              </div>
            </div>
          }
        >
          {/* DASHBOARD MOCKUP IMAGE */}
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
            alt="Axionix Dashboard"
            fill
            className="object-cover rounded-2xl"
            priority
          />
        </ContainerScroll>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[.15em] uppercase text-cyan-400 mb-4">Plataforma</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-5">
              Tecnología que impulsa resultados
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-md mb-8">
              Axionix es una plataforma enterprise avanzada diseñada para maximizar la eficiencia operativa. Integra IA, automatización de procesos y analítica en tiempo real en un ecosistema unificado.
            </p>
            <div className="flex gap-10">
              {[["10×", "Velocidad operativa"], ["99.9%", "Uptime SLA"], ["-40%", "Costo operativo"]].map(([n, d]) => (
                <div key={n}>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">{n}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.name}
                className="group bg-white/[.04] hover:bg-white/[.07] border border-white/[.08] hover:border-blue-500/40 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/25 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm text-white mb-2">{f.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto border-t border-white/[.07]" />

      {/* TEAM */}
      <section id="team" className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-semibold tracking-[.15em] uppercase text-cyan-400 mb-4">Equipo</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Contacta a Nuestros Expertos
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Nuestro equipo está listo para diseñar la solución de automatización perfecta para tu empresa.
          </p>
        </div>

        <div id="contact" className="max-w-2xl mx-auto grid md:grid-cols-2 gap-5">
          {team.map((m) => (
            <div
              key={m.name}
              className="bg-white/[.04] hover:bg-white/[.06] border border-white/[.08] hover:border-cyan-500/35 rounded-2xl p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white font-bold text-xl mb-5`}>
                {m.initial}
              </div>
              <h3 className="font-bold text-lg text-white">{m.name}</h3>
              <p className="text-cyan-400 text-xs font-medium mb-5">{m.role}</p>
              <div className="flex flex-col gap-2">
                <a
                  href={m.wa}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:bg-white/5 rounded-lg px-2 py-1.5 -mx-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <MessageCircle className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${m.email}`}
                  className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:bg-white/5 rounded-lg px-2 py-1.5 -mx-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  {m.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[.07] px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-base bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Axionix
          </span>
          <p className="text-slate-500 text-sm">© 2026 Axionix. Todos los derechos reservados.</p>
          <a
            href="https://www.instagram.com/axionix_co?igsh=MXNnanE4MnN0dGRvOA=="
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-sm transition-colors"
          >
            <Instagram className="w-4 h-4" />
            @axionix_co
          </a>
        </div>
      </footer>
    </main>
  );
}
