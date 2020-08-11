const jwt = require('jsonwebtoken'),
    dotenv = require('dotenv')


dotenv.config()       


module.exports = function (req, res, next) {
  const token = req.cookies.token
  if (!token) return res.sendFile(__dirname + '/forbidden/index.html')
  try {
    const verifly = jwt.verify(token, process.env.TOKEN);
    req.user = verifly;
    next();
  } catch (err) {
    res.sendFile(__dirname + '/Unauthorized/index.html')
  }
}