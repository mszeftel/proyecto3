
const jwtKey= 

exports.signIn = async (username, password){

	//Check credentials
	const user = true;
	let token = '';
	if (user) {
			token = jwt.sign({
			id: user.id,
			username: user.username,
			email: user.email
		}, jwtKey, {
			algorithm: "HS512",
			expiresIn: 1200
		});
	}