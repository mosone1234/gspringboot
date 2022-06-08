const fs = require('fs')

let jsonClass = require('./struct.json')

jsonClass.map(x => {
	x.dir.map(y => {
		let dir = "./example/" + y
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
		let dir = "./example/" + y
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