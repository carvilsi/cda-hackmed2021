const fs       = require('fs')
var Mustache   = require('mustache');
const {remote} = require('electron');
var dialog     = remote.dialog;

async function handleNewButton() {
  try {
    console.log(JSON.stringify($("#patientNameForm").serializeArray()));
    var patientNamesJsonArray = serializedMultipleForm2JsonArrayGroups($("#patientNameForm").serializeArray(), "family");
    const patientNamesTemplate = await fs.readFileSync('./templates/patientNameTemplate.mustache');
    var patientNamesOutput = "";
    patientNamesJsonArray.forEach((nameEntry,j) => {
        toNamesTemplate = {}
        nameEntry.forEach((object, i) => {
          toNamesTemplate[object[Object.keys(object)[0]]] = object.value

          var jsonObject;
          try {
            jsonObject = JSON.parse(object.value);
          } catch (exc) {
            console.log ("it is not JASON");
          }

          if (typeof jsonObject !== 'undefined') {
            $.each(jsonObject, function(objectName, objectValue) {
              toNamesTemplate[object[Object.keys(object)[0]] + '__' + objectName] = objectValue;
            });
          }
        });
        patientNamesOutput += Mustache.render(patientNamesTemplate.toString(), toNamesTemplate) + "\n";
    });
    console.log(patientNamesOutput);
    console.log(JSON.stringify($("#languagesForm").serializeArray()));
    var patientLanguagesJsonArray = serializedMultipleForm2JsonArrayGroups($("#languagesForm").serializeArray(), "languageCode");
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

    const dataTemplate = await fs.readFileSync('./templates/template.mustache');
    var output = Mustache.render(dataTemplate.toString(), toTemplate);

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

serializedMultipleForm2JsonArrayGroups = function(serializedForm, initialField) {
    totalArray = [];
    currentArray = [];
    serializedForm.forEach((object, i) => {
        if ((object[Object.keys(object)[0]] === initialField) 
                && (currentArray.length)) {
            totalArray.push(currentArray);
            currentArray = [];
        }
        currentArray.push(object);
    });
    
    if (currentArray.length) {
        totalArray.push(currentArray);
    }

    console.log (totalArray);
    
    return totalArray;
  
};