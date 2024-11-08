import { ApiResponseProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../entity/order.entity';

export class FindOrdersHttpResponse {
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

  constructor(
    token: string,
    status: OrderStatus,
    totalPrice: number,
    createdAt: Date,
  ) {
    this.token = token;
    this.status = status;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
  }
}
