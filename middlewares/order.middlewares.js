const userService = require('../services/user.service.js');
const orderService = require('../services/order.service.js');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

exports.hasAccessToOrder = async (req,res,next) => {
	try{
		const token = req.headers.authorization.split(' ')[1];
		const user= await userService.getUserByToken(token);

		const order = await orderService.getOrderById(req.params.orderId);
		
		if(user.id==order.userId || user.admin){
			next();
		}
		else
			throw new Error('Error');

	}
	catch(error){
		res.status(403).json({error: 'Forbidden'});
	}
}

exports.isAdmin = async (req,res,next) => {
	try{
		const token = req.headers.authorization.split(' ')[1];
		const user= await userService.getUserByToken(token);
		
		if(user.id==req.params.userId || user.admin){
			next();
		}
		else
			throw new Error('Error');

	}
	catch(error){
		res.status(403).json({error: 'Forbidden'});
	}
}