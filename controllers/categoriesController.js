import chalk from 'chalk';

import connection from '../db.js';

export async function getCategories(req, res){
  const { offset, limit } = req.query;
  let queryCommand = await connection.query('SELECT * FROM categories');

  if(offset && limit){
    queryCommand = await connection.query('SELECT * FROM categories OFFSET $1 LIMIT $2' , [offset, limit])
  }else if(limit){
    queryCommand = await connection.query('SELECT * FROM categories LIMIT $1' , [limit])
  }else if(offset){
    queryCommand = await connection.query('SELECT * FROM categories OFFSET $1' , [offset])
  }


  try {
    const result = queryCommand;
    const categories = result.rows;

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