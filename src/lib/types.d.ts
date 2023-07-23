interface Level {
	name: string;
	duration: number;
	emojis: string[];
	size: number;
}

interface Card {
	id: number;
	emoji: string;
}

type PlayState = 'waiting' | 'playing' | 'won' | 'lost';

interface GameSettings {
	state: PlayState;
	level: Level;
	matches: string[];
	emojis: string[];
	cards: Card[];
	countdown: number;
	player_won: boolean;
}
