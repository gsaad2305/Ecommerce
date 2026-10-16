import { Test, TestingModule } from '@nestjs/testing';
import { CarrinhoController } from './carrinho.controller.js';
import { CarrinhoService } from './carrinho.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('CarrinhoController', () => {
  let controller: CarrinhoController;
  let service: CarrinhoService;

  const mockCarrinhoService = {
    findByUserId: vi.fn(),
    addItem: vi.fn(),
    updateItemQuantity: vi.fn(),
    removeItem: vi.fn(),
    clearCart: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarrinhoController],
      providers: [
        {
          provide: CarrinhoService,
          useValue: mockCarrinhoService,
        },
      ],
    }).compile();

    controller = module.get<CarrinhoController>(CarrinhoController);
    service = module.get<CarrinhoService>(CarrinhoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get cart for authenticated user', async () => {
    const req = { user: { id: 'u1' } } as any;
    mockCarrinhoService.findByUserId.mockResolvedValue({ id: 'cart-1' });

    const result = await controller.getCart(req);
    expect(service.findByUserId).toHaveBeenCalledWith('u1');
    expect(result).toEqual({ id: 'cart-1' });
  });
});
