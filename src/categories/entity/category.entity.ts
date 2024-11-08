import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Meal } from '../../meals/entity/meal.entity';

@Entity()
export class Category {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @OneToMany(() => Meal, (meal) => meal.category)
  meals = new Collection<Meal>(this);

  constructor(name: string) {
    this.name = name;
  }
}
