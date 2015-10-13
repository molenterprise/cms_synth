require 'net/http'
require 'json'

class WizardAppsController < ApplicationController
  before_action :set_wizard_app, only: [:show, :edit, :update, :destroy]
  # GET /wizard_apps
  # GET /wizard_apps.json
  def index
    @wizard_apps = WizardApp.all
  end

  def wizard_definition
    file = File.join(Rails.root, 'app', 'assets', 'wizard_def', "#{params[:id]}.json")
    jfile = File.read(file)
    render :json => jfile
  end

  # GET /wizard_apps/1
  # GET /wizard_apps/1.json
  def show
    #ActiveRDF::Namespace.register(:swc, "http://data.semanticweb.org/ns/swc/ontology")

    excluded_namespaces = [:xsd, :rdf, :rdfs, :owl, :shdm, :swui, :symph, :void]
    @domain_classes = (RDFS::Class.find_all(options).reject{ |c| excluded_namespaces.include?(ActiveRDF::Namespace.prefix(c))  } +
    OWL::Class.find_all(options).reject{ |c| excluded_namespaces.include?(ActiveRDF::Namespace.prefix(c))  }).uniq

  end

  # GET /wizard_apps/new
  def new
    @wizard_app = WizardApp.new
  end

  # GET /wizard_apps/1/edit
  def edit
  end

  # POST /wizard_apps
  # POST /wizard_apps.json
  def create
    @wizard_app = WizardApp.new(wizard_app_params)

    if @wizard_app.save
      #redirect_to @wizard_app, notice: 'Wizard app was successfully created.'
      redirect_to controller: "wizard_step", action: "start", id: 1
    else
      render :new
    end
  end

  # PATCH/PUT /wizard_apps/1
  # PATCH/PUT /wizard_apps/1.json
  def update
    respond_to do |format|
      if @wizard_app.update(wizard_app_params)
        format.html { redirect_to @wizard_app, notice: 'Wizard app was successfully updated.' }
        format.json { render :show, status: :ok, location: @wizard_app }
      else
        format.html { render :edit }
        format.json { render json: @wizard_app.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wizard_apps/1
  # DELETE /wizard_apps/1.json
  def destroy
    @wizard_app.destroy
    respond_to do |format|
      format.html { redirect_to wizard_apps_url, notice: 'Wizard app was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def generate_wizard
    uri = URI("http://localhost:3002/ontologies/wizard/#{params[:url]}")
    req = Net::HTTP.get(uri)

    render :json => req
  end

  def create_app_wizard(name)
    values = call_synth("applications/create_api", {'name' => name})

    return values['status'] == 'successful'
  end

  def activate_app_wizard(name)
    values = call_synth("applications/activate_api", {'name' => name})

    return values['status'] == 'successful'
  end

  def create_context_wizard(params)
    print "LOG: begin: create_context_wizard #{params['name']}\n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param 

    values = call_synth('contexts/create_api', {'context[context_name]' => params['name'],
       'context[context_title]' => params['name'], 'context[context_query]' => params['query']})
    set_navigational_struct params['name'], values['context'], values['defaultIndex'], nil
    
    #status = values['status']
    
    if params['query'].include? 'context_param' then
      function_params = {'name' => 'context_param', 'context_id' => values['context']}
      create_parameter_for_context_wizard(function_params)
    end

    print "LOG: values: #{values} \n" if @log_param 
    print "LOG: end: create_context_wizard " if @log_name 
    pretty_print params['name'], nil, 1 if @log_name
    return {:status => status == 'successful', :result => values}
  end

  def create_computed_attributes_for_index_wizard(params)
    print "create_computed_attributes_for_index_wizard #{params}"
    function_params = {}
    function_params['index_id'] = params['index_id']
    attrs = params['attributes']

    names = params['names'].split(",")
    queries = params['queries'].split(",")
    attrs.each{|attr|
      function_params['name'] = names[attr]
      function_params['query'] = queries[attr]
      create_computed_attribute_for_index_wizard(function_params)
    }
    return {:status => true, :result => {}}
  end
  
  def print_global_var(params)
    print "LOG: print_global_var #{@global_var} \n" 
    return {:status => true, :result => {}}
  end
  
  def create_anchor_key(params)
    print "LOG: begin: create_anchor_key \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  
    
    key = "#{params['parent_id']}.#{params['selectedAttribute']}"
    push_global_var(key, {}) unless @global_var[key].length > 0
    
    print "LOG: end: create_anchor_key #{key} \n" if @log_name 
    
    return {:status => true, :result => {'key' => key}}
  end
  
  def set_anchor_values(params)
    print "LOG: begin: set_anchor_values #{params['anchor_att_id']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  
    
    key = params['anchor_att_id']
    value = {}
    if !key.nil? then
      value = @global_var[key][0]
      value.merge! params
    end
    return {:status => true, :result => value}
  end
  
  def create_query_attribute_wizard(params)
    print "LOG: begin: create_query_attribute_wizard \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  
    
    function_params = {'index_id' => params['index_id'], 'ontology' => params['ontology']}
    
    attrs = params['scope']
    selected = 0 #params['selectedAttribute'].to_i
    
    name = attrs['names'][selected]
    query = attrs['queries'][selected]
    type = attrs['type'][selected]  
    
    values = {}  

    if type == 'Path' then
        function_params = {'path' => query['path'], 'reverse' => query['reverse'], 'ontology' => params['ontology'],
                       'properties' => query['properties'], 'mainclass' => query['mainclass']}
        
        context_params = get_query_expression_from_path(function_params)[:result]
        
        query = context_params['query']
        name = context_params['context_name']
        first_class = context_params['first_class']
        
        function_params = {'name' => name, 'title' => name, 'query' => query}
        values = create_context_wizard(function_params)[:result]
        
        function_params = {'name' => 'context_param', 'context_id' => values['context']}
        create_parameter_for_context_wizard(function_params)
    end 
    
    key = "#{params['parent_id']}.#{selected}"
    push_global_var(key, values)
    
    return {:status => true, :result => {'key' => key}}
  end
  
  def put_context_wizard(params)
    print "LOG: begin: put_context_wizard #{params['anchor_att_id']} \n" if @log_name
    print "LOG: params: #{params} \n" if @log_param
    print "LOG: @global_var: #{@global_var} \n" if @log_param
    
    key = params['anchor_att_id']
    
    if !key.nil? then
      value = @global_var[key].first
      if value.has_key? 'current_context'
        push_global_var('context_id', value['current_context'])
        push_global_var('index_id', value['current_index'])
      else
        push_global_var('context_id', @global_var['context_id'].last)
        push_global_var('index_id', @global_var['index_id'].last)
      end
    end
    return {:status => true, :result => {}}
  end
  
  def create_indexes_attributes_wizard(params)
    print "LOG: begin: create_indexes_attributes_wizard " if @log_name
    pretty_print nil, params['parent'], 1 if @log_name 
    print "LOG: params: #{params} \n" if @log_param
    
    temp = @global_var["#{params['parent']}.indexers attributes}"]
    
    return {:status => true, :result => {}} unless temp.length == 0
    
    temp.push true
    
    function_params = {'ontology' => params['ontology']}
    attrs = params['scope']
    
    selected = attrs['data']
    names = attrs['names']
    queries = attrs['queries']
    types = attrs['type']    

    selected.select{|attr| types[attr] == 'Path'}.each{ |attr|
      function_params['name'] = names[attr]
      key = "#{params['parent']}.#{attr}"
      function_params['query'] = queries[attr]
      values = create_index_from_attribute(function_params)
      push_global_var(key, {}) unless @global_var[key].length > 0
      attr_values = @global_var[key].first
      attr_values['current_context'] = values['context']
      attr_values['current_index'] = values['defaultIndex']
    }

    return {:status => true, :result => {}}
  end
  
  def create_index_from_attribute(params)
    print "LOG: begin: create_index_from_attribute \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param 
    
    function_params = {'path' => params['query']['path'], 'reverse' => params['query']['reverse'], 'ontology' => params['ontology'],
                       'properties' => params['query']['properties'], 'mainclass' => params['query']['mainclass']}
    context_params = get_query_expression_from_path(function_params)[:result]
    
    name = params['name'] || context_params['context_name']
    
    function_params = {'name' => name, 'title' => name, 'query' => context_params['query']} 
    
    return create_context_wizard(function_params)[:result]
  end


  def create_attributes_for_index_wizard(params)
    print "LOG: begin: create_attributes_for_index_wizard " if @log_name 
    pretty_print nil, params['index_id'], 1 if @log_name
    print "LOG: params: #{params} \n #{@global_var}" if @log_param 
    
    attrs = params['scope']
    
    selected = attrs['data']
    names = attrs['names']
    queries = attrs['queries']
    types = attrs['type']   
    

    for i in 0..(selected.length - 1)
      
      attr = selected[i]
      attr_values = @global_var["#{params['index_id']}.#{attr}"]
      
      function_params = {'index_id' => params['index_id'], 'ontology' => params['ontology'], 'query' => queries[attr], 'name' => names[attr], 
        'position' => i + 1, 
        'parameter_expression' => @global_var['index_id'].length > 0 ? 'parameters[:context_param]' : 'self'}
      
      if types[attr] == 'ComputedAttribute' then 
        if attr_values.length > 0 then
          function_params.merge! attr_values.first
          create_anchor_attributes_for_index_wizard(function_params) 
        else
          create_computed_attribute_for_index_wizard(function_params)
        end
      elsif types[attr] == 'Path' then
        attr_values = attr_values.first
        function_params.merge! attr_values
        if attr_values['target'].nil? then
          function_params['update_attribute'] = false
        else
          function_params['update_attribute'] = true
        end
        create_index_attribute_for_index_wizard(function_params)
      end
    end
    return {:status => true, :result => {}}
  end
  
  def create_anchor_attributes_for_index_wizard(params)
    print "LOG: begin: create_anchor_attributes_for_index_wizard #{params['name']} \n" if @log_name
    print "LOG: params: #{params} \n" if @log_param 
    
    function_params = {'index_id' => params['index_id'], 'name' => params['name'], 'label_expression' => params['query'],
      'target' => params['target']}
           
    if params['anchor_type'] == "list"
      create_index_anchor_attribute_for_index_wizard(function_params)
    elsif params['anchor_type'] == "details"
      function_params['target_node_expression'] = ''
      create_context_anchor_attribute_for_index_wizard(function_params)
    elsif params['anchor_type'] == "details from index"
      function_params['target_node_expression'] = 'self'
      create_context_anchor_attribute_for_index_wizard(function_params)
    end
    
    rows = get_context_attr_wizard({:id => params['anchor_index']})[:result]['rows']
    print "rows2: #{rows}\n"
    row = rows.last
    anchor_params = {'anchor_id' => row['id'], 'name' => 'context_param', 'expression' => params['parameter_expression']}
    create_attribute_context_parameters_wizard(anchor_params)
    
  end
  
  def create_attributes_for_detail_wizard(params) #isomorphic with create_attributes_for_index_wizard
    print "LOG: begin: create_attributes_for_detail_wizard #{params['in_context_class_id']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param 
    
    attrs = params['scope']
    
    selected = attrs['data']
    names = attrs['names']
    queries = attrs['queries']
    types = attrs['type']
    
    set_param = @global_var["context_name"].length == 0
    

    for i in 0..(selected.length - 1)
      attr = selected[i]
      attr_values = @global_var["#{params['in_context_class_id']}.#{attr}"]
      
      
      function_params = {'in_context_class_id' => params['in_context_class_id'], 'ontology' => params['ontology'], 
        'query' => queries[attr], 'name' => names[attr], 'position' => i + 1}
      
      if types[attr] == 'ComputedAttribute' then
        if attr_values.length > 0 then
          function_params.merge! attr_values.first
          create_anchor_attributes_for_detail_wizard(function_params) 
        else
          create_computed_attribute_for_detail_wizard(function_params)
        end
      elsif types[attr] == 'Path' then
        attr_values = attr_values.first
        function_params.merge! attr_values
        if attr_values['target'].nil? then
          function_params['update_attribute'] = false
        else
          function_params['parameter_expression'] = 'self' if set_param
          function_params['update_attribute'] = true
        end
        
        create_index_attribute_for_detail_wizard(function_params)
      end
    end
    return {:status => true, :result => {}}
  end
  
  # params: 'parent', 'name', 'label_expression', 'target', 'target_node_expression'
  def create_anchor_attributes_for_detail_wizard(params)
    print "LOG: begin: create_anchor_attributes_for_detail_wizard \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  
    
    function_params = {'in_context_class_id' => params['parent'], 'name' => params['name'], 'label_expression' => params['label_expression']}
           
    if params['anchor_type'] == "list"
      function_params['target_index'] = params['target']
      create_index_anchor_attribute_for_detail_wizard(function_params)
    elsif params['anchor_type'] == "details"
      function_params['target_context'] = params['target']
      function_params['target_node_expression'] = params['target_node_expression']
      create_context_anchor_attribute_for_detail_wizard(function_params)
    end
    
    anchor = get_context_attr_wizard({:id => params['anchor_index']})[:result]['rows'].last
    anchor_params = {'anchor_id' => anchor['id'], 'name' => 'context_param', 'expression' => 'parameters[:context_param]'}
    create_attribute_context_parameters_wizard(anchor_params)
    
  end
  
  def create_computed_attribute_for_index_wizard(params)
    
    print "LOG: begin: create_computed_attribute_for_index_wizard #{params['name']} - #{params['index_id']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  

    attribute_position_key = "#{params['index_id']}_attribute"
    attribute_position = params['position'] || @global_var[attribute_position_key][0] || 2

    call_synth_without_result('indexes/computed_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'computed_navigation_attribute_value_expression' => params['query'],
       'navigation_attribute_index_position' => attribute_position,
       'id' => '_empty'})

    @global_var[attribute_position_key][0] = attribute_position + 1 unless !params['position'].nil?

    return {:status => true, :result => {}}
  end
  
  def create_computed_attribute_for_detail_wizard(params) #isomorphic with create_computed_attribute_for_index_wizard
    
    print "LOG: begin: create_computed_attribute_for_detail_wizard #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  

    call_synth_without_result('in_context_classes/computed_attributes_post_data', {
        'parent' => params['in_context_class_id'],
        'navigation_attribute_name' => params['name'],
        'computed_navigation_attribute_value_expression' => params['query'],
        'id' => '_empty'})

    return {:status => true, :result => {}}
  end

  def create_index_attribute_for_index(params)
    
    print "LOG: begin: create_index_attribute_for_index #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param 

    index_position_key = "#{params['index_id']}_attribute"
    index_position = params['position'] || @global_var[index_position_key][0] || 2

    call_synth_without_result('indexes/index_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'index_navigation_attribute_index' => params['index_navigation_attribute_index'],
        'navigation_attribute_index_position' => index_position,
        'id' => '_empty'})

    @global_var[index_position_key][0] = index_position + 1 unless !params['index_position'].nil?

    return {:status => true, :result => {}}
  end
  
  def create_index_attribute_for_detail(params) #isomorphic with create_index_attribute_for_index
    
    print "LOG: begin: create_index_attribute_for_detail #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  

    call_synth_without_result('in_context_classes/index_attributes_post_data', {
        'parent' => params['in_context_class_id'],
        'navigation_attribute_name' => params['name'],
        'index_navigation_attribute_index' => params['index_navigation_attribute_index'],
       'id' => '_empty'})

    return {:status => true, :result => {}}
  end
  
  def create_context_anchor_attribute_for_index_wizard(params)
    
    print "LOG: begin: create_context_anchor_attribute_for_index_wizard #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param 

    index_position_key = "#{params['index_id']}_attribute"

    index_position = @global_var[index_position_key][0] || 2

    call_synth_without_result('indexes/context_anchor_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'context_anchor_navigation_attribute_label_expression' => params['label_expression'],
        'context_anchor_navigation_attribute_target_context' => params['target'],
        'context_anchor_navigation_attribute_target_node_expression' => params['target_node_expression'],
        'navigation_attribute_index_position' => index_position,
        'id' => '_empty'})
 
    @global_var[index_position_key][0] = index_position + 1

    return {:status => true, :result => {}}
  end
  
  def delete_context_anchor_attribute_for_index_wizard(params)
    
    print "LOG: begin: delete_context_anchor_attribute_for_index_wizard #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param 

    call_synth_without_result('indexes/context_anchor_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'context_anchor_navigation_attribute_label_expression' => params['label_expression'],
        'context_anchor_navigation_attribute_target_context' => params['target_context'],
        'context_anchor_navigation_attribute_target_node_expression' => params['target_node_expression'],
        'navigation_attribute_index_position' => params['index_position'], 'oper' => 'Delete',
        'id' => params['id']})

    return {:status => true, :result => {}}
  end
  
  def update_context_anchor_attribute_for_index_wizard(params)
    
    print "LOG: begin: update_context_anchor_attribute_for_index_wizard #{params['index_id']} - #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param 

    call_synth_without_result('indexes/context_anchor_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'context_anchor_navigation_attribute_label_expression' => params['label_expression'],
        'context_anchor_navigation_attribute_target_context' => params['target_context'],
        'context_anchor_navigation_attribute_target_node_expression' => params['target_node_expression'],
        'navigation_attribute_index_position' => params['index_position'],
        'id' => params['id']})

    return {:status => true, :result => {}}
  end
  
  def create_context_anchor_attribute_for_detail_wizard(params)
    
    print "LOG: begin: create_context_anchor_attribute_for_detail_wizard #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  

    call_synth_without_result('in_context_classes/context_anchor_attributes_post_data', {
        'parent' => params['in_context_class_id'],
        'navigation_attribute_name' => params['name'],
        'context_anchor_navigation_attribute_label_expression' => params['label_expression'],
        'context_anchor_navigation_attribute_target_context' => params['target_context'],
        'context_anchor_navigation_attribute_target_node_expression' => params['target_node_expression'],
        'id' => '_empty'})

    return {:status => true, :result => {}}
  end
  
  def create_index_anchor_attribute_for_index_wizard(params)
    
    print "LOG: begin: create_index_anchor_attribute_for_index_wizard #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  

    index_position_key = "#{params['index_id']}_attribute"
    index_position = params['index_position'] || @global_var[index_position_key][0] || 2

    call_synth_without_result('indexes/index_anchor_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'index_anchor_navigation_attribute_label_expression' => params['label_expression'],
        'index_anchor_navigation_attribute_target_index' => params['target'],
        'navigation_attribute_index_position' => index_position,
        'id' => '_empty'})
 
    @global_var[index_position_key][0] = index_position + 1 unless !params['index_position'].nil?

    return {:status => true, :result => {}}
  end  
  
  def create_index_anchor_attribute_for_detail_wizard(params)
    
    print "LOG: begin: create_index_anchor_attribute_for_detail_wizard #{params['name']} \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  

    call_synth_without_result('in_context_classes/index_anchor_attributes_post_data', {
        'parent' => params['in_context_class_id'],
        'navigation_attribute_name' => params['name'],
        'index_anchor_navigation_attribute_label_expression' => params['label_expression'],
        'index_anchor_navigation_attribute_target_index' => params['target'],
        'id' => '_empty'})

    return {:status => true, :result => {}}
  end  
    
  def create_landmark_wizard(params)
    print "LOG: begin: create_landmark_wizard #{params['landmark_type']} \n" if @log_name
    print "LOG: params: #{params} \n" if @log_param
    
    if params['landmark_type'] == "list"
      params['index_id'] = @global_var['index_id'].last
      create_index_landmark_wizard(params)
    elsif params['landmark_type'] == "details"
      params['context_id'] = @global_var['context_id'].last
      create_context_landmark_wizard(params)
    end
  end

  def create_index_landmark_wizard(params)

    print "LOG: begin: create_index_landmark_wizard #{params['name']} \n" if @log_name
    print "LOG: params: #{params} \n" if @log_param
    print "LOG: @global_var #{@global_var} \n" if @log_param

    landmark_position = @global_var[:landmark_position][0] || 2

    values = call_synth('landmarks/create_api', {'landmark[landmark_name]' => params['name'],
       'landmark[landmark_position]' => landmark_position, 'landmark[type]' => 'index_anchor',
       'index_anchor_navigation_attribute[index_anchor_navigation_attribute_label_expression]' => "'#{params['name']}'",
       'index_anchor_navigation_attribute[index_anchor_navigation_attribute_target_index]' => params['index_id']})

    print "LOG: values: #{values} \n" if @log_param

    return {:status => false} unless values['status'] == 'successful'

    @global_var[:landmark_position][0] = landmark_position + 1

    return {:status => true, :result => values}
  end
  
  def create_context_landmark_wizard(params)

    print "LOG: begin: create_context_landmark_wizard \n" if @log_name
    print "LOG: params: #{params} \n" if @log_param
    print "LOG: @global_var #{@global_var} \n" if @log_param

    landmark_position = @global_var[:landmark_position][0] || 2

    values = call_synth('landmarks/create_api', {'landmark[landmark_name]' => params['name'],
       'landmark[landmark_position]' => landmark_position, 'landmark[type]' => 'context_anchor',
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_label_expression]' => "'#{params['name']}'",
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_target_context]' => params['context_id'],
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_target_node_expression]' => ""})

    print "LOG: values: #{values} \n" if @log_param

    return {:status => false} unless values['status'] == 'successful'

    @global_var[:landmark_position][0] = landmark_position + 1

    return {:status => true, :result => values}
  end
  
  def create_in_context_class_wizard(params)
    print "LOG: begin: create_in_context_class_wizard " if @log_name
    pretty_print nil, params['context'], 1 if @log_name
    print "LOG: params: #{params} \n" if @log_param

    values = call_synth('in_context_classes/create_api', {'in_context_class[in_context_class_class]' => params['class'],
       'in_context_class[in_context_class_context]' => params['context']})

    set_navigational_struct nil, params['context'], nil, values["in_context_class"]    
    print "LOG: end create_in_context_class_wizard " if @log_name
    pretty_print nil, values["in_context_class"], (1 | 8) if @log_name
    
    return {:status => false} unless values['status'] == 'successful'

    return {:status => true, :result => values}
  end
  
  def get_context_attr_wizard(params)
    print "LOG: begin: get_context_attr_wizard \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param  
                                      
    p = URI.encode_www_form_component(params[:id])

    values = call_get_synth("indexes/context_anchor_attributes/#{p}", {
           #:children_attribute => 'context_anchor_navigation_attribute_target_parameters',
          :q=>"1", :_search=>"false", :nd=>"1423488002057", :rows=>"10", :page=>"1", :sidx=>'', :sord=>''})

    return {:status => true, :result => values[:result]}
  end

  def create_parameter_for_context_wizard(params)
    print "LOG: begin: create_parameter_for_context_wizard #{params['name']}\n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param
    
    call_synth_without_result('contexts/context_parameters_post_data', {
          'parent' => params['context_id'],
          'context_parameter_name' => params['name'],
         'id' => '_empty'})
    return {:status => true, :result => {}}
  end
  
  def create_attribute_context_parameters_wizard(params)
    print "LOG: begin: create_attribute_context_parameters_wizard \n" if @log_name or true
    print "LOG: params: #{params} \n" if @log_param or true
    
    call_synth_without_result('indexes/navigation_attribute_context_parameters_post_data', {
          'parent_id' => params['anchor_id'],
          'navigation_attribute_parameter_name' => params['name'],
          'navigation_attribute_parameter_value_expression' => params['expression'],
         'id' => '_empty'})
    return {:status => true, :result => {}}
  end  
  
  def get_query_expression_from_path_wizard(params)
    print "LOG: begin: get_query_expression_from_path_wizard \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param
   
    attrs = params['scope']
    index = attrs['selectedPath'].to_i
    param = attrs['queries'][index]
    
    function_params = {'path' => param['path'], 'reverse' => param['reverse'], 'ontology' => params['ontology'],
                       'properties' => param['properties'], 'mainclass' => param['mainclass']}
    return get_query_expression_from_path(function_params)
  end
  
  def get_query_expression_from_path(params)
    print "LOG: begin: get_query_expression_from_path \n" if @log_name 
    print "LOG: params: #{params} \n" if @log_param 
    
    path = params['path']
    x = 'x'
    properties_path = '';
    query_class =  path.last['className']
    
    if params['reverse']
      query_init = nil
      query_end = 'context_param'
      path = path.reverse
    else
      query_init = 'context_param'
      query_end = 'x'
    end
    
    index = 0  
    path.each{|item|      
      properties_path = "#{properties_path}map{|#{x}| #{query_init || x}.#{params['ontology']}::#{item['propertiesNames'][params['properties'][index]]}}.flatten."
      index += 1
      query_init = nil
      x = (x[0].ord + 1).chr
    }
    
    properties_path.sub!("map", "")
    properties_path.sub!("}", "") #remove the first closing curly brace
    properties_path.sub!(".flatten", "")
    query = "#{params['ontology'].upcase}::#{query_class}.find_all.select#{properties_path}include? #{query_end}}"
    
    first_class = path.first['className']
    name = "#{first_class}_for_#{params['mainclass']}"
    
    return {:status => true, :result =>{'query' => query, 'context_name' => name, 'first_class' => first_class}}
  end
  
  # key params: ontology, mainClass, path, properties, index_id, position, reverse
  def create_index_attribute_for_index_wizard(params)
    print "LOG: begin: create_index_attribute_for_index_wizard #{params['name']} - #{params['index_id']}\n" if @log_name
    print "LOG: params: #{params} \n" if @log_param
    
    name = params['name']
    
    function_params = {'name' => name, 'index_id' => params['index_id'],
       'index_navigation_attribute_index' => params['current_index']}
    create_index_attribute_for_index(function_params)
    
    val = get_context_attr_wizard({:id => params['current_index']})[:result]
    
    anchor_att = val['rows'][0]
    
    if params['update_attribute'] then
      
      attr_values = anchor_att['cell'];
      update_params = {
        'index_id' => params['current_index'],
        'id' => attr_values[0],
        'name' => attr_values[1],
        'label_expression' => attr_values[2],
        'target_context' => params['target'],
        'target_node_expression' => '',
        'index_position' => attr_values[5]
        }
      if params['anchor_type'] == 'list' then 
        delete_context_anchor_attribute_for_index_wizard(update_params)
        update_params['target'] = params['target']
        create_index_anchor_attribute_for_index_wizard(update_params)
      elsif params['anchor_type'] != 'details from index' 
        update_context_anchor_attribute_for_index_wizard(update_params)
      end
      
      # if params['anchor_type'] == 'details from index' then
        # params['parameter_expression'] = 'self'
      # end
      
      anchor = get_context_attr_wizard({:id => params['anchor_index']})[:result]['rows'][0]
      anchor_params = {'anchor_id' => anchor['id'], 'name' => 'context_param', 'expression' => params['parameter_expression']}
      create_attribute_context_parameters_wizard(anchor_params)
      
    end

