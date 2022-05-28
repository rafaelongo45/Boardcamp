import chalk from "chalk";
import moment from "moment";

import connection from "../db.js";

export async function postRental(req,res){
  const { customerId, gameId, daysRented } = req.body;

  if(daysRented <= 0){
    return res.sendStatus(400);
  }

  try {
    const getPrice = await connection.query(`
      SELECT "pricePerDay" FROM games WHERE id = $1
    `,[gameId]);

    const price = getPrice.rows[0].pricePerDay;

    await connection.query(`
      INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, to_timestamp($4), $5, $6, $7)
    `,[customerId, gameId, daysRented, Date.now() / 1000, null, price * daysRented, null])

    await connection.query(`
    UPDATE games SET "stockTotal" = ("stockTotal" - 1) WHERE id = $1
    `, [gameId])
    
    res.sendStatus(201);
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function getRentals(req,res){
  const { customerId, gameId } = req.query;
  let result = "";

  try {
    if(customerId){
      result = await connection.query(`
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

    }else if(gameId){
      result = await connection.query(`
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

    }else{
      result = await connection.query(`
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

    const rentals = result.rows;

    const rentalsStructured = [];

    for(let rental of rentals){
      const structure = {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer:{
          id: rental.customerId,
          name: rental.customerName
        },
        game:{
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName
        }
      }
      rentalsStructured.push(structure);
    }

    res.send(rentalsStructured);
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function returnRental(req,res){
  const { id } = req.params;
  const today = new Date();
  let daysAmount = 0;

  try {
    const result = await connection.query(`
      SELECT * FROM rentals
      WHERE id = $1
    `, [id]);

    const rentals = result.rows;
    console.log(rentals[0])

    if(rentals.length === 0){
      return res.sendStatus(404);
    }

    if(rentals[0].returnDate){
      return res.sendStatus(400)
    }

    await connection.query(`
      UPDATE rentals SET "returnDate" = $1 WHERE id = $2
    `, [today, id])

    daysAmount = moment(today).diff(moment(rentals[0].rentDate), 'days');

    const fee = (daysAmount - rentals[0].daysRented) * rentals[0].originalPrice;

    if(daysAmount > rentals[0].daysRented){
      await connection.query(`
        UPDATE rentals SET "delayFee" = ${fee} WHERE id = $1
      `, [id])
    }

    res.sendStatus(200);

  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function deleteRental(req,res){
  const { id } = req.params;

  try {
    const result = await connection.query(`
      SELECT * FROM rentals
      WHERE id = $1
    `, [id]);

    const rental = result.rows;

    if(rental.length === 0){
      return res.sendStatus(404);
    }

    if(rental[0].returnDate){
      return res.sendStatus(400);      
    }

    await connection.query(`
      DELETE FROM rentals WHERE id = $1
    `,[id]);

    return res.sendStatus(200);
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}