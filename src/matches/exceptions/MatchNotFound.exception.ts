import { NotFoundException } from '@nestjs/common';

export class MatchNotFoundException extends NotFoundException {
  constructor(matchId: string) {
    super(`Match with id ${matchId} not found`);
  }
}
