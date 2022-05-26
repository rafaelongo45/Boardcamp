import pg from 'pg';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config()

const { Pool } = pg;
const app = express();

app.use(cors());

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});




app.listen(
  process.env.ṔORT || 4000, 
  () => console.log(chalk.bold.blue(`Servidor rodando na porta ${process.env.PORT}`))
)