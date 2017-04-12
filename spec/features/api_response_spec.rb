# frozen_string_literal: true
require 'rails_helper'
require 'feature/testing'

feature 'api responses' do
  let(:screening) { create :screening, name: 'Little Shop Of Horrors' }

  scenario 'API returns a 403', accessibility: false do
    stub_request(:get, api_screenings_path).and_return(
      body: { screenings: [] }.to_json,
      status: 200,
      headers: { 'Content-Type' => 'application/json' }
    )
    visit root_path
    base_url = ENV.fetch('AUTHENTICATION_URL').chomp('/')
    redirect_url = CGI.escape("#{page.current_url.chomp('/')}#{screening_path(screening.id)}")
    login_url = "#{base_url}/authn/login?callback=#{redirect_url}"

    stub_request(:get, api_screening_path(screening.id)).and_return(body: 'I failed', status: 403)
    visit screening_path(id: screening.id)

    # have_current_path waits for the async call to finish, but doesn't verify url params
    # comparing the current_url to login_url compares the full strings
    # though these expectations look identical, we really do need both of them
    expect(page).to have_current_path(login_url, url: true)
    expect(page.current_url).to eq(login_url)
  end

  scenario 'API returns an error other than 403' do
    stub_request(:get, api_screening_path(screening.id)).and_return(
      body: 'I failed',
      status: 500
    )
    visit screening_path(id: screening.id)
    expect(page).to_not have_content(screening.name)
    expect(page.current_url).to have_content screening_path(screening.id)
  end

  scenario 'API returns a success' do
    stub_request(:get, api_screening_path(screening.id)).and_return(
      body: screening.to_json,
      status: 200,
      headers: { 'Content-Type' => 'application/json' }
    )
    visit screening_path(id: screening.id)
    expect(page).to have_content(screening.name)
    expect(page.current_url).to have_content screening_path(screening.id)
  end
end
