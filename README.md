Tic Tac Toe
===========

This project is a Tic Tac Toe web application that uses the following technologies:

  * Web components.
  * Service worker.
  * Progressive web application.
  * ES2015+ (also known as ES6+).
  * ES Modules:
    * For browsers that support ES Modules natively.
  * A bundle file:
    * As a fallback for browsers that don't support ES Modules.
  * A responsive design.
  * 3D CSS animations.
  * SVG images.
  * SCSS

Some of the open source projects used to build this application are:

  * [infuse.host](https://infuse.host/)
  * [Webpack](https://webpack.js.org/)
  * [Bootstrap](https://www.getbootstrap.com/)
  * [Jest](https://jestjs.io/)
  * [ESLint](https://eslint.org/)
  * [Koa](https://koajs.com/)

## Installation ##

In order to run this application you must first clone this repository and install all NPM
dependencies by executing the following commands in your terminal:

```bash
git clone https://github.com/serg-io/tic-tac-toe.git
cd tic-tac-toe
npm install
```

## Development Mode ##

Execute the following command to start running the application in development mode:

```bash
npm run dev
```

Once the application is running, you can access it by going to
[http://localhost:3000/](http://localhost:3000/) using your web browser.

## Production Mode ##

Execute the following command to start running the application using a production build of the code:

```bash
NODE_ENV=production npm start
```

The production mode runs on the same port as the development mode (3000). When running in
production mode, this application is meant to be proxied through a server like
[Apache](https://httpd.apache.org/) or [Nginx](https://www.nginx.com/) or perhaps a load balancer.
A proxy server would allow you to serve a gzip compressed version of the code through an HTTP/2
connection.