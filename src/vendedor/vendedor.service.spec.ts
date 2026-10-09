import { Test, TestingModule } from '@nestjs/testing';
import { VendedorService } from './vendedor.service.js';

describe('VendedorService', () => {
  let service: VendedorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendedorService],
    }).compile();

    service = module.get<VendedorService>(VendedorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
