class SpecialSkill < ApplicationRecord
  belongs_to :character

  def self.skills
    %i(perception intelligence dexterite force constitution charisme chance)
  end
end
