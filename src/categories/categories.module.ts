import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from './entity/category.entity';
import { CategoriesService } from './service/categories.service';
import { CategoriesController } from './http/controller/categories.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Category],
    }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
