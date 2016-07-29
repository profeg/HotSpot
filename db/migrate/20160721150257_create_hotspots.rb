class CreateHotspots < ActiveRecord::Migration
	def self.up
    create_table :hotspots do |t|
    	t.integer 		:x
  		t.integer 		:y
  		t.float   		:icon_scale
  		t.belongs_to  :interface, index: true, foreign_key: 'interface_id'
      t.timestamps
    end
  end

  def self.down
    drop_table :hotspots
  end
end
