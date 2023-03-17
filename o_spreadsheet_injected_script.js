function waitForOSpreadsheetLoad(func) {
    setTimeout(() => {
        if (window.o_spreadsheet?.__DEBUG__) {
            func();
        } else {
            waitForOSpreadsheetLoad(func);
        }
    }, 100);
}

waitForOSpreadsheetLoad(() => {
    const model = window.o_spreadsheet.__DEBUG__.model;
    window.model = model;
    window.getters = model.getters;
    window.dispatch = model.dispatch;

    console.log("Model, Getters, and Dispatch now exposed in window");

    Object.defineProperty(window, "sheetId", {
        get: function () {
            return model.getters.getActiveSheetId();
        },
    });
    Object.defineProperty(window, "sheet", {
        get: function () {
            return model.getters.getActiveSheet();
        },
    });
    Object.defineProperty(window, "figureId", {
        get: function () {
            return model.getters.getSelectedFigureId();
        },
    });
    Object.defineProperty(window, "figure", {
        get: function () {
            return model.getters.getFigure(window.sheetId, window.figureId);
        },
    });
    Object.defineProperty(window, "cell", {
        get: function () {
            return model.getters.getActiveCell();
        },
    });
});
