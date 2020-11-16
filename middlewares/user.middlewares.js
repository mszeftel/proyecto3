const userService = require('../services/user.service.js');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js')

exports.hasAccessToId = async (req,res,next)=> {
	try{
		const token = req.headers.authorization.split(' ')[1];
		const user= userService.getUserByToken(token);
		console.log('User:',user);
		
		if(user.id==req.params.id || user.admin){
			next();
		}
		else
			throw new Error('Error');

	}
	catch(error){
		res.status(403).json({error: 'Forbidden'});
	}
	
}