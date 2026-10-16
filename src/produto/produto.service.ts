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
    if (allProdutos.length === 0){
      throw new NotFoundException("Não há nenhum produto cadastrado")
    }

    return allProdutos;
  }

  async encontrarProduto(id: string) {
    const produto = await this.prismaService.produto.findUnique({
      where: { id },
    });

    if(!produto) {
      throw new NotFoundException("Este produto não existe, para ser encontrado")
    }
    return produto;
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

    const updateProduto =  await this.prismaService.produto.update({
      where:{id: produtoExist.id},
      data:{
        ...updateProdutoDto
      }
    });

    return updateProduto;
  }
  async deletarProduto(id: string) {
     const produtoExist = await this.prismaService.produto.findUnique({
      where: {id}
  });
    if(!produtoExist) {
      throw new NotFoundException("Este produto não existe, para ser Atualizado")
    }
    return this.prismaService.produto.delete({
      where: {id: produtoExist.id}
    });
  }
}
