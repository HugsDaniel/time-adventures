# frozen_string_literal: true

class SpecialReflex < ApplicationReflex
  def create(character_id, name, value, skill, factor)
    factor = factor.present? ? factor : 1
    p factor
    SpecialSkill.create(
      name: name,
      value: value.to_i,
      character_id: character_id,
      skill: skill,
      factor: factor
    )
  end

end
