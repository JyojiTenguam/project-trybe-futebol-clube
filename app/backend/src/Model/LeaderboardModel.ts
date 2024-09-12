import { Leaderboard } from '../types/Leaderboard';
import SequelizeMatch from '../database/models/match.model';
import SequelizeTeam from '../database/models/teams.model';
import MatchWithTeams from '../Interfaces/MatchTeams';
import { ILeaderboard } from '../Interfaces/ILeaderboard';

const leaderboardTemplate = (team: string) => ({
  name: team,
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  effeciency: 0,
});

const orderLeaderboard = (leaderboard: Leaderboard[]): Leaderboard[] => leaderboard.sort((a, b) => {
  if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
  if (b.totalVictories !== a.totalVictories) return b.totalVictories - a.totalVictories;
  if (b.goalsBalance !== a.goalsBalance) return b.goalsBalance - a.goalsBalance;
  return b.goalsFavor - a.goalsFavor;
});

const efficiency = (points: number, games: number): number => {
  if (games === 0) return 0;
  return parseFloat(((points / (games * 3)) * 100).toFixed(2));
};

export default class LeaderboardModel implements ILeaderboard {
  private matchModel = SequelizeMatch;

  async getFinishedMatches(): Promise<MatchWithTeams[]> {
    const matches = await this.matchModel.findAll({
      where: { inProgress: false },
      include: [
        { model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] },
      ],
    }) as unknown as MatchWithTeams[];
    return matches;
  }

  async getHomeTeamStats(): Promise<Leaderboard[]> {
    const matches = await this.getFinishedMatches();
    const leaderboard = matches.reduce((acc: { [key: string]: Leaderboard }, match) => {
      const homeTeam = match.homeTeam.teamName;
      const { homeTeamGoals } = match;
      const { awayTeamGoals } = match;

      if (!acc[homeTeam]) acc[homeTeam] = leaderboardTemplate(homeTeam);

      acc[homeTeam].totalGames += 1; acc[homeTeam].goalsFavor += homeTeamGoals;
      acc[homeTeam].goalsOwn += awayTeamGoals;
      acc[homeTeam].goalsBalance = acc[homeTeam].goalsFavor - acc[homeTeam].goalsOwn;

      if (homeTeamGoals === awayTeamGoals) {
        acc[homeTeam].totalPoints += 1; acc[homeTeam].totalDraws += 1;
      } else if (homeTeamGoals > awayTeamGoals) {
        acc[homeTeam].totalPoints += 3; acc[homeTeam].totalVictories += 1;
      } else { acc[homeTeam].totalLosses += 1; }
      acc[homeTeam].efficiency = efficiency(acc[homeTeam].totalPoints, acc[homeTeam].totalGames);

      return acc;
    }, {});
    return orderLeaderboard(Object.values(leaderboard));
  }
}
