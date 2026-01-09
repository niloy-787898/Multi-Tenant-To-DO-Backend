import { Module } from '@nestjs/common';
import { TenantContext } from './tenant-context.service';
import { TenantEntityManager } from './tenant-entity-manager';
import { TenantQueryRunnerInterceptor } from './tenant-queryrunner.interceptor';

@Module({
  providers: [TenantContext, TenantEntityManager, TenantQueryRunnerInterceptor],
  exports: [TenantContext, TenantEntityManager, TenantQueryRunnerInterceptor],
})
export class TenantDbModule {}
