export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/** Response Wrapper Pattern: TODAS las respuestas exitosas salen por aquí. */
export const ok = <T>(data: T, message = 'Operación exitosa', meta?: PaginationMeta): ApiSuccess<T> => ({
  success: true,
  message,
  data,
  ...(meta ? { meta } : {}),
  timestamp: new Date().toISOString(),
});

/** ...y TODAS las fallidas salen por aquí. */
export const fail = (message: string, code: string, details?: unknown): ApiFailure => ({
  success: false,
  message,
  error: { code, ...(details !== undefined ? { details } : {}) },
  timestamp: new Date().toISOString(),
});