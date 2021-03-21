# specifying base image as latest version of ubuntu
FROM ubuntu:latest

# setting timezone in an environment variable named TZ , this will be used by tzdata (an ubuntu package) for setting timezone
ENV TZ=Asia/Kolkata

# writing TZ into etc/localtime and etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# upgrading our packages and installing required tools and dependencies from apt
RUN apt-get update && apt-get upgrade -y \
    && apt-get install git -y\
    && apt-get install curl -y\
    && apt-get install zip unzip -y\
    && apt-get install wget -y\
    && apt-get install apache2 -y\
    && apt-get install php libapache2-mod-php php-mysql php-curl -y 

# downloading composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# setting which version of dockerize to install in an env variable
ENV DOCKERIZE_VERSION v0.6.1

# downloading and installing dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# downloading go
RUN wget https://dl.google.com/go/go1.16.linux-amd64.tar.gz

# extracting go
RUN tar -C /usr/local -xzf go1.16.linux-amd64.tar.gz   

# installing go and installing webhook package from github
RUN export PATH=$PATH:/usr/local/go/bin && go get github.com/adnanh/webhook

# copying apache configuration file
COPY ./randomBlog.conf /etc/apache2/sites-available/

# setting ServerName variable in apache config 
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# making root directory of our app
RUN mkdir /var/www/randomBlog

# enabling rewrite engine in apache
RUN a2enmod rewrite

# enabling our app
RUN a2ensite randomBlog

# removing default apache site
RUN a2dissite 000-default

# checking for syntax errors in our apache configurations
RUN apache2ctl configtest

# restarting apache to apply our changes
RUN service apache2 restart

# change working directory to our app directory
WORKDIR /var/www/randomBlog

# copy our app files to our containers app folder
COPY . .

# giving ownership to apache
RUN chown -R www-data:www-data /var/www/randomBlog

# make start script executable
RUN chmod +x start.sh

# make deploy script executable
RUN chmod +x ./webhooks/deploy.sh

# making dockerize wait for mysql container to be up
CMD dockerize -wait tcp://mysql:3306 -timeout 3000s ./start.sh



