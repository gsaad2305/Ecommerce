import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { ProcessPaymentDto } from './dto/process-payment.dto.js';
import { CreatePagamentoDto } from './dto/create-pagamento.dto.js';
import {
  METODOPAGAMENTO,
  STATUSENTREGA,
  STATUSPAGAMENTO,
  STATUSPEDIDO,
} from '../../generated/prisma/client.js';

@Injectable()
export class PagamentoService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Processa o checkout completo a partir do carrinho do usuário autenticado.
   * Executa em transação atômica:
   * 1. Valida existência e itens do carrinho
   * 2. Valida e debita o estoque de cada produto
   * 3. Cria o Pedido e ItemPedido associados
   * 4. Gera o Pagamento aprovado
   * 5. Cria a Entrega associada ao endereço do usuário
   * 6. Limpa o carrinho
   */
  async checkout(userId: string, processPaymentDto: ProcessPaymentDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        endereco: true,
        carrinho: {
          include: {
            items: {
              include: {
                produto: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.carrinho || user.carrinho.items.length === 0) {
      throw new BadRequestException('O carrinho está vazio');
    }

    if (user.endereco.length === 0) {
      throw new BadRequestException(
        'Cadastre pelo menos um endereço antes de finalizar a compra',
      );
    }

    const enderecoEntrega = user.endereco[0];

    // Simulação do gateway de pagamento
    const gatewayResult = this.simulateGatewayCharge(processPaymentDto);
    if (!gatewayResult.success) {
      throw new BadRequestException(
        `Falha na aprovação do pagamento: ${gatewayResult.reason}`,
      );
    }

    return this.prismaService.$transaction(async (tx) => {
      // 1. Validar e deduzir o estoque de cada produto
      for (const item of user.carrinho!.items) {
        const produtoAtual = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produtoAtual) {
          throw new NotFoundException(
            `Produto ID ${item.produtoId} não foi encontrado`,
          );
        }

        if (produtoAtual.estoque < item.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto "${produtoAtual.nome}". Disponível: ${produtoAtual.estoque}, solicitado: ${item.quantidade}`,
          );
        }

        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              decrement: item.quantidade,
            },
          },
        });
      }

      // 2. Criar Pedido com os itens
      const pedido = await tx.pedido.create({
        data: {
          userId,
          status: STATUSPEDIDO.PAGO,
          items: {
            create: user.carrinho!.items.map((item) => ({
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              precoUnitario: item.produto.preco,
            })),
          },
        },
        include: {
          items: {
            include: {
              produto: true,
            },
          },
        },
      });

      // 3. Registrar o Pagamento como APROVADO
      const pagamento = await tx.pagamento.create({
        data: {
          pedidoId: pedido.id,
          metodoPagamento: processPaymentDto.metodoPagamento,
          status: STATUSPAGAMENTO.APROVADO,
        },
      });

      // 4. Criar registro de Entrega com base no endereço cadastrado
      const entrega = await tx.entrega.create({
        data: {
          pedidoId: pedido.id,
          status: STATUSENTREGA.SOLICITADA,
          codigoRastreio: `BR${Date.now().toString().slice(-8)}`,
          cep: enderecoEntrega.cep,
          rua: enderecoEntrega.rua,
          complemento: enderecoEntrega.complemento,
          bairro: enderecoEntrega.bairro,
          cidade: enderecoEntrega.cidade,
          estado: enderecoEntrega.estado,
        },
      });

      // 5. Limpar os itens do carrinho após a compra concluída
      await tx.itemCarrinho.deleteMany({
        where: { carrinhoId: user.carrinho!.id },
      });

      return {
        message: 'Compra e pagamento processados com sucesso!',
        pedidoId: pedido.id,
        statusPedido: pedido.status,
        pagamento: {
          id: pagamento.id,
          status: pagamento.status,
          metodo: pagamento.metodoPagamento,
          gatewayTransactionId: gatewayResult.transactionId,
        },
        entrega: {
          id: entrega.id,
          status: entrega.status,
          codigoRastreio: entrega.codigoRastreio,
        },
        itens: pedido.items,
      };
    });
  }

  /**
   * Processa pagamento de um pedido já existente pendente de pagamento
   */
  async processExistingOrderPayment(
    userId: string,
    createPagamentoDto: CreatePagamentoDto,
  ) {
    const pedido = await this.prismaService.pedido.findUnique({
      where: { id: createPagamentoDto.pedidoId },
      include: {
        items: true,
        pagamento: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (pedido.userId !== userId) {
      throw new BadRequestException('Pedido não pertence ao usuário autenticado');
    }

    if (pedido.status === STATUSPEDIDO.PAGO) {
      throw new BadRequestException('Este pedido já foi pago anteriormente');
    }

    const gatewayResult = this.simulateGatewayCharge({
      metodoPagamento: createPagamentoDto.metodoPagamento,
    });

    if (!gatewayResult.success) {
      throw new BadRequestException(
        `Falha na aprovação do pagamento: ${gatewayResult.reason}`,
      );
    }

    return this.prismaService.$transaction(async (tx) => {
      // Deduzir o estoque caso o pedido ainda não tenha abatido
      for (const item of pedido.items) {
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          throw new NotFoundException(`Produto ${item.produtoId} não encontrado`);
        }

        if (produto.estoque < item.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto "${produto.nome}"`,
          );
        }

        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              decrement: item.quantidade,
            },
          },
        });
      }

      await tx.pedido.update({
        where: { id: pedido.id },
        data: { status: STATUSPEDIDO.PAGO },
      });

      const pagamento = pedido.pagamento
        ? await tx.pagamento.update({
            where: { id: pedido.pagamento.id },
            data: {
              status: STATUSPAGAMENTO.APROVADO,
              metodoPagamento: createPagamentoDto.metodoPagamento,
            },
          })
        : await tx.pagamento.create({
            data: {
              pedidoId: pedido.id,
              status: STATUSPAGAMENTO.APROVADO,
              metodoPagamento: createPagamentoDto.metodoPagamento,
            },
          });

      return {
        message: 'Pagamento efetuado com sucesso!',
        pedidoId: pedido.id,
        pagamento,
        gatewayTransactionId: gatewayResult.transactionId,
      };
    });
  }

  async findAll(userId: string) {
    return this.prismaService.pagamento.findMany({
      where: {
        pedido: {
          userId,
        },
      },
      include: {
        pedido: {
          include: {
            items: {
              include: {
                produto: true,
              },
            },
            entrega: true,
          },
        },
      },
    });
  }

  async findById(id: string, userId: string) {
    const pagamento = await this.prismaService.pagamento.findUnique({
      where: { id },
      include: {
        pedido: {
          include: {
            items: {
              include: {
                produto: true,
              },
            },
            entrega: true,
          },
        },
      },
    });

    if (!pagamento || pagamento.pedido.userId !== userId) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }

  private simulateGatewayCharge(dto: ProcessPaymentDto): {
    success: boolean;
    transactionId: string;
    reason?: string;
  } {
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    if (
      dto.metodoPagamento === METODOPAGAMENTO.CARTAO_CREDITO ||
      dto.metodoPagamento === METODOPAGAMENTO.CARTAO_DEBITO
    ) {
      if (dto.numeroCartao && dto.numeroCartao.endsWith('0000')) {
        return {
          success: false,
          transactionId,
          reason: 'Transação recusada pela operadora do cartão',
        };
      }
    }

    return {
      success: true,
      transactionId,
    };
  }
}
