import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Category } from '../entity/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly orm: MikroORM) {}

  async findAll() {
    return this.orm.em.find(Category, {});
  }
}
