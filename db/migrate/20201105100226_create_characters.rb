class CreateCharacters < ActiveRecord::Migration[6.0]
  def change
    create_table :characters do |t|
      t.string :name
      t.integer :life, default: 0
      t.integer :perception, default: 0
      t.integer :intelligence, default: 0
      t.integer :dexterite, default: 0
      t.integer :force, default: 0
      t.integer :constitution, default: 0
      t.integer :charisme, default: 0
      t.integer :chance, default: 0

      t.timestamps
    end
  end
end
