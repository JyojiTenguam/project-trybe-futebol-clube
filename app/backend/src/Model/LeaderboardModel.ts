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
  efficiency: 0,
});

const sortLeaderboard = (leaderboard: Leaderboard[]): Leaderboard[] => leaderboard.sort((a, b) => {
  if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
  if (b.totalVictories !== a.totalVictories) return b.totalVictories - a.totalVictories;
  if (b.goalsBalance !== a.goalsBalance) return b.goalsBalance - a.goalsBalance;
  return b.goalsFavor - a.goalsFavor;
});

const efficiency = (points: number, games: number): number => {
  if (games === 0) return 0;
  return parseFloat(((points / (games * 3)) * 100).toFixed(2));
};

const mergeLeaderboard = (
  homeLeaderboard: Leaderboard[],
  awayLeaderboard: Leaderboard[],
): Leaderboard[] => {
  const ab: { [key: string]: Leaderboard } = {};

  const mergeTeamStats = (team: Leaderboard) => {
    if (!ab[team.name]) { ab[team.name] = { ...team }; } else {
      ab[team.name].totalPoints += team.totalPoints;
      ab[team.name].totalGames += team.totalGames;
      ab[team.name].totalVictories += team.totalVictories;
      ab[team.name].totalDraws += team.totalDraws;
      ab[team.name].totalLosses += team.totalLosses;
      ab[team.name].goalsFavor += team.goalsFavor; ab[team.name].goalsOwn += team.goalsOwn;
      ab[team.name].goalsBalance = ab[team.name].goalsFavor - ab[team.name].goalsOwn;
      ab[team.name].efficiency = efficiency(ab[team.name].totalPoints, ab[team.name].totalGames);
    }
  };

  homeLeaderboard.forEach(mergeTeamStats); awayLeaderboard.forEach(mergeTeamStats);

  return sortLeaderboard(Object.values(ab));
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
    return sortLeaderboard(Object.values(leaderboard));
  }

  async getAwayTeamStats(): Promise<Leaderboard[]> {
    const matches = await this.getFinishedMatches();
    const leaderboard = matches.reduce((acc: { [key: string]: Leaderboard }, match) => {
      const awayTeam = match.awayTeam.teamName;
      const { homeTeamGoals } = match;
      const { awayTeamGoals } = match;

      if (!acc[awayTeam]) acc[awayTeam] = leaderboardTemplate(awayTeam);

      acc[awayTeam].totalGames += 1; acc[awayTeam].goalsFavor += awayTeamGoals;
      acc[awayTeam].goalsOwn += homeTeamGoals;
      acc[awayTeam].goalsBalance = acc[awayTeam].goalsFavor - acc[awayTeam].goalsOwn;

      if (awayTeamGoals === homeTeamGoals) {
        acc[awayTeam].totalPoints += 1; acc[awayTeam].totalDraws += 1;
      } else if (awayTeamGoals > homeTeamGoals) {
        acc[awayTeam].totalPoints += 3; acc[awayTeam].totalVictories += 1;
      } else { acc[awayTeam].totalLosses += 1; }
      acc[awayTeam].efficiency = efficiency(acc[awayTeam].totalPoints, acc[awayTeam].totalGames);

      return acc;
    }, {});
    return sortLeaderboard(Object.values(leaderboard));
  }

  async getLeaderboard(): Promise<Leaderboard[]> {
    const homeLeaderboard = await this.getHomeTeamStats();
    const awayLeaderboard = await this.getAwayTeamStats();

    return mergeLeaderboard(homeLeaderboard, awayLeaderboard);
  }
}
