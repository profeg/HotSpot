class Interface < ActiveRecord::Base
	has_many :hotspot_images
	belongs_to :hotspot_custom_collection
end