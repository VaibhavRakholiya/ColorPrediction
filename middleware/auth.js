const User = require("../model/user/index");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.render("pages/auth/login");
  }
  try {
    const decodedToken = jwt?.verify(token, process.env.TOKEN);
    if (!decodedToken) {
      res.render("pages/auth/login");
    }
    const userData = await User.findOne({ username: decodedToken.username });
    req.body.username = userData.username;
    next();
  } catch (err) {
    res.render("pages/auth/login");
  }
};

module.exports = { auth };
