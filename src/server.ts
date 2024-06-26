import express, { Express } from "express";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import sequelize, { ensureDatabaseExists } from "./database";
import routes from './routes';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('', routes);

const startServer = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});