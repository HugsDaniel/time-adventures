# frozen_string_literal: true

class ChatReflex < ApplicationReflex
  include CableReady::Broadcaster

  def post(message, message_id)
    @chats = Rails.cache.read(:chats) || []
    @chats.shift while @chats.size > 1000
    @chats << {
      id: message_id,
      author: request.remote_ip,
      message: message,
      created_at: Time.current.iso8601,
    }
    Rails.cache.write :chats, @chats
    cable_ready["chat"].dispatch_event name: "chats:added", detail: {message_id: message_id}
    cable_ready.broadcast
  end

  def launch(character_id, difficulty, special_skill, skill, factor, message_id)
    character = Character.find(character_id)

    result = launch_and_calculate_success(character, difficulty, special_skill, skill, factor)

    Message.create!(
      author: character.name,
      content: result[:content],
      success: result[:success],
      result:  result[:launch],
      difficulty: result[:difficulty],
      skill: skill,
      launch: true
    )

    cable_ready["chat"].dispatch_event name: "chats:added", detail: {message_id: message_id}
    cable_ready.broadcast
  end

  def reload
  end

  private

  def launch_and_calculate_success(character, difficulty, special_skill, skill, factor)

    difficulty = ((character.send(skill.downcase) * 5 / factor.to_i) + difficulty.to_i).floor if skill.present? && special_skill.present?

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
