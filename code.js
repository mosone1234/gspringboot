const fs = require('fs')
const parser = require('xml2json');

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
dirPackage = (dirOne+"."+dirTwo).replaceAll("/", ".")

function domainClass(data, className) {
  let str = 'package '+ dirPackage +'.domain; \n\n'
    + 'import java.sql.Date; \n'
    + 'import javax.persistence.*; \n'
    + 'import org.hibernate.annotations.Cache; \n'
    + 'import org.hibernate.annotations.CacheConcurrencyStrategy; \n'
    + "import com.fasterxml.jackson.annotation.JsonIgnoreProperties; \n" 
    + 'import lombok.*; \n\n'
    + '@EqualsAndHashCode(callSuper = false) \n'
    + '@Entity \n'
    + '@Getter \n'
    + '@Setter \n'
    + '@NoArgsConstructor \n'
    + '@Table(name="' + className.toLowerCase() + '") \n'
    + '@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE) \n'
    + '@Access(AccessType.FIELD) \n'
    + 'public class '+ className +' { \n'
    + `${data}`
    + '} \n'
    return str
}

function dtoClass(data, className) {
  let str = 'package '+ dirPackage +'.dto; \n\n'
    + "import java.sql.Date;\n"
    + 'import lombok.*; \n\n'
    + '@EqualsAndHashCode(callSuper = false) \n'
    + '@Getter \n'
    + '@Setter \n'
    + 'public class '+ className +'DTO { \n'
    + `${data}`
    + '} \n'
    return str
}

function repositoryClass(className) {
  let str = 'package '+ dirPackage +'.repository;\n\n' +  
            'import org.springframework.data.jpa.repository.JpaRepository;\n' +
            'import '+ dirPackage +'.domain.'+className+';\n\n' +
            'public interface '+ className +'Repository extends JpaRepository<'+className+', String> {\n\n'+
            '}\n'
  return str
}

function serviceClass(className) {
  let domi = (className.toLowerCase() == "package" ? "packageOne" : className.toLowerCase());
  let str = 'package '+ dirPackage +'.service;\n'+
            'import java.util.List;\n'+
            'import java.util.Optional;\n'+
            'import java.util.stream.Collectors;\n'+
            'import org.springframework.stereotype.Service;\n'+
            'import '+ dirPackage +'.domain.'+className+';\n'+
            'import '+ dirPackage +'.dto.'+className+'DTO;\n'+
            'import '+ dirPackage +'.repository.'+className+'Repository;\n'+
            'import '+ dirPackage +'.service.mapper.'+className+'Mapper;\n\n'+
    
            '@Service\n'+
            'public class '+className+'Service {\n\n'+
                '\tprivate final '+className+'Repository '+className.toLowerCase()+'Repository;\n\n'+
                '\tpublic '+className+'Service ('+className+'Repository '+className.toLowerCase()+'Repository) {\n'+
                    '\t\tthis.'+className.toLowerCase()+'Repository = '+className.toLowerCase()+'Repository;\n'+
                '\t}\n\n'+
                '\tpublic '+className+'DTO save('+className+'DTO '+className.toLowerCase()+'DTO) {\n'+
                    '\t\t'+className+' '+ domi +' = '+className+'Mapper.toEntity('+className.toLowerCase()+'DTO);\n'+
                    '\t\t'+className.toLowerCase()+'DTO = '+className+'Mapper.toDTO(this.'+className.toLowerCase()+'Repository.save('+domi+'));\n'+
                    '\t\treturn '+className.toLowerCase()+'DTO;\n'+
                '\t}\n\n'+
                '\tpublic Optional<'+className+'DTO> findOne(String '+className.toLowerCase()+'Id) {\n'+
                    '\t\treturn this.'+className.toLowerCase()+'Repository.findById('+className.toLowerCase()+'Id).map(t -> '+className+'Mapper.toDTO(t));\n'+
                '\t}\n\n'+
                '\tpublic List<'+className+'DTO> findAll() {\n'+
                    '\t\treturn this.'+className.toLowerCase()+'Repository.findAll().stream().map(t -> '+className+'Mapper.toDTO(t)).collect(Collectors.toList());\n'+
                '\t}\n\n'+
                '\tpublic void deleteOne(String '+className.toLowerCase()+'Id) {\n'+
                    '\t\tthis.'+className.toLowerCase()+'Repository.deleteById('+className.toLowerCase()+'Id);\n'+
                '\t}\n'+
            '}'
  return str;
}

