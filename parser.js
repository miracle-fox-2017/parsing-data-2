"use strict"
let fs = require('fs')
let yaml = require('node-yaml');

class Person {
  constructor(id,first_name,last_name,email,phone,created_at){
    this.id = id
    this.first_name = first_name
    this.last_name = last_name
    this.email = email
    this.phone = phone
    this.created_at = new Date(created_at)
  }
}

class PersonParser {
  constructor(file) {
    this._file = file
    this._people = null
  }

  get people() {
    let object = {
      data : this._people,
      size : this._people.length-1
    }
    return object
  }

  get file() {
    return this._file
  }

  set people(dataPerson) {
    this._people = dataPerson
  }

  addPerson(first_name,last_name,email,phone,created_at) {
    let id = parseInt(this._people[this._people.length-1].id)
    this._people.push(new Person(id+=1,first_name,last_name,email,phone,new Date()))
  }

  deletePerson(id) {
    for (var i = 0; i < this._people.length; i++) {
      if(this._people[i].id == id){
        console.log(this._people[i].id, ' deleted');
        this._people.splice(i, 1);
      }
    }
  }

  readFile() {
    let dataFile = fs.readFileSync(this._file, 'utf8').split('\n')
    let dataPerson = []
    for (var i = 0; i < dataFile.length; i++) {
      let strSplit = dataFile[i].split(',')
      dataPerson.push(new Person(strSplit[0],strSplit[1],strSplit[2],strSplit[3],strSplit[4],strSplit[5]))
    }
    return dataPerson
  }

  save() {
    let dataPersonSave = [Object.keys(this._people[0])]
    for (var i = 1; i < this._people.length; i++) {
      dataPersonSave.push(Object.values(this._people[i]))
    }
    fs.writeFileSync(this._file, dataPersonSave.join('\n'), 'utf8')
    return dataPersonSave.join('\n')
  }

  save_as_yaml() {
    let dataPersonStr = JSON.stringify(this._people)
    let dataPersonObj = JSON.parse(dataPersonStr);
    yaml.writeSync('people.yml', dataPersonObj)
  }

  save_as_json() {
    let dataPersonSave = JSON.stringify(this._people)
    fs.writeFileSync('people.json', dataPersonSave)
  }
}

var faker = require('faker')

var randomFirstName = faker.name.firstName();
var randomLastName = faker.name.lastName();
var randomEmail = faker.internet.email()
var randomPhone = faker.phone.phoneNumberFormat()

let parser = new PersonParser('people.csv')
// assign hasil baca file ke property this._people
parser.people = parser.readFile();

// addPerson = first_name,last_name,email,phone (id dan created_at otomatis)
// input dari faker
parser.addPerson(randomFirstName,randomLastName,randomEmail,randomPhone);

// deletePerson by id
// parser.deletePerson(200)

// save
parser.save();
parser.save_as_yaml()
parser.save_as_json()

console.log(`There are ${parser.people.size} people in the file '${parser.file}'.`)
