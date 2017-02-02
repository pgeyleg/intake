# frozen_string_literal: true
require 'rails_helper'

describe WelcomeController do
  describe '#index' do
    context 'when the user has a valid session' do
      before do
        session['security_token'] = 'My Test Token'
      end

      it 'responds with success' do
        process :index, method: :get
        assert_response :success
        expect(response).to render_template('index')
      end
    end

    context 'when the user has no session' do
      let(:authentication_url) { 'http://foo.com' }
      let(:login_url) { "#{authentication_url}/authn/login" }
      let(:validation_url) { "#{authentication_url}/authn/validate" }

      before do
        allow(ENV).to receive(:fetch).with('AUTHENTICATION_URL')
          .and_return(authentication_url)
      end

      context 'and no security token is provided' do
        it 'redirects to authentication service' do
          process :index, method: :get
          expect(response).to redirect_to("#{login_url}?callback=#{request.original_url}")
        end
      end

      context 'and a valid security token is provided' do
        before do
          stub_request(:get, "#{validation_url}?token=123")
            .and_return(status: 200)
        end

        it 'the security token is validated' do
          process :index, method: :get, params: { token: '123' }
          expect(a_request(:get, "#{validation_url}?token=123")).to have_been_made
        end

        it 'renders the index template' do
          process :index, method: :get, params: { token: '123' }
          expect(response).to render_template('index')
        end
      end

      context 'and an invalid security token is provided' do
        before do
          stub_request(:get, "#{validation_url}?token=123")
            .and_return(status: 401)
        end

        it 'the security token is validated' do
          process :index, method: :get, params: { token: '123' }
          expect(a_request(:get, "#{validation_url}?token=123")).to have_been_made
        end

        it 'redirects to authentication service' do
          process :index, method: :get, params: { token: '123' }
          expect(response).to redirect_to("#{login_url}?callback=#{request.original_url}")
        end
      end
    end
  end
end
