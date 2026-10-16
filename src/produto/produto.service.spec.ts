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
     nome: 'teste k10',
    preco: 58.61,
    estoque: 2112,
    descricao: 'Produto de teste',
    tags: ['teste1', 'teste2', 'teste3'],
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
        },
      ];
     vi.spyOn(prismaService.produto, 'findMany').mockResolvedValue(newProduto);
    const result = await service.todosProdutos()
    expect(result).toEqual(newProduto)
    expect(prismaService.produto.findMany).toHaveBeenCalledOnce();
    });

    it('Lançar erro', async () => {
      vi.spyOn(prismaService.produto,"findMany").mockRejectedValue(new Error("Erro"));

      await  expect(service.encontrarProduto('123')).rejects.toThrow(
        "Erro"
      );
    });
  });
  describe("Criacao de um Produto", () => {
    it("criando um produto", async () => {
      const newProduto= {
        id: '123',
         vendedorId: 'saw',
          nome: 'teste k10',
          preco: new Prisma.Decimal('57.54'),
          estoque: 2112,
          descricao: 'Produto de teste',
          tags: ['teste1', 'teste2', 'teste3'],
      }
      vi.spyOn(prismaService.produto, "create").mockResolvedValue(newProduto as any);

      const result = await service.criarProduto(createprodutoDto, '123');

      expect(prismaService.produto.create).toHaveBeenCalledWith({
        data: createprodutoDto,
      });
      expect(result).toEqual(newProduto);
    });
  })
});
