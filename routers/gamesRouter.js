import { Router } from "express";

import { validateCategory, validateGame } from "../middlewares/validateGame.js";
import { postGame, getGames } from "../controllers/gamesController.js";

const gamesRouter = Router(); //TODO: Checar rota toda

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', validateGame, validateCategory, postGame);

export default gamesRouter;