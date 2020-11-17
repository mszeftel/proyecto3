const orderService = require('../services/order.service.js');
const orderMiddlewares = require('../middlewares/order.middlewares.js');

module.exports = (app) => {
  //Login ordername and password. Return JWT token if success.
  app.post('/order', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const user= orderService.getorderByToken(token);
    
    try{
      const order = orderService.createOrder(user.id,req.body);

      if(order)
        req.status(201).json(order);
      else
        throw new Error('Order could not be created');
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  })

  app.get('/order/:orderId', orderMiddlewares.hasAccessToOrder, async (req, res) => {
    try{
      const order= orderService.getOrderById(req.params.orderId);
      if(order)
        res.status(200).json(order);
      else
        throw new Error("Order not found");
    }
    catch (error){
      res.status(404).json({error: error.message});
    }
  })

  app.get('/order/:orderId', orderMiddlewares.hasAccessToId, async (req, res) => {
    const order = await orderService.getorderById(req.params.orderId);
    
    if(order){
      res.status(200).json(order);
    }
    else{
      console.error('order not found').
      res.status(404);
    }
  })

  app.put('/order/:orderId', orderMiddlewares.hasAccessToId, async (req, res) => {
    const order = await orderService.getorderById(req.params.orderId);
    
    if(order){
      try{
        await orderService.update(order.id,req.body);
        res.send(200).send('order updated');
      }
      catch(error){
        res.send(404).send('Could not udpate order. '+error.message);
      }
    }
    else{
      console.error('No order found').
      res.send(404);
    }
  })

  app.get('/order/:orderId/orders', orderMiddlewares.hasAccessToId, async (req, res) => {
    const orders = await orderService.getorderOrders(req.params.orderId);
    
    if(orders){
      res.status(200).json(onvrdisplaypointerunrestricted);
    }
    else{
      console.error('order not found').
      res.status(404);
    }
  })
}