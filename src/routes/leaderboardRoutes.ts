import { Router } from 'express';
import { LeaderboardController } from '../controllers/leaderboardController';
import { authenticateUser } from '../middleware/auth';

const router = Router();
const leaderboardController = new LeaderboardController();

router.post('/scores',
  authenticateUser,
  leaderboardController.submitScore.bind(leaderboardController)
);

router.get('/leaderboard',
  leaderboardController.getLeaderboard.bind(leaderboardController)
);

router.get('/users/:userId/rank',
  leaderboardController.getUserRank.bind(leaderboardController)
);

export default router;
