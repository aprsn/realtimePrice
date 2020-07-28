module.exports = {
  ParseBodyJSON(error, res, body, callback) {
    if (error) {
      callback && callback(error);
      return null;
    }
    if (res.statusCode != 200) {
      callback && callback(res.statusCode);
      return null;
    }
    var answer = null;
    try {
      answer = JSON.parse(body);
    } catch {
      console.log("Parse JSON error");
    }
    if (!answer) {
      callback && callback("invalid body answer");
      return null;
    }
    var retcode = parseInt(answer.retcode);
    if (retcode != 0) {
      callback && callback(answer.retcode);
      return null;
    }
    return answer;
  }
};
