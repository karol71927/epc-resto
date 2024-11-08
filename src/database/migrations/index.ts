import { MigrationObject } from '@mikro-orm/core';
import { Migration1731065845000 } from './Migration1731065845000';
import { Migration1731065953000 } from './Migration1731065953000';
import { Migration1731066047000 } from './Migration1731066047000';

export const mapMigration = (migration: any): MigrationObject => {
  return {
    name: migration.name,
    class: migration,
  };
};

export const epcRestoMigrations = [
  Migration1731065845000,
  Migration1731065953000,
  Migration1731066047000,
].map(mapMigration);
