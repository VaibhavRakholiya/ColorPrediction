const moment = require('moment-timezone');

async function getAllIndexes(arr, val) {
  var indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

function getCurrentTime() {
  const currentDate = new Date();

  // Get the current date and time in UTC
  const utcDateTime = moment.utc();

  // Convert UTC time to IST (Indian Standard Time)
  const istDateTime = utcDateTime.tz('Asia/Kolkata');

  // Format the IST time string in the desired format
  const formattedISTTime = istDateTime.format('DD-MMM-YYYY hh:mm:ss A');

  return formattedISTTime;
}

function findNearestMean(array) {
  // Calculate the mean of the array
  const sum = array.reduce((acc, val) => acc + val, 0);
  const mean = sum / array.length;

  // Initialize variables to keep track of the nearest mean and its difference
  let nearestValue = array[0];
  let minDifference = Math.abs(array[0] - mean);

  // Iterate through the array to find the nearest mean value
  for (let i = 1; i < array.length; i++) {
      const difference = Math.abs(array[i] - mean);
      if (difference < minDifference) {
          minDifference = difference;
          nearestValue = array[i];
      }
  }

  return nearestValue;
}

module.exports = { getAllIndexes,getCurrentTime,findNearestMean};
