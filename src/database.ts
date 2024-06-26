import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  models: [path.join(__dirname, '/models')]
});

export const ensureDatabaseExists = async () => {
    const connection = await mysql.createConnection({ 
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASS 
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.end();
};

export default sequelize;