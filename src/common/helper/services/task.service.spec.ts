import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('handleCron', () => {
    it('should log a message when cron job is triggered', () => {
      const loggerSpy = jest.spyOn(taskService['logger'], 'log');
      taskService.handleCron();
      expect(loggerSpy).toHaveBeenCalledWith('Called when at 12 midnight');
    });
  });
});
