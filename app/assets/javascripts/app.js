(function() {
	var app = angular.module('wizard', ['ui.bootstrap', 'checklist-model']);

	app.controller('WizardController', ['$http', 'modalService',
	function($http, modalService) {

		var me = this;

		me.wizard = [];
		me.currentWindow = [];
		me.solution = {};
		me.userSequence = [];
		me.solution.selectedOptions = [];
		me.computedAttr_name = "";
		me.seqNextNavegation = [];

		$http.get('/def/definition').success(function(data) {
			me.wizard = data;

			me.currentWindow = me.wizard.windows[4];

			me.solution = {
				selectedOption : 0,
				selectedProperties : [5, 0, 1],
				selectedOptions : [],
				mainClass : ""
			};

			me.userSequence = [];
			/* length = me.currentWindow.propertySets ? me.currentWindow.propertySets[me.solution.selectedOption].length : 0;
			 me.solution.selectedOptions = [length]; */

			for ( i = 0; i < 100; i++) {
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
				"object" : "Schwabe"
			}, {
				"subject" : "DocA",
				"predicate" : "madeIn",
				"object" : "China"
			}, {
				"subject" : "Event1",
				"predicate" : "organizer",
				"object" : "Tim Berners Lee"
			}, {
				"subject" : "Event1",
				"predicate" : "type",
				"object" : "Event"
			}, {
				"subject" : "Event2",
				"predicate" : "type",
				"object" : "Event"
			}, {
				"subject" : "DocA",
				"predicate" : "type",
				"object" : "Document"
			}, {
				"subject" : "DocC",
				"predicate" : "type",
				"object" : "Document"
			}, {
				"subject" : "Albert",
				"predicate" : "type",
				"object" : "Person"
			}, {
				"subject" : "John Doe",
				"predicate" : "type",
				"object" : "Person"
			}, {
				"subject" : "Schwabe",
				"predicate" : "type",
				"object" : "Person"
			}, {
				"subject" : "Tim Berners Lee",
				"predicate" : "type",
				"object" : "Person"
			}]
		};

		this.isType = function(val) {
			return this.currentWindow.type == val;
		};

		this.changeWindow = function() {
			this.afterExecControl();
			step = {
				currentWindow : this.currentWindow.id,
				//title: this.currentWindow.title, //debug
				selectedOption : this.solution.selectedOption,
				selectedProperties : this.solution.selectedProperties,
				selectedOptions : this.solution.selectedOptions
			};
			this.userSequence.push(step);

			nextValue = this.solution.selectedOption < this.currentWindow.options.length ? this.solution.selectedOption : 0;
			this.selectWindow(this.currentWindow.options[nextValue].next);
			this.solution.selectedOption = 0;
			this.beforeExecControl();

		};

		this.beforeExecControl = function() {
			if (this.isType('attributeForChoosing') || this.isType('attributeForChoosingForDetail')) {
				this.initSelectedOption(this.solution.selectedProperties[0], true);
				this.setModalParameterized(this.selectProperty(this.solution.selectedOption, this.wizard.data[this.currentWindow.example][0], true).name, true);
			} else if (this.isType('computedAttribute')) {
				this.computedAttr_name = "";
			} else if (this.isType('yesNoDetail')) {
				this.solution.selectedProperties = [];
				for (var i = 0; i < this.currentWindow.datatypeProperties.length; i++) {
					for (var j = 0; j < this.wizard.data[this.currentWindow.example][0].length; j++) {
						if (this.wizard.data[this.currentWindow.example][0][j].name == this.currentWindow.datatypeProperties[i])
							this.solution.selectedProperties.push(this.wizard.data[this.currentWindow.example][0][j].id);
					};
				};
			} else if (this.isType('paths')){
				this.beforeExecutePathsControl();
			}

		};
		
		this.beforeExecutePathsControl = function(){
			var relatedCollection = this.getRelatedCollectionName(this.userSequence[this.userSequence.length-1], this.isType('paths'));
			var paths = this.track(this.solution.mainClass,
						relatedCollection,
						this.example, this.isType('paths'));	
		    this.currentWindow.paths = [];	
		    this.currentWindow.options = [];	    
			for (var i=0; i < paths.length; i++) {
			  
			  var examples = this.get_path_examples(this.solution.mainClass, paths[i], this.isType('paths'));
			  this.currentWindow.paths.push({"key": i, "pathItems": paths[i], "examples": examples});
			  this.currentWindow.options.push({"key": i, "next": this.currentWindow.next});
			};		
			
			var nextWindow = this.getWindow(this.currentWindow.next); // to set the next window with the same examples
			nextWindow.paths = this.currentWindow.paths;
			nextWindow.options = [];
			for (var i=0; i < nextWindow.paths.length; i++) {
			  nextWindow.options.push({"key": i, "next": nextWindow.next});
			};
		}

		this.afterExecControl = function() {
			if (this.isType('computedAttribute')) {
				if (this.computedAttr_name != "")
					var temp = this.computedAttr_name;
				this.wizard.data[this.currentWindow.example].forEach(function(entry) {
					entry.push({
						"id" : entry.length,
						"name" : temp,
						"value" : ["Computed " + temp + " attribute"]
					});
				});
				this.solution.selectedProperties.push(this.wizard.data[this.currentWindow.example][0].length - 1);
			} else if (this.isType('loopDetail') || this.isType('loop')) {
				if (this.currentWindow.options[this.solution.selectedOption].text == "Yes") {
					if (this.seqNextNavegation.length == 0)
						this.seqNextNavegation.push(this.currentWindow.options[1].next);
					this.seqNextNavegation.push(this.currentWindow.id);
				} else if (this.seqNextNavegation.length > 0) {
					nextValue = this.solution.selectedOption < this.currentWindow.options.length ? this.solution.selectedOption : 0;
					this.currentWindow.options[nextValue].next = this.seqNextNavegation.pop();
				}
			} 
		};

		this.confirmDialog = function(title, msg) {

			var modalOptions = {
				closeButtonText : 'No',
				actionButtonText : 'Yes',
				headerText : title,
				bodyText : msg,
				/*  close: function (result) { //revisar para definir el no
				 console.log("close");
				 /*   	step = {
				 currentWindow: this.currentWindow.id,
				 //title: this.currentWindow.title, //debug
				 selectedOption: this.solution.selectedOption,
				 selectedProperties: this.solution.selectedProperties,
				 selectedOptions: this.solution.selectedOptions
				 };
				 this.userSequence.push(step);
				 this.selectWindow(this.currentWindow.cancelModalNext);
				 this.solution.selectedOption = 0;
				 }*/
			};

			modalService.showModal({}, modalOptions).then(function(result) {
				me.changeWindow();
			});
		};

		this.back = function() {
			if (this.userSequence.length > 0) {
				step = this.userSequence.pop();
				this.selectWindow(step.currentWindow);
				this.solution.selectedOption = step.selectedOption;
				this.solution.selectedProperties = step.selectedProperties;
			}
		};

		this.getWindow = function(id) {
			//	if(index = -1) document.location = "addOntology.html";
			for ( i = 0; i < this.wizard.windows.length; i++) {
				if (this.wizard.windows[i].id == id) {
					return this.wizard.windows[i]
				}
			}
		};

		this.selectWindow = function(id) {

			this.currentWindow = this.getWindow(id);
		};

		this.selectProperty = function(id, arr, canExec) {
			if (arr != null && canExec) {
				for ( i = 0; i < arr.length; i++) {
					if (arr[i].id == id)
						return arr[i];
				}
			}
			return "";
		};

		this.selectPropertyByName = function(name, arr, canExec) {
			if (arr != null && canExec) {
				for ( i = 0; i < arr.length; i++) {
					if (arr[i].name == name)
						return arr[i];
				}
			}
			return "";
		};

		this.getRelatedCollectionName = function(previousWindowInfo, canExec) {
			if (canExec) {
				if (previousWindowInfo) {
					//console.log(previousWindowInfo);
					collectionId = previousWindowInfo.selectedOption;
					previousWindowId = previousWindowInfo.currentWindow;
					return this.getWindow(previousWindowId).options[collectionId].text;
				}
			};
		};

		String.prototype.format = function() {
			var formatted = this;
			for (var i = 0; i < arguments.length; i++) {
				var regexp = new RegExp('\\{' + i + '\\}', 'gi');
				formatted = formatted.replace(regexp, arguments[i]);
			}
			return formatted;
		};

		this.setModalParameterized = function(parameter, isModal) {
			if (isModal) {
				this.currentWindow.modal = this.currentWindow.originalModal ? this.currentWindow.originalModal.format(parameter) : "";
			}
		};

		this.initSelectedOption = function(value, canInitialize) {
			if (canInitialize) {
				console.info(canInitialize);
				this.solution.selectedOption = value;
				console.info(value);
			}
		};

		this.hasResourceDetail = function() {
			return this.isType('yesNoDetail') || this.isType('loopDetail') || this.isType('checkboxForDetail') || this.isType('radioSelectedPropertiesForDetail');
		};

		this.hasSelectedProperty = function() {
			return this.isType('radioSelectedProperties') || this.isType('loop') || this.isType('selectedProperties') || this.isType('checkbox') || this.isType('computedAttribute');
		};

		this.hasDatatypePropertySelection = function() {
			return this.isType('checkbox') || this.isType('checkboxForDetail');
		};
		
		this.properties = function(classFrom, rdf) {
			var result = [];
			for (var i = 0; i < rdf.definition.length; i++) {
				property = rdf.definition[i];
				for (var j = 0; j < property.domain.length; j++) {
					if (property.domain[j] == classFrom)
						result.push(property);
				};
			};
			return result;
		};
		
		//----------------------------------------------------------
		
		this.trackAux = function(classFrom, classTo, current, input, max, rdf) {
			if (max <= 0)
				return;
			var props = this.properties(classFrom, rdf);
			for (var i = 0; i < props.length; i++) {
				var prop = props[i];
				for (var j = 0; j < prop.range.length; j++) {
					_class = prop.range[j];
					current.push({
						"propertyName" : prop.propertyName,
						"className" : _class
					});
					if (_class == classTo) {
						//input.push(current.slice(0));
						this.groupby(input, current);
					}
					this.trackAux(_class, classTo, current, input, max - 1, rdf);
					current.pop();
				}
			}
		};

		this.track = function(classFrom, classTo, rdf, isPath, selectedPath) {
			output = [];
			if (!isPath)
				output.push("This is not a call of a path control");
			if (!rdf)
				output.push("rdf is undefined");
			if (!classFrom)
				output.push("classFrom is undefined");
			if (!classTo)
				output.push("classTo is undefined");
			if(output.length == 0){
				this.trackAux(classFrom, classTo, [], output, 10, rdf);
			
				if (selectedPath || selectedPath == 0) {
					return output[selectedPath];
				}
			}
			return output;
		};

		
		this.isTheSamePath = function(input, current) {
			if (input.length != current.length)
				return false;
			for (var i = 0; i < input.length; i++) {
				if (input[i].className != current[i].className)
					return false;
			}
			return true;
		}

		this.groupby = function(input, current) {
			for (var i = 0; i < input.length; i++) {
				if (this.isTheSamePath(input[i], current)) {
					for (var j = 0; j < input[i].length; j++) {
						if (input[i][j].propertiesNames.indexOf(current[j].propertyName) == -1)
							input[i][j].propertiesNames.push(current[j].propertyName);

					}
					return;
				}
			}
			input.push([]);
			for (var i = 0; i < current.length; i++) {
				input[input.length - 1].push({
					"propertiesNames" : [current[i].propertyName],
					"className" : current[i].className
				});
			}
		};
		
		//---------------------------------------------------------
		
		this.get_path_examples = function(initialClass, path, isCallFromValidControl) {
					
			var result = [];
			var initialInstances = [];
			if (!isCallFromValidControl)
				result.push("This is not a call of a path control");
			else{
				initialInstances = this.get_instances_of_class(initialClass, this.example.triples);
	
				for (var i = 0; i < initialInstances.length; i++) {
					var rest_examples = this.get_rest_of_path_examples(initialInstances[i], path, 0, this.example.triples);
					for (var j = 0; j < rest_examples.length; j++) {
						result.push(initialInstances[i] + " - " + rest_examples[j]);
					};
				};
			};

			return result;

		}

		this.get_rest_of_path_examples = function(subject, path, pos, triples) {

			var result = [];

			for (var i = 0; i < path[pos].propertiesNames.length; i++) {
				var prop = path[pos].propertiesNames[i];
				var objects = this.get_objects_from(subject, prop, triples);
				if (pos == path.length - 1) {
					var insts = this.get_instances_of_class(path[path.length - 1].className, triples);

					for (var j = 0; j < objects.length; j++) {
						var obj = objects[j];
						if (insts.indexOf(obj) > -1)
							result.push(prop + " - " + obj);
					};
				} else {
					for (var i = 0; i < objects.length; i++) {
						var obj = objects[i];
						rest_examples = this.get_rest_of_path_examples(obj, path, pos + 1, triples);
						for (var j = 0; j < rest_examples.length; j++) {
							var temp = prop + ":" + rest_examples[j];
							if (temp.split(':').length == path.length - pos)
								result.push(temp);
						};
					};
				}
			}

			return result;
		}

		this.get_instances_of_class = function(className, triples) {
			var result = [];
			for (var i = 0; i < triples.length; i++) {
				if (triples[i].predicate == "type" && triples[i].object == className)
					result.push(triples[i].subject);
			};
			return result;
		}

		this.get_objects_from = function(subject, prop, triples) {
			var result = [];
			for (var i = 0; i < triples.length; i++) {
				if (triples[i].subject == subject && triples[i].predicate == prop)
					result.push(triples[i].object);
			};
			return result;
		}

	}]);

	app.directive('radioNomenclatorChooser', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-nomenclator-chooser.html'
		};
	});

	app.directive('infoDependingOnSelectedOption', function() {
		return {
			restrict : 'E',
			templateUrl : 'info-depending-on-selected-option.html'
		};
	});

	app.directive('infoToShow', function() {
		return {
			restrict : 'E',
			templateUrl : 'info-to-show.html'
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
			templateUrl : 'computed-attributes.html',
			controller : function() {

				this.computedAttr_name = "";
			},
			controllerAs : 'computedCtrl'
		};
	});

	app.directive('radioAttributeForChoosing', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-attribute-for-choosing.html'
		};
	});

	app.directive('resourceDetail', function() {
		return {
			restrict : 'E',
			templateUrl : 'resource-detail.html'
		};
	});

	app.directive('questionOptions', function() {
		return {
			restrict : 'E',
			templateUrl : 'question-options.html'
		};
	});

	app.directive('radioAttributeForChoosingDetail', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-attribute-for-choosing-detail.html'
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

				this.setOption = function(controller, key, index) {
					controller.solution.selectedOptions[index] = key;
					//console.log(this.status[index]);
					this.status[index] = !this.status[index];
					//console.log(this.status[index]);
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

	/* app.controller('WindowsController', ['$http', function($http){
	 this.ontology = "";
	 var step = this;
	 step.currentWindow = [];
	 step.ontology = "";
	 $http.get('../../config/windows.json').success(function(data){
	 step.currentWindow = data[0];
	 });

	 this.isEmpty = function(str){
	 return (!str || 0 === str.length);
	 };
	 }]); */

	app.filter('range', function() {
		return function(input, total) {
			total = parseInt(total);
			for (var i = 0; i < total; i++)
				input.push(i);
			return input;
		};
	});

	app.service('modalService', ['$modal',
	function($modal) {

		var modalDefaults = {
			backdrop : true,
			keyboard : true,
			modalFade : true,
			templateUrl : '/modal'
		};

		var modalOptions = {
			closeButtonText : 'Close',
			actionButtonText : 'OK',
			headerText : 'Proceed?',
			bodyText : 'Perform this action?'
		};

		this.showModal = function(customModalDefaults, customModalOptions) {
			if (!customModalDefaults)
				customModalDefaults = {};
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions);
		};

		this.show = function(customModalDefaults, customModalOptions) {
			//Create temp objects to work with since we're in a singleton service
			var tempModalDefaults = {};
			var tempModalOptions = {};

			//Map angular-ui modal custom defaults to modal defaults defined in service
			angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

			//Map modal.html $scope custom properties to defaults defined in service
			angular.extend(tempModalOptions, modalOptions, customModalOptions);

			if (!tempModalDefaults.controller) {
				tempModalDefaults.controller = function($scope, $modalInstance) {
					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.ok = function(result) {
						$modalInstance.close(result);
					};
					$scope.modalOptions.close = function(result) {
						$modalInstance.dismiss('cancel');
					};
				};
			}

			return $modal.open(tempModalDefaults).result;
		};

	}]);

	// app.filter('track', function() {
// 
		// function properties(classFrom, rdf) {
			// result = [];
			// for (var i = 0; i < rdf.definition.length; i++) {
				// property = rdf.definition[i];
				// for (var j = 0; j < property.domain.length; j++) {
					// if (property.domain[j] == classFrom)
						// result.push(property);
				// };
			// };
			// return result;
		// };
// 
		// function track(classFrom, classTo, current, input, max, rdf) {
			// if (max <= 0)
				// return;
			// var props = properties(classFrom, rdf);
			// for (var i = 0; i < props.length; i++) {
				// var prop = props[i];
				// for (var j = 0; j < prop.range.length; j++) {
					// _class = prop.range[j];
					// current.push({
						// "propertyName" : prop.propertyName,
						// "className" : _class
					// });
					// if (_class == classTo) {
						// //input.push(current.slice(0));
						// groupby(input, current);
					// }
					// track(_class, classTo, current, input, max - 1, rdf);
					// current.pop();
				// }
			// }
		// };
// 
		// function isTheSamePath(input, current) {
			// if (input.length != current.length)
				// return false;
			// for (var i = 0; i < input.length; i++) {
				// if (input[i].className != current[i].className)
					// return false;
			// }
			// return true;
		// }
// 
		// function groupby(input, current) {
			// for (var i = 0; i < input.length; i++) {
				// if (isTheSamePath(input[i], current)) {
					// for (var j = 0; j < input[i].length; j++) {
						// if (input[i][j].propertiesNames.indexOf(current[j].propertyName) == -1)
							// input[i][j].propertiesNames.push(current[j].propertyName);
// 
					// }
					// return;
				// }
			// }
			// input.push([]);
			// for (var i = 0; i < current.length; i++) {
				// input[input.length - 1].push({
					// "propertiesNames" : [current[i].propertyName],
					// "className" : current[i].className
				// });
			// }
		// };
// 
		// return function(input, classFrom, classTo, rdf, isPath, selectedPath) {
			// output = [];
			// if (!isPath)
				// output.push("This is not a call of a path control");
			// if (!rdf)
				// output.push("rdf is undefined");
			// if (!classFrom)
				// output.push("classFrom is undefined");
			// if (!classTo)
				// output.push("classTo is undefined");
			// if (input.length == 0) {
				// track(classFrom, classTo, [], output, 10, rdf);
			// }
			// if (selectedPath || selectedPath == 0) {
				// return output[selectedPath];
			// }
			// return output;
		// };
// 
		// //--------------------------------------------------------------
// 
	// });

})();
