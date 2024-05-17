const gameHistory = require("./index");
const utils = require("../../Games/utils");

async function CreateGameHistory(gameType, notToOpenNumber) {
  data = {
    not_open_number: notToOpenNumber,
    game_type: gameType,
    created_at: utils.getCurrentTime(),
  };
  console.log("data: ", data);
  gameHistory.create(data);
}

async function GetGameHistoryByType(gameType) {
  // Calculate the time 24 hours ago
  const istOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds for IST (UTC+5:30)
let today = new Date();
today = new Date(today.getTime() + istOffset);
console.log("Today is ",today);
// Calculate start of day in IST
const startOfDayUTC = new Date(today.setUTCHours(0, 0, 0, 0));
const startOfDayIST = new Date(startOfDayUTC.getTime()-istOffset);
console.log("Start of Day is ", startOfDayUTC);

// Calculate end of day in IST
const endOfDayUTC = new Date(today.setUTCHours(23, 59, 59, 999));
const endOfDayIST = new Date(endOfDayUTC.getTime() - istOffset);

console.log("End of Day is ", endOfDayIST);

const query = {
  game_type: gameType,
  createdAt: {
    $gt: startOfDayIST,
    $lt: endOfDayIST,
  },
};

  const allData = await gameHistory.find(query).sort({ createdAt: -1 }); // Sort by createdAt field in descending order
  return allData;
}

module.exports = { CreateGameHistory, GetGameHistoryByType };
