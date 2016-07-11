
var http = require('http');

// var str='';
// http.get("http://www.baidu.com", function(res){
// 	res.on('data', function(data){
// 		str += data;
// 	});
// 	res.resume();
// });


var str='';

function readRemoteFile(url){
	http.get(url, function(res){
		res.on('data', function(data){
			str += data;
		});
		res.resume();
	});
} 
readRemoteFile("http://www.baidu.com");




http.createServer( function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
	response.write("hello " + str + " end");
	response.end();
}).listen(8124);


console.log('Server running at http://127.0.0.1:8124/');










