const Sequelize = require("sequelize");

const sequelizeEnvironment = require("../util/database");

//define(model name , model attributes)
const UserModel = sequelizeEnvironment.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = UserModel;
