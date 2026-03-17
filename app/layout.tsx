import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Axionix — Automatización Enterprise con IA",
  description:
    "Plataforma enterprise que integra inteligencia artificial operativa con tus sistemas. Eficiencia real, resultados medibles.",
  openGraph: {
    title: "Axionix — Automatización Enterprise con IA",
    description: "Eleva el flujo de trabajo de tu empresa con Axionix.",
    url: "https://axionix.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
