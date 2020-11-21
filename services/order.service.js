const config = require('../config/config.js')
const Sequelize = require('sequelize');
const initModels = require('../models/init-models');
const Moment = require('moment');
const orders = require('../models/orders.js');

const sequelize = new Sequelize(
	`${config.DB_DIALECT}://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`,
	{
		logging: false
	}
);

const { OrderItems, Orders, Products, Users } = initModels(sequelize);

function invalidOrderLine(orderLine) {
	const dontExist = Products.findOne({ where: { id: orderLine.productId } }) ? false : true;
	const quantity = parseInt(orderLine.quantity);
	return dontExist || isNaN(quantity) || quantity < 1;
}

function validateOrderBody(orderBody) {
	const { orderLines, payment, deliveryAddress } = orderBody;

	if (!payment || !['cash', 'card'].includes(payment))
		throw new Error('Missing payment or invalid');
	else if (!deliveryAddress || deliveryAddress == '')
		throw new Error('Missing deliveryAddress or invalid');
	else if (!orderLines || orderLines.length == 0 || orderLines.some(line => invalidOrderLine(line)))
		throw new Error('Missing or invalid orderLine');

	return true;
}

async function orderFromBody(orderBody) {
	//main order data
	try {
		const orderObject = {
			delivaryAddres: orderBody.deliveryAddress,
			payment: orderBody.payment
		};
		orderObject.OrderItems = [];

		orderBody.orderLines.forEach(async line => {
			const product = await Products.findOne({ where: { id: orderLine.productId } });
			product.quantity = line.quantity;
			orderObject.OrderItems.push(product);
		});

	} catch (error) {
		throw error;
	}

}

async function create(userId, orderBody) {

	try {
		validateOrderBody(orderBody);
		const orderObj = orderFromBody(orderBody);
		orderObj.userId = userId;
		orderObj.createdAt = Date.now();
		orderObj.status = 'new';

		const newOrder = Order.create({
			userId: orderObj.userId,
			payment: orderObj.payment,
			status: orderObj.status,
			delivaryAddress: orderObj.deliveryAddress,
			createdAt: orderObj.createdAt
		});

		return newOrder.save();

	}
	catch (error) {
		throw (error);
	}
}

async function update(id, userObj) {

	const { email, password, name, lastName, address, phone } = userObj;
	const oldUser = getUserById(id);

	try {
		if (!oldUser)
			throw new Error('User not found');
		if (email && email != '')
			oldUser.email = email;
		if (password && password != '')
			oldUser.password = password;
		if (name && name != '')
			oldUser.name = name;
		if (lastName && lastName != '')
			oldUser.lastName = lastName;
		if (address && address != '')
			oldUser.address = address;
		if (phone && phone != '')
			oldUser.phone = phone;

	}
	catch (error) {
		throw (error);
	}
}

async function getOrderById(orderId) {

	const order = await Orders.findOne({
		where: {
			id: orderId
		},
		include: {
			model: OrderItems,
			as: 'orderItems',
		},
	});

	return order;

}

module.exports = {
	create, update, getOrderById
}
