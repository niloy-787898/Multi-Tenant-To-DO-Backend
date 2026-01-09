import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../../database/tenant/tenant-context.service';
import { TenantsService } from '../../tenants/tenants.service';

@Injectable({ scope: Scope.REQUEST })
export class JwtTenantGuard extends AuthGuard('jwt') {
  constructor(
    private readonly tenantContext: TenantContext,
    private readonly tenantsService: TenantsService,
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1) Let passport validate token + attach req.user
    const ok = (await super.canActivate(context)) as boolean;
    if (!ok) return false;

    // 2) Extract user from request
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user?.tenantId) {
      throw new UnauthorizedException('tenantId missing in JWT');
    }

    // 3) Resolve schemaName from public.tenants
    const schemaName = await this.tenantsService.getSchemaNameByTenantId(user.tenantId);

    // 4) Store in request-scoped TenantContext
    this.tenantContext.set(user.tenantId, schemaName);

    return true;
  }
}
