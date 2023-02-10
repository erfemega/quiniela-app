import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MatchesService } from '../matches.service';

@Injectable()
export class MatchOwnerGuard implements CanActivate {
  constructor(private matchesService: MatchesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = user._id;
    const matchId = request.params.matchId;
    const match = await this.matchesService.getMatchById(matchId, ['event']);
    const event: any = match.event;
    const owners = event.owners;
    const isMatchOwner = owners.some((owner) => owner.toString() == userId);
    return isMatchOwner;
  }
}
