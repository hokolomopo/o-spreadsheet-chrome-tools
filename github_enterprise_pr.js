window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded")

window.addEventListener("keydown", (e) => {
  if (e.key === "m" && e.ctrlKey) {
    const pr = window.location.href;

    const branch = document.querySelectorAll(".commit-ref")[1].title.replace(/^.*\:/, "");
    const strForClipboard = `<b>pr: </b><a href=${pr}>${pr}</a> </br><b>enterprise: </b>${branch}`

    var type = "text/html";
    var blob = new Blob([strForClipboard], { type });
    var data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data);

    console.log({branch, pr})
  }
});
