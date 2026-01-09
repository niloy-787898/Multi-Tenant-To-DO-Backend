import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Todo } from 'src/todo/entities/todo.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
});
