const { getPrices } = require("../services/DataService");


var allowedIPs = ["192.168.1.1"];
var price;

module.exports = {
    runSocket() {
        setTimeout(function() {
            console.log("Prices called!");
            setInterval(async function() {
                price = await getPrices();
                console.log(price);
            }, 100);
        }, 1000);

        wss.on('connection', ws => {
            var remoteIP = ws._socket.remoteAddress.replace("::ffff:", "");
            var userAllowed = false;
            for(const item of allowedIPs) {
                if(item == remoteIP) {
                    userAllowed = true;
                }
            }
            if(!userAllowed) { ws.close(); return false; }
            ws.on('message', message => {
                ws.send(message + 'started');
            })
            setInterval(function() {
                ws.send(JSON.stringify(price));
            }, 100);
        }); 
    }
};
