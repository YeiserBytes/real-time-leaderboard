import Redis from "ioredis";

export class RedisService {
	private client: Redis;

	constructor() {
		this.client = new Redis({
			host: process.env.REDIS_HOST || "localhost",
			port: Number(process.env.REDIS_PORT) || 6379,
		});
	}

	private getLeaderboardKey(gameId: number): string {
		return `leaderboard:${gameId}`;
	}

	async addScore(gameId: string, userId: string, score: number): Promise<void> {
		const leaderboardKey = `leaderboard:${gameId}`;
		await this.client.zadd(leaderboardKey, score, userId);
	}

	async addGame(gameId: number): Promise<void> {
		const key = this.getLeaderboardKey(gameId);
		await this.client.del(key);
	}

	async updateScore(gameId: number, userId: number, score: number) {
		const key = this.getLeaderboardKey(gameId);
		await this.client.zadd(key, score, userId);
	}

	async getTopPlayers(
		gameId: number,
		limit = 10,
	): Promise<Array<{ userId: number; score: number }>> {
		const key = this.getLeaderboardKey(gameId);
		const result = await this.client.zrevrange(key, 0, limit - 1, "WITHSCORES");

		const topPlayers = [];
		for (let i = 0; i < result.length; i += 2) {
			topPlayers.push({
				userId: Number(result[i]),
				score: Number.parseFloat(result[i + 1]),
			});
		}

		return topPlayers;
	}

	async getUserRank(
		gameId: number,
		userId: number,
	): Promise<{ rank: number; score: number } | null> {
		const key = this.getLeaderboardKey(gameId);
		const [rank, score] = await Promise.all([
			this.client.zrevrank(key, userId),
			this.client.zscore(key, userId),
		]);

		if (rank === null || score === null) {
			return null;
		}

		return {
			rank: rank + 1,
			score: Number.parseFloat(score),
		};
	}
}
