import chalk from "chalk";

import connection from "../db.js";

export async function getGames(req,res){
  const { name, offset, limit } = req.query;
  let queryCommand = await connection.query(`
    SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
    JOIN categories
    ON games."categoryId" = categories.id`);

  if(name && limit && offset){
    queryCommand = await connection.query(`
    SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
    JOIN categories
    ON games."categoryId" = categories.id
    WHERE games.name ILIKE $1
    OFFSET $2
    LIMIT $3`, [name + '%', offset, limit]);
  }else if(name && limit){
    queryCommand = await connection.query(`
    SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
    JOIN categories
    ON games."categoryId" = categories.id
    WHERE games.name ILIKE $1
    LIMIT $2`, [name + '%',limit]);
  }else if(name && offset){
    queryCommand = await connection.query(`
    SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
    JOIN categories
    ON games."categoryId" = categories.id
    WHERE games.name ILIKE $1
    OFFSET $2`, [name + '%', offset]);
  }else if(limit && offset){
    queryCommand = await connection.query(`
    SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
    JOIN categories
    ON games."categoryId" = categories.id
    OFFSET $1
    LIMIT $2`, [offset, limit]);
  }else if(name){
    queryCommand = await connection.query(`
    SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
    JOIN categories
    ON games."categoryId" = categories.id
    WHERE games.name ILIKE $1`, [name + '%']);
  }else if(offset){
    queryCommand = await connection.query(`
    SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
    JOIN categories
    ON games."categoryId" = categories.id
    OFFSET $1`, [offset]);
  }else if(limit){
    queryCommand = await connection.query(`
    SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
    JOIN categories
    ON games."categoryId" = categories.id
    LIMIT $1`, [limit]);
  }

  try {
    const result = queryCommand;
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