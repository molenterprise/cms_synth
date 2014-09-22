Rails.application.routes.draw do
  
  resources :wizard_apps, except: [:destroy]
  match '/definition',    to: 'wizard_apps#wizarddefinition',    via: 'get'

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
  match '/radio-nomenclator-chooser',    to: 'static_pages#radio-nomenclator-chooser',    via: 'get'
  match '/radio-detail-nomenclator-chooser',    to: 'static_pages#radio-detail-nomenclator-chooser',    via: 'get'
  match '/select-nomenclator-chooser',    to: 'static_pages#select-nomenclator-chooser',    via: 'get'
  match '/add-ontology',    to: 'static_pages#add-ontology',    via: 'get'
  match '/selected-properties',    to: 'static_pages#selected-properties',    via: 'get'
  match '/datatype-property-selection',    to: 'static_pages#datatype-property-selection',    via: 'get'
  match '/radio-bottom-detail',    to: 'static_pages#radio-bottom-detail',    via: 'get'
  match '/select-nomenclator-chooser-for-path',    to: 'static_pages#select-nomenclator-chooser-for-path',    via: 'get'
  match '/computed-attributes',    to: 'static_pages#computed-attributes',    via: 'get'
end
