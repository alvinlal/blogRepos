#!/bin/bash
cp ./views/maintenance.html maintenance.html &&
git pull origin master &&
composer update && composer install &&
rm maintenance.html &&
echo "app updated successfully"



