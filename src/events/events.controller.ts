import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dtos/createEvent.dto';
import { EventsService } from './events.service';
import { CreateMatchDto } from 'src/matches/dtos/createMatch.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EventOwnerGuard } from './guards/EventOwner.guard';
import { AddOwnerDto } from './dtos/addOwner.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Auth0Guard } from 'src/auth/guards/auth0.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @ApiOperation({
    summary: 'Get all events',
    description: "It's necessary to have a role of admin to access",
  })
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  async getAllEvents() {
    const events = await this.eventsService.getEvents();
    return events;
  }

  @ApiOperation({
    summary: 'Get all events of authenticated user',
    description: 'Get all events where the current user is owner',
  })
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('owned')
  async getEventsByOwner(@Request() req) {
    const userId = req.user._id;
    const events = await this.eventsService.getEventsByOwner(userId);
    return events;
  }

  @ApiOperation({
    summary: 'Get all published events',
    description: 'Get published events',
  })
  // @Roles(Role.User)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(Auth0Guard)
  @Get('public')
  async getPublishedEvents() {
    const events = await this.eventsService.getPublicEvents();
    return events;
  }

  @ApiOperation({
    summary: 'Get event by id',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':eventId')
  async getEventById(@Param('eventId') eventId: string) {
    const event = this.eventsService.getEvent(eventId);
    return event;
  }

  @ApiOperation({
    summary: 'Create a new event',
    description: 'Authenticated user will be set as owner',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(@Request() req, @Body() eventDto: CreateEventDto) {
    const user = req.user;
    const newEvent = await this.eventsService.addEvent(eventDto, user);
    return newEvent;
  }

  @ApiOperation({
    summary: 'Add a match to an event',
    description: 'Event must exists and current user must be owner',
  })
  @UseGuards(JwtAuthGuard, EventOwnerGuard)
  @Post(':eventId/matches')
  async addMatchToEvent(
    @Request() req,
    @Param('eventId') eventId: string,
    @Body() createMatchDto: CreateMatchDto,
  ) {
    const eventWithMatch = await this.eventsService.addMatchToEvent(
      eventId,
      createMatchDto,
    );
    return eventWithMatch;
  }

  @ApiOperation({
    summary: 'Add a new owner to an event',
    description: 'Current user must be owner',
  })
  @UseGuards(JwtAuthGuard, EventOwnerGuard)
  @Post(':eventId/owner')
  async addOwnerInEvent(
    @Param('eventId') eventId: string,
    @Body() addOwnerDto: AddOwnerDto,
  ) {
    const updatedEvent = await this.eventsService.addNewOwner(
      eventId,
      addOwnerDto.email,
    );
    return updatedEvent;
  }

  @ApiOperation({
    summary: 'Publish an event',
    description:
      'Current user must be owner. A public event will be visible for all users and open to subscriptions',
  })
  @UseGuards(JwtAuthGuard, EventOwnerGuard)
  @Patch(':eventId/publish')
  async publishEvent(@Param('eventId') eventId: string) {
    const event = await this.eventsService.publishEvent(eventId);
    return event;
  }

  @ApiOperation({
    summary: 'Edit event',
    description: 'Current user must be owner',
  })
  @UseGuards(JwtAuthGuard, EventOwnerGuard)
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

  @ApiOperation({
    summary: 'Delete event',
    description: 'Current user must be owner',
  })
  @UseGuards(JwtAuthGuard, EventOwnerGuard)
  @Delete(':eventId')
  async deleteEvent(@Param('eventId') eventId: string) {
    const event = await this.eventsService.deleteEvent(eventId);
    return event;
  }
}
