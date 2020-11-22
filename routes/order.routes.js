const orderService = require('../services/order.service.js');
const userService = require('../services/user.service.js');
const orderMiddlewares = require('../middlewares/order.middlewares.js');

module.exports = (app) => {
  //Login ordername and password. Return JWT token if success.
  app.post('/order', async (req, res) => {  
    try{
      const token = req.headers.authorization.split(' ')[1];
      const user = await userService.getUserByToken(token);

      const order = await orderService.create(user.id,req.body);

      if(order)
        res.status(201).json(order);
      else
        throw new Error('Order could not be created');
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  })

  app.get('/order/:orderId', orderMiddlewares.hasAccessToOrder, async (req, res) => {
    try{
      const order = await orderService.getOrderById(req.params.orderId);
      if(order)
        res.status(200).json(order);
      else
        throw new Error("Order not found");
    }
    catch (error){
      res.status(404).json({error: error.message});
    }
  })

  app.get('/order', orderMiddlewares.isAdmin, async (req, res) => { 
    let limit=parseInt(req.query.limit);
    let offset=parseInt(req.query.offset);

    if(isNaN(limit)) limit=50;
    if(isNaN(offset)) offset=0; 

    const orders = await orderService.getAllOrders(offset,limit);
    
    if(orders){
      res.status(200).json(orders);
    }
    else{
      res.status(404).send('Orders not found');
    }
  })
}