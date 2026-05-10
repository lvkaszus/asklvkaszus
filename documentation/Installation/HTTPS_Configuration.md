<div align="center">
<h1>Ask @lvkaszus!</h1>
<h3>Documentation describing the steps and process of configuring HTTPS (TLS) for your reverse proxy.</h3>
</div>

<div align="center">
<h2>Selecting a TLS Setup Method</h2>
<p>Choose one of the methods below to configure HTTPS:</p>
</div>

1. [**Certbot (Let's Encrypt)**](#certbot)  
   Automatically obtain and renew free SSL/TLS certificates using Let's Encrypt. Recommended for most users and production deployments.

2. [**Custom Certificates**](#custom-certificates)  
   Use your own SSL/TLS certificates (for example: self-signed, internal CA, or externally purchased certificates).

<p align="center"><u>The commands provided in this guide are based on Debian, Ubuntu and other based distributions.</u></p>

<div id="certbot" align="center"> 
<h2>Using Certbot (Let's Encrypt)</h2>
<p>This method automatically obtains and renews free SSL/TLS certificates from Let's Encrypt.</p>
</div>

1. **Install Certbot and required plugins.**

- for NGINX: `sudo apt install certbot python3-certbot-nginx`
- for Apache2: `sudo apt install certbot python3-certbot-apache`

2. **Make sure your domain points to your server.**

- Your domain (`domain.tld`) must resolve to your server's public IP address, and TCP ports `80` and `443` must be accessible from the internet.

3. **Run Certbot to automatically configure HTTPS.**

- for NGINX: `sudo certbot --nginx -d domain.tld`
- for Apache2: `sudo certbot --apache -d domain.tld`

4. **Follow the interactive setup.**

- Choose to redirect HTTP to HTTPS when prompted (recommended).
- Certbot will automatically update your configuration files.

5. **Verify automatic certificate renewal.**

- `sudo systemctl list-timers | grep certbot`

    The command above should return a result similar to the one below:

    ```
    ubuntu@server:~$ sudo systemctl list-timers | grep certbot
    Tue 2026-05-05 13:08:41 CEST       9h -                                       - certbot.timer                certbot.service
    ```

6. **(Optional test)**:

- `sudo certbot renew --dry-run`

    The command above should return a result similar to the one below:

    ```
    Congratulations, all simulated renewals succeeded: 
      /etc/letsencrypt/live/domain.tld/fullchain.pem (success)
    ```


7. **Open your browser and verify that HTTPS on this application domain is working correctly.**

---

### ⚠️ After enabling HTTPS

Your application may stop working correctly after enabling HTTPS.

### <ins>Don't panic!</ins>

This behavior is normal after enabling HTTPS and before the full security configuration is completed.

Why?
- Backend cookies are still marked as insecure!
- Backend server URL still uses HTTP!

Fix?
- Please follow the steps below!

---

8. **After successfully enabling HTTPS and accessing the application through your domain, additional application configuration changes are required.**

- Update the application server URL from `http://` to `https://`
    
- Enable secure cookies by changing the `cookies_secure` option to `true`

---

- _**For Docker Compose installations:**_

    1. **List all available Docker volumes.**

    - `docker volume ls`

    2. **Inspect a volume that contains `asklvkaszus_config_data` to find where to put application main configuration file.**

    - `docker volume inspect asklvkaszus_asklvkaszus_config_data`

    ```json
    [
        {
            "CreatedAt": "2024-08-29T10:22:03Z",
            "Driver": "local",
            "Labels": {
                "com.docker.compose.project": "asklvkaszus",
                "com.docker.compose.version": "2.29.2",
                "com.docker.compose.volume": "asklvkaszus_config_data"
            },
            "Mountpoint": "/var/lib/docker/volumes/asklvkaszus_asklvkaszus_config_data/_data",
            "Name": "asklvkaszus_asklvkaszus_config_data",
            "Options": null,
            "Scope": "local"
        }
    ]
    ```

    3. **Switch to a user account with administrative privileges (`sudo`) and enter your account password when prompted.**

    - `sudo su`

    4. **Enter the application main configuration folder from the `Mountpoint` variable.**

    - `cd /var/lib/docker/volumes/asklvkaszus_asklvkaszus_config_data/_data`

    5. **Open `config.yml` file with your favourite text editor.**

    - `nano config.yml`

    6. **Enable secure cookies by changing `cookies_secure` from `false` to `true`, and update the application server URL by changing the protocol from HTTP to HTTPS.**

    ```yml
    [...]

    server_url: "https://domain.tld" # Update that with your application domain name!

    [...]

    cookies_secure: true # Change to true only when you are using secure (HTTPS) connection!
    
    [...]
    ```

    7. **After saving the updated application server configuration, exit the text editor and leave the administrative (sudo) shell session.**

    - `exit`

    8. **Navigate to the directory containing your application's Docker Compose file.**

    - `cd ~/asklvkaszus`

    9. **Open `docker-compose.yml` file with your favourite text editor.**

    - `nano docker-compose.yml`

    10. **Update the application server URL inside the Frontend service environment variables by changing the protocol from HTTP to HTTPS.**

    ```yml
            DOMAIN: "https://domain.tld" # Update that with your application domain name!
    ```

    11. **Update and restart the application Docker Compose Stack.**

    - `docker compose up -d && docker compose restart`

---

- _**For Docker CLI installations:**_

    1. **List all available Docker volumes.**

    - `docker volume ls`

    2. **Inspect a volume that contains `asklvkaszus_config_data` to find where to put application main configuration file.**

    - `docker volume inspect asklvkaszus_asklvkaszus_config_data`

    ```json
    [
        {
            "CreatedAt": "2024-08-29T10:22:03Z",
            "Driver": "local",
            "Labels": {
                "com.docker.compose.project": "asklvkaszus",
                "com.docker.compose.version": "2.29.2",
                "com.docker.compose.volume": "asklvkaszus_config_data"
            },
            "Mountpoint": "/var/lib/docker/volumes/asklvkaszus_asklvkaszus_config_data/_data",
            "Name": "asklvkaszus_asklvkaszus_config_data",
            "Options": null,
            "Scope": "local"
        }
    ]
    ```

    3. **Switch to a user account with administrative privileges (`sudo`) and enter your account password when prompted.**

    - `sudo su`

    4. **Enter the application main configuration folder from the `Mountpoint` variable.**

    - `cd /var/lib/docker/volumes/asklvkaszus_asklvkaszus_config_data/_data`

    5. **Open `config.yml` file with your favourite text editor.**

    - `nano config.yml`

    6. **Enable secure cookies by changing `cookies_secure` from `false` to `true`, and update the application server URL by changing the protocol from HTTP to HTTPS.**

    ```yml
    [...]

    server_url: "https://domain.tld" # Update that with your application domain name!

    [...]

    cookies_secure: true # Change to true only when you are using secure (HTTPS) connection!
    
    [...]
    ```

    7. **After saving the updated application server configuration, exit the text editor and leave the administrative (`sudo`) shell session.**

    - `exit`

    8. **Stop and remove the existing application Frontend container, then replace it with a new container configured for proper HTTPS support.**

        - Update `TZ` with your current timezone, `DOMAIN` with your application domain name including the HTTPS schema at the beginning, and also `YOUR_NICKNAME` to your nickname that will be displayed in the application!

        ```bash
        docker stop asklvkaszus-frontend && \
        docker rm asklvkaszus-frontend && \
        docker run -d \
        --name asklvkaszus-frontend \
        --network asklvkaszus-network \
        -p 127.0.0.1:3031:3031 \
        -e TZ="Europe/Warsaw" \
        -e DOMAIN="https://domain.tld" \
        -e YOUR_NICKNAME="@yourNickname" \
        --restart unless-stopped \
        lvkaszus/asklvkaszus-frontend:latest
        ```

    9. **Restart all application containers.**

    - `docker restart asklvkaszus-mariadb asklvkaszus-redis asklvkaszus-backend asklvkaszus-frontend`

---

- _**For Manual installations:**_

    1. **Navigate to the folder containing the current application server configuration.**

    - `cd asklvkaszus/asklvkaszus-backend/config`

    2. **Open `config.yml` file with your favourite text editor.**

    - `nano config.yml`

    3. **Enable secure cookies by changing `cookies_secure` from `false` to `true`, and update the application server URL by changing the protocol from HTTP to HTTPS.**

    ```yml
    [...]

    server_url: "https://domain.tld" # Update that with your application domain name including the HTTPS schema at the beginning!

    [...]

    cookies_secure: true # Change to true only when you are using secure (HTTPS) connection!
    
    [...]
    ```

    4. **After saving the updated application server configuration, exit the text editor and navigate to the application Frontend directory.**

    - `cd ../../asklvkaszus-frontend`

    5. **Install all Node packages.**

    - `npm install`

    6. **Set required environment variables for Frontend to match your setup.**

    - Update `https://domain.tld` with your application domain name (with HTTPS) and `@yourNickname` nickname that will be displayed in the application!

    - `export DOMAIN=https://domain.tld ; export YOUR_NICKNAME=@yourNickname`

    7. **Build Application Frontend.**

    - `npm run build`

    8. **Restart all application system services.**

    - `sudo systemctl restart asklvkaszus-backend asklvkaszus-frontend`

---

<div id="custom-certificates" align="center"> 
<h2>Using Custom Certificates</h2>
<p>This method allows you to use your own SSL/TLS certificates.</p>
</div>

1. **Place your certificate files on the server.**

   Example:
   - `/etc/ssl/domain.tld/fullchain.pem`
   - `/etc/ssl/domain.tld/privkey.pem`

2. **(Optional) Generate DH parameters for stronger security.**

- `sudo openssl dhparam -out /etc/ssl/dhparams.pem 4096`

---

<div id="nginx" align="center"> 
<h2>NGINX Custom HTTPS Configuration</h2>
</div>

1. **Edit your NGINX configuration file.**

- `sudo nano /etc/nginx/sites-available/asklvkaszus`

2. **Create a new configuration file or update your existing configuration with the HTTPS-enabled version:**

```
server {
        listen 80;
        listen [::]:80;

        server_name domain.tld;

        return 301 https://$host$request_uri;
}

server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name domain.tld; # Update to your domain where you want to host this application.

        error_log /var/log/nginx/error.log;

        ssl_certificate /etc/letsencrypt/live/domain.tld/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/domain.tld/privkey.pem;

        # Secure TLS configuration: allowed protocol versions, preferred cipher suites,
        # elliptic curve, session settings, and OCSP stapling for certificate validation
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384';
        ssl_ecdh_curve secp384r1;
        ssl_session_timeout  10m;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;
        ssl_stapling on;
        ssl_stapling_verify on;

        # If generated, enable DH parameters
        ssl_dhparam /etc/ssl/dhparams.pem;

        # Additional security HTTP headers below.
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
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

3. **Verify configuration.**

- `sudo nginx -t`

4. **Restart NGINX.**

- `sudo systemctl restart nginx`

---

<div id="apache2" align="center"> 
<h2>Apache2 Custom HTTPS Configuration</h2>
</div>

1. **Enable SSL module.**

- `sudo a2enmod ssl headers`

2. **Edit your Apache configuration file.**

- `sudo nano /etc/apache2/sites-available/asklvkaszus.conf`

3. **Replace your configuration with HTTPS-enabled version:**

```
ServerTokens Prod

<VirtualHost *:80>
    # Update to your domain where you want to host this application.

    ServerName domain.tld
    Redirect permanent / https://domain.tld/
</VirtualHost>


# Global SSL session and OCSP stapling cache configuration.
# These directives must be placed outside of VirtualHost blocks.
# If your Apache setup does not already define a session cache elsewhere
# (e.g. in ssl.conf or apache2.conf), uncomment the lines below:

# SSLSessionCache shmcb:/var/run/apache2/ssl_scache(512000)
# SSLStaplingCache shmcb:/var/run/apache2/ssl_stapling(32768)


<VirtualHost *:443>
    ServerName domain.tld

    SSLEngine on
    SSLCertificateFile /etc/ssl/domain.tld/fullchain.pem
    SSLCertificateKeyFile /etc/ssl/domain.tld/privkey.pem

    # Secure TLS configuration: allowed protocol versions, preferred cipher suites,
    # elliptic curve, session cache settings, and OCSP stapling for certificate validation
    SSLProtocol -all +TLSv1.2 +TLSv1.3
    SSLHonorCipherOrder on
    SSLCipherSuite TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384
    SSLOpenSSLConfCmd Curves secp384r1
    SSLSessionCacheTimeout 600
    SSLCompression off
    SSLSessionTickets Off
    SSLUseStapling On

    # If generated, enable DH parameters
    SSLOpenSSLConfCmd DHParameters "/etc/ssl/dhparams.pem"

    # Additional security HTTP headers below.
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "0"

    ProxyPass /api http://127.0.0.1:3030/api
    ProxyPassReverse /api http://127.0.0.1:3030/api

    RequestHeader set X-Forwarded-For %{REMOTE_ADDR}s
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set Host %{HTTP_HOST}s
    RequestHeader set Authorization %{HTTP_AUTHORIZATION}s
    SetEnvIf Remote_Addr 127.0.0.1 no_proxy

    ProxyPass / http://127.0.0.1:3031/
    ProxyPassReverse / http://127.0.0.1:3031/
</VirtualHost>
```

4. **Enable site and verify configuration.**

- `sudo a2ensite asklvkaszus.conf`
- `sudo apachectl configtest`

5. **Restart Apache2.**

- `sudo systemctl restart apache2`

---

<div id="verification" align="center"> 
<h2>Verification</h2>
</div>

After completing the setup, verify that HTTPS is working:

- Open: `https://domain.tld`
- Check certificate validity in your browser
- Ensure HTTP redirects to HTTPS

You can also test using:

- `curl -I http://domain.tld`
- `curl -I https://domain.tld`

<div align="center">

And from now, your application should be securely served over HTTPS!

</div>
