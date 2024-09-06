import Team from './Team';

export default interface ITeamModel {
  findAll(): Promise<Team[]>
}
