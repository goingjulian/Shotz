/*

███████╗██╗  ██╗ ██████╗ ████████╗███████╗        █████╗     ██████╗ ███████╗ █████╗ ██╗   ██╗████████╗██╗███████╗██╗   ██╗██╗          ██████╗ ██╗   ██╗██╗███████╗     █████╗ ██████╗ ██████╗ ██╗     ██╗ ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
██╔════╝██║  ██║██╔═══██╗╚══██╔══╝╚══███╔╝       ██╔══██╗    ██╔══██╗██╔════╝██╔══██╗██║   ██║╚══██╔══╝██║██╔════╝██║   ██║██║         ██╔═══██╗██║   ██║██║╚══███╔╝    ██╔══██╗██╔══██╗██╔══██╗██║     ██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
███████╗███████║██║   ██║   ██║     ███╔╝        ███████║    ██████╔╝█████╗  ███████║██║   ██║   ██║   ██║█████╗  ██║   ██║██║         ██║   ██║██║   ██║██║  ███╔╝     ███████║██████╔╝██████╔╝██║     ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
╚════██║██╔══██║██║   ██║   ██║    ███╔╝         ██╔══██║    ██╔══██╗██╔══╝  ██╔══██║██║   ██║   ██║   ██║██╔══╝  ██║   ██║██║         ██║▄▄ ██║██║   ██║██║ ███╔╝      ██╔══██║██╔═══╝ ██╔═══╝ ██║     ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
███████║██║  ██║╚██████╔╝   ██║   ███████╗▄█╗    ██║  ██║    ██████╔╝███████╗██║  ██║╚██████╔╝   ██║   ██║██║     ╚██████╔╝███████╗    ╚██████╔╝╚██████╔╝██║███████╗    ██║  ██║██║     ██║     ███████╗██║╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝╚═╝    ╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝╚═╝      ╚═════╝ ╚══════╝     ╚══▀▀═╝  ╚═════╝ ╚═╝╚══════╝    ╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝                                                                                                                                                                                                                                                                                                                                                                                              

Made by Julian Korf de Gidts and Wout Janssen

ASCII art from http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow&t=Shotz%2C%20a%20beautiful%20quiz%20application
*/

import express from 'express';
import http from 'http';
import ws from 'ws';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import addQuestionsToDB from './questionSeed'

import room from './routes/roomRouter';
import { initWSServer } from './service/websocketService'

const app = express();
const APIPort = 3000;
const httpServer = http.createServer(app);

let sessionParser;

const dbName = process.env.DB_NAME || 'shotz';
const dbAuth = process.env.DB_AUTH || 'admin';
const dbPort = process.env.DB_PORT || '27017';
const dbUrl = process.env.DB_URL || 'localhost';
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';

mongoose.connection.on('connecting', () => {
  console.log(`INFO: Trying to connect to the database on ${dbUrl} with port ${dbPort}`);
});

mongoose.connection.on('connected', async () => {
  console.log(`SUCCESS: Database connected succesfully on ${dbUrl} with port ${dbPort}`);

  runAPIServer();
  initWSServer(sessionParser, httpServer);

  try {
    await addQuestionsToDB();
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    shutdownAPIServer();
  }
});

mongoose.connection.on('error', error => {
  console.log(`ERROR: Error occured during database operation, error: ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.log(`WARNING: disconnected from database on ${dbUrl} with port ${dbPort}`);
  shutdownAPIServer();
});

mongoose.connection.on('reconnected', () => {
  console.log(`INFO: Reconnected with database on ${dbUrl} with port ${dbPort} after losing connection`);
});

connectToMongo();

async function connectToMongo() {
  let connectionString;
  if (dbUser && dbPassword) {
    connectionString = `mongodb://${dbUser}:${dbPassword}@${dbUrl}:${dbPort}/${dbName}?authSource=${dbAuth}`;
  } else {
    connectionString = `mongodb://${dbUrl}:${dbPort}/${dbName}?authSource=${dbAuth}`;
  }

  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    bufferMaxEntries: 0 //if no db connection, immediately give out an error
  });
}

function runAPIServer() {
  const MongoStore = connectMongo(session);

  app.use(cors({ origin: true, credentials: true }));

  app.use(bodyParser.json());

  sessionParser = session({
    resave: true,
    saveUninitialized: true,
    secret: 'secretkey',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  });

  app.use(sessionParser);

  app.use('/room', room);

  app.use((err, req, res, next) => {
    console.log(err.message);
    const errMsg = err.message || "Destination URL not found";
    const errCode = err.htmlErrorCode || 404;
    res.status(errCode).json({ error: `${errMsg}` });
  });

  httpServer.listen(APIPort, () => {
    console.log(`INFO: API Server listening on port ${APIPort}`);
  });
}

function shutdownAPIServer() {
  console.log(`WARNING: API Server shutting down`);
  httpServer.close(() => console.log(`WARNING: API server is offline`));
}