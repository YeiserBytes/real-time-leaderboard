import type { Score } from "../types";
import redisClient from "../config/redis";

export class LeaderboardService {
  private static LEADERBOARD_KEY = "global:leaderboard"
  private static GAME_LEADERBOARD_PREFIX = 'game:'

  async submitScore(score: Score) {
    await redisClient.zIncrBy(
      LeaderboardService.LEADERBOARD_KEY,
      score.score,
      score.userId
    )

    const gameLeaderboardKey = `${LeaderboardService.GAME_LEADERBOARD_PREFIX}${score.gameId}`
    await redisClient.zIncrBy(
      gameLeaderboardKey,
      score.score,
      score.userId
    )
  }

  async getGlobalLeaderboard(limit = 10): Promise<Array<{ userId: string, score: number }>> {
    const results = await redisClient.zRangeWithScores(
      LeaderboardService.LEADERBOARD_KEY,
      -limit,
      -1,
      { REV: true }
    )

    return results.map(({ score, value }) => ({
      userId: value,
      score: Number(score)
    }))
  }

  async getUserRank(userId: string) {
    const rank = await redisClient.zRevRank(
      LeaderboardService.LEADERBOARD_KEY,
      userId
    )
    return rank !== null ? rank + 1 : 0
  }

  async getTopPlayersByPeriod(
    startTime: Date,
    endTime: Date,
    limit = 10
  ) {
    return this.getGlobalLeaderboard(limit)
  }
}
