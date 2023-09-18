module.exports = (req, res, next) => {
      // bu csrfi sadece formlara koymak istiyorum bü yüzden rootlardaki form işlemi bulanan kısımlara koyacağım
      res.locals.csrfToken = req.csrfToken();
    next();
}
