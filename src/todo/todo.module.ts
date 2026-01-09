import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TenantDbModule } from '../database/tenant/tenant.module';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [TenantDbModule, TenantsModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
