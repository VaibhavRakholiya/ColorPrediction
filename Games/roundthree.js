const gameHistory = require('../model/gamehistory/gamehistory');
const utilMethods = require('./utils');

var allBets = [];

async function AddBet(data)
{
  let socketId = data.socketId;
  let betAmount = data.betAmount;
  let betNumbers = data.betNumbers;

  result = 
  {
    socketId,
    betAmount,
    betNumbers
  }

  allBets.push(result);
}

async function findLeastBettedNumber(winningValue)
{
  finalNumber = 0;
  betOnFinalNumber = 0;

  let betOnNumbers = [0,0,0,0,0,0,0,0,0,0];
  console.log("All Bets ",allBets);

  for (let index = 0; index < allBets.length; index++) 
  {
    const bet = allBets[index];
    let betNumbers = bet.betNumbers.split(",");
    for (let index = 0; index < betNumbers.length; index++) {
      const betNumber = parseInt(betNumbers[index]);
      betOnNumbers[betNumber] += parseInt(bet.betAmount);
    }
  }
// console.log("Bet On Numbers ",betOnNumbers);
  let minimumBettedNumber =  betOnNumbers[0];

  if(parseInt(winningValue) == 50)
  {
    minimumBettedNumber = utilMethods.findNearestMean(betOnNumbers);
  }
  else
  {
    minimumBettedNumber =  parseInt(winningValue) < 50 ? Math.min(...betOnNumbers) : Math.max(...betOnNumbers);
  }
  // console.log("Minimum betted number ",minimumBettedNumber);
  let leastBettedIndexes = await utilMethods.getAllIndexes(betOnNumbers,minimumBettedNumber);
  // console.log("Least Betted Numbers are ",leastBettedIndexes);
  let randomNumber = Math.floor((Math.random() * leastBettedIndexes.length));
  // console.log("Random Number is ",randomNumber);
  betOnFinalNumber = leastBettedIndexes[randomNumber];
  // console.log("Least Betted Number is ",randomLeastBettedIndex);
  if(betOnFinalNumber == null || betOnFinalNumber == undefined)
  {
    betOnFinalNumber = Math.floor(Math.random() * (betOnNumbers.length-1));
  }
  return betOnFinalNumber;
}

async function CalculateWinnings(winningValue)
{
  let winningMultiplier = 10;
  let spinStopNumber = await findLeastBettedNumber(winningValue); // Generating Random Number on which ball will be stopped.
  
  let result =
  {
    roundType : "RoundThree",
    winningPlayers : [],
    spinStopNumber : spinStopNumber,
  };

  gameHistory.CreateGameHistory("RoundThree",spinStopNumber); // Creating game history to show on admin panel.

  for (let index = 0; index < allBets.length; index++) 
  {
    const element = allBets[index];
    let betAmount = element.betAmount;
    let splittedNumbers = element.betNumbers.split(",");
    
    let isUserWinning = splittedNumbers.includes(spinStopNumber); // Checking whether user is winning or not.

    if(isUserWinning)
    {
      finalWinnings = winningMultiplier * betAmount; // Final Winnings for User.
      result.winningPlayers.push(
        {
          socketId : element.socketId,
          winningAmount : finalWinnings
        }
      )
    }
  }
  allBets = [];
  return result;
}


module.exports = {AddBet,CalculateWinnings };
