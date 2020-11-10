class CreateMarkers < ActiveRecord::Migration[6.0]
  def change
    create_table :markers do |t|
      t.string :name
      t.float :x
      t.float :y
      t.references :map, null: false, foreign_key: true

      t.timestamps
    end
  end
end
