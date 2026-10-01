import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service.js';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptService extends HashingService{
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash)
  }
}
