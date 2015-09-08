(function() {
	var app = angular.module('wizard', ['ui.bootstrap', 'checklist-model', 'angularTreeview']);

	app.factory('Data', function() {

		var data = {
			tree : [],
			currentNode : ''
		};

		return {
			getTree : function() {
				return data.tree;
			},
			setTree : function(tree) {
				data.tree = tree;
			},
			getCurrentNode : function() {
				return data.currentNode;
			},
			setCurrentNode : function(currentNode) {
				data.currentNode = currentNode;
			},
			getData : function() {
				return data;
			}
		};
	});

	app.controller('WizardController', ['$http', 'modalService', '$scope', 'Data',
	function($http, modalService, $scope, Data) {

		var me = this;

		me.wizard = [];
		me.currentWindow = [];
		me.solution = {};
		me.userSequence = [];
		me.solution.selectedOptions = [];
		me.computedAttr_name = "";
		me.seqNextNavegation = [];
		me.scope = {
			"data" : [],
			"examples" : []
		};

		me.id = 0;
		me.treeSequence = t;
		me.currentArtNode = me.treeSequence.addChildNode(me.treeSequence, "New Landmark", null, "Art");
		me.previousNode = me.treeSequence;

		me.Data = Data.getData();
		$scope.me = me;

		$http.get('/def/definition_auction').success(function(data) {
		//	$http.get('generate/http%3A%2F%2Fwww.semanticweb.org%2Fmilena%2Fontologies%2F2013%2F6%2Fauction').success(function(data) {
			me.wizard = data;

			me.currentWindow = me.wizard.windows[0];

			me.solution = {
				selectedOption : 0,
				selectedProperties : [],
				selectedOptions : [0, 0, 0, 0, 0, 0],
				mainclass : "it is not used"
			};

			me.userSequence = [];
			/* length = me.currentWindow.propertySets ? me.currentWindow.propertySets[me.solution.selectedOption].length : 0;
			 me.solution.selectedOptions = [length]; */

		});

		

		this.isType = function(val) {
			return this.currentWindow.type == val;
		};

		this.saveCurrentValues = function() {

			step = {
				currentWindow : this.currentWindow.id,
				selectedOption : this.solution.selectedOption,
				selectedProperties : this.solution.selectedProperties.slice(),
				selectedOptions : this.solution.selectedOptions.slice(),
				scope : JSON.parse(JSON.stringify(this.scope))
			};
			
			if(this.currentWindow.value != undefined){
				step.value = this.currentWindow.value;
				//this.value = undefined;
			}
			
			this.scope.back = undefined;

			this.userSequence.push(step);

			return step;

		};

		this.resetCurrentValue = function() {
			this.solution.selectedOptions = [];
			this.solution.selectedProperties = [];
			this.solution.selectedOption = 0;
		};

		this.setCurrentValue = function(step) {
			this.solution.selectedOption = step.selectedOption;
			this.solution.selectedProperties = step.selectedProperties;
			this.solution.selectedOptions = step.selectedOptions;
			this.scope = step.scope;
			this.value = step.value;
		};

		this.changeWindow = function() {
			this.afterExecControl();

			if (this.currentWindow.scope != undefined && this.solution.selectedProperties.length > 0)
				this.scope.data = this.scope.data.concat(this.solution.selectedProperties);

			step = this.saveCurrentValues();

			nextValue = this.solution.selectedOption < this.currentWindow.options.length ? this.solution.selectedOption : 0;
			idNextWindow = this.currentWindow.options[nextValue].next;

			if (this.currentWindow.options[nextValue].child == "Landmark") {
				this.treeSequence.addChildNode(this.currentArtNode, "", step, "Normal");
				this.currentArtNode = this.treeSequence.addChildNode(me.treeSequence, "New Landmark", null, "Art");
				this.previousNode = this.treeSequence;
			} else
				this.previousNode = this.treeSequence.addChildNode(this.currentArtNode, "", step, "Normal");

			if (this.currentWindow.options[nextValue].child == "Yes")
				this.currentArtNode = this.treeSequence.addChildNode(this.previousNode, "Relation", null, "Art");

			updated = false;

			if (this.currentWindow.options[nextValue].child == "End") {
				if (this.treeSequence.getParent(this.currentArtNode).id != undefined) {
					this.previousNode = this.treeSequence.getParent(this.currentArtNode);
					this.currentArtNode = this.treeSequence.getParent(this.previousNode);
					idNextWindow = this.previousNode.data.currentWindow;
					step = this.previousNode.data;
					this.setCurrentValue(step);
					updated = true;
				}
			}

			if (this.currentWindow.scope == "new") {
				text = JSON.stringify(this.wizard.data[this.currentWindow.example]);
				me.scope = JSON.parse(JSON.stringify(this.currentWindow.scope_value));
				me.scope.examples = JSON.parse(text);
			}

			this.selectWindow(idNextWindow);
			if (!updated) {
				this.resetCurrentValue();
			}
			this.beforeExecControl();

			tree = this.getArtTreeSequence(this.currentArtNode);
			me.Data.tree.length = 0;
			for ( i = 0; i < tree.children.length; i++) {
				me.Data.tree.push(tree.children[i]);
			}
			me.pull = true;
			me.Data.currentNode.currentNode = tree.selectedNode;

		};

		this.back = function() {
			if (this.userSequence.length > 0) {
				this.userSequence.pop();

				if (this.currentArtNode.children == null || this.currentArtNode.children.length == 0) {
					parent = this.treeSequence.getParent(this.currentArtNode);
					this.currentArtNode = this.treeSequence.getParent(parent);
				}

				step = this.previousNode.data;
				nodeToCut = this.previousNode;
				this.previousNode = this.treeSequence.getPreviousNode(this.previousNode);
				this.treeSequence.deleteNode(nodeToCut);

				this.selectWindow(step.currentWindow);
				this.setCurrentValue(step);
				if(this.scope.back != undefined){
					this.scope = JSON.parse(this.scope.back);
				}
			}

			tree = this.getArtTreeSequence(this.currentArtNode);
			me.Data.tree.length = 0;
			for ( i = 0; i < tree.children.length; i++) {
				me.Data.tree.push(tree.children[i]);
			}
			me.pull = true;
			me.Data.currentNode.currentNode = tree.selectedNode;
		};

		$scope.$watch('me.Data.currentNode.currentNode', function(newValue, oldValue) {
			if (newValue != undefined && newValue.id != undefined && oldValue != undefined && newValue.id != oldValue.id) {
				if (!me.pull)
					me.go_to_step(newValue.id);
			}
			me.pull = false;
		});

		this.go_to_step = function(nodeId) {

			//save current values
			step = this.saveCurrentValues();
			this.treeSequence.addChildNode(this.currentArtNode, "", step, "Normal");

			//restore values

			node = this.treeSequence.findNode(nodeId);
			if (node.type != "Art")
				node = this.treeSequence.getParent(node);

			if (node.children == undefined || node.children.length == 0)
				return;
			node = node.children[node.children.length - 1];

			step = node.data;

			this.previousNode = this.treeSequence.getPreviousNode(node);
			this.currentArtNode = this.treeSequence.getParent(node);
			this.selectWindow(node.data.currentWindow);
			this.treeSequence.deleteNode(node);

			this.setCurrentValue(step);

			tree = this.getArtTreeSequence(this.currentArtNode);
			me.Data.tree.length = 0;
			for ( i = 0; i < tree.children.length; i++) {
				me.Data.tree.push(tree.children[i]);
			}
			me.Data.currentNode.currentNode = tree.selectedNode;
		};

		this.beforeExecControl = function() {

			if (this.isType('attributeForChoosing') || this.isType('attributeForChoosingForDetail')) {
				this.initSelectedOption(this.scope.data[0], true);
				//this.setModalParameterized(this.selectProperty(this.solution.selectedOption, this.wizard.data[this.currentWindow.example][0], true).name, true);
			} else if (this.isType('computedAttribute')) {
				this.computedAttr_name = "";
			} else if (this.isType('yesNoDetail')) {
				/*
				 this.solution.selectedProperties = [];
				 for (var i = 0; i < this.currentWindow.datatypeProperties.length; i++) {
				 for (var j = 0; j < this.wizard.data[this.currentWindow.example][0].length; j++) {
				 if (this.wizard.data[this.currentWindow.example][0][j].name == this.currentWindow.datatypeProperties[i])
				 this.solution.selectedProperties.push(this.wizard.data[this.currentWindow.example][0][j].id);
				 };
				 };
				 */
			} else if (this.isType('paths')) {
				this.beforeExecutePathsControl();
			} else if (this.isType('path')) {
				this.userSequence[this.userSequence.length - 1]['path'] = this.currentWindow.paths;
				option = this.userSequence[this.userSequence.length - 1].selectedOption;
				this.solution.selectedOptions = Array.apply(null, Array(this.currentWindow.paths[option].pathItems.length)).map(Number.prototype.valueOf,0);
			} else if (this.isType('hidden')) {
				this.beforeExecuteHiddenControl();
			} else if (this.isType('hiddenInitPath')) {
				this.beforeExecuteHiddenInitPathControl();
			} else if (this.isType('selectNode')) {
				options = [];
				this.getPlainTree(this.treeSequence, options, '0.0.0.0.0');
				this.currentWindow.options = options;
			}

		};
		
		this.beforeExecuteHiddenControl = function() {
			previous_step = this.userSequence[this.userSequence.length - 3];
			_class = this.getWindow(previous_step.currentWindow).options[previous_step.selectedOption].text;
			current_options = this.currentWindow.options;
			for (var i = 0; i < current_options.length; i++) {
				if (current_options[i].text == _class) {
					this.selectWindow(current_options[i].next);
					return;
				}
			}
		};

		this.beforeExecuteHiddenInitPathControl = function() {
			previous_step = this.userSequence[this.userSequence.length - 1];
			scope = previous_step.scope;
			if(scope.type[previous_step.selectedOption] == "ComputedAttribute"){
				_class = "Default";
			}else{ //Path
				path = scope.queries[previous_step.selectedOption].path;
				_class = path[path.length - 1].className;
			}
			current_options = this.currentWindow.options;
			for (var i = 0; i < current_options.length; i++) {
				if (current_options[i].text == _class) {
					this.selectWindow(current_options[i].next);
					return;
				}
			}
		};

		this.invertPath = function(start, path, canExec) {
			temp = [];
			if (canExec) {
				for ( i = 0; i < path.length; i++) {
					temp[i] = {
						"propertiesNames" : path[i].propertiesNames,
						"className" : path[i].className
					};
				}

				temp.reverse();
				for (var i = 0; i < temp.length - 1; i++) {
					temp[i].className = temp[i + 1].className;
				};
				temp[temp.length - 1].className = start;
			}
			return temp;
		};

		this.beforeExecutePathsControl = function() {
			var relatedCollection = this.getRelatedCollectionName(this.userSequence[this.userSequence.length - 1], this.isType('paths'));
			var mainclass = this.getWindow(this.userSequence[this.userSequence.length - 1].currentWindow).mainclass;
			var paths = this.track(mainclass, relatedCollection, this.wizard.example, this.isType('paths'));
			this.currentWindow.mainclass = mainclass;
			this.currentWindow.paths = [];
			this.currentWindow.options = [];
			for (var i = 0; i < paths.length; i++) {

				path = paths[i];
				reverse = false;

				var examples = this.get_path_examples(mainclass, path, this.isType('paths'));
				if (examples.length == 0) {
					invertedPath = this.invertPath(mainclass, path, this.isType('paths'));
					reverse = true;
					cn = path[path.length - 1].className;
					examples = this.get_path_examples(cn, invertedPath, this.isType('paths'));
				}

				this.currentWindow.paths.push({
					"key" : i,
					"pathItems" : paths[i],
					"examples" : examples,
					"reverse" : reverse
				});
				this.currentWindow.options.push({
					"key" : i,
					"next" : this.currentWindow.next
				});
			}

			var nextWindow = this.getWindow(this.currentWindow.next);
			// to set the next window with the same examples
			nextWindow.mainclass = mainclass;
			nextWindow.paths = this.currentWindow.paths;
			nextWindow.options = [];
			for (var i = 0; i < nextWindow.paths.length; i++) {
				nextWindow.options.push({
					"key" : i,
					"next" : nextWindow.next
				});
			}

			for ( i = 0; i < paths.length; i++) {
				this.solution.selectedOptions[i] = 0;
			}

		};

		this.afterExecControl = function() {
			if (this.isType('computedAttribute')) {
				this.scope.back = JSON.stringify(this.scope);
				var temp = this.computedAttr_name;
				this.scope.examples.forEach(function(entry) {
					entry.push({
						"id" : entry.length,
						"name" : temp,
						"value" : ["Computed " + temp + " attribute"]
					});
				});

				this.scope.data.push(this.scope.examples[0].length - 1);
				this.scope.type.push("ComputedAttribute");
				this.scope.names.push(temp);
				this.scope.queries.push(this.computedAttr_query);
			}

			if (this.isType('nodeName')) {
				this.currentArtNode.label = this.currentWindow.value;
			}

			if (this.isType('path')) {
				this.scope.back = JSON.stringify(this.scope);
				
				var paths = this.currentWindow.paths;
				var path = paths[this.solution.selectedOption];
				var items = path.pathItems;
				var className = items[items.length - 1].className;
				if(this.scope.show != 'none'){
					this.scope.examples.forEach(function(entry) {
						entry.push({
							"id" : entry.length,
							"name" : className,
							"value" : ["Path to " + className]
						});
					});
				}
				
				this.scope.data.push(this.scope.names.length);
				this.scope.type.push("Path");
				this.scope.names.push(className);
				this.scope.queries.push({
					"path" : items,
					"properties" : this.solution.selectedOptions,
					"mainclass" : this.currentWindow.mainclass,
					"reverse" : path.reverse
				});
			}
		};

		this.confirmDialog = function(title, msg) {

			var modalOptions = {
				closeButtonText : 'No',
				actionButtonText : 'Yes',
				headerText : title,
				bodyText : msg,
			};

			modalService.showModal({}, modalOptions).then(function(result) {
				me.changeWindow();
			});
		};

		this.getWindow = function(id) {
			//	if(index = -1) document.location = "addOntology.html";
			for ( i = 0; i < this.wizard.windows.length; i++) {
				if (this.wizard.windows[i].id == id) {
					return this.wizard.windows[i];
				}
			}
		};

		this.selectWindow = function(id) {
			this.currentWindow = JSON.parse(JSON.stringify(this.getWindow(id)));
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
			if (output.length == 0) {
				this.trackAux(classFrom, classTo, [], output, 4, rdf);
				l = output.length;
				this.trackAux(classTo, classFrom, [], output, 4, rdf);
				for ( i = l; i < output.length; i++) {
					temp = output[i].reverse();
					name = classTo;
					for (var j = temp.length - 1; j >= 0; j--) {
						t = temp[j].className;
						temp[j].className = name;
						name = t;
					};
					output[i] = temp;
				};

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
		};

		this.groupby = function(input, current, s) {
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
			else {
				initialInstances = this.get_instances_of_class(initialClass);

				for (var i = 0; i < initialInstances.length; i++) {
					var rest_examples = this.get_rest_of_path_examples(initialInstances[i], path, 0);
					for (var j = 0; j < rest_examples.length; j++) {
						result.push(initialInstances[i] + " - " + rest_examples[j]);
					};
				}
			}

			return result;
		};

		this.get_rest_of_path_examples = function(subject, path, pos) {

			var result = [];

			for (var i = 0; i < path[pos].propertiesNames.length; i++) {
				var prop = path[pos].propertiesNames[i];
				var objects = this.get_objects_from(subject, prop);
				if (pos == path.length - 1) {
					var insts = this.get_instances_of_class(path[path.length - 1].className);

					for (var j = 0; j < objects.length; j++) {
						var obj = objects[j];
						if (insts.indexOf(obj) > -1)
							result.push(prop + " - " + obj);
					};
				} else {
					for (var k = 0; k < objects.length; k++) {
						var obj = objects[k];
						rest_examples = this.get_rest_of_path_examples(obj, path, pos + 1);
						for (var j = 0; j < rest_examples.length; j++) {
							var temp = prop + ":" + rest_examples[j];
							if (temp.split(':').length == path.length - pos)
								result.push(temp);
						}
					}
				}
			}

			return result;
		};

		this.get_instances_of_class = function(className) {
			var result = [];
			triples = this.wizard.example.triples;
			for (var i = 0; i < triples.length; i++) {
				if (triples[i].predicate == "type" && triples[i].object == className)
					result.push(triples[i].subject);
			}
			return result;
		};

		this.get_objects_from = function(subject, prop) {
			var result = [];
			triples = this.wizard.example.triples;
			for (var i = 0; i < triples.length; i++) {
				if (triples[i].subject == subject && triples[i].predicate == prop)
					result.push(triples[i].object);
			}
			return result;
		};

		this.getArtTreeSequence = function(selected) {
			node = {
				"id" : this.treeSequence.id,
				"label" : this.treeSequence.label,
				"children" : [],
				"selectedNode" : null
			};
			info = {
				"selected" : selected,
				"resultSelected" : null
			};

			this.getArtTreeSequenceAux(node, this.treeSequence, info);
			node.selectedNode = info.resultSelected;

			return node;
		};

		this.getArtTreeSequenceAux = function(parent, current, info) {
			var node;
			if (current.type == "Art") {
				node = {
					"id" : current.id,
					"label" : current.label,
					"children" : []
				};
				if (info.selected == current) {
					node.selected = 'selected';
					info.resultSelected = node;
				}
				parent.children.push(node);
			} else {
				node = parent;
			}

			if (current.children != undefined) {
				for (var i = 0; i < current.children.length; i++) {
					this.getArtTreeSequenceAux(node, current.children[i], info);
				};
			}
		};

		this.getPlainTree = function(current, info, next) {
			if (current.type == "Art") {
				node = {
					"key" : info.length,
					"text" : current.label,
					"next": next
				};
				
				info.push(node);
			}

			if (current.children != undefined) {
				for (var i = 0; i < current.children.length; i++) {
					this.getPlainTree(current.children[i], info, next);
				};
			}
		};
	}]);

	app.controller('treeController', function($scope, Data) {

		$scope.tree = [];
		$scope.currentNode = {
			currentNode : null
		};

		$scope.$watch('tree', function(newValue, oldValue) {
			if (newValue !== oldValue)
				Data.setTree(newValue);
		});

		$scope.$watch('currentNode', function(newValue, oldValue) {
			if (newValue !== oldValue) {
				Data.setCurrentNode(newValue);
				//$scope.$emit('changedNodeSelected', newValue);
			}
		});

		Data.setTree($scope.tree);
		Data.setCurrentNode($scope.currentNode);

	});

	app.directive('radioNomenclatorChooser', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-nomenclator-chooser.html'
		};
	});

	app.directive('nodeName', function() {
		return {
			restrict : 'E',
			templateUrl : 'node-name.html'
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

	app.directive('showScope', function() {
		return {
			restrict : 'E',
			templateUrl : 'show-scope.html'
		};
	});

	// app.directive('showScopeDetail', function() {
	// return {
	// restrict : 'E',
	// templateUrl : 'show-scope-detail.html'
	// };
	// });

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

	// app.directive('radioAttributeForChoosingDetail', function() {
	// return {
	// restrict : 'E',
	// templateUrl : 'radio-attribute-for-choosing-detail.html'
	// };
	// });

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
})();
