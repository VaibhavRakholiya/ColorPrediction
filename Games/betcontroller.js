const roundOne = require("./roundone");
const roundtwo = require("./roundtwo");
const roundthree = require("./roundthree");
const roundfour = require("./roundfour");
const settings = require("../model/settings/index")

async function AddBet(roundType,betData)
{
    if(roundType == "RoundOne")
    {
        roundOne.AddBet(betData);
    }

    if(roundType == "RoundTwo")
    {
        roundtwo.AddBet(betData);
    }

    if(roundType == "RoundThree")
    {
        roundthree.AddBet(betData);
    }

    if(roundType == "RoundFour")
    {
        roundfour.AddBet(betData);
    }

}
var winningDataRoundOne;
var winningDataRoundTwo;
var winningDataRoundThree;
var winningDataRoundFour;

async function CalculateWinnings(roundNo)
{
    console.log("Calculating winnings.");

    if(roundNo == '1')
    {
            let winningValue = await settings.getAllSetting();
            winningValue = winningValue?.[0]?.value;
        
            let roundOneWinningData = await roundOne.CalculateWinnings(winningValue);
        
            winningDataRoundOne = 
            {
                roundOneWinningData,
            }
    }

    if(roundNo == '2')
    {
            let winningValue = await settings.getAllSetting();
            winningValue = winningValue?.[0]?.value;
        
            let roundOneWinningData = await roundtwo.CalculateWinnings(winningValue);
        
            winningDataRoundTwo = 
            {
                roundOneWinningData,
            }
    }

    if(roundNo == '3')
    {
        let winningValue = await settings.getAllSetting();
        winningValue = winningValue?.[0]?.value;
    
        let roundOneWinningData = await roundthree.CalculateWinnings(winningValue);
    
        winningDataRoundThree = 
        {
            roundOneWinningData,
        }
    }

    if(roundNo == '4')
    {
        let winningValue = await settings.getAllSetting();
        winningValue = winningValue?.[0]?.value;
    
        let roundOneWinningData = await roundfour.CalculateWinnings(winningValue);
    
        winningDataRoundFour = 
        {
            roundOneWinningData,
        }
    }
}

async function SendWinnings(socket,roundNo)
{
    let finalWinningData = winningDataRoundOne;

    if(roundNo == '2')
    {
        finalWinningData = winningDataRoundTwo;
    }

    if(roundNo == '3')
    {
        finalWinningData = winningDataRoundThree;
    }

    if(roundNo == '4')
    {
        finalWinningData = winningDataRoundFour;
    }

    socket.emit("RES_BET",finalWinningData);
}


module.exports = {AddBet,CalculateWinnings,SendWinnings};