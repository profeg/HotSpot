class CreateHotspots < ActiveRecord::Migration
	def self.up
    create_table :hotspots do |t|
    	t.integer 		:x
  		t.integer 		:y
  		t.float   		:icon_scale
  		t.belongs_to 	:hotspot_image, index: true, foreign_key: 'hotspot_image_id'
      t.timestamps
    end
  end

  def self.down
    drop_table :hotspots
  end
end
