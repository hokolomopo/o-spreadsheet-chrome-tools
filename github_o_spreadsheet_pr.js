window.global = window;
console.log("O-Spreadsheet Chrome Extension Loaded");

window.addEventListener("keydown", (e) => {
    if (e.key === "m" && e.ctrlKey) {
        const pr = window.location.href;
        let repo = pr.replace(/.*?com\//, "");
        repo = repo.replace(/\/pull\/[0-9]*/, "");
        console.log(repo);

        const branch = document.querySelectorAll(".commit-ref")[1].title.replace(repo + ":", "");
        const enterprise = branch;

        const prStr = `<b>pr: </b><a href=${pr}>${pr}</a> </b>`;
        const branchStr = `<b>branch: </b>${branch}`;

        const runbotLink = `https://runbot.odoo.com/runbot/r-d-1?search=${enterprise}`;
        const enterpriseBranchStr = `<b>enterprise: </b><a href=${runbotLink}>${enterprise}</a> </b>`;

        const strForClipboard = prStr + "</br>" + branchStr + "</br>" + enterpriseBranchStr;

        var type = "text/html";
        var blob = new Blob([strForClipboard], { type });
        var data = [new ClipboardItem({ [type]: blob })];

        navigator.clipboard.write(data);

        console.log({ branch, enterprise, pr });
        toast("Added PR info in the clipboard")
    }
});
