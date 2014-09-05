(function() {
  var app = angular.module('wizard', ['ui.bootstrap']);

  app.controller('WizardController', function(){
  	
  	var step = this;
  	step.window = [];
  	$http.get('/t_json_entities/1.json').success(function(data){
  		step.windows = data;
  		step.window = data[0];
  	}); 
    
//    this.window = wizard[0];
    
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
  
  app.controller('WindowsController', ['$http', function($http){
  	this.ontology = "";
  	var step = this;
  	step.window = [];
  	step.ontology = "";
  	$http.get('/t_json_entities/1.json').success(function(data){
  		step.window = data[0];
  	});
  	
  	this.isEmpty = function(str){
    	return (!str || 0 === str.length);    	
    };
  }]);
  
  var wizard = [
  	{
  	  id: 1,
      title: 'Add Ontology',
      type: 'radioDetail',
      message: 'Ontologies',
      options: [
        {key: 0, text:"Add Ontology", next: 1},{key: 1, text:"Create Application", next: 2} 
      ],
      details:
      	[
	      {
	      	title: '',
	      	items: [
	      		[{type: 'text', msg: "foaf"}, {type: 'text', msg: "http://xmlns.com/foaf/0.1/"}],
	      		[{type: 'text', msg: "skos"}, {type: 'text', msg: "http://www.w3.org/2004/02/skos/core#"}],
	      		[{type: 'text', msg: "swc"}, {type: 'text', msg: "http://data.semanticweb.org/ns/swc/ontology#"}]
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
