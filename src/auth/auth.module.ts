import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import { JwtTenantGuard } from './guards/jwt-tenant.guard';
import { TenantDbModule } from '../database/tenant/tenant.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TenantsModule,
    UsersModule,
    TenantDbModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_ACCESS_SECRET');
        if (!secret) throw new Error('JWT_ACCESS_SECRET is missing');

        const expiresIn =
          (config.get<StringValue>('JWT_ACCESS_EXPIRES_IN') ?? ('3600s' as StringValue));

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
 providers: [AuthService, JwtStrategy],
exports: [JwtModule, PassportModule],


})
export class AuthModule { }
