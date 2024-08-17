# **Hello! Project is not dead! 😄️ In the upcoming 3.0 version, much things will change. Some useful features will be added and update will be available in several days!**
<br><br>
About Upcoming v3.0:
- Completely re-written and re-designed Backend
- `.env` Environment Variable File with generator written in bash for Backend Settings
- Using JSON Body to send and receive data (instead of HTTP Headers) to fix other problems with encoding/decoding when sending messages/displaying current messages
- Sender Blocking based on sender's IP address blacklisting in one of the database tables (IP Addresses of Users around the internet are public after all, so sender's anonymity/privacy has not been lost!)
- Authorization System that consists of Register + Login + Change Password + Logout features working with JSON Web Tokens (JWT) that are stored in cookies with `HttpOnly=True`, `Secure=True` and `SameSite=Strict` parameters for enhanced protection against XSS and other attacks
- Cross-Site Request Forgery (CSRF) Protection by Flask-WTF
- Separate Rate-limiting for Authorization System, User Frontend Endpoints, Admin Frontend Enpoints, User RESTful API Endpoints and Admin RESTful API Endpoints to enhance rate-limiting options customization
- SQLAlchemy instead of pure SQL Queries
- User/Admin Frontend API
- RESTful User/Admin API with option to restrict CORS Access-Control-Allow-Origin header in .env file
- Feature to completely disable/enable turning on application RESTful User/Admin API by changing Global API setting in application global settings
- User Frontend and Admin Frontend are in one package now (because of CSRF Protection issues when User Frontend was on second domain and when Admin Frontend was on some other domain)
- Update Checker
- 'Approve Questions First' Mode
- Added feature to hide/show all questions or hide/show single question
- Telegram Notifications
- Integrated Backend Tools for recovering/changing administrator password, deleting administrator account or restoring factory default settings
- Re-designed User Interface with Material UI library
<br>
and many more...

## Ask @lvkaszus! - Python + React

- Anonymous questions and answers pretty much like <a href="https://ngl.link">NGL App</a> or <a href="https://tellonym.me/">Tellonym</a>, with Backend written in Python, very simple user interface, support for i18n and also BBCode!

<div style="display: flex;">
  <img src="asklvkaszus-frontend.png" alt="Ask @lvkaszus! - Frontend" style="width: 49%;">
  <img src="asklvkaszus-admin_panel.png" alt="Ask @lvkaszus! - Admin Panel" style="width: 49%;">
</div>

⚠️ WARNING! - You must have domain name and SSL/TLS certificate to use this application without any modifications to the source code! This is needed for your security. ⚠️

## Why this was created?

I pretty much like the conception of <a href="https://ngl.link">NGL App</a> or <a href="https://tellonym.me/">Tellonym</a>, but I didn't like overall application operation. So, I created my own alternative to them with some added features and no analytics inside source code.


### Features
- You can change nickname viewed on Frontend and Backend from "@lvkaszus" to for example "@MyNickname"
  
- Separated Backend, Frontend and Admin Panel
  
- i18n support for internationalization
  
- BBCode support for bold, italic and underlined text but also with YouTube video embed support and Map Location embed by OpenStreetMap (currently by `dangerouslySetInnerHTML` and sanitization in backend, but this will change in next release)
  
- Rate-limiting by Flask-Limiter and Redis
  
- Database powered by MariaDB
  
- Admin Panel with options like deleting all questions, replying to questions and also deleting single questions
  
- Very basic authentication system by using API Auth Key specified by you during installation of Backend of this App and Cookies with expiration time of 30 minutes by default


### Do you want to contribute?

If you want to add new feature to this project or improve something, you can contribute without any problems!


### Credits
- This project uses Python libraries like Flask, Flask-Limiter, Flask-CORS, mysql-connector-python, bleach and others. 
- This project uses React library. (https://github.com/facebook/react)
- This project uses Vite library. (https://github.com/vitejs/vite)
- This project uses Axios library. (https://github.com/axios/axios)
- This project uses i18n for React library. (https://github.com/i18next/react-i18next)
- This project uses Font Awesome for React library. (https://github.com/FortAwesome/react-fontawesome)
- This project uses Fira Code font. (https://github.com/tonsky/FiraCode)
