import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes';
import logger from './utils/logger';

/*
    To configure environment variables for the application
*/
const envload = dotenv.config({ path: `${__dirname}/../.env` });

if (envload.error) {
  logger.error('Unable to load environment variables');
}

/*
  Defining the express app below
*/
const app = express();

/*
  To enable cors configuration 
*/
const corsOptions: any = {
  origin: '*',
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(morgan('tiny'));

/*
  To parse the chunks for the incoming request
*/
app.use(bodyParser.json());

routes.init(app);

const server = http.createServer(app);

export default server;
