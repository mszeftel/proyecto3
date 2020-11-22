const userService = require('../services/user.service.js');
const orderService = require('../services/order.service.js');

exports.hasAccessToOrder = async (req,res,next) => {
	try{
		const token = req.headers.authorization.split(' ')[1];
		const user= await userService.getUserByToken(token);

		const order = await orderService.getById(req.params.orderId);
		
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
		
		if(user.admin){
			next();
		}
		else
			throw new Error('Error');

	}
	catch(error){
		res.status(403).json({error: 'Forbidden'});
	}
}