export default class WebsocketService {
    constructor(wsServer, sessionParser) {
        this.wsServer = wsServer
        this.sessionParser = sessionParser
        this.wsServer.on("connection", (websocket, req) => this.onConnection(websocket, req))
    }

    onConnection(websocket, req) {
        this.sessionParser(req, {}, () => {
            console.log(`INFO: New websocket connection with IP: ${req.connection.remoteAddress} `)
            console.log("Session is parsed")
            websocket.sessionId = req.session.id

            req.session.websocket = websocket

            req.session.websocket.send(JSON.stringify({
                type: "addTeam",
                id: "0",
                name: "Team Cool"
            }))
        })        
    }
}

function sendWSMessageToQuizmaster(roomKey, message) {
    //Get quizmaster session id from db
    //find quizmaster by session id in list of ws clients
    //profit
}

function sendWSMessageToTeam(roomKey, team, message) {
    //Get team session id from db
    //find quizmaster by session id in list of ws clients
    //profit
}

function broadcastToAllTeams(roomKey, message) {
    //Get al teams session ids from db (array)
    //Send all teams the message
    //profit
}