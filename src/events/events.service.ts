import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { Model } from 'mongoose';
import { CreateEventDto, UpdateEventDto } from './dtos/createEvent.dto';
import { MatchesService } from '../matches/matches.service';
import { CreateMatchDto } from 'src/matches/dtos/createMatch.dto';
import { EventNotFoundException } from './exceptions/EventNotFound.exception';
import { UsersService } from 'src/users/users.service';
import { PredictionsService } from 'src/predictions/predictions.service';
import { Status } from 'src/predictions/enums/status.enum';
import { UserDocument } from 'src/users/schemas/user.schema';
import { RankingsService } from 'src/rankings/rankings.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    private matchesService: MatchesService,
    private usersService: UsersService,
    private predictionsService: PredictionsService,
    private rankingsService: RankingsService,
  ) {}

  async getEvents(query = {}): Promise<EventDocument[]> {
    const events = await this.eventModel.find(query).exec();
    return events;
  }

  async getPublicEvents(): Promise<EventDocument[]> {
    const events = await this.eventModel.find({ published: true }).exec();
    return events;
  }

  async getEventsByOwner(owner: string): Promise<EventDocument[]> {
    const events = await this.eventModel
      .find({ owners: { $in: [owner] } })
      .exec();
    return events;
  }

  async getEvent(eventId: string): Promise<EventDocument> {
    const event = await this.eventModel
      .findById(eventId)
      .populate(['matches'])
      .exec();
    if (!event) throw new EventNotFoundException(eventId);
    return event;
  }

  async addEvent(
    createEventDto: CreateEventDto,
    owner,
  ): Promise<EventDocument> {
    const newEvent = await this.eventModel.create({
      ...createEventDto,
      owners: [owner._id],
    });
    return newEvent.save();
  }

  async addMatchesToEvent(
    eventId: string,
    createMatchDtos: CreateMatchDto[],
  ): Promise<EventDocument> {
    const event = await this.getEvent(eventId);
    const createdMatches = await Promise.all(
      createMatchDtos.map(async (matchDto) => {
        const match = await this.matchesService.addMatch({
          ...matchDto,
          event: eventId,
        });
        return match;
      }),
    );
    event.matches = createdMatches;
    const updatedEvent = await this.updateEvent(eventId, event);
    return updatedEvent;
  }

  async updateEvent(
    eventId: string,
    createEventDto: UpdateEventDto,
  ): Promise<EventDocument> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      eventId,
      createEventDto,
      { new: true },
    );
    if (!updatedEvent) throw new EventNotFoundException(eventId);
    return updatedEvent;
  }

  async deleteEvent(eventId: string): Promise<any> {
    await this.matchesService.deleteAllMatchesFromEvent(eventId);
    const deletedEvent = await this.eventModel.findByIdAndDelete(eventId);
    if (!deletedEvent) throw new EventNotFoundException(eventId);
    return deletedEvent;
  }

  async addNewOwner(
    eventId: string,
    newOwnerEmail: string,
  ): Promise<EventDocument> {
    const event = await this.getEvent(eventId);
    const newOwner = await this.usersService.findUser({ email: newOwnerEmail });
    event.owners.push(newOwner._id);
    const updatedEvent = await this.updateEvent(eventId, event);
    return updatedEvent;
  }

  async subscribeUser(event: EventDocument, user: UserDocument) {
    const isAlreadySubscribed = user.events.some(
      (eventItem) => eventItem == event._id.toString(),
    );
    const eventIsPublished = event.published;
    if (isAlreadySubscribed || !eventIsPublished) {
      throw new BadRequestException(
        'User is already registered or event is not published',
      );
    }
    // const event = await this.getEvent(eventId);
    const matches = event.matches.map((match) => match._id);
    matches.forEach(async (match) => {
      const newPrediction = await this.predictionsService.addPrediction({
        event: event._id,
        owner: user._id,
        winner: null,
        status: Status.Pending,
        match: match._id,
      });
      newPrediction.save();
    });
    await this.rankingsService.addRanking(event, user);
    await this.usersService.addEvent(user._id, event);
  }

  async publishEvent(eventId: string): Promise<Event> {
    const event = await this.getEvent(eventId);
    event.published = true;
    const updatedEvent = await this.updateEvent(eventId, event);
    return updatedEvent;
  }
}
