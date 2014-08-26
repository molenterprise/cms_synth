Rails.application.routes.draw do
  
  resources :wizard_apps, except: [:destroy]

  resources :ontologies, except: [:destroy, :show]

  root  'ontologies#index'
  
  match '/help',    to: 'static_pages#help',    via: 'get'
  match '/index',    to: 'static_pages#index',    via: 'get'
end
