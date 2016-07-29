class Interface < ActiveRecord::Base
	has_many :hotspots
	belongs_to :hotspot_collection
end