var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 7000;
var todos = [];
var todoNextId = 1;

//Parser middleware initialized at the begining of the applicaiton.
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Todo API root');
});

app.get('/todos', function (req, res) {
    res.json(todos);
});

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;
    todos.forEach(function (todo) {
        if (todo.id === todoId) {
            matchedTodo = todo;
        }
    });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function (req, res) {
    var body = req.body;
    console.log('description ' + body.description);
    res.json(body);
    body.id = todoNextId;
    todoNextId++;
    todos.push(body);
    console.log(todos);
});

app.listen(port, function() {
   console.log('exoress listening on port ' + port + '!') 
});