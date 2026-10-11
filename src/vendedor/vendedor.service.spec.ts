import { Test, TestingModule } from '@nestjs/testing';
import { VendedorService } from './vendedor.service.js';

import { PrismaService } from '../database/prisma.service.js';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import { vi } from 'vitest';

describe('VendedorService', () => {
  let service: VendedorService;
  let prismaService: PrismaService;
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
      ],
    }).compile();

    service = module.get<VendedorService>(VendedorService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Create vendedor', () => {
    it('creates a seller account for an existing user', async () => {
      const userId = 'ewqw';
      const createdVendedor = {
        id: '21331a',
        userId,
        ...createVendedorDto,
      };

      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue({ id: userId } as any);
      vi.spyOn(prismaService.vendedor, 'findFirst').mockResolvedValue(null);
      vi.spyOn(prismaService.vendedor, 'create').mockResolvedValue(createdVendedor as any);

      await expect(service.criarContaVendedor(createVendedorDto, userId)).resolves.toEqual(
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
