import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProdutoService {
  constructor(private readonly prismaService: PrismaService) {}

  async criarProduto(createProdutoDto: CreateProdutoDto, userId: string) {
    const vendedor = await this.prismaService.vendedor.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true
      }
    });

    if(!vendedor) {
      throw new ForbiddenException("Erro ao criar o produto, você não é um vendedor");
    }

    const createProduto = await this.prismaService.produto.create({
      data: {
        vendedorId: vendedor.id,
        ...createProdutoDto,
      }
    });

    return {
      createProduto,
    }
  }

  async todosProdutos() {
    const allProdutos = await this.prismaService.produto.findMany();
    if(!allProdutos){
      throw new NotFoundException("Nenhum produto ainda registrado")
    }

    return allProdutos;
  }

  async encontrarProduto(id: string) {
    return this.prismaService.produto.findUnique({
      where: { id },
    });
  }

  async atualizarProduto(id: string, updateProdutoDto: UpdateProdutoDto, userId:string){
      const vendedor = this.prismaService.vendedor.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true
      }
    });
      if(!vendedor) {
      throw new ForbiddenException("Erro ao criar o produto, você não é um vendedor");
    }
    const produtoExist = await this.prismaService.produto.findUnique({
      where: {id}
  });
    if(!produtoExist) {
      throw new NotFoundException("Este produto não existe, para ser Atualizado")
    }

    return await this.prismaService.produto.update({
      where:{id: produtoExist.id},
      data:{
        ...updateProdutoDto
      }
    })
  }
  async deletarProduto(id: string) {
     const produtoExist = await this.prismaService.produto.findUnique({
      where: {id}
  });
    if(!produtoExist) {
      throw new NotFoundError("Este produto não existe, para ser Atualizado")
    }
    return this.prismaService.produto.delete({
      where: {id: produtoExist.id}
    });
  }
}
