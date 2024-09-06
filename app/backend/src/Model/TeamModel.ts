import ITeamModel from '../Interfaces/ITeamModel';
import Team from '../Interfaces/Team';
import SequelizeTeam from '../database/models/teams.model';

export default class TeamModel implements ITeamModel {
  private teamModel = SequelizeTeam;

  async findAll(): Promise<Team[]> {
    const data = await this.teamModel.findAll();
    return data;
  }
}
