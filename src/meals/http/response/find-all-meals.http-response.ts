import { ApiResponseProperty } from '@nestjs/swagger';

class FindAllMealsCategory {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class FindAllMealsHttpResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  price: number;

  @ApiResponseProperty({ type: FindAllMealsCategory })
  category: FindAllMealsCategory;

  constructor(
    id: number,
    name: string,
    price: number,
    category: FindAllMealsCategory,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
  }
}
