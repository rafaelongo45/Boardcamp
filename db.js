import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const { Pool } = pg;

const databaseConfig = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if(process.env.MODE === "PROD"){
  connection.ssl = {
    rejectUnauthorized: false
  }
}

const connection = new Pool(databaseConfig)

export default connection;