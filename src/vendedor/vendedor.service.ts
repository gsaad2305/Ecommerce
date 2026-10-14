import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import { UpdateVendedorDto } from './dto/update-vendedor.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import  { ExceptionErros } from '../common/exeptionErros/erros.js';

@Injectable()
export class VendedorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionErros: ExceptionErros
  ) {}


  async criarContaVendedor(createVendedorDto: CreateVendedorDto, userId: string) {
    await this.exceptionErros.execptionErros(userId);
  const vendedorExiste = await this.prismaService.vendedor.findFirst({
      where: {
        userId
      }
    });

    if(vendedorExiste){
      throw new ConflictException("Vendedor existe")
    }

    return await this.prismaService.vendedor.create({
      data: {
        userId,
        nomeLoja: createVendedorDto.nomeLoja,
        cnpj: createVendedorDto.cnpj,
        telefoneLoja: createVendedorDto.telefoneLoja,
        cepLoja: createVendedorDto.cepLoja
      }
    });
  }

  async verificarContaVendedor() {
    const produto = await this.prismaService.produto.findFirst({
      where: {

      }
    })
  return await this.prismaService.vendedor.findMany({
    select: {
      id: true,
      userId:true,
      nomeLoja: true,
      telefoneLoja: true,
      cepLoja: true
    }
  });
  }

  async minhaLoja(userId: string) {
    return await  this.prismaService.vendedor.findUnique({
      where: {
        userId
      }
    });
  }

  update(userId:string, updateVendedorDto: UpdateVendedorDto) {
    const updateUser = this.prismaService.vendedor.update({
      where:{
        userId
      },
      data: {
        ...updateVendedorDto
      },
    });

    return updateUser;
  }

  async deletarContaVendedor(userId: string) {
    const deleteUser = await this.prismaService.vendedor.delete({
      where: {
        userId
      }
    });
    return deleteUser;
  }
}
