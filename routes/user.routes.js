const userService = require('../services/user.service.js')

module.exports = (app) => {
  //Login username and password. Return JWT token if success.
  app.post('/user/login', (req, res) => {
      const {username,password} = req.body;

      const token = userService.getToken(username,password);

      if(token){
        res.status(200).json(token);
        
      }
      else{
        res.status(400).json({ error: 'Bad credentials' });
      }
  })

  app.


    // ruta de creacion de todos
    app.post('/todosPromesa', (req, res) => {

        todosService.create(req.body).then(newTodo => {
            res.status(201).json(newTodo);
        }).catch(error => {
            res.status(500).json({ error: error.message });
        })
    })


    app.get('/todos', (req, res) => {

        todosService.listAll().then(todos => {
            res.status(200).json(todos)
        }).catch(err => {
            res.status(500).json({ error: err.message })
        })
    })

    app.get('/todos/:todoId', async (req, res) => {
        const id  = req.params.todoId
        try {
            const todo = await todosService.findById(id);
            res.status(200).json(todo);
        } catch (error) {
            if(error.kind == 'ObjectId') {
                res.status(404).json({ error: "no existe ese id" });
            }
            else {
                res.status(500).json({ error: "intente en un rato" });
            }
        }
    })
}