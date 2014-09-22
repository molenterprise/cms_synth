(function() {
  var app = angular.module('wizard', ['ui.bootstrap', 'checklist-model']);

  app.controller('WizardController', ['$http', function($http){
  
  	var me = this;
  
    me.wizard = [];
    me.currentWindow = [];
    me.solution = {};
    me.userSequence = [];
    me.solution.selectedOptions =[];
  
  	$http.get('/definition').success(function(data){
  		me.wizard = data;
  		
  		me.currentWindow = me.wizard[10];
  		
  		console.log(me.currentWindow);
    
	    me.solution = { 
	    					selectedOption: 1,
	    					selectedProperties: [0, 5, 4, 1],
	    					selectedOptions: []
	    				}; 
	    
	    me.userSequence = [];
	    length = me.currentWindow.propertySets ? me.currentWindow.propertySets[me.solution.selectedOption].length : 0;
	    me.solution.selectedOptions = [length]; 
	    
	    for( i = 0; i < length; i++)
	    {
	    	me.solution.selectedOptions[i] = 0;
	    }
  	});
  
    this.window = wizard[10];
    					selectedOption: 1,
    this.isType = function(val){
    	return this.currentWindow.type == val;
    };
    
    this.changeWindow = function(){
    	if(this.window.needNextProcessing){
    		eval(this.window.expToEval);
		}
    	step = {
    		currentWindow: this.currentWindow.id,
    		//title: this.currentWindow.title, //debug
    		selectedOption: this.solution.selectedOption,
    		selectedProperties: this.solution.selectedProperties
    	};
    	this.userSequence.push(step);
    /*	if (this.currentWindow.type == "unique") /// nuevo
    		document.location = "currentWindows"; */
    	this.selectWindow(this.currentWindow.options[this.solution.selectedOption].next);
    	
    	this.solution.selectedOption = 0;
    	
    	
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
    	for (i = 0; i < wizard.length; i++) {
		    if(wizard[i].id == index){	
		    	this.currentWindow = wizard[i];
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
		templateUrl: 'computed-attributes.html'
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
			
			this.computedAttr_name;
			
			this.setOption = function(controller, key, index){
		    	controller.solution.selectedOptions[index] = key;
		    	console.log(this.status[index]);
		    	this.status[index] = !this.status[index];
		    	console.log(this.status[index]);
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
  
  app.controller('WindowsController', ['$http', function($http){
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
  }]);
  
  app.filter('range', function() {
  	return function(input, total) {
    	total = parseInt(total);
    	for (var i = 0; i < total; i++)
      		input.push(i);
    	return input;
  	};
  });
    
})();
