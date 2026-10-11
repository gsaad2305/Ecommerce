import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class ProdutoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto) {
    return this.prismaService.produto.create({
      data: {
        ...createProdutoDto,
        tempoEntrega: new Date()
      }
    });
  }

  async findAll() {
    return this.prismaService.produto.findMany();
  }

  async findOne(id: string | number) {
    return this.prismaService.produto.findUnique({
      where: { id: String(id) },
    });
  }

  async update(id: string | number, updateProdutoDto: UpdateProdutoDto) {
    return this.prismaService.produto.update({
      where: { id: String(id) },
      data: updateProdutoDto,
    });
  }

  async remove(id: string | number) {
    return this.prismaService.produto.delete({
      where: { id: String(id) },
    });
  }
}
