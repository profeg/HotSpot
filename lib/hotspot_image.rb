class HotspotImage < ActiveRecord::Base
	has_many :hotspots
	belongs_to :interface
end