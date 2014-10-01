(function() {
	var app = angular.module('wizard', ['ui.bootstrap', 'checklist-model']);

	app.controller('WizardController', ['$http',
	function($http) {

		var me = this;

		me.wizard = [];
		me.currentWindow = [];
		me.solution = {};
		me.userSequence = [];
		me.solution.selectedOptions = [];
		me.examples = [];

		$http.get('/def/definition').success(function(data) {
			me.wizard = data;

			me.currentWindow = me.wizard[10];

			me.solution = {
				selectedOption : 1,
				selectedProperties : [0, 5, 4, 1],
				selectedOptions : []
			};

			me.userSequence = [];
			length = me.currentWindow.propertySets ? me.currentWindow.propertySets[me.solution.selectedOption].length : 0;
			me.solution.selectedOptions = [length];

			for ( i = 0; i < length; i++) {
				me.solution.selectedOptions[i] = 0;
			}
		});

		/*
		 $http.get('/def/examples').success(function(data) {
		 me.example = data;
		 });
		 */

		me.example = {
			"definition" : [{
				"propertyName" : "hasOpeningDoc",
				"domain" : ["Event"],
				"range" : ["Document"]
			}, {
				"propertyName" : "hasClosingDoc",
				"domain" : ["Event"],
				"range" : ["Document"]
			}, {
				"propertyName" : "presenter",
				"domain" : ["Document"],
				"range" : ["Person"]
			}, {
				"propertyName" : "author",
				"domain" : ["Document"],
				"range" : ["Person"]
			}, {
				"propertyName" : "advisor",
				"domain" : ["Document"],
				"range" : ["Person"]
			}, {
				"propertyName" : "madeIn",
				"domain" : ["Document"],
				"range" : ["Country"]
			}, {
				"propertyName" : "organizer",
				"domain" : ["Event"],
				"range" : ["Person"]
			}],
			"triples" : [{
				"subject" : "Event1",
				"predicate" : "hasOpeningDoc",
				"object" : "DocA"
			}, {
				"subject" : "Event2",
				"predicate" : "hasClosingDoc",
				"object" : "DocC"
			}, {
				"subject" : "DocA",
				"predicate" : "presenter",
				"object" : "Albert"
			}, {
				"subject" : "DocA",
				"predicate" : "author",
				"object" : "John Doe"
			}, {
				"subject" : "DocC",
				"predicate" : "advisor",
				"object" : "Schawbe"
			}, {
				"subject" : "DocA",
				"predicate" : "madeIn",
				"object" : "China"
			}, {
				"subject" : "Event1",
				"predicate" : "organizer",
				"object" : "Tim Berners Lee"
			}]
		};
		
		this.isType = function(val) {
			return this.currentWindow.type == val;
		};

		this.changeWindow = function() {
			if (this.window.needNextProcessing) {
				eval(this.window.expToEval);
			}
			step = {
				currentWindow : this.currentWindow.id,
				//title: this.currentWindow.title, //debug
				selectedOption : this.solution.selectedOption,
				selectedProperties : this.solution.selectedProperties
			};
			this.userSequence.push(step);
			/*	if (this.currentWindow.type == "unique") /// nuevo
			 document.location = "currentWindows"; */
			this.selectWindow(this.currentWindow.options[this.solution.selectedOption].next);

			this.solution.selectedOption = 0;

		};

		this.back = function() {
			if (this.userSequence.length > 0) {
				step = this.userSequence.pop();
				this.selectWindow(step.currentWindow);
				this.solution.selectedOption = step.selectedOption;
				this.solution.selectedProperties = step.selectedProperties;
			}
		};

		this.selectWindow = function(index) {
			//	if(index = -1) document.location = "addOntology.html";
			for ( i = 0; i < wizard.length; i++) {
				if (wizard[i].id == index) {
					this.currentWindow = wizard[i];
					/*	if(wizard[i].type == "unique")
					 document.location = wizard[i].message; */
					break;
				}
			}
		};

		this.selectProperty = function(id, arr) {
			if (arr != null) {
				for ( i = 0; i < arr.length; i++) {
					if (arr[i].id == id)
						return arr[i];
				}
			}
			return "";
		};

	}]);

	app.directive('radioNomenclatorChooser', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-nomenclator-chooser.html'
		};
	});

	app.directive('radioDetailNomenclatorChooser', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-detail-nomenclator-chooser.html'
		};
	});

	app.directive('addOntology', function() {
		return {
			restrict : 'E',
			templateUrl : 'add-ontology.html'
		};
	});

	app.directive('selectedProperties', function() {
		return {
			restrict : 'E',
			templateUrl : 'selected-properties.html'
		};
	});

	app.directive('datatypePropertySelection', function() {
		return {
			restrict : 'E',
			templateUrl : 'datatype-property-selection.html'
		};
	});

	app.directive('radioBottomDetail', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-bottom-detail.html'
		};
	});

	app.directive('computedAttributes', function() {
		return {
			restrict : 'E',
			templateUrl : 'computed-attributes.html'
		};
	});

	app.directive('selectNomenclatorChooser', function() {
		return {
			restrict : 'E',
			templateUrl : 'select-nomenclator-chooser.html',
			controller : function() {

				this.status = {
					isopen : false
				};

				this.setOption = function(controller, key) {
					controller.solution.selectedOption = key;
					this.status.isopen = !this.status.isopen;
				};

				this.selectOption = function(key, arr) {
					if (arr != null) {
						for ( i = 0; i < arr.length; i++) {
							if (arr[i].key == key)
								return arr[i];
						}
					}
					return "";
				};

			},
			controllerAs : 'chooserCtrl'
		};
	});

	app.directive('selectNomenclatorChooserForPath', function() {
		return {
			restrict : 'E',
			templateUrl : 'select-nomenclator-chooser-for-path.html',
			controller : function() {

				this.status = [];

				this.computedAttr_name = "";

				this.setOption = function(controller, key, index) {
					controller.solution.selectedOptions[index] = key;
					this.status[index] = !this.status[index];
				};

				this.selectOption = function(key, arr) {
					if (arr != null) {
						for ( i = 0; i < arr.length; i++) {
							if (arr[i].key == key)
								return arr[i];
						}
					}
					return "";
				};

			},
			controllerAs : 'chooserCtrlPath'
		};
	});

	app.controller('WindowsController', ['$http',
	function($http) {
		this.ontology = "";
		var step = this;
		step.currentWindow = [];
		step.ontology = "";
		$http.get('../../config/windows.json').success(function(data) {
			step.currentWindow = data[0];
		});

		this.isEmpty = function(str) {
			return (!str || 0 === str.length);
		};
	}]);

	app.filter('range', function() {
		return function(input, total) {
			total = parseInt(total);
			for (var i = 0; i < total; i++)
				input.push(i);
			return input;
		};
	});

	app.filter('track', function() {
		
		count = 0;

		function properties(classFrom, rdf) {
			result = [];
			for (var i = 0; i < rdf.definition.length; i++) {
				property = rdf.definition[i];
				for (var j = 0; j < property.domain.length; j++) {
					if (property.domain[j] == classFrom)
						result.push(property);
				};
			};
			return result;
		};

		function track(classFrom, classTo, current, input, max, rdf) {
			if (max <= 0)
				return;
			var props = properties(classFrom, rdf);
			for (var i = 0; i < props.length; i++) {
				var prop = props[i];
				for (var j = 0; j < prop.range.length; j++) {
					_class = prop.range[j];
					current.push({"propertyName": prop.propertyName, "className": _class});
					if (_class == classTo) {
						//input.push(current.slice(0));
						groupby(input, current);
					}
					track(_class, classTo, current, input, max - 1, rdf);
					current.pop();
				}
			}
		};
		
		function isTheSamePath(input, current)
		{
			if(input.length != current.length)
				return false;
			for (var i=0; i < input.length; i++) {
			  if (input[i].className != current[i].className)
			  	return false;
			}
			return true;
		}
		
		function groupby(input, current) {
			for (var i=0; i < input.length; i++) {
			  if(isTheSamePath(input[i], current)){
			  	for (var j=0; j < input[i].length; j++) {
					if(input[i][j].propertiesNames.indexOf(current[j].propertyName) == -1)
						input[i][j].propertiesNames.push(current[j].propertyName);
					
				 }
				 return;
			  }
			}	
			input.push([]);		 
		  	for (var i=0; i < current.length; i++) {
				input[input.length-1].push({"propertiesNames": [current[i].propertyName], "className": current[i].className}); 
			}
		};

		return function(input, classFrom, classTo, rdf, isPath) {
			input = [];
			console.info('track ' + count++);
			if(!isPath)
				input.push("This is not a call of a path control");
			if (!rdf)
				input.push("rdf is undifined");
			if (!classFrom)
				input.push("classFrom is undifined");
			if (!classTo)
				input.push("classTo is undifined");
			if (input.length == 0) {
				console.info(classFrom);
				console.info(classTo);
				console.info(isPath);
				console.info('track ' + count);
				track(classFrom, classTo, [], input, 10, rdf);
			}
			return input;
		};

	});

})();
