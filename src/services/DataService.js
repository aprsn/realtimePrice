const { getRequest } = require("../requests/get");
const { ParseBodyJSON } = require("../functions/parseJson");

let currencies = ["BTCUSD"];
let query = "";
for(let item of currencies) {
  query += item + ",";
}
query = query.slice(0, -1);
var prices = new Object();

module.exports = {
  async getPrices() {
    getRequest(
      "/tick_last?symbol=" + query + "&trans_id=0",
      (err, res, body) => {
        var answer = ParseBodyJSON(err, res, body, null);
        for (let i = 0; i < answer.answer.length; i++) {
          prices[answer.answer[i].Symbol] = answer.answer[i].Ask;
        }
      }
    );
    return prices;
  }
};
