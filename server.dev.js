const next = require("next");
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const chalk = require('chalk');

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
let httpPort = process.env.PORT || 3000;
let httpsPort = 3443;
const options = dev
  ? {
    /**
     * IF YOU NEED HTTPS FOR LOCALHOST, UNCOMMENT THIS
     * AND GENERATE THE key & crt FOLLOW THIS COMMAND:
     * bash local_certificate/cer.sh
     * Read more: local_certificate/readme.md
     */
    // key: fs.readFileSync("local_certificate/localhost.key"),
    // cert: fs.readFileSync("local_certificate/localhost.crt"),
  }
  : {};

  // server.use(function (req, res, next) {
//   console.log('req.url', req.url);
//   if (req.url.match(".js|.css|.woff|.jpg|.png|.gif|.ttf|.svg")) {
//     res.setHeader("Cache-Control", "public,max-age=31536000");
//   }
//   next();
// });


init();


function init() {

  if (!dev) {
    startServer();
    return;
  }

  isPortTaken(httpPort, function (e, isBusy) {
    if (isBusy) {
      httpPort++;
      httpsPort++;
      init();
    } else {
      startServer();
    }
  })
}

function startServer() {
  app.prepare().then(() => {
    server.all("*", (req, res) => {
      return handle(req, res);
    });
    http.createServer(server).listen(httpPort);
    https.createServer(options, server).listen(httpsPort);

    if (dev) {
      openLocal();
    }
    //
  });
}

function openLocal() {
  const ip = require('ip').address();
  const _urlHttp = `http://${ip}:${httpPort}`
  const _urlHttps = `https://${ip}:${httpsPort}`

  openWeb(_urlHttp);

  console.log(chalk.whiteBright("SERVER IS LISTEN ON:"));
  console.group()
  console.log(chalk.greenBright(_urlHttp));
  console.log(chalk.yellowBright(_urlHttps));
  console.groupEnd()
}

function openWeb(url) {
  try {
    var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    require('child_process').exec(start + ' ' + url);

  } catch (error) {
    console.log(error);
  }
}


function isPortTaken(port, fn) {
  var net = require('net')
  var tester = net.createServer()
    .once('error', function (err) {
      if (err.code != 'EADDRINUSE') return fn(err)
      fn(null, true)
    })
    .once('listening', function () {
      tester.once('close', function () { fn(null, false) })
        .close()
    })
    .listen(port)
}
