Rails.application.routes.draw do
  root to: 'pages#home'

  resources :characters, only: [] do
    resources :special_skills, only: [:create]
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
