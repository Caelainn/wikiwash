    __          __  _   _      _                            _     
    \ \        / / (_) | |    (_)                          | |    
     \ \  /\  / /   _  | | __  _  __      __   __ _   ___  | |__  
      \ \/  \/ /   | | | |/ / | | \ \ /\ / /  / _` | / __| | '_ \ 
       \  /\  /    | | |   <  | |  \ V  V /  | (_| | \__ \ | | | |
        \/  \/     |_| |_|\_\ |_|   \_/\_/    \__,_| |___/ |_| |_|
                                                                   
Track whitewashing on Wikipedia. A prototype. [wikiwash.twg.ca](http://wikiwash.twg.ca)

## Develop

```bash

# install node
$ brew install node

# install cli tools globally
$ npm install -g gulp bower pm2

# pull the code
$ git clone git@github.com:twg/wikiwash.git
$ cd wikiwash

# fetch package dependencies
$ npm install
$ bower install

# compile assets and launch the dev server
$ gulp
$ open http://localhost:3000/
```

## Deploy

```
$ pm2 deploy production
```

## Documentation

#### HTTP server
* [Node.js](http://nodejs.org) - Platform for building fast, scalable network applications
* [Express](http://expressjs.com) - Web application framework

#### HTML preprocessors
* [jade](http://jade-lang.com) - HTML Template Engine

#### Front-end framework
* [AngularJS](https://angularjs.org/) - JS framework

#### Package management, build system
* [npm](https://npmjs.org) - Node Packaged Modules
* [Bower](http://bower.io) - The package manager for the web
* [gulp.js](http://gulpjs.com) - The streaming build system

#### Deployment
* [PM2](https://github.com/Unitech/pm2) - Modern CLI process manager for Node apps with a builtin load-balancer
* [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps) - How To Use PM2 to Setup a Node.js Production Environment On An Ubuntu VPS
