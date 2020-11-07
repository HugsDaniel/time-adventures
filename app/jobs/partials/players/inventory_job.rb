class Partials::Players::InventoryJob < ApplicationJob
  queue_as :default

  def perform(character_id)
    # 'comments/list' is the key we defined in the view, and is passed to the RealtimePartialChannel via stimulus.
    # `render(Comment.all)` is a little bit of rails magic, that will return the same HTML as running
    # <%= render(Comment.all) %> in our erb view.
    character = Character.find(character_id)
    RealtimePartialChannel.broadcast_to("inventories/#{character_id}", {
      body: ApplicationController.render( partial: "pages/character_inventory", locals: { char: character }, layout: false)
    })
  end
end
