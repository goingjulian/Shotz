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
import ws from 'ws'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'

import room from './routes/room'

const app = express()
const APIPort = 3000
const httpServer = http.createServer(app);

let websocketServer
let sessionParser

const dbName = process.env.DB_NAME || "shotz"
const dbAuth = process.env.DB_AUTH || "admin"
const dbPort = process.env.DB_PORT || "27017"
const dbUrl = process.env.DB_URL || "localhost"
const dbUser = process.env.DB_USER || ''
const dbPassword = process.env.DB_PASSWORD || ''

mongoose.connection.on("connecting", () => {
    console.log(`INFO: Trying to connect to the database on ${dbUrl} with port ${dbPort}`)
})

mongoose.connection.on("connected", () => {
    console.log(`SUCCESS: Database connected succesfully on ${dbUrl} with port ${dbPort}`)
    runAPIServer()
    runWsServer()
})

mongoose.connection.on("error", (error) => {
    console.log(`ERROR: Error occured during database operation, error: ${error}`)
})

mongoose.connection.on("disconnected", () => {
    console.log(`WARNING: disconnected from database on ${dbUrl} with port ${dbPort}`)
    shutdownAPIServer()
})

mongoose.connection.on("reconnected", () => {
    console.log(`INFO: Reconnected with database on ${dbUrl} with port ${dbPort} after losing connection`)
})

connectToMongo();

async function connectToMongo() {
    let connectionString
    if (dbUser && dbPassword) {
        connectionString = `mongodb://${dbUser}:${dbPassword}@${dbUrl}:${dbPort}/${dbName}?authSource=${dbAuth}`
    } else {
        connectionString = `mongodb://${dbUrl}:${dbPort}/${dbName}?authSource=${dbAuth}`
    }

    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        bufferMaxEntries: 0 //if no db connection, immediately give out an error
    })
}

function runAPIServer() {
    const MongoStore = connectMongo(session)

    app.use(cors({ origin: true, credentials: true }));

    app.use(bodyParser.json())

    sessionParser = session({
        resave: true,
        saveUninitialized: false,
        secret: "secretkey",
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })

    app.use(sessionParser)

    app.use("/room", room)

    httpServer.listen(APIPort, () => {
        console.log(`INFO: API Server listening on port ${APIPort}`)
    })
}

function shutdownAPIServer() {
    console.log(`WARNING: API Server shutting down`)
    httpServer.close(() => console.log(`WARNING: API server is offline`))
}

function runWsServer() {
    websocketServer = new ws.Server({
        server: httpServer,
        path: "/ws",
        verifyClient: checkConnectionAttempt
    })

    websocketServer.on("connection", (websocket, req) => {
        console.log(`INFO: New websocket connection with IP: ${req.connection.remoteAddress} `)

        websocket.sessionId = req.session.id
        
        req.session.websocket = websocket

        req.session.websocket.send("Hello world")

        websocket.on("message", message => {
            console.log("WS message received: ", message, " from ", websocket.sessionId)
        })

        websocket.on("close", () => {
            console.log("Websocket connection closed")
        })
    })
}

function checkConnectionAttempt(info, done) {
    sessionParser(info.req, {}, () => {
        console.log("Session is parsed")
        done(info.req.session.roomKey !== undefined)
    })
}
