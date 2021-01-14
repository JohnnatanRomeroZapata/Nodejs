const Sequelize = require("sequelize");

const sequelizeEnvironment = require("../util/database");

const OrderItemModel = sequelizeEnvironment.define("orderItem", {
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

module.exports = OrderItemModel;
