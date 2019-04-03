import ws from 'ws'
import GameService from "./gameService";

let websocketServer

let sessionParser

export function initWSServer(sessionParserParam, httpServer) {
    websocketServer = new ws.Server({
        server: httpServer,
        path: "/ws",
        verifyClient: (info, req) => parseSession(info, req)
    })
    sessionParser = sessionParserParam
    websocketServer.on('connection', _onConnection)
}

function parseSession(info, done) {
    console.log("parsing session from request")
    sessionParser(info.req, {}, () => {
        console.log("session parsed")
        done(info.req.session)
    })
}

function _onConnection(websocket, req) {
    console.log(`INFO: New websocket connection with IP: ${req.connection.remoteAddress}, session: ${req.session.id} `)
    websocket.sessionId = req.session.id
}

export async function sendMessageTeams(roomKey, message) {
    const teams = await GameService.getTeams(roomKey);
    websocketServer.clients.forEach(client => {
        if (teams.includes(client.sessionId)) _sendMessage(client, message);
    });
}

export async function sendMessageQuizmaster(roomKey, message) {
    const quizmasterId = await GameService.getQuizmaster(roomKey);

    for (let client of websocketServer.clients) {
        console.log("CLIENT: ", client.sessionId)
        console.log(quizmasterId)
        console.log(client.sessionId === quizmasterId)
        if (client.sessionId === quizmasterId) _sendMessage(client, message)
    }
}

async function _sendMessage(client, message) {
    if (message) client.send(JSON.stringify(message));
}


// export default class WebsocketService {
//     constructor(wsServer, sessionParser) {
//         this.wsServer = wsServer;
//         this.sessionParser = sessionParser;
//         this.wsServer.on("connection", (websocket, req) => this.onConnection(websocket, req));
//     }

//     onConnection(websocket, req) {
//       this.sessionParser(req, {}, async () => {
//             console.log(`INFO: New websocket connection with IP: ${req.connection.remoteAddress} `)
//             console.log("Session is parsed")
//             websocket.sessionId = req.session.id

//             req.session.websocket = websocket

//             const stateResponse = await GameService.restoreSession(req.session.roomKey, req.session.id)

//             if(stateResponse) {
//                 req.session.websocket.send(JSON.stringify(stateResponse))
//             }
//         });
//     }


// }

// function sendWSMessageToQuizmaster(roomKey, message) {
//     //Get quizmaster session id from db
//     //find quizmaster by session id in list of ws clients
//     //profit
// }

// function sendWSMessageToTeam(roomKey, team, message) {
//     //Get team session id from db
//     //find quizmaster by session id in list of ws clients
//     //profit
// }

// function broadcastToAllTeams(roomKey, message) {
//     //Get al teams session ids from db (array)
//     //Send all teams the message
//     //profit
// }
