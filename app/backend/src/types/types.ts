// Definindo Login como interface
export interface Login {
  email: string;
  password: string;
}

// Definindo Token como interface
export interface Token {
  token: string;
}

export default interface LeaderboardEntry {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}
