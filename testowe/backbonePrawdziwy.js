$(function () {	
	var Person = Backbone.Model.extend({
		initialize: function () {
			console.log("Created: "+this.get("firstName")+" "+this.get("lastName"));
			this.on("change", function () {
				console.log("Modified: "+this.get("firstName")+" "+this.get("lastName"));
			}, this);
		},
		defaults: function () {
			return {
				firstName: "",
				lastName: ""
			}
		},
	});
	var person1 = new Person({firstName:"Maciej", lastName: "Sawicki"});
	var person2 = new Person({firstName:"Adam", lastName: "Nowak"});
	var person3 = new Person({firstName:"Krzesław", lastName: "Łabądzki"});

	var Society = Backbone.Collection.extend({
		model: Person,
		url: "http://localhost:1337/persons",
	});

	//tworze nowe spoleczenstwo
	var society = new Society();
	//wczytuje z podanego wyzej url wszystkie osoby z servera
	society.fetch({
		success: function(data) {
			console.log(society.toJSON());
			//wczytuje na strone, zeby wyswietlic jeden po drugim
			// data.forEach(function (person) {
			// 	var view = new PersonView({ model: person});
			// 	$("#persons").append(view.render().el);
			// });
			var view = new PersonView();
			view.render();
		},
		error: function () {
			console.log("Failed to load from server.");
		},
	});
	//zapakowanie do ludzi do html-a
	var PersonView = Backbone.View.extend({
		// tagName: "li",
		// render: function () {
		// 	this.$el.html("<b>"+this.model.get("firstName")+" "+this.model.get("lastName")+"</b>");
		// 	return this;
		// }
		collection: society,
		el: "#persons",
		render: function () {
			this.$el.html("");
			for (var i=0; i<this.collection.size(); i++) {
				var person = this.collection.at(i);
				person = person.toJSON();
				this.$el.append("<li>"+"<b>"+person.firstName+" "+person.lastName+"</b>"+"</li>");
			}
			return this;
		},
	});

	//po kliknieciu wysyla dane na server
	$("#add").click(function () {
		var person = new Person({firstName: $("#firstName").val(), lastName: $("#lastName").val()});
		//wysylam do servera do /persons metoda POST zmienna "person"
		society.create(person, {
			success: function () {
				console.log("Successfully saved.");
		 	},
			error: function () {
				console.log("Failed to save.");
			}
		});
	});

});