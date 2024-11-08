import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Category } from '../../categories/entity/category.entity';

@Entity()
export class Meal {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  price: number;

  @ManyToOne(() => Category)
  category: Category;

  constructor(name: string, price: number, category: Category) {
    this.name = name;
    this.price = price;
    this.category = category;
  }
}
