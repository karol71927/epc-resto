import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class CreateOrderHttpRequest {
  @ApiProperty()
  @IsPositive()
  mealId!: number;

  @ApiProperty()
  @IsPositive()
  quantity!: number;
}
