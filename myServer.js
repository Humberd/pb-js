var express = require("./node_modules/express");
var bodyParser = require("./node_modules/body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var playersID = 8;
var players = [
	{id: 1, names: ["Lionel","Andres"], surnames: ["Messi"], nationality: "Argentina", birthday: [24,6,1987], currentTeam: 1, previousTeams: []},
	{id: 2, names: ["Xavier"], surnames: ["Hernández","Creus"], nationality: "Spain", birthday: [25,1,1980], currentTeam: 2, previousTeams: [1]},
	{id: 3, names: ["Andrés"], surnames: ["Iniesta","Luján"], nationality: "Spain", birthday: [11,5,1984], currentTeam: 1, previousTeams: [3]},
	{id: 4, names: ["Robert"], surnames: ["Lewandowski"], nationality: "Poland", birthday: [21,8,1988], currentTeam: 5, previousTeams: [3,4,1,2]},
	{id: 5, names: ["Wayne","Mark"], surnames: ["Rooney"], nationality: "English", birthday: [24,10,1985], currentTeam: 3, previousTeams: [5]},
	{id: 6, names: ["Andrea"], surnames: ["Pirlo"], nationality: "Italy", birthday: [19,5,1979], currentTeam: 4, previousTeams: []},
	{id: 7, names: ["Manuel","Peter"], surnames: ["Neuer"], nationality: "Spain", birthday: [27,3,1986], currentTeam: 5, previousTeams: [3]},
];


var teamsID = 6;
var teams = [
	{id: 1, name: "F.C. Barcelona", currentPlayers: [1,3], previousPlayers: [2,4]},
	{id: 2, name: "Al-Sadd", currentPlayers: [2], previousPlayers: [4]},
	{id: 3, name: "Manchester United", currentPlayers: [5], previousPlayers: [7,4,3]},
	{id: 4, name: "Juventus Turyn", currentPlayers: [6], previousPlayers: [4]},
	{id: 5, name: "Bayern Monachium", currentPlayers: [4,7], previousPlayers: [5]},
];

//SKRYPTY DO HTML-A
app.get("/chosen-sprite.png", function (req, res) {
	res.sendFile("lib/chosen-sprite.png", {root: __dirname});
});
app.get("/chosen.proto.js", function (req, res) {
	res.sendFile("lib/chosen.proto.js", {root: __dirname});
});
app.get("/chosen.css", function (req, res) {
	res.sendFile("lib/chosen.css", {root: __dirname});
});
app.get("/chosen.jquery.js", function (req, res) {
	res.sendFile("lib/chosen.jquery.js", {root: __dirname});
});
app.get("/jquery-ui.js", function (req, res) {
	res.sendFile("lib/jquery-ui.js", {root: __dirname});
});
app.get("/underscore-min.js", function (req, res) {
	res.sendFile("lib/underscore-min.js", {root: __dirname});
});
app.get("/jquery-2.1.4.min.js", function (req, res) {
	res.sendFile("lib/jquery-2.1.4.min.js", {root: __dirname});
});
app.get("/backbone-min.js", function (req, res) {
	res.sendFile("lib/backbone-min.js", {root: __dirname});
});
app.get("/mainPage.css", function (req, res) {
	res.sendFile("mainPage.css", {root: __dirname});
});
app.get("/myBackbone.js", function (req, res) {
	res.sendFile("myBackbone.js", {root: __dirname});
});
// app.get("/", function (req, res) {
// 	res.sendFile("", {root: __dirname});
// });
app.get("/basic", function (req, res) {
	res.sendFile("basicDialog.html", {root: __dirname});
});
app.get("/testowy", function (req, res) {
	res.sendFile("testowy.html", {root: __dirname});
});
app.get("/", function (req, res) {
	res.sendFile("mainPage.html", {root: __dirname});
});
//zwracanie wszystkich graczy
app.get("/players", function (req, res) {
	res.send(players);
});
//zwracanie wszystkich zespolow
app.get("/teams", function (req, res) {
	res.send(teams);
});
//zwracanie wybranego gracza
app.get("/players/:id", function (req, res) {
	var player = find(parseInt(req.params.id,10), players);
	if (player) {
		console.log("Reading: player["+req.params.id+"]");
		res.send(player);
	} else {
		res.status(404).send("Brak gracza o id: "+req.params.id);
	}
});

//zwracanie wybranego zespolu
app.get("/teams/:id", function (req, res) {
	var team = find(parseInt(req.params.id,10), teams);
	if (team) {
		console.log("Reading: team["+req.params.id+"]");
		res.send(team);
	} else {
		res.status(404).send("Brak zespołu o id: "+req.params.id);
	}
});
//szukam gracza lub klubu po id w zaleznosci od argumentu
function find (id, array) {
	for (var i=0, temp=array.length; i<temp; i++) {
		if (array[i].id === id) {
			return array[i];
		}
	}
	return null;
}
//funkcja dodaje id gracza do klubow
function bindPlayersToTeams (player) {
	var prevTeams = player.previousTeams;
	for (var i=0, temp=prevTeams.length; i<temp; i++) {
		prevTeams[i] = parseInt(prevTeams[i],10);
	}
	player.currentTeam = parseInt(player.currentTeam,10);
	for (var i=0, temp=teams.length; i<temp; i++) {
		if (teams[i].id === player.currentTeam) {
			teams[i].currentPlayers.push(player.id);
		}
		for (var j=0, temp2=prevTeams.length; j<temp2; j++) {
			if (teams[i].id === prevTeams[j]) {
				teams[i].previousPlayers.push(player.id);
				break;
			}
		}
	}
}
//dodaje gracza po id
app.post("/players", function (req, res) {
	var player = req.body;
	console.log("New Player: "+player.names[0]+" "+player.surnames[0]);
	player.id = playersID++;
	bindPlayersToTeams(player);
	players.push(player);
	res.send(player);
});
//dodaje zespol po id
app.post("/teams", function (req, res) {
	var team = req.body;
	console.log("New Team: "+team.name);
	team.id = teamsID++;
	team.currentPlayers = [];
	team.previousPlayers = [];
	teams.push(team);
	res.send(team);
});
//edytuje gracza po id
app.put("/players/:id", function (req, res) {
	var newPlayer = req.body;
	var oldPlayer = find(parseInt(req.params.id,10),players);
	if (oldPlayer) {
		// console.log(oldPlayer.currentTeam);
		// console.log(newPlayer.currentTeam);
		if (oldPlayer.currentTeam != newPlayer.currentTeam) {
			res.redirect("/players/"+req.params.id+"/transfer");
			return;
		}
		console.log("Editing player: "+oldPlayer.names[0]+" "+oldPlayer.surnames[0]);
		oldPlayer.names = newPlayer.names;
		oldPlayer.surnames = newPlayer.surnames;
		oldPlayer.nationality = newPlayer.nationality;
		oldPlayer.birthday = newPlayer.birthday;
		for (var i=0, temp=players.length; i<temp; i++) {
			if (players[i].id === oldPlayer.id) {
				players[i] = oldPlayer;
				break;
			}
		}
		res.send(oldPlayer);
	} else {
		res.status(404).send("Brak gracza o id: "+req.params.id);
	}
});
//transferuje gracza z jednego zespolu do drugiego
app.put("/players/:id/transfer", function (req, res) {
	var newTeam = req.body.currentTeam;
	newTeam = parseInt(newTeam,10);
	var player = find(parseInt(req.params.id,10),players);
	if (player) {
		var currTeam = find(player.currentTeam,teams);
		var newwTeam = find(newTeam,teams);
		console.log("Transferring: "+player.names[0]+" "+ player.surnames[0]+" from: "+currTeam.name+" to: "+newwTeam.name);
		for (var i=0, temp=players.length; i<temp; i++) {
			if (players[i].id ===player.id) {
				players[i].previousTeams.push(players[i].currentTeam);
				players[i].currentTeam = newTeam;
				break;
			}
		}
		for (var i=0, temp=teams.length; i<temp; i++) {
			if (teams[i].id === currTeam.id) {
				for (var j=0, temp2=teams[i].currentPlayers.length; j<temp2; j++) {
					if (teams[i].currentPlayers[j] === player.id) {
						teams[i].currentPlayers.splice(j, 1);
						teams[i].previousPlayers.push(player.id);
						break;
					}
				}
			}
			if (teams[i].id === newwTeam.id) {
				teams[i].currentPlayers.push(player.id);
			}
		}
		res.send(player);
	} else {
		res.status(404).send("Brak gracza o id: "+req.params.id);
	}
});
//edytuje zespol po id
app.put("/teams/:id", function (req, res) {
	var newTeam = req.body;
	var oldTeam = find(parseInt(req.params.id,10),teams);
	if (oldTeam) {
		console.log("Editing team: "+oldTeam.name);
		oldTeam.name = newTeam.name;
		for (var i=0, temp=teams.length; i<temp; i++) {
			if (teams[i].id === oldTeam.id) {
				teams[i] = oldTeam;
				break;
			}
		}
		res.send(oldTeam);
	} else {
		res.status(404).send("Brak zespołu o id: "+req.params.id);
	}

});
//usuwanie gracza po id
app.delete("/players/:id", function (req, res) {
	var playerToDelete = find(parseInt(req.params.id,10),players);
	if (playerToDelete) {
		removePlayer(parseInt(req.params.id,10));
		// console.log("removing");
		res.sendStatus(200);
	} else {
		res.status(404).send("Brak zespołu o id: "+req.params.id);
	}
});
function removePlayer (id) {
	//szukam gracza sposrod wszystkich gracy
	for (var i=0, temp=players.length; i<temp; i++) {
		if (players[i].id === id) {
			console.log("Removing: "+players[i].names[0]+" "+players[i].surnames[0]);
			var playerToDelete = players[i];
			// console.log(playerToDelete);
			for (var j=0, temp2=teams.length; j<temp2; j++) {
				//jesli jest to zespol, ktory jest w current team gracza
				if (teams[j].id ===playerToDelete.currentTeam) {
					for (var k=0, temp3=teams[j].currentPlayers.length; k<temp3; k++) {
						if (teams[j].currentPlayers[k] === playerToDelete.id) {
							teams[j].currentPlayers.splice(k, 1);
						}
					}
				}
				for (var m=0, temp4=playerToDelete.previousTeams.length; m<temp4; m++) {
					if (teams[j].id === playerToDelete.previousTeams[m]) {
						for (var n=0, temp5=teams[j].previousPlayers.length; n<temp5; n++) {
							if (teams[j].previousPlayers[n] === playerToDelete.id) {
								teams[j].previousPlayers.splice(n, 1);
							}
						}
					}
				}
			}
			players.splice(i,1);
			break;
		}
	}
}
app.listen(1337, function () {
	console.log("Server running...");
});