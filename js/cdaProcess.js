const fs       = require('fs')
var Mustache   = require('mustache');
const {remote} = require('electron');
var dialog     = remote.dialog;

async function handleNewButton() {
  try {
    var data = $("#covidForm").serializeArray();

    console.log(`🐛 ${JSON.stringify(data)}`)


    toTemplate = {}
    data.forEach((object, i) => {
      toTemplate[object[Object.keys(object)[0]]] = object.value
    });

    const dataTemplate = await fs.readFileSync('./templates/template.mustache');
    const languageCommunicationTemplate = await fs.readFileSync('./templates/template_languageCommunication.mustache');
    var output = Mustache.render(dataTemplate.toString(), toTemplate);
    var languageObj = [
      {
        languageCode: 'eng',
        proficiencyLevelCode__code: 'E',
        proficiencyLevelCode__displayName: 'Excellent',
        modeCode__code: 'ESP',
        modeCode__displayName: 'Expressed spoken',
        preferenceInd: true,
      },
      {
        languageCode: 'esp',
        proficiencyLevelCode__code: 'G',
        proficiencyLevelCode__displayName: 'Good',
        modeCode__code: 'EWR',
        modeCode__displayName: 'Expressed written',
        preferenceInd: false,
      },
    ]

    // console.log(`🐛0 ${JSON.stringify(languageObj)}`)
    var outputLanguage = "";
    languageObj.forEach((lang) => {
      outputLanguage = outputLanguage.concat(Mustache.render(languageCommunicationTemplate.toString(), lang));
    });

    // console.log(`🐛language rendered: ${outputLanguage}`)

    var objTmp = {
      languageCommunications: outputLanguage
    }

    console.log(`🐛 OBJTMP ${JSON.stringify(objTmp)}`)


    const clinicalDocumentTemplate = await fs.readFileSync('./templates/template_ClinicalDocument.mustache');
    var outputCD = Mustache.render(clinicalDocumentTemplate.toString(), objTmp);

    // console.log(`🐛whole: ${outputCD}`)


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
        fs.writeFile(file, outputCD, (err) => {
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
