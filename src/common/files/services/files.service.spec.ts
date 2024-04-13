import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('FilesService', () => {
  let filesService: FilesService;

  const prismaServiceMock = {
    files: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: PrismaService, useValue: prismaServiceMock },
        ConfigService,
      ],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filesService).toBeDefined();
  });
});
