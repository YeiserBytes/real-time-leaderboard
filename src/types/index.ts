export interface UserInput {
	username: string;
	password: string;
}

export interface GameInput {
	name: string;
	description: string;
}

export interface ScoreInput {
	gameId: number;
	score: number;
}

export interface JwtPayload {
	userId: number;
}
