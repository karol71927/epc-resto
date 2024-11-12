import { Logger } from '@nestjs/common';
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { OrderStatus } from '../entity/order.entity';
import { OrderStatusService } from './order-status.service';

@WebSocketGateway()
export class OrderStatusGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(OrderStatusGateway.name);

  constructor(private readonly orderStatusService: OrderStatusService) {}

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('orderStatus')
  streamOrderStatus(): Observable<
    WsResponse<{ token: string; status: OrderStatus }>
  > {
    const stream$ = this.orderStatusService.streamOrderStatus();

    return from(stream$).pipe(
      map((data) => ({ event: 'orderStatusStream', data })),
    );
  }
}
