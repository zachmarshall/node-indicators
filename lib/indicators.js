var http = require('http'),
	raphael = require('node-raphael'),
	url = require('url'),
	im = require('imagemagick');

module.exports.indicate = function(args, writeCallback, endCallback){
	var percent = args["percent"] ? parseFloat(args["percent"]) / 100.0 : 0.0;
	var size = args["size"] ? parseFloat(args["size"]) : 58;
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
		if (percent > 0.001) {
			if (percent > .9999) {
				meter = r.circle(cx, cy, radius).attr({stroke: "rgb(255,255,255)", "stroke-width": innerStroke});
			} else {
				var pathStr = "M" + cx + "," + (cy - radius) + "A" + radius + "," + radius + ",0," + (percent > .5 ? '1' : '0') + ",1," + arcX + "," + arcY;
				meter = r.path(pathStr).attr({stroke: "#fff", "stroke-width": innerStroke, "stroke-linecap": "round"});
			}
			meter.glow({color:"#fff", width: glow});
		}
	});
	var conv = im.convert(['-background', 'none',
				'-resize', size,
				'-density', '220', 
				'-units', 'PixelsPerInch', 
				'svg:-', 'png:-']);
	conv.stdout.on('data', writeCallback);
	conv.stdout.on('end', endCallback);
	conv.stdin.write(svg);
	conv.stdin.end();
}
