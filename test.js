const fs = require('fs')
var Mustache = require('mustache');

function handleNewButton() {
  try {
    console.log(JSON.stringify($("#reportForm").serializeArray()));
    var data = $("#reportForm").serializeArray();
    toTemplate = {}
    data.forEach((object, i) => {
      toTemplate[object[Object.keys(object)[0]]] = object.value

      var jsonObject;
      try {
          jsonObject = JSON.parse(object.value);
      } catch (exc) {
        console.log ("it is not JASON");        
      }

      if (typeof jsonObject !== 'undefined') {
        $.each(jsonObject, function(objectName, objectValue) {
          toTemplate[object[Object.keys(object)[0]] + '__' + objectName] = objectValue;
        });
      }
    });

    fs.readFile('./template.mustache', function (err, data) {
      if (err) throw err;
      var output = Mustache.render(data.toString(), toTemplate);
      console.log(`🐛 ${JSON.stringify(output)}`)
    });

  } catch (e) {
    console.log(e);
  }
}

onload = function() {
  newButton = document.getElementById("button");

  newButton.addEventListener("click", handleNewButton);


};
