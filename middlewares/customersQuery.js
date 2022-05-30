import chalk from "chalk";

import connection from "../db.js";

export async function getCustQuery(req,res,next){
  const { cpf, limit, offset } = req.query;
  let queryCommand = '';

  try {
    if(cpf && limit && offset){
      queryCommand = await connection.query(`SELECT customers.*, COUNT (rentals."customerId") AS "rentalsCount"
      FROM customers
      LEFT JOIN rentals ON rentals."customerId" = customers.id 
      WHERE cpf LIKE $1
      GROUP BY customers.id 
      OFFSET $2 LIMIT $3`, [cpf + '%', offset, limit])

    }else if(cpf && limit){
      queryCommand = await connection.query(`SELECT customers.*, COUNT (rentals."customerId") AS "rentalsCount"
      FROM customers
      LEFT JOIN rentals ON rentals."customerId" = customers.id 
      WHERE cpf LIKE $1
      GROUP BY customers.id 
      LIMIT $2`, [cpf + '%', limit])

    }else if(cpf && offset){
      queryCommand = await connection.query(`SELECT customers.*, COUNT (rentals."customerId") AS "rentalsCount"
      FROM customers
      LEFT JOIN rentals ON rentals."customerId" = customers.id 
      WHERE cpf LIKE $1
      GROUP BY customers.id 
      OFFSET $2`, [cpf + '%', offset])

    }else if(limit && offset){
      queryCommand = await connection.query(`SELECT customers.*, COUNT (rentals."customerId") AS "rentalsCount"
      FROM customers
      LEFT JOIN rentals ON rentals."customerId" = customers.id 
      GROUP BY customers.id
      OFFSET $1 LIMIT $2`, [offset, limit])

    }else if(cpf){
      queryCommand = await connection.query(`SELECT customers.*, COUNT (rentals."customerId") AS "rentalsCount"
      FROM customers
      LEFT JOIN rentals ON rentals."customerId" = customers.id 
      WHERE cpf LIKE $1
      GROUP BY customers.id  
      `, [cpf + '%'])

    }else if(offset){
      queryCommand = await connection.query(`SELECT customers.*, COUNT (rentals."customerId") AS "rentalsCount"
      FROM customers
      LEFT JOIN rentals ON rentals."customerId" = customers.id 
      GROUP BY customers.id
      OFFSET $1`, [offset])

    }else if(limit){
      queryCommand = await connection.query(`SELECT customers.*, COUNT (rentals."customerId") AS "rentalsCount"
      FROM customers
      LEFT JOIN rentals ON rentals."customerId" = customers.id 
      GROUP BY customers.id 
      LIMIT $1`, [limit])
      
    }else{
      queryCommand = await connection.query(`SELECT customers.*, COUNT (rentals."customerId") AS "rentalsCount"
      FROM customers
      LEFT JOIN rentals ON rentals."customerId" = customers.id 
      GROUP BY customers.id
      `);
    }

    res.locals.queryCommand = queryCommand;
    next()
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}