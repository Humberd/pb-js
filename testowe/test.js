var express = require("./node_modules/express");
var bodyParser = require("./node_modules/body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var books = [
	{author: "J.R.R. Tolkien", title: "Lord of the Rings"},
	{author: "J.K. Rowling", title: "Harry Potter"}
];

var personId = 100;
var persons= [
	{id: 98, firstName: "Jan", lastName: "Kowalski"},
	{id: 99, firstName: "Piotr", lastName: "Nowak"}
];
//SKRYPTY DO HTML-A
app.get("/backbone.js", function (req, res) {
	res.sendFile("backbone.js", {root: __dirname});
});
app.get("/underscore-min.js", function (req, res) {
	res.sendFile("underscore-min.js", {root: __dirname});
});
app.get("/jquery-2.1.4.min.js", function (req, res) {
	res.sendFile("jquery-2.1.4.min.js", {root: __dirname});
});
app.get("/backbone-min.js", function (req, res) {
	res.sendFile("backbone-min.js", {root: __dirname});
});
app.get("/backbonePrawdziwy.js", function (req, res) {
	res.sendFile("backbonePrawdziwy.js", {root: __dirname});
});
// app.get("/", function (req, res) {
// 	res.sendFile("", {root: __dirname});
// });

//master page
app.get("/",function (req,res) {
	res.sendFile("index.html",{root: __dirname});
});
//zwracanie wszystkich osob
app.get("/persons", function (req, res) {
	console.log("Reading: /persons");
	res.send(persons);
});
//zwracanie wybranej osoby
app.get("/persons/:id", function (req, res) {
	console.log("Reading: /persons/:id");
	var person = findPerson(parseInt(req.params.id, 10));
	if (person) {
		res.send(person);
	} else {
		res.status(404).send("Brak osoby o id: "+ req.params.id);
	}
});
//szukam osobe po id
function findPerson (id) {
	for (var i = 0, temp = persons.length; i < temp; i++) {
		if (persons[i].id === id) {
			return persons[i];
		}
	}
	return null;
}
//dodaje osobe z formularza do mojej tablicy osob i zwracam ta osobe
app.post("/persons", function (req, res) {
	var person = req.body;
	console.log("Adding: "+person.firstName+" "+person.lastName);
	person.id = personId++;
	persons.push(person);
	// res.redirect("/persons/"+person.id);ć
	res.send(person);
});
//edytuje dana osobe z danym id
app.put("/persons/:id", function (req, res) {
	var newPersonData = req.body;
	var oldPersonData = findPerson(parseInt(req.params.id,10));
	if (oldPersonData) {
		console.log("Editing: ["+oldPersonData.firstName+" "+oldPersonData.lastName+"] for ["+newPersonData.firstName+" "+newPersonData.lastName+"]");
		oldPersonData.firstName = newPersonData.firstName;
		oldPersonData.lastName = newPersonData.lastName;
		res.send(newPersonData);
	} else {
		res.status(404).send("Brak osoby o id: "+ req.params.id);
	}
});
//usuwam osobe z danym id
app.delete("/persons/:id", function (req, res) {
	var personToDelete = findPerson(parseInt(req.params.id,10));
	if (personToDelete) {
		removePerson(parseInt(req.params.id,10));
		console.log("Successfully removed: "+personToDelete.firstName+" "+personToDelete.lastName);
		res.send(personToDelete);
	} else {
		res.status(404).send("Brak osoby o id: "+ req.params.id);
	}
});
//usuwam osobe z danym id
function removePerson (id) {
	for (var i=0, temp=persons.length; i<temp; i++){
		if (persons[i].id === id){
			persons.splice(i,1);
			break;
		}
	}
}
app.listen(1337,function() {
	console.log("Server running...");
});