import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorLogService } from '../../modules/logger/error-log.service';
import { AuthenticatedUser } from '../types/authenticated-user.interface';
import { HttpExceptionResponse } from '../dtos/http-exception-response.dto';

// Тип для ответа HttpException (message может быть строкой или массивом)

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly errorLogService: ErrorLogService) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as HttpExceptionResponse;
        const msg = resObj.message;
        if (Array.isArray(msg)) {
          message = msg.join(', ');
        } else if (typeof msg === 'string') {
          message = msg;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const user: AuthenticatedUser | undefined = request.user as
      | AuthenticatedUser
      | undefined;

    await this.errorLogService.create({
      userId: user?.sub,
      role: user?.role,
      method: request.method,
      path: request.originalUrl ?? request.url,
      statusCode: status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
    });
  }
}
