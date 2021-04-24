const fs = require('fs')
var Mustache = require('mustache');

function handleNewButton() {
  try {
    console.log(JSON.stringify($("#myForm").serializeArray()));
    var data = $("#myForm").serializeArray();
    toTemplate = {}
    data.forEach((object, i) => {
      toTemplate[object[Object.keys(object)[0]]] = object.value
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
