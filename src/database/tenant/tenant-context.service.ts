import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  tenantId: string;
  schemaName: string;

  set(tenantId: string, schemaName: string) {
    this.tenantId = tenantId;
    this.schemaName = schemaName;
  }
}
