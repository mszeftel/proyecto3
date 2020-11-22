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

const { Products } = initModels(sequelize);

async function validateProductBody(productBody) {
	const { name, imageUrl, price } = productBody;
	const priceFloat = (price) ? parseFloat(price) : 0;

	if (!name || name == '')
		throw new Error('Name invalid or missing');
	else if (isNaN(priceFloat) || priceFloat < 0)
		throw new Error('Price invalid or missing');

	return true;
}

async function create(productBody) {
	const { name, imageUrl, price } = productBody;
	try {
		await validateProductBody(productBody);

		const product = await Products.create({ name, imageUrl, price });

		return product;
	}
	catch (error) {
		throw (error);
	}
}

async function update(id, productBody) {
	const { name, imageUrl, price } = productBody;
	try {
		await validateProductBody(productBody);

		const oldProduct = await getById(id);

		if (!oldProduct)
			throw new Error('Product not found');
		oldProduct.name = name;
		oldProduct.price = price;
		if (imageUrl)
			oldProduct.imageUrl = imageUrl;
		
		return await oldProduct.save();
	}
	catch (error) {
		throw (error);
	}
}

async function destroy(id) {
	await Products.destroy({
		where: {id: id}
	})
}

async function getById(id) {
	const product = await Products.findOne({
		where: {
			id: id
		}
	});

	return product;
}

async function getAll(_limit,_offset) {
	const limit=(_limit>100)?100:_limit;
	const offset=(_offset<0)?0:_offset;

	const {count,rows} = await Products.findAndCountAll({
		order: [['name','ASC']],	
		limit: limit,
		offset: offset
	});

	return rows;
}

module.exports = {
	getAll, getById, create, update, destroy
}
