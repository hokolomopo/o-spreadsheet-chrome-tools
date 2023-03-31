
function getCurrentBranch(){
    return document.querySelectorAll("summary.branch span[data-menu-button]")[1].textContent
}

function getCurrentBase(){
    return document.querySelectorAll("summary.branch span[data-menu-button]")[0].textContent
}

function getCurrentBranchBase(){
    const branch = getCurrentBranch();
    if(branch.startsWith("master")){
        return "master";
    } else if(branch.startsWith("saas")){
        const split = branch.split("-");
        return split[0] + "-" + split[1];
    } else {
        const split = branch.split("-");
        return split[0];
    }
}

function setBase(base){
    const url = window.location.href;
    const compareIndex = url.indexOf("compare/");
    const rootUrl = url.slice(0, compareIndex + "compare/".length);
    const newUrl = rootUrl + base + "..." + getCurrentBranch() + "?expand=1";
    window.location.href = newUrl;
}

function adaptBaseToBranch(){
    const currentBase = getCurrentBase();
    const currentBranchBase = getCurrentBranchBase();
    if(currentBase !== currentBranchBase){
        setBase(currentBranchBase);
    }
}

function isBranchBaseAdapted(){
    const currentBase = getCurrentBase();
    const currentBranchBase = getCurrentBranchBase();
    console.log({currentBase, currentBranchBase});
    return currentBase === currentBranchBase;
}
