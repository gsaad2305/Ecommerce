import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import { HashingService } from '../auth/hashing/hashing.service.js';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService
  ) {}
  async create(createUserDto: CreateUserDto) {
    const emailExisted = await this.prismaService.user.findUnique({ where: { email: createUserDto.email} });
    if (emailExisted) throw new ConflictException('Email existed');
    const passwordHash = await this.hashingService.hash(createUserDto.password)
    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: passwordHash
      },
      select:{
        email:true,
        name: true
      }
    });

    return newUser;
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
