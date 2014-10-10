(function() {
  var app = angular.module('wizard', ['ui.bootstrap', 'checklist-model']);
    
  app.controller('WizardController', ['$http', 'modalService', function($http, modalService){
  
  	var me = this;
  
    me.wizard = [];
    me.currentWindow = [];
    me.solution = {};
    me.userSequence = [];
    me.solution.selectedOptions =[];
    me.computedAttr_name = "";
  
  	$http.get('/def/definition').success(function(data){
  		me.wizard = data;
  		
  		me.currentWindow = me.wizard.windows[0];
    
	    me.solution = { 
	    					selectedOption: 0,
	    					selectedProperties: [5, 0, 1],
	    					selectedOptions: [],
	    					mainClass: "" 
	    				}; 
	    
	    me.userSequence = [];
	   /* length = me.currentWindow.propertySets ? me.currentWindow.propertySets[me.solution.selectedOption].length : 0;
	    me.solution.selectedOptions = [length]; */
	    
	    for( i = 0; i < 100; i++)
	    {
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
  	
    this.isType = function(val){
    	return this.currentWindow.type == val;
    };
    
    this.changeWindow = function(){
    	this.afterExecControl();
    	step = {
    		currentWindow: this.currentWindow.id,
    		//title: this.currentWindow.title, //debug
    		selectedOption: this.solution.selectedOption,
    		selectedProperties: this.solution.selectedProperties,
    		selectedOptions: this.solution.selectedOptions
    	};
    	this.userSequence.push(step);
    	this.selectWindow(this.currentWindow.options[this.solution.selectedOption].next);
    	this.solution.selectedOption = 0;
    	this.beforeExecControl();
    	
    };
    
    this.beforeExecControl = function(){
    	if(this.isType('attributeForChoosing')){
    		this.initSelectedOption(this.solution.selectedProperties[0], true); 
    		this.setModalParameterized(this.selectProperty(this.solution.selectedOption, this.wizard.data.items[0]).name, true);
    	}else if(this.isType('computedAttribute')){
    		this.computedAttr_name = "";
    	}else if(this.isType('yesNoDetail')){
    		this.solution.selectedProperties = [];
    		for (var i=0; i < this.currentWindow.datatypeProperties.length; i++) {
			  this.currentWindow.datatypeProperties[i];
			  for (var j=0; j < this.wizard.data.items[0].length; j++) {
				if(this.wizard.data.items[0][j].name == this.currentWindow.datatypeProperties[i])
					this.solution.selectedProperties.push(this.wizard.data.items[0][j].id);
			  };
			};
    	}
    	
    };
    
    this.afterExecControl = function(){
    	if(this.isType('computedAttribute')){
    		if(this.computedAttr_name != "")
    			var temp = this.computedAttr_name;
				this.wizard.data.items.forEach(function(entry) {
					entry.push({
						"id": entry.length,
						"name": temp,
						"value": ["Computed " + temp + " attribute"]
						});
					});
				  this.solution.selectedProperties.push(this.wizard.data.items[0].length-1); 
    	}
    };
           
    this.confirmDialog = function(title, msg){
        
        var modalOptions = {
            closeButtonText: 'No',
            actionButtonText: 'Yes',
            headerText: title,
            bodyText: msg
          /*  close: function (result) { //revisar para definir el no
           
			        	step = {
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

        modalService.showModal({}, modalOptions).then(function (result) {
            me.changeWindow();
        });
    };
    
    this.back = function(){
    	if(this.userSequence.length > 0){
    		step = this.userSequence.pop();
    		this.selectWindow(step.currentWindow);
    		this.solution.selectedOption = step.selectedOption;
    		this.solution.selectedProperties = step.selectedProperties;
    	}
    };
    
    
    this.selectWindow = function(index){
    //	if(index = -1) document.location = "addOntology.html";
    	for (i = 0; i < this.wizard.windows.length; i++) {
		    if(this.wizard.windows[i].id == index){	
		    	this.currentWindow = this.wizard.windows[i];
		    /*	if(wizard[i].type == "unique")	 
		    		document.location = wizard[i].message; */
		    	break;
		    }
		}
    };  
		
	this.selectProperty = function(id, arr) {
		if(arr != null){
			for ( i = 0; i < arr.length; i++) {
				if (arr[i].id == id)
					return arr[i];
			}
		}
		return "";
	};
	
	this.getRelatedCollectionName = function(previousWindowInfo) {
		if(previousWindowInfo){
			//console.log(previousWindowInfo);
			collectionId = previousWindowInfo.selectedOption;
			previousWindowId = previousWindowInfo.currentWindow;
			
			return this.wizard.windows[previousWindowId-1].options[collectionId].text;
		}
	};
	
	String.prototype.format = function() {
	    var formatted = this;
	    for (var i = 0; i < arguments.length; i++) {
	        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
	        formatted = formatted.replace(regexp, arguments[i]);
	    }
	    return formatted;
	};
	
	this.setModalParameterized = function(parameter, isModal) {
		if(isModal){
			this.currentWindow.modal = this.currentWindow.originalModal ? 
										this.currentWindow.originalModal.format(parameter) : "";
		}
	};
	
	this.initSelectedOption = function(value, canInitialize) {
		if(canInitialize){
			console.info(canInitialize);
			this.solution.selectedOption = value;
			console.info(value);
		}
	};
    
  }]);

  app.directive('radioNomenclatorChooser', function(){
	return {
		restrict: 'E',
		templateUrl: 'radio-nomenclator-chooser.html'
	};
  });
  
  app.directive('radioDetailNomenclatorChooser', function(){
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'radio-detail-nomenclator-chooser.html'
	};
  });
  
  app.directive('addOntology', function(){
	return {
		restrict: 'E',
		templateUrl: 'add-ontology.html'
	};
  });
  
  app.directive('selectedProperties', function(){
	return {
		restrict: 'E',
		templateUrl: 'selected-properties.html'
	};
  });
  
  app.directive('datatypePropertySelection', function(){
	return {
		restrict: 'E',
		templateUrl: 'datatype-property-selection.html'
	};
  });
  
  app.directive('radioBottomDetail', function(){
	return {
		restrict: 'E',
		templateUrl: 'radio-bottom-detail.html'
	};
  });
  
  app.directive('computedAttributes', function(){
	return {
		restrict: 'E',
		templateUrl: 'computed-attributes.html',
		controller: function(){
			
			this.computedAttr_name = "";
		},
		controllerAs: 'computedCtrl'
  	};
  });
  
   app.directive('radioAttributeForChoosing', function(){
	return {
		restrict: 'E',
		templateUrl: 'radio-attribute-for-choosing.html'
	};
  });
  
  app.directive('resourceDetail', function(){
	return {
		restrict: 'E',
		templateUrl: 'resource-detail.html'
	};
  });
  
  app.directive('questionOptions', function(){
	return {
		restrict: 'E',
		templateUrl: 'question-options.html'
	};
  });  
  
  app.directive('selectNomenclatorChooser', function(){
	return {
		restrict: 'E',
		templateUrl: 'select-nomenclator-chooser.html',
		controller: function(){
			
			this.status = {
				isopen : false
			};
			
			this.setOption = function(controller, key){
		    	controller.solution.selectedOption = key;
		    	this.status.isopen = !this.status.isopen;
    		};
    		
    		this.selectOption = function(key, arr) {
    			if(arr != null){
					for ( i = 0; i < arr.length; i++) {
						if (arr[i].key == key)
							return arr[i];
					}
				}
				return "";
		};

		},
		controllerAs: 'chooserCtrl'
	};
  });
  
  app.directive('selectNomenclatorChooserForPath', function(){
	return {
		restrict: 'E',
		templateUrl: 'select-nomenclator-chooser-for-path.html',
		controller: function(){
			
			this.status = [];
			
			this.setOption = function(controller, key, index){
		    	controller.solution.selectedOptions[index] = key;
		    	//console.log(this.status[index]);
		    	this.status[index] = !this.status[index];
		    	//console.log(this.status[index]);
    		};
    		
    		this.selectOption = function(key, arr) {
    			if(arr != null){
					for ( i = 0; i < arr.length; i++) {
						if (arr[i].key == key)
							return arr[i];
					}
				}
				return "";
			};

		},
		controllerAs: 'chooserCtrlPath'
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
  
  app.service('modalService', ['$modal', function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '/modal'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                };
            }

            return $modal.open(tempModalDefaults).result;
        };

    }]);

	app.filter('track', function() {
	
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

		return function(input, classFrom, classTo, rdf, isPath, selectedPath) {
			input = [];
			if(!isPath)
				input.push("This is not a call of a path control");
			if (!rdf)
				input.push("rdf is undifined");
			if (!classFrom)
				input.push("classFrom is undifined");
			if (!classTo)
				input.push("classTo is undifined");
			if (input.length == 0) {
				track(classFrom, classTo, [], input, 10, rdf);
			}
			if(selectedPath || selectedPath == 0)
			{
				return input[selectedPath];
			}
			return input;
		};
		
		

	});
})();
