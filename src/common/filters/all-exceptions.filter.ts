import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: exception?.message ?? 'Internal server error' };

    const message =
      typeof responseBody === 'string'
        ? responseBody
        : (responseBody as any).message ?? 'Error';

    res.status(status).json({
      success: false,
      path: req.url,
      timestamp: new Date().toISOString(),
      statusCode: status,
      message,
    });
  }
}
