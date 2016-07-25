class CreateHotspotCustomCollections < ActiveRecord::Migration
	def self.up
		create_table :hotspot_custom_collections do |t|
			t.string :title
			t.string :icon
			t.integer :custom_collection_id
			t.belongs_to  :interface, index: true, foreign_key: 'interface_id'
			t.timestamps
		end
	end

	def self.down
		drop_table :hotspot_custom_collections
	end
end
