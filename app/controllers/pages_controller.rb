class PagesController < ApplicationController
  def lobby
    @characters = Character.all.order(:id)
  end

  def home
    @current_character = Character.find(params[:character_id])
    @characters = Character.all
                           .order(:id)
                           .includes(:special_skills)
                           .where.not(id: params[:character_id])
                           .to_a
                           .unshift(@current_character)
    @messages ||= Message.all.order("created_at DESC")
  end
end
