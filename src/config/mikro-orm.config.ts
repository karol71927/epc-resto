import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { epcRestoMigrations } from '../database/migrations';

export default {
  dbName: process.env.DB_NAME || 'epc-resto',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'pass',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  entities: ['dist/**/*.entity.js'],
  migrations: {
    allOrNothing: true,
    dropTables: false,
    migrationsList: epcRestoMigrations,
  },
  pool: {
    min: 0,
    max: 100,
  },
  driver: PostgreSqlDriver,
  registerRequestContext: true,
} as MikroOrmModuleOptions;
