import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import { UpdateVendedorDto } from './dto/update-vendedor.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import { ExceptionErros } from '../common/exeptionErros/erros.js';

@Injectable()
export class VendedorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionErros: ExceptionErros,
  ) {}

  async create(createVendedorDto: CreateVendedorDto, userId: string) {
    await this.exceptionErros.execptionErros(userId);
    const vendedorExiste = await this.prismaService.vendedor.findFirst({
      where: {
        userId,
      },
    });

    if (vendedorExiste) {
      throw new ConflictException('Vendedor existe');
    }

    return this.prismaService.vendedor.create({
      data: {
        userId,
        nomeLoja: createVendedorDto.nomeLoja,
        cnpj: createVendedorDto.cnpj,
        telefoneLoja: createVendedorDto.telefoneLoja,
        cepLoja: createVendedorDto.cepLoja,
      },
    });
  }

  async criarContaVendedor(
    createVendedorDto: CreateVendedorDto,
    userId: string,
  ) {
    return this.create(createVendedorDto, userId);
  }

  async findAll() {
    const lojas = await this.prismaService.vendedor.findMany({
      select: {
        vendedor: {
          select: {
            name: true,
          },
        },
        nomeLoja: true,
        telefoneLoja: true,
        cepLoja: true,
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            estoque: true,
            descricao: true,
            tags: true,
          },
        },
      },
    });
    if (lojas.length === 0) {
      throw new NotFoundException('Nenhuma loja cadastrada');
    }

    return {
      lojas,
    };
  }

  async verificarContaVendedor() {
    return this.findAll();
  }

  async findByUserId(userId: string) {
    return this.prismaService.vendedor.findUnique({
      where: {
        userId,
      },
    });
  }

  async minhaLoja(userId: string) {
    return this.findByUserId(userId);
  }

  async update(userId: string, updateVendedorDto: UpdateVendedorDto) {
    return this.prismaService.vendedor.update({
      where: {
        userId,
      },
      data: {
        ...updateVendedorDto,
      },
    });
  }

  async remove(userId: string) {
    return this.prismaService.vendedor.delete({
      where: {
        userId,
      },
    });
  }

  async deletarContaVendedor(userId: string) {
    return this.remove(userId);
  }
}
