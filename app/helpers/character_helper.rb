module CharacterHelper
  def skill_icon_for(skill)
    case skill
    when :perception
      icon('fas', 'eye')
    when :intelligence
      icon('fas', 'brain')
    when :dexterite
      icon('fas', 'hand-sparkles')
    when :force
      icon('fas', 'dumbbell')
    when :constitution
      icon('fas', 'running')
    when :charisme
      icon('fas', 'kiss-wink-heart')
    when :chance
      icon('fas', 'smile')
    end
  end
end
