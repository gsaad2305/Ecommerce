import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class ProdutoService {
  constructor(
    private readonly prismaService: PrismaService
  ){}
  async create(createprodutoDto: CreateProdutoDto) {
    const newProduto = await this.prismaService.produto.create({
      data: {
        ...createprodutoDto
      }
    });
    return newProduto;
  }

  async findAll() {
    return await this.prismaService.produto.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} produto`;
  }

  update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return `This action updates a #${id} produto`;
  }

  remove(id: number) {
    return `This action removes a #${id} produto`;
  }
}
