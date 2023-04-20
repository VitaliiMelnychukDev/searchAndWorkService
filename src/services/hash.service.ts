import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  private readonly saltRound: number = 10;

  async hashString(str: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(this.saltRound);

    return await bcrypt.hash(str, salt);
  }

  async isMatch(str: string, hashedStr: string): Promise<boolean> {
    return await bcrypt.compare(str, hashedStr);
  }
}
