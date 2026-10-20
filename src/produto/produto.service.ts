import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import { addFavorite } from './dto/favorito.dto.js';

@Injectable()
export class ProdutoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto, userId: string) {
    const vendedor = await this.prismaService.vendedor.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!vendedor) {
      throw new ForbiddenException(
        'Erro ao criar o produto, você não é um vendedor',
      );
    }

    const createProduto = await this.prismaService.produto.create({
      data: {
        vendedorId: vendedor.id,
        ...createProdutoDto,
      },
    });

    return {
      createProduto,
    };
  }

  async criarProduto(createProdutoDto: CreateProdutoDto, userId: string) {
    return this.create(createProdutoDto, userId);
  }

  async addFavorite(favorito: addFavorite, userId: string) {
    const addFavorito = await this.prismaService.favorite.upsert({
      where: {
        userId_produtoId: {
          userId,
          produtoId: favorito.produtoId,
        },
      },
      update: {
        favorito: favorito.favorito ?? true,
      },
      create: {
        userId,
        produtoId: favorito.produtoId,
        favorito: favorito.favorito ?? true,
      },
    });

    return addFavorito;
  }

  async findAllFavorites(userId: string) {
    const allProdutos = await this.prismaService.favorite.findMany({
      where:{
        userId,
        favorito: true,
      }
  });

    return allProdutos;
  }

  async findAll(nome?: string) {
    const allProdutos = await this.prismaService.produto.findMany({
      where:
        nome
          ? {
            nome: {
              contains: nome,
              mode: 'insensitive'
            },
            }
          : {},
    });
    if (allProdutos.length === 0) {
      throw new NotFoundException('Não há nenhum produto cadastrado');
    }

    return allProdutos;
  }

  async findById(id: string) {
    const produto = await this.prismaService.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      throw new NotFoundException(
        'Este produto não existe, para ser encontrado',
      );
    }
    return produto;
  }

  async update(
    id: string,
    updateProdutoDto: UpdateProdutoDto,
    userId: string,
  ) {
    const vendedor = await this.prismaService.vendedor.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
    if (!vendedor) {
      throw new ForbiddenException(
        'Erro ao atualizar o produto, você não é um vendedor',
      );
    }

    const produtoExist = await this.prismaService.produto.findUnique({
      where: { id },
    });
    if (!produtoExist) {
      throw new NotFoundException(
        'Este produto não existe, para ser Atualizado',
      );
    }

    const updateProduto = await this.prismaService.produto.update({
      where: { id: produtoExist.id },
      data: {
        ...updateProdutoDto,
      },
    });

    return updateProduto;
  }

  async remove(id: string) {
    const produtoExist = await this.prismaService.produto.findUnique({
      where: { id },
    });
    if (!produtoExist) {
      throw new NotFoundException(
        'Este produto não existe, para ser removido',
      );
    }
    return this.prismaService.produto.delete({
      where: { id: produtoExist.id },
    });
  }
}
