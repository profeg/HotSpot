class HotspotCollection < ActiveRecord::Base
  has_many :interfaces
  belongs_to :interface
end