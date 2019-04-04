import ws from "ws";
import GameService from "./gameService";
import ShotzException from "../exceptions/ShotzException";

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
    sessionParser(info.req, {}, () => {
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
        throw new ShotzException(`No teams found for roomKey ${roomKey}`);
    } else {
        websocketServer.clients.forEach(client => {
            if (teams.includes(client.sessionId)) _sendMessage(client, message);
        });
    }
}

export async function sendMessageQuizmaster(roomKey, message) {
    const quizmasterId = await GameService.getQuizmaster(roomKey);

    if (!quizmasterId) throw new ShotzException(`No teams found for roomKey ${roomKey}`);

    for (let client of websocketServer.clients) {
        if (client.sessionId === quizmasterId) _sendMessage(client, message);
    }
}

export async function sendMessageTeam(roomKey, sessionId, message) {
    const teams = await GameService.getTeams(roomKey);
    if (!teams) {
    } else {
        websocketServer.clients.forEach(team => {
            if (team.sessionId === sessionId) _sendMessage(team, message);
        });
    }
}

async function _sendMessage(client, message) {
    if (message) {
        client.send(JSON.stringify(message));
    }
}
