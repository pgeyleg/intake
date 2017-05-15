FROM 429614120872.dkr.ecr.us-west-2.amazonaws.com/casecommons/ruby

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY release /release
RUN dpkg -i /release/*.deb && rm -rf /release

ENV BUNDLE_PATH /ca_intake/ruby_gems

COPY scripts/release.sh /usr/local/bin/release.sh
RUN chmod +x /usr/local/bin/release.sh

VOLUME ["/ca_intake/public"]

ENTRYPOINT ["release.sh"]
