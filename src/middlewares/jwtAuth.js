const res = require('express/lib/response');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "401 Invalid Access Token"
    })
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "401 Invalid Access Token"
      })
    }

    req.user = user;
    next();
  })
}

module.exports = authenticate;