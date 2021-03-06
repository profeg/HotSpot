require 'sinatra/shopify-sinatra-app'
require 'byebug'
require 'pry'
require 'rack/ssl'
require 'webrick'
require 'webrick/https'
require 'openssl'
require 'json'
require 'active_record'
require 'carrierwave'
require 'carrierwave/orm/activerecord'
require './lib/hotspot_image'
require './lib/hotspot'
require './lib/interface'
require './lib/hotspot_collection'

class SinatraApp < Sinatra::Base
  # use Rack::SSL
  register Sinatra::Shopify

  before '/gallery_hotspot_collection_json/:collection_id' do
    content_type :json
    headers 'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
  end

  before '/slider_hotspot_collection_json/:collection_id' do
    content_type :json
    headers 'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
  end

  set :scope, 'read_products, read_orders'
  # Change DB in production
  # set :database, 'mysql2://debian-sys-maint:HKXxztpJSQvQtqrD@localhost/hotspot_dev'
  set :database, 'mysql2://debian-sys-maint:TThoEfMEJBMhgQnG@localhost/hotspot_dev'
  get '/' do
    shopify_session do
      erb :home
    end
  end

  get '/products.json' do
    shopify_session do
      @products = ShopifyAPI::Product.find(:all, params: {limit: 250})
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

  get '/hotspot_collection.json/:collection_id' do
    shopify_session do
      @hotspot_collections = HotspotCollection.find_by(collection_id: params[:collection_id])
      content_type :json
      @hotspot_collections.to_json
    end
  end

  get '/interface.json/:id' do
    shopify_session do
      Interface.find(params['id']).to_json
    end
  end

  get '/interfaces.json/:hotspot_collection_id' do
    shopify_session do
      @interfaces = Interface.where(hotspot_collection_id: params[:hotspot_collection_id])
      @interfaces.to_json
    end
  end

  get '/hotspots.json/:interface_id' do
    shopify_session do
      @hotspots = Hotspot.where interface_id: params[:interface_id]
      @hotspots.to_json
    end
  end

  post '/save_hotspot_collection' do
    shopify_session do
      params = JSON.parse request.body.read
      if @hotspot_collection = HotspotCollection.find_by(collection_id: params['collection_id'])
        @hotspot_collection.update_attributes params
      else
        HotspotCollection.create(title: params['title'], collection_id: params['collection_id']) # params here
      end
    end
  end

  post '/save_interface' do
    shopify_session do
      params = JSON.parse request.body.read
      if @interface = Interface.find_by(hotspot_collection_id: params['collection_id'], title: params['title'], image: params['image'])
        @interface.update_attributes({
                                         hotspot_collection_id: params['collection_id'],
                                         title: params['title']
                                     })
      else
        @interface = Interface.create(hotspot_collection_id: params['collection_id'], title: params['title'], image: params['image'])
      end
      @hotspot_collection = HotspotCollection.find params['collection_id']
      @hotspot_collection.interfaces << @interface
      @hotspot_collection.save
    end
  end

  post '/save_hotspots' do
    shopify_session do
      params = JSON.parse request.body.read
      @interface = Interface.find params['interface_id']
      @hotspots = params['hotspots']
      @hotspots.collect do |hotspot|
        if hotspot['id'].blank?
          Hotspot.create(x: hotspot['x'], y: hotspot['y'], icon_scale: hotspot['icon_scale'], image: hotspot['image'],
                         description: hotspot['description'], price: hotspot['price'], link_to: hotspot['link_to'],
                         interface_id: params['interface_id'], position: hotspot['position'])
        else
          @hotspot = Hotspot.find(hotspot['id'])
          @hotspot.update_attributes(x: hotspot['x'], y: hotspot['y'], icon_scale: hotspot['icon_scale'], image: hotspot['image'],
                                     description: hotspot['description'], price: hotspot['price'],
                                     link_to: hotspot['link_to'], position: hotspot['position'])
        end
      end
    end
  end

  post '/delete_hotspot/:id' do
    shopify_session do
      @hotspot = Hotspot.find(params[:id])
      @hotspot.destroy
    end
  end

  get '/gallery_hotspot_collection_json/:collection_id' do
    get_hotspots_json(params)
    content_type :json
    @json_hotspots.to_json
  end

  get '/slider_hotspot_collection_json/:collection_id' do
    get_hotspots_json(params)
    content_type :json
    @json_hotspots.to_json
  end

  post '/upload_hotspot_image' do
    hotspot = Hotspot.find(params[:hotspot_id])
    hotspot.image = params[:image]
    hotspot.save
    redirect to('/')
  end


  post '/uninstall' do
    webhook_session do |params|
      current_shop.destroy
    end
  end

  # CERT_PATH = '/opt/myCA/'
  # webrick_options = {
  #   :Port               => 8443,
  #   :Logger             => WEBrick::Log::new($stderr, WEBrick::Log::DEBUG),
  #   :DocumentRoot       => "/home/prof/Documents/HotSpot",
  #   :SSLEnable          => true,
  #   :SSLVerifyClient    => OpenSSL::SSL::VERIFY_NONE,
  #   :SSLCertificate     => OpenSSL::X509::Certificate.new(  File.open(File.join(CERT_PATH, "server.crt")).read),
  #   :SSLPrivateKey      => OpenSSL::PKey::RSA.new(          File.open(File.join(CERT_PATH, "server.key")).read),
  #   :SSLCertName        => [ [ "CN",WEBrick::Utils::getservername ] ],
  #   :app                => SinatraApp
  # }
  # Rack::Server.start webrick_options


  private

  def after_shopify_auth
  end

  def get_hotspots_json(params)
    @json_hotspots = []
    @collection_id = params[:collection_id]
    @hotspot_collection = HotspotCollection.find_by(collection_id: @collection_id)
    unless @hotspot_collection.nil?
      @interface = Interface.find_by(hotspot_collection_id: @hotspot_collection.id, title: params[:title])
      @hotspots = Hotspot.where(interface_id: @interface.id)
      @hotspots.each_with_index do |hotspot, index|
        @json_hotspots[index] = { 'hotspot_id' => hotspot.id, 'collection_id' => @collection_id, 'x' => hotspot.x,
                                  'y' => hotspot.y, 'icon_scale' => hotspot.icon_scale, 'description' => hotspot.description,
                                  'price' => hotspot.price, 'link_to' => hotspot.link_to, 'image' => hotspot.image.url,
                                  'position' => hotspot.position }
      end
    end
  end

end
