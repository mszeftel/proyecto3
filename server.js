const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const expressJwt = require('express-jwt');
const config = require('./config/config');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressJwt({ secret: config.JWT_KEY, algorithms: ['HS512'] })
	.unless({
		path: [{ url: '/health', methods: ['GET'] },
		{ url: '/user/login', methods: ['POST'] },
		{ url: '/user', methods: ['POST'] }]
	})
);

app.get('/health', (req, res) => {
	res.json({ messsage: "Delilah API" })
});

userRoutes(app);
orderRoutes(app);
productRoutes(app);

const sequelize = new Sequelize(
	`${config.DB_DIALECT}://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`
);

sequelize.authenticate()
	.then(() => {
		console.log('Connection to database successful.');
	})
	.catch(error => {
		console.error('Unable to connect to the database:', error);
		process.exit(1);
	})

app.listen(config.PORT, () => {
	console.log(`Server listening on PORT ${config.PORT}`)
});



