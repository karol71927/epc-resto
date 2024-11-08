import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Order } from './entity/order.entity';
import { UPDATE_ORDER_STATUS_QUEUE } from './queue/update-order-status.queue';
import { UpdateOrderStatusConsumer } from './queue/update-order-status.consumer';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './http/controller/orders.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Order],
    }),
    BullModule.registerQueue({
      name: UPDATE_ORDER_STATUS_QUEUE,
      defaultJobOptions: {
        attempts: 10,
        delay: 0,
        backoff: {
          type: 'exponential',
          delay: 60 * 1000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UpdateOrderStatusConsumer],
})
export class OrdersModule {}
