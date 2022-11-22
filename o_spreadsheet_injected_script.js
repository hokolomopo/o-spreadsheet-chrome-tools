function waitForOSpreadsheetLoad(func) {
    setTimeout(() => {
        if (window.o_spreadsheet) {
            func();
        } else {
            waitForOSpreadsheetLoad(func);
        }
    }, 100);
}

waitForOSpreadsheetLoad(() => {
    window.model = window.o_spreadsheet.__DEBUG__.model;
    window.getters = window.o_spreadsheet.__DEBUG__.model.getters;
    window.dispatch = window.o_spreadsheet.__DEBUG__.model.dispatch;

    console.log("Model, Getters, and Dispatch now exposed in window");
});
