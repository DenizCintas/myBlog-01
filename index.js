// express modulleri
const express = require("express");
const app = express();

const cookieParser= require("cookie-parser")
const session = require("express-session")
const SequelizeStore= require("connect-session-sequelize")(session.Store)
const csurf = require("csurf")

// Node Modules
const path = require("path");


// Routes
const userRouters = require("./router/user");
const adminRouter = require("./router/admin");
const authRouter = require("./router/auth")

// Moduller
const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user")
const Role = require("./models/role")

// Diger moduller
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
//diğer middlewares
const locals = require("./middlewares/locals")
const log = require("./middlewares/log")
const error = require("./middlewares/error-handling");

// Temlate Engine
app.set("view engine", "ejs");

// Midlleware 
// midlleware içerisine dahil etmek için use kullanıyoruz
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
  // aslında random guid kullanmak gerekiyor
  secret: "hello world",
  // sesave özelliği false olursa bir değişiklik yaptımığızda güncelleme olur
  resave:false,
  // saveUninitialized eğer true dersek her uygulama giren kullanıcı için yeni bir session oluşturur ancak gerek yok ne zaman kullanmak istersek o zaman kullcağız
  saveUninitialized: false,
  cookie:{
    // cookienin geçerli oldu süre
      maxAge:1000 * 60 * 24
  },
  store:new SequelizeStore({
    db: sequelize
  })
}));
//Bu kısımda bütün seklemelerde login şekilde görünmemizi sağlıyoruz
app.use(locals)
app.use(csurf())

// Lİnkler
app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/admin", adminRouter);
app.use("/account", authRouter)
app.use(userRouters);
// * ın amacı herhangi bir rootun bizim talebimizi karşılamıyorsa bu talep doğrulsutunda 4*4 sayfasına yönlendir demek
app.use("*", (req, res) => {
  res.status(404).render("error/404");
});
// log middlewaresini çağırdığım yer
app.use(log)
// errorHandling middlewaresini çağırdığım yer
app.use(error)

Blog.belongsTo(User, {
  foreignKey: {
      allowNull: true
  }
});

// bir user birden fazla blogaa sahip olabilir
User.hasMany(Blog)
// çok çok ilişikisi
Blog.belongsToMany(Category, {through:"blogCategories"});
Category.belongsToMany(Blog, {through:"blogCategories"});

Role.belongsToMany(User,{through:"userRoles"})
User.belongsToMany(Role,{through:"userRoles"})

async function cagirma() {
    // sıfırlama
      await sequelize.sync({ force: true });
      await dummyData();
}
cagirma();
app.listen(3000, () => {
  console.log("3000 portunda çalıştı");
});
