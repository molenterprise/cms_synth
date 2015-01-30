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

  def create_app
    values = call_synth("applications/create_api", {'name' => 'App_test'})

    return values['status'] == 'successful'
  end

  def create_app_wizard(name)
    values = call_synth("applications/create_api", {'name' => name})

    render :json => {:all_values => values, :status => values['status'] }
  end

  def activate_app
    values = call_synth("applications/activate_api", {'name' => 'App_test'})

    render :json => {:all_values => values, :status => values['status'] }
  end

  def activate_app_wizard(name)
    values = call_synth("applications/activate_api", {'name' => name})

    return values['status'] == 'successful'
  end

  def create_context
    values = call_synth('contexts/create_api', {'context[context_name]' => 'Product-11',
       'context[context_title]' => 'Product Title-11', 'context[context_query]' => 'AUCTION::Produto.find_all'})

    render :json => {:all_values => values, :status => values['status'] }
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

  def create_index
    values = call_synth('indexes/create_api', {'index[index_name]' => 'IndexTest1',
       'index[index_title]' => 'Index Test Title 1', 'index[context_index_context]' => 'http://base#16655820-a17a-11e4-b0f8-001d92e8bb43'})

    render :json => {:all_values => values, :status => values['status'] }
  end

  def create_context_attribute_for_index

    label_expression = "
        label = self.rdfs::label
        unless label.nil? || label.to_a.empty?
          label
        else
          self.compact_uri
        end
      "

    values = call_synth_without_result('indexes/context_anchor_attributes_post_data', {
        'parent' => 'http://base#471b69a0-a25b-11e4-88ab-001d92e8bb43',
        'navigation_attribute_name' => 'Attribute_name 1',
        'context_anchor_navigation_attribute_label_expression' => label_expression,
       'context_anchor_navigation_attribute_target_node_expression' => 'self',
       'context_anchor_navigation_attribute_target_context' => 'http://base#46d279c0-a25b-11e4-88ab-001d92e8bb43',
       'navigation_attribute_index_position' => '1',
       'id' => '_empty'})

    render :json => {:all_values => values }
  end

  def create_computed_attribute_for_index
    label_expression = "
        if self.auction::estaEmLeilao=='1' then
          'sim'
        else
           'nao'
        end
    "

    values = call_synth_without_result('indexes/computed_attributes_post_data', {
        'parent' => 'http://base#471b69a0-a25b-11e4-88ab-001d92e8bb43',
        'navigation_attribute_name' => 'Attribute_name 2',
        'computed_navigation_attribute_value_expression' => label_expression,
       'navigation_attribute_index_position' => '3',
       'id' => '_empty'})

    render :json => {:all_values => values }
  end
  
  def create_computed_attribute_for_index_wizard(params)
    values = call_synth_without_result('indexes/computed_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'computed_navigation_attribute_value_expression' => params['query'],
       'navigation_attribute_index_position' => '3',
       'id' => '_empty'})
       
    return {:status => true, :result => {}}
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
    values = call_synth_without_result('indexes/computed_attributes_post_data', {
        'parent' => params['index_id'],
        'navigation_attribute_name' => params['name'],
        'computed_navigation_attribute_value_expression' => params['query'],
       'navigation_attribute_index_position' => '3',
       'id' => '_empty'})
       
    return {:status => true, :result => {}}
  end

  def create_index_landmark
    values = call_synth('landmarks/create_api', {'landmark[landmark_name]' => 'LandmarkTest1',
       'landmark[landmark_position]' => '1', 'landmark[type]' => 'index_anchor',
       'index_anchor_navigation_attribute[index_anchor_navigation_attribute_label_expression]' => "'Label Index 1'",
       'index_anchor_navigation_attribute[index_anchor_navigation_attribute_target_index]' => 'http://base#2e991b00-a17c-11e4-bd15-001d92e8bb43'})

    render :json => {:all_values => values, :status => values['status'] }
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

  def create_context_landmark
    values = call_synth('landmarks/create_api', {'landmark[landmark_name]' => 'LandmarkTest1',
       'landmark[landmark_position]' => '1', 'landmark[type]' => 'context_anchor',
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_label_expression]' => "'Label index 2'",
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_target_context]' => 'http://base#fd8ac360-a176-11e4-98c4-001d92e8bb43',
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_target_node_expression]' => "'target_node_expression 1'"})

    render :json => {:all_values => values, :status => values['status'] }
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
    print "LOG: begin: get_params \n" if @log_name or true
    print "LOG: params: #{function}\n" if @log_param or true
    print "LOG: @global_var: #{@global_var}\n" if @log_param or true

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
    print "LOG: result #{result}\n" if @log_param or true
    print "LOG: end: get_params \n" if @log_name or true
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

    app_name = 'wizard_test_2'

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

  def call_synth(function, params)
    url = 'localhost'
    port = '3002'

    uri = URI("http://#{url}:#{port}/#{function}")
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
    print "#{params} \n"
    req = Net::HTTP.post_form(uri, params)

    return req
  end
end
