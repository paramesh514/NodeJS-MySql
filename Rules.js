const http = require('http');

var ts = 0;
var light = "off";
var timeout = null;
var light1 = "off";
var timeout1 = null;
//function Rule processing
function my_process(context, key, value) {
  //cntx = context;
  //Rule 1
  //  console.log("checking rules for" +key+" "+value);
  if ((key != "home.power") && (context.getValue("Home.power")) != "on") {
    if (context.getValue("HallLight.status") == "online" ||
      context.getValue("BedLight.status") == "online"
      || context.getValue("ParamMiniTv.status") == "online") {
      context.setValue("Home.power", "on");
      context.notify('power came');

    }
  }

  //Rule 2
  if ((key != "home.power") && (context.getValue("Home.power")) == "on") {
    if (context.getValue("HallLight.status") != "online"
      && context.getValue("BedLight.status") != "online"
      && context.getValue("ParamMiniTv.status") != "online") {
      context.setValue("Home.power", "off");
      context.notify('power gone');
    }
  }
  //Rule 3
  if ((key == "google.status") && (value == "online")) {
    //    context.runCommand("service parammon restart");
  }
  if ((key == "paramifit.status") && (value == "online")) {
    context.setValue("home.lock", "off");
  }
  if ((key == "paramredmi.status") && (value == "online")) {
    context.setValue("home.lock", "off");
  }
  if ((key == "paramredmi.bluestatus") && (value == "online")) {
    context.setValue("home.lock", "off");
  }
  //Rule 4
  if ((key == "home.lock") && (value == "on")) {
    console.log("Locking home intiated");
    for (var device of ["ParamMiniTv", "ParamTv", "Projector", "ParamMini", "ParamMini"]) {
      console.log("Checking " + device);
      if (context.getValue(device + ".status") == "online") {
        context.notify("Switch of all deivices like " + device);
        break;
      }
    }
    context.setValue("HallLight.state", "off");
    context.setValue("HallLight.auto", "off");
    context.setValue("BedLight.state", "off");
    context.setValue("BedLight.auto", "off");
  }
  if ((key == "home.lock") && (value == "off")) {
    console.log("UnLocking home intiated");
    //context.setValue("HallLight.state", "off");
    context.setValue("HallLight.auto", "on");
    //context.setValue("BedLight.state","off");
    context.setValue("BedLight.auto", "on");
  }
  //Rule5
  // if(
  //(motion != context.getValue("parampi.motion"))  && 
  if (key == "parampi.motion1" && context.getValue("HallLight.auto") == "on") {
    if (context.getValue("parampi.motion") == "on") {
      var date = new Date();
      hour = date.getHours();
      //motion="on";
      ts = date.getTime();
      if (hour > 21 || hour < 6) {
        if (light == "off") {
          light = "on";
          timeout = setTimeout(
            function () {
              var tso = ts;
              setHallLightOff(context, tso);
            }, 60000);
          console.log(ts + " : Motion on - Light on");
          //light = "on";

          if (context.getValue("Home.power") == "on")
            context.setValue("HallLight.state", "normal");
          else
            context.setValue("EmergencyLight/State", "on");

        }
        else {
          if (!timeout)
            timeout.clearTimeout()
          timeout = setTimeout(
            function () {
              //var tso= ts;
              setHallLightOff(context);
            }, 120000);
          console.log("Timer started as new");
        }
      }
      else if (hour == 21) {
        if (light1 == "off") {
          timeout1 = setTimeout(
            function () {
              //var tso= ts;
              setHallLightOff1(context);
            }, 300000);
          console.log(ts + " : Motion on - Light1 on");
          light1 = "on";

          if (context.getValue("Home.power") == "on")
            context.setValue("HallLight.state", "normal");
          else
            context.setValue("EmergencyLight/State", "on");

        }
        else {
          if (!timeout1)
            timeout1.clearTimeout()
          timeout1 = setTimeout(
            function () {
              var tso = ts;
              setHallLightOff1(context);
            }, 600000);
          console.log("Timer1 started as new");
        }
      }
      else {
        if (hour > 17 && hour < 21) {
          if (context.getValue("Home.power") == "on")
            context.setValue("EmergencyLight/State", "off");
          else
            context.setValue("EmergencyLight/State", "on");
        }

        //        console.log("Motion on - not in hours");
      }
    }
  }

}
function setHallLightOff(context) {
  console.log("Motion off - Light off");
  light = "off";
  context.setValue("HallLight.state", "off");
  context.setValue("EmergencyLight/State", "off");
}
function setHallLightOff1(context) {
  console.log("Motion off - Light1 off");
  light1 = "off";
  context.setValue("HallLight.state", "night");
  context.setValue("EmergencyLight/State", "off");
}
module.exports = {
  process: my_process
};
