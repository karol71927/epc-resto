import { Migration } from '@mikro-orm/migrations';
import { OrderStatus } from '../../orders/entity/order.entity';

export class Migration1731066047000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      this.getKnex()
        .schema.createTable('order', (table) => {
          table.increments('id').primary();
          table.string('token').notNullable();
          table.string('status', 20).notNullable().defaultTo(OrderStatus.NEW);
          table.integer('total_price').notNullable();
          table.jsonb('meals').notNullable().defaultTo('[]');
          table.timestamp('created_at').defaultTo(this.getKnex().fn.now());
        })
        .toQuery(),
    );

    this.addSql(
      this.getKnex()
        .schema.table('order', (table) => {
          table.unique('token', { storageEngineIndexType: 'hash' });
        })
        .toQuery(),
    );
  }
}
