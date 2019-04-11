import ws from "ws";
import GameService from "./gameService";
import ShotzException from "../exceptions/ShotzException";
import GameDAO from './../DAO/GameDao';
import RoomService from "./roomService";

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
    sessionParser(info.req, {}, async () => {
        const sessionId = info.req.sessionID;
        const ids = await GameDAO.getGameWithSessionId(sessionId);
        if (!sessionId || !ids) {
            done(false);
        } else {
            done(true);
        }
    });
}

function _onConnection(websocket, req) {
    console.log(`INFO: New websocket connection with IP: ${req.connection.remoteAddress}, session: ${req.session.id} `);
    websocket.sessionId = req.session.id;
}

export async function sendMessageTeams(roomKey, message) {
    const teams = await RoomService.getTeams(roomKey);
    if (!teams) {
        throw new ShotzException(`No teams found for roomKey ${roomKey}`);
    } else {
        for (let client of websocketServer.clients) {
            for (let team of teams) {
                if (team.sessionId === client.sessionId) _sendMessage(client, message);
            }
        }
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
    for (let client of websocketServer.clients) {
        if (client.sessionId === sessionId) _sendMessage(client, message);
    }
}

export async function sendMessageScoreBoards(roomKey, message) {
    const result = await GameService.getScoreBoards(roomKey);
    console.log(result);
    if (!result) {
        throw new ShotzException(`No scoreboards found for roomKey ${roomKey}`);
    } else {
        for (let client of websocketServer.clients) {
            result.scoreboards.forEach(scoreboard => {
                if (scoreboard === client.sessionId) _sendMessage(client, message);
            })
        }
    }
}


export function closeConnection(sessionId) {
    for (let client of websocketServer.clients) {
        if (client.sessionId === sessionId) client.close();
    }
}

async function _sendMessage(client, message) {
    if (message) {
        client.send(JSON.stringify(message));
    }
}
