const jwt = require('jsonwebtoken');
const AuthIdenError = require('../errors/auth-iden-err');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AuthIdenError('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(new AuthIdenError('Необходима авторизация'));
  }
};
