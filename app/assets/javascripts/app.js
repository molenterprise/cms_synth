(function() {
  var app = angular.module('gemStore', []);

  app.controller('StoreController', function(){
    
    this.window = gems[0];
    
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
    	for (i = 0; i < gems.length; i++) {
		    if(gems[i].id == index){
		    	this.window = gems[i];
		    	break;
		    }
		}
    };
    
  });

  var gems = [
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
