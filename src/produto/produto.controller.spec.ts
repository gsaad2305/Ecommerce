import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller.js';
import { ProdutoService } from './produto.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  const mockProdutoService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: mockProdutoService,
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
