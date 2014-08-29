(function() {

	var app = angular.module('plunker', ['ui.bootstrap']);

	app.controller('DropdownCtrl', function() {
		this.selectedNomenclatorChooser = nomenclatorChoosers[1];
		this.status = {
			isopen : false
		};

	});
	
	var nomenclatorChoosers = [{
			message : "Select the main Ontology you want to use",
			label : "Ontology",
			items : [{
				id : 1,
				description : "foaf"
			}, {
				id : 2,
				description : "skos"
			}, {
				id : 3,
				description : "swrc"
			}, {
				id : 4,
				description : "schm"
			}]
		}, {
			message : "What do you want to show from swrc ontology?",
			label : "Class",
			items : [{
				id : 1,
				description : "swrc:Article"
			}, {
				id : 2,
				description : "swrc:Book"
			}, {
				id : 3,
				description : "swrc:Conference"
			}, {
				id : 4,
				description : "swrc:Event"
			}]
		}];
})();
