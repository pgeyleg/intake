FROM 429614120872.dkr.ecr.us-west-2.amazonaws.com/casecommons/ruby
MAINTAINER Pema Geyleg <pema@casecommons.org>
HEALTHCHECK --interval=3s --retries=20 CMD ${HEALTHCHECK:-curl -fs localhost:${HTTP_PORT:-3000}}

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY release /release
RUN dpkg -i /release/*.deb && rm -rf /release

ENV BUNDLE_PATH /ca_intake/ruby_gems

VOLUME ["/ca_intake/public"]

CMD ["bundle","exec","puma","-e","production","-C","config/puma.rb"]