function resourceClass(className, id) {
  let str = 'package '+ dirPackage +'.web.rest;\n'+
            'import java.util.List;\n'+
            'import java.util.Optional;\n'+
            'import org.springframework.http.HttpStatus;\n'+
            'import org.springframework.http.ResponseEntity;\n'+
            'import org.springframework.web.bind.annotation.CrossOrigin;\n'+
            'import org.springframework.web.bind.annotation.DeleteMapping;\n'+
            'import org.springframework.web.bind.annotation.GetMapping;\n'+
            'import org.springframework.web.bind.annotation.PathVariable;\n'+
            'import org.springframework.web.bind.annotation.PostMapping;\n'+
            'import org.springframework.web.bind.annotation.PutMapping;\n'+
            'import org.springframework.web.bind.annotation.RequestBody;\n'+
            'import org.springframework.web.bind.annotation.RequestMapping;\n'+
            'import org.springframework.web.bind.annotation.RestController;\n'+
            'import org.springframework.web.server.ResponseStatusException;\n'+
            'import '+ dirPackage +'.dto.'+className+'DTO;\n'+
            'import '+ dirPackage +'.service.'+className+'Service;\n'+
            '@CrossOrigin(origins = "*", maxAge = 3000)\n'+
            '@RestController\n'+
            '@RequestMapping("/api")\n'+
            'public class '+className+'Resource {\n\n'+
                '\tprivate final '+className+'Service '+className.toLowerCase()+'Service;\n\n'+
                '\tpublic '+className+'Resource ('+className+'Service '+className.toLowerCase()+'Service) {\n'+
                    '\t\tthis.'+className.toLowerCase()+'Service = '+className.toLowerCase()+'Service;\n'+
                '\t}\n\n'+
                '\t@PostMapping("/'+className.toLowerCase()+'s")\n'+
                '\tpublic ResponseEntity<'+className+'DTO> create(@RequestBody '+className+'DTO '+className.toLowerCase()+'DTO) {\n'+
                    '\t\tif ('+className.toLowerCase()+'DTO.get'+camelCase(id)+'() == null) {\n'+
                        '\t\tthrow new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID null");\n'+
                    '\t\t}\n'+
                    '\t\t'+className+'DTO '+className.toLowerCase()+'DTO2 = this.'+className.toLowerCase()+'Service.save('+className.toLowerCase()+'DTO);\n'+
                    '\t\treturn ResponseEntity.ok().body('+className.toLowerCase()+'DTO2);\n'+
                '\t}\n\n'+
                '\t@PutMapping("/'+className.toLowerCase()+'s")\n'+
                '\tpublic ResponseEntity<'+className+'DTO> update(@RequestBody '+className+'DTO '+className.toLowerCase()+'DTO) {\n'+
                    '\t\tOptional<'+className+'DTO> existing'+className+' = this.'+className.toLowerCase()+'Service.findOne('+className.toLowerCase()+'DTO.get'+camelCase(id)+'());\n'+
                    '\t\tif (existing'+className+'.isPresent() && (!existing'+className+'.get().get'+camelCase(id)+'().equals('+className.toLowerCase()+'DTO.get'+camelCase(id)+'()))) {\n'+
                        '\t\tthrow new ResponseStatusException(HttpStatus.BAD_REQUEST, "the '+className+' already exists");\n'+
                    '\t\t}\n'+
                    '\t\t'+className+'DTO '+className.toLowerCase()+'DTO2 = this.'+className.toLowerCase()+'Service.save('+className.toLowerCase()+'DTO);\n'+
                    '\t\treturn ResponseEntity.ok().body('+className.toLowerCase()+'DTO2);\n'+
                '\t}\n\n'+
                '\t@GetMapping("/'+className.toLowerCase()+'s/{id}")\n'+
                '\tpublic ResponseEntity<'+className+'DTO> findOne(@PathVariable String id) {\n'+
                    '\t\tOptional<'+className+'DTO> '+className.toLowerCase()+'DTO2 = this.'+className.toLowerCase()+'Service.findOne(id);\n'+
                    '\t\tif (!'+className.toLowerCase()+'DTO2.isPresent()) {\n'+
                        '\t\tthrow new ResponseStatusException(HttpStatus.BAD_REQUEST, "the '+className+' dosent exist");\n'+
                    '\t\t}\n'+
                    '\t\treturn ResponseEntity.ok().body('+className.toLowerCase()+'DTO2.get());\n'+
                '\t}\n\n'+
            
                '\t@GetMapping("/'+className.toLowerCase()+'s")\n'+
                '\tpublic ResponseEntity<List<'+className+'DTO>> findAll() {\n'+
                    '\t\tList<'+className+'DTO> response = this.'+className.toLowerCase()+'Service.findAll();\n'+
                    '\t\treturn ResponseEntity.ok().body(response);\n'+
                '\t}\n\n'+
                '\t@DeleteMapping("/'+className.toLowerCase()+'s/{id}")\n'+
                '\tpublic ResponseEntity<String> deleteOne(@PathVariable String id) {\n'+
                    '\t\tthis.'+className.toLowerCase()+'Service.deleteOne(id);\n'+
                    '\t\treturn ResponseEntity.ok().body("Destroyed");\n'+
                '\t}\n'+
              '}\n'
  return str
}

