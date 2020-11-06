module SpecialSkillHelper
  def popover_content_for(special_skill)
    if special_skill.skill.present?
      if special_skill.factor != 1
        "#{special_skill.skill.capitalize} / #{special_skill.factor} + #{special_skill.value}"
      else
        "#{special_skill.skill.capitalize} + #{special_skill.value}"
      end
    end
  end
end
