import { Migration } from '@mikro-orm/migrations';

export class Migration1731065845000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      this.getKnex()
        .schema.createTable('category', (table) => {
          table.increments('id').primary();
          table.string('name').notNullable();
        })
        .toQuery(),
    );

    this.addSql(
      this.getKnex()
        .schema.alterTable('category', (table) => {
          table.unique('name');
        })
        .toQuery(),
    );
  }
}
