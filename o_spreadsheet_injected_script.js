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
    if(!window.o_spreadsheet?.__DEBUG__?.model){
        return;
    }

    Object.defineProperty(window, "model", {
        get: function () {
            return window.o_spreadsheet?.__DEBUG__?.model;
        },
    });
    Object.defineProperty(window, "getters", {
        get: function () {
            return model.getters;
        },
    });
    Object.defineProperty(window, "dispatch", {
        get: function () {
            return model.dispatch;
        },
    });

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
    Object.defineProperty(window, "chart", {
        get: function () {
            return model.getters.getChart(model.getters.getSelectedFigureId()).getDefinition();
        },
    });
    Object.defineProperty(window, "cell", {
        get: function () {
            return model.getters.getActiveCell();
        },
    });
    Object.defineProperty(window, "coreCell", {
        get: function () {
            const sheetId = model.getters.getActiveSheetId();
            const selection = model.getters.getSelectedZone();
            return model.getters.getCell({ sheetId, col : selection.left, row : selection.top });
        },
    });
    Object.defineProperty(window, "cellPosition", {
        get: function () {
            const sheetId = model.getters.getActiveSheetId();
            const selection = model.getters.getSelectedZone();
            return { sheetId, col : selection.left, row : selection.top };
        },
    });
    Object.defineProperty(window, "position", {
        get: function () {
            return window.cellPosition;
        },
    });
    Object.defineProperty(window, "pivotId", {
        get: function () {
            const position = model.getters.getActivePosition();
            return model.getters.getPivotIdFromPosition(position);
        },
    });
    Object.defineProperty(window, "pivot", {
        get: function () {
            const pivotId = window.pivotId;
            return model.getters.getPivot(pivotId);
        },
    });
    Object.defineProperty(window, "corePivot", {
        get: function () {
            return model.getters.getPivotCoreDefinition(window.pivotId);
        },
    });
    Object.defineProperty(window, "target", {
        get: function () {
            return model.getters.getSelectedZones();
        },
    });
});
