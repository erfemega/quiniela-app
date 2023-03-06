import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RankingDocument } from './schemas/ranking.schema';
import { RankingsService } from './rankings.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth0Guard } from 'src/auth/guards/auth0.guard';

@ApiTags('Rankings')
@ApiBearerAuth()
@Controller('rankings')
export class RankingsController {
  constructor(private rankingsService: RankingsService) {}

  @UseGuards(Auth0Guard)
  @Get(':eventId')
  async getRankingsFromEvent(
    @Param('eventId') eventId: string,
  ): Promise<RankingDocument[]> {
    const rankings = await this.rankingsService.getRankingsByEvent(eventId);
    return rankings;
  }
}
