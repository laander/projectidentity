(function() {
  var addToProgressbar, countCprList, setInputData;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.cprList = [];
  this.countCompleted = 0;
  this.dob = 0;
  window.socket = io.connect();
  $(document).ready(function() {
    $(".accordion").accordion({
      autoHeight: false,
      collapsible: true
    });
    $(".stats").progressbar({
      value: 0
    });
    $("#sex").buttonset();
    $("#next").click(function() {
      $("#next").button("disable");
      $("#loading").fadeIn();
      socket.emit("next");
      return console.log("next was clicked");
    });
    return $("#findValidNumbers").click(setInputData);
  });
  socket.socket.on('error', function(reason) {
    return console.error('Unable to connect Socket.IO', reason);
  });
  socket.on('correctCpr', function(data) {
    addToProgressbar();
    console.log("Correct: " + data.cpr);
    console.log(data);
    $("#correctCpr").append(data.cpr + ' ').effect('highlight', {
      color: '#E78F08'
    });
    return $("#loading").hide();
  });
  socket.on('incorrectCpr', function(data) {
    var container;
    addToProgressbar();
    console.log("Incorrect: " + data.cpr);
    container = $('<div></div>');
    $('<p></p>', {
      text: "CPR: " + data.cpr
    }).appendTo(container);
    $('<p></p>', {
      text: data.msg
    }).appendTo(container);
    return container.prependTo('#failedNumbers');
  });
  socket.on('lookupFailed', function(data) {
    addToProgressbar();
    return $("#failedCpr").append(data.cpr + ' ').effect('highlight', {
      color: '#E78F08'
    });
  });
  socket.on("waitForClient", function(data) {
    console.log("server waiting for client: " + data["name"]);
    $("#loading").fadeOut();
    return $("#next").button("enable");
  });
  socket.on("renderPreparationResponse", function(data) {
    var body;
    console.log(data);
    $(".accordion div").html("");
    if (data.req != null) {
      $("#requestUrl").html(data.req.url);
    }
    if (data.res != null) {
      body = $(data.res.body.replace(/<script[\d\D]*?>[\d\D]*?<\/script>/g, ""), "body");
      if (body.find(data.domTarget).length === 0) {
        body.appendTo("#responseBody");
      } else {
        body.find(data.domTarget).appendTo("#responseBody");
      }
    }
    if (data.res != null) {
      $("#responseHeader").html(data.res.head.replace(/\n/g, "<br />"));
    }
    $("#errors").html(JSON.stringify(data.err));
    if (data.err != null) {
      $(".accordion").accordion("activate", 3);
    }
    $("#requestHeader").html(JSON.stringify(data.req));
    return $(".accordion").accordion("resize");
  });
  countCprList = function() {
    return this.cprList.length;
  };
  addToProgressbar = function() {
    countCompleted++;
    return $(".stats.completed").progressbar("option", "value", countCompleted / countCprList() * 100);
  };
  setInputData = function() {
    var dob, firstName, gender, lastName;
    $("#loading").show();
    dob = $("input[name=dob]").val();
    firstName = $("input[name=firstName]").val();
    lastName = $("input[name=lastName]").val();
    gender = $("input[name=gender]:checked").val();
    return generateCombinations(dob, firstName, lastName, gender, __bind(function(cprList) {
      console.log(cprList);
      this.cprList = cprList;
      return socket.emit("setInputData", {
        inputData: {
          dob: dob,
          firstName: firstName,
          lastName: lastName,
          cprList: cprList
        }
      });
    }, this));
  };
}).call(this);
