var http = require('http'),
	url = require('url'),
	indicators = require('./lib/indicators');

var server = http.createServer(function(req, res) {
	res.writeHead(200, {"Content-Type": "image/png"});
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	indicators.indicate(query, function(chunk){
		res.write(chunk, 'binary');
	}, function(chunk){
		res.end();
	});
});

server.listen(parseInt(process.env.PORT) || 3000);
console.log("server listening on port %d …", server.address().port);
