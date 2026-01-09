import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { TenantContext } from './tenant-context.service';

type ReqWithQR = Request & { __tenantQR?: QueryRunner };

@Injectable({ scope: Scope.REQUEST })
export class TenantEntityManager {
  private manager: EntityManager;
  private queryRunner: QueryRunner;

  constructor(
    private readonly dataSource: DataSource,
    private readonly tenantContext: TenantContext,
    @Inject(REQUEST) private readonly req: ReqWithQR,
  ) {}

  async getManager(): Promise<EntityManager> {
    if (this.manager) return this.manager;

    // Create per-request query runner
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();

    // Store in request so interceptor can release later
    this.req.__tenantQR = this.queryRunner;

    const schema = this.tenantContext.schemaName;

    // Prevent SQL injection: schema comes only from DB (public.tenants)
    await this.queryRunner.query(`SET search_path TO "${schema}", public`);

    this.manager = this.queryRunner.manager;
    return this.manager;
  }
}
