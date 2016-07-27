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
require './lib/interface'
require './lib/hotspot_custom_collection'

class SinatraApp < Sinatra::Base
  use Rack::SSL
  register Sinatra::Shopify
  
  set :scope, 'read_products, read_orders'
  # Change DB in production
  set :database, 'mysql2://'+ ENV['mysql_user'] + ':'  + ENV['mysql_pass'] + '@localhost/hotspot_dev' 
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
      content_type :json
        @collections.to_json
    end
  end

  get '/hotspot_collection.json/:custom_collection_id' do
    shopify_session do
      @hotspot_collections = HotspotCustomCollection.find_by( custom_collection_id: params[:custom_collection_id] )
      content_type :json
        @hotspot_collections.to_json
    end
  end

  get '/interface.json/:hotspot_collection_id' do
    shopify_session do
      @interface = Interface.find_by( collection_id: params[:hotspot_collection_id] )
        @interface.to_json
    end
  end

  post '/save_hotspot_collection' do
    shopify_session do
      params = JSON.parse request.body.read
      if @hotspot_collection = HotspotCustomCollection.find_by( custom_collection_id: params['custom_collection_id'] )
        @hotspot_collection.update_attributes params
        flash[:notice] = "Hotspot collection succesfully saved!"
      else
        if @hotspot_collection = HotspotCustomCollection.create( title: params['title'], custom_collection_id: params['custom_collection_id'] ) # params here
          flash[:notice] = "Hotspot collection succesfully created!"
        end
      end  
    end
  end

  put '/update_hotspot_collection' do
    shopify_session do
      params = JSON.parse request.body.read
      if @hotspot_collection = HotspotCustomCollection.find( params['id'] )
        @hotspot_collection.update_attributes params
        flash[:notice] = "Hotspot collection succesfully added!"
      end  
    end
  end

  post '/create_interface' do
    webhook_session do |params|
      if @interface = Interface.create( collection_id: params[:collection_id]) # params here
        flash[:notice] = "Interface succesfully added!"
        content_type :json
          @interface.to_json
      end  
    end
  end

  post '/create_hotspot_image' do
    shopify_session do
      if @hotspot_image = HotspotImage.create( interface_id: params[:interface_id] )
        flash[:notice] = "Hotspot Image succesfully added!"
        content_type :json
          @hotspot_image.to_json
      end  
    end
  end

  post '/create_hotspot' do
    shopify_session do
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
    :DocumentRoot       => "/home/prof/Documents/HotSpot",
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
