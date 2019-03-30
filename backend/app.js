import express from 'express';
import http from 'http';
import ws from 'ws'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import mongoose from 'mongoose'
import room from './routes/room'

const MongoStore = connectMongo(session)

const dbName = "shotz"

//Todo:: introduce error handling for when db goes offline after inital startup
//Todo prevent use of the app when the server is offline
mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true })
    .then(
        () => console.log("DB connected succesfully"),
        error => console.log(`Error occured while trying to connect to the database, error: ${error}`)
    )

const app = express()

app.use(bodyParser.json())

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: "secretkey",
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use("/room", room)

// const webSocketServer = new ws.Server({
//     server: httpServer,
//     path: "/ws"
// })

const port = 3000

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})