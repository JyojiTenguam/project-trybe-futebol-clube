import { Leaderboard } from '../types/Leaderboard';
import MatchWithTeams from './MatchTeams';

export interface ILeaderboard {
  getFinishedMatches(): Promise<MatchWithTeams[]>,
  getHomeTeamStats(): Promise<Leaderboard[]>,
}
