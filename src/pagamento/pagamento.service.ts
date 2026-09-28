import { Injectable } from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto.js';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto.js';

@Injectable()
export class PagamentoService {
  create(createPagamentoDto: CreatePagamentoDto) {
    return 'This action adds a new pagamento';
  }

  findAll() {
    return `This action returns all pagamento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pagamento`;
  }

  update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    return `This action updates a #${id} pagamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagamento`;
  }
}
