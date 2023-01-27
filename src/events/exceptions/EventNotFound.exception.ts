import { NotFoundException } from '@nestjs/common';

export class EventNotFoundException extends NotFoundException {
  constructor(eventId: string) {
    super(`Event with id ${eventId} not found`);
  }
}
