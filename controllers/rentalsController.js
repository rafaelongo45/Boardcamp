import chalk from "chalk";

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