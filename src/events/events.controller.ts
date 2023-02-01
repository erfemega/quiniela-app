import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dtos/createEvent.dto';
import { EventsService } from './events.service';
import { CreateMatchDto } from 'src/matches/dtos/createMatch.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IsOwnerGuard } from 'src/auth/guards/isOwner.guard';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiBearerAuth()
  async getAllEvents() {
    const events = await this.eventsService.getEvents();
    return events;
  }

  @Get(':eventId')
  async getEventById(@Param('eventId') eventId: string) {
    console.log('getEventById', eventId);
    const event = this.eventsService.getEvent(eventId);
    return event;
  }

  @Post()
  async createEvent(@Body() eventDto: CreateEventDto) {
    const newEvent = await this.eventsService.addEvent(eventDto);
    return newEvent;
  }

  @Post(':eventId/matches')
  async addMatchToEvent(
    @Param('eventId') eventId: string,
    @Body() createMatchDto: CreateMatchDto,
  ) {
    const eventWithMatch = await this.eventsService.addMatchToEvent(
      eventId,
      createMatchDto,
    );
    return eventWithMatch;
  }

  @Patch(':eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const updatedEvent = await this.eventsService.updateEvent(
      eventId,
      updateEventDto,
    );
    return updatedEvent;
  }

  @Delete(':eventId')
  async deleteEvent(@Param('eventId') eventId: string) {
    const event = await this.eventsService.deleteEvent(eventId);
    return event;
  }
}
