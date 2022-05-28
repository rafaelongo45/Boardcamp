import chalk from 'chalk';

import connection from '../db.js';

export function getCategories(req, res){
  const { queryCommand } = res.locals;

  try {
    const categories = queryCommand.rows;
    return res.status(200).send(categories)
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);

    return res.sendStatus(500);
  }
};

export async function postCategory(req,res){
  const { categoryName } = res.locals;

  try {
    await connection.query('INSERT INTO categories (name) VALUES ($1)', [categoryName]);

    return res.sendStatus(201);
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    
    return res.sendStatus(500);
  }
};