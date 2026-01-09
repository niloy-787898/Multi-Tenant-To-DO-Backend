import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { TodoModule } from './todo/todo.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtTenantGuard } from './auth/guards/jwt-tenant.guard';
import { TenantDbModule } from './database/tenant/tenant.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    AppConfigModule,
    DatabaseModule,
    CommonModule,
    AuthModule,
    UsersModule,
    TenantDbModule,
    TenantsModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },

  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}


