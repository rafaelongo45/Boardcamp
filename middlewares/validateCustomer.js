import chalk from "chalk";

import connection from "../db.js";

export async function validateCustomer(req,res,next){
  const { name, phone, cpf, birthday } = req.body;
  const customerName = name.trim();

  const cpfRegex = /[0-9]{11}/
  const phoneRegex = /[0-9]{10,11}/
  const birthdayRegex = /[0-9]{4}\-[0-9]{2}\-[0-9]{2}/ //TODO: Regex mal feita e errada. Refazer depois! Tenta ver com o JOI

  const isString = typeof cpf !== 'string' || typeof phone !== 'string' || typeof birthday !== 'string';
  const regexTests = !cpfRegex.test(cpf) || !phoneRegex.test(phone) || !birthdayRegex.test(birthday)

  if(customerName.length === 0 || regexTests || isString){
    return res.sendStatus(400);
  }

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