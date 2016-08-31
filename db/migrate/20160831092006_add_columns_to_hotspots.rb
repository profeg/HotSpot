class AddColumnsToHotspots < ActiveRecord::Migration
  def self.up
    add_column :hotspots, :image, :string
    add_column :hotspots, :description, :string
    add_column :hotspots, :price, :integer
    add_column :hotspots, :link_to, :string
  end

  def self.down
    remove_column :hotspots, :image
    remove_column :hotspots, :description
    remove_column :hotspots, :price
    remove_column :hotspots, :link_to
  end
end
