New Shopify-Sinatra-App
=======================

1. Clone
1.1 Create database.yml like this:
	development:
	  adapter: mysql2
	  encoding: utf8
	  database: hotspot_dev
	  username: user
	  password: password 
	  host: 127.0.0.1
	  port: 3306

	test:
	  adapter: mysql2
	  encoding: utf8
	  database: hotspot_test
	  username: user
	  password: password
	  host: 127.0.0.1
	  port: 3306
1.2 Fill in .env file
	SHOPIFY_API_KEY=your_api_key
	SHOPIFY_SHARED_SECRET=your_shared_secret
	SHOPIFY_REDIRECT_URI=https://localhost:8443/auth/shopify/callback
	SECRET="arbitrarysecretstring"

2. Bundle 
3. bundle exec rake db:setup
3. Run with: foreman run bundle exec rackup config.ru
4. Visit https://localhost:8443
