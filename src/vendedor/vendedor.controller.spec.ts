import { Test, TestingModule } from '@nestjs/testing';
import { VendedorController } from './vendedor.controller.js';
import { VendedorService } from './vendedor.service.js';

describe('VendedorController', () => {
  let controller: VendedorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendedorController],
      providers: [VendedorService],
    }).compile();

    controller = module.get<VendedorController>(VendedorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
