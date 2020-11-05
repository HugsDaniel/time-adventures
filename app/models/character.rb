class Character < ApplicationRecord
  has_many :special_skills

  def skills
    {
      perception: perception,
      intelligence: intelligence,
      dexterite: dexterite,
      force: force,
      constitution: constitution,
      charisme: charisme,
      chance: chance
    }
  end
end
