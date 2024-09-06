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
}
