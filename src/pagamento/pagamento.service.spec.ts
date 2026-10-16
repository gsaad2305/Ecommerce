import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoService } from './pagamento.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { METODOPAGAMENTO, STATUSPEDIDO } from '../../generated/prisma/client.js';
import { BadRequestException } from '@nestjs/common';

describe('PagamentoService', () => {
  let service: PagamentoService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: vi.fn(),
      },
      pedido: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      pagamento: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      produto: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      entrega: {
        create: vi.fn(),
      },
      itemCarrinho: {
        deleteMany: vi.fn(),
      },
      $transaction: vi.fn(async (cb) => cb(prismaService)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<PagamentoService>(PagamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkout', () => {
    const userId = 'user-123';
    const mockUser = {
      id: userId,
      endereco: [
        {
          id: 'end-1',
          cep: '12345-678',
          rua: 'Rua das Flores',
          numero: '100',
          complemento: 'Apto 1',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      ],
      carrinho: {
        id: 'cart-1',
        items: [
          {
            id: 'item-1',
            produtoId: 'prod-1',
            quantidade: 2,
            produto: {
              id: 'prod-1',
              nome: 'Camiseta',
              preco: 50.0,
              estoque: 10,
            },
          },
        ],
      },
    };

    it('deve realizar checkout com sucesso e alterar estoque', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.produto.findUnique.mockResolvedValue({
        id: 'prod-1',
        nome: 'Camiseta',
        estoque: 10,
      });
      prismaService.produto.update.mockResolvedValue({
        id: 'prod-1',
        estoque: 8,
      });
      prismaService.pedido.create.mockResolvedValue({
        id: 'pedido-1',
        status: STATUSPEDIDO.PAGO,
        items: [
          {
            id: 'item-pedido-1',
            produtoId: 'prod-1',
            quantidade: 2,
            precoUnitario: 50.0,
          },
        ],
      });
      prismaService.pagamento.create.mockResolvedValue({
        id: 'pag-1',
        pedidoId: 'pedido-1',
        metodoPagamento: METODOPAGAMENTO.PIX,
        status: 'APROVADO',
      });
      prismaService.entrega.create.mockResolvedValue({
        id: 'ent-1',
        codigoRastreio: 'BR12345678',
        status: 'SOLICITADA',
      });
      prismaService.itemCarrinho.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.checkout(userId, {
        metodoPagamento: METODOPAGAMENTO.PIX,
      });

      expect(result.pedidoId).toBe('pedido-1');
      expect(result.pagamento.status).toBe('APROVADO');
      expect(prismaService.produto.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: {
          estoque: {
            decrement: 2,
          },
        },
      });
      expect(prismaService.itemCarrinho.deleteMany).toHaveBeenCalledWith({
        where: { carrinhoId: 'cart-1' },
      });
    });

    it('deve lançar erro se o estoque for insuficiente', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.produto.findUnique.mockResolvedValue({
        id: 'prod-1',
        nome: 'Camiseta',
        estoque: 1,
      });

      await expect(
        service.checkout(userId, {
          metodoPagamento: METODOPAGAMENTO.PIX,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar erro se o carrinho estiver vazio', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        carrinho: { id: 'cart-1', items: [] },
      });

      await expect(
        service.checkout(userId, {
          metodoPagamento: METODOPAGAMENTO.PIX,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar erro se o usuário não possuir endereço', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        endereco: [],
      });

      await expect(
        service.checkout(userId, {
          metodoPagamento: METODOPAGAMENTO.PIX,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
