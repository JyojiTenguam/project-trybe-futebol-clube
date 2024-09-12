import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  async getHomeLeaderboard(req: Request, res: Response): Promise<Response> {
    const leaderboard = await this.leaderboardService.getHomeLeaderboard();
    return res.status(200).json(leaderboard);
  }

  async getAwayLeaderboard(req: Request, res: Response): Promise<Response> {
    const leaderboard = await this.leaderboardService.getAwayLeaderboard();
    return res.status(200).json(leaderboard);
  }
}
