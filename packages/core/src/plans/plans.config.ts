export type Plan = "FREE" | "BASIC" | "PRO" | "PREMIUM";
export type GenerationType = "STRATEGY" | "CONTENT" | "IMAGE" | "VIDEO";

export interface PlanConfig {
  id: Plan;
  name: string;
  price: number; // USD/month
  stripePriceId?: string;
  limits: {
    textGenerations: number;
    imageGenerations: number;
    videoGenerations: number;
  };
  features: string[];
}

export const PLANS: Record<Plan, PlanConfig> = {
  FREE: {
    id: "FREE",
    name: "Gratis",
    price: 0,
    limits: {
      textGenerations: 3,
      imageGenerations: 0,
      videoGenerations: 0,
    },
    features: ["3 generaciones de texto/mes", "Estrategia básica", "Calendario de contenido"],
  },
  BASIC: {
    id: "BASIC",
    name: "Básico",
    price: 19,
    limits: {
      textGenerations: 20,
      imageGenerations: 0,
      videoGenerations: 0,
    },
    features: [
      "20 generaciones de texto/mes",
      "Estrategias completas",
      "Calendario avanzado",
      "Generación de copies",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: 49,
    limits: {
      textGenerations: 60,
      imageGenerations: 20,
      videoGenerations: 0,
    },
    features: [
      "60 generaciones de texto/mes",
      "20 imágenes/mes con IA",
      "Todo lo de Básico",
      "Soporte prioritario",
    ],
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium",
    price: 99,
    limits: {
      textGenerations: 60,
      imageGenerations: 20,
      videoGenerations: 5,
    },
    features: [
      "60 generaciones de texto/mes",
      "20 imágenes/mes con IA",
      "5 videos/mes con IA",
      "Todo lo de Pro",
      "Acceso anticipado a nuevas funciones",
    ],
  },
};

export function getPlan(plan: Plan): PlanConfig {
  return PLANS[plan];
}

export function canGenerate(
  plan: Plan,
  type: "text" | "image" | "video",
  currentUsage: { text: number; image: number; video: number }
): { allowed: boolean; reason?: string } {
  const config = PLANS[plan];
  const map = {
    text: { used: currentUsage.text, limit: config.limits.textGenerations },
    image: { used: currentUsage.image, limit: config.limits.imageGenerations },
    video: { used: currentUsage.video, limit: config.limits.videoGenerations },
  };
  const { used, limit } = map[type];
  if (limit === 0) {
    return {
      allowed: false,
      reason: `Tu plan ${config.name} no incluye generación de ${type === "image" ? "imágenes" : type === "video" ? "videos" : "contenido"}. Mejora tu plan.`,
    };
  }
  if (used >= limit) {
    return {
      allowed: false,
      reason: `Has alcanzado el límite de ${limit} generaciones de ${type === "image" ? "imágenes" : type === "video" ? "videos" : "texto"} en tu plan ${config.name}.`,
    };
  }
  return { allowed: true };
}

export function getGenerationTypeKey(type: GenerationType): "text" | "image" | "video" {
  if (type === "IMAGE") return "image";
  if (type === "VIDEO") return "video";
  return "text";
}
