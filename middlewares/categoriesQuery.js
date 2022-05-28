import chalk from "chalk";

import connection from "../db.js";

export async function getCatQuery(req,res,next){
  const { offset, limit, order } = req.query;
  let queryCommand = '';
  
  try {
    if(offset && limit && order){
      queryCommand = await connection.query('SELECT * FROM categories OFFSET $1 LIMIT $2 ORDER BY $3', [offset, limit, order]);
  
    }else if(offset && order){
      queryCommand = await connection.query('SELECT * FROM categories OFFSET $1 ORDER BY $2', [offset, order]);
  
    }else if(order && limit){
      queryCommand = await connection.query('SELECT * FROM categories ORDER BY $1 LIMIT $2', [order, limit]);
  
    }else if(offset && limit){
      queryCommand = await connection.query('SELECT * FROM categories OFFSET $1 LIMIT $2', [offset, limit]);
  
    }else if(limit){
      queryCommand = await connection.query('SELECT * FROM categories LIMIT $1', [limit]);
  
    }else if(offset){
      queryCommand = await connection.query('SELECT * FROM categories OFFSET $1', [offset]);
  
    }else if(order){
      queryCommand = await connection.query('SELECT * FROM categories ORDER BY $1', [order]);
  
    }else{
      queryCommand = await connection.query('SELECT * FROM categories');
    }
    
    res.locals.queryCommand = queryCommand;
    next();
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}