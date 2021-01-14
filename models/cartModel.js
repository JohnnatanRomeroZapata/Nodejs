const Sequelize = require("sequelize");

const sequelizeEnvironment = require("../util/database");

const CartModel = sequelizeEnvironment.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = CartModel;
