import type { Request, Response } from "express";
import { RedisService } from "../services/RedisService";
import { AppDataSource } from "../config";
import { Game, Score, User } from "../entities/Entities";
import type { GameInput } from "../types";

class GameController {
    private userRepository = AppDataSource.getRepository(User);
    private gameRepository = AppDataSource.getRepository(Game);
	private redisService = new RedisService();

    async getGames(req: Request, res: Response) {
        try {
            const games = await this.gameRepository.find();
            res.status(200).json(games);
        } catch (error) {
            console.error('Error fetching games:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

	async submitGame(req: Request, res: Response) {
        try {
            const { userId } = req;
            const { name, description } = req.body as GameInput;

            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const newGame = this.gameRepository.create({
                name,
                description,
            });

            await this.gameRepository.save(newGame);
            await this.redisService.addGame(newGame.id);
            res.status(201).json({ message: 'Game submitted successfully' });
        } catch (error) {
            console.error('Error submitting game:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
	}
}

export default GameController;
