import chalk from "chalk";

import connection from "../db.js";

export async function validateGame(req,res, next){
  const { name, stockTotal, pricePerDay } = req.body;
  const gameName = name.trim();

  if(gameName.length === 0 || stockTotal <= 0 || pricePerDay <= 0){
    return res.sendStatus(400);
  }
  
  try {
    const result = await connection.query('SELECT * FROM games');
    const storedGames = result.rows;

    const sameName = storedGames.find(game => {
      return game.name === gameName
    })

    if(sameName){
      return res.sendStatus(409);
    }

    res.locals.gameName = gameName;
    next();
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function validateCategory(req,res,next){
  const { categoryId } = req.body;

  try {
    const result = await connection.query('SELECT * FROM categories');
    const categories = result.rows;

    const categoryExists = categories.find(category => {
      return category.id === categoryId
    })

    if(!categoryExists){
      return res.sendStatus(400);
    }

    next();

  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}