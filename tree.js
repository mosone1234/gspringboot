const fs = require('fs')

let jsonDir = require('./dir.json');
let jsonSubDir = require('./subdir.json');
let jsonStruct = require('./struct.json');

console.log(jsonDir, ' <===============  the json obj');
console.log(jsonSubDir, 'the json obj');
console.log(jsonStruct, 'the json obj');

let dirHome = './example';
if (fs.existsSync(dirHome)){
	fs.rmdirSync(dirHome, { recursive: true});
}
if (!fs.existsSync(dirHome)){
	fs.mkdirSync(dirHome);
}
jsonDir.map(x => {
	let dir = './example/' + x;
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
		jsonSubDir.map(y => {
			if (fs.existsSync(dir) && y.name.dir === x) {
				let subdir = dir + "/" + y.name.name
				fs.mkdirSync(subdir);
			}	
		})
	}
})
