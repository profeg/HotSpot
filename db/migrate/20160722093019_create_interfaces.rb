class CreateInterfaces < ActiveRecord::Migration
	def self.up
		create_table :interfaces do |t|
			t.string :title
			t.string :template
			t.string :icon
			t.string :collections
			t.string :file_link
			t.timestamps
		end
	end

	def self.down
		drop_table :interfaces
	end
end
