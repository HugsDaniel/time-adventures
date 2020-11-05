# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_11_05_205657) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "characters", force: :cascade do |t|
    t.string "name"
    t.integer "life", default: 0
    t.integer "perception", default: 0
    t.integer "intelligence", default: 0
    t.integer "dexterite", default: 0
    t.integer "force", default: 0
    t.integer "constitution", default: 0
    t.integer "charisme", default: 0
    t.integer "chance", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "max_life", default: 0
    t.text "inventory"
  end

  create_table "messages", force: :cascade do |t|
    t.string "author"
    t.text "content"
    t.boolean "launch"
    t.integer "difficulty"
    t.boolean "success"
    t.integer "result"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "skill"
  end

  create_table "special_skills", force: :cascade do |t|
    t.string "name"
    t.integer "value"
    t.bigint "character_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["character_id"], name: "index_special_skills_on_character_id"
  end

  add_foreign_key "special_skills", "characters"
end
