import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { QueryRunner } from 'typeorm';

type ReqWithQR = Request & { __tenantQR?: QueryRunner };

@Injectable()
export class TenantQueryRunnerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<ReqWithQR>();

    return next.handle().pipe(
      finalize(async () => {
        if (req.__tenantQR) {
          await req.__tenantQR.release();
          req.__tenantQR = undefined;
        }
      }),
    );
  }
}
