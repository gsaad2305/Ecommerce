import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoService } from './produto.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { vi } from 'vitest';
import { Prisma, Produto } from '../../generated/prisma/client.js';
import { CreateProdutoDto } from './dto/create-produto.dto.js';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let prismaService: PrismaService;
  const createprodutoDto: CreateProdutoDto = {
     vendedorId: 'saw',
     nome: 'teste k10',
    preco: new Prisma.Decimal('57.54'),
    estoque: 2112,
    descricao: 'Produto de teste',
    tags: ['teste1', 'teste2', 'teste3'],
    tempoEntrega: new Date('2026-10-06T00:00:00.000Z'),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: PrismaService,
          useValue: {
            produto: {
              findMany: vi.fn(),
              create: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
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
          tempoEntrega: new Date('2026-10-06T00:00:00.000Z'),
        },
      ];
     vi.spyOn(prismaService.produto, 'findMany').mockResolvedValue(newProduto);
    const result = await service.findAll()
    expect(result).toEqual(newProduto)
    expect(prismaService.produto.findMany).toHaveBeenCalledOnce();
    });

    it('Lançar erro', async () => {
      vi.spyOn(prismaService.produto,"findMany").mockRejectedValue(new Error("Erro"));

      await  expect(service.findAll()).rejects.toThrow(
        "Erro"
      );
    });
  });
  describe("Criacao de um Produto", () => {
    it("criando um produto", async () => {
      const newProduto: Produto = {
        id: '123',
        ...createprodutoDto
      }
      vi.spyOn(prismaService.produto, "create").mockResolvedValue(newProduto);

      const result = await service.create(createprodutoDto);

      expect(prismaService.produto.create).toHaveBeenCalledWith({
        data: createprodutoDto,
      });
      expect(result).toEqual(newProduto);
    });
  })
});
