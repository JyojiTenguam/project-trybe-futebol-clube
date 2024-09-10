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
}
