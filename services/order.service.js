const config = require('../config/config.js')
const jwt = require('jsonwebtoken');

const _users = [
	{
		id: 1,
		username: 'admin',
		password: 'admin1234',
		email: 'mszeftel@gmail.com',
		admin: true
	},
	{
		id: 2,
		username: 'mati',
		password: 'mati1234',
		email: 'mszeftel@gmail.com',
		admin: false
	}
]
let _lastId = 2;

function findByUsername(username) {
	const user = _users.find(usr => usr.username == username);
	if (user) user.password = undefined;
	return user;
}

function usernameExists(username) {
	return (findByUsername(username)) ? true : false;
}

function validateUserObj(userObj) {
	const { username, email, password, name, lastName, address, phone } = userObj;

	if (!username || username == '' || findByUsername(username))
		throw new Error('Missing username or invalid');
	else if (!email || email == '')
		throw new Error('Missing email or invalid');
	else if (!password || password == '')
		throw new Error('Missing passord or invalid');
	else if (!name || name == '')
		throw new Error('Missing name or invalid');
	else if (!lastName || lastName == '')
		throw new Error('Missing last name or invalid');
	else if (!address || address == '')
		throw new Error('Missing address or invalid');
	else if (!phone || phone == '')
		throw new Error('Missing phone or invalid');

	return true;

}

async function signIn(username, password) {
	//Check credentials
	const user = _users.find(usr => usr.username == username && usr.password == password);

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

	const { username, email, password, name, lastName, address, phone } = userObj;

	try {
		validateUserObj(userObj);

		_users.push({
			id: ++_lastId,
			username,
			email,
			password,
			name,
			lastName,
			phone,
			address,
			admin: false
		})

		return {
			id: _lastId,
			username,
			email,
			name,
			lastName,
			phone,
			address,
			admin: false
		}

	}
	catch (error) {
		throw (error);
	}
}

async function update(id,userObj) {

	const {email, password, name, lastName, address, phone } = userObj;
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

function getUserById(id) {
	const user = _users.find(usr => usr.id == id);
	if (user) user.password = undefined;
	return user;
}

function getUserByToken(token) {
	const decodedUser = jwt.verify(token, config.JWT_KEY);
	const user = getUserById(decodedUser.id);
	if (user) user.password = undefined;
	return user;
}

module.exports = {
	getUserById, getUserByToken, signIn, create, update
}
