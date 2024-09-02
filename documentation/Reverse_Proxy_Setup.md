<div align="center">
<h1>Ask @lvkaszus!</h1>
<h3>Documentation describing the steps and process of configuring a reverse proxy to serve your application installed before.</h3>
</div>

<div align="center">
<h2>Selecting a Reverse Proxy</h2>
<p>Choose one of those reverse proxies below:</p>
</div>

1. [**NGINX**](#nginx)   
   Follow this method to set up the reverse proxy for this application using NGINX, a high performance web server and reverse proxy known for its simplicity of configuration, speed, efficiency, and low resource usage.

2. **More reverse proxy options soon!**

<div id="nginx" align="center">
<h2>Using NGINX as a Reverse Proxy</h2>
<p>NGINX is a good choice for using it not only as a web server, but also as a reverse proxy. This method is ideal if you want a streamlined setup with clear directives and configurations for handling web traffic, all managed through a single or multiple configuration files depending on your current configuration.</p>
</div>

1. **If you haven't installed [NGINX](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#installing-a-prebuilt-package), do it now!**

2. **If you're using HTTPS, generate a DH parameters file for better security.**

- `sudo openssl dhparam -out /etc/nginx/dhparams.pem 4096`

3. **Create and open a new NGINX Configuration File named `asklvkaszus` in `/etc/nginx/sites-available/` folder with your favourite text editor.**

- `sudo nano /etc/nginx/sites-available/asklvkaszus`

4. **Update required configuration inside `/etc/nginx/sites-available/asklvkaszus` file to match your setup.**

```
server {
        listen 80;
        listen [::]: 80;

        # Enable only when you are using HTTPS!     
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name domain.tld; # Update to your domain where you want to host this application.

        error_log /var/log/nginx/error.log;

        # Enable only when you are using HTTPS!    
        ssl_certificate /etc/ssl/domain.tld/fullchain.pem; # Update to your full certificate file path for your domain.
        ssl_certificate_key /etc/ssl/domain.tld/privkey.pem; # Update to your certificate key file path for your domain.

        # Additional security configuration below.

        # Update to your domain where you want to host this application.
        if ($host != "domain.tld") {
                return 444;
        }

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384';
        ssl_dhparam /etc/nginx/dhparams.pem; # Update to your DH parameters file path.
        ssl_ecdh_curve secp384r1;
        ssl_session_timeout  10m;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;
        ssl_stapling on;
        ssl_stapling_verify on;

        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
        add_header Referrer-Policy "same-origin";
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "0";

        server_tokens off;

        # Application Backend endpoint configuration below.
        location /api {
                proxy_pass http://127.0.0.1:3030;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header Host $host;
                proxy_http_version 1.1;
                proxy_set_header Connection "";
                proxy_set_header Authorization $http_authorization;
        }
        
        # Application Frontend endpoint configuration below.
        location / {
                proxy_pass http://127.0.0.1:3031;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header Host $host;
                proxy_http_version 1.1;
                proxy_set_header Connection "";
        }

        # Optional robots.txt file for blocking crawlers and other internet bots from crawling and indexing your application to be available in search engines results.
        location /robots.txt {
                default_type text/plain;
                return 200 "User-agent: *\nDisallow: /";
        }

        # Enable only when you are using HTTPS!
        if ($https = '') {
            return 301 https://$host$request_uri;
        }
}
```

5. **Enable your new NGINX Configuration.**

- `sudo ln -sf /etc/nginx/sites-available/asklvkaszus /etc/nginx/sites-enabled/asklvkaszus`

6. **Verify NGINX Configuration. If it returns `OK`, your configuration has no errors.**

- `sudo nginx -t`

7. **When NGINX is already running, restart it to apply your new configuration. When NGINX is not already running, start it with your new configuration.**

- Restarting NGINX Server:  
  `sudo systemctl restart nginx`

- Starting NGINX Server:  
  `sudo systemctl start nginx`

8. **Enable NGINX Server to run at server startup.**

- `sudo systemctl enable nginx`

<div align="center">

And from now, your NGINX Reverse Proxy should be up and running, serving your installed application before!

</div>