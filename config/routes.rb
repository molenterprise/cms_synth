Rails.application.routes.draw do
  
  resources :wizard_apps, except: [:destroy]
  match '/def/:id',    to: 'wizard_apps#wizard_definition',  via: 'get'
  match '/generate/:url',    to: 'wizard_apps#generate_wizard',  via: 'get', constraints: { :url => /.*/}
  match '/generate_app',    to: 'wizard_apps#create_app',  via: 'get'
  match '/activate_app',    to: 'wizard_apps#activate_app',  via: 'get'
  match '/generate_context',    to: 'wizard_apps#create_context',  via: 'get'
  match '/generate_index',    to: 'wizard_apps#create_index',  via: 'get'
  match '/generate_index_landmark',    to: 'wizard_apps#create_index_landmark',  via: 'get'
  match '/generate_context_landmark',    to: 'wizard_apps#create_context_landmark',  via: 'get'
  match '/generate_context_attribute_for_index',    to: 'wizard_apps#create_context_attribute_for_index',  via: 'get'
  match '/generate_computed_attribute_for_index',    to: 'wizard_apps#create_computed_attribute_for_index',  via: 'get'
  match '/generate_parameter_for_context',    to: 'wizard_apps#create_parameter_for_context',  via: 'get'
  match '/generate_full_app',    to: 'wizard_apps#create_full_app',  via: 'get'
  match '/get_context_attr',    to: 'wizard_apps#get_context_attr_id',  via: 'get'
  match '/generate_attribute_context_parameters',    to: 'wizard_apps#create_attribute_context_parameters',  via: 'get'
  match '/generate_in_context_class',    to: 'wizard_apps#create_in_context_class',  via: 'get'
  
  
  resources :ontologies, except: [:destroy, :show]
  
  match '/start/:id',  to: 'wizard_step#start', via: 'get', as: 'wizard_steps'
  match '/finish',  to: 'wizard_step#finish', via: 'get', as: 'finish_wizard_steps'
  
  
  match '/help',   to: 'static_pages#help',    via: 'get'
  
  root  'ontologies#index', id:1
  match '/index',    to: 'static_pages#index',    via: 'get'
  match '/nomenclatorChooser',    to: 'static_pages#nomenclatorChooser',    via: 'get'
  match '/window',    to: 'static_pages#windows',    via: 'get'
  match '/addOntology',    to: 'static_pages#addOntology',    via: 'get'
  
  #controls
  match '/radio-nomenclator-chooser',    to: 'partial_pages#radio-nomenclator-chooser',    via: 'get'
  match '/info-depending-on-selected-option',    to: 'partial_pages#info-depending-on-selected-option',    via: 'get'
  match '/select-nomenclator-chooser',    to: 'partial_pages#select-nomenclator-chooser',    via: 'get'
  match '/add-ontology',    to: 'partial_pages#add-ontology',    via: 'get'
  match '/selected-properties',    to: 'partial_pages#selected-properties',    via: 'get'
  match '/datatype-property-selection',    to: 'partial_pages#datatype-property-selection',    via: 'get'
  match '/radio-bottom-detail',    to: 'partial_pages#radio-bottom-detail',    via: 'get'
  match '/select-nomenclator-chooser-for-path',    to: 'partial_pages#select-nomenclator-chooser-for-path',    via: 'get'
  match '/computed-attributes',    to: 'partial_pages#computed-attributes',    via: 'get'
  match '/modal',    to: 'partial_pages#modal',    via: 'get'
  match '/radio-attribute-for-choosing',    to: 'partial_pages#radio-attribute-for-choosing',    via: 'get'
  match '/resource-detail',    to: 'partial_pages#resource-detail',    via: 'get'
  match '/detail-other-attributes-yesno',    to: 'partial_pages#detail-other-attributes-yesno',    via: 'get'
  match '/question-options',    to: 'partial_pages#question-options',    via: 'get'
  match '/radio-attribute-for-choosing-detail',    to: 'partial_pages#radio-attribute-for-choosing-detail',    via: 'get'
  match '/info-to-show',    to: 'partial_pages#info-to-show',    via: 'get'
  
 end