function mapperClass(className, entity, dto, arr) {
  const array = ["String", "Integer", "Date", "Double", "Long", "int", "double", "Instant"]
  let domi = className.toLowerCase() === "package" ? "packageOne" : className.toLowerCase()
  let domains = ""
  arr.map(x => {
    let typeData= x[0]
    let value = x[2]
    if (!array.includes(typeData)) {
      domains = domains + "import "+dirPackage+".domain."+ camelCase(value).replace("Id","")+";\n\n"
    }
  }) 
  let str = 'package '+ dirPackage +'.service.mapper;\n'+
            'import '+ dirPackage +'.domain.'+className+';\n'+
            'import '+ dirPackage +'.dto.'+className+'DTO;\n'+
            domains +
            'public class '+className+'Mapper {\n' +
                '\tpublic static '+className+' toEntity('+className+'DTO '+className.toLowerCase()+'DTO) {\n' +
                    '\t\t'+className+' '+domi+' = new '+className+'();\n' +
                    '\t\t'+entity+'\n'+
                    '\t\treturn '+domi+';\n' +
                '\t}\n'+
                '\tpublic static '+className+'DTO toDTO('+className+' '+domi+') {\n' +
                    '\t\t'+className+'DTO '+className.toLowerCase()+'DTO = new '+className+'DTO();\n' +
                    '\t\t'+dto+'\n'+
                    '\t\treturn '+className.toLowerCase()+'DTO;\n'+
                '\t}\n'+
            '}\n'; 
  return str
}

function domainData(data, className) {
  const array = ["String", "Integer", "Date", "Double", "Long", "int", "double", "Instant"]
  let str = ''
  data.map(x => {
    let typeData= x[0]
    let id = x[1]
    let value = x[2]
    // if (array.includes(typeData)) {
    //   str = str + '\t@'+ id + '\n' +
    //               (id.toLowerCase() === 'manytoone' || id.toLowerCase() === 'onetoone' ? '\t@JsonIgnoreProperties("'+ className.toLowerCase() +'")\n' : "") +
    //               '\tprivate ' + typeData + ' '+value+ ';\n'
    // } else {
    //   str = str + '\t@'+ id + '\n' +
    //               (id.toLowerCase() === 'manytoone' || id.toLowerCase() === 'onetoone' ? '\t@JsonIgnoreProperties("'+ className.toLowerCase() +'")\n' : "") +
    //               '\tprivate ' + typeData + ' '+value.replace("Id", "")+ ';\n'
    // }
    if (array.includes(typeData)) {
      str = str + '\t@'+ id + '\n' +
                  (id.toLowerCase() === 'manytoone' || id.toLowerCase() === 'onetoone' ? '\t@JoinColumn(name="'+ value.replace("Id", "_id").toLowerCase() +'", referencedColumnName = "'+value+'")\n' : "") +
                  '\tprivate ' + typeData + ' '+value+ ';\n'
    } else {
      str = str + '\t@'+ id + '\n' +
                  (id.toLowerCase() === 'manytoone' || id.toLowerCase() === 'onetoone' ? '\t@JoinColumn(name="'+ value.replace("Id", "_id").toLowerCase() +'", referencedColumnName = "'+value+'")\n' : "") +
                  '\tprivate ' + typeData + ' '+value.replace("Id", "")+ ';\n'
    }
    return str
  })
  console.log(str)
  return str
}

function dtoData(data, className) {
  const array = ["String", "Integer", "Date", "Double", "Long", "int", "double", "Instant"]
  let str = ''
  data.map(x => {
    let typeData= x[0]
    let value = x[2]
    if (array.includes(typeData)) {
      str = str + '\tprivate' + ` ${typeData }` + ` ${value}` + ';\n'
    } else {
      str = str + '\tprivate' + " String" + ` ${value}` + '; // foreign key\n'
    }
    return str
  })
  console.log(str)
  return str
}

const path = "./example";

console.log(domain())
console.log(dto())
console.log(repository())
console.log(mapper())
console.log(service())
console.log(rest())
console.log(mysql())
  
function dumbSpaceSplit(inputString) {
  let strArray = inputString.map(x => {
    let str = x.split(' ')
    return str
  })
  return strArray;
}

