class PagesController < ApplicationController
  def lobby
    @characters = Character.all.order(:id)
  end

  def home
    @characters = Character.all.order(:id).includes(:special_skills)
    @messages ||= Message.all.order("created_at ASC")
  end
end
