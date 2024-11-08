import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderHttpRequest } from '../request/create-order.http-request';
import { FindOrdersHttpResponse } from '../response/find-orders.http-response';
import { FindOrderHttpResponse } from '../response/find-order.http-response';
import { OrdersService } from '../../service/orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  @ApiOkResponse()
  @ApiNotFoundResponse({
    description: 'Meal not found',
  })
  async createOrder(@Body() body: CreateOrderHttpRequest[]): Promise<void> {
    await this.ordersService.createOrder(body);
  }

  @Get('/')
  @ApiOkResponse({
    type: FindOrdersHttpResponse,
    isArray: true,
  })
  async getOrders(): Promise<FindOrdersHttpResponse[]> {
    const orders = await this.ordersService.getOrders();

    return orders.map((order) => {
      return new FindOrdersHttpResponse(
        order.token,
        order.status,
        order.totalPrice,
        order.createdAt,
      );
    });
  }

  @Get('/:orderId')
  @ApiOkResponse({
    type: FindOrderHttpResponse,
  })
  async getOrder(
    @Param('orderId') orderId: string,
  ): Promise<FindOrderHttpResponse> {
    const order = await this.ordersService.getOrder(orderId);

    return new FindOrderHttpResponse(
      order.token,
      order.status,
      order.totalPrice,
      order.createdAt,
      order.meals.map((meal) => ({
        name: meal.name,
        price: meal.price,
        quantity: meal.quantity,
      })),
    );
  }
}
