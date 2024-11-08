import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM, EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { Order } from '../../entity/order.entity';
import { Meal } from '../../../meals/entity/meal.entity';
import { UPDATE_ORDER_STATUS_QUEUE } from '../../queue/update-order-status.queue';
import { UpdateOrderStatusJob } from '../../queue/update-order-status.job';
import { OrdersService } from '../orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let ormMock: Pick<MikroORM, 'em'>;
  let queueMock: Partial<Queue>;

  beforeEach(async () => {
    ormMock = {
      em: {
        find: jest.fn(),
        findOne: jest.fn(),
        persistAndFlush: jest.fn(),
      } as any as EntityManager,
    };

    queueMock = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: MikroORM, useValue: ormMock },
        { provide: getRepositoryToken(Order), useValue: {} },
        { provide: getRepositoryToken(Meal), useValue: {} },
        {
          provide: getQueueToken(UPDATE_ORDER_STATUS_QUEUE),
          useValue: queueMock,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order and add a job to the queue', async () => {
      const meals = [
        { mealId: 1, quantity: 2 },
        { mealId: 2, quantity: 3 },
      ];

      const mealsFromDb = [
        { id: 1, name: 'Meal 1', price: 10 },
        { id: 2, name: 'Meal 2', price: 20 },
      ];

      ormMock.em.find = jest.fn().mockResolvedValue(mealsFromDb);
      ormMock.em.persistAndFlush = jest.fn().mockResolvedValue(undefined);
      queueMock.add = jest.fn().mockResolvedValue(undefined);

      await service.createOrder(meals);

      expect(ormMock.em.find).toHaveBeenCalledWith(Meal, {
        id: { $in: [1, 2] },
      });
      expect(ormMock.em.persistAndFlush).toHaveBeenCalled();
      expect(queueMock.add).toHaveBeenCalledWith(
        UpdateOrderStatusJob.name,
        expect.any(UpdateOrderStatusJob),
      );
    });

    it('should throw NotFoundException if some meals are not found', async () => {
      const meals = [
        { mealId: 1, quantity: 2 },
        { mealId: 2, quantity: 3 },
      ];

      ormMock.em.find = jest
        .fn()
        .mockResolvedValue([{ id: 1, name: 'Meal 1', price: 10 }]);

      await expect(service.createOrder(meals)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getOrders', () => {
    it('should return all orders', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      ormMock.em.find = jest.fn().mockResolvedValue(orders);

      const result = await service.getOrders();

      expect(result).toEqual(orders);
      expect(ormMock.em.find).toHaveBeenCalledWith(Order, {});
    });
  });

  describe('getOrder', () => {
    it('should return an order by id', async () => {
      const order = { id: 1, token: 'order1', meals: [] };
      ormMock.em.findOne = jest.fn().mockResolvedValue(order);

      const result = await service.getOrder('order1');

      expect(result).toEqual(order);
      expect(ormMock.em.findOne).toHaveBeenCalledWith(
        Order,
        { token: 'order1' },
        { populate: ['meals'] },
      );
    });

    it('should throw NotFoundException if order is not found', async () => {
      ormMock.em.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getOrder('order1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
