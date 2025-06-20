import e, { NextFunction, Request, Response } from 'express';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(` ${req.originalUrl} cannot be found`);
  next(error);
}
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    //include the stack trace for debugging
    //stack trace is hidden for security reasons in production
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}