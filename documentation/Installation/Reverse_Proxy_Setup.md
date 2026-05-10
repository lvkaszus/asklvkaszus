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

2. [**Apache2**](#apache2)   
   Follow this method to set up the reverse proxy for this application using Apache2, an older, but still widely used web server. It offers a lot of features and flexibility, though it can sometimes be slower and more resource-intensive compared to newer alternatives like NGINX. It's reliable, but requires more configuration to achieve the same performance.

3. [**HAProxy**](#haproxy)   
   Available Soon!

4. [**Traefik**](#traefik)   
   Available Soon!

5. [**Caddy**](#caddy)   
   Available Soon!

<p align="center"><u>The commands provided in this guide are based on Debian, Ubuntu and other based distributions.</u></p>

---

## ⚠️ HTTPS (TLS) Configuration

> This guide covers HTTP setup only!  
> For production deployments, HTTPS is strongly recommended!

[Continue to HTTPS Configuration Guide](./HTTPS_Configuration.md)

---

<div id="nginx" align="center"> 
<h2>Using NGINX as a Reverse Proxy</h2>
<p>NGINX is a good choice for using it not only as a web server, but also as a reverse proxy. This method is ideal if you want a streamlined setup with clear directives and configurations for handling web traffic, all managed through a single or multiple configuration files depending on your current configuration.</p>
</div>

1. **If you haven't installed [NGINX](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#installing-a-prebuilt-package), do it now!**

2. **Create and open a new NGINX Configuration File named `asklvkaszus` in `/etc/nginx/sites-available/` folder with your favourite text editor.**

- `sudo nano /etc/nginx/sites-available/asklvkaszus`

3. **Update required configuration inside `/etc/nginx/sites-available/asklvkaszus` file to match your setup.**

```
server {
        listen 80;
        listen [::]:80;

        server_name domain.tld; # Update to your domain where you want to host this application.

        error_log /var/log/nginx/error.log;

        # Additional security HTTP headers below.
        add_header Referrer-Policy "strict-origin-when-cross-origin";
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "0";

        server_tokens off;

        # Application Backend endpoint configuration below.
        location /api {
                proxy_pass http://127.0.0.1:3030;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header Host $host;
                proxy_http_version 1.1;
                proxy_set_header Connection "";
                proxy_set_header Authorization $http_authorization;
        }

        # Application Frontend endpoint configuration below.
        location / {
                proxy_pass http://127.0.0.1:3031;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header Host $host;
                proxy_http_version 1.1;
                proxy_set_header Connection "";
        }

        # Optional robots.txt file for blocking crawlers and other internet bots from crawling and indexing your application to be available in search engines results.
        location /robots.txt {
                default_type text/plain;
                return 200 "User-agent: *\nDisallow: /";
        }
}
```

4. **Enable your new NGINX Configuration.**

- `sudo ln -sf /etc/nginx/sites-available/asklvkaszus /etc/nginx/sites-enabled/asklvkaszus`

5. **Verify NGINX Configuration. If it returns `OK`, your configuration has no errors.**

- `sudo nginx -t`

6. **When NGINX is already running, restart it to apply your new configuration. When NGINX is not already running, start it with your new configuration.**

- Restarting NGINX Server:  
  `sudo systemctl restart nginx`

- Starting NGINX Server:  
  `sudo systemctl start nginx`

7. **Enable NGINX Server to run at server startup.**

- `sudo systemctl enable nginx`

<div align="center">

And from now, your NGINX Reverse Proxy should be up and running, serving your installed application before!

</div>


<div id="apache2" align="center"> 
<h2>Using Apache2 as a Reverse Proxy</h2>
<p>Apache2 is a classic choice for serving web applications and acting as a reverse proxy. While it may require more configuration compared to modern alternatives like NGINX, it remains a reliable solution with extensive module support and flexibility.</p>
</div>

1. **If you haven't installed [Apache2](https://httpd.apache.org/docs/2.4/install.html), do it now!**

2. **Enable the required Apache modules for Reverse Proxy support.**

- `sudo a2enmod proxy proxy_http headers rewrite`

3. **Create and open a new Apache2 Configuration File named `asklvkaszus.conf` in `/etc/apache2/sites-available/` folder with your favourite text editor.**

- `sudo nano /etc/apache2/sites-available/asklvkaszus.conf`

4. **Update required configuration inside `/etc/apache2/sites-available/asklvkaszus.conf` file to match your setup.**

```
ServerTokens Prod

<VirtualHost *:80>
        # Update to your domain where you want to host this application.
        ServerName domain.tld

        ErrorLog ${APACHE_LOG_DIR}/error.log

        # Additional security HTTP headers below.
        Header always set Referrer-Policy "strict-origin-when-cross-origin"
        Header always set X-Frame-Options "SAMEORIGIN"
        Header always set X-Content-Type-Options "nosniff"
        Header always set X-XSS-Protection "0"

        # Application Backend endpoint configuration below.
        ProxyPass /api http://127.0.0.1:3030/api
        ProxyPassReverse /api http://127.0.0.1:3030/api

        RequestHeader set X-Forwarded-For %{REMOTE_ADDR}s
        RequestHeader set X-Forwarded-Proto "http"
        RequestHeader set Host %{HTTP_HOST}s
        RequestHeader set Authorization %{HTTP_AUTHORIZATION}s
        SetEnvIf Remote_Addr 127.0.0.1 no_proxy

        # Application Frontend endpoint configuration below.
        ProxyPass / http://127.0.0.1:3031/
        ProxyPassReverse / http://127.0.0.1:3031/
</VirtualHost>
```

5. **Enable your new Apache2 Configuration.**

- `sudo a2ensite asklvkaszus.conf`

6. **Verify Apache Configuration. If it returns `Syntax OK`, your configuration has no errors.**

- `sudo apachectl configtest`

7. **When Apache2 is already running, restart it to apply your new configuration. When Apache2 is not already running, start it with your new configuration.**

- Restarting Apache2 Server:  
  `sudo systemctl restart apache2`

- Starting Apache2 Server:  
  `sudo systemctl start apache2`

8. **Enable Apache2 Server to run at server startup.**

- `sudo systemctl enable apache2`

<div align="center">

And from now, your Apache2 Reverse Proxy should be up and running, serving your installed application before!

</div>
