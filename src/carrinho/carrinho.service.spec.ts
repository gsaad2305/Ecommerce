import { Test, TestingModule } from '@nestjs/testing';
import { CarrinhoService } from './carrinho.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('CarrinhoService', () => {
  let service: CarrinhoService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: vi.fn(),
      },
      carrinho: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      produto: {
        findUnique: vi.fn(),
      },
      itemCarrinho: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarrinhoService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<CarrinhoService>(CarrinhoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar carrinho existente para o usuário', async () => {
    prismaService.user.findUnique.mockResolvedValue({ id: 'u1' });
    prismaService.carrinho.findUnique.mockResolvedValue({
      id: 'cart-1',
      userId: 'u1',
      items: [],
    });

    const result = await service.findByUserId('u1');
    expect(result.id).toBe('cart-1');
  });
});
