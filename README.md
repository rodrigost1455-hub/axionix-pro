# Axionix — Monorepo

Ecosistema de productos SaaS con IA. Construido con Next.js 14, Prisma, TailwindCSS y Turborepo.

## Productos

| App | Descripción | Estado |
|-----|-------------|--------|
| **Axionix Marketing** | Estrategias y contenido de marketing con IA | ✅ MVP |
| Axionix Booking | Gestión de reservas | 🔜 Próximamente |
| Axionix Website | Constructor de sitios web | 🔜 Próximamente |

---

## Estructura del monorepo

```
axionix-pro/
├── apps/
│   └── marketing/              # Axionix Marketing SaaS (Next.js)
│       ├── app/
│       │   ├── (auth)/         # Login, Register
│       │   ├── (dashboard)/    # Dashboard, Strategy, Calendar, Content
│       │   └── api/            # API Routes (auth, AI generation)
│       ├── lib/                # Prisma, Auth, Rate-limit
│       ├── middleware.ts        # JWT auth middleware
│       └── prisma/             # Schema PostgreSQL
├── packages/
│   ├── ui/                     # Componentes React compartidos
│   ├── core/                   # JWT, bcrypt, Plan config
│   └── services/               # AI services (OpenAI, Gemini, Higgsfield)
└── config/typescript/          # TypeScript base config
```

---

## Stack

- **Framework**: Next.js 14 (App Router)
- **Estilos**: TailwindCSS
- **Base de datos**: PostgreSQL + Prisma ORM
- **Auth**: JWT con httpOnly cookies + bcrypt
- **IA Texto**: OpenAI GPT-4o
- **IA Imágenes**: DALL-E 3 (Plan Pro+)
- **IA Video**: Higgsfield (Plan Premium — Fase 3)
- **Pagos**: Stripe (en desarrollo)
- **Monorepo**: Turborepo + npm workspaces

---

## Inicio rápido

### 1. Requisitos

- Node.js 18+
- PostgreSQL local o cloud (Neon/Supabase/Railway)
- API key de OpenAI

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

```bash
cp apps/marketing/.env.example apps/marketing/.env.local
```

Edita `apps/marketing/.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/axionix_marketing"
JWT_SECRET="tu-secret-muy-largo-y-seguro-min-32-chars"
OPENAI_API_KEY="sk-..."
```

### 4. Base de datos

```bash
npm run db:push        # Crear tablas sin migraciones (desarrollo rápido)
# o
npm run db:migrate     # Con historial de migraciones (recomendado)
```

### 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## API Reference

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Crear cuenta |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/logout` | Cerrar sesión |
| `GET` | `/api/auth/me` | Usuario autenticado |

### Onboarding

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/onboarding` | Guardar perfil de negocio |
| `GET` | `/api/onboarding` | Obtener perfil |

### Generación IA

| Método | Ruta | Plan mínimo |
|--------|------|-------------|
| `POST` | `/api/generate-strategy` | FREE |
| `POST` | `/api/generate-content` | FREE |
| `POST` | `/api/generate-image` | PRO |
| `POST` | `/api/generate-video` | PREMIUM |

#### POST /api/generate-strategy — Request body

```json
{
  "tipo_negocio": "Restaurante vegano",
  "objetivo": "sales",
  "nivel_actual": "beginner",
  "niche": "Comida vegana premium",
  "description": "Restaurante de comida vegana en CDMX"
}
```

#### POST /api/generate-content — Request body

```json
{
  "idea": "Los 3 errores que cometen los dueños de restaurantes",
  "tipo": "reel",
  "negocio": "Restaurante vegano",
  "tono": "profesional"
}
```

---

## Sistema de Planes

| Plan | Precio | Texto | Imágenes | Videos |
|------|--------|-------|----------|--------|
| FREE | $0 | 3/mes | — | — |
| BASIC | $19/mes | 20/mes | — | — |
| PRO | $49/mes | 60/mes | 20/mes | — |
| PREMIUM | $99/mes | 60/mes | 20/mes | 5/mes |

---

## Roadmap

### Fase 1 — MVP ✅
- [x] Auth completo (registro, login, logout, cookies seguras)
- [x] Onboarding multi-step
- [x] Generación de estrategia con GPT-4o
- [x] Generación de contenido (copies, hooks, scripts)
- [x] Calendario de contenido 7 días
- [x] Dashboard con métricas
- [x] Control de límites por plan + rate limiting
- [x] Seguridad: validación Zod, JWT httpOnly, bcrypt

### Fase 2 — Imágenes
- [ ] Generación con DALL-E 3
- [ ] Galería de imágenes

### Fase 3 — Video
- [ ] Integración Higgsfield
- [ ] Jobs asíncronos

### Fase 4 — Pagos
- [ ] Stripe Checkout + Webhooks
- [ ] Portal de cliente Stripe

---

## Para agregar un nuevo producto Axionix

1. Crea `apps/nuevo-producto/`
2. Reutiliza `@axionix/ui`, `@axionix/core`, `@axionix/services`
3. Agrega el task a `turbo.json`
4. Los usuarios y planes ya están en el schema compartido

---

© 2026 Axionix. Todos los derechos reservados.
