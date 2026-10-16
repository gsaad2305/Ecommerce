import { Test, TestingModule } from '@nestjs/testing';
import { VendedorController } from './vendedor.controller.js';
import { VendedorService } from './vendedor.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('VendedorController', () => {
  let controller: VendedorController;
  let service: VendedorService;

  const mockVendedorService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findByUserId: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendedorController],
      providers: [
        {
          provide: VendedorService,
          useValue: mockVendedorService,
        },
      ],
    }).compile();

    controller = module.get<VendedorController>(VendedorController);
    service = module.get<VendedorService>(VendedorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
