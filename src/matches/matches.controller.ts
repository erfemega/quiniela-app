import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dtos/createMatch.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get(':matchId')
  async getMatch(@Param('matchId') matchId: string) {
    const match = await this.matchesService.getMatchById(matchId);
    return match;
  }

  @Patch(':matchId')
  async updateMatch(
    @Param('matchId') matchId: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const updatedMatch = await this.matchesService.updateMatch(
      matchId,
      updateMatchDto,
    );
    return updatedMatch;
  }
}
