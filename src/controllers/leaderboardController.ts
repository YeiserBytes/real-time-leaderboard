import type { Request, Response } from "express";
import { LeaderboardService } from "../services/leaderboardService";

export class LeaderboardController {
  private leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  async submitScore(req: Request, res: Response) {
    try {
      const { userId, gameId, score } = req.body

      await this.leaderboardService.submitScore({
        id: crypto.randomUUID(),
        userId,
        gameId,
        score,
        timestamp: new Date()
      })

      res.status(201).json({ message: 'Score submitted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit score' });
    }
  }

  async getLeaderboard(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit as string) || 10
      const leaderboard = await this.leaderboardService.getGlobalLeaderboard(limit)
      res.json(leaderboard)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  async getUserRank(req: Request, res: Response) {
    try {
      const { userId } = req.params
      const rank = await this.leaderboardService.getUserRank(userId)
      res.json({ rank })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user rank' });
    }
  }
}
