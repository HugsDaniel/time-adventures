class CharactersController < ApplicationController
  before_action :set_character

  def edit
    @character.special_skills.build
  end

  private

  def set_character
    @character = Character.find(params[:id])
  end

  def character_params
    params.require(:character).permit(:inventory)
  end
end
