# Installation Guides

If you want to install this project on your own server as Docker Containers, scroll down to Docker section below!
<br>
But if you don't want to use Docker for this project, there is also a Manual Installation section below!

### Prerequisites

- Get a domain name and a server with Linux installed on it. For free, you can get a server using Oracle Cloud and get up to 4 cores and 24GB of RAM to use on ARM64 architecture (overkill for this project, but if you want to deploy some other applications than that, it can be useful!)

- Point your domain name to your server by editing DNS records in your domain registrar. You can use Cloudflare DNS for this. If you want to use Cloudflare, you must change the NS records in your domain registrar pointing to Cloudflare (NS1: xxxxx.ns.cloudflare.com NS2: xxxxx.ns.cloudflare.com) and then change the main DNS records (A, CNAME etc.) in Cloudflare Dashboard to point to your server. You also will get free SSL/TLS certificate for your domain.

- Open ports `80` and `443` to enable HTTP and HTTPS on your server. For example if you are using FirewallD as your firewall, just use those commands on your server:

```
sudo firewall-cmd --zone=public --permanent --add-port=80/tcp
sudo firewall-cmd --zone=public --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

## Docker

You have two ways to deploy this project on your own server. You can use Docker Compose, or deployment by Docker CLI - choose way that you like.

### Docker Compose

- Install Docker Compose if you didn't did this previously:

`sudo apt install docker-compose`

- Create new Docker Compose file, using this command:

`nano docker-compose.yml`

- Paste this to your new Docker Compose file:

⚠️ WARNING! Modify Environment Variables, Credentials and Domain Names/URLs accordingly! ⚠️

```
version: '3.8'

services:
  asklvkaszusdatabase:
    image: mariadb:latest
    container_name: asklvkaszusdatabase
    networks:
      - asklvkaszus-network
    environment:
      MYSQL_USER: asklvkaszus
      MYSQL_PASSWORD: changemeplease
      MYSQL_ROOT_PASSWORD: changemeplease
      MYSQL_DATABASE: asklvkaszus
    restart: unless-stopped
    ports:
      - "3306:3306"

  asklvkaszusredis:
    image: redis:latest
    container_name: asklvkaszusredis
    networks:
      - asklvkaszus-network
    restart: unless-stopped
    ports:
      - "6379:6379"

  asklvkaszusbackend:
    image: lvkaszus/asklvkaszus-backend:latest
    container_name: asklvkaszusbackend
    networks:
      - asklvkaszus-network
    environment:
      MAIN_ACCESS_URL: "ask.example.com"
      ADMIN_ACCESS_URL: "admin-ask.example.com"
      SENDMSG_LIMIT: "10 per hour"
      ADMIN_LIMIT: "50 per hour"
      AUTH_KEY: "changeme"
      MYSQL_HOST: "asklvkaszusdatabase"
      MYSQL_PORT: "3306"
      MYSQL_USER: "asklvkaszus"
      MYSQL_PASSWORD: "admin"
      MYSQL_DATABASE: "asklvkaszus"
      REDIS_HOST: "asklvkaszusredis"
      REDIS_PORT: "6379"
      REDIS_DBS_0: "0"
      REDIS_DBS_1: "1"
    restart: unless-stopped
    ports:
      - "3030:3030"

  asklvkaszusfrontend:
    image: lvkaszus/asklvkaszus-frontend:latest
    container_name: asklvkaszusfrontend
    networks:
      - asklvkaszus-network
    environment:
      YOUR_NICKNAME: "@YourNickname"
      API_DOMAIN_NAME: "ask.example.com"
    restart: unless-stopped
    ports:
      - "3031:3031"

  asklvkaszusadmin:
    image: lvkaszus/asklvkaszus-admin:latest
    container_name: asklvkaszusadmin
    networks:
      - asklvkaszus-network
    environment:
      YOUR_NICKNAME: "@YourNickname"
    restart: unless-stopped
    ports:
      - "3032:3032"

networks:
  asklvkaszus-network:
    driver: bridge
