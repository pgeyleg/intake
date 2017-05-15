FROM 429614120872.dkr.ecr.us-west-2.amazonaws.com/casecommons/ruby

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ENV BUNDLE_PATH /ca_intake/ruby_gems

RUN gem install bundler
COPY Gemfile Gemfile.lock ./
COPY package.json ./

RUN bundle install -j24
RUN npm install --spin=false

RUN mkdir /build_artefacts
COPY scripts/build.sh /usr/local/bin/build.sh
RUN chmod +x /usr/local/bin/build.sh

COPY . ./
