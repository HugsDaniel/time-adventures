Rails.application.routes.draw do
  root to: 'pages#lobby'
  get "/game", to: "pages#home", as: :game

  resources :characters, only: [:edit, :update] do
    member do
      patch "inventory"
    end
    # resources :inventories, only: [:edit, :update]
    resources :special_skills, only: [:create]
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
