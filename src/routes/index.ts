import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { LeaderboardController } from "../controllers/LeaderboardController";
import { authMiddleware } from "../middlewares/auth";
import GameController from "../controllers/GameController";

const router = Router();
const userController = new UserController();
const gameController = new GameController();
const leaderboardController = new LeaderboardController();

// User routes

// /api/users - GET - Get all users
// Headers: Authorization: Bearer <token>
router.get("/users", userController.getAllUsers.bind(userController));

// /api/register - POST - Register a new user
// Body: { username: string, password: string }
router.post("/register", userController.register.bind(userController));

// /api/login - POST - Login
// Body: { username: string, password: string }
router.post("/login", userController.login.bind(userController));

// /api/user - GET - Get the current user
// Params: userId
// Headers: Authorization: Bearer <token>
router.delete("/user/:userId", userController.deleteUser.bind(userController));

// Game routes

// /api/game - POST - Submit a game
// Body: { name: string, description: string }
// Headers: Authorization: Bearer <token>
router.post(
	"/game",
	authMiddleware,
	gameController.submitGame.bind(gameController),
);

// /api/games - GET - Get all games
// Headers: Authorization: Bearer <token>
router.get("/games", gameController.getGames.bind(gameController));

// Leaderboard routes

// /api/score - POST - Submit a score for a game
// Body: { gameId: string, score: number }
// Headers: Authorization: Bearer <token>
router.post(
	"/score",
	authMiddleware,
	leaderboardController.submitScore.bind(leaderboardController),
);

// /api/leaderboard/:gameId - GET - Get the leaderboard for a game
// Params: gameId
// Headers: Authorization: Bearer <token>
router.get(
	"/leaderboard/:gameId",
	leaderboardController.getLeaderboard.bind(leaderboardController),
);

// /api/rank/:gameId - GET - Get the rank of the user for a game
// Params: gameId
// Headers: Authorization: Bearer <token>
router.get(
	"/rank/:gameId",
	authMiddleware,
	leaderboardController.getUserRank.bind(leaderboardController),
);

// /api/reports/top-players - GET - Get a report of the top players
// Headers: Authorization: Bearer <token>
router.get(
	"/reports/top-players",
	leaderboardController.getTopPlayerReport.bind(leaderboardController),
);

export default router;
