(function() {
  var app = angular.module('wizard', ['ui.bootstrap']);

  app.controller('WizardController', function(){
  	
  	/*var step = this;
  	step.window = [];
  	$http.get('../../config/windows.json').success(function(data){
  		step.windows = data;
  		step.window = data[0];
  	});
    */
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
    /*	if (this.window.type == "unique") /// nuevo
    		document.location = "windows"; */
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
    //	if(index = -1) document.location = "addOntology.html";
    	for (i = 0; i < wizard.length; i++) {
		    if(wizard[i].id == index){	
		    	this.window = wizard[i];
		    	if(wizard[i].type == "unique")	 
		    		document.location = wizard[i].message;
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
  
  app.directive('addOntology', function(){
	return {
		restrict: 'E',
		templateUrl: 'addOntologyDirective.html'
	};
  });
  
  app.controller('WindowsController', ['$http', function($http){
  	this.ontology = "";
  	var step = this;
  	step.window = [];
  	step.ontology = "";
  	$http.get('../../config/windows.json').success(function(data){
  		step.window = data[0];
  	});
  	
  	this.isEmpty = function(str){
    	return (!str || 0 === str.length);    	
    };
  }]);
  
  var wizard = [
  	{
  	  id: 1,
      title: 'Ontologies',
      type: 'radioDetail',
      message: 'Ontologies',
      options: [
        {key: 0, text:"Add Ontology", next: 2},{key: 1, text:"Create Application", next: 2} 
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
	      	title: '',
	      	items: [
	      		[{type: 'text', msg: "foaf"}, {type: 'text', msg: "http://xmlns.com/foaf/0.1/"}],
	      		[{type: 'text', msg: "skos"}, {type: 'text', msg: "http://www.w3.org/2004/02/skos/core#"}],
	      		[{type: 'text', msg: "swc"}, {type: 'text', msg: "http://data.semanticweb.org/ns/swc/ontology#"}]
	      	]
	      },
	    ]
    },
    {
  	  id: 2,
      title: 'Add Ontology',
      type: 'unique',
      message: 'addOntology.html',
      options: [
        {key: 0, next: 3} 
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
