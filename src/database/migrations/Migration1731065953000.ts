import { Migration } from '@mikro-orm/migrations';

export class Migration1731065953000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      this.getKnex()
        .schema.createTable('meal', (table) => {
          table.increments('id').primary();
          table.string('name').notNullable();
          table.integer('price').notNullable();
          table.integer('category_id').unsigned().notNullable();
        })
        .toQuery(),
    );

    this.addSql(
      this.getKnex()
        .schema.table('meal', (table) => {
          table.foreign('category_id').references('category.id');
        })
        .toQuery(),
    );
  }
}
