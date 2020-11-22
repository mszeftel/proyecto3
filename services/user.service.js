const config = require('../config/config')
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const initModels = require('../models/init-models');


const sequelize = new Sequelize(
	`${config.DB_DIALECT}://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`,
	{
		logging: false
	}
);

const {Users} = initModels(sequelize);

async function findByUsername(username) {
	const user = await Users.findOne({
		where:{
			username: username
		}
	});

	return user;
}

async function validateUserBody(userBody) {
	const { username, email, password, name, lastname, address, phone } = userBody;

	if (!username || username == '' || await findByUsername(username))
		throw new Error('Missing username or invalid');
	else if (!email || email == '')
		throw new Error('Missing email or invalid');
	else if (!password || password == '')
		throw new Error('Missing passord or invalid');
	else if (!name || name == '')
		throw new Error('Missing name or invalid');
	else if (!lastname || lastname == '')
		throw new Error('Missing last name or invalid');
	else if (!address || address == '')
		throw new Error('Missing address or invalid');
	else if (!phone || phone == '')
		throw new Error('Missing phone or invalid');

	return true;

}

async function signIn(username, password) {
	//Check credentials
	const user = await Users.findOne({
		where:{
			username: username,
			password: password
		}
	});

	if (user) {
		const token = jwt.sign({
			id: user.id,
			username: user.username,
			email: user.email
		}, config.JWT_KEY, {
			algorithm: "HS512",
			expiresIn: 12000
		});

		return token;
	}
	else {
		return undefined;
	}
}

async function create(userObj) {

	const { username, email, password, name, lastname, address, phone } = userObj;

	try {
		await validateUserBody(userObj);

		const user = await Users.create({username,email,name,lastname,address,phone,password,admin:false});
		user.password=undefined;

		return user;
	}
	catch (error) {
		throw (error);
	}
}

async function update(id, userObj) {
	const { email, password, name, lastname, address, phone } = userObj;
	
	try {
		const oldUser = await getById(id);

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

		oldUser.save();
	}
	catch (error) {
		throw (error);
	}
}

async function getById(id) {
	const user = await Users.findOne({
		where:{
			id: id
		}
	});

	return user;
}

async function getUserByToken(token) {
	const decodedUser = jwt.verify(token, config.JWT_KEY);
	const user = await getById(decodedUser.id);

	return user;
}

module.exports = {
	getById, getUserByToken, signIn, create, update
}
