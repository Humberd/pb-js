$(function () {
///////////////////////////obsluga formularza///////////////////
	var datepicker = { 	//opcje wyskakujacego kalendarza
		dateFormat: "dd-mm-yy",
		yearRange: "1900:2005",
		defaultDate: "23-11-1994",
		changeMonth: true,
		changeYear: true,
 	}
	$("#birthday").datepicker(datepicker);

 	$("button").button();

    $("#previousTeams").chosen({
    	width: "100%",
    });
    $("#currentTeam").chosen({
    	width: "100%",
    });

//////////////////////formularz gracza//////////////////////////////

 	//tablica wszystkich pol typu input dla gracza
 	var allFields = [];
 	allFields.push($("#names"));
 	allFields.push($("#surnames"));
 	allFields.push($("#nationality"));
 	allFields.push($("#birthday"));
 	allFields.push($("#currentTeam"));
 	allFields.push($("#previousTeams"));

 	//wszystko co sie znajduje w formularzu gracza
	var formularzGracza = $("#addPlayers").dialog({
		//wlasciwosci, jakiema miec wyswietlajacy sie formularz
		autoOpen: false,
		height: 450,
		width: 350,
		modal: true, //czy w czasie kiedy jest on wlaczony, to czy mozna ruszac reszte strony
		resizable: false,
		buttons: {
			Cancel: function() {
				formularzGracza.dialog("close");
			},
			"Add": function () {
				allFields.forEach(function (value) {
					value.removeClass("ui-state-error"); //czysci wszystkie pola typu input z klasy error
				});
				var ifError = false;

				//zbiera wartosci z inputow i sprawdza, czy nie sa puste, jesli ktorys z nich jest pusty, to dodaje do niego klase error
				var names = $("#names").val().replace(/ /g,"").split(",");
				var surnames = $("#surnames").val().replace(/ /g,"").split(",");
				var nationality =$("#nationality").val().replace(/ /g,"");
				var birthday = $("#birthday").val().split("-");
				var currentTeam = $("#currentTeam").val();
				var previousTeams = $("#previousTeams").val();
				if (previousTeams !== null) {
					for (var i=0, temp=previousTeams.length; i<temp; i++) {
						previousTeams[i] = parseInt(previousTeams[i],10);
					}
				} else {
					previousTeams = [];
				}
				for (var i=0; i<3; i++) {
					birthday[i] = parseInt(birthday[i],10);
				}

				//chodzi po calej tablicy pol i sprawdza, czy nie sa one puste
				for (var i=0, temp=allFields.length; i<temp-1; i++) {
					if (allFields[i].val() == "") {
						allFields[i].addClass("ui-state-error");
						ifError = true;
					}
				}
				//jesli ktoras z nich jest pusta to nie wysyla informacji na server
				if (ifError) 
					return;

				var newPlayer = new Player({names: names, surnames: surnames, nationality: nationality, birthday: birthday, currentTeam: currentTeam, previousTeams: previousTeams});

				//ta funkcja automatycznie przesyla newPlayer na server, tam dodaje do niego id i go zapisuje i odsyla go tutaj, gdzie jest zapisana informacja zwrotna jako nowy gracz
				players.create(newPlayer, {
					wait: true,
					success: function () {
						console.log("Successfully saved player to server.");
					},
					error: function () {
						console.log("Failed to save player to server.");
					}
				});
				teams.fetch();
				formularzGracza.dialog("close");
			},
		},
		close: function () {
			//czysci formularz po jego wylaczeniu
			formularzGraczaEnter[0].reset();
			allFields.forEach(function (value) {
				value.removeClass("ui-state-error");
			});
			//czysci pole preciousTeams
			$("#previousTeams").prop("selected", false).trigger("chosen:updated");
		},
		open: function () {
			var selektor = $("#currentTeam");
			var selektor2 = $("#previousTeams");
			selektor.empty();
			selektor2.empty();
			for (var i=0, temp=teams.size(); i<temp; i++) {
				selektor.append("<option value='"+teams.at(i).get("id")+"'>"+teams.at(i).get("name")+"</option>");
				selektor2.append("<option value='"+teams.at(i).get("id")+"'>"+teams.at(i).get("name")+"</option>");
			}
			selektor.trigger("chosen:updated");
			selektor2.trigger("chosen:updated");
		}

	});
	
	//mozliwosc akceptowania formularza enterem
	var formularzGraczaEnter = formularzGracza.find("form").submit(function (){
		event.preventDefault();
		formularzGracza.dialog("option","buttons").Add();
	});
	//zbindowanie formularza pod przycisk
	$("#addNewPlayer").click(function () {
		formularzGracza.dialog("open");
	});
///////////////////////////////////////formularz zespolu///////////////////////////
	var formularzZespolu = $("#addTeams").dialog({
 		autoOpen: false,
 		modal: true,
 		height: 200,
 		resizable: false,

 		buttons: {
 			Cancel: function () {
 				formularzZespolu.dialog("close");
 			},
 			"Add": function () {
 				$("#name").removeClass("ui-state-error");

 				var ifError = false;

 				var name = $("#name").val();
 				
 				if (name == "") {
 					$("#name").addClass("ui-state-error");
 					ifError = true;
 				}
 				if (ifError)
 					return;

 				var newTeam = new Team({name: name, currentPlayers: [], previousPlayers: []});

 				formularzZespolu.dialog("close");

 				teams.create(newTeam, {
 					wait: true,
 					success: function () {
 						console.log("Successfully saved team to server.");
 					},
 					error: function () {
 						console.log("Failed to save team to server.")
 					},
 				});
 			},
 		},
 		close: function () {
 			formularzZespoluEnter[0].reset();
 			$("#name").removeClass("ui-state-error");
 		},
 	});

	var formularzZespoluEnter = formularzZespolu.find("form").submit(function (){
		event.preventDefault();
		formularzZespolu.dialog("option","buttons").Add();
	})

	$("#addNewTeam").click(function () {
		formularzZespolu.dialog("open");
	});


//////////////////////////statystyka gracza/////////////////////////////////

	var formularzStatystykaZespolu = $("#teamOverview").dialog({
		resizable: false,
		autoOpen: false,
		modal: true,
		dialogClass: "statystykaZespolu",

		buttons: {
			"Edit": function () {
				var saveName = $("#teamOverview .name td").clone();
				console.log(saveName.text());
				$("#nextTeam").attr("disabled", true);
				$("#previousTeam").attr("disabled", true);

				$("#teamOverview .name td").html(function (index, content) {
					var string = "<input value='"+content+"' >";
					return string;
				});


				var dialog_buttons = {
					"Cancel": function () {
						console.log($("#teamOverview .name td").innerText);
						console.log(saveName.innerText);
						$("#teamOverview .name td").text(saveName.text());
						$("#nextTeam").attr("disabled", false);
						$("#previousTeam").attr("disabled", false);
						$(this).dialog("option","buttons", $(this).dialog("option","buttonsBackup"));
					},
					"OK": function () {
						var name = $("#teamOverview .name input").val();

						var teamToEdit = teams.get(activeTeam.attr("value"));
						teamToEdit.save({
							wait: true,
							name: name,
						});
						$("#nextTeam").attr("disabled", false);
						$("#previousTeam").attr("disabled", false);
						$(this).dialog("option", "buttons", $(this).dialog("option","buttonsBackup"));
						$(this).dialog("close");
					}
				};

				$(this).dialog("option","buttonsBackup", $(this).dialog("option","buttons"));
				$(this).dialog("option","buttons", dialog_buttons);
			},
			Cancel: function () {
				$(this).dialog("close");
			},
		},
		buttonsBackup: {

		}
	});
	$("#nextTeam").click(function () {
		if (activeTeam.next().attr("value") !== undefined) {
			activeTeam = activeTeam.next();
			updateTeamStats(teams.get(activeTeam.attr("value")));
		}
	});

	$("#previousTeam").click(function () {
		if (activeTeam.prev().attr("value") !== undefined) {
			activeTeam = activeTeam.prev();
			updateTeamStats(teams.get(activeTeam.attr("value")));
		}
	});
	

//zmienna posiadajaca id aktualnie otwartego gracza
var activePlayer = null;
var activeTeam = null;
	//okienko ze statystykami gracza
	var formularzStatystykaGracza = $("#playerOverview").dialog({
		resizable: false,
		autoOpen: false,
		modal: true,
		dialogClass: "statystykaGracza",

		//lista guzikow domyslnych
		buttons: {
			"Delete": function () {
				var playertoRemove = players.get(activePlayer.attr("value"));

				players.remove(playertoRemove);
				

				$(this).dialog("close");
				// updatePlayerStats(players.get(activePlayer.attr("value")));
			},
			"Transfer": function () {
				var saveCurrentTeam = $("#playerOverview .currentTeam td").clone();
				$("#nextPlayer").attr("disabled",true);
				$("#previousPlayer").attr("disabled",true);
				$("#playerOverview .currentTeam td").html(function (index, content) {
					var string = "<select></select>";
					return string
				});
				

				for (var i=0, temp=teams.size(); i<temp; i++) {
					if (teams.at(i).get("name") == saveCurrentTeam.text()) {
						$("#playerOverview .currentTeam select").append("<option value='"+teams.at(i).get("id")+"' selected>"+teams.at(i).get("name")+"</option>");
					} else {
						$("#playerOverview .currentTeam select").append("<option value='"+teams.at(i).get("id")+"'>"+teams.at(i).get("name")+"</option>");
					}
				}
				$("#playerOverview .currentTeam select").chosen({
					width: "100%"
				});

				var dialog_buttons = {
					"Cancel": function () {
						$("#playerOverview .currentTeam td").text(saveCurrentTeam.text());

						$("#nextPlayer").attr("disabled",false);
						$("#previousPlayer").attr("disabled",false);
						$(this).dialog("option", "buttons", $(this).dialog("option","buttonsBackup"));
					},
					"OK": function () {
						var selektor = $("#playerOverview .currentTeam select");
						var currentTeamVal = selektor.val();
						var currentTeamText = selektor.find(":selected").text();

						var playerToTransfer = players.get(activePlayer.attr("value"));
						playerToTransfer.save({
							wait: true,
							currentTeam: currentTeamVal,
						});

						setTimeout(function () {teams.fetch();},500);

						$("#nextPlayer").attr("disabled",false);
						$("#previousPlayer").attr("disabled",false);
						$(this).dialog("option", "buttons", $(this).dialog("option","buttonsBackup"));
						$(this).dialog("close");
					}
				}

				$(this).dialog("option","buttonsBackup", $(this).dialog("option","buttons"));
				$(this).dialog("option", "buttons", dialog_buttons);


				// var dialog_buttons = {
				// 	"Cancel": function () {
				// 		$(this).dialog("close");
				// 		$(this).dialog("option", "buttons", $(this).dialog("option","buttonsBackup"));
				// 	},
				// 	"Ok": function () {
				// 		$(this).dialog("option", "buttons", $(this).dialog("option","buttonsBackup"));
				// 	}
				// }; 

				// $(this).dialog("option","buttonsBackup", $(this).dialog("option","buttons"));
				// $(this).dialog("option", "buttons", dialog_buttons);
			},
			"Edit": function () {

				//zapisuje pola z wartosciami, zeby w razie anulowania moc je latwo przywolac
				var saveFields = $("#playerOverview td").clone();
				$("#nextPlayer").attr("disabled",true);
				$("#previousPlayer").attr("disabled",true);
				//zamieniam pola do edycji na inputy z wartosciami ktore wczesniej byly tekstowe
				$("#playerOverview td").html( function (index, content) {
					if (index <3) {
						var string = "<input value='"+content+"' >";
						return string;
					} else if (index == 3) {
						var string = "<input value='"+content+"' readonly='true'>";
						return string;
					}
				});
				$("#playerOverview .birthday input").datepicker(datepicker);


				//jesli wcisne edit, to podmienia guziki domyslne na te z edycji
				var dialog_buttons = {
					"Cancel": function () {
						//wrzuca w pola w tabelce niezedyowane wartosci
						for (var i=0; i<4; i++) {
							$("#playerOverview td")[i].innerText = saveFields[i].innerText;
						}
						//przywraca glowne przyciski na wlasciwe miejsce
						$("#nextPlayer").attr("disabled",false);
						$("#previousPlayer").attr("disabled",false);
						$(this).dialog("option", "buttons", $(this).dialog("option","buttonsBackup"));
					},
					"Ok": function () {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						var selector = $("#playerOverview td input");
						var tab = [];
						for (var i=0; i<4; i++) {
							tab.push(selector[i].value);
						}

						//dane gotowe do przeslania na server
						var names = tab[0].replace(/ /g,"").split(",");
						var surnames = tab[1].replace(/ /g,"").split(",");
						var nationality = tab[2].replace(/ /g,"");
						var birthday = tab[3].split("-");
						for (var i=0; i<3; i++) {
							birthday[i] = parseInt(birthday[i],10);
						}
						for (var i=0; i<4; i++) {
							$("#playerOverview td")[i].innerText = tab[i];
						}

						var playerToEdit = players.get(activePlayer.attr("value"));
						playerToEdit.save({
							wait: true,
							names: names,
							surnames: surnames,
							nationality: nationality,
							birthday, birthday,
							success: function () {
								console.log("Success!!");
							},
							error: function () {
								console.log("error");
							}
						});

						//TODO
						//updatowanie na server
						//sortowanie
						//usuwanie
						//przewijanie
						//transfer
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						$("#nextPlayer").attr("disabled",false);
						$("#previousPlayer").attr("disabled",false);
						$(this).dialog("option", "buttons", $(this).dialog("option","buttonsBackup"));
						$(this).dialog("close");
					}
				}; 

				$(this).dialog("option","buttonsBackup", $(this).dialog("option","buttons"));
				$(this).dialog("option", "buttons", dialog_buttons);

			},
			Cancel: function () {
				formularzStatystykaGracza.dialog("close");
			},
		},
		buttonsBackup: {

		},
	});


	$("#nextPlayer").click(function () {
		// console.log(activePlayer.attr("value"));
		// console.log(activePlayer.next().attr("value"));
		if (activePlayer.next().attr("value") !== undefined) {
			activePlayer = activePlayer.next();
			// console.log(activePlayer.attr("value"));
			updatePlayerStats(players.get(activePlayer.attr("value")));
		}
	});

	$("#previousPlayer").click(function () {
		// console.log(activePlayer.attr("value"));
		// console.log(activePlayer.prev().attr("value"));
		if (activePlayer.prev().attr("value") !== undefined) {
			activePlayer = activePlayer.prev();
			// console.log(activePlayer.attr("value"));
			updatePlayerStats(players.get(activePlayer.attr("value")));
		}
	});



/////////////////////////////////////logika/////////////////////////////
	var Player = Backbone.Model.extend({
		initialize: function () {
			console.log("New Player: "+this.get("names")[0]+" "+this.get("surnames")[0]);
			this.on("change", function () {
				console.log(this.get("names")[0]+" "+this.get("surnames")[0]+" has changed.");
				//renderuje od nowa liste graczy

			});
			// var view = new PlayerView({model: this});
			// $("#playersList").append(view.render().$el);
		},

		defaults: function () {
			return {
				names: ["Adam"],
				surnames: ["Mickiewicz"],
				nationality: "Poland",
				birthday: [24,12,1978],
				currentTeam: 1,
				previousTeams: []
			}
		},
	});

	var Players = Backbone.Collection.extend({
		model: Player,
		url: "http://localhost:1337/players",
	});
	var players = new Players();
	players.fetch({
		success: function (data) {
			// console.log(data.toJSON());
			playersView = new PlayersView(); //jak pobierze z servera graczy to dopiero wyswietla ich na ekranie
			console.log("Successfully loaded players from server.");
		},
		error: function (data) {
			console.log("Failed to load players from server...");
		}
	});

	var PlayersView = Backbone.View.extend({
		collection: players,
		el: "#playersList",
		render: function () {
			this.$el.html("");
			for (var i=0; i<this.collection.size(); i++) {
				var player = this.collection.at(i);
				this.$el.append("<li "+"value='"+player.get("id")+"' class='overview'"+">"+player.get("names")[0]+" "+player.get("surnames")[0]+"</li>");

			}
			return this;
		},
		events: {
			"click .overview": "overview",
			"mouseover .overview": "mouseover",
			"mouseout .overview": "mouseout",
		},
		initialize: function () {
			this.render();
			this.collection.on("add", function (model, statuts) {
				this.render();
			}, this);
			this.collection.on("remove", function (model, status) {
				model.destroy({
					wait: true,
					dataType: "text",
					success: function () {
						console.log("Successfully removed player from server.");
					},
					error: function () {
						console.log("Failed to remove player from server.");
					},
				});
/////////////////////////////////////////////////////////////////////////////////
				teams.fetch();
				// console.log(JSON.stringify(teams.pluck("currentPlayers")));
				this.render();
			}, this);
			this.collection.on("change", function (model, status) {
				this.render();
			}, this);

		},
		overview: function (e) {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//wstawiam dane z servera do arkusza statystyk gracza
			// console.log(this.collection.get($(e.target).attr("value")).toJSON());
			var playerModel = this.collection.get($(e.target).attr("value"));

			updatePlayerStats(playerModel);
			activePlayer = $(e.target);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			formularzStatystykaGracza.dialog("open");
		},
		mouseover: function (e) {
			$(e.target).animate({backgroundColor: "white"}, 0);
		},
		mouseout: function (e) {
			$(e.target).animate({backgroundColor: "transparent"}, 0);
		},

	});

	//funkcja updatuje arkusz danymi gracza z modelu playerModel
	function updatePlayerStats(playerModel) {
		var names ="";
		var surnames ="";
		var nationality ="";
		var birthday ="";
		var currentTeam ="";
		var previousTeams ="";

		playerModel.get("names").forEach(function (val, index) {
			names+=val+", ";
		});
		names = names.substring(0,names.length-2);

		playerModel.get("surnames").forEach(function (val, index) {
			surnames+=val+", ";
		});
		surnames = surnames.substring(0,surnames.length-2);

		nationality = playerModel.get("nationality");

		playerModel.get("birthday").forEach(function (val, index) {
			birthday+= val+"-";
		});
		birthday = birthday.substring(0,birthday.length-1);

		currentTeam = teams.get(playerModel.get("currentTeam")).get("name");

		playerModel.get("previousTeams").forEach(function (val, index) {
			previousTeams += teams.get(val).get("name")+", ";
		});

		previousTeams = previousTeams.substring(0,previousTeams.length-2);

		$("#playerOverview .names td").text(names);
		$("#playerOverview .surnames td").text(surnames);
		$("#playerOverview .nationality td").text(nationality);
		$("#playerOverview .birthday td").text(birthday);
		$("#playerOverview .currentTeam td").text(currentTeam);
		$("#playerOverview .previousTeams td").text(previousTeams);
	}

	var playersView;

	var Team = Backbone.Model.extend({
		initialize: function () {
			console.log("New Team: "+this.get("name"));
		},
		defaults: function () {
			return {
				name: "FC Białousy",
				currentPlayers: [],
				previousPlayers: []
			}
		}
	});

	var Teams = Backbone.Collection.extend({
		model: Team,
		url: "http://localhost:1337/teams",
	});
	var teams = new Teams();
	teams.fetch({
		success: function (data) {
			// console.log(data.toJSON());
			teamsview = new TeamsView();
			console.log("Successfully loaded teams from server.");
		},
		error: function (data) {
			Console.log("Failed to load teams from server...");
		}
	});
	var TeamsView = Backbone.View.extend({
		collection: teams,
		el: "#teamsList",
		render: function () {
			this.$el.html("");
			for (var i=0; i< this.collection.size(); i++) {
				var team = this.collection.at(i);
				this.$el.append("<li "+"value='"+team.get("id")+"' class='overview'"+">"+team.get("name")+"</li>");
			}
		},
		events: {
			"click .overview": "overview",
			"mouseover .overview": "mouseover",
			"mouseout .overview": "mouseout",
		},
		initialize: function () {
			this.render();
			this.collection.on("add", this.render, this);
			this.collection.on("remove", this.render, this);
			this.collection.on("change", function () {
				this.render();
			}, this);
		},
		overview: function (e) {
			// console.log(this.collection.get($(e.target).attr("value")).toJSON());
			var teamModel = this.collection.get($(e.target).attr("value"));
			updateTeamStats(teamModel);
			activeTeam = $(e.target);
			formularzStatystykaZespolu.dialog("open");
		},
		mouseover: function (e) {
			$(e.target).animate({backgroundColor: "white"}, 0);
		},
		mouseout: function (e) {
			$(e.target).animate({backgroundColor: "transparent"}, 0);
		},

	});

	function updateTeamStats(teamModel) {
		var name = "";
		var currentPlayers = "";
		var previousPlayers = "";

		name=teamModel.get("name");

		teamModel.get("currentPlayers").forEach(function (val, index) {
			currentPlayers += players.get(val).get("names")[0]+" ";
			currentPlayers += players.get(val).get("surnames")[0]+", ";
		});
		currentPlayers = currentPlayers.substring(0,currentPlayers.length-2);

		teamModel.get("previousPlayers").forEach(function (val, index) {
			previousPlayers += players.get(val).get("names")[0]+" ";
			previousPlayers += players.get(val).get("surnames")[0]+", ";
		});
		previousPlayers = previousPlayers.substring(0,previousPlayers.length-2);

		$("#teamOverview .name td").text(name);
		$("#teamOverview .currentPlayers td").text(currentPlayers);
		$("#teamOverview .previousPlayers td").text(previousPlayers);
	}

	var teamsView;
	
	// var MyRouter = Backbone.Router.extend({
	// 	routes: {
	// 		"transfer": "transfer",
	// 	},
	// 	transfer: function() {

	// 	}
	// });
});

