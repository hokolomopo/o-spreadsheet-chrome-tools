# o-spreadsheet-chrome-tools

Clear & Reload o-spreadsheet with a keyboard shortcut

## Installation

Install extension on chrome :

-   Go to chrome://extensions
-   Turn on Developer Mode
-   `Load Unpacked` button, select this folder

## Functionalities

### In o_spreadsheet ( demo or odoo/runbot odoo)

-   Expose some debugging variables in window for easier access ( writing o_spreadsheet.\_\_DEBUG\_\_.model is annoying). Exposed variables :
    -   `model`
    -   `getters`
    -   `dispatch`
    -   `sheetId` (active sheet id)
    -   `sheet` (active sheet)
    -   `figureId` (selected figure id)
    -   `figure` (selected figure)
    -   `cell` (selected cell)
-   On demo : ctrl + M to reload and delete revisions

### For PRs in spreadsheet/enterprise/odoo

-   On PR creation, ctrl + M to format pr message/add a link to the corresponding odoo task
-   On PR page, ctrl + M to put branch name/pr url into clipboard as HTML to paste it in corresponding odoo task
-   On odoo/enterprise pr: modify "copy branch name to clipboard" button to not include prefix "odoo-dev:"

### For Runbots

-   Press ctrl + M from anywhere to be redirected to a random spreadsheet
    -   so open random Runbot => press ctrl + M to go to a spreadsheet to test stuff
    -   no need to connect or anything
