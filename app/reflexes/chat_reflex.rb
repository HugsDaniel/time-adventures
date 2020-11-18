# frozen_string_literal: true

class ChatReflex < ApplicationReflex
  include CableReady::Broadcaster

  def launch_skill(character_id, difficulty, skill, dice)

    result = result_for_skill(character, difficulty, skill)

    Message.create!(
      author:        character.name,
      content:       result[:content],
      success:       result[:success],
      result:        result[:launch],
      difficulty:    result[:difficulty],
      skill:         skill,
      launch:        true
    )

    morph "#chat", ApplicationController.render( partial: "pages/chat", locals: { messages: Message.all.order("created_at DESC") })
  end

  def launch_special(character_id, special_skill, value, skill, factor)
    character = Character.find(character_id)

    if skill != "" && factor != ""
      difficulty = ((skill.to_i * 5 / factor.to_i) + value.to_i).floor
    elsif skill != "" && factor == ""
      difficulty = (skill.to_i * 5 + value.to_i).floor
    elsif skill == "" && factor == ""
      difficulty = value.to_i
    end

    launch = rand(1..100)
    success = launch <= difficulty

    if difficulty.to_i == launch
      message = "Ça passe tout juste"
    elsif success && launch <= 10
      message = "Gros GG !"
    elsif success
      message = "GG !"
    elsif !success && launch >= 90
      message = "Ça pique"
    else
      message = "Loupé..."
    end


    Message.create!(
      author:     character.name,
      content:    message,
      success:    success,
      result:     launch,
      difficulty: difficulty,
      skill:      special_skill,
      launch:     true
    )

    morph "#chat", ApplicationController.render( partial: "pages/chat", locals: { messages: Message.all.order("created_at DESC") })
  end

  def launch_dice(character_id, dice, name)
    character = Character.find(character_id)

    launch = rand(1..dice.to_i)
    message = nil
    success = true

    Message.create!(
      author:     character.name,
      content:    message,
      success:    success,
      result:     launch,
      difficulty: dice,
      skill:      name,
      launch:     true
    )
    morph "#chat", ApplicationController.render( partial: "pages/chat", locals: { messages: Message.all.order("created_at DESC") })
  end

  private

  def result_for_dice(character, dice)

    return { difficulty: difficulty.to_i, launch: launch, success: success, content: message }
  end

  def result_for_skill(character, difficulty, skill)

    launch = rand(1..100)
    success = launch <= difficulty.to_i

    if difficulty.to_i == launch
      message = "Ça passe tout juste"
    elsif success && launch <= 10
      message = "Gros GG !"
    elsif success
      message = "GG !"
    elsif !success && launch >= 90
      message = "Ça pique"
    else
      message = "Loupé..."
    end

    return { difficulty: difficulty.to_i, launch: launch, success: success, content: message }
  end
end
