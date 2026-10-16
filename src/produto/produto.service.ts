import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';
import { PrismaService } from '../database/prisma.service.js';

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

  // Alias para compatibilidade
  async criarProduto(createProdutoDto: CreateProdutoDto, userId: string) {
    return this.create(createProdutoDto, userId);
  }

  async findAll() {
    const allProdutos = await this.prismaService.produto.findMany();
    if (allProdutos.length === 0) {
      throw new NotFoundException('Não há nenhum produto cadastrado');
    }

    return allProdutos;
  }

  // Alias para compatibilidade
  async todosProdutos() {
    return this.findAll();
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

  // Alias para compatibilidade
  async encontrarProduto(id: string) {
    return this.findById(id);
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

  // Alias para compatibilidade
  async atualizarProduto(
    id: string,
    updateProdutoDto: UpdateProdutoDto,
    userId: string,
  ) {
    return this.update(id, updateProdutoDto, userId);
  }

  async remove(id: string) {
    const produtoExist = await this.prismaService.produto.findUnique({
      where: { id },
    });
    if (!produtoExist) {
      throw new NotFoundException(
        'Este produto não existe, para ser Atualizado',
      );
    }
    return this.prismaService.produto.delete({
      where: { id: produtoExist.id },
    });
  }

  // Alias para compatibilidade
  async deletarProduto(id: string) {
    return this.remove(id);
  }
}
