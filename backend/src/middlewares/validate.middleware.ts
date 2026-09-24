import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

/**
 * Valida req.body / req.params / req.query con Zod ANTES de llegar al controlador.
 * Si falla, lanza un ZodError que atrapa el error handler global.
 * Los datos ya validados quedan en res.locals.validated.
 */
export const validate =
  (schemas: ValidationSchemas) => (req: Request, res: Response, next: NextFunction): void => {
    res.locals['validated'] = {
      body: schemas.body ? schemas.body.parse(req.body) : undefined,
      params: schemas.params ? schemas.params.parse(req.params) : undefined,
      query: schemas.query ? schemas.query.parse(req.query) : undefined,
    };
    next();
  };