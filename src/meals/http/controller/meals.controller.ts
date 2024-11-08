import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllMealsHttpQuery } from '../query/find-all-meals.http-query';
import { FindAllMealsHttpResponse } from '../response/find-all-meals.http-response';
import { MealsService } from '../../service/meals.service';

@Controller('meals')
@ApiTags('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get('/')
  async getMeals(
    @Query() query: FindAllMealsHttpQuery,
  ): Promise<FindAllMealsHttpResponse[]> {
    const meals = await this.mealsService.getMeals(query.categoryIds);

    return meals.map(
      (meal) =>
        new FindAllMealsHttpResponse(meal.id, meal.name, meal.price, {
          id: meal.category.id,
          name: meal.category.name,
        }),
    );
  }
}
