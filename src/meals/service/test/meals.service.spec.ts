import { MikroORM, EntityManager } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Meal } from '../../entity/meal.entity';
import { MealsService } from '../meals.service';

describe('MealsService', () => {
  let service: MealsService;
  let orm: MikroORM;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealsService,
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

    service = module.get<MealsService>(MealsService);
    orm = module.get<MikroORM>(MikroORM);
    em = orm.em;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call find with correct query when categoryIds are provided', async () => {
    const categoryIds = [1, 2, 3];
    const mockMeals = [
      { id: 1, name: 'Meal 1' },
      { id: 2, name: 'Meal 2' },
    ];
    jest.spyOn(em, 'find').mockResolvedValue(mockMeals as any);

    const result = await service.getMeals(categoryIds);

    expect(em.find).toHaveBeenCalledWith(
      Meal,
      { category: { $in: categoryIds } },
      { populate: ['category'] },
    );
    expect(result).toEqual(mockMeals);
  });

  it('should call find with empty query when categoryIds are not provided', async () => {
    const mockMeals = [
      { id: 1, name: 'Meal 1' },
      { id: 2, name: 'Meal 2' },
    ];
    jest.spyOn(em, 'find').mockResolvedValue(mockMeals as any);

    const result = await service.getMeals();

    expect(em.find).toHaveBeenCalledWith(Meal, {}, { populate: ['category'] });
    expect(result).toEqual(mockMeals);
  });
});
