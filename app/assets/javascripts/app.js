(function() {
  var app = angular.module('wizard', ['ui.bootstrap', 'checklist-model']);

  app.controller('WizardController', function(){
  	
  	/*var step = this;
  	step.window = [];
  	$http.get('../../config/windows.json').success(function(data){
  		step.windows = data;
  		step.window = data[0];
  	});
    */
  //  this.window = wizard[0];
  
    this.window = wizard[6];
    
    this.solution = { 
    					selectedOption: 0,
    					selectedProperties: [0, 5, 4, 1]
    			}; 
    this.selectedPropertiesControl = wizard[8];
    
    this.userSequence = [];
                 
    this.isType = function(val){
    	return this.window.type == val;
    };
    
    this.changeWindow = function(){
    	step = {
    		window: this.window.id,
    		//title: this.window.title, //debug
    		selectedOption: this.solution.selectedOption,
    		selectedProperties: this.solution.selectedProperties
    	};
    	this.userSequence.push(step);
    /*	if (this.window.type == "unique") /// nuevo
    		document.location = "windows"; */
    	this.selectWindow(this.window.options[this.solution.selectedOption].next);
    	
    	this.solution.selectedOption = 0;
    	
    	
    };
    
    this.back = function(){
    	if(this.userSequence.length > 0){
    		step = this.userSequence.pop();
    		this.selectWindow(step.window);
    		this.solution.selectedOption = step.selectedOption;
    		this.solution.selectedProperties = step.selectedProperties;
    	}
    };
    
    
    this.selectWindow = function(index){
    //	if(index = -1) document.location = "addOntology.html";
    	for (i = 0; i < wizard.length; i++) {
		    if(wizard[i].id == index){	
		    	this.window = wizard[i];
		    /*	if(wizard[i].type == "unique")	 
		    		document.location = wizard[i].message; */
		    	break;
		    }
		}
    };  
		
		this.selectProperty = function(id, arr) {
			for ( i = 0; i < arr.length; i++) {
				if (arr[i].id == id)
					return arr[i];
			}
			return null;
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
			for ( i = 0; i < arr.length; i++) {
				if (arr[i].key == key)
					return arr[i];
			}
			return null;
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
        {key: 0, text:"Add Ontology", next: 2},{key: 1, text:"Create Application", next: 3} 
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
      message: '',
      options: [
        {key: 0, next: 1} 
      ]
    },
    {
  	  id: 3,
      title: 'Select the main Ontology you want to use',
      type: 'select',
      message: 'Ontology',
      options: [
        {key: 0, text:"foaf", next: 4},{key: 1, text:"skos", next: 4},{key: 2, text:"swrc", next: 4},{key: 3, text:"schm", next: 4} 
      ]
    },
    {
  	  id: 4,
      title: 'What do you want to show from swrc ontology?',
      type: 'select',
      message: 'Class',
      options: [
        {key: 0, text:"swrc:Article", next: 5},{key: 1, text:"swrc:Book", next: 5},{key: 2, text:"swrc:Conference", next: 5},{key: 3, text:"swrc:Event", next: 5} 
      ]
    },
    {
  	  id: 5,
      title: 'What do you want to do?',
      type: 'radio',
      message: '',
      options: [
        {key: 0, text:"Show a list of Events to be chosen", next: 6},{key: 1, text:"Show the detail of an Event", next: 5},{key: 2, text:"Define a computation using an Event", next: 5} 
      ]
    },
    {
  	  id: 6,
      title: '',
      type: 'radioDetail',
      message: 'Events',
      options: [
        {key: 0, text:"one Event?", next: 7},{key: 1, text:"more than one Event?", next: 7} 
      ],
      modal: "texto",
      details:
      	[
	      {
	      	title: 'Do you want to choose',
	      	items: [
	      		[{type: 'text', msg: "Posters Display"}],
	      		[{type: 'text', msg: "Demo: Adapting a Map Query Interface..."}],
	      		[{type: 'text', msg: "Demo: Blognoon: Exploring a Topic in..."}]
	      	]
	      },
	      {
	      	title: 'Do you want to choose',
	      	items: [
	      		[{type: 'img', msg: "/assets/checkbox-checked.png"},{type: 'text', msg: "Posters Display"}],
	      		[{type: 'img', msg: "/assets/checkbox.png"},{type: 'text', msg: "Demo: Adapting a Map Query Interface..."}],
	      		[{type: 'img', msg: "/assets/checkbox-checked.png"},{type: 'text', msg: "Demo: Blognoon: Exploring a Topic in..."}]
	      	]
	      },
	    ]
    },
    {
  	  id: 7,
      title: '',
      type: 'radio',
      message: 'Which type of attributes you want to show in the Event list?',
      options: [
        {key: 0, text:"Direct attributes of an Event", next: 8},{key: 1, text:"Attributes of other classes related to Event", next: 9},{key: 2, text:"Computed Attributes", next: 9} 
      ]
    },
    {
  	  id: 8,
      title: 'Following this example which attributes you want to show in the Event list',
      type: 'checkbox',
      message: 'Add Event properties',
      options: [
        {key: 0, text:"label", next: 7},{key: 1, text:"start", next: 7},{key: 2, text:"end", next: 7},{key: 3, text:"summary", next: 7} 
      ]
    },
    {
  	  id: 9,
      title: '',
      type: 'selectedProperties',
      message: 'Selected properties',
      items: [
	      		[
					{id: 0, name: "label", value:["Posters Display"]}, 
			    	{id: 1, name: "start", value:["2011-01-01 10:00"]}, 
			    	{id: 2, name: "end", value:["2011-01-01 18:00"]},
			    	{id: 3, name: "summary", value:["Posters Display"]},
			    	{id: 4, name: "where", value:["Auditorium"]},
			    	{id: 5, name: "Documents", value: ["A Demo Search Engine for Products",
			      		 								"A Tool for Fast Indexing and Querying of Graphs",
			      		 								"A User-Tunable Approach to Marketplace Search"]}
	      	    ],
	      	    [
	      	    	 {id: 0, name: "label", value:["Demo: Adapting a Map Query..."]}, 
		      		 {id: 1, name: "start", value:["03/30/2011  0:00"]}, 
		      		 {id: 2, name: "end", value:["03/30/2011  2:00"]},
		      		 {id: 3, name: "summary", value:["Demo: Adapting"]},
		      		 {id: 4, name: "where", value:["Auditorium"]},
		      		 {id: 5, name: "Documents", value:["Accelerating Instant Question...",
		      		 									 "Adapting a Map Query Interface for..."]}
	      	    ]
	      	]
    }
    ];
    
})();
