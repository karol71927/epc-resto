import { OrderStatus } from '../entity/order.entity';

export class OrderStatusUpdatedEvent {
  constructor(
    public readonly token: string,
    public readonly status: OrderStatus,
  ) {}
}
