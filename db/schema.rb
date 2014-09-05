# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140905145859) do

  create_table "ontologies", force: true do |t|
    t.string   "prefix"
    t.string   "address"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.text     "description"
  end

  add_index "ontologies", ["prefix"], name: "index_ontologies_on_prefix", unique: true

  create_table "products", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "t_json_entities", force: true do |t|
    t.string   "name"
    t.integer  "ontology_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "wizard_app_jsons", force: true do |t|
    t.string   "name"
    t.integer  "ontology_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "wizard_apps", force: true do |t|
    t.string   "name"
    t.integer  "ontology_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "wizard_step_options", force: true do |t|
    t.string   "message"
    t.integer  "wizard_step_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "next_wizard_step_id"
  end

  create_table "wizard_steps", force: true do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "back"
  end

end
