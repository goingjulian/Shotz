import express from 'express';
import http from 'http';
import ws from 'ws'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import mongoose from 'mongoose'
import room from './routes/room'

const app = express()
const httpServer = http.createServer(app);

const MongoStore = connectMongo(session)

const dbName = "shotz"

mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true }, () => {
    console.log(`DB connected`);
});

const webSocketServer = new ws.Server({
    server: httpServer,
    path: "/ws"
})

app.use(bodyParser.json())

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: "secretkey",
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

app.use("/room", room)

const port = 3000

httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})