var express = require('express');
var app = express();
var port = process.env.PORT || 7000;

app.get('/', function(req, res) {
    res.send('Todo API root');
});

app.listen(port, function() {
   console.log('exoress listening on port ' + port + '!') 
});