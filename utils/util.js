const generateRandomPassword = () => {
  const length = 8;
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // Characters to include in the password

  // Generate an array of random characters using Array.from()
  const randomChars = Array.from({ length }, () =>
    charset.charAt(Math.floor(Math.random() * charset.length))
  );

  // Join the array of random characters to form the password
  const password = randomChars.join("").toUpperCase();

  return password;
};
const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Generates a random number between 100000 and 999999
    return randomNumber.toString()
};
module.exports = { generateRandomPassword, generateRandomNumber };
