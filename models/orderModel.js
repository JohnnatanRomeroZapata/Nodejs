const Sequelize = require("sequelize");

const sequelizeEnvironment = require("../util/database");

const OrderModel = sequelizeEnvironment.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = OrderModel;
