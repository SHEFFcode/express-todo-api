var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite',
});

var Todo = sequelize.define('todo', {
	'description': {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	'completed': {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({force: false}).then(function(){
	console.log('everything is synced');

	Todo.create({
		description: 'Take out trash',
		completed: false
	})
	.then(function(todo) {
		return Todo.create({
			description: 'Clean Office'
		});
	})
	.then(function() {
		// return Todo.findById(1);
		return Todo.findAll({
			where: {
				// completed: false
				description: {
					$like: '%trash%'
				}
			}
		});
	})
	.then(function(todos) {
		if (todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			});
		} else {
			console.log('No todos found for that parameter');
		}
	})
	.catch(function(e) {
		console.log(e);
	});
});