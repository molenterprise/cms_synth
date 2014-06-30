Rails.application.routes.draw do
  
  resources :ontologies, except: [:destroy, :show]

  root  'ontologies#index'
  
  match '/help',    to: 'static_pages#help',    via: 'get'
end
