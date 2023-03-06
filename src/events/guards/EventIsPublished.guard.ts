import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventsService } from '../events.service';
import { ObjectId } from 'mongoose';

@Injectable()
export class EventIsPublishedGuard implements CanActivate {
  constructor(private eventsService: EventsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const eventId = request.params.eventId;
    const event = await this.eventsService.getEvent(eventId);
    const isPublic = event.published;
    if (!isPublic) {
      throw new ForbiddenException('Event is not published');
    }
    return isPublic;
  }
}