```

- If you are done editing your Docker Compose file, just save it and deploy this application by using this command:

`docker-compose up -d`

- You are pretty much done! Check if application is running correctly by visiting Main Domain of your application and also Administrator Panel using second Domain Name you just configured!

### Docker CLI

- Let's start by downloading and installing Docker Engine on your own server. You can do this by following those simple steps: Just enter this commands below to your server when you are connected to it via SSH. 

(Source: <a href="https://docs.docker.com/engine/install/">Docker Engine Installation Guide</a>)
```
sudo apt-get update && sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

- When you are done installing Docker Engine, enable and start Docker Engine (in case it it not enabled yet):

`sudo systemctl enable --now docker`

- Add your user to `docker` group to execute commands as non-root user:

`sudo usermod -aG docker YOUR_USERNAME`

- Log out and log in back into the server to apply group permissions changes.

- You are ready to deploy "Ask @lvkaszus!" project onto your server! Let's start with something simple.

- Not required but recommended: Create separate Docker Network for this project:

`docker network create asklvkaszus-network` - You can customize network name to fit your needs.

⚠️ WARNING! Remember your Docker Network name because you will need it to deploy needed containers inside this network with `--network YOUR_NETWORK_NAME` parameter when deploying every single container! ⚠️
<br><br>
### Backend in Docker

⚠️ WARNING! Pay attention to the commands from now to not make any mistake while deployment process! ⚠️
<br><br>
- We are ready to deploy fresh MariaDB database image from Docker Hub registry using:

`docker run -d --name asklvkaszusdatabase --network asklvkaszus-network -e MYSQL_USER=asklvkaszus -e MYSQL_PASSWORD=changemeplease -e MYSQL_ROOT_PASSWORD=changemeplease -e MYSQL_DATABASE=asklvkaszus --restart unless-stopped -p 3306:3306 mariadb:latest`

Short explanation:
<br>
`MYSQL_USER=asklvkaszus` - Please enter there your main database user that your backend will use.
<br>
`MYSQL_PASSWORD=changemeplease` - Please change this default password and replace it by strong password that backend will use to access application database.
<br>
`MYSQL_ROOT_PASSWORD=changemeplease` - Please change this default password and replace it by strong password that is for administrative purposes.
<br>
`MYSQL_DATABASE=asklvkaszus` - You can modify database name used by this project, but you can also leave it default name.
<br><br>
`-p 3306:3306` - Specify the port that MariaDB should be accessible from. Do not change the numbers after the `:`!
<br><br>
- Docker Engine should start pulling images from Docker Hub repository, just please wait a while and it will be done and running!

- When MariaDB image and container is running, you can now install Redis on your server:

`docker run -d --name asklvkaszusredis --network asklvkaszus-network --restart unless-stopped -p 6379:6379 redis:latest`

Short explanation:
<br>
`-p 6379:6379` - Please enter there your Redis port number that your backend will use. Do not change the numbers after the `:`!
<br><br>
- After you installed MariaDB Database and Redis Server successfully, you can now finally deploy backend container.

`docker run -d --name asklvkaszusbackend --network asklvkaszus-network -e MAIN_ACCESS_URL="ask.example.com" -e ADMIN_ACCESS_URL="admin-ask.example.com" -e SENDMSG_LIMIT="10 per hour" -e ADMIN_LIMIT="50 per hour" -e AUTH_KEY="changeme" -e MYSQL_HOST=asklvkaszusdatabase -e MYSQL_PORT="3306" -e MYSQL_USER="asklvkaszus" -e MYSQL_PASSWORD="sameasindatabasecontainer" -e MYSQL_DATABASE="asklvkaszus" -e REDIS_HOST="asklvkaszusredis" -e REDIS_PORT="6379" -e REDIS_DBS_0="0" -e REDIS_DBS_1="1" --restart unless-stopped -p 3030:3030 lvkaszus/asklvkaszus-backend:latest`

Short explanation:
<br>
`MAIN_ACCESS_URL="ask.example.com"` - Please enter there your main application URL where users will ask you questions.
<br>
`ADMIN_ACCESS_URL="admin-ask.example.com"` - Please enter there your application URL where you will be logging in for replying or deleting your questions.
<br><br>
`SENDMSG_LIMIT="10 per hour"` - How many requests are allowed in what period of time for sending questions? - '10 per hour' is default.
<br>
`ADMIN_LIMIT="50 per hour"` - How many requests are allowed in what period of time for an administrator? - '50 per hour' is default.
<br><br>
`AUTH_KEY="changeme"` - Generate random password with good length (32 characters recommended), this will be used to authenticate you to the API that Admin Page uses.

