FROM ubuntu:latest

ENV TZ=Asia/Kolkata

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get upgrade -y \
    && apt-get install git -y\
    && apt-get install curl -y\
    && apt-get install zip unzip -y\
    && apt-get install wget -y\
    && apt-get install apache2 -y\
    && apt-get install ufw -y\
    && apt-get install php libapache2-mod-php php-mysql php-curl -y 

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ENV DOCKERIZE_VERSION v0.6.1

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN wget https://dl.google.com/go/go1.16.linux-amd64.tar.gz

RUN tar -C /usr/local -xzf go1.16.linux-amd64.tar.gz   

RUN export PATH=$PATH:/usr/local/go/bin && go get github.com/adnanh/webhook

COPY ./randomBlog.conf /etc/apache2/sites-available/

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN mkdir /var/www/randomBlog

RUN a2enmod rewrite

RUN a2ensite randomBlog

RUN a2dissite 000-default

RUN apache2ctl configtest

RUN service apache2 restart

WORKDIR /var/www/randomBlog

COPY . .

RUN chown -R www-data:www-data /var/www/randomBlog

RUN chmod +x start.sh

RUN chmod +x ./webhooks/deploy.sh

EXPOSE 80

CMD dockerize -wait tcp://mysql:3306 -timeout 3000s ./start.sh



