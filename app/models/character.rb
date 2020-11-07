class Character < ApplicationRecord
  has_many :special_skills
  accepts_nested_attributes_for :special_skills, reject_if: proc { |attributes| attributes['name'].blank? }

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