<br>

`MYSQL_HOST=asklvkaszusdatabase` - Enter your MariaDB Database Server hostname. You can type your database container name if you want.
<br>
`MYSQL_PORT="3306"` - Enter your MariaDB Database Server port. If you didn't change MariaDB port, you can leave defaults there.
<br>
`MYSQL_USER="asklvkaszus"` - Enter your MariaDB User for Backend access. If you didn't change username, you can leave defaults there.
<br>
`MYSQL_PASSWORD="sameasindatabasecontainer"` - Please change this default password to password that you provided to Backend user when configuring MariaDB Server.
<br>
`MYSQL_DATABASE="asklvkaszus"` - Enter your Database Name from MariaDB that Backend will use to store your questions and answers. If you didn't change Database Name, you can leave defaults there.

<br>

`REDIS_HOST="asklvkaszusredis"` - Hostname or IP Address to your Redis Server where rate-limiting and temporary data will be stored. 'asklvkaszusredis' will mostly work.
<br>
`REDIS_PORT="6379"` - Port number of your Redis Server - 6379 is default.
<br>
`REDIS_DBS_0="0"` - Database numbers in your Redis Server. Number '0' is for rate-limiting data.
<br>
`REDIS_DBS_1="1"` - Database numbers in your Redis Server. Number '1' is for temporary data (only for storing generated ID's temporarily for now)

- And that's should be it for Backend installation and configuration!

<br><br>

### Frontend

- Frontend and also the Admin Panel are pretty easy to setup with Docker. Just pull the image and deploy with one short command:

`docker run -d --name asklvkaszusfrontend --network asklvkaszus-network -p 3031:3031 -e YOUR_NICKNAME="@YourNickname" -e API_DOMAIN_NAME="ask.example.com" --restart unless-stopped lvkaszus/asklvkaszus-frontend:latest`

Short explanation:
<br>
`-p 3031:3031` - Please enter there your port number that your Frontend will use. Do not change the numbers after the `:`!
<br><br>
`YOUR_NICKNAME="@YourNickname"` - Please enter your Nickname that you want to be displayed on your questions page!
<br>
`API_DOMAIN_NAME="ask.example.com"` - Enter there a valid domain name where your Frontend and Application API will be (ask.example.com/api/v1/fetch_all_questions - for example) - currently must be the same!

<br><br>

### Admin Panel

- Last step of this mess! Just pull the image and deploy with one short command:

`docker run -d --name asklvkaszusadmin --network asklvkaszus-network -p 3032:3032 -e YOUR_NICKNAME="@YourNickname" --restart unless-stopped lvkaszus/asklvkaszus-admin:latest`

Short explanation:
<br>
`-p 3032:3032` - Please enter there your port number that your Admin Panel will use. Do not change the numbers after the `:`!
<br><br>
`YOUR_NICKNAME="@YourNickname"` - Please enter your Nickname that you want to be displayed on your questions page!

<br>

#### After installation Steps

When you are done installing everything above for this project, head out to the `After installation steps.md` file to expose your freshly installed Anonymous Q&A application like this one to your domain name and world-wide web!


#### You experienced problems after installation process?

If you experienced any problems after the installation, open and read `Common problems after Installation.md` file for further help!


## Manual Installation

Follow these steps, when you want to install this application with Frontend and Admin Panel:

- Install required packages by using this command if you are using APT Package Manager and Ubuntu:

`sudo apt install -y build-essential libssl-dev libffi-dev python3-dev python3-pip python3-venv mariadb-server redis git`

- Install Node Version Manager by using this command:

`curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash`

- Also, execute commands that are displayed after installation of NVM:

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

- Install NPM package using:

`nvm install node`

- Run MySQL Secure Installation binary provided by MariaDB Package and configure it to your needs by following the instructions displayed on your screen:

`sudo mysql_secure_installation`

There are my settings if you don't know what select here:

```
Enter current password for root (enter for none): --- <ENTER YOUR MARIADB ROOT PASSWORD IF YOU SET ONE, IF NOT JUST PRESS ENTER!>

Switch to unix_socket authentication [Y/n] N --- <IF YOU DON'T HAVE A MESSAGE ABOUT ROOT ACCOUNT PROTECTED, TYPE "Y" THERE AND PRESS ENTER!>

Change the root password? [Y/n] N --- <IF YOU DON'T HAVE A MESSAGE ABOUT ROOT ACCOUNT PROTECTED, TYPE "Y" THERE AND ENTER YOUR NEW ROOT PASSWORD!>

Remove anonymous users? [Y/n] Y

Disallow root login remotely? [Y/n] Y

Remove test database and access to it? [Y/n] Y

Reload privilege tables now? [Y/n] Y
```

- Create database and `asklvkaszus` user for backend to database communication:

```
sudo mysql -u root


CREATE DATABASE asklvkaszus;

CREATE USER 'asklvkaszus'@'localhost' IDENTIFIED BY 'enter_asklvkaszus_user_password_there';

GRANT ALL PRIVILEGES ON asklvkaszus.* TO 'asklvkaszus'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

- Clone project repository and enter it's directory by typing this command:

`git clone https://github.com/lvkaszus/asklvkaszus-react`

- And from now, you are ready to install core components of this project like Backend, then Frontend and lastly the Admin Panel!

<br><br>

- Create Python Virtual Environment for Ask @lvkaszus! Backend and enable it:

`python3 -m venv asklvkaszus-backend && cd asklvkaszus-backend && source bin/activate`

- Copy all contents of Non-Docker Backend directory to your created Python Virtual Environment folder:

`cp asklvkaszus-react/asklvkaszus-backend/nondocker/*.* <YOUR PYTHON ENV DIRECTORY PATH HERE> `

- Open `asklvkaszus-backend.py` file with your favourite text editor for example with `nano`:

`nano asklvkaszus-backend.py`

- Search for `# ----- BEGINNING OF CONFIGURATION -----` line and modify some things below it:

<br>

`FRONTEND_HOST = "your-frontend.host"` and `ADMIN_HOST = "your-backend.host"` - Please enter there your Main Frontend URL and Admin Panel URL WITHOUT HTTPS at the beginning.

<br>

`SENDMSG_LIMIT = "10 per hour"` and `ADMIN_LIMIT = "50 per hour"` - Please set your rate-limiting rules to fit your needs. If you want, you can leave defaults there.

<br>

`API_KEY = "changeme"` - Your secret API Authentication Key for Authorization by using API or Admin Panel (replying to questions, deleting them etc.) Please change it from 'changeme' and set it to something that has ideally +24 characters.

<br>

`SQL_HOST = 'localhost'` - Enter your MariaDB Database Server hostname. If you are installing it on the same host, you can leave defaults there.
<br>
`SQL_PORT = 3306` - Enter your MariaDB Database Server port. If you didn't change MariaDB port, you can leave defaults there.
<br>
`SQL_USER = 'asklvkaszus'` - Enter your MariaDB User for Backend access. If you didn't change username, you can leave defaults there.
<br>
`SQL_PASSWORD = 'admin'` - Password of your MySQL/MariaDB User that you provided above. Please change it from 'admin' and set it to something that has ideally +16 characters.
<br>
`SQL_DATABASE = 'asklvkaszus'` - Enter your Database Name from MariaDB that Backend will use to store your questions and answers. If you didn't change Database Name, you can leave defaults there.

<br>

`REDIS_HOST = 'localhost'` - Hostname or IP Address to your Redis Server where rate-limiting and temporary data will be stored. 'localhost' is default.
<br>
`REDIS_PORT = 6379` - Port number of your Redis Server - 6379 is default.
<br>
`REDIS_DBS = [0, 1]` - Database numbers in your Redis Server. Number '0' is for rate-limiting data, and '1' is for temporary data (only for storing generated ID's temporarily for now)


- And that's should be it for configuring Backend. Save the file by pressing `Ctrl+S` and exit the editor by pressing `Ctrl+X`.

- Install all required dependencies by executing this command inside your created PyEnv for Backend:

`pip install -r requirements.txt`

- After done installing dependencies, check if you can run Python Backend without any problems. If you see this, you are good to go!

```
python3 asklvkaszus-backend.py

 * Serving Flask app 'asklvkaszus-backend'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

- Also check if you can run GUnicorn HTTP Server for Backend. You should see something like this:

```
gunicorn -c gunicorn_config.py asklvkaszus-backend:app

[2023-07-30 20:39:19 +0000] [26394] [INFO] Starting gunicorn 21.2.0
[2023-07-30 20:39:19 +0000] [26394] [INFO] Listening at: http://0.0.0.0:3030 (26394)
[2023-07-30 20:39:19 +0000] [26394] [INFO] Using worker: gthread
[2023-07-30 20:39:19 +0000] [26395] [INFO] Booting worker with pid: 26395
```

- If both of these things are working correcly, then you can create systemd service unit by entering this command:

`sudo nano /etc/systemd/system/asklvkaszus-backend.service`

- Paste this contents into this new file:

```
[Unit]
Description=Ask @lvkaszus! - Python Flask Backend Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/<YOUR_USERNAME>/asklvkaszus-backend
Environment="PATH=/home/<YOUR_USERNAME>/asklvkaszus-backend/bin"
ExecStart=/home/<YOUR_USERNAME>/asklvkaszus-backend/bin/gunicorn -c /home/<YOUR_USERNAME>/asklvkaszus-backend/gunicorn_config.py asklvkaszus-backend:app
Restart=always

[Install]
WantedBy=multi-user.target
```

- Refresh systemd services, enable and also start Backend service:

```
sudo systemctl daemon-reload
sudo systemctl enable --now asklvkaszus-backend
```

- Deactivate Python Virtual Environment:

`deactivate`

- And that's should be it for Backend installation and configuration!

<br><br>

### Frontend

- Go to your cloned repository folder and then to Frontend folder, for example:

`cd ~/asklvkaszus-react/asklvkaszus-frontend`

- Install required NPM dependencies:

`npm install`

- Create new Environment Variable File by using:

`nano .env`

- And pasting this to .env file, modify those accordingly:

```
VITE_API_DOMAIN_NAME="YourBackendDomainNameWithoutHttpsAtTheBeginning"
VITE_YOUR_NICKNAME="YourNickname"
```

- When you are done modifying those variables, save and exit your file editor.

- Build source files:

`npm run build`

- Check if `dist` folder exists by entering `ls` command. If yes, move it to `/var/www/` folder or other that matches your case:

```
sudo mkdir /var/www # This is needed if you don't installed Apache2 or NGINX yet or if it does not exists!
sudo mv dist/ /var/www/asklvkaszus-frontend
sudo chown -R www-data:www-data /var/www/asklvkaszus-frontend # You must install Apache2 or NGINX, without it this command may not work!
```

- And that's should be it for Frontend installation and configuration!

<br><br>

### Admin Panel

- Go to your cloned repository folder and then to Admin Panel folder, for example:

`cd ~/asklvkaszus-react/asklvkaszus-admin`

- Install required NPM dependencies:

`npm install`

- Create new Environment Variable File by using:

`nano .env`

- And pasting this to .env file, modify those accordingly:

```
VITE_YOUR_NICKNAME="YourNickname"
```

- When you are done modifying those variables, save and exit your file editor.

- Build source files:

`npm run build`

- Check if `dist` folder exists by entering `ls` command. If yes, move it to `/var/www/` folder or other that matches your case:

```
sudo mkdir /var/www # This is needed if you don't installed Apache2 or NGINX yet or if it does not exists!
sudo mv dist/ /var/www/asklvkaszus-admin
sudo chown -R www-data:www-data /var/www/asklvkaszus-admin # You must install Apache2 or NGINX, without it this command may not work!
```

- And that's should be it for Admin Panel installation and configuration!


#### After installation Steps

When you are done installing everything above for this project, head out to the `After installation steps.md` file to expose your freshly installed Anonymous Q&A application like this one to your domain name and world-wide web!


#### You experienced problems after installation process?

If you experienced any problems after the installation, open and read `Common problems after installation.md` file for further help!