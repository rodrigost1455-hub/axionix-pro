import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Axionix Marketing",
    default: "Axionix Marketing — Tu Agencia de Marketing con IA",
  },
  description:
    "Genera estrategias, contenido y calendarios de marketing con inteligencia artificial. Sin agencias, sin costos disparados.",
  keywords: ["marketing digital", "IA", "estrategia", "contenido", "redes sociales", "SaaS"],
  openGraph: {
    title: "Axionix Marketing",
    description: "Tu agencia de marketing con IA. Estrategias, contenido y más.",
    url: "https://marketing.axionix.co",
    siteName: "Axionix Marketing",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#060611] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
