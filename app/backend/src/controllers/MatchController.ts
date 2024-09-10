import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  public static async getAllMatches(_req: Request, res: Response): Promise<Response> {
    try {
      const { inProgress } = _req.query;
      const matches = await MatchService.getAllMatches(inProgress as string);
      return res.status(200).json(matches);
    } catch (error) {
      console.error('Could not fetch matches:', error);
      return res.status(500).json({ message: 'Internal error while fetching matches' });
    }
  }
}
