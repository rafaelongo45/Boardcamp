import { Router } from "express";

import { getGamesQuery } from "../middlewares/gamesQuery.js";
import { postGame, getGames } from "../controllers/gamesController.js";
import { validateCategory, validateGame } from "../middlewares/validateGame.js";

const gamesRouter = Router();

gamesRouter.get('/games', getGamesQuery, getGames);
gamesRouter.post('/games', validateGame, validateCategory, postGame);

export default gamesRouter;