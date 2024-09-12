import LeaderboardModel from '../Model/LeaderboardModel';

export default class LeaderboardService {
  constructor(private leaderboardModel = new LeaderboardModel()) {}

  async getHomeLeaderboard() {
    const homeStats = await this.leaderboardModel.getHomeTeamStats();
    const leaderboard = homeStats.map((team) => ({
      ...team,
      goalsBalance: team.goalsFavor - team.goalsOwn,
      efficiency: ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2),
    }));

    return leaderboard;
  }
}
