import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoService } from './produto.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { Prisma, Produto } from '../../generated/prisma/client.js';
import { CreateProdutoDto } from './dto/create-produto.dto.js';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let prismaService: any;
  const createprodutoDto: CreateProdutoDto = {
    nome: 'teste k10',
    preco: 58.61,
    estoque: 2112,
    descricao: 'Produto de teste',
    tags: ['teste1', 'teste2', 'teste3'],
  };

  beforeEach(async () => {
    prismaService = {
      produto: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      vendedor: {
        findUnique: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
  });

  describe('produtos', () => {
    it('vendo todos os produtos', async () => {
      const newProduto: Produto[] = [
        {
          id: '123',
          vendedorId: 'saw',
          nome: 'teste k10',
          preco: new Prisma.Decimal('57.54'),
          estoque: 2112,
          descricao: 'Produto de teste',
          tags: ['teste1', 'teste2', 'teste3'],
        },
      ];
      prismaService.produto.findMany.mockResolvedValue(newProduto);
      const result = await service.findAll();
      expect(result).toEqual(newProduto);
      expect(prismaService.produto.findMany).toHaveBeenCalledOnce();
    });

    it('Lançar erro se produto não encontrado', async () => {
      prismaService.produto.findUnique.mockResolvedValue(null);

      await expect(service.findById('123')).rejects.toThrow(
        'Este produto não existe, para ser encontrado',
      );
    });
  });

  describe('Criacao de um Produto', () => {
    it('criando um produto com vendedor válido', async () => {
      const newProduto = {
        id: '123',
        vendedorId: 'saw',
        nome: 'teste k10',
        preco: new Prisma.Decimal('57.54'),
        estoque: 2112,
        descricao: 'Produto de teste',
        tags: ['teste1', 'teste2', 'teste3'],
      };

      prismaService.vendedor.findUnique.mockResolvedValue({ id: 'saw' });
      prismaService.produto.create.mockResolvedValue(newProduto as any);

      const result = await service.create(createprodutoDto, 'user-123');

      expect(prismaService.vendedor.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { id: true },
      });
      expect(prismaService.produto.create).toHaveBeenCalledWith({
        data: {
          vendedorId: 'saw',
          ...createprodutoDto,
        },
      });
      expect(result).toEqual({ createProduto: newProduto });
    });
  });
});
