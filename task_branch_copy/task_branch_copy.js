console.log("Task Branch Copy Loaded");

// Add a label here to give it a copy button; nothing below this array changes.
//
// `matchLabel` is tested against the normalized label text (invisibles stripped,
// lowercased, trailing ":" or "-" removed), so it must match:
//     "branch"  "branch enterprise"  "branch community"  "branch - name"
//     "enterprise"  "community"   <- github_o_spreadsheet_pr.js emits a bare one
// and must NOT match "pr", "pr enterprise", "adrm notes", "".
const TBC_LABEL_RULES = [
    {
        id: "branch",
        title: "Copy branch name",
        matchLabel: /^(?:branch(?:\s+[\w-]+)?|enterprise|community)$/,
        extractValue: (label) => tbcCleanValue(tbcValueText(label)),
        isValid: (value) => value.length > 3 && /^[\w.\/-]+$/.test(value),
    },
    // Future labels need no logic changes, e.g.:
    // {
    //     id: "pr",
    //     title: "Copy PR url",
    //     matchLabel: /^pr(?:\s+[\w-]+)?$/,
    //     extractValue: (label) => tbcValueHref(label) || tbcCleanValue(tbcValueText(label)),
    //     isValid: (value) => value.startsWith("http"),
    // },
];

const TBC_MAX_ENTRIES = 20;
const TBC_INVISIBLE = /[﻿​]/g;

let tbcPath = location.pathname;

function tbcCleanValue(str) {
    return str.replace(TBC_INVISIBLE, "").replace(/ /g, " ").trim();
}

function tbcNormalizeLabel(label) {
    return tbcCleanValue(label.textContent)
        .toLowerCase()
        .replace(/\s*[:\-]\s*$/, "")
        .trim();
}

function tbcMatchRule(label) {
    const text = tbcNormalizeLabel(label);
    if (!text) {
        // The stray empty <b> that github_odoo_pr.js leaves on every branch line.
        return null;
    }
    return TBC_LABEL_RULES.find((rule) => rule.matchLabel.test(text)) || null;
}

// Everything after the label, up to the next recognized label. Concatenating
// textContent covers both observed shapes with one walker: the plain-text value, and
// the <a>-wrapped one whose U+FEFF padding falls away in tbcCleanValue.
function tbcValueText(label) {
    let text = "";
    for (let node = label.nextSibling; node; node = node.nextSibling) {
        if (node.nodeType === Node.ELEMENT_NODE && tbcMatchRule(node)) break;
        text += node.textContent || "";
    }
    return text;
}

function tbcValueHref(label) {
    const line = label.closest(".o-paragraph, p, li, div");
    const link = line && line.querySelector("a[href]");
    return link ? link.href : "";
}

function tbcCreateEntry(label, rule, value) {
    const entry = { label, rule, value, button: null, transform: "", hidden: true };
    entry.button = tbcCreateButton(rule.title);

    // Load-bearing: without this the click blurs the editor, and Odoo's html field
    // commits on blur - copying would touch the record and broadcast to collaborators.
    // It also keeps document.hasFocus() true, which clipboard.writeText requires.
    entry.button.addEventListener("mousedown", (ev) => ev.preventDefault());

    entry.button.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        // Re-extract live: the line may have been edited since the last scan.
        const current = entry.rule.extractValue(entry.label);
        if (!entry.rule.isValid(current)) return;

        navigator.clipboard.writeText(current);
        toast(`Copied "${current}"`);
    });

    return entry;
}

// The repo polls everywhere rather than observing. Here it is also the right call: the
// collaborative editor mutates this subtree on every keystroke, remote edit and caret
// move, so a MutationObserver would need rate-limiting back to ~500ms anyway. The scan
// never hides anything and the loop never creates anything, so the two cadences cannot
// race.
function tbcScan() {
    // Client-side navigation: drop everything at once, so buttons from task A never
    // hover over task B.
    if (tbcPath !== location.pathname) {
        tbcPath = location.pathname;
        tbcClearAll();
    }

    const form = document.querySelector(".o_form_view.o_project_task_form_view");
    const editable =
        form && form.querySelector('div[name="description"] .note-editable.odoo-editor-editable');

    // When the Description notebook tab is inactive its .tab-pane subtree is destroyed,
    // so `editable` is null here and everything is reaped - no tab detection needed.
    if (!editable || document.querySelector(".modal.show")) {
        tbcEditable = null;
        if (tbcEntries.length) tbcClearAll();
        return;
    }

    if (editable !== tbcEditable) {
        tbcEditable = editable;
        tbcClearAll();
        tbcClipNodes = tbcBuildClipNodes(editable);
    }

    // Reap: line deleted, node replaced by an Owl re-render, or label text edited so it
    // no longer matches the same rule.
    for (let i = tbcEntries.length - 1; i >= 0; i--) {
        const entry = tbcEntries[i];
        if (
            !entry.label.isConnected ||
            !editable.contains(entry.label) ||
            tbcMatchRule(entry.label) !== entry.rule
        ) {
            entry.button.remove();
            tbcEntries.splice(i, 1);
        }
    }

    // Discover. Dedupe on label node identity: Owl replaces nodes rather than mutating
    // them, so identity detects staleness for free and no marker goes near the editable.
    for (const label of editable.querySelectorAll("b, strong")) {
        if (tbcEntries.length >= TBC_MAX_ENTRIES) break;
        if (tbcEntries.some((entry) => entry.label === label)) continue;

        const rule = tbcMatchRule(label);
        if (!rule) continue;

        const value = rule.extractValue(label);
        if (!rule.isValid(value)) continue;

        tbcEntries.push(tbcCreateEntry(label, rule, value));
    }

    // Orphan sweep: buttons left by a double injection or an exception mid-scan.
    for (const button of [...tbcOverlay.children]) {
        if (!tbcEntries.some((entry) => entry.button === button)) {
            button.remove();
        }
    }

    if (tbcEntries.length) tbcStartLoop();
}

tbcScan();
setInterval(tbcScan, 500);
