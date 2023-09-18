//link koruması örneğin bir kullanıcı /admin/crate gitmek isterse login sayfasına yönlendirilecek
module.exports = (req,res,next) => {
  // kullanıcı auth olammışsa yaniş giriş yapmamışa
  // kullanıcıyı logine yçnlendir
    if(!req.session.isAuth) {
      return res.redirect("/account/login?returnUrl"+req.originalUrl) // +req.url gitmek istediğimiz adresi linkin sonuna yazdık
    }
    if(!req.session.roles.includes("admin") && !req.session.roles.includes("moderator")){
      req.session.message ={ text:"Yetkili bir kullanıcı ile oturum açınız"}
      return res.redirect("/account/login?returnUrl"+req.originalUrl)
    }
    next()
  } 