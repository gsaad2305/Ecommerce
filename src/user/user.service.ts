import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/cliente/create-user.dto.js';
import { UpdateUserDto } from './dto/cliente/update-user.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import { HashingService } from '../auth/hashing/hashing.service.js';
import { CreateEnderecoDto } from './dto/endereco/add-endereco.dto.js';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailExisted = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (emailExisted) {
      throw new ConflictException(`Este email já existe. Tente novamente`);
    }
    const passwordHash = await this.hashingService.hash(createUserDto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return newUser;
  }

  async createAddress(createEnderecoDto: CreateEnderecoDto, userId: string) {
    const newEndereco = await this.prismaService.endereco.create({
      data: {
        userId,
        ...createEnderecoDto,
      },
    });

    return newEndereco;
  }

  // Alias para compatibilidade
  async createEndereco(createEnderecoDto: CreateEnderecoDto, userId: string) {
    return this.createAddress(createEnderecoDto, userId);
  }

  async findByUserId(userId: string) {
    const myAccount = await this.prismaService.user.findMany({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        telefone: true,
        endereco: {
          select: {
            cep: true,
            rua: true,
            numero: true,
            bairro: true,
            cidade: true,
            estado: true,
          },
        },
      },
    });
    return myAccount;
  }

  // Alias para compatibilidade
  async findAll(userId: string) {
    return this.findByUserId(userId);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // Alias para compatibilidade
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  // Alias para compatibilidade
  async deleteUser(id: string) {
    return this.remove(id);
  }
}
