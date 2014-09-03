(function() {
  var app = angular.module('wizard', ['ui.bootstrap']);

  app.controller('WizardController', function(){
    
 //   this.window = windows[0];
    
    this.solution = 0;
    
    this.userSequence = [];
                 
    this.isType = function(val){
    	return this.window.type == val;
    };
    
    this.changeWindow = function(){
    	step = {
    		window: this.window.id,
    		//title: this.window.title, //debug
    		solution: this.solution
    	};
    	this.userSequence.push(step);
    	this.selectWindow(this.window.options[this.solution].next);
    	
    	this.solution = 0;
    	
    };
    
    this.back = function(){
    	if(this.userSequence.length > 0){
    		step = this.userSequence.pop();
    		this.selectWindow(step.window);
    		this.solution = step.solution;
    	}
    };
    
    
    this.selectWindow = function(index){
    	for (i = 0; i < wizard.length; i++) {
		    if(wizard[i].id == index){
		    	this.window = wizard[i];
		    	break;
		    }
		}
    };
    
    this.isEmpty = function(str){
    	return (!str || 0 === str.length);    	
    };
    
  });

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
  
  app.directive('selectNomenclatorChooser', function(){
	return {
		restrict: 'E',
		templateUrl: 'select-nomenclator-chooser.html',
		controller: function(){
			
			this.status = {
				isopen : false
			};
			
			this.setOption = function(controller, key){
		    	controller.solution = key;
		    	this.status.isopen = !this.status.isopen;
    		};

		},
		controllerAs: 'chooserCtrl'
	};
  });
  
  app.controller('windowsController', ['$http', function($http){
  	var step = this;
  	step.window = [];
  	$http.get('../../config/windows.json').success(function(data){
  		step.window = data[0];
  	});
  }]);
})();
