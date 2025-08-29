#!/bin/sh
echo "window.env = {" > /usr/share/nginx/html/assets/env-config.js
for var in $(env | grep ^REACT_APP_); do
  var_name=$(echo "$var" | cut -d= -f1)
  var_value=$(echo "$var" | cut -d= -f2-)
  echo "  $var_name: \"$var_value\"," >> /usr/share/nginx/html/assets/env-config.js
done
echo "};" >> /usr/share/nginx/html/assets/env-config.js
