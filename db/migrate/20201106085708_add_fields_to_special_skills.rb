class AddFieldsToSpecialSkills < ActiveRecord::Migration[6.0]
  def change
    add_column :special_skills, :skill, :string
    add_column :special_skills, :factor, :integer, default: 1
  end
end
