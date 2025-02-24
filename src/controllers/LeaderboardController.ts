import type { Request, Response } from "express";
import type { ScoreInput } from "../types";
import { AppDataSource } from "../config";
import { User, Score } from "../entities/Entities";
import { RedisService } from "../services/RedisService";

export class LeaderboardController {
	private scoreRepository = AppDataSource.getRepository(Score);
	private userRepository = AppDataSource.getRepository(User);
	private redisService = new RedisService();

	async submitScore(req: Request, res: Response) {
		try {
			const { userId } = req
			const { gameId, score } = req.body as ScoreInput;

			const user = await this.userRepository.findOne({
				where: { id: userId },
			});
			if (!user) {
				res.status(404).json({ error: "User not found" });
				return;
			}

			const newScore = this.scoreRepository.create({
				gameId,
				score,
				user,
			});

			await this.scoreRepository.save(newScore);
			await this.redisService.updateScore(gameId, Number(userId), score);
			res.status(201).json({ message: "Score submitted successfully" });
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getLeaderboard(req: Request<{ gameId: string }>, res: Response) {
		try {
			const { gameId } = req.params;
			const topScores = await this.redisService.getTopPlayers(Number(gameId));

			const leaderboard = await Promise.all(
				topScores.map(async ({ userId, score }) => {
					const user = await this.userRepository.findOne({
						where: { id: userId },
					});
					return {
						username: user?.username,
						score,
						rank: (await this.redisService.getUserRank(Number(gameId), userId))
							?.rank,
					};
				}),
			);

			res.json(leaderboard);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getUserRank(req: Request, res: Response) {
		try {
			const days = Number(req.query.days as string) || 7;
			const gameId = req.query.gameId as string;

			const sinceDate = new Date();
			sinceDate.setDate(sinceDate.getDate() - days);

			const topScores = await this.scoreRepository
				.createQueryBuilder("score")
				.leftJoinAndSelect("score.user", "user")
				.where("score.gameId = :gameId", { gameId })
				.andWhere("score.createdAt >= :sinceDate", { sinceDate })
				.orderBy("score.score", "DESC")
				.take(10)
				.getMany();

			const results = await topScores.map((score) => ({
				username: score.user.username,
				score: score.score,
				date: score.createdAt,
			}));

			res.json(results);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getTopPlayerReport(req: Request, res: Response) {
		try {
			const days = Number(req.query.days as string) || 7;
			const gameId = req.query.gameId as string;

			const sinceDate = new Date();
			sinceDate.setDate(sinceDate.getDate() - days);

			const topScores = await this.scoreRepository
				.createQueryBuilder("score")
				.leftJoinAndSelect("score.user", "user")
				.where("score.gameId = :gameId", { gameId })
				.andWhere("score.createdAt >= :sinceDate", { sinceDate })
				.orderBy("score.score", "DESC")
				.take(10)
				.getMany();

			const results = await topScores.map((score) => ({
				username: score.user.username,
				score: score.score,
				date: score.createdAt,
			}));

			res.json(results);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
