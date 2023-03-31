window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded")

window.addEventListener("keydown", (e) => {
  if (e.key === "m" && e.ctrlKey) {
    if(!isBranchBaseAdapted()){
      adaptBaseToBranch();
    }else {
      parsePRDescription();
    }
  }
});

function parsePRDescription(){
  const textArea = document.querySelector("textarea");

  let text = textArea.textContent;

  const odooTaskRegex = /[\n]*[a-zA-Z\s]*([0-9]*)[\n]*(?=## Description)/;
  const odooTaskId = text.match(odooTaskRegex)[1];
  if(!odooTaskId){
    console.warn("Odoo task ID not found");
    return;
  }

  console.log(text.match(odooTaskRegex));
  text = text.replace(odooTaskRegex, "\n\n");
  text = text.replace(/## Description.*(?=Odoo task ID)/s, "");
  text = text.replace(/TASK_ID/g, odooTaskId);

  text = "## Description\n\n" + text;

  console.log(text);

  textArea.textContent = text;
}
