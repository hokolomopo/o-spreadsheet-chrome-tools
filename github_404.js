console.log("loaded github_404.js");

const fixedHRef = window.location.href.replace(/%5C/g, "");
window.location.href = fixedHRef;
