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
    -   in o-spreadsheet, ctrl + M first adapt the target base to match the name of the branch
-   On PR page, ctrl + M to put branch name/pr url into clipboard as HTML to paste it in corresponding odoo task
-   On odoo/enterprise pr: modify "copy branch name to clipboard" button to not include prefix "odoo-dev:"

### For Runbots

-   Press ctrl + M from anywhere to be redirected to a random spreadsheet
    -   so open random Runbot => press ctrl + M to go to a spreadsheet to test stuff
    -   no need to connect or anything

-   Press ctrl + L from a dashboard to be redirected to the edition of the dashboard
    -   ctrl + L on the spreadsheet to go back to the dashboard

### On odoo.com tasks

-   On a project task page, a small copy button appears at the end of every `branch`
    line in the Description (`branch:`, `branch enterprise:`, `branch community:`, and
    the bare `enterprise:` line) — click it to put the clean branch name in the
    clipboard, without the invisible characters the editor pads values with.
    -   Buttons float in an overlay anchored to `document.body`; nothing is ever
        injected into the description, which would otherwise be saved into the task.
    -   Add new labels (`pr:`, `task:`, ...) to `TBC_LABEL_RULES` at the top of
        `task_branch_copy/task_branch_copy.js`.