function domain() {
  jsonClass.map(x => {
    var arr = dumbSpaceSplit(Object.assign([], x.values))
    var strc = domainData(arr, x.entity)
    console.log("nombre de la clase ----------------->>>>" + x.entity)
    console.log(globalDir+"/domain/" + x.entity + ".java")
    fs.writeFile(globalDir+"/domain/" + x.entity + ".java", domainClass(strc, x.entity), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function repository() {
  jsonClass.map(x => {
    console.log(globalDir+"/repositoty/" + x.entity + "Repository.java")
    fs.writeFile(globalDir+"/repository/" + x.entity + "Repository.java", repositoryClass(x.entity), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function dto() {
  jsonClass.map(x => {
    var arr = dumbSpaceSplit(Object.assign([], x.values))
    var strc = dtoData(arr, x.entity)
    console.log(globalDir+"/dto/" + x.entity + "DTO.java")
    fs.writeFile(globalDir+"/dto/" + x.entity + "DTO.java", dtoClass(strc, x.entity), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function service() {
  jsonClass.map(x => {
    console.log(globalDir+"/service/" + x.entity + "Service.java")
    fs.writeFile(globalDir+"/service/" + x.entity + "Service.java", serviceClass(x.entity), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function mapperCode(arr, className, classOrDto) {
  const array = ["String", "Integer", "Date", "Double", "Long", "int", "double", "Instant"]
  let strEntity = ''
  // let domi = className.toLowerCase() === "package" ? "packageOne" : className.toLowerCase()
  let domi = (className.toLowerCase()+(classOrDto !== "DTO" ? "DTO" : "")) === "package" ? "packageOne" : (className.toLowerCase()+(classOrDto !== "DTO" ? "DTO" : ""))
  let domi1 = (className.toLowerCase()+(classOrDto === "DTO" ? "DTO" : "")) === "package" ? "packageOne" : (className.toLowerCase()+(classOrDto === "DTO" ? "DTO" : ""))
  arr.map(y => {
    let typeData= y[0]
    let value = y[2]
    console.log(typeData)
    if (array.includes(typeData)) {
      strEntity = strEntity + '\n\t\t'+domi+'.set'+camelCase(value)+'('+domi1+'.get'+camelCase(value)+'());';
    } else {
      if (classOrDto === "DTO") {
        strEntity = strEntity + '\n' +
        "\t\tif ("+domi1+".get"+camelCase(value)+"() != null) {\n"
        +"\t\t\t"+camelCase(value).replace("Id", "")+" "+value.replace("Id", "").toLowerCase()+" = new "+camelCase(value).replace("Id", "")+"();\n"
        +"\t\t\t"+value.replace("Id", "").toLowerCase()+".set"+camelCase(value)+"("+domi1+".get"+camelCase(value)+"());\n"
        +"\t\t\t"+domi+".set"+camelCase(value).replace("Id", "")+"("+value.replace("Id", "").toLowerCase()+");\n"
        +"\t\t} "
      } else {
        strEntity = strEntity + '\n' +
        "\t\t"+domi+".set"+camelCase(value)+"("+domi1+".get"+camelCase(value).replace("Id", "")+"() != null? "+domi1+".get"+camelCase(value).replace("Id", "")+"().get"+camelCase(value)+"() : null);"
      }
    }
  })
  return strEntity;
}

function mapper() {
  jsonClass.map(x => {
    console.log(globalDir+"/service/mapper/" + x.entity + "Mapper.java")
    var arr = dumbSpaceSplit(Object.assign([], x.values))
    fs.writeFile(globalDir+"/service/mapper/" + x.entity + "Mapper.java", mapperClass(x.entity, mapperCode(arr, x.entity, "DTO"), mapperCode(arr, x.entity, ""), arr), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function rest() {
  jsonClass.map(x => {
    console.log(globalDir+"/web/rest/" + x.entity + "Resource.java")
    // var arr = dumbSpaceSplit(Object.assign([], x.values))
    var arr = x.values[0].split(' ')
    fs.writeFile(globalDir+"/web/rest/" + x.entity + "Resource.java", resourceClass(x.entity, arr[2]), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function mysqlProperties() {
  const str = "# Mysql\n"
            +"spring.datasource.url=jdbc:mysql://localhost:3306/store\n"
            +"spring.datasource.username=root\n"
            +"spring.datasource.password=root\n"
            +"spring.datasource.driverClassName=com.mysql.jdbc.Driver\n"
            +"server.port=8080\n"
            +"app.url=http://localhost:8080/\n"
            +"# Hibernate properties\n"
            +"spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true\n"
            +"spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect\n"
            +"spring.jpa.show-sql=true\n"
            +"spring.jpa.hibernate.ddl-auto=update\n"
            +"spring.jpa.hibernate.naming.implicit-strategy=org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl\n"
            +"spring.jpa.properties.hibernate.format_sql=true\n";
  return str
}

function mysql() {
  fs.writeFile("./src/main/resources/" + "application.properties", mysqlProperties(), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  }); 
}

function camelCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}