const gameHistory = require('../model/gamehistory/gamehistory');

class GameHistoryController {
  async getGameHistory(req, res) {
    try {
      console.log("Body in Game History", req.body);
      let gameType = req.body.gameType;

      const data = await gameHistory.GetGameHistoryByType(gameType);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "Success",
        data
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
}

module.exports = { gameHistoryController: new GameHistoryController(), };