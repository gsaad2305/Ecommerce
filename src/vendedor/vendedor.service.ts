import { Injectable } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto.js';
import { UpdateVendedorDto } from './dto/update-vendedor.dto.js';

@Injectable()
export class VendedorService {
  create(createVendedorDto: CreateVendedorDto) {
    return 'This action adds a new vendedor';
  }

  findAll() {
    return `This action returns all vendedor`;
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
