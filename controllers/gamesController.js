import chalk from "chalk";

import connection from "../db.js";

export async function getGames(req,res){
  const { name } = req.query;
  let result = '';

  try {
    if(name){
      result = await connection.query(`
      SELECT games.*, categories.id, categories.name as "categoryName" FROM games 
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE games.name ILIKE $1`, [name + '%']);
    }else{
      result = await connection.query(`
      SELECT games.*, categories.id, categories.name as "categoryName" FROM games 
      JOIN categories
      ON games."categoryId" = categories.id`);
    }

    const games = result.rows;

    res.send(games)
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function postGame(req,res){
  const { image, stockTotal, pricePerDay, categoryId } = req.body;
  const { gameName } = res.locals
  try {
    await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5)`,
    [gameName, image, stockTotal, categoryId, pricePerDay]);

    res.sendStatus(201);
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}