import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dtos/createMatch.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MatchOwnerGuard } from './guards/MatchOwner.guard';
import { AddMatchResult } from './dtos/addMatchResult.dto';

@ApiBearerAuth()
@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @ApiOperation({
    summary: 'Get match by id',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':matchId')
  async getMatch(@Param('matchId') matchId: string) {
    const match = await this.matchesService.getMatchById(matchId);
    return match;
  }

  @ApiOperation({
    summary: 'Update a match',
    description: 'Current user must be owner of the parent event',
  })
  @UseGuards(JwtAuthGuard, MatchOwnerGuard)
  @Patch(':matchId')
  async updateMatch(
    @Request() req,
    @Param('matchId') matchId: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    let match;
    try {
      match = await this.matchesService.getMatchById(matchId);
    } catch {
      throw new BadRequestException();
    }

    const updatedMatch = await this.matchesService.updateMatch(
      matchId,
      updateMatchDto,
    );
    return updatedMatch;
  }

  @ApiOperation({
    summary: 'Set the winner of the match',
    description: 'Current user must be owner of the parent event',
  })
  @UseGuards(JwtAuthGuard, MatchOwnerGuard)
  @Post(':matchId/result')
  async addResult(
    @Param('matchId') matchId: string,
    @Body() contenderIdData: AddMatchResult,
  ) {
    const contenderId = contenderIdData.contenderId;
    const updatedMatch = await this.matchesService.addMatchResult(
      matchId,
      contenderId,
    );
    return updatedMatch;
  }
}
