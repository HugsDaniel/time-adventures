# frozen_string_literal: true

class SpecialReflex < ApplicationReflex
  def create(character_id, name, value)
    SpecialSkill.create(
      name: name,
      value: value.to_i,
      character_id: character_id
    )
  end

end
