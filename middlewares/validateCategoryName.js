import chalk from "chalk";

import connection from "../db.js";

export async function validateCategoryName(req,res, next){
  const { name } = req.body;
  const categoryName = name.trim()

  if(categoryName.length === 0){
    return res.sendStatus(400);
  }

  try {
    const result = await connection.query('SELECT * FROM categories');
    const categories = result.rows;
    
    const sameName = categories.find(category => {
      return category.name === categoryName
    })

    if(sameName){
      return res.sendStatus(409);
    }

    res.locals.categoryName = categoryName;
    next();
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}