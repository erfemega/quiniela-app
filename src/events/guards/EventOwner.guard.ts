import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventsService } from '../events.service';
import { ObjectId } from 'mongoose';

@Injectable()
export class EventOwnerGuard implements CanActivate {
  constructor(private eventsService: EventsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user._id;
    const eventId = request.params.eventId;
    const event = await this.eventsService.getEvent(eventId);
    const isEventOwner = event.owners.some(
      (objectId) => objectId.toString() == userId,
    );
    return isEventOwner;
  }
}
