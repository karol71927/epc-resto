import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindAllCategoriesHttpResponse } from '../response/find-all-categories.http-response';
import { CategoriesService } from '../../service/categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/')
  @ApiOkResponse({ type: FindAllCategoriesHttpResponse, isArray: true })
  async getCategories(): Promise<FindAllCategoriesHttpResponse[]> {
    const categories = await this.categoriesService.findAll();

    return categories.map(
      (category) =>
        new FindAllCategoriesHttpResponse(category.id, category.name),
    );
  }
}
