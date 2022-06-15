const fs = require('fs')
const parser = require('xml2json');

// let jsonClass = require('./struct.json')
// let jsonClass = __dirname + '/struct.json'
// let jsonClass = fs.readFileSync(__dirname + '/struct.json', 'utf8')
const one1 = () => fs.readFileSync('./struct.json', { endoding: 'utf8'})
let jsonClass = JSON.parse(one1())


let globalDir = ""
let dirOne = ""
let dirTwo = ""
const data = () => fs.readFileSync('./pom.xml', { endoding: 'utf8'})
var json = JSON.parse(parser.toJson(data()))
globalDir = globalDir + json.project.groupId.replace(".", "/").replace(".", "/").replace(".", "/")
globalDir = "./src/main/java/" +globalDir + '/' + json.project.artifactId
dirOne = json.project.groupId.replace(".", "/").replace(".", "/").replace(".", "/")
dirTwo = json.project.artifactId

jsonClass.map(x => {
	x.dir.map(y => {
		// let dir = "./example/" + y
		let dir = globalDir + "/" + y
		if (fs.existsSync(dir)) {
			let lastName = y === 'domain' ? '' : y
			let className = dir + "/" + x.entity + (lastName === 'dto' ? 'DTO' : camelCase(lastName))
			fs.writeFile(className + ".java", "", function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			}); 
		}
	})
	x.subdir.map(y => {
		// let dir = "./example/" + y
		let dir = globalDir + "/" + y
		console.log(dir)
		if (fs.existsSync(dir)) {
			let lastName = y === 'web/rest' ? "Resource" : y === "service/mapper" ? "Mapper" : "";
			let className = dir + "/" + x.entity + camelCase(lastName)
			fs.writeFile(className + ".java", "", function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			}); 
		}
	})
})

function camelCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}