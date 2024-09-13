import LeaderboardModel from '../Model/LeaderboardModel';

export default class LeaderboardService {
  constructor(private leaderboardModel = new LeaderboardModel()) {}

  async getHomeLeaderboard() {
    const homeStats = await this.leaderboardModel.getHomeTeamStats();
    return homeStats;
  }

  async getAwayLeaderboard() {
    const awayStats = await this.leaderboardModel.getAwayTeamStats();
    return awayStats;
  }

  async getLeaderboard() {
    const leaderboard = await this.leaderboardModel.getLeaderboard();
    return leaderboard;
  }
}
