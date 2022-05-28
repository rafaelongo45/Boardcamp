import chalk from "chalk";

import connection from "../db.js";

export async function postCustomer(req, res){
  const { name, phone, cpf, birthday } =  req.body;
  const customerName = name.trim();

  try {
    await connection.query(
    `
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ($1, $2, $3, $4)
    `, [customerName, phone, cpf, birthday]);

    res.sendStatus(201);

  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function getCustomers(req,res){
  const { cpf, limit, offset } = req.query;
  let queryDeclaration = await connection.query(`SELECT * FROM customers`);

  if(cpf && limit && offset){
    queryDeclaration = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1 OFFSET $2 LIMIT $3`, [cpf + '%', offset, limit])
  }else if(cpf && limit){
    queryDeclaration = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1 LIMIT $2`, [cpf + '%', limit])
  }else if(cpf && offset){
    queryDeclaration = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1 OFFSET $2`, [cpf + '%', offset])
  }else if(limit && offset){
    queryDeclaration = await connection.query(`SELECT * FROM customers OFFSET $1 LIMIT $2`, [offset, limit])
  }else if(cpf){
    queryDeclaration = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [cpf + '%'])
  }else if(offset){
    queryDeclaration = await connection.query(`SELECT * FROM customers OFFSET $1`, [offset])
  }else if(limit){
    queryDeclaration = await connection.query(`SELECT * FROM customers LIMIT $1`, [limit])
  }

  try {
    const result = queryDeclaration
    const customers = result.rows;

    res.send(customers);
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function getSpecificCustomer(req,res){
  const { id } = req.params;

  try {
    const result = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id]);
    const customer = result.rows;

    if(customer.length === 0){
      return res.sendStatus(404);
    }

    res.send(customer[0])
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function updateCustomer(req,res){
  const{ id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  
  try {
    await connection.query(`UPDATE customers 
    SET name=$1, phone=$2, cpf=$3, birthday=$4 
    WHERE id=$5`, [name, phone, cpf, birthday, id]);

    res.sendStatus(200);
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}