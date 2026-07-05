export type WorldId = 'pirates' | 'dinosaures' | 'police' | 'nature';

export interface GameInfo {
  id: string;
  worldId: WorldId;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

export interface PlayerProgress {
  stars: number;
  completedGames: Record<string, boolean>; // gameId -> completed
  badges: string[]; // earned badge ids
}

export interface Question {
  text: string;
  options: (string | number)[];
  answer: string | number;
  hint?: string;
  visualData?: any; // any extra game-specific data
}
