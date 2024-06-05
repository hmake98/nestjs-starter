import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from 'src/common/helper/services/prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      jest.spyOn(service, '$connect').mockResolvedValueOnce(undefined);
      await service.onModuleInit();
      expect(service.$connect).toHaveBeenCalled();
    });
  });

  describe('isHealthy', () => {
    it('should return up status when the database is reachable', async () => {
      jest.spyOn(service, '$queryRaw').mockResolvedValueOnce(undefined);
      const result = await service.isHealthy();
      expect(result).toEqual({
        prisma: {
          status: 'up',
        },
      });
    });

    it('should return down status when the database is not reachable', async () => {
      jest
        .spyOn(service, '$queryRaw')
        .mockRejectedValueOnce(new Error('Database error'));
      const result = await service.isHealthy();
      expect(result).toEqual({
        prisma: {
          status: 'down',
        },
      });
    });
  });
});
