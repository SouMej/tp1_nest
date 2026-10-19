import { Inject, Injectable } from '@nestjs/common';
import { UUID } from '../common/common.constants';

@Injectable()
export class TestService {
  constructor(@Inject(UUID) private readonly uuid: () => string) {}

  generate(): string {
    return this.uuid();
  }
}