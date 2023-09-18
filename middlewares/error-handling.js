module.exports = (err, req, res, next) => {
  res.status(500).render("error/500");
}