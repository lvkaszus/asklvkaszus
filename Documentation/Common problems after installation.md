# Common problems after installation

If you experienced any problems after installation and configuration of my project. Check out those possible fixes for you below before opening a new issue on GitHub!

<u>This list will be updated regularly when I will get a new issue about this app, and it will be easy to fix.</u>

### Can't connect to MySQL server on 'xxx:3306'

This error will be displayed inside logs of GUnicorn server or in the output of the terminal itself, and it is coming from Ask @lvkaszus! Backend side - where questions and answers are handled on the application server.

Example of this error will look like this:
- `mysql.connector.errors.DatabaseError: 2003 (HY000): Can't connect to MySQL server on 'localhost:3306' (61)`


That means that Backend side written in Python can't connect to your questions and answers database, where it will put all of your Q&A data.

<u><b>How can I fix this?<b></u>

You can fix this, by double-checking the database hostname or IP address that you provided when installing this application. Check if it is correct and not have maybe typo somewhere. If you are used Non-Docker installation method, try replacing your current MySQL Host inside Backend source code file and inside `# BEGIN CONFIGURATION` and `# END CONFIGURATION` there will be a `host='',` line. Try entering there `localhost` or when localhost is not working, try your local IP like `192.168.1.50`.

But if you was using Docker installation method to install this application, you not missed anything and fixes that I provided above are not working, check if all of the containers are on the same network or create new Docker network and deploy all of the needed containers again but with newly created network attached to all of them. If this doesn't work, you can try typing inside `MYSQL_HOST` environment variable in `asklvkaszus-backend` container a correct name of the MariaDB (or other database server) container like `asklvkaszusdatabase`.

