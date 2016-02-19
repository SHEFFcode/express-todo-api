var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')
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
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        }
    }

    db.todo.findAll({where: where}).then(function(todos) {
        res.json(todos);
    }, function(e) {
        res.status(500).send();
    });

});

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    db.todo.findById(todoId).then(function(todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send();
    });
});

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    db.todo.create(body)
    .then(function(todo) {
        res.json(todo.toJSON())
    }, function (e){
        res.status(400).json(e);
    });
});

app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if (!matchedTodo) {
        res.status(404).send();
    }
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
});

app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    
    if (!matchedTodo) {
        res.status(404).send();
    }
    
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    } else {
        //Never provided attribute, no issue here, nothing to update.
    }
    
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    } else {
        //Never provided attribute, no issue here, nothing to update.
    }
    
    //since objects are passed by reference, there is no need to make matchedTodo = to _.extend();
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

db.sequelize.sync().then(function() {
    app.listen(port, function() {
     console.log('express listening on port ' + port + '!') 
 });
});