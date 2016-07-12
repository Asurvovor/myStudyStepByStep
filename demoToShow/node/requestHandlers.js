// var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require('formidable');
var util = require('util');

function start(response) {
	console.log("Request handler 'start' was called.");
	// var content = "empty";

	var body = '<html>' + 
	    '<head>' + 
	    '<mata http-equiv="Content-Type" content="text/html;charset=UTF-8" />' + 
	    '</head>' + 
	    '<body>' + 
	    '<form action="/upload" method="post" enctype="multipart/form-data">' + 
	    '<input type="file" name="upload" />' + 
	    '<br />' +  
	    '<input type="submit" value="Upload file" />' + 
	    '</form>' + 
	    '</body>' +
	    '</html>';

    response.writeHead(200, {"Content-Type":"text/html;charset=UTF-8"});
    response.write(body);
    response.end();



	// exec("find /", 
	// 	{ timeout: 10000, maxBuffer: 20000 * 1024 },
	// 	function(error, stdout, stderr) {
	// 	response.writeHead(200, {"Content-Type":"text/plain;charset=UTF-8"});
	// 	// content = stdout;
	// 	response.write(stdout);
	// 	response.end();
	// });

	// return content;
	
	// function sleep(milliSeconds) {
	// 	var startTime = new Date().getTime();
	// 	while (new Date().getTime() < startTime + milliSeconds);
	// }

	// sleep(10000);

	// return "Hello Start";
}

function upload(response, request) {
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
	console.log("about to parse");

	form.parse(request, function(err, fields, files) {
		console.log("parsing done");
		// fs.renameSync(files.upload.path, "/temp/test.png");
		var readStream = fs.createReadStream(files.upload.path);
		var writeStream = fs.createWriteStream("/temp/test.png");
		util.pump(readStream, writeStream, function() {
			fs.unlinkSync(files.upload.path);
		});

		response.writeHead(200, {'Content-type': 'text/html;charset=UTF-8'});
		response.write('received image:<br />');
		response.write("<img src='/show' />");
		response.end();
	});

	// response.writeHead(200, {"Content-Type":"text/plain;charset=UTF-8"});
	// response.write("You've sent the text: " + querystring.parse(request).text);
	// response.end();
}

function show(response) {
	console.log("Request handler 'show' was called.");
	fs.readFile("/temp/test.png", "binary", function(error, file){
		if (error) {
			response.writeHead(500, {"Content-Type": "text/plain;charset=UTF-8"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;