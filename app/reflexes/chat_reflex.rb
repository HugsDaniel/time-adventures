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

  def launch(character_id, difficulty, skill, message_id)
    character = Character.find(character_id).name

    result = launch_and_calculate_success(difficulty)

    Message.create!(
      author: character,
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

  def launch_and_calculate_success(difficulty)
    launch = rand(1..100)
    success = launch <= difficulty.to_i

    if success && launch <= 10
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
