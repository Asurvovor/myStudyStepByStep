var http = require("http");
var url = require("url");

function start(route) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;	
		console.log("Request for " + pathname + " received.");

		route(pathname);

		response.writeHead(200, {"Content-Type": "text/plain;charset=UTF-8"});
		response.write("hello, world!长风破浪会有时，直挂云帆济沧海！");
		response.end();
	}


	http.createServer(onRequest).listen(8888);
	console.log("Server has started.")
}

exports.start = start;

