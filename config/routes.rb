Rails.application.routes.draw do
  
  resources :wizard_apps, except: [:destroy]

  resources :ontologies, except: [:destroy, :show]
  
  match '/start/:id',  to: 'wizard_step#start', via: 'get', as: 'wizard_steps'
  match '/finish',  to: 'wizard_step#finish', via: 'get', as: 'finish_wizard_steps'
  
  match '/help',   to: 'static_pages#help',    via: 'get'
  
  root  'ontologies#index', id:1
end
