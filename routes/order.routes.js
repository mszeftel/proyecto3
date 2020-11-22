const orderService = require('../services/order.service');
const userService = require('../services/user.service');
const orderMiddlewares = require('../middlewares/order.middlewares');

module.exports = (app) => {
  app.get('/order', orderMiddlewares.isAdmin, async (req, res) => { 
    let limit=parseInt(req.query.limit);
    let offset=parseInt(req.query.offset);

    if(isNaN(limit)) limit=25;
    if(isNaN(offset)) offset=0; 

    const orders = await orderService.getAll(offset,limit);
    
    if(orders){
      res.status(200).json(orders);
    }
    else{
      res.status(404).send('Orders not found');
    }
  })
  
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
      const order = await orderService.getById(req.params.orderId);
      if(order)
        res.status(200).json(order);
      else
        throw new Error("Order not found");
    }
    catch (error){
      res.status(404).json({error: error.message});
    }
  })

  app.get('/order/:orderId/status', orderMiddlewares.hasAccessToOrder, async (req, res) => {
    try{
      const order = await orderService.getById(req.params.orderId);
      if(order)
        res.status(200).json({status: order.status});
      else
        throw new Error("Order not found");
    }
    catch (error){
      res.status(404).json({error: error.message});
    }
  })

  app.put('/order/:orderId/status', orderMiddlewares.isAdmin, async (req, res) => {
    try{
      const order = await orderService.getById(req.params.orderId);

      if(!order)
        throw new Error("Order not found");

      if( ['new','confirmed','preparing','delivering','delivered'].includes(req.body.status) ){
        order.status=req.body.status;
        await order.save();
        res.status(200).send('Order status updated');
      }
      else
        throw new Error("Invalid status");
        
    }
    catch (error){
      res.status(404).json({error: error.message});
    }
  })

  
}