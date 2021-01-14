const Sequelize = require("sequelize");

const sequelizeEnvironment = require("../util/database");

const CartItemModel = sequelizeEnvironment.define("cartItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
  },
});

module.exports = CartItemModel;
