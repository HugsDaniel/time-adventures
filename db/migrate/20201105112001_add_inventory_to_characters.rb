class AddInventoryToCharacters < ActiveRecord::Migration[6.0]
  def change
    add_column :characters, :inventory, :text
  end
end
