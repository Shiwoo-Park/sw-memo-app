# ShiWoo's Simple Memo App

### Description

- Single Page Application
- Label and Memo (many-to-many) management 

### Front End

- CSS Design : Bootstrap SASS, Awesome Font
- HTML Processor : Jquery, AngularJS
- Others : Bower, Gulp, JsLint

### Back End

- Database : MySQL, Sequelize(ORM)
- Web Server : Node.js, Express(Framework)

### Setup

- Install Node.js, MySQL server
- Install gulp in global
- install bower in global
- Clone this repository
- Go to project home directory
- Install required node packages
- Remove package duplication
- Install bootstrap-sass by bower
- Install font-awesome by bower
- Setup environments (DB config, Service Mode)
- Run gulp
- Run MySQL Server
- Setup public/src/js/define.js (API server domain)
- Start Server

### Setup (Console ver.)

```
clone https://github.com/shiwoo-park/sw-memo-app.git
cd sw-memo-app

npm install
npm ddp

npm install -g bower
bower install bootstrap-sass
bower install font-awesome

cp .env-sample .env
vi .env

npm install -g gulp
gulp

npm start
```