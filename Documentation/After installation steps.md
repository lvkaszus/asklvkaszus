# After installation steps

When you are done installing Ask @lvkaszus! Project, please follow those steps accordingly to expose this application to world-wide web!

⚠️ WARNING! You will need a domain name and a valid SSL/TLS certificate for it! ⚠️

⚠️ Otherwise, your Anonymous Q&A application will mostly not work because connections to the API Endpoints are with `https://` prefix in application source code and also the Cookies created on Admin Panel page that are stored inside client's browser are with `Secure=True` argument that works only with HTTPS websites!


## Prerequisites

You must have installed all the components from Main installation guide available in `Installation.md` file. If you didn't install anything from there, those instructions will be non-sense to you and your server.


If you didn't opened HTTP and HTTPS ports for incoming traffic to your application server, DO THIS NOW! - If you won't do this, you will have problems with accessing your Anonymous Q&A App instance.


- Open ports `80` and `443` to enable HTTP and HTTPS on your server. For example if you are using FirewallD as your firewall, just use those commands on your server:

```
sudo firewall-cmd --zone=public --permanent --add-port=80/tcp
sudo firewall-cmd --zone=public --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```


# Expose your instance to world-wide web!

Exposing your instance is mandatory step to allow receiving anonymous questions from people or your friends, and also to manage your installed instance! Scroll down to see how to configure NGINX as a Reverse Proxy for Docker or Non-Docker Instance.

## Install and configure NGINX as a Reverse Proxy

### NGINX - for Docker Instance

- If you not installed NGINX binary on your server yet, install it by using this command (I am using Ubuntu and APT Package Manager, edit this command to match your Linux distribution Package Manager):

⚠️ WARNING! You can also use NGINX in Docker if you want and use it that way. My personal choice is NGINX Non-Docker + Apps in Docker. ⚠️ 

`sudo apt install nginx`

- Enable NGINX if it isn't running:

`sudo systemctl enable --now nginx`

- Import your SSL/TLS Certificate files to directory that you would like to use by using SFTP connection or by pasting `.pem` and `.key` file contents to your favourite text editor and save those as `.pem` and `.key` files to use them inside NGINX Configuration files.

- Configure NGINX to serve your Backend API Endpoints and also your Main Frontend and Admin Panel by using your preferred text editor:

`sudo nano /etc/nginx/sites-available/asklvkaszus-stack`

- Paste this NGINX Example Configuration file contents below to your new `asklvkaszus-stack` configuration file and change some entries to match your needs:

```
# Ask @lvkaszus! - Docker NGINX Configuration Stack:

server {
	listen 80;
	listen [::]:80;
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name YOUR_MAIN_FRONTEND_DOMAIN_NAME;   # Must be same that is set in Backend because of CORS!

        ssl_certificate YOUR_CERTIFICATE_FILE_PATH; # Example: /etc/ssl/my_domain_tls_cert.pem
        ssl_certificate_key YOUR_CERTIFICATE_KEY_FILE_PATH; # Example: /etc/ssl/my_domain_tls_cert_key.key

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305";
        ssl_ecdh_curve secp384r1;
        ssl_session_timeout  10m;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;
        ssl_stapling on;
        ssl_stapling_verify on;

        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        server_tokens off;

        location /api/ {
                proxy_pass http://127.0.0.1:3030; # If you changed Backend port during container configuration, please update it!
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header Host $host;
                proxy_http_version 1.1;
                proxy_set_header Connection "";

                # Needed headers to make Q&A working
                proxy_set_header Question $http_question;
                proxy_set_header Authorization $http_authorization;
                proxy_set_header Answer $http_answer;
        }

        location / {
                proxy_pass http://127.0.0.1:3031; # If you changed Frontend port during container configuration, please update it!
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header Host $host;
                proxy_http_version 1.1;
                proxy_set_header Connection "";
        }

        if ($https = '') { return 301 https://$host$request_uri; }
}

server {
	listen 80;
	listen [::]:80;
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name YOUR_ADMIN_FRONTEND_DOMAIN_NAME;   # Must be same that is set in Backend because of CORS!

        ssl_certificate YOUR_CERTIFICATE_FILE_PATH; # Example: /etc/ssl/my_domain_tls_cert.pem
        ssl_certificate_key YOUR_CERTIFICATE_KEY_FILE_PATH; # Example: /etc/ssl/my_domain_tls_cert_key.key

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305";
        ssl_ecdh_curve secp384r1;
        ssl_session_timeout  10m;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;
        ssl_stapling on;
        ssl_stapling_verify on;

        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        server_tokens off;

        location / {
                proxy_pass http://127.0.0.1:3032; # If you changed Admin Panel port during container configuration, please update it!
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header Host $host;
                proxy_http_version 1.1;
                proxy_set_header Connection "";
        }

        if ($https = '') { return 301 https://$host$request_uri; }
}
```

