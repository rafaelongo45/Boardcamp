import chalk from "chalk";

import connection from "../db.js";

export async function getCustQuery(req,res,next){
  const { cpf, limit, offset } = req.query;
  let queryCommand = '';

  try {
    if(cpf && limit && offset){
      queryCommand = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1 OFFSET $2 LIMIT $3`, [cpf + '%', offset, limit])

    }else if(cpf && limit){
      queryCommand = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1 LIMIT $2`, [cpf + '%', limit])

    }else if(cpf && offset){
      queryCommand = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1 OFFSET $2`, [cpf + '%', offset])

    }else if(limit && offset){
      queryCommand = await connection.query(`SELECT * FROM customers OFFSET $1 LIMIT $2`, [offset, limit])

    }else if(cpf){
      queryCommand = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [cpf + '%'])

    }else if(offset){
      queryCommand = await connection.query(`SELECT * FROM customers OFFSET $1`, [offset])

    }else if(limit){
      queryCommand = await connection.query(`SELECT * FROM customers LIMIT $1`, [limit])
      
    }else{
      queryCommand = await connection.query(`SELECT * FROM customers`);
    }

    res.locals.queryCommand = queryCommand;
    next()
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}