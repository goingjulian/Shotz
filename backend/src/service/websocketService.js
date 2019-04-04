import ws from "ws";
import GameService from "./gameService";
import ShotzException from '../exceptions/ShotzException';

let websocketServer;

let sessionParser;

export function initWSServer(sessionParserParam, httpServer) {
    websocketServer = new ws.Server({
        server: httpServer,
        path: "/ws",
        verifyClient: (info, req) => parseSession(info, req)
    });
    sessionParser = sessionParserParam;
    websocketServer.on("connection", _onConnection);
}

function parseSession(info, done) {
    console.log("parsing session from request");
    sessionParser(info.req, {}, () => {
        console.log("session parsed");
        done(info.req.session);
    });
}

function _onConnection(websocket, req) {
    console.log(`INFO: New websocket connection with IP: ${req.connection.remoteAddress}, session: ${req.session.id} `);
    websocket.sessionId = req.session.id;
}

export async function sendMessageTeams(roomKey, message) {
    const teams = await GameService.getTeams(roomKey);

    if (!teams) {
        throw new ShotzException(`No teams found for roomKey ${roomKey}`)
    }

    websocketServer.clients.forEach(client => {
        if (teams.includes(client.sessionId)) _sendMessage(client, message);
    });
}

export async function sendMessageQuizmaster(roomKey, message) {
    const quizmasterId = await GameService.getQuizmaster(roomKey);

    if (!quizmasterId) throw new ShotzException(`No teams found for roomKey ${roomKey}`)

    for (let client of websocketServer.clients) {
        // console.log("CLIENT: ", client.sessionId)
        // console.log(quizmasterId)
        // console.log(client.sessionId === quizmasterId)
        if (client.sessionId === quizmasterId) _sendMessage(client, message);
    }
}

async function _sendMessage(client, message) {
    if (message) {
        client.send(JSON.stringify(message));
    }
}
