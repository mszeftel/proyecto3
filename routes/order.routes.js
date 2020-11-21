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

  app.put('/order/:orderId', orderMiddlewares.hasAccessToOrder, async (req, res) => {
    const order = await orderService.getOrderById(req.params.orderId);
    
    if(order){
      try{
        await orderService.update(order.id,req.body);
        res.status(200).send('Order updated');
      }
      catch(error){
        res.status(404).send('Could not udpate order. '+error.message);
      }
    }
    else{
      res.status(404).send('Order not found');
    }
  })

  app.delete('/order/:orderId', orderMiddlewares.hasAccessToOrder, async (req, res) => {
    const order = await orderService.getOrderById(req.params.orderId);
    
    if(order){
      try{
        //Check the order status...before confirmed? before preparing?

        await orderService.update(order.id,req.body);
        res.status(200).send('Order updated');
      }
      catch(error){
        res.status(404).send('Could not udpate order. '+error.message);
      }
    }
    else{
      res.status(404).send('Order not found');
    }
  })

  app.get('/orders', orderMiddlewares.isAdmin, async (req, res) => {
    //Paginate this!!!
    const orders = await orderService.getAllOrders(req.params.orderId);
    
    if(orders){
      res.status(200).json();
    }
    else{
      console.error('order not found').
      res.status(404);
    }
  })
}