var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		// var postData = "";
		var pathname = url.parse(request.url).pathname;	
		console.log("Request for " + pathname + " received.");

		// route(handle, pathname, response);

		// response.writeHead(200, {"Content-Type": "text/plain;charset=UTF-8"});
		// var content = route(handle, pathname);
		// response.write(content);
		//response.write("hello, world!长风破浪会有时，直挂云帆济沧海！");

		// response.end();

		// request.setEncoding("utf8");

		// request.addListener("data", function(postDataChunk) {
		// 	postData += postDataChunk;
		// 	console.log("Received POST data chunk '" + postDataChunk +"'.");
		// });

		// request.addListener("end", function() {
			route(handle, pathname, response, request);
		// });
	}


	http.createServer(onRequest).listen(8888);
	console.log("Server has started.")
}

exports.start = start;

