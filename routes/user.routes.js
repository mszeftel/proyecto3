const userService = require('../services/user.service.js');
const userMiddlewares = require('../middlewares/user.middlewares.js');

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
      if (user)
        res.status(201).json(user);
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
      const user= userService.getUserByToken(token);
      if(user)
        res.status(200).json(user);
      else
        throw new Error("User not found");
    }
    catch (error){
      res.status(404).json({error: error.message});
    }
  })

  app.get('/user/:userId', userMiddlewares.hasAccessToUser, async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    
    if(user){
      res.status(200).json(user);
    }
    else{
      console.error('User not found').
      res.status(404);
    }
  })

  app.put('/user/:userId', userMiddlewares.hasAccessToUser, async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    
    if(user){
      try{
        await userService.update(user.id,req.body);
        res.send(200).send('User updated');
      }
      catch(error){
        res.send(404).send('Could not udpate user. '+error.message);
      }
    }
    else{
      console.error('No user found').
      res.send(404);
    }
  })

  app.get('/user/:userId/orders', userMiddlewares.hasAccessToUser, async (req, res) => {
    const orders = await userService.getUserOrders(req.params.userId);
    
    if(orders){
      res.status(200).json(onvrdisplaypointerunrestricted);
    }
    else{
      console.error('User not found').
      res.status(404);
    }
  })
}