import { NextResponse } from "next/server";

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function unauthorizedResponse(message = "No autorizado") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Acceso denegado") {
  return errorResponse(message, 403);
}

export function tooManyRequestsResponse(message = "Demasiadas solicitudes. Intenta más tarde.") {
  return errorResponse(message, 429);
}

export function serverErrorResponse(message = "Error interno del servidor") {
  return errorResponse(message, 500);
}
