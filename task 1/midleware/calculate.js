module.exports = (req, res, next) => {
  res.locals.results = req.session.results;
  next();
};
