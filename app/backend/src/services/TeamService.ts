import { ServiceResponse } from '../Interfaces/ServiceResponse';
import ITeamModel from '../Interfaces/ITeamModel';
import Team from '../Interfaces/Team';
import TeamModel from '../Model/TeamModel';

export default class TeamsService {
  constructor(
    private teamModel: ITeamModel = new TeamModel(),
  ) { }

  public async findAll(): Promise<ServiceResponse<Team[]>> {
    const allTeams = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data: allTeams };
  }

  public async getTeamById(id: number): Promise<ServiceResponse<Team>> {
    const team = await this.teamModel.findById(id);
    if (!team) {
      return { status: 'NOT_FOUND', data: { message: 'Time não encontrado' } };
    }
    return { status: 'SUCCESSFUL', data: team };
  }
}
