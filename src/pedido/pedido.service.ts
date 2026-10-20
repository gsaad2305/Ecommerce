import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { SolicitarDevolucaoDto } from './dto/solicitar-devolucao.dto.js';
import { DecidirDevolucaoDto } from './dto/decidir-devolucao.dto.js';
import { STATUSDEVOLUCAO, STATUSPEDIDO } from '../../generated/prisma/client.js';

@Injectable()
export class PedidoService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMeusPedidos(userId: string) {
    return this.prismaService.pedido.findMany({
      where: { userId },
      include: {
        pagamento: true,
        items: {
          include: {
            produto: {
              include: {
                vendedor: true,
              },
            },
            devolucao: true,
          },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  async findOnePedido(pedidoId: string, userId: string) {
    const pedido = await this.prismaService.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        pagamento: true,
        items: {
          include: {
            produto: {
              include: {
                vendedor: true,
              },
            },
            devolucao: true,
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${pedidoId} não encontrado`);
    }

    if (pedido.userId !== userId) {
      throw new ForbiddenException('Acesso negado a este pedido');
    }

    return pedido;
  }

  async solicitarDevolucao(
    userId: string,
    solicitarDevolucaoDto: SolicitarDevolucaoDto,
  ) {
    const { itemPedidoId, quantidade, motivo } = solicitarDevolucaoDto;

    const itemPedido = await this.prismaService.itemPedido.findUnique({
      where: { id: itemPedidoId },
      include: {
        pedido: true,
        devolucao: true,
      },
    });

    if (!itemPedido) {
      throw new NotFoundException('Item do pedido não encontrado');
    }

    if (itemPedido.pedido.userId !== userId) {
      throw new ForbiddenException(
        'Você só pode solicitar devolução dos seus próprios pedidos',
      );
    }

    if (itemPedido.pedido.status !== STATUSPEDIDO.PAGO) {
      throw new BadRequestException(
        `Devoluções só podem ser solicitadas para pedidos com status PAGO. Status atual: ${itemPedido.pedido.status}`,
      );
    }

    if (quantidade <= 0 || quantidade > itemPedido.quantidade) {
      throw new BadRequestException(
        `Quantidade inválida para devolução. Disponível para este item: ${itemPedido.quantidade}`,
      );
    }

    const devolucaoAtiva = itemPedido.devolucao.find(
      (d) =>
        d.status === STATUSDEVOLUCAO.SOLICITADA ||
        d.status === STATUSDEVOLUCAO.EM_ANALISE ||
        d.status === STATUSDEVOLUCAO.APROVADA,
    );

    if (devolucaoAtiva) {
      throw new BadRequestException(
        `Já existe uma solicitação de devolução com status "${devolucaoAtiva.status}" para este item`,
      );
    }

    return this.prismaService.devolucao.create({
      data: {
        itemPedidoId,
        quantidade,
        motivo,
        status: STATUSDEVOLUCAO.SOLICITADA,
      },
    });
  }

  async findDevolucoesVendedor(vendedorUserId: string) {
    const vendedor = await this.prismaService.vendedor.findUnique({
      where: { userId: vendedorUserId },
    });

    if (!vendedor) {
      throw new ForbiddenException('Usuário não possui perfil de vendedor');
    }

    return this.prismaService.devolucao.findMany({
      where: {
        itemPedido: {
          produto: {
            vendedorId: vendedor.id,
          },
        },
      },
      include: {
        itemPedido: {
          include: {
            produto: true,
            pedido: {
              select: {
                id: true,
                userId: true,
                status: true,
                createAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  async decidirDevolucao(
    devolucaoId: string,
    vendedorUserId: string,
    dto: DecidirDevolucaoDto,
  ) {
    const vendedor = await this.prismaService.vendedor.findUnique({
      where: { userId: vendedorUserId },
    });

    if (!vendedor) {
      throw new ForbiddenException('Usuário não possui perfil de vendedor');
    }

    const devolucao = await this.prismaService.devolucao.findUnique({
      where: { id: devolucaoId },
      include: {
        itemPedido: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!devolucao) {
      throw new NotFoundException('Devolução não encontrada');
    }

    if (devolucao.itemPedido.produto.vendedorId !== vendedor.id) {
      throw new ForbiddenException(
        'Você só pode responder a devoluções de produtos da sua loja',
      );
    }

    if (
      devolucao.status !== STATUSDEVOLUCAO.SOLICITADA &&
      devolucao.status !== STATUSDEVOLUCAO.EM_ANALISE
    ) {
      throw new BadRequestException(
        `Esta devolução já foi finalizada com status: ${devolucao.status}`,
      );
    }

    if (
      dto.decisao !== STATUSDEVOLUCAO.APROVADA &&
      dto.decisao !== STATUSDEVOLUCAO.RECUSADA
    ) {
      throw new BadRequestException(
        'A decisão deve ser APROVADA ou RECUSADA',
      );
    }

    return this.prismaService.devolucao.update({
      where: { id: devolucaoId },
      data: {
        status: dto.decisao,
      },
    });
  }
}
