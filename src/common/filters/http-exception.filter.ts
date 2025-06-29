import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(e: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const response = e instanceof HttpException ? e.getResponse() : { message: 'Internal error' };
    const status = e instanceof HttpException ? e.getStatus() : 500;
    const r = typeof response === 'object' && response !== null ? response : { message: response };
    res.status(status).json({ statusCode: status, ...r });
  }
}
