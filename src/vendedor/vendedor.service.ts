import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import { UpdateVendedorDto } from './dto/update-vendedor.dto.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class VendedorService {
  constructor(
    private readonly prismaService: PrismaService
  ){}

  async execptionErros(userId: string){
      const isUser = await this.prismaService.user.findUnique({
      where :{
        id: userId,
      }
    });

    if(!isUser) {
      throw new NotFoundException("Este usuário não existe!\nTente novamente");
    }
  }
  async criarContaVendedor(createVendedorDto: CreateVendedorDto, userId: string) {
    return 'oa'
    // this.execptionErros;
    // const vendedorExiste = await this.prismaService.vendedor.findFirst({
    //   where: {
    //     userId
    //   }
    // });

    // if(vendedorExiste){
    //   throw new ConflictException("Vendedor existe")
    // }

    // return await this.prismaService.vendedor.create({
    //   data: {
    //     userId,
    //     nomeLoja: createVendedorDto.nomeLoja,
    //     cnpj: createVendedorDto.cnpj,
    //     telefoneLoja: createVendedorDto.telefoneLoja,
    //     cepLoja: createVendedorDto.cepLoja
    //   }
    // });
  }

  async verificarContaVendedor() {
    return await this.prismaService.vendedor.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} vendedor`;
  }

  update(id: number, updateVendedorDto: UpdateVendedorDto) {
    return `This action updates a #${id} vendedor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendedor`;
  }
}
