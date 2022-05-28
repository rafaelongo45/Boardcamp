import chalk from "chalk";

import connection from "../db.js";

export async function getGamesQuery(req,res,next){
  const { name, offset, limit } = req.query;
  let queryCommand = '';

  try {
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
    }else{
      queryCommand = await connection.query(`
      SELECT games.*, categories.id as "categoryId", categories.name as "categoryName" FROM games 
      JOIN categories
      ON games."categoryId" = categories.id`);
    }

    res.locals.queryCommand = queryCommand;
    
    next();
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}