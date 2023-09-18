//link koruması örneğin bir kullanıcı /admin/crate gitmek isterse login sayfasına yönlendirilecek
module.exports = (req,res,next) => {
    if(!req.session.isAuth) {
      return res.redirect("/account/login?returnUrl"+req.originalUrl) // +req.url gitmek istediğimiz adresi limkin sonuna yazdık
    }
    next()
  } 