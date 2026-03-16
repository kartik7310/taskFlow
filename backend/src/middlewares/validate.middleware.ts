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
        req.body = parsed.body;

        // Use Object.assign to update properties instead of reassigning the getter-only properties
        if (parsed.query) Object.assign(req.query, parsed.query);
        if (parsed.params) Object.assign(req.params, parsed.params);

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
