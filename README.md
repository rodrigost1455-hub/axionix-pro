# Axionix Landing Page

Landing page enterprise SaaS para Axionix. Construida con Next.js 14, TypeScript, Tailwind CSS y Framer Motion.

## Setup

```bash
npm install
npm run dev
```

## Estructura de archivos

```
axionix/
├── app/
│   ├── page.tsx          ← Página principal (todas las secciones)
│   ├── layout.tsx        ← Layout con metadata SEO
│   └── globals.css       ← Estilos base Tailwind
├── components/
│   └── ui/
│       └── container-scroll-animation.tsx  ← Componente scroll 3D
├── public/
│   └── axionix-logo.mp4  ← ⚠️ COLOCA EL VIDEO AQUÍ
├── package.json
└── tailwind.config.ts
```

## ⚠️ Video del logo

Copia tu archivo `axionix-logo.mp4` a la carpeta `public/`:
```bash
cp /ruta/al/axionix-logo.mp4 public/axionix-logo.mp4
```

El video se reproduce como fondo del hero con `opacity-20` (sutil, cinematográfico).

## Deploy en Vercel

1. Sube el proyecto a GitHub
2. Importa en vercel.com
3. Deploy automático ✓

## Personalización

- **Colores**: Cambia en `tailwind.config.ts` → `colors`
- **Textos**: Todo en `app/page.tsx`
- **Dashboard mockup**: Reemplaza la `Image` src en `ContainerScroll` con screenshot real de tu plataforma
- **Contacto**: Ya incluye links de WhatsApp y email de Rodrigo y Diego

## Dependencias instaladas

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```
