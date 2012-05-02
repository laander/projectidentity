(function() {
  var Recipe, app, express, io;
  Recipe = require("./recipes/Lebara.js");
  express = require("express");
  app = express.createServer();
  app.listen(3000);
  io = require("socket.io").listen(app);
  io.set('log level', 0);
  GLOBAL.debug_mode = false;
  app.use(express.bodyParser());
  app.get("/*.html", function(req, res) {
    return res.sendfile(__dirname + "/pages/" + req.url);
  });
  app.get("/js/*", function(req, res) {
    return res.sendfile(__dirname + req.url);
  });
  app.get("/css/*", function(req, res) {
    return res.sendfile(__dirname + req.url);
  });
  app.get("/images/*", function(req, res) {
    return res.sendfile(__dirname + req.url);
  });
  app.get("/", function(req, res) {
    return res.sendfile(__dirname + "/pages/index.html");
  });
  io.sockets.on('connection', function(socket) {
    return socket.on("setInputData", function(data) {
      var recipe;
      if (data.debug_mode != null) {
        GLOBAL.debug_mode = true;
      }
      if (data.session_cookie != null) {
        return new Recipe(data.inputData, socket, data.session_cookie);
      } else {
        recipe = new Recipe(data.inputData, socket);
        return recipe.prepareRequest(function() {
          return recipe.bruteForce();
        });
      }
    });
  });
}).call(this);
