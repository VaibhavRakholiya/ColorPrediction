const betController = require("./betcontroller");

var timerTimeOne = process.env.ROUND_TIMER_ONE;
var timerTimeTwo = process.env.ROUND_TIMER_TWO;
var timerTimeThree = process.env.ROUND_TIMER_THREE;
var timerTimeFour = process.env.ROUND_TIMER_FOUR;


var tempTimerOne = timerTimeOne;
var tempTimerTwo = timerTimeTwo;
var tempTimerThree = timerTimeThree;
var tempTimerFour = timerTimeFour;

var allSockets = [];

async function StartTimer(delay)
{
    // console.log('tempTimer: ', tempTimer);
        setTimeout(async () => 
        {
            if(tempTimerOne == 5)
            {
                betController.CalculateWinnings('1'); // Calculating winnings one second before sending events.
            }

            if(tempTimerTwo == 5)
            {
                betController.CalculateWinnings('2'); // Calculating winnings one second before sending events.
            }

            if(tempTimerThree == 5)
            {
                betController.CalculateWinnings('3'); // Calculating winnings one second before sending events.
            }

            if(tempTimerFour == 5)
            {
                betController.CalculateWinnings('4'); // Calculating winnings one second before sending events.
            }

            if(tempTimerOne == 0)
            {
                tempTimerOne = timerTimeOne;
            }

            if(tempTimerTwo == 0)
            {
                tempTimerTwo = timerTimeTwo;
            }

            if(tempTimerThree == 0)
            {
                tempTimerThree = timerTimeThree;
            }

            if(tempTimerFour == 0)
            {
                tempTimerFour = timerTimeFour;
            }

            if(tempTimerOne == 0)
            {
                delay = 1000;
            }
            else
            {
                delay = 1000;
            }
            await StartTimer(delay);

            tempTimerOne--;
            tempTimerTwo--;
            tempTimerThree--;
            tempTimerFour--;
        }, delay);
}

async function SendTimerEventEverySecond(socket,delay)
{
    if(allSockets.includes(socket.id) == false)
    {
        return;
    }

    setTimeout(async () => 
    {
        await socket.emit("RES_TIMER",
        {
            timerOne : parseInt(tempTimerOne),
            timerTwo : parseInt(tempTimerTwo),
            timerThree : parseInt(tempTimerThree),
            timerFour : parseInt(tempTimerFour)
        });
        if(tempTimerOne == 1)
        {
            await betController.SendWinnings(socket,'1');
        }

        if(tempTimerTwo == 1)
        {
            await betController.SendWinnings(socket,'2');
        }

        if(tempTimerThree == 1)
        {
            await betController.SendWinnings(socket,'3');
        }

        if(tempTimerFour == 1)
        {
            await betController.SendWinnings(socket,'4');
        }

        if(tempTimerOne == 0)
        {
            delay = 1000;
        }
        else
        {
            delay = 1000;
        }

        await SendTimerEventEverySecond(socket,delay);
    }, delay,socket);
}

function RegisterSocket(socketId)
{
    allSockets.push(socketId);
}

function StopTimer(socketId)
{
    allSockets.splice(allSockets.indexOf(socketId), 1);
}

module.exports = 
{
    StartTimer,SendTimerEventEverySecond,StopTimer,RegisterSocket
}