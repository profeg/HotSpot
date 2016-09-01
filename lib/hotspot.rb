require './lib/uploaders/image_uploader'
class Hotspot < ActiveRecord::Base
  belongs_to :interface

  mount_uploader :image, ImageUploader

end