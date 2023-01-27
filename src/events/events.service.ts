import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { Model } from 'mongoose';
import { CreateEventDto, UpdateEventDto } from './dtos/createEvent.dto';
import { MatchesService } from '../matches/matches.service';
import { CreateMatchDto } from 'src/matches/dtos/createMatch.dto';
import { EventNotFoundException } from './exceptions/EventNotFound.exception';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    private matchesService: MatchesService,
  ) {}

  async getEvents(): Promise<Event[]> {
    const events = await this.eventModel.find().exec();
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

  async addEvent(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = await this.eventModel.create(createEventDto);
    return newEvent.save();
  }

  async addMatchToEvent(
    eventId: string,
    createMatchDto: CreateMatchDto,
  ): Promise<Event> {
    const event = await this.getEvent(eventId);
    const match = await this.matchesService.addMatch({
      ...createMatchDto,
      eventId,
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
}
