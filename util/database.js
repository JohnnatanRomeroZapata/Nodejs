const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodejsdb", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
