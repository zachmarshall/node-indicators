var http = require('http'),
    raphael = require('node-raphael'),
	url = require('url');

var server = http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "image/svg+xml"});
	
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
  	var percent = query["percent"] ? parseFloat(query["percent"]) / 100.0 : 0.0;
  	var outerStroke = 3;
  	var innerStroke = 2;
  	var radius = 50.0;

	var glow = 8;
  	var buffer = glow;
  	var cx = buffer + radius;
  	var cy = cx;
  	var radians = 3.0 * Math.PI / 2.0 + 2 * Math.PI * percent;
  	var arcX = cx + radius * Math.cos(radians);
  	var arcY = cy + radius * Math.sin(radians);
	var canvasWidth = 2 * radius + 2 * buffer;
	var canvasHeight = 2 * radius + 2 * buffer;
	
	
    var svg = raphael.generate(canvasWidth, canvasHeight, function (r) {
	    var whiteShadow = r.circle(cx-1, cy+2, radius).attr({stroke: "rgba(255, 255, 255, 0.6)", "stroke-width": 1});
		var circle = r.circle(cx, cy, radius).attr({stroke: "hsba(0,0,0,65)", "stroke-width": outerStroke});
		var meter = {};
		if (Math.abs(arcY - cy + radius) < 0.001 && Math.abs(arcX - cx) < 0.001) {
			meter = r.circle(cx, cy, radius).attr({stroke: "rgb(255,255,255)", "stroke-width": innerStroke});
		}
		else {
			var pathStr = "M" + cx + "," + (cy - radius) + "A" + radius + "," + radius + ",0," + (percent > .5 ? '1' : '0') + ",1," + arcX + "," + arcY;
		    meter = r.path(pathStr).attr({stroke: "#fff", "stroke-width": innerStroke, "stroke-linecap": "round"});
		}
		meter.glow({color:"#fff", width: glow});
    });
    res.end(svg);
});

server.listen(parseInt(process.env.PORT) || 3000);
console.log("server listening on port %d …", server.address().port);