var DataTypes = require("sequelize").DataTypes;
var _order_items = require("./order_items");
var _orders = require("./orders");
var _products = require("./products");
var _users = require("./users");

function initModels(sequelize) {
  var OrderItems = _order_items(sequelize, DataTypes);
  var Orders = _orders(sequelize, DataTypes);
  var Products = _products(sequelize, DataTypes);
  var Users = _users(sequelize, DataTypes);

  OrderItems.belongsTo(Orders, { foreignKey: "orderId"});
  Orders.hasMany(OrderItems, { foreignKey: "orderId", as: 'orderItems'});
  OrderItems.belongsTo(Products, { foreignKey: "productId", as: 'product'});

  Orders.belongsTo(Users, { foreignKey: "userId" });
  Users.hasMany(Orders, { foreignKey: "userId" });

  return {
    OrderItems,
    Orders,
    Products,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
