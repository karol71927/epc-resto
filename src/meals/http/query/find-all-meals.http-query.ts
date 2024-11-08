import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsPositive } from 'class-validator';

export class FindAllMealsHttpQuery {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Category IDs',
    isArray: true,
  })
  @Type(() => Number)
  @IsOptional()
  @IsArray()
  @IsPositive({ each: true })
  categoryIds?: number[];
}
