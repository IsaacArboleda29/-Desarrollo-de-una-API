import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';
import { fail } from '../utils/api-response.js';

/** 404 para rutas inexistentes. */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json(fail(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
};

/** Interceptor global de errores: es el ÚLTIMO middleware de la app (4 parámetros). */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // 1) Validación Zod -> 400 con la lista de campos inválidos
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join('.') || '(root)',
      message: issue.message,
    }));
    res.status(400).json(fail('Error de validación', 'VALIDATION_ERROR', details));
    return;
  }

  // 2) Errores controlados de negocio (404, etc.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json(fail(err.message, err.code, err.details));
    return;
  }

  // 3) JSON malformado en el body
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(fail('El cuerpo de la petición no es un JSON válido', 'INVALID_JSON'));
    return;
  }

  // 4) Cualquier otro error: se registra en el servidor pero NO se muestra al cliente
  console.error('💥 [Error no controlado]:', err);
  res.status(500).json(fail('Error interno del servidor', 'INTERNAL_SERVER_ERROR'));
};