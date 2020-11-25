const userService = require('../services/user.service');
const userMiddlewares = require('../middlewares/user.middlewares');
const orderService = require('../services/order.service')

module.exports = (app) => {
  //Login username and password. Return JWT token if success.
  app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;

    const token = await userService.signIn(username, password);

    if (token) {
      res.status(200).json({token});
    }
    else {
      res.status(400).json({ error: 'Bad credentials' });
    }
  })

  app.post('/user', async (req, res) => {
    try {
      const user = await userService.create(req.body);
      if (user){
        user.password=undefined;
        res.status(201).json(user);
      }
      else
        throw new Error('User could not be created');
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/user', async (req, res) => {
    try{
      const token = req.headers.authorization.split(' ')[1];
      const user = await userService.getUserByToken(token);
      
      if(user){
        user.password=undefined;
        res.status(200).json(user);
      }
      else
        throw new Error("User not found");
    }
    catch (error){
      res.status(404).json({error: error.message});
    }
  })

  app.get('/user/:userId', userMiddlewares.hasAccessToUser, async (req, res) => {
    try{
      const user = await userService.getById(req.params.userId);

      if(user){
        user.password=undefined;
        res.status(200).json(user);
      }
      else{
        res.status(404).send('User not found');
      }
    }catch(err){
      console.error(err);
    }
  })

  app.put('/user/:userId', userMiddlewares.hasAccessToUser, async (req, res) => {
    const user = await userService.getById(req.params.userId);
    
    if(user){
      try{
        await userService.update(user.id,req.body);
        res.status(200).send('User updated');
      }
      catch(error){
        res.status(404).send('Could not udpate user. '+error.message);
      }
    }
    else{
      res.status(404).send('User not found');
    }
  })

  app.get('/user/:userId/orders', userMiddlewares.hasAccessToUser, async (req, res) => {
    let limit=parseInt(req.query.limit);
    let offset=parseInt(req.query.offset);

    if(isNaN(limit)) limit=10;
    if(isNaN(offset)) offset=0;

    const orders = await orderService.getUserOrders(req.params.userId,limit,offset);
    
    if(orders){
      res.status(200).json(orders);
    }
    else{
      res.status(404).send('User not found');
    }
  })
}