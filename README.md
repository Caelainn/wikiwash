    __          __  _   _      _                            _     
    \ \        / / (_) | |    (_)                          | |    
     \ \  /\  / /   _  | | __  _  __      __   __ _   ___  | |__  
      \ \/  \/ /   | | | |/ / | | \ \ /\ / /  / _` | / __| | '_ \ 
       \  /\  /    | | |   <  | |  \ V  V /  | (_| | \__ \ | | | |
        \/  \/     |_| |_|\_\ |_|   \_/\_/    \__,_| |___/ |_| |_|
                                                                   
Track whitewashing on Wikipedia. Try out WikiWash at [wikiwash.metronews.ca](http://wikiwash.metronews.ca).

A project by [The Working Group](http://twg.ca), in collaboration with
[the Center for Investigative Reporting](http://www.centerforinvestigativereporting.org/) and 
[Metro News](http://metronews.ca/), and made possible by [Google Canada](http://googlecanada.blogspot.ca/).

## Installation & Development

On a Mac OS X machine:

```bash
# make sure you have node installed
$ brew install node

# pull the code
$ git clone git@github.com:twg/wikiwash.git
$ cd wikiwash

# fetch package dependencies
$ npm install
$ bower install

# launch the dev server
$ npm start
$ open http://localhost:3000/
```

WikiWash has been developed on Mac OS X and deployed on Linux, but in theory,
should work on any operating system. If you've tried running WikiWash on your own machine,
feel free to edit this readme to update the above instructions.

## Issues & Contributions

Found a problem with WikiWash? [Submit an issue](https://github.com/twg/wikiwash/issues/new) to
let us know.

See something that you'd like to change? We're all ears - feel free to [fork](https://github.com/twg/wikiwash/fork)
WikiWash on Github and submit a pull request to merge changes back into the application.

## Deployment

To deploy WikiWash to your own servers, you'll have to set up [PM2](https://github.com/Unitech/pm2)
on your own servers and change [ecosystem.json](https://github.com/twg/wikiwash/blob/master/ecosystem.json)
to point at your new server environments. Once that's done, deployment is as simple as:

```
$ bin/pm2 deploy production
```

## Libraries

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
