import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { Model } from 'mongoose';
import { CreateEventDto, UpdateEventDto } from './dtos/createEvent.dto';
import { MatchesService } from '../matches/matches.service';
import { CreateMatchDto } from 'src/matches/dtos/createMatch.dto';
import { EventNotFoundException } from './exceptions/EventNotFound.exception';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    private matchesService: MatchesService,
    private usersService: UsersService,
  ) {}

  async getEvents(): Promise<Event[]> {
    const events = await this.eventModel.find().exec();
    return events;
  }

  async getPublicEvents(): Promise<Event[]> {
    const events = await this.eventModel.find({ published: true }).exec();
    return events;
  }

  async getEventsByOwner(owner: string): Promise<Event[]> {
    const events = await this.eventModel
      .find({ owners: { $in: [owner] } })
      .exec();
    return events;
  }

  async getEvent(eventId: string): Promise<Event> {
    const event = await this.eventModel
      .findById(eventId)
      .populate(['matches'])
      .exec();
    if (!event) throw new EventNotFoundException(eventId);
    return event;
  }

  async addEvent(createEventDto: CreateEventDto, owner): Promise<Event> {
    const newEvent = await this.eventModel.create({
      ...createEventDto,
      owners: [owner._id],
    });
    return newEvent.save();
  }

  async addMatchToEvent(
    eventId: string,
    createMatchDto: CreateMatchDto,
  ): Promise<Event> {
    const event = await this.getEvent(eventId);
    const match = await this.matchesService.addMatch({
      ...createMatchDto,
      event: eventId,
    });
    event.matches.push(match);
    const updatedEvent = await this.updateEvent(eventId, event);
    return updatedEvent;
  }

  async updateEvent(
    eventId: string,
    createEventDto: UpdateEventDto,
  ): Promise<Event> {
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

  async addNewOwner(eventId: string, newOwnerEmail: string): Promise<Event> {
    const event = await this.getEvent(eventId);
    const newOwner = await this.usersService.findUser({ email: newOwnerEmail });
    event.owners.push(newOwner._id);
    const updatedEvent = await this.updateEvent(eventId, event);
    return updatedEvent;
  }

  async publishEvent(eventId: string): Promise<Event> {
    const event = await this.getEvent(eventId);
    event.published = true;
    const updatedEvent = await this.updateEvent(eventId, event);
    return updatedEvent;
  }
}
