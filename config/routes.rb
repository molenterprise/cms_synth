Rails.application.routes.draw do
  
  resources :ontologies, except: [:destroy, :show]

  root  'ontologies#index'
  
  match '/select', to: 'ontologies#select', via: 'get', as: 'select_ontology'
  
  match '/help',    to: 'static_pages#help',    via: 'get'
end
