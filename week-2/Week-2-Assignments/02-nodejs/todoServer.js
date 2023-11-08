/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000

const app = express();

app.use(bodyParser.json());

// list of all todos
const todos = []


// callback funcs
function retrieveAll(req, res){
  const response = todos
  res.status(200).json(response)
}


function getById(req, res){
  var todo = todos.find(t => t.id === parseInt(req.params.id))
  const response = {status:404, todo:null}
  if(todo){
    response.status = 200
    response.todo = todo
  }

  res.status(response.status).json(response.todo)
}


function createNew(req, res){
  var todo = {
    id: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    desc: req.body.description,
    completed: req.body.completed
  }
  todos.push(todo)
  res.status(201).json({id:todo.id})
}


function updateById(req, res){
  var todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id))
  if(todoIndex === -1){
    res.status(404).json({error: "id: ${req.body.id} not present"})
  }else{
    todos[todoIndex].completed = req.body.completed
    res.status(200).json("Successful")
  }
}


function deleteById(req, res){
  var todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).json({error: "id: ${req.body.id} not present"})
  } else {
    todos.splice(todoIndex, 1);
    res.status(200).json("Modified");
  }
}


// API endpoints
app.get('/todos', retrieveAll)
app.get('/todos/:id', getById)
app.post('/todos', createNew)
app.put('/todos/:id', updateById)
app.delete('/todos/:id', deleteById)

// exception route handling & listen
app.use((req, res) => {
  res.status(404).json({error:'Not Found'})
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

module.exports = app;
