import Match from '../database/models/match.model';
import Team from '../database/models/teams.model';

export default class MatchService {
  public static async getAllMatches(inProgress?: string): Promise<Match[]> {
    try {
      const whereCondition = inProgress !== undefined
        ? { inProgress: inProgress === 'true' }
        : {};
      const matches = await Match.findAll({
        where: whereCondition,
        include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'] },
          { model: Team, as: 'awayTeam', attributes: ['teamName'] },
        ],
      });
      return matches;
    } catch (error) {
      console.error('Could not fetch matches:', error);
      throw new Error('Internal error while fetching matches');
    }
  }

  public static async finishMatch(id: number): Promise<void> {
    const match = await Match.findByPk(id);

    if (!match) {
      throw new Error('Match not found');
    }

    match.inProgress = false;
    await match.save();
  }

  public static async updateMatch(
    id: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<void> {
    const match = await Match.findByPk(id);

    if (!match) {
      throw new Error('Match not found');
    }

    match.homeTeamGoals = homeTeamGoals;
    match.awayTeamGoals = awayTeamGoals;

    await match.save();
  }

  public static async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<Match> {
    await MatchService.validateMatchCreation(homeTeamId, awayTeamId);
    const newMatch = await Match.create({
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });

    return newMatch;
  }

  private static async validateMatchCreation(
    homeTeamId: number,
    awayTeamId: number,
  ): Promise<void> {
    if (homeTeamId === awayTeamId) {
      throw new Error('It is not possible to create a match with two equal teams');
    }

    const homeTeam = await Team.findByPk(homeTeamId);
    const awayTeam = await Team.findByPk(awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new Error('There is no team with such id!');
    }
  }
}
