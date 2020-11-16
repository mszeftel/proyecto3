const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('./config/config');
const userRoutes=require('./routes/user.routes')

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

app.get ('/health', (req,res)=> {
	res.json({messsage: "APP WORKING..."})
});

userRoutes(app);

app.listen(config.PORT, ()=> {
	console.log(`servidor escuchando en puerto ${config.PORT}`)
});



