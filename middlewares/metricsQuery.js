import chalk from "chalk";
import moment from "moment";

import connection from "../db.js";

export async function getMetricsQuery(req,res,next){
  const { startDate, endDate } = req.query;
  let queryCommand = '';

  try {
    if(startDate && endDate){
      queryCommand = await connection.query(`
        SELECT SUM(rentals."originalPrice") AS sum_original_price, SUM(rentals."delayFee") AS sum_delay_fee, COUNT(rentals.id) AS total_rentals
        FROM rentals
        WHERE rentals."returnDate" IS NOT NULL
        AND rentals."rentDate" >= $1
        AND rentals."rentDate" <= $2
      `, [moment(startDate,'YYYY-MM-DD'), moment(endDate,'YYYY-MM-DD')])
    }else if(startDate){
      queryCommand = await connection.query(`
        SELECT SUM(rentals."originalPrice") AS sum_original_price, SUM(rentals."delayFee") AS sum_delay_fee, COUNT(rentals.id) AS total_rentals
        FROM rentals
        WHERE rentals."returnDate" IS NOT NULL
        AND rentals."rentDate" >= $1
      `, [moment(startDate,'YYYY-MM-DD')])
    }else if(endDate){
      queryCommand = await connection.query(`
        SELECT SUM(rentals."originalPrice") AS sum_original_price, SUM(rentals."delayFee") AS sum_delay_fee, COUNT(rentals.id) AS total_rentals
        FROM rentals
        WHERE rentals."returnDate" IS NOT NULL
        AND rentals."rentDate" <= $1
      `, [moment(endDate,'YYYY-MM-DD')])
    }else{
      queryCommand = await connection.query(`
      SELECT SUM(rentals."originalPrice") AS sum_original_price, SUM(rentals."delayFee") AS sum_delay_fee, COUNT(rentals.id) AS total_rentals
      FROM rentals
      WHERE rentals."returnDate" IS NOT NULL 
    `)
    }
    const {sum_original_price, sum_delay_fee, total_rentals} = queryCommand.rows[0];
    const revenue = sum_delay_fee === null ? sum_original_price : sum_original_price + sum_delay_fee;

    const metricsObject = {
      revenue: revenue,
      rentals: total_rentals,
      average: (revenue / total_rentals).toFixed(2)
    }

    res.locals.metricsObject = metricsObject;

    next();
  } catch (e) {
    console.log(chalk.red.bold('Erro no servidor!'));
    console.log(e);
    return res.sendStatus(500);
  }
}