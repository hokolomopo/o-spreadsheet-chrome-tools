window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded")

window.addEventListener("keydown", (e) => {
  if (e.key === "m" && e.ctrlKey) {
    const pr = window.location.href;
    let repo = pr.replace(/.*?com\//, "");
    repo = repo.replace(/\/pull\/[0-9]*/, "");
    console.log(repo);

    const branch = document.querySelectorAll(".commit-ref")[1].title.replace(repo + ":", "");
    const enterprise = branch.replace(/(.*?)-/, "$1-spreadsheet");

    const strForClipboard = `<b>pr: </b><a href=${pr}>${pr}</a> </br><b>branch: </b>${branch}</br><b>enterprise: </b>${enterprise}`

    var type = "text/html";
    var blob = new Blob([strForClipboard], { type });
    var data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data);

    console.log({branch, enterprise, pr})
  }
});
