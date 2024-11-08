import { ApiResponseProperty } from '@nestjs/swagger';

export class FindAllCategoriesHttpResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
