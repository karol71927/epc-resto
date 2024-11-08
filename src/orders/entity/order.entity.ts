import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

export enum OrderStatus {
  NEW = 'NEW',
  IN_THE_KITCHEN = 'IN_THE_KITCHEN',
  IN_DELIVERY = 'IN_DELIVERY',
  DONE = 'DONE',
}

@Entity()
export class Order {
  @PrimaryKey()
  id!: number;

  @Property()
  token: string = randomUUID();

  @Property({
    name: 'status',
  })
  private _status: OrderStatus = OrderStatus.NEW;
  public get status(): OrderStatus {
    return this._status;
  }

  @Property()
  totalPrice: number;

  @Property({
    lazy: true,
    type: 'jsonb',
  })
  meals: {
    name: string;
    price: number;
    quantity: number;
  }[];

  @Property()
  createdAt: Date = new Date();

  constructor(meals: { name: string; price: number; quantity: number }[]) {
    this.meals = meals;
    this.totalPrice = meals.reduce(
      (acc: number, meal: { price: number; quantity: number }) =>
        acc + meal.price * meal.quantity,
      0,
    );
  }

  makeTransition() {
    switch (this.status) {
      case OrderStatus.NEW:
        this._status = OrderStatus.IN_THE_KITCHEN;
        break;
      case OrderStatus.IN_THE_KITCHEN:
        this._status = OrderStatus.IN_DELIVERY;
        break;
      case OrderStatus.IN_DELIVERY:
        this._status = OrderStatus.DONE;
        break;
      case OrderStatus.DONE:
        throw new Error('Order is already done');
      default:
        throw new Error('Invalid order status');
    }
  }
}
