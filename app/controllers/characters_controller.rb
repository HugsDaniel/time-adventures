class CharactersController < ApplicationController
  before_action :set_character

  def edit
    @character.special_skills.build
  end

  def update
    @character.update(character_params)

    Partials::Players::ShowJob.perform_later(@character.id)
    redirect_to game_path(character_id: @character.id)
  end

  def inventory
    @character.update(character_params)

    Partials::Players::InventoryJob.perform_later(@character.id)
    redirect_to game_path(character_id: @character.id)
  end

  private

  def set_character
    @character = Character.find(params[:id])
  end

  def character_params
    params.require(:character).permit(:name, :max_life, :life, :inventory, :perception, :intelligence, :dexterite, :constitution, :force, :charisme, :chance, special_skills_attributes: [:id, :name, :value, :skill, :factor])
  end
end
