import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { Category } from '../../entity/category.entity';
import { CategoriesService } from '../categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let orm: MikroORM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: MikroORM,
          useValue: {
            em: {
              find: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    orm = module.get<MikroORM>(MikroORM);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all categories', async () => {
    jest
      .spyOn(orm.em, 'find')
      .mockResolvedValue([{ id: 1, name: 'TestCategory' } as any]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, name: 'TestCategory' }]);
    expect(orm.em.find).toHaveBeenCalledWith(Category, {});
  });
});
