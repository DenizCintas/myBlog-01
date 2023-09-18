const config = require("../config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    dialect: "mysql",
    host: config.db.host,
    define :{
      timestamps : false
    },
    storage: "./session.mysql"
  });
async function connect() {
  try {
    await sequelize.authenticate();
    console.log("mysql bağlantısı yapıldı");
  } catch (err) {
    console.log("bağlantı hatası ", err);
  }
}

connect();
module.exports = sequelize;
// let connection = mySql.createConnection(config.db);
// connection.connect(function (err) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log("server bağlansıtsı yapıldı");
// });

// module.exports = connection.promise()
