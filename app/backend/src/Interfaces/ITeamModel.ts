import Team from './Team';

export default interface ITeamModel {
  findAll(): Promise<Team[]>,
  findById(id: Team['id']): Promise<Team | null>
}
