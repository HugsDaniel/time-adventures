class AddMaxLifeToCharacters < ActiveRecord::Migration[6.0]
  def change
    add_column :characters, :max_life, :integer, default: 0
  end
end
