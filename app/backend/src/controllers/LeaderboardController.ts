import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  async getHomeLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await this.leaderboardService.getHomeLeaderboard();
      res.status(200).json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
