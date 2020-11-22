const productService = require('../services/product.service.js');
const productMiddlewares = require('../middlewares/product.middlewares.js');

module.exports = (app) => {
  //Create prodcut
  app.post('/product', productMiddlewares.isAdmin, async (req, res) => {
    try {
      const product = await productService.create(req.body);
      if (product){
        res.status(201).json(product);
      }
      else
        throw new Error('Product could not be created');
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  })

  //Read all products
  app.get('/product', async (req, res) => {
  
    let limit=parseInt(req.query.limit);
    let offset=parseInt(req.query.offset);

    if(isNaN(limit)) limit=50;
    if(isNaN(offset)) offset=0; 

    try {
      const products = await productService.getAll(limit,offset);
      if (products){
        res.status(201).json(products);
      }
      else
        throw new Error('Products not found');
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  })

  //Read product
  app.get('/product/:productId', async (req, res) => {
    try{
      const product = await productService.getById(req.params.productId);

      if(product){
        res.status(200).json(product);
      }
      else{
        res.status(404).send('Product not found');
      }
    }catch(err){
      res.status(404).json({error: err.message});
    }
  })

  app.put('/product/:productId', productMiddlewares.isAdmin, async (req, res) => {
    const product = await productService.getById(req.params.productId);
    
    if(product){
      try{
        await productService.update(product.id,req.body);
        res.status(200).send('Product updated');
      }
      catch(error){
        res.status(404).send('Could not update product. '+error.message);
      }
    }
    else{
      console.error('No product found').
      res.send(404);
    }
  })

  app.delete('/product/:productId', productMiddlewares.isAdmin, async (req, res) => {
    const product = await productService.getById(req.params.productId);
    
    if(product){
      try{
        await productService.destroy(product.id);
        res.status(200).send('Product deleted');
      }
      catch(error){
        res.status(404).send('Could not delete product. '+error.message);
      }
    }
    else{
      console.error('No product found').
      res.send(404);
    }
  })
}