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

ActiveRecord::Schema.define(version: 20160725100709) do

  create_table "hotspot_custom_collections", force: true do |t|
    t.string   "title"
    t.string   "template"
    t.string   "icon"
    t.integer  "custom_collection_id"
    t.integer  "interface_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "hotspot_custom_collections", ["interface_id"], name: "index_hotspot_custom_collections_on_interface_id", using: :btree

  create_table "hotspot_images", force: true do |t|
    t.integer  "interface_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "hotspot_images", ["interface_id"], name: "index_hotspot_images_on_interface_id", using: :btree

  create_table "hotspots", force: true do |t|
    t.integer  "x"
    t.integer  "y"
    t.float    "icon_scale",       limit: 24
    t.integer  "hotspot_image_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "hotspots", ["hotspot_image_id"], name: "index_hotspots_on_hotspot_image_id", using: :btree

  create_table "interfaces", force: true do |t|
    t.string   "title"
    t.string   "template"
    t.string   "icon"
    t.integer  "hotspot_custom_collection_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "interfaces", ["hotspot_custom_collection_id"], name: "index_interfaces_on_hotspot_custom_collection_id", using: :btree

  create_table "shops", force: true do |t|
    t.string "name"
    t.string "token_encrypted"
  end

  add_index "shops", ["name"], name: "index_shops_on_name", using: :btree

end
