import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Todo } from 'src/todo/entities/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = Number(config.get<string>('DB_PORT'));
        const username = config.get<string>('DB_USER');
        const database = config.get<string>('DB_NAME');

        console.log('[DB]', { host, port, username, database });

        return {
          type: 'postgres',
          host,
          port,
          username,
          password: config.get<string>('DB_PASSWORD'),
          database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          logging: ['query', 'error'],
          synchronize: false,
          migrationsRun: true,
          autoLoadEntities: true,
          migrations: ['dist/database/migrations/*.js'],

        };
      }

    }),

    // so other modules can inject repositories for public entities
    TypeOrmModule.forFeature([Tenant, User]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }

