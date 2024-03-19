const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    console.log(user)
    console.log(err)

    if (err) return res.sendStatus(403)

    const existUser = await User.findOne({username: user.username});

    if (!existUser)
      return res.sendStatus(404);

    req.user = existUser;

    next()
  })
}

module.exports = authenticateToken;