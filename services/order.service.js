const config = require('../config/config')
const Sequelize = require('sequelize');
const initModels = require('../models/init-models');

const sequelize = new Sequelize(
	`${config.DB_DIALECT}://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`,
	{
		logging: false
	}
);

const { OrderItems, Orders, Products} = initModels(sequelize);

async function invalidOrderLine(orderLine) {
	const product = await Products.findOne({ where: { id: orderLine.productId } });
	const dontExist = product ? false : true;
	const quantity = parseInt(orderLine.quantity);

	return dontExist || isNaN(quantity) || quantity < 1;
}

async function validateOrderBody(orderBody) {
	const { orderLines, payment, deliveryAddress } = orderBody;
	try {

		if (!payment || !paymentValues().includes(payment))
			throw new Error('Missing payment or invalid');
		else if (!deliveryAddress || deliveryAddress == '')
			throw new Error('Missing deliveryAddress or invalid');
		else if (!orderLines || orderLines.length == 0 || orderLines.some(line => {
			invalidOrderLine(line)
				.then(r => {
					return r;
				})
		}))
			throw new Error('Missing or invalid orderLines');

		return true;
	}
	catch (error) {
		throw error;
	}

}

async function orderFromBody(orderBody) {
	//main order data
	try {
		const orderObject = {
			deliveryAddress: orderBody.deliveryAddress,
			payment: orderBody.payment
		};
		orderObject.orderItems = [];

		await Promise.all(orderBody.orderLines.map(line => Products.findOne({ raw: true, where: { id: line.productId } })))
			.then(products => {
				products.forEach((product, i) => {
					product.quantity = orderBody.orderLines[i].quantity;
					orderObject.orderItems.push(product);
				})
			})

		return orderObject;

	} catch (error) {
		throw error;
	}

}

async function create(userId, orderBody) {
	try {
		await validateOrderBody(orderBody);
		const orderObj = await orderFromBody(orderBody);

		orderObj.userId = userId;
		orderObj.createdAt = Date.now();
		orderObj.status = 'new';

		const newOrder = await Orders.create({
			userId: orderObj.userId,
			payment: orderObj.payment,
			status: orderObj.status,
			deliveryAddress: orderObj.deliveryAddress,
			createdAt: orderObj.createdAt,
			confirmedAt: null
		});

		const createdOrder = await newOrder.save();
		const orderId = createdOrder.id;

		for (let i = 0; i < orderObj.orderItems.length; ++i) {
			line = orderObj.orderItems[i];
			line.productId=line.id;
			line.id=undefined;

			line.orderId = orderId;

			const newItem = await OrderItems.create(line);
			await newItem.save();
		}

		return await getById(orderId);
	}
	catch (error) {
		throw (error);
	}
}

async function update(id, userObj) {

	const { email, password, name, lastname, address, phone } = userObj;
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
		if (lastname && lastname != '')
			oldUser.lastname = lastname;
		if (address && address != '')
			oldUser.address = address;
		if (phone && phone != '')
			oldUser.phone = phone;

	}
	catch (error) {
		throw (error);
	}
}

async function getById(orderId) {

	const order = await Orders.findOne({
		where: {
			id: orderId
		},
		include: {
			model: OrderItems,
			as: 'orderItems',
		},
	});

	if(order)
		order.dataValues.amount=amountOrder(order);
	

	return order;

}

async function deleteById(orderId) {
	const tran = await sequelize.transaction();
	try{
		const order = await Orders.findOne({
			where: {
				id: orderId
			},
			include: {
				model: OrderItems,
				as: 'orderItems',
			},
		});
		//Destroy all items in the order
		await Promise.all(	order.orderItems.map ( item => item.destroy() )) ;
		//And then destroy the order
		await order.destroy();
		//And then commit
		await tran.commit();
		return true;
	}
	catch(err){
		await tran.rollback();

		console.error(err);
		throw(err);
	}

}

function amountOrder(order){
	const amount=order.dataValues.orderItems.reduce((acc,item)=>{
		return acc+item.quantity*item.price
	},
	0);

	return amount;
}

async function getAll(_offset,_limit){
	const limit=(_limit>100)?100:_limit;
	const offset=(_offset<0)?0:_offset;

	const {count,rows} = await Orders.findAndCountAll({
		order: [['created_at','DESC']],
		include: {
			model: OrderItems,
			as: 'orderItems',
		},
		
		limit: limit,
		offset: offset
	});

	return rows;
}


async function getUserOrders(userId,limit,offset){
	try{
		const {count,rows} = await Orders.findAndCountAll({
			include: {
				model: OrderItems,
				as: 'orderItems',
			},
			where:{
				userId: userId
			},
			order: [['created_at','DESC']],
			limit: limit,
			offset: offset
		})

		//clean ids.
		rows.forEach( order => {
			order.orderItems.forEach(item => {
				item.orderId=item.productId=undefined;
			})	
		});

		return rows;
	}catch(err){
		console.error(err);
		throw(err);
	}
}

function statusValues(){
	return Orders.rawAttributes.status.values;
}

function paymentValues(){
	return Orders.rawAttributes.payment.values;
}

module.exports = {
	create, update, getById, getAll, getUserOrders, deleteById, statusValues, paymentValues,
}