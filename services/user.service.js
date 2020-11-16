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

const findByUsername = (username) => {
	_users.find(usr => usr.username == username);
}

const usernameExists = async (username) => {
	return await (findByUsername) ? true : false;
}

exports.signIn = async (username, password) => {
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


exports.create = async (userObj) => {

	const { username, email, password, name, lastName, address, phone } = userObj;

	console.log(userObj);

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

	return {id: _lastId,
		username,
		email,
		name,
		lastName,
		phone,
		address,
		admin: false
	}
}

const getUserById = (id) => {
	console.log('getusrbyid')
	return _users.find(usr => usr.id == id);
}

exports.getUserByToken = (token) => {
	const decodedUser = jwt.verify(token, config.JWT_KEY);
	console.log('decoded', decodedUser);
	const user = getUserById(decodedUser.id);
	console.log('usr', user);
	return user;
}

exports.getUserById = getUserById