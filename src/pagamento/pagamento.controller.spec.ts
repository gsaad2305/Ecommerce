import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoController } from './pagamento.controller.js';
import { PagamentoService } from './pagamento.service.js';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { METODOPAGAMENTO } from '../../generated/prisma/client.js';

describe('PagamentoController', () => {
  let controller: PagamentoController;
  let service: PagamentoService;

  const mockPagamentoService = {
    checkout: vi.fn(),
    processExistingOrderPayment: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagamentoController],
      providers: [
        {
          provide: PagamentoService,
          useValue: mockPagamentoService,
        },
      ],
    }).compile();

    controller = module.get<PagamentoController>(PagamentoController);
    service = module.get<PagamentoService>(PagamentoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call checkout on service', async () => {
    const req = { user: { id: 'u1' } } as any;
    const dto = { metodoPagamento: METODOPAGAMENTO.PIX };
    mockPagamentoService.checkout.mockResolvedValue({ status: 'ok' });

    const result = await controller.checkout(req, dto);
    expect(service.checkout).toHaveBeenCalledWith('u1', dto);
    expect(result).toEqual({ status: 'ok' });
  });
});
