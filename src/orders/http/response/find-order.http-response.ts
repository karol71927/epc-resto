import { ApiResponseProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../entity/order.entity';

class FindOrderMeals {
  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  price: number;

  @ApiResponseProperty()
  quantity: number;

  constructor(name: string, price: number, quantity: number) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

export class FindOrderHttpResponse {
  @ApiResponseProperty()
  token: string;

  @ApiResponseProperty({
    enum: OrderStatus,
  })
  status: OrderStatus;

  @ApiResponseProperty()
  totalPrice: number;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty({
    type: [FindOrderMeals],
  })
  meals: FindOrderMeals[];

  constructor(
    token: string,
    status: OrderStatus,
    totalPrice: number,
    createdAt: Date,
    meals: FindOrderMeals[],
  ) {
    this.token = token;
    this.status = status;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
    this.meals = meals;
  }
}
