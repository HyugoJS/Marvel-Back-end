const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  next();
};

module.exports = isAuthenticated;
