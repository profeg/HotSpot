class CreateInterfaces < ActiveRecord::Migration
	def self.up
		create_table :interfaces do |t|
			t.string :title
			t.string :template
			t.string :icon
			t.belongs_to  :hotspot_custom_collection, index: true, foreign_key: 'collection_id'
			t.timestamps
		end
	end

	def self.down
		drop_table :interfaces
	end
end
