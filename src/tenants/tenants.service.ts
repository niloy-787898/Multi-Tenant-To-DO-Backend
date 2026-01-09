import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tenant } from '../database/entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Tenant) private readonly tenantRepo: Repository<Tenant>,
  ) {}

  private buildSchemaName(tenantId: string) {
    return `tenant_${tenantId.replace(/-/g, '')}`;
  }

  async createTenantAndSchema(tenantName: string) {
    // 1) create tenant row
    const tenant = this.tenantRepo.create({
      name: tenantName,
      schemaName: 'TEMP', // will update after id
    });

    const saved = await this.tenantRepo.save(tenant);

    // 2) compute schema name and persist
    const schemaName = this.buildSchemaName(saved.id);
    saved.schemaName = schemaName;
    await this.tenantRepo.save(saved);

    // 3) create schema + tenant tables
    await this.createSchemaAndTodosTable(schemaName);

    return saved;
  }

  private async createSchemaAndTodosTable(schemaName: string) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();

    try {
      await qr.startTransaction();

      // Create schema
      await qr.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

      // Create todos table inside schema
      await qr.query(`
        CREATE TABLE IF NOT EXISTS "${schemaName}"."todos" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "title" varchar(200) NOT NULL,
          "description" text NULL,
          "is_completed" boolean NOT NULL DEFAULT false,
          "created_at" timestamptz NOT NULL DEFAULT now(),
          "updated_at" timestamptz NOT NULL DEFAULT now()
        );
      `);

      await qr.commitTransaction();
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async getSchemaNameByTenantId(tenantId: string): Promise<string> {
  const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
  if (!tenant) throw new Error('Tenant not found');
  return tenant.schemaName;
}

}
