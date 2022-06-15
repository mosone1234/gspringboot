const fs = require('fs')

let jsonClass = require('./struct.json')

function domainClass(data, className) {
  let str = 'package com.example.store.domain; \n\n'
    + 'import java.sql.Date; \n'
    + 'import javax.persistence.*; \n'
    + 'import org.hibernate.annotations.Cache; \n'
    + 'import org.hibernate.annotations.CacheConcurrencyStrategy; \n'
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
  let str = 'package com.example.store.dto; \n\n'
    + 'import lombok.*; \n\n'
    + '@EqualsAndHashCode(callSuper = false) \n'
    + '@Entity \n'
    + '@Getter \n'
    + '@Setter \n'
    + 'public class '+ className +'DTO { \n'
    + `${data}`
    + '} \n'
    return str
}

function repositoryClass(className) {
  let str = 'package com.example.store.reporitory;\n\n' +  
            'import org.springframework.data.jpa.repository.JpaRepository;\n' +
            'import com.example.store.domain.'+className+';\n\n' +
            'public interface '+ className +'Repository extends JpaRepository<'+className+', String> {\n\n'+
            '}\n'
  return str
}

function serviceClass(className) {
  let str = 'package com.example.store.service;\n'+
            'import java.util.List;\n'+
            'import java.util.Optional;\n'+
            'import java.util.stream.Collectors;\n'+
            'import org.springframework.stereotype.Service;\n'+
            'import com.example.store.domain.'+className+';\n'+
            'import com.example.store.dto.'+className+'DTO;\n'+
            'import com.example.store.reporitory.'+className+'Repository;\n'+
            'import com.example.store.service.mapper.'+className+'Mapper;\n\n'+
    
            '@Service\n'+
            'public class '+className+'Service {\n\n'+
                '\tprivate final '+className+'Repository '+className.toLowerCase()+'Repository;\n\n'+
                '\tpublic '+className+'Service ('+className+'Repository '+className.toLowerCase()+'Repository) {\n'+
                    '\t\tthis.'+className+'Repository = '+className.toLowerCase()+'Repository;\n'+
                '\t}\n\n'+
                '\tpublic '+className+'DTO save('+className+'DTO '+className.toLowerCase()+'DTO) {\n'+
                    '\t\t'+className+' '+className.toLowerCase()+' = '+className+'Mapper.toEntity('+className.toLowerCase()+'DTO);\n'+
                    '\t\t'+className+'DTO = '+className+'Mapper.toDTO(this.'+className.toLowerCase()+'Repository.save('+className.toLowerCase()+'));\n'+
                    '\t\treturn '+className.toLowerCase()+'DTO;\n'+
                '\t}\n\n'+
                '\tpublic Optional<'+className+'DTO> findOne(String '+className.toLowerCase()+'Id) {\n'+
                    '\t\treturn this.'+className+'Repository.findById('+className.toLowerCase()+'Id).map(t -> '+className+'Mapper.toDTO(t));\n'+
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

function resourceClass(className) {
  let str = 'package com.example.store.web.rest;\n'+
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
            'import com.example.store.dto.'+className+'DTO;\n'+
            'import com.example.store.service.'+className+'Service;\n'+
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
                    '\t\tif ('+className.toLowerCase()+'DTO.get'+className+'Id() == null) {\n'+
                        '\t\tthrow new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID null");\n'+
                    '\t\t}\n'+
                    '\t\t'+className+'DTO '+className.toLowerCase()+'DTO2 = this.'+className.toLowerCase()+'Service.save('+className.toLowerCase()+'DTO);\n'+
                    '\t\treturn ResponseEntity.ok().body('+className.toLowerCase()+'DTO2);\n'+
                '\t}\n\n'+
                '\t@PutMapping("/'+className.toLowerCase()+'s")\n'+
                '\tpublic ResponseEntity<'+className+'DTO> update(@RequestBody '+className+'DTO '+className.toLowerCase()+'DTO) {\n'+
                    '\t\tOptional<'+className+'DTO> existing'+className+' = this.'+className.toLowerCase()+'Service.findOne('+className.toLowerCase()+'DTO.get'+className+'Id());\n'+
                    '\t\tif (existing'+className+'.isPresent() && (!existing'+className+'.get().get'+className+'Id().equals('+className.toLowerCase()+'DTO.get'+className+'Id()))) {\n'+
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

function mapperClass(className, entity, dto) {
  let str = 'package com.example.store.service.mapper;\n'+
            'import com.example.store.domain.'+className+';\n'+
            'import com.example.store.dto.'+className+'DTO;\n\n' +

            'public class '+className+'Mapper {\n' +
                '\tpublic static '+className+' toEntity('+className+'DTO '+className.toLowerCase()+'DTO) {\n' +
                    '\t\t'+className+' '+className.toLowerCase()+' = new '+className+'();\n' +
                    '\t\t'+entity+'\n'+
                    '\t\treturn '+className.toLowerCase()+';\n' +
                '\t}\n'+
                '\tpublic static '+className+'DTO toDTO('+className+' '+className.toLowerCase()+') {\n' +
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
    if (array.includes(typeData)) {
      str = str + '\t@'+ id + '\n' +
                  (id.toLowerCase() === 'manytoone' || id.toLowerCase() === 'onetoone' ? '\t@JsonIgnoreProperties("'+ className.toLowerCase() +'")\n' : "") +
                  '\tprivate ' + typeData + ' '+value+ ';\n'
    } else {
      str = str + '\t@'+ id + '\n' +
                  (id.toLowerCase() === 'manytoone' || id.toLowerCase() === 'onetoone' ? '\t@JsonIgnoreProperties("'+ className.toLowerCase() +'")\n' : "") +
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
    console.log("./example/domain/" + x.entity + ".java")
    fs.writeFile("./example/domain/" + x.entity + ".java", domainClass(strc, x.entity), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function repository() {
  jsonClass.map(x => {
    console.log("./example/repositoty/" + x.entity + "Repository.java")
    fs.writeFile("./example/repository/" + x.entity + "Repository.java", repositoryClass(x.entity), function(err) {
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
    console.log("./example/dto/" + x.entity + "DTO.java")
    fs.writeFile("./example/dto/" + x.entity + "DTO.java", dtoClass(strc, x.entity), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function service() {
  jsonClass.map(x => {
    console.log("./example/service/" + x.entity + "Service.java")
    fs.writeFile("./example/service/" + x.entity + "Service.java", serviceClass(x.entity), function(err) {
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
  arr.map(y => {
    let typeData= y[0]
    let value = y[2]
    console.log(typeData)
    // if (array.includes(value)) {
      strEntity = strEntity + '\n\t\t'+className.toLowerCase()+(classOrDto !== "DTO" ? "DTO" : "")+'.set'+camelCase(value)+'('+className.toLowerCase()+(classOrDto === "DTO" ? "DTO" : "")+'.get'+camelCase(value)+'());';
    // } else {
    //   strEntity = strEntity +
    // }
  })
  return strEntity;
}

function mapper() {
  jsonClass.map(x => {
    console.log("./example/service/mapper/" + x.entity + "Mapper.java")
    var arr = dumbSpaceSplit(Object.assign([], x.values))
    fs.writeFile("./example/service/mapper/" + x.entity + "Mapper.java", mapperClass(x.entity, mapperCode(arr, x.entity, "DTO"), mapperCode(arr, x.entity, "")), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function rest() {
  jsonClass.map(x => {
    console.log("./example/web/rest/" + x.entity + "Resource.java")
    var arr = dumbSpaceSplit(Object.assign([], x.values))
    fs.writeFile("./example/web/rest/" + x.entity + "Resource.java", resourceClass(x.entity), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  })
}

function camelCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}