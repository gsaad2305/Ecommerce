import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { AddItemCarrinhoDto } from './dto/add-item-carrinho.dto.js';
import { UpdateItemCarrinhoDto } from './dto/update-item-carrinho.dto.js';

@Injectable()
export class CarrinhoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOrCreateCart(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    let carrinho = await this.prismaService.carrinho.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!carrinho) {
      carrinho = await this.prismaService.carrinho.create({
        data: { userId },
        include: {
          items: {
            include: {
              produto: true,
            },
          },
        },
      });
    }

    return carrinho;
  }

  async findByUserId(userId: string) {
    return this.getOrCreateCart(userId);
  }

  async getCarrinhoUsuario(userId: string) {
    return this.findByUserId(userId);
  }

  async addItem(userId: string, addItemDto: AddItemCarrinhoDto) {
    const carrinho = await this.getOrCreateCart(userId);

    const produto = await this.prismaService.produto.findUnique({
      where: { id: addItemDto.produtoId },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    const itemExistente = await this.prismaService.itemCarrinho.findUnique({
      where: {
        produtoId_carrinhoId: {
          carrinhoId: carrinho.id,
          produtoId: addItemDto.produtoId,
        },
      },
    });

    const novaQuantidade = (itemExistente ? itemExistente.quantidade : 0) + addItemDto.quantidade;

    if (produto.estoque < novaQuantidade) {
      throw new BadRequestException(
        `Quantidade solicitada (${novaQuantidade}) excede o estoque disponível (${produto.estoque})`,
      );
    }

    if (itemExistente) {
      await this.prismaService.itemCarrinho.update({
        where: { id: itemExistente.id },
        data: { quantidade: novaQuantidade },
      });
    } else {
      await this.prismaService.itemCarrinho.create({
        data: {
          carrinhoId: carrinho.id,
          produtoId: addItemDto.produtoId,
          quantidade: addItemDto.quantidade,
        },
      });
    }

    return this.findByUserId(userId);
  }

  async adicionarItem(userId: string, addItemDto: AddItemCarrinhoDto) {
    return this.addItem(userId, addItemDto);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    updateDto: UpdateItemCarrinhoDto,
  ) {
    const carrinho = await this.getOrCreateCart(userId);

    const item = await this.prismaService.itemCarrinho.findUnique({
      where: { id: itemId },
      include: { produto: true },
    });

    if (!item || item.carrinhoId !== carrinho.id) {
      throw new NotFoundException('Item do carrinho não encontrado');
    }

    if (item.produto.estoque < updateDto.quantidade) {
      throw new BadRequestException(
        `Quantidade solicitada (${updateDto.quantidade}) excede o estoque disponível (${item.produto.estoque})`,
      );
    }

    await this.prismaService.itemCarrinho.update({
      where: { id: itemId },
      data: { quantidade: updateDto.quantidade },
    });

    return this.findByUserId(userId);
  }

  async atualizarQuantidadeItem(
    userId: string,
    itemId: string,
    updateDto: UpdateItemCarrinhoDto,
  ) {
    return this.updateItemQuantity(userId, itemId, updateDto);
  }

  async removeItem(userId: string, itemId: string) {
    const carrinho = await this.getOrCreateCart(userId);

    const item = await this.prismaService.itemCarrinho.findUnique({
      where: { id: itemId },
    });

    if (!item || item.carrinhoId !== carrinho.id) {
      throw new NotFoundException('Item do carrinho não encontrado');
    }

    await this.prismaService.itemCarrinho.delete({
      where: { id: itemId },
    });

    return this.findByUserId(userId);
  }

  async removerItem(userId: string, itemId: string) {
    return this.removeItem(userId, itemId);
  }

  async clearCart(userId: string) {
    const carrinho = await this.getOrCreateCart(userId);

    await this.prismaService.itemCarrinho.deleteMany({
      where: { carrinhoId: carrinho.id },
    });

    return this.findByUserId(userId);
  }

  async limparCarrinho(userId: string) {
    return this.clearCart(userId);
  }
}
