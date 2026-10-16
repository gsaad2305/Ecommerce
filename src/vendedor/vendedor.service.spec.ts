import { Test, TestingModule } from '@nestjs/testing';
import { VendedorService } from './vendedor.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import { ExceptionErros } from '../common/exeptionErros/erros.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('VendedorService', () => {
  let service: VendedorService;
  let prismaService: PrismaService;
  let exceptionErros: ExceptionErros;

  const createVendedorDto: CreateVendedorDto = {
    nomeLoja: 'teste',
    telefoneLoja: 9999999,
    cnpj: '3233131',
    cepLoja: '312312312',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendedorService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: vi.fn(),
            },
            vendedor: {
              findFirst: vi.fn(),
              create: vi.fn(),
            },
          },
        },
        {
          provide: ExceptionErros,
          useValue: {
            execptionErros: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<VendedorService>(VendedorService);
    prismaService = module.get<PrismaService>(PrismaService);
    exceptionErros = module.get<ExceptionErros>(ExceptionErros);
  });

  describe('Create vendedor', () => {
    it('creates a seller account for an existing user', async () => {
      const userId = 'ewqw';
      const createdVendedor = {
        id: '21331a',
        userId,
        ...createVendedorDto,
      };

      vi.spyOn(prismaService.vendedor, 'findFirst').mockResolvedValue(null);
      vi.spyOn(prismaService.vendedor, 'create').mockResolvedValue(createdVendedor as any);

      await expect(service.create(createVendedorDto, userId)).resolves.toEqual(
        createdVendedor,
      );
      expect(prismaService.vendedor.create).toHaveBeenCalledWith({
        data: {
          userId,
          ...createVendedorDto,
        },
      });
    });
  });
});
