class AddSkillToMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :messages, :skill, :string
  end
end
