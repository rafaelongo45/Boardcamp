import chalk from "chalk";

import connection from "../db.js";

export async function validateIds(req,res,next){
  const { customerId, gameId } = req.body;  
  try {
    const result = await connection.query(`
      SELECT games.id as "gamesId", games."stockTotal" as stock, customers.id as "customersId" FROM games 
      JOIN customers
      ON games.id = $1 AND customers.id = $2
    `,[gameId, customerId]);

    const data = result.rows;

    if(data.length === 0 || data[0].stock <= 0){ //TODO: TA PASSANDO MESMO COM ESSA VERIFICAÇÃO DO STOCK!
      return res.sendStatus(400)
    }

    console.log(data);

    next();
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}