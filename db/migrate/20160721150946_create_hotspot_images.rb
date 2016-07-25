class CreateHotspotImages < ActiveRecord::Migration
	def self.up
    create_table :hotspot_images do |t|
    		t.belongs_to  :interface, index: true, foreign_key: 'interface_id'
			t.timestamps
		end
  end

  def self.down
    drop_table :hotspot_images
  end
end
