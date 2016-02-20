module.exports = function(db) {
	return {
		requireAuthenticaiton: function(req, res, next) {
			var token = req.get('Auth');

			db.user.findByToken(token)
			.then(function(user) {
				req.user = user;
				next();
			}, function() {
				res.status(401).send();
			});
		}
	};
}