const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const server = new https.createServer({
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key.pem'),
    ca: fs.readFileSync('./chain.pem'),
});
global.wss = new WebSocket.Server({ server });
server.listen(440);


const { runSocket } = require('./src/services/SocketService');
const login = 0000;
const password = "PASSWORD";
const agent = "WebTrader";
const build = 1985;


const { Auth } = require('./src/auth/auth.js');
const { getRequest } = require('./src/requests/get');


Auth(login, password, agent, build);

setTimeout(() => {
    getRequest("/tick_last?symbol=USDJPY&trans_id=0", (err, res, body) => {
        console.log(body);
    });
}, 1000);
// runSocket();