- Save the file and exit your text editor. Create symlink from `sites-available` to `sites-enabled` folder to make this configuration file enabled inside NGINX:

`sudo ln -sf /etc/nginx/sites-available/asklvkaszus-stack /etc/nginx/sites-enabled/asklvkaszus-stack`

- Check your configuration file for errors:

`sudo nginx -t`

- If you see `nginx: the configuration file [...] syntax is ok` message on your screen, you can restart your NGINX server by running this command:

`sudo service nginx restart`

- Your App should be now available when you visit your domain name where you wanted to install this project! If everything works correctly, then congratulations - You Made It!


#### You experienced problems after installation process?

If you experienced any problems after the installation, open and read `Common problems after installation.md` file for further help!

### NGINX - for Non-Docker Instance

- If you not installed NGINX binary on your server yet, install it by using this command (I am using Ubuntu and APT Package Manager, edit this command to match your Linux distribution Package Manager):

`sudo apt install nginx`

- Enable NGINX if it isn't running:

`sudo systemctl enable --now nginx`

- Import your SSL/TLS Certificate files to directory that you would like to use by using SFTP connection or by pasting `.pem` and `.key` file contents to your favourite text editor and save those as `.pem` and `.key` files to use them inside NGINX Configuration files.

- Configure NGINX to serve your Backend API Endpoints and also your Main Frontend and Admin Panel by using your preferred text editor:

`sudo nano /etc/nginx/sites-available/asklvkaszus-stack`

- Paste this NGINX Example Configuration file contents below to your new `asklvkaszus-stack` configuration file and change some entries to match your needs:

```
# Ask @lvkaszus! - Non-Docker NGINX Configuration Stack:

server {
	listen 80;
	listen [::]:80;
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name YOUR_MAIN_FRONTEND_DOMAIN_NAME;   # Must be same that is inside asklvkaszus-backend.py file because of CORS!

        ssl_certificate YOUR_CERTIFICATE_FILE_PATH; # Example: /etc/ssl/my_domain_tls_cert.pem
        ssl_certificate_key YOUR_CERTIFICATE_KEY_FILE_PATH; # Example: /etc/ssl/my_domain_tls_cert_key.key

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305";
        ssl_ecdh_curve secp384r1;
        ssl_session_timeout  10m;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;
        ssl_stapling on;
        ssl_stapling_verify on;

        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        server_tokens off;

        location /api/ {
                proxy_pass http://127.0.0.1:3030; # If you changed Backend port in gunicorn_config.py file, please update it!
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header Host $host;
                proxy_http_version 1.1;
                proxy_set_header Connection "";

                # Needed headers to make Q&A working
                proxy_set_header Question $http_question;
                proxy_set_header Authorization $http_authorization;
                proxy_set_header Answer $http_answer;
        }

        location / {
                root /var/www/asklvkaszus-frontend; # If you specified other directory than this while installing Frontend, please update it!
                index index.html
        }

        if ($https = '') { return 301 https://$host$request_uri; }
}

server {
	listen 80;
	listen [::]:80;
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name YOUR_ADMIN_FRONTEND_DOMAIN_NAME;   # Must be same that is inside asklvkaszus-backend.py file because of CORS!

        ssl_certificate YOUR_CERTIFICATE_FILE_PATH; # Example: /etc/ssl/my_domain_tls_cert.pem
        ssl_certificate_key YOUR_CERTIFICATE_KEY_FILE_PATH; # Example: /etc/ssl/my_domain_tls_cert_key.key

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305";
        ssl_ecdh_curve secp384r1;
        ssl_session_timeout  10m;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;
        ssl_stapling on;
        ssl_stapling_verify on;

        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        server_tokens off;

        location / {
                root /var/www/asklvkaszus-admin; # If you specified other directory than this while installing Admin Panel, please update it!
                index index.html;
        }

        if ($https = '') { return 301 https://$host$request_uri; }
}
```

- Save the file and exit your text editor. Create symlink from `sites-available` to `sites-enabled` folder to make this configuration file enabled inside NGINX:

`sudo ln -sf /etc/nginx/sites-available/asklvkaszus-stack /etc/nginx/sites-enabled/asklvkaszus-stack`

- Check your configuration file for errors:

`sudo nginx -t`

- If you see `nginx: the configuration file [...] syntax is ok` message on your screen, you must fix permissions for your Frontend and Admin Panel static files:

```
sudo chown -R www-data:www-data /var/www/asklvkaszus-frontend # If you specified other directory than this while installing Frontend, please update it!
sudo chown -R www-data:www-data /var/www/asklvkaszus-admin # If you specified other directory than this while installing Admin Panel, please update it!
```
- Finally, restart your NGINX server by running this command:

`sudo service nginx restart`

- Your App should be now available when you visit your domain name where you wanted to install this project! If everything works correctly, then congratulations - You Made It!


#### You experienced problems after installation process?

If you experienced any problems after the installation, open and read `Common problems after installation.md` file for further help!