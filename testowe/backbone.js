$(function () {
	// $.get("/persons").done(function (data,status) {
	// 	// console.log(JSON.stringify(data)+" "+status);
	// 	data.forEach(function (person) {
	// 		AddPerson(person);
	// 	});
	// });

	// $("#add").click(function () {
	// 	var person = { "firstName":$("#firstName").val(),
	// 					"lastName":$("#lastName").val()};
	// 	$.post("/persons",person, function (data) {
	// 		AddPerson(data);
	// 	});
	// });

	function AddPerson (person) {
		var li = $("<li></li>");
		li.text(person.firstName+" "+person.lastName)
			.append(" <a href='#'>x</a>")
			.appendTo("#persons")
			.find("a")
			.click(person.id, function (id) {
				$.ajax("persons/"+id.data, {
					type: "delete",
					error: function (s) {
						alert("err");
					},
					success: function (s) {
						li.remove();
					}
				});
			});
	}
});