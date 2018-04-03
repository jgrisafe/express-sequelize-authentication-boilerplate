const { User, AuthToken } = require('../models');

module.exports = async function(req, res, next) {
  const authorization = req.cookies.auth_token || req.headers.authorization;
  if (authorization) {
    const authToken = await AuthToken.find({ where: { token: authorization }, include: User });
    req.user = authToken.User;
  }
  next();
}