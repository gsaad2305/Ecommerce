import { Test, TestingModule } from '@nestjs/testing';
import { VendedorService } from './vendedor.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import {vi} from "vitest";
import { Vendedor } from './entities/vendedor.entity.js';

describe('VendedorService', () => {
  let service: VendedorService;
  let prismaService: PrismaService;
  let createVendedorDto: CreateVendedorDto = {
    nomeLoja:"teste",
    telefoneLoja: 9999999,
    cnpj: "3233131",
    cepLoja: "312312312"
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendedorService,
        {
          provide: PrismaService,
         useValue: {
          vendedor:{
            create: vi.fn()
          }
          }
        }
      ],

    }).compile();

    service = module.get<VendedorService>(VendedorService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("Create vendedor", () => {
    it("Create", async () => {
      const createVendedor: Vendedor[] = [{
        id: "21331a",
        userId: "ewqw",
        nomeLoja: createVendedorDto.nomeLoja,
        telefoneLoja: createVendedorDto.telefoneLoja,
        cnpj: createVendedorDto.cnpj,
        cepLoja: createVendedorDto.cepLoja
      }];

      vi.spyOn(prismaService.vendedor, "create").mockResolvedValue(createVendedor as any);

      const result = await service.criarContaVendedor(c, userId: string): Promise<string>
    });
  })
});
