#!/bin/bash

composer update && 
composer install && 
service apache2 start && 
/root/go/bin/webhook -hooks /var/www/randomBlog/webhooks/hooks.json -verbose 