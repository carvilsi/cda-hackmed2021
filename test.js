const fs       = require('fs')
var Mustache   = require('mustache');
const {remote} = require('electron');
var dialog     = remote.dialog;

async function handleNewButton() {
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

    var data   = await fs.readFileSync('./template.mustache');
    var output = Mustache.render(data.toString(), toTemplate);

    var browserWindow = remote.getCurrentWindow();
    var options = {
        title: "Save CDA file",
        defaultPath : "/tmp",
        filters: [
            {name: 'Custom File Type', extensions: ['xml']}
        ]
    }

    dialog.showSaveDialog({browserWindow, options}, (file)=>{
      if (typeof file  !== 'undefined') {
        fs.writeFile(file, output, (err) => {
          if (err) throw err
          console.log(`Filel ${file} has been saved`);
        })
      }
    });
  } catch (e) {
    console.log(e);
  }
}

onload = function() {
  newButton = document.getElementById("button");

  newButton.addEventListener("click", handleNewButton);


};
