import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import cors from 'cors';
import routes from './routes';

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

/*
  To parse the chunks for the incoming request
*/
app.use(bodyParser.json());

routes.init(app);

const server = http.createServer(app);

export default server;