=begin    
    parameter_expression = params['parameter_expression'] || 'parameters[:context_param]'
    function_params = {'anchor_id' => anchor_att['id'], 'name' => 'context_param', 'expression' => parameter_expression}
    create_attribute_context_parameters_wizard(function_params)
=end    
    print "LOG: end: create_index_attribute_for_index_wizard \n" if @log_name

    return {:status => true, :result => {}}

  end
  
  # key params: ontology, mainClass, path, properties, in_context_class_id, position, reverse
  def create_index_attribute_for_detail_wizard(params) #isomorphic with create_index_and_index_attribute_for_index_wizard
    print "LOG: begin: create_index_attribute_for_detail_wizard #{params['name']} \n" if @log_name
    print "LOG: params: #{params} \n" if @log_param

    name = params['name']

    function_params = {'name' => name, 'in_context_class_id' => params['in_context_class_id'],
       'index_navigation_attribute_index' => params['current_index']}
    create_index_attribute_for_detail(function_params)
        
    val = get_context_attr_wizard({:id => params['current_index']})[:result]
    anchor_att = val['rows'].last
    
    if params['update_attribute'] then
      print "updating anchor #{params['anchor_type']}\n"
      
      attr_values = anchor_att['cell'];
      update_params = {
        'index_id' => params['current_index'],
        'id' => attr_values[0],
        'name' => attr_values[1],
        'label_expression' => attr_values[2],
        'target_context' => params['target'],
        'target_node_expression' => '',
        'index_position' => attr_values[5]
        }
      if params['anchor_type'] == 'list' then 
        delete_context_anchor_attribute_for_index_wizard(update_params)
        update_params['target'] = params['target']
        create_index_anchor_attribute_for_index_wizard(update_params)
      elsif params['anchor_type'] != 'details from index'
        update_context_anchor_attribute_for_index_wizard(update_params)
      end
    end

    parameter_expression = params['parameter_expression'] || 'parameters[:context_param]'
    print "row> #{anchor_att['cell'][1]} - #{parameter_expression} - #{params['parameter_expression']} \n"
    function_params = {'anchor_id' => anchor_att['id'], 'name' => 'context_param', 'expression' => parameter_expression}
    create_attribute_context_parameters_wizard(function_params)
   
    print "LOG: end: create_index_attribute_for_detail_wizard \n" if @log_name
    return {:status => true, :result => {}}

  end

  def process_function(todo, step)
    print "LOG: begin: process_function \n" if @log_mga_name
    print "LOG: params: #{todo} \n" if @log_mga_param

    unless todo.blank?
      todo.each{ |function|
        params = get_params(function, step)
        values = send(function['function_name'], params)
        process_return_values(function, values[:result]) if values.is_a? Hash
      }
    end

    print "LOG: end: process_function \n" if @log_mga_name
  end
  
  def save_value(params)
    print "LOG: begin: save_value \n" if @log_name
    print "LOG: #{params}\n" if @log_name
    params.each{ |key, value|
      push_global_var(key, value)
      print "#{@global_var[key]}\n" if @log_name
    }
    print "LOG: end: save_value\n" if @log_name
  end

  def get_params(function, step)
    print "LOG: begin: get_params \n" if @log_mga_name
    print "LOG: params: #{function}\n" if @log_mga_param
    print "LOG: @global_var: #{@global_var}\n" if @log_mga_param

    result = {}
    params = function['params']
    unless params.blank? then
      params.each{ |param|
        if param['type'] == 'constant' then
          result[param['name']] = param['value']
        elsif param['type'] == 'global_var' then
          result[param['name']] = @global_var[param['value']].last
        elsif param['type'] == 'user_action' then
          result[param['name']] = step[param['value']]
        end
      }
    end
    print "LOG: result #{result}\n" if @log_mga_param
    print "LOG: end: get_params \n" if @log_mga_name
    return result
  end

  def process_return_values(function, values)
    print "LOG: begin: process_return_values \n" if @log_mga_name
    print "LOG: params: #{function} - #{values}\n" if @log_mga_param

    unless function['results'].blank? then
      function['results'].each{ |result|
        push_global_var(result['global_var'], values[result['name']])
      }
    end

    print "LOG: @global_var: #{@global_var}\n" if @log_mga_param
    print "LOG: end: process_return_values \n" if @log_mga_name
  end

  def push_global_var(key, value)
    print "LOG: begin: push_global_var \n" if @log_mga_name
    print "LOG: #{key} - #{value}\n" if @log_mga_param
    @global_var[key].push(value)
    print "LOG: end: push_global_var #{@global_var[key]} \n" if @log_mga_name
  end
  
  def pop_global_var_is_not_empty(param)
    print "LOG: begin: pop_global_var_is_not_empty #{param['key']} \n" if @log_name 
    print "LOG: params: #{param} - #{@global_var[param['key']]} \n" if @log_param
    result = 'empty'
    if @global_var[param['key']].length > 1 then
      result = @global_var[param['key']].pop
    end
    print "LOG: end: pop_global_var_is_not_empty #{result} - #{@global_var[param['key']]}\n" if @log_name
    return result
  end

  def pop_global_var(param)
    print "LOG: begin: pop_global_var #{param['key']} \n" if @log_name 
    print "LOG: params: #{param} \n" if @log_param 
    result = @global_var[param['key']].pop
    print "LOG: end: pop_global_var \n" if @log_name 
    return result
  end

  def create_full_app
    app_wizard_definition = JSON.parse(File.read(File.join(Rails.root, 'app', 'assets', 'wizard_def', 'definition_auction.json')))
    app_user_definition = JSON.parse(File.read(File.join(Rails.root, 'app', 'assets', 'wizard_def', 'user_auction.json')))

    @global_var = Hash.new { |hash, key| hash[key] = [] }

    @log_name = true
    @log_param = false
    @log_mga_name = false
    @log_mga_param = false

    app_name = 'EAApp'

    #return 'Error: creating application' unless create_app_wizard(app_name)
    return 'Error: activating application' unless activate_app_wizard(app_name)
   
    stack = [{:children => app_user_definition['children'], :index => 0}]
      
    while !stack.empty? do  
      
      node = stack[-1];
      
      if(node[:index] >= node[:children].length) then
        stack.pop()
      else
        current = node[:children][node[:index]]
        node[:index] += 1
        if current['type'] != 'Art' then
          step = current['data']
          windowId = step['currentWindow']
          window = app_wizard_definition['windows'].select{|windows_definition| windows_definition['id'] == windowId}.first
          
          print "window: #{current['id']} - #{window['id']} - #{step['selectedOption']}\n"
          #print "window: #{window} \n"
          #print "step #{step} \n"
          
          todo = window['todo']
          process_function(todo, step) unless todo.blank?

          todo_index = step['selectedOption'].to_i
          
          unless window['options'].blank? or window['options'][todo_index].blank? or window['options'][todo_index]['todo'].blank? then
            print ".............. option - #{todo_index} \n"
            process_function(window['options'][todo_index]['todo'], step)
          end
        end
        stack.push({:children => current['children'], :index => 0}) unless current['children'].nil? || current['children'].empty?
      end
    end

    render :json => {:status => 'done!' }

  end

  private

  def set_wizard_app
    @wizard_app = WizardApp.find(params[:id])
  end

  def wizard_app_params
    params.require(:wizard_app).permit(:name, :ontology_id)
  end
  
  def call_get_synth(function, params)
    url = 'localhost'
    port = '3002'

    uri = URI("http://#{url}:#{port}/#{function}")
    print "call_get_synth #{uri}\n#{params} \n" if @log_mga_param
    uri.query = URI.encode_www_form(params)
    print "URI = #{uri.to_s}" if @log_mga_param
    
    req = Net::HTTP.get_response(uri)
    
    values = {}
    values[:result] = JSON.parse(req.body)
    values[:function] = function
    values[:params] = params

    return values
  end

  def call_synth(function, params)
    url = 'localhost'
    port = '3002'

    uri = URI("http://#{url}:#{port}/#{function}")
    print "call_synth #{uri}\n#{params} \n" if @log_mga_param
    req = Net::HTTP.post_form(uri, params)
    
    values = JSON.parse(req.body)
    values[:function] = function
    values[:params] = params

    return values
  end

  def call_synth_without_result(function, params)
    url = 'localhost'
    port = '3002'

    uri = URI("http://#{url}:#{port}/#{function}")
    print "call_synth_without_result #{uri}\n#{params} \n" if @log_mga_param 
    req = Net::HTTP.post_form(uri, params)

    return req
  end
  
  def pretty_print(name, id, flags = 15)
    if !id.nil? then
      id = id.gsub("___base_", "://base#")
    end
    nav = @global_var[:navigational_struct]
    nav.select{|struct| 
      struct[:name] == name or 
        (!id.nil? and 
          (struct[:context] == id or struct[:index] == id or struct[:in_context_class] == id))
    }.each{ |struct|
      print "|#{struct[:name]} " if flags & 1 == 1
      print "C: #{struct[:context]} " if !struct[:context].nil? and flags & 2 == 2  
      print "I: #{struct[:index]} " if !struct[:index].nil? and flags & 4 == 4 
      print "IC: #{struct[:in_context_class]}" if !struct[:in_context_class].nil? and flags & 8 == 8
      print "|\n" 
    }
  end
  
  def set_navigational_struct(name, context, index, in_context_class)
    nav = @global_var[:navigational_struct]
    item = nav.select{|struct| 
      (struct[:name] == name) or 
      (struct[:context] == context and !context.nil?) or 
      (struct[:index] == index and !index.nil?) or 
      (struct[:in_context_class] == in_context_class and !in_context_class.nil?)
    }
    if item.length > 1 then
      print "Warning: There are {item.length} navigational structs with the same values"
      return
    end
    if item.empty? then
      item = {}
      nav.push item 
    else
      item = item.first
    end
    item[:name] = name unless name.nil?
    item[:context] = context unless context.nil?
    item[:index] = index unless index.nil?
    item[:in_context_class] = in_context_class unless in_context_class.nil?
    return item 
  end
end
