const userService = require('../services/user.service.js');

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