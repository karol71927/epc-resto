import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateOrderStatusJob } from './update-order-status.job';
import { UPDATE_ORDER_STATUS_QUEUE } from './update-order-status.queue';
import { Order, OrderStatus } from '../entity/order.entity';
import { OrderStatusUpdatedEvent } from '../event/order-status.updated.event';

@Processor(UPDATE_ORDER_STATUS_QUEUE)
export class UpdateOrderStatusConsumer extends WorkerHost {
  private readonly logger = new Logger(UpdateOrderStatusConsumer.name);

  constructor(
    private readonly orm: MikroORM,
    @InjectQueue(UPDATE_ORDER_STATUS_QUEUE)
    private readonly updateOrderStatusQueue: Queue,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  @CreateRequestContext()
  async process(job: Job<UpdateOrderStatusJob>) {
    this.logger.log(
      `Processing job ${job.id} of type ${
        job.name
      } with payload ${JSON.stringify(job.data)}`,
    );

    const order = await this.orm.em.findOne(Order, { id: job.data.orderId });

    if (!order) {
      this.logger.error(`Order with id ${job.data.orderId} not found`);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate processing time

    order.makeTransition();

    await this.orm.em.flush();

    if (order.status !== OrderStatus.DONE) {
      await this.updateOrderStatusQueue.add(
        UpdateOrderStatusJob.name,
        new UpdateOrderStatusJob(order.id),
      );
    }

    this.eventEmitter.emit(
      OrderStatusUpdatedEvent.name,
      new OrderStatusUpdatedEvent(order.token, order.status),
    );
  }
}
