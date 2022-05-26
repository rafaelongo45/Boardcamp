import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
import express, {json} from 'express';

import gamesRouter from '../routers/gamesRouter.js';
import categoriesRouter from '../routers/categoriesRouter.js'

dotenv.config()

const app = express();

app.use(cors());
app.use(json());

app.use(gamesRouter);
app.use(categoriesRouter);

app.listen(
  process.env.ṔORT || 4000, 
  () => console.log(chalk.bold.blue(`Servidor rodando na porta ${process.env.PORT}`))
)