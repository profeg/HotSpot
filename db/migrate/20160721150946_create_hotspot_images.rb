class CreateHotspotImages < ActiveRecord::Migration
	def self.up
    create_table :hotspot_images do |t|
			t.string :file_link
			t.timestamps
		end
  end

  def self.down
    drop_table :hotspot_images
  end
end
