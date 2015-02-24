require 'net/http'
require 'json'

class RestApi < ApplicationController
   def generate_wizard
    uri = URI("http://localhost:3001/ontologies/wizard/#{params[:url]}")
    req = Net::HTTP.get(uri)

    render :json => req
  end

  def create_app
    values = call_synth("applications/create_api", {'name' => 'App_test'})

    render :json => {:all_values => values, :status => values['status'] }
  
  end

  def activate_app
    values = call_synth("applications/activate_api", {'name' => 'App_test'})

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

  def create_index_landmark
    values = call_synth('landmarks/create_api', {'landmark[landmark_name]' => 'LandmarkTest1',
       'landmark[landmark_position]' => '1', 'landmark[type]' => 'index_anchor',
       'index_anchor_navigation_attribute[index_anchor_navigation_attribute_label_expression]' => "'Label Index 1'",
       'index_anchor_navigation_attribute[index_anchor_navigation_attribute_target_index]' => 'http://base#2e991b00-a17c-11e4-bd15-001d92e8bb43'})

    render :json => {:all_values => values, :status => values['status'] }
  end

  def create_context_landmark
    values = call_synth('landmarks/create_api', {'landmark[landmark_name]' => 'LandmarkTest1',
       'landmark[landmark_position]' => '1', 'landmark[type]' => 'context_anchor',
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_label_expression]' => "'Label index 2'",
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_target_context]' => 'http://base#fd8ac360-a176-11e4-98c4-001d92e8bb43',
       'context_anchor_navigation_attribute[context_anchor_navigation_attribute_target_node_expression]' => "'target_node_expression 1'"})

    render :json => {:all_values => values, :status => values['status'] }
  end
  
  def get_context_attr_id
    print "LOG: begin: get_context_attr_id \n" if @log_name or true
    print "LOG: params: #{params} \n" if @log_param or true
                                      
    p = URI.encode_www_form_component('http://base#507013d0-b795-11e4-a7c0-001d92e8bb43')

    values = call_get_synth("indexes/context_anchor_attributes/#{p}", {
           :id => 'http://base#507013d0-b795-11e4-a7c0-001d92e8bb43',
          :q=>"1", :_search=>"false", :nd=>"1423488002057", :rows=>"10", :page=>"1", :sidx=>'', :sord=>''
          })
    render :json => {:status => true, :result => values[:result]}
  end

  private

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
    print "Calling #{uri}\n#{params} \n"
    req = Net::HTTP.post_form(uri, params)

    return req
  end
end
