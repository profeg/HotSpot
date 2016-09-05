class AddPositionToHotspots < ActiveRecord::Migration
  def self.up

    add_column :hotspots, :position, :string
  end

  def self.down
    remove_column :hotspots, :position
  end
end
