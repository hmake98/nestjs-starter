import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;

  beforeEach(() => {
    adminService = new AdminService();
    adminController = new AdminController(adminService);
  });
});