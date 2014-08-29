(function() {
  var app = angular.module('wizard', ['ui.bootstrap']);

  app.controller('WizardController', function(){
    
    this.window = wizard[0];
    
    this.solution = 0;
    
    this.userSequence = [];
    
    this.status = {
			isopen : false
		};
    
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
  
  app.directive('radioDetailNomenclatorChooser', function(){
	return {
		restrict: 'E',
		templateUrl: 'radio-detail-nomenclator-chooser.html'
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
      type: 'radioDetail',
      message: 'Wizard 1',
      options: [
        {key: 0, text:"Red", next: 1},{key: 1, text:"Blue", next: 2} 
      ],
      details:
      	[
	      {
	      	title: 'what do you want to choose?',
	      	items: [
	      		[{type: 'img', msg: "/assets/checkbox-checked.png"}, {type: 'text', msg: "Option 1.1"}, {type: 'text', msg: "Option 1.2"}],
	      		[{type: 'img', msg: "/assets/checkbox.png"}, {type: 'text', msg: "Option 2.1"}, {type: 'text', msg: "Option 2.2"}],
	      		[{type: 'img', msg: "/assets/checkbox-checked.png"}, {type: 'text', msg: "Option 3.1"}, {type: 'text', msg: "Option 3.2"}]
	      	]
	      },
	      {
	      	title: 'what do you want to choose?',
	      	items: [
	      		[{type: 'text', msg: "Property 1 Property 2"}],
	      		[{type: 'text', msg: "Property 3 Property 4"}],
	      		[{type: 'text', msg: "Property 5 Property 6"}]
	      	]
	      },
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
