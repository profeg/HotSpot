class CreateHotspotCollections < ActiveRecord::Migration
	def self.up
		create_table :hotspot_collections do |t|
			t.string :title
			t.string :icon
			t.integer :collection_id
			t.belongs_to  :interface, index: true, foreign_key: 'interface_id'
			t.timestamps
		end
	end

	def self.down
		drop_table :hotspot_collections
	end
end
