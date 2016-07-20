require 'sinatra/shopify-sinatra-app'
require 'byebug'
require 'rack/ssl'
require 'webrick'
require 'webrick/https'
require 'openssl'


class SinatraApp < Sinatra::Base
  use Rack::SSL
  register Sinatra::Shopify

  set :scope, 'read_products, read_orders'

  get '/' do
    shopify_session do
      @products = ShopifyAPI::Product.find(:all, params: { limit: 10 })
      erb :home
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
