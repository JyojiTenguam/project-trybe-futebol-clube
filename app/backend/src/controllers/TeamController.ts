import { Request, Response } from 'express';
import TeamService from '../services/TeamService';
import mapStatusHTTP from '../utils/mapStatusHttp';

export default class TeamController {
  constructor(private teamService = new TeamService()) {}

  public async getAllTeams(_req: Request, res: Response) {
    const serviceResponse = await this.teamService.findAll();
    res.status(200).json(serviceResponse.data);
  }

  public async getTeamById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const serviceResponse = await this.teamService.getTeamById(Number(id));

      const statusCode = serviceResponse.status === 'SUCCESSFUL'
        ? 200
        : mapStatusHTTP(serviceResponse.status);

      res.status(statusCode).json(serviceResponse.data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
