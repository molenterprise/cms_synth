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
    uri = URI("http://localhost:3001/ontologies/wizard/#{params[:url]}")
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
    print "LOG: begin: create_context_wizard \n" if @log_name
    print "LOG: params: #{params} \n" if @log_param

    values = call_synth('contexts/create_api', {'context[context_name]' => params['name'],
       'context[context_title]' => params['title'], 'context[context_query]' => params['query']})
    status = values['status']

    print "LOG: values: #{values} \n" if @log_param

    return {:status => status == 'successful', :result => values}
  end
  
  def create_in_context_class_wizard(params)
    print "LOG: begin: create_in_context_class_wizard \n" if @log_name

    values = call_synth_without_result('in_context_classes', {
      'in_context_class[in_context_class_class]' => params['class'],
       'in_context_class[in_context_class_context]' => params['context']})
    status = values['status']

    print "LOG: values: #{values} \n" if @log_param

    return {:status => status == 'successful', :result => {:in_context_class_id => values['location']}}
  end
  
  def create_in_context_class
    print "LOG: begin: create_in_context_class_wizard \n" if @log_name

    values = call_synth_without_result('in_context_classes', {
      'in_context_class[in_context_class_class]' => 'http://www.semanticweb.org/milena/ontologies/2013/6/auction#Produto',
       'in_context_class[in_context_class_context]' => 'http://base#deda8cc0-b7a1-11e4-a7c0-001d92e8bb43'})

    id = values['location']
    id = id[id.index('http', 2).. -1]
    
    print "LOG: values: #{values} \n" if @log_param or true
    
    render :json => {:status => true, :result => {:in_context_class_id => id}}
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

  def create_computed_attribute_for_index_wizard(params)

    index_position_key = "#{params['index_id']}_attribute"

    index_position = @global_var[index_position_key][0] || 2

    call_synth_without_result('indexes/computed_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'computed_navigation_attribute_value_expression' => params['query'],
       'navigation_attribute_index_position' => index_position,
       'id' => '_empty'})

    @global_var[index_position_key][0] = index_position + 1

    return {:status => true, :result => {}}
  end

  def create_index_attribute_for_index_wizard(params)
    
    print "LOG: begin: create_index_attribute_for_index_wizard \n" if @log_name or true
    print "LOG: params: #{params} \n" if @log_param  or true

    index_position_key = "#{params['index_id']}_attribute"

    index_position = @global_var[index_position_key][0] || 2

    call_synth_without_result('indexes/index_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'index_navigation_attribute_index' => params['index_navigation_attribute_index'],
       'navigation_attribute_index_position' => index_position,
       'id' => '_empty'})

    @global_var[index_position_key][0] = index_position + 1

    return {:status => true, :result => {}}
  end

  def create_index_landmark_wizard(params)

    print "LOG: begin: create_index_landmark_wizard \n" if @log_name
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
  
  def create_parameter_for_context
    values = call_synth_without_result('contexts/context_parameters_post_data', {
          'parent' => 'http://base#0d5eee20-ad33-11e4-9b50-001d92e8bb43',
          'context_parameter_name' => 'context_param',
         'id' => '_empty'})

    render :json => {:all_values => values }
  end
  
  def get_context_attr_wizard(params)
    print "LOG: begin: get_context_attr_id \n" if @log_name or true
    print "LOG: params: #{params} \n" if @log_param or true
                                      
    p = URI.encode_www_form_component(params[:id])

    values = call_get_synth("indexes/context_anchor_attributes/#{p}", {
           #:children_attribute => 'context_anchor_navigation_attribute_target_parameters',
          :q=>"1", :_search=>"false", :nd=>"1423488002057", :rows=>"10", :page=>"1", :sidx=>'', :sord=>''
          })

    return {:status => true, :result => values[:result]}
  end

  def create_parameter_for_context_wizard(params)
    print "LOG: begin: create_parameter_for_context_wizard \n" if @log_name or true
    print "LOG: params: #{params} \n" if @log_param or true
    
    call_synth_without_result('contexts/context_parameters_post_data', {
          'parent' => params['context_id'],
          'context_parameter_name' => params['name'],
         'id' => '_empty'})
    return {:status => true, :result => {}}
  end
  
  def create_attribute_context_parameters
    print "LOG: begin: create_parameter_for_context_wizard \n" if @log_name or true
    print "LOG: params: #{params} \n" if @log_param or true
    
    call_synth_without_result('indexes/navigation_attribute_context_parameters_post_data', {
          'parent_id' => 'http___base_505538d0-b795-11e4-a7c0-001d92e8bb43',
          'navigation_attribute_parameter_name' => 'context_param',
          'navigation_attribute_parameter_value_expression' => "parameters[:context_param]",
         'id' => '_empty'})
    render :json => {:status => true, :result => {}}
  end
  
  def create_attribute_context_parameters_wizard(params)
    print "LOG: begin: create_parameter_for_context_wizard \n" if @log_name or true
    print "LOG: params: #{params} \n" if @log_param or true
    
    call_synth_without_result('indexes/navigation_attribute_context_parameters_post_data', {
          'parent_id' => params['index_id'],
          'navigation_attribute_parameter_name' => params['name'],
          'navigation_attribute_parameter_value_expression' => params['expression'],
         'id' => '_empty'})
    return {:status => true, :result => {}}
  end

  # key params: ontology, mainClass, paths, option, options, index_id
  def create_index_anchor_wizard(params)
    print "LOG: begin: create_index_anchor_wizard \n" if @log_name or true
    print "LOG: params: #{params} \n" if @log_param or true

    path = params['paths'].select{|x| x['key'] = params['option']}.first["pathItems"]
    properties_path = '';
    index = 0;
    path.each{|item|
      properties_path = "#{properties_path}#{params['ontology']}::#{item['propertiesNames'][params['options'][index]]}."
      index += 1
    }

    index_key = "#{path.first['className']}_for_#{params['mainClass']}_IndexAnchor"
    index_position = @global_var[index_key][0] || 1
    name = "#{index_key}_#{index_position}"

    function_params = {'name' => name, 'title' => name,
      'query' => "#{params['ontology'].upcase}::#{path.first['className']}.find_all.select{ |x| context_param.#{properties_path}include? x}"}
    values = create_context_wizard(function_params)[:result]
    
    function_params = {'name' => 'context_param', 'context_id' => values['context']}
    create_parameter_for_context_wizard(function_params)

    function_params = {'name' => path.first['className'], 'index_id' => params['index_id'],
       'index_navigation_attribute_index' => values['defaultIndex']}
    create_index_attribute_for_index_wizard(function_params)
    
    val = get_context_attr_wizard({:id => values['defaultIndex']})[:result]
    function_params = {'index_id' => val['rows'][0]['id'], 'name' => 'context_param', 'expression' => 'parameters[:context_param]'}
    create_attribute_context_parameters_wizard(function_params)

    @global_var[index_key][0] = index_position + 1

    return {:status => true, :result => {}}

  end

  def process_function(todo, step)
    print "LOG: begin: process_function \n" if @log_name
    print "LOG: params: #{todo} \n" if @log_param

    unless todo.blank?
      todo.each{ |function|
        params = get_params(function, step)
        values = send(function['function_name'], params)
        process_return_values(function, values[:result]) if values.is_a? Hash
      }
    end

    print "LOG: end: process_function \n" if @log_name
  end

  def get_params(function, step)
    print "LOG: begin: get_params \n" if @log_name
    print "LOG: params: #{function}\n" if @log_param
    print "LOG: @global_var: #{@global_var}\n" if @log_param

    result = {}
    params = function['params']
    unless params.blank? then
      params.each{ |param|
        if param['type'] == 'constant' then
          result[param['name']] = param['value']
        elsif param['type'] == 'globar_var' then
          result[param['name']] = @global_var[param['value']].last
        elsif param['type'] == 'user_action' then
          result[param['name']] = step[param['value']]
        end
      }
    end
    print "LOG: result #{result}\n" if @log_param
    print "LOG: end: get_params \n" if @log_name
    return result
  end

  def process_return_values(function, values)
    print "LOG: begin: process_return_values \n" if @log_name
    print "LOG: params: #{function} - #{values}\n" if @log_param

    unless function['results'].blank? then
      function['results'].each{ |result|
        push_global_var(result['global_var'], values[result['name']])
      }
    end

    print "LOG: @global_var: #{@global_var}\n" if @log_param
    print "LOG: end: process_return_values \n" if @log_name
  end

  def push_global_var(key, value)
    print "LOG: begin: push_global_var \n" if @log_name
    print "LOG: #{key} - #{value}\n" if @log_param
    @global_var[key].push(value)
    print "LOG: end: push_global_var \n" if @log_name
  end

  def pop_global_var(param)
    print "LOG: begin: pop_globar_var \n" if @log_name
    print "LOG: params: #{param} \n" if @log_param
    print "LOG: end: pop_globar_var \n" if @log_name
    return @global_var[param['key']].pop
  end

  def create_full_app
    app_wizard_definition = JSON.parse(File.read(File.join(Rails.root, 'app', 'assets', 'wizard_def', 'definition_auction.json')))
    app_user_definition = JSON.parse(File.read(File.join(Rails.root, 'app', 'assets', 'wizard_def', 'user_auction.json')));

    @global_var = Hash.new { |hash, key| hash[key] = [] }

    @log_name = true
    @log_param = false

    app_name = 'app_test_1'

    #return 'Error: creating application' unless create_app_wizard(app_name)
    return 'Error: activating application' unless activate_app_wizard(app_name)

    app_user_definition.each{ |step|

      windowId = step['currentWindow']
      window = app_wizard_definition['windows'].select{|windows_definition| windows_definition['id'] == windowId}.first

      todo = window['todo']
      process_function(todo, step) unless todo.blank?

      unless window['options'].blank? or window['options'][step['selectedOption'].to_i]['todo'].blank? then
        process_function(window['options'][step['selectedOption'].to_i]['todo'], step)
      end

    }

    render :json => {:status => 'done!' }

  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_wizard_app
    @wizard_app = WizardApp.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def wizard_app_params
    params.require(:wizard_app).permit(:name, :ontology_id)
  end
  
  def call_get_synth(function, params)
    url = 'localhost'
    port = '3002'

    uri = URI("http://#{url}:#{port}/#{function}")
    print "call_get_synth #{uri}\n#{params} \n"
    uri.query = URI.encode_www_form(params)
    print "URI = #{uri.to_s}"
    
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
    print "call_synth #{uri}\n#{params} \n"
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
    print "call_synth_without_result #{uri}\n#{params} \n"
    req = Net::HTTP.post_form(uri, params)

    return req
  end
end
