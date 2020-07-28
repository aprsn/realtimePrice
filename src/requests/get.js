const https = require("https");
const server = "crm.lfmanager.com";
const httpsAgent = new https.Agent({ maxSockets: 1 , keepAlive: true, keepAliveMsecs: 5000 });
module.exports = {
  getRequest(path, callback) {
    var options = {
      hostname: server,
      port: 443,
      path: path,
      agent: httpsAgent,
      headers: { Connection: "keep-alive" },
      rejectUnauthorized: false
    };
    var req = https
      .get(options, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", chunk => {
          body += chunk;
        });

        res.on("end", () => {
          callback(null, res, body);
        });
      })
      .on("error", err => {
        console.log("Error: " + err);
        callback(err);
      });

    req.end();
  }
};
