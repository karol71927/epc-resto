import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderStatus } from '../entity/order.entity';
import { OrderStatusUpdatedEvent } from '../event/order-status.updated.event';

@Injectable()
export class OrderStatusService {
  private readonly orderStatus$ = new Subject<{
    token: string;
    status: OrderStatus;
  }>();

  streamOrderStatus() {
    return this.orderStatus$.asObservable();
  }

  updateOrderStatus(token: string, status: OrderStatus) {
    this.orderStatus$.next({ token, status });
  }

  @OnEvent(OrderStatusUpdatedEvent.name)
  onOrderStatusUpdated(event: OrderStatusUpdatedEvent) {
    this.updateOrderStatus(event.token, event.status);
  }
}
