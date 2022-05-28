import chalk from "chalk";
import moment from "moment";

import connection from "../db.js";

export async function getRentalsQuery(req,res,next){
  const { customerId, gameId, offset, limit, status, startDate } = req.query;
  let queryCommand = '';

  try {
    if(customerId && offset && limit){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
      OFFSET $2
      LIMIT $3
    `, [customerId, offset, limit]);
    }else if(customerId && offset){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
      OFFSET $2
    `, [customerId, offset]);
    }else if(customerId && limit){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
      LIMIT $2
    `, [customerId, limit]);
    }else if(offset && limit){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      OFFSET $1
      LIMIT $2
    `, [offset, limit]);
    }else if(customerId){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
    `, [customerId]);
    }else if(gameId && offset && limit){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
      OFFSET $2
      LIMIT $3
    `, [gameId, offset, limit]);
    }else if(gameId && offset){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
      OFFSET $2
    `, [gameId, offset]);
    }else if(gameId && limit){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
      LIMIT $2
    `, [gameId, limit]);
    }else if(gameId){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."gameId" = $1
    `, [gameId]);
    }else if(limit){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      LIMIT $1
    `, [limit]);
    }else if(offset){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      OFFSET $1
    `, [offset]);
    }else if(status === "open"){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."returnDate" IS NULL
    `);
    }else if(status === "closed"){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."returnDate" IS NOT NULL
    `);
    }else if(startDate){
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."rentDate" >= $1
    `, [moment(startDate,'YYYY-MM-DD')]);
    }else{
      queryCommand = await connection.query(`
      SELECT rentals.*, customers.name as "customerName", customers.id as "customerId", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
    `);
    }

    res.locals.queryCommand = queryCommand;
    next();
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

