<div align="center">
<h1>Ask @lvkaszus!</h1>
<h3>Documentation describing the steps and process of installation.</h3>
</div>

<div align="center">
<h2>Let's begin!</h2>
<p>Below are the prerequisites, that must be met before installing this application:</p>
</div>

1. **Get a domain name and a server with preferably Linux installed on it** - Cloud Solutions with a Free-Tier: [Detailed list](https://github.com/cloudcommunity/Cloud-Free-Tier-Comparison)

2. **Point your domain name to your server by editing DNS records in your domain registrar** - Detailed help: [OVHcloud](https://support.us.ovhcloud.com/hc/en-us/articles/360012042099-How-to-Connect-Your-VPS-to-Your-Domain-Name) / [GoDaddy](https://www.godaddy.com/help/change-an-a-record-19239) / [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9837/46/how-to-connect-a-domain-to-a-server-or-hosting/)

3. **Open ports `80` and `443` to enable HTTP and HTTPS on your server.** Below is an example how to enable incoming traffic on those ports using `iptables`.

- IPv4:
```
# Enable incoming HTTP and HTTPS traffic
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Save new iptables rules
sudo iptables-save > /etc/iptables/rules.v4

```

- IPv6:
```
# Enable incoming HTTP and HTTPS traffic
sudo ip6tables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo ip6tables -A INPUT -p tcp --dport 443 -j ACCEPT

# Save new iptables rules
sudo ip6tables-save > /etc/iptables/rules.v6

```

<div align="center">
<h2>Installation Methods</h2>
<p>Choose one of those installation methods below:</p>
</div>

1. [**Docker Compose Installation**](#docker-compose-installation)  
   Use this method to set up the application using Docker Compose. This approach is recommended if you prefer an easy-to-manage multi-container environment.

2. [**Docker CLI Installation**](#docker-cli-installation)  
   Follow this method to set up the application using Docker's command-line interface (CLI). This method is suitable if you prefer more control over individual Docker containers.

3. [**Manual Installation**](#manual-installation)  
   If you prefer to install the application manually, follow this method. This is ideal for those who need complete flexibility or are working in an environment without Docker.

<div align="center">

**If you do not have any special requirements, it is recommended to use one of the Docker installation methods.**

</div>

<div id="docker-compose-installation" align="center">
<h2>Docker Compose Installation</h2>
<p>Docker Compose simplifies the management of multi-container Docker applications. This method is ideal if you want a streamlined setup with clear dependencies and configuration, all managed from one file.</p>
</div>

1. **If you haven't installed [Docker Engine](https://docs.docker.com/engine/install/) and/or [Docker Compose Plugin](https://docs.docker.com/compose/install/linux/), do it now!**

2.  **Install `git` package with your server's package manager.**

- `sudo apt install git`

3. **Clone application repository on to your server.**

- `git clone https://github.com/lvkaszus/asklvkaszus`

4. **Enter the cloned application repository folder.**

- `cd asklvkaszus`

5. **Open `docker-compose.yml` file with your favourite text editor.**

- `nano docker-compose.yml`

6. **Update required configuration inside `docker-compose.yml` file to match your setup.**

```
volumes:
  asklvkaszus_mariadb_data:
  asklvkaszus_config_data:

networks:
  asklvkaszus-network:
    driver: bridge

services:
  asklvkaszus-mariadb:
    image: mariadb:latest
    container_name: asklvkaszus-mariadb
    networks:
      - asklvkaszus-network
    environment:
      MYSQL_USER: asklvkaszus
      MYSQL_PASSWORD: ChangeMePlease # Update that with strong MySQL user password!
      MYSQL_ROOT_PASSWORD: ChangeMePlease # Update that with strong MySQL root password!
      MYSQL_DATABASE: asklvkaszus
    volumes:
      - asklvkaszus_mariadb_data:/var/lib/mysql
    restart: unless-stopped

  asklvkaszus-redis:
    image: redis:latest
    container_name: asklvkaszus-redis
    networks:
      - asklvkaszus-network
    volumes:
      - /etc/redis/asklvkaszus:/usr/local/etc/redis
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    restart: unless-stopped

  asklvkaszus-backend:
    image: lvkaszus/asklvkaszus-backend:latest
    container_name: asklvkaszus-backend
    networks:
      - asklvkaszus-network
    ports:
      - "127.0.0.1:3030:3030"
    environment:
      TZ: "Europe/Warsaw" # Update that with your current timezone!
      GUNICORN_WORKERS: 1
      GUNICORN_THREADS: 4
      GUNICORN_TIMEOUT: 60
    volumes:
      - asklvkaszus_config_data:/asklvkaszus/backend/config
    depends_on:
      - asklvkaszus-mariadb
      - asklvkaszus-redis
    restart: unless-stopped

  asklvkaszus-frontend:
    image: lvkaszus/asklvkaszus-frontend:latest
    container_name: asklvkaszus-frontend
    networks:
      - asklvkaszus-network
    ports:
      - "127.0.0.1:3031:3031"
    environment:
      TZ: "Europe/Warsaw" # Update that with your current timezone!
      DOMAIN: "https://domain.tld" # Update that with your application domain name!
      YOUR_NICKNAME: "@yourNickname" # Update that with your nickname that will be displayed in the application!
    depends_on:
      - asklvkaszus-backend
    restart: unless-stopped
```

7. **Deploy your Docker Compose Stack.**

- `docker compose up -d`

8. **Copy example Redis configuration file to your application Redis configuration directory.**

- `sudo cp asklvkaszus-backend/config/redis.conf /etc/redis/asklvkaszus`

9. **Open `/etc/redis/asklvkaszus/redis.conf` file with your favourite text editor.**

- `sudo nano /etc/redis/asklvkaszus/redis.conf`

10. **Update required configuration inside `/etc/redis/asklvkaszus/redis.conf` file to match your setup.**

```
# Disables default Redis user
user default off

# Allows new Redis user with specified username and password to access all keys in the databases and execute all commands
user YOUR_REDIS_USERNAME on >YOUR_REDIS_PASSWORD ~* +@all
```

11. **List all available Docker volumes.**

- `docker volume ls`

12. **Inspect a volume that contains `asklvkaszus_config_data` to find where to put application main configuration file.**

- `docker volume inspect asklvkaszus_asklvkaszus_config_data`

```
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

13. **Enter the application main configuration folder from the `Mountpoint` variable.**

- `cd /var/lib/docker/volumes/asklvkaszus_asklvkaszus_config_data/_data`

14. **Copy existing example configuration file as a new application main configuration file.**

- `sudo cp config.example.yml config.yml`

15. **Open `config.yml` file with your favourite text editor.**

- `sudo nano config.yml`

16. **Update required configuration inside `config.yml` file to match your setup.**

```
debug: true
logfile: ""

secret_key: "ChangeMeAsSoonAsPossible" # Secret key used for sessions
jwt_secret_key: "ChangeMeAsSoonAsPossible" # Secret key used for JWT cookies (you can provide the same value as in secret_key variable)

mysql:
  host: "localhost" # MySQL database container name
  port: "3306"
  username: "asklvkaszus"
  password: "asklvkaszus" # MySQL database user password
  database: "asklvkaszus"

redis:
  host: "localhost" # Redis database container name
  port: "6379"
  username: "asklvkaszus" # Redis username from the Redis configuration file
  password: "asklvkaszus" # Redis user password from the Redis configuration file
  rate_limiting_db: "0"
  blacklisted_tokens_db: "1"

your_nickname: "@lvkaszus" # Update that with your nickname that will be displayed in the application!

server_url: "https://ask.lvkasz.us" # Update that with your application domain name!
api_allowed_clients_url: "*"

cookies_secure: true # Change only to false when you are using insecure (HTTP) connection!

rate_limits:
  auth: "35 per hour"
  admin: "250 per hour"
  api_admin: "250 per hour"
  user: "10 per hour"
  api_user: "10 per hour"

```

17. **Restart application Docker Compose Stack.**

- `docker compose restart`

<div align="center">

And from now, application should be up and running!

Please visit [Reverse Proxy Setup](Reverse_Proxy_Setup.md) page for exposing it behind a reverse proxy to the public!

</div>

<div id="docker-cli-installation" align="center">
<h2>Docker CLI Installation</h2>
<p>Docker Command-Line Interface (CLI) provides a flexible and powerful way to manage application containers. This method is particularly useful if you need to customize individual application containers or manage them manually.</p>
</div>

1. **If you haven't installed [Docker Engine](https://docs.docker.com/engine/install/), do it now!**

2.  **Install `git` package with your server's package manager.**

- `sudo apt install git`

3. **Clone application repository on to your server.**

- `git clone https://github.com/lvkaszus/asklvkaszus`

4. **Enter the cloned application repository folder.**

- `cd asklvkaszus`

5. **Create database Docker volume.**

- `docker volume create asklvkaszus_mariadb_data`

6. **Create configuration data Docker volume.**

- `docker volume create asklvkaszus_config_data`

7. **Create application Docker network.**

- `docker network create --driver bridge asklvkaszus-network`

8. **Run application MySQL database Docker container.**

- Update `MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD` with strong MySQL root and user password!

```
docker run -d \
  --name asklvkaszus-mariadb \
  --network asklvkaszus-network \
  -e MYSQL_USER=asklvkaszus \
  -e MYSQL_PASSWORD=ChangeMePlease \
  -e MYSQL_ROOT_PASSWORD=ChangeMePlease \
  -e MYSQL_DATABASE=asklvkaszus \
  -v asklvkaszus_mariadb_data:/var/lib/mysql \
  --restart unless-stopped \
  mariadb:latest
```

9. **Run application Redis database Docker container.**

```
docker run -d \
  --name asklvkaszus-redis \
  --network asklvkaszus-network \
  -v /etc/redis/asklvkaszus:/usr/local/etc/redis \
  --restart unless-stopped \
  redis:latest \
  redis-server /usr/local/etc/redis/redis.conf
```

10. **Run application Backend Docker container.**

- Update `TZ` with your current timezone!

```
docker run -d \
  --name asklvkaszus-backend \
  --network asklvkaszus-network \
  -p 127.0.0.1:3030:3030 \
  -e TZ="Europe/Warsaw" \
  -e GUNICORN_WORKERS=1 \
  -e GUNICORN_THREADS=4 \
  -e GUNICORN_TIMEOUT=60 \
  -v asklvkaszus_config_data:/asklvkaszus/backend/config \
  --restart unless-stopped \
  lvkaszus/asklvkaszus-backend:latest
```

11. **Run application Frontend Docker container.**

- Update `TZ` with your current timezone, `DOMAIN` with your application domain name and also `YOUR_NICKNAME` to your nickname that will be displayed in the application!

```
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

12. **Copy example Redis configuration file to your application Redis configuration directory.**

- `sudo cp asklvkaszus-backend/config/redis.conf /etc/redis/asklvkaszus`

13. **Open `/etc/redis/asklvkaszus/redis.conf` file with your favourite text editor.**

- `sudo nano /etc/redis/asklvkaszus/redis.conf`

14. **Update required configuration inside `/etc/redis/asklvkaszus/redis.conf` file to match your setup.**

```
# Disables default Redis user
user default off

# Allows new Redis user with specified username and password to access all keys in the databases and execute all commands
user YOUR_REDIS_USERNAME on >YOUR_REDIS_PASSWORD ~* +@all
```

15. **Inspect application configuration volume to find where to put application main configuration file.**

- `docker volume inspect asklvkaszus_config_data`

```
[
    {
        "CreatedAt": "2024-08-29T11:22:03Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/asklvkaszus_config_data/_data",
        "Name": "asklvkaszus_config_data",
        "Options": null,
        "Scope": "local"
    }
]
```

16. **Enter the application main configuration folder from the `Mountpoint` variable.**

- `cd /var/lib/docker/volumes/asklvkaszus_config_data/_data`

17. **Copy existing example configuration file as a new application main configuration file.**

- `sudo cp config.example.yml config.yml`

18. **Open `config.yml` file with your favourite text editor.**

- `sudo nano config.yml`

19. **Update required configuration inside `config.yml` file to match your setup.**

```
debug: true
logfile: ""

secret_key: "ChangeMeAsSoonAsPossible" # Secret key used for sessions
jwt_secret_key: "ChangeMeAsSoonAsPossible" # Secret key used for JWT cookies (you can provide the same value as in secret_key variable)

mysql:
  host: "localhost" # MySQL database container name
  port: "3306"
  username: "asklvkaszus"
  password: "asklvkaszus" # MySQL database user password
  database: "asklvkaszus"

redis:
  host: "localhost" # Redis database container name
  port: "6379"
  username: "asklvkaszus" # Redis username from the Redis configuration file
  password: "asklvkaszus" # Redis user password from the Redis configuration file
  rate_limiting_db: "0"
  blacklisted_tokens_db: "1"

your_nickname: "@lvkaszus" # Update that with your nickname that will be displayed in the application!

server_url: "https://ask.lvkasz.us" # Update that with your application domain name!
api_allowed_clients_url: "*"

cookies_secure: true # Change only to false when you are using insecure (HTTP) connection!

rate_limits:
  auth: "35 per hour"
  admin: "250 per hour"
  api_admin: "250 per hour"
  user: "10 per hour"
  api_user: "10 per hour"

```

20. **Restart all application containers.**

- `docker restart asklvkaszus-mariadb asklvkaszus-redis asklvkaszus-backend asklvkaszus-frontend`

<div align="center">

And from now, application should be up and running!

Please visit [Reverse Proxy Setup](Reverse_Proxy_Setup.md) page for exposing it behind a reverse proxy to the public!

</div>

<div id="manual-installation" align="center">
<h2>Manual Installation</h2>
<p>Manual installation provides a hands-on approach for setting up this application, giving you full control over every aspect of the installation process. This method is ideal if you prefer to configure each component individually or if you have specific requirements that are not easily addressed by automated tools.</p>
</div>

1. **Install `curl`, `git`, `python3-venv`, `redis`, `mariadb-server`,  package with your server's package manager.**

- `sudo apt install curl git python3-venv redis mariadb-server`

2. **Install NodeSource Repository.**

- `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -`

3. **Install Node Runtime Environment.**

- `sudo apt install nodejs`

4. **Run MariaDB Secure Installation.**

- `sudo mysql_secure_installation`

5. **Run MariaDB CLI.**

- `sudo mariadb -u root`

   or when you set a new database root password

- `sudo mariadb -u root -p`

6. **Create a new application database.**

- `CREATE DATABASE asklvkaszus;`

7. **Create a new user with password that application will use.**

- Update `password` with a strong password!

- `CREATE USER 'asklvkaszus'@'localhost' IDENTIFIED BY 'password';`

8. **Grant all database privileges on a new database user.**

- `GRANT ALL PRIVILEGES ON asklvkaszus.* TO 'asklvkaszus'@'localhost';`

9. **Reload database privileges table.**

- `FLUSH PRIVILEGES;`

10. **Logout from MariaDB CLI Session.**

- `exit`

11. **Open `/etc/redis/redis.conf` file with your favourite text editor.**

- `sudo nano /etc/redis/redis.conf`

12. **Update and add at the bottom this required configuration inside `/etc/redis/redis.conf` file to match your setup.**

```
# Disables default Redis user
user default off

# Allows new Redis user with specified username and password to access all keys in the databases and execute all commands
user YOUR_REDIS_USERNAME on >YOUR_REDIS_PASSWORD ~* +@all
```

13. **Restart the Redis database service.**

- `sudo systemctl restart redis`

14. **Clone application repository on to your server.**

- `git clone https://github.com/lvkaszus/asklvkaszus`

15. **Enter the Backend folder of the cloned application.**

- `cd asklvkaszus/asklvkaszus-backend`

16. **Create a new Python virtual environment inside Backend folder of the cloned application.**

- `python3 -m venv .`

17. **Activate the freshly created Backend Python virtual environment.**

- `source bin/activate`

18. **Install all packages required by the application backend inside virtual environment**

- `pip install -r requirements.txt`

19. **Enter the Backend configuration folder.**

- `cd config`

20. **Copy existing example configuration file as a new application main configuration file.**

- `cp config.example.yml config.yml`

21. **Open `config.yml` file with your favourite text editor.**

- `nano config.yml`

22. **Update required configuration inside `config.yml` file to match your setup.**

```
debug: true
logfile: ""

secret_key: "ChangeMeAsSoonAsPossible" # Secret key used for sessions
jwt_secret_key: "ChangeMeAsSoonAsPossible" # Secret key used for JWT cookies (you can provide the same value as in secret_key variable)

mysql:
  host: "localhost" # MySQL database host
  port: "3306"
  username: "asklvkaszus"
  password: "asklvkaszus" # MySQL database user password
  database: "asklvkaszus"

redis:
  host: "localhost" # Redis database host
  port: "6379"
  username: "asklvkaszus" # Redis username from the Redis configuration file
  password: "asklvkaszus" # Redis user password from the Redis configuration file
  rate_limiting_db: "0"
  blacklisted_tokens_db: "1"

your_nickname: "@lvkaszus" # Update that with your nickname that will be displayed in the application!

server_url: "https://ask.lvkasz.us" # Update that with your application domain name!
api_allowed_clients_url: "*"

cookies_secure: true # Change only to false when you are using insecure (HTTP) connection!

rate_limits:
  auth: "35 per hour"
  admin: "250 per hour"
  api_admin: "250 per hour"
  user: "10 per hour"
  api_user: "10 per hour"
```

23. **Change directory to Backend root.**

- `cd ..`

24. **Open `asklvkaszus-backend.service` file with your favourite text editor.**

- `nano asklvkaszus-backend.service`

25. **Update required configuration inside `asklvkaszus-backend.service` file to match your setup.**

- Update `YOUR_USER` with your system username!

```
[Unit]
Description=Ask @lvkaszus! - Application Backend
After=network.target

[Service]
User=YOUR_USER
WorkingDirectory=/home/YOUR_USER/asklvkaszus/asklvkaszus-backend
Environment="PATH=/home/YOUR_USER/asklvkaszus/asklvkaszus-backend/bin"
ExecStart=/home/YOUR_USER/asklvkaszus/asklvkaszus-backend/start.sh
Restart=always

[Install]
WantedBy=multi-user.target
```

26. **Copy modified `asklvkaszus-backend.service` to `/etc/systemd/system`.**

- `sudo cp asklvkaszus-backend.service /etc/systemd/system`

27. **Enable Application Backend System Service now and make it running at system boot.**

- `sudo systemctl enable --now asklvkaszus-backend`

28. **Change directory to Frontend root.**

- `cd ../asklvkaszus-frontend`

29. **Install all Node packages.**

- `npm install`

30. **Set required environment variables for Frontend to match your setup.**

- Update `https://domain.tld` with your application domain and `@yourNickname` to your nickname that will be displayed in the application!

- `export DOMAIN=https://domain.tld ; export YOUR_NICKNAME=@yourNickname`

31. **Build Application Frontend.**

- `npm run build`

32. **Open `asklvkaszus-frontend.service` file with your favourite text editor.**

- `nano asklvkaszus-frontend.service`

33. **Update required configuration inside `asklvkaszus-frontend.service` file to match your setup.**

- Update `YOUR_USER` with your system username!

```
[Unit]
Description=Ask @lvkaszus! - Application Frontend
After=network.target

[Service]
User=YOUR_USER
WorkingDirectory=/home/YOUR_USER/asklvkaszus/asklvkaszus-frontend
ExecStart=/home/YOUR_USER/asklvkaszus/asklvkaszus-frontend/start.sh
Restart=always

[Install]
WantedBy=multi-user.target
```

34. **Copy modified `asklvkaszus-frontend.service` to `/etc/systemd/system`.**

- `sudo cp asklvkaszus-frontend.service /etc/systemd/system`

35. **Enable Application Frontend System Service now and make it running at system boot.**

- `sudo systemctl enable --now asklvkaszus-frontend`

<div align="center">

And from now, application should be up and running!

Please visit [Reverse Proxy Setup](Reverse_Proxy_Setup.md) page for exposing it behind a reverse proxy to the public!

</div>
