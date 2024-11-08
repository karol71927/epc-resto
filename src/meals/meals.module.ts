import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Meal } from './entity/meal.entity';
import { MealsService } from './service/meals.service';
import { MealsController } from './http/controller/meals.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Meal],
    }),
  ],
  controllers: [MealsController],
  providers: [MealsService],
})
export class MealsModule {}
