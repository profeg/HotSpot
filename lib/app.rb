require 'sinatra/shopify-sinatra-app'
require 'byebug'
require 'pry'
require 'rack/ssl'
require 'webrick'
require 'webrick/https'
require 'openssl'
require 'json'
require 'active_record'
require './lib/hotspot_image'
require './lib/hotspot'

class SinatraApp < Sinatra::Base
  use Rack::SSL
  register Sinatra::Shopify
  
  set :scope, 'read_products, read_orders'
  set :database, 'mysql2://debian-sys-maint:HKXxztpJSQvQtqrD@localhost/hotspot_dev'
  get '/' do
    shopify_session do
      erb :home
    end
  end

  get '/products.json' do
    shopify_session do
      @products = ShopifyAPI::Product.find(:all, params: { limit: 250 }) 
      content_type :json
        @products.to_json
    end
  end

  get '/collections.json' do
    shopify_session do
      @collections = ShopifyAPI::CustomCollection.all
      binding.pry
      content_type :json
        @collections.to_json
    end
  end

  post '/create_hotspot_image' do
    webhook_session do |params|
      if @hotspot_image = HotspotImage.create( file: "img/sofa.jpg" )
        flash[:notice] = "Hotspot Image succesfully added!"
        content_type :json
          @hotspot_image.to_json
      end  
    end
  end

  post '/create_hotspot' do
    webhook_session do |params|
      if Hotspot.create x: params[:x], y: params[:x], icon_scale: params[:x], hotspot_image_id: params[:hotspot_image_id]
        flash[:notice] = "Hotspot succesfully added!"
      end
      
    end
  end


  post '/uninstall' do
    webhook_session do |params|
      current_shop.destroy
    end
  end

  CERT_PATH = '/opt/myCA/'
  webrick_options = {
    :Port               => 8443,
    :Logger             => WEBrick::Log::new($stderr, WEBrick::Log::DEBUG),
    :DocumentRoot       => "/ruby/htdocs",
    :SSLEnable          => true,
    :SSLVerifyClient    => OpenSSL::SSL::VERIFY_NONE,
    :SSLCertificate     => OpenSSL::X509::Certificate.new(  File.open(File.join(CERT_PATH, "server.crt")).read),
    :SSLPrivateKey      => OpenSSL::PKey::RSA.new(          File.open(File.join(CERT_PATH, "server.key")).read),
    :SSLCertName        => [ [ "CN",WEBrick::Utils::getservername ] ],
    :app                => SinatraApp
  }
  Rack::Server.start webrick_options

  

  private

  def after_shopify_auth
  end
end
