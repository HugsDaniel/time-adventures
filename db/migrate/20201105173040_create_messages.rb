class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.string :author
      t.text :content
      t.boolean :launch
      t.integer :difficulty
      t.boolean :success
      t.integer :result

      t.timestamps
    end
  end
end
