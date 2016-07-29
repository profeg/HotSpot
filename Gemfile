source 'https://rubygems.org'
ruby "2.2.2"

gem 'shopify-sinatra-app', '~> 0.3.0'
gem 'activerecord'
gem 'sinatra-activerecord'
gem 'mysql2', '~> 0.3.20'
gem 'rack-flash3', require: 'rack-flash'
gem 'rack-ssl'
gem 'json'
gem 'carrierwave'

group :production do
end

group :development, :test do
  gem 'byebug'
  gem 'pry'
  gem 'pry-byebug'
end

group :development do
  gem 'rake'
  gem 'foreman'
  gem 'dotenv'
end

group :test do
  gem 'mocha', require: false
  gem 'minitest'
  gem 'rack-test'
  gem 'fakeweb'
end
