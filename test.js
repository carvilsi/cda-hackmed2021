
function handleNewButton() {
  console.log("🐛 BUTTON")

}


onload = function() {
  console.log("🐛 !!!")

  newButton = document.getElementById("button");

  newButton.addEventListener("click", handleNewButton);


};
