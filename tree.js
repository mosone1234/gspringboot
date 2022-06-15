const fs = require('fs')
const parser = require('xml2json');

let jsonDir = require('./dir.json');
let jsonSubDir = require('./subdir.json');
// let jsonStruct = require('./struct.json');

// console.log(jsonDir, ' <===============  the json obj');
// console.log(jsonSubDir, 'the json obj');
// console.log(jsonStruct, 'the json obj');


let globalDir = ""
let dirOne = ""
let dirTwo = ""
const data = () => fs.readFileSync('./pom.xml', { endoding: 'utf8'})
var json = JSON.parse(parser.toJson(data()))
globalDir = globalDir + json.project.groupId.replace(".", "/").replace(".", "/").replace(".", "/")
globalDir = "./src/main/java/" +globalDir + '/' + json.project.artifactId
dirOne = json.project.groupId.replace(".", "/").replace(".", "/").replace(".", "/")
dirTwo = json.project.artifactId

if (!fs.existsSync("./src")){
	fs.mkdirSync("./src");
}
if (!fs.existsSync("./src/main")) {
	fs.mkdirSync("./src/main");
}
if (!fs.existsSync("./src/main/java")) {
	fs.mkdirSync("./src/main/java");
}
let aux = "./src/main/java"
const myArray = dirOne.split("/");
myArray.map(x => {
	aux = aux + "/" + x
	if (!fs.existsSync(aux)) {
		fs.mkdirSync(aux);
	}
})

console.log(dirOne)
if (!fs.existsSync("./src/main/java/" + dirOne + "/" + dirTwo)) {
	fs.mkdirSync("./src/main/java/" + dirOne + "/" + dirTwo);
}
// let dirHome = './example';
let dirHome = globalDir;
console.log("pasara ------------>>>> ", dirHome)
if (fs.existsSync(dirHome + "/" + "service")) {
	fs.rmdirSync(globalDir + "/" + "service", { recursive: true});
}
if (fs.existsSync(dirHome + "/" + "repository")) {
	fs.rmdirSync(globalDir + "/" + "repository", { recursive: true});
}
if (fs.existsSync(dirHome + "/" + "dto")) {
	fs.rmdirSync(globalDir + "/" + "dto", { recursive: true});
}
if (fs.existsSync(dirHome + "/" + "domain")) {
	fs.rmdirSync(globalDir + "/" + "domain", { recursive: true});
}
if (fs.existsSync(dirHome + "/" + "web")) {
	fs.rmdirSync(globalDir + "/" + "web", { recursive: true});
}
if (!fs.existsSync(globalDir + "/" + "service")){
	fs.mkdirSync(globalDir + "/" + "service");
}
if (!fs.existsSync(globalDir + "/" + "service/mapper")){
	fs.mkdirSync(globalDir + "/" + "service/mapper");
}
if (!fs.existsSync(globalDir + "/" + "repository")){
	fs.mkdirSync(globalDir + "/" + "repository");
}
if (!fs.existsSync(globalDir + "/" + "dto")){
	fs.mkdirSync(globalDir + "/" + "dto");
}
if (!fs.existsSync(globalDir + "/" + "domain")){
	fs.mkdirSync(globalDir + "/" + "domain");
}
if (!fs.existsSync(globalDir + "/" + "web")){
	fs.mkdirSync(globalDir + "/" + "web");
}
if (!fs.existsSync(globalDir + "/" + "web/rest")){
	fs.mkdirSync(globalDir + "/" + "web/rest");
}
jsonDir.map(x => {
	// let dir = './example/' + x;
	let dir = dirHome + "/" + x;
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
