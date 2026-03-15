import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validate =
  (schema: ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsed: any = await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        // Update request with validated and transformed data
        // type assertion to bypass read-only property lints
        (req as any).body = parsed.body;
        (req as any).query = parsed.query;
        (req as any).params = parsed.params;

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(422).json({
            success: false,
            message: 'Validation failed',
            error: error.issues[0]?.message || 'Invalid input',
          });
        }
        next(error);
      }
    };
