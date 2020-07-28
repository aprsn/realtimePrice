const { getRequest } = require('../requests/get.js');
const { ParseBodyJSON } = require("../functions/parseJson.js");
const crypto = require("crypto");
const buffer = require("buffer");
module.exports = {

     ProcessAuth(answer, password) {
        var pass_md5 = crypto.createHash("md5");
        var buf = buffer.transcode(Buffer.from(password, "utf8"), "utf8", "utf16le");
        pass_md5.update(buf, "binary");
        var pass_md5_digest = pass_md5.digest("binary");
      
        var md5 = crypto.createHash("md5");
        md5.update(pass_md5_digest, "binary");
        md5.update("WebAPI", "ascii");
        var md5_digest = md5.digest("binary");
      
        var answer_md5 = crypto.createHash("md5");
        answer_md5.update(md5_digest, "binary");
        var buf = Buffer.from(answer.srv_rand, "hex");
        answer_md5.update(buf, "binary");
        return answer_md5.digest("hex");
      },
      
       ProcessAuthFinal(answer, password, cli_random) {
        var pass_md5 = crypto.createHash("md5");
        var buf = buffer.transcode(Buffer.from(password, "utf8"), "utf8", "utf16le");
        pass_md5.update(buf, "binary");
        var pass_md5_digest = pass_md5.digest("binary");
      
        var md5 = crypto.createHash("md5");
        md5.update(pass_md5_digest, "binary");
        md5.update("WebAPI", "ascii");
        var md5_digest = md5.digest("binary");
      
        var answer_md5 = crypto.createHash("md5");
        answer_md5.update(md5_digest, "binary");
        answer_md5.update(cli_random, "binary");
        return answer.cli_rand_answer == answer_md5.digest("hex");
      },

      Auth(login, password, agent, build, callback) {
        getRequest(
          "/auth_start?version=" +
            build +
            "&agent=" +
            agent +
            "&login=" +
            login +
            "&type=manager",
          (err, res, body) => {
            var answer = ParseBodyJSON(err, res, body, callback);
            console.log(answer);
            if (answer) {
              var srv_rand_answer = module.exports.ProcessAuth(answer, password);
              var cli_random_buf = crypto.randomBytes(16);
              var cli_random_buf_hex = cli_random_buf.toString("hex");
              getRequest(
                "/auth_answer?srv_rand_answer=" +
                  srv_rand_answer +
                  "&cli_rand=" +
                  cli_random_buf_hex,
                (err, res, body) => {
                  console.log(body);
                }
              );
            }
          }
        );
      }

};