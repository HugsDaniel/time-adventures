# frozen_string_literal: true

class InventoryReflex < ApplicationReflex
  def update(id, content)
    character = Character.find(id)
    character.update(inventory: content)
  end
end
