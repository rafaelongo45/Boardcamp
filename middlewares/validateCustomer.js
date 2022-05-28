import joi from 'joi';
import chalk from "chalk";

import connection from "../db.js";

export function validateCustomerData(req,res,next){
  const { name, phone, cpf, birthday } = req.body;

  const schema = joi.object({
    name: joi.string().trim().min(1).required(),
    phone: joi.string().pattern(/^[0-9]{10,11}$/).required(),
    cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
    birthday: joi.string().isoDate()
  })

  const {error, value} = schema.validate({name, phone, cpf, birthday}, {abortEarly:false});

  if(error){
    console.log(error.details.map(e => e.message));

    return res.sendStatus(400);
  }

  next();
}

export async function isCpfRegistered(req,res,next){
  const { cpf } = req.body;

  try {
    const result = await connection.query(`SELECT * FROM customers`);
    const customers = result.rows;

    const hasCustomer = customers.find(customer => {
      return customer.cpf === cpf;
    })

    if(hasCustomer){
      return res.sendStatus(409);
    }

    next();
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}

export async function validateUniqueCpf(req,res,next){
  const { cpf } = req.body;

  try {
    const result = await connection.query(`SELECT * FROM customers`);
    const customers = result.rows;
    
    const isCpfUnique = customers.filter(customer => {
      return customer.cpf === cpf;
    })

    console.log(isCpfUnique)

    if(isCpfUnique.length > 1){
      return res.sendStatus(409);
    }

    next()
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}