import chalk from "chalk";

import connection from "../db.js";

//TODO: É preciso ainda usar query string da requisição para filtrar o jogo (islike para o name que ta na req.query);
//TODO: É preciso devolver o nome da categoria do jogo baseado no id da categoria!
export async function getGames(req,res){
  try {
    const result = await connection.query('SELECT * FROM games');
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