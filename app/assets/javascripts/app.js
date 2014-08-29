(function() {
  var app = angular.module('wizard', ['ui.bootstrap']);

  app.controller('WizardController', function(){
    
    this.window = wizard[0];
    
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
    
  });

  app.directive('radioNomenclatorChooser', function(){
	return {
		restrict: 'E',
		templateUrl: 'radio-nomenclator-chooser.html'
	};
  });
  
  app.directive('selectNomenclatorChooser', function(){
	return {
		restrict: 'E',
		templateUrl: 'select-nomenclator-chooser.html'
	};
  });
  
  var wizard = [
  	{
  	  id: 1,
      title: 'Red',
      type: 'radio',
      message: 'Wizard 1',
      options: [
        {key: 0, text:"Red", next: 1},{key: 1, text:"Blue", next: 2},{key: 2, text:"Green", next: 3} 
      ]
    },
    {
  	  id: 2,
      title: 'Blue',
      type: 'select',
      message: 'Wizard 2',
      options: [
        {key: 0, text:"Red", next: 1},{key: 1, text:"Blue", next: 2},{key: 2, text:"Green", next: 3}
      ]
    },
    {
  	  id: 3,
      title: 'Green',
      type: 'radio',
      message: 'Wizard 3',
      options: [
        {key: 0, text:"Red", next: 1},{key: 1, text:"Blue", next: 2},{key: 2, text:"Green", next: 3} 
      ]
    }];
})();
