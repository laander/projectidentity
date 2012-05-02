(function() {
  var $, Curl, Recipe, querystring;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Recipe = require("../Recipe.js");
  Curl = require("../utils/Curl.js");
  $ = require("jquery");
  querystring = require("querystring");
  this.Greentel = (function() {
    __extends(Greentel, Recipe);
    function Greentel(inputData, socket) {
      this.inputData = inputData;
      this.socket = socket;
      this.counter = 0;
      this.domTarget = "";
      this.req = {
        'insecure': true,
        url: "https://www.greentel.dk/index.php?ajax=true",
        data: {
          up_ajax_action: "do_address_check",
          cpr: inputData["dob"] + '' + inputData["cprList"][0],
          fullname: inputData["lastName"]
        }
      };
    }
    Greentel.prototype.updateCPR = function() {
      return this.req.data.cpr = this.inputData["dob"] + "" + this.inputData["cprList"][this.counter];
    };
    Greentel.prototype.getResponse = function(req, res, callback) {
      var cpr;
      cpr = querystring.parse(req.data).cpr;
      if (res == null) {
        callback(cpr, "error", "Could not get response");
        return false;
      }
      if ((res.body != null) && res.body.indexOf("#address") > -1) {
        return callback(cpr, "success", "");
      } else {
        return callback(cpr, "error", res.body);
      }
    };
    return Greentel;
  })();
  module.exports = this.Greentel;
}).call(this);
