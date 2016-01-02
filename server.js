var express = require('express');
var app = express();
var port = process.env.PORT || 7000;
var todos = [{
    id: 0,
    description: 'Learn node',
    completed: false
}, {
    id: 1,
    description: 'Learn Mongo DB',
    completed: false
}, {
    id: 2,
    description: 'Learn Postman',
    completed: true
}];

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
//    res.json(todos);
});

app.listen(port, function() {
   console.log('exoress listening on port ' + port + '!') 
});