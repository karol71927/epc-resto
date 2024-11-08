import { MikroORM } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Order } from '../entity/order.entity';
import { Meal } from '../../meals/entity/meal.entity';
import { UPDATE_ORDER_STATUS_QUEUE } from '../queue/update-order-status.queue';
import { UpdateOrderStatusJob } from '../queue/update-order-status.job';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orm: MikroORM,
    @InjectQueue(UPDATE_ORDER_STATUS_QUEUE)
    private readonly updateOrderStatusQueue: Queue,
  ) {}

  async createOrder(
    meals: {
      mealId: number;
      quantity: number;
    }[],
  ): Promise<void> {
    const mealsFromDb = await this.orm.em.find(Meal, {
      id: {
        $in: meals.map((meal) => meal.mealId),
      },
    });

    if (mealsFromDb.length !== meals.length) {
      throw new NotFoundException('Some meals were not found');
    }

    const order = new Order(
      mealsFromDb.map((meal) => ({
        name: meal.name,
        price: meal.price,
        quantity: meals.find((m) => m.mealId === meal.id)?.quantity ?? 0,
      })),
    );

    await this.orm.em.persistAndFlush(order);

    await this.updateOrderStatusQueue.add(
      UpdateOrderStatusJob.name,
      new UpdateOrderStatusJob(order.id),
    );
  }

  async getOrders(): Promise<Order[]> {
    return this.orm.em.find(Order, {});
  }

  async getOrder(orderId: string): Promise<Order> {
    const order = await this.orm.em.findOne(
      Order,
      { token: orderId },
      { populate: ['meals'] },
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
