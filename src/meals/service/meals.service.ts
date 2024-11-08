import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Meal } from '../entity/meal.entity';

@Injectable()
export class MealsService {
  constructor(private readonly orm: MikroORM) {}

  async getMeals(categoryIds?: number[]) {
    const query = categoryIds ? { category: { $in: categoryIds } } : {};

    return this.orm.em.find(Meal, query, { populate: ['category'] });
  }
}
