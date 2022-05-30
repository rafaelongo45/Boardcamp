import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
import express, {json} from 'express';

import gamesRouter from './routers/gamesRouter.js';
import rentalsRouter from './routers/rentalsRouter.js';
import customersRouter from './routers/customersRouter.js';
import categoriesRouter from './routers/categoriesRouter.js'

dotenv.config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(json());
app.use(router);

router.use(gamesRouter);
router.use(rentalsRouter);
router.use(customersRouter);
router.use(categoriesRouter);

app.listen(
  process.env.PORT || 4000, 
  () => console.log(chalk.bold.blue(`Servidor rodando na porta ${process.env.PORT}`))
)