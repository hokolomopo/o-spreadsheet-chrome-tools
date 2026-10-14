console.log("Task Branch Copy Overlay Loaded");

// All content scripts share one isolated world per frame. On www.odoo.com it already
// holds `injectStyle` (odoo_customization.js), `redirect*`/`checkUrlTimeoutId`
// (runbot_redirect_to_spreadsheet.js) and `toastCss`/`style`/`toastContainer`/
// `snackTimeout`/`toast` (util/toast.js). Every top-level binding here is `tbc`
// prefixed: a bare `const style` would be a SyntaxError that kills the whole file.

const TBC_SIZE = 18;
const TBC_GAP = 6;

function tbcInjectStyle(css) {
    const tbcStyle = document.createElement("style");
    tbcStyle.textContent = css;
    document.head.append(tbcStyle);
}

tbcInjectStyle(/*css*/ `
    #tbcOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        overflow: visible;
        pointer-events: none;
        z-index: 900;
    }

    #tbcOverlay .tbcButton {
        position: absolute;
        top: 0;
        left: 0;

        display: flex;
        align-items: center;
        justify-content: center;
        width: ${TBC_SIZE}px;
        height: ${TBC_SIZE}px;
        padding: 0;

        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        background: #fff;
        color: #374151;

        cursor: pointer;
        opacity: 0.45;
        pointer-events: auto;
        transition: opacity 0.12s ease;
    }

    #tbcOverlay .tbcButton:hover {
        opacity: 1;
    }

    @media print {
        #tbcOverlay { display: none; }
    }
`);

// Reloading the unpacked extension re-injects into live tabs: drop the previous host
// so we never strand a second overlay full of dead buttons.
document.getElementById("tbcOverlay")?.remove();

const tbcOverlay = document.createElement("div");
tbcOverlay.id = "tbcOverlay";
document.body.append(tbcOverlay);

// { label, rule, value, button, transform, hidden }
const tbcEntries = [];
let tbcEditable = null;
let tbcClipNodes = [];
let tbcRafId = null;

function tbcCreateButton(title) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tbcButton";
    button.title = title;
    button.style.display = "none";
    button.innerHTML = /*html*/ `
        <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
            <path fill="currentColor" d="M5.5 1.5A1.5 1.5 0 0 1 7 0h2a1.5 1.5 0 0 1 1.5 1.5V2h1A1.5 1.5 0 0 1 13 3.5v11A1.5 1.5 0 0 1 11.5 16h-7A1.5 1.5 0 0 1 3 14.5v-11A1.5 1.5 0 0 1 4.5 2h1v-.5Zm1 .5h3v-.5a.5.5 0 0 0-.5-.5H7a.5.5 0 0 0-.5.5V2Z"/>
        </svg>`;
    tbcOverlay.append(button);
    return button;
}

function tbcClearAll() {
    tbcEntries.length = 0;
    tbcOverlay.innerHTML = "";
}

// `div.o-paragraph` is a block, so its own rect spans the full description width and
// its right edge is nowhere near the end of the text (and long lines wrap). A
// read-only Range over the line's contents gives the trailing, text-tight line box,
// and touches nothing in the contenteditable.
function tbcGetLineEndRect(label) {
    const line = label.closest(".o-paragraph, p, li, div");
    if (!line || !line.isConnected || line === tbcEditable) {
        return null;
    }
    const range = document.createRange();
    range.selectNodeContents(line);
    const rects = [...range.getClientRects()].filter((r) => r.width || r.height);
    return rects[rects.length - 1] || null;
}

// Every line shares one ancestor chain, so the getComputedStyle walk runs once per
// scan and only the rect reads happen per frame.
function tbcBuildClipNodes(editable) {
    const nodes = [];
    for (let el = editable.parentElement; el; el = el.parentElement) {
        const elStyle = getComputedStyle(el);
        if (/auto|scroll|hidden/.test(elStyle.overflowY + elStyle.overflowX)) {
            nodes.push(el);
        }
    }
    return nodes;
}

function tbcGetClipRect() {
    const clip = { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };
    for (const el of tbcClipNodes) {
        const r = el.getBoundingClientRect();
        clip.top = Math.max(clip.top, r.top);
        clip.left = Math.max(clip.left, r.left);
        clip.right = Math.min(clip.right, r.right);
        clip.bottom = Math.min(clip.bottom, r.bottom);
    }
    return clip;
}

function tbcHide(entry) {
    if (entry.hidden) return;
    entry.button.style.display = "none";
    entry.hidden = true;
}

function tbcPositionButton(entry, clip) {
    const rect = tbcGetLineEndRect(entry.label);
    if (!rect) {
        // Detached: notebook tab switched, record changed, or the line was deleted.
        return tbcHide(entry);
    }

    // Full vertical containment, so a half-scrolled line loses its button instead of
    // showing one sliced by the edge of the description box.
    if (rect.top < clip.top - 1 || rect.bottom > clip.bottom + 1) return tbcHide(entry);
    if (rect.right < clip.left || rect.top > clip.bottom) return tbcHide(entry);

    // Park after the text, but clamp inside the clip so a long branch name pushes the
    // button into the box gutter rather than spilling over the chatter.
    const x = Math.round(Math.min(rect.right + TBC_GAP, clip.right - TBC_SIZE - 4));
    const y = Math.round(rect.top + (rect.height - TBC_SIZE) / 2);
    if (x < clip.left) return tbcHide(entry);

    // Guarded writes: a steady page performs zero style writes per frame.
    const transform = `translate(${x}px, ${y}px)`;
    if (entry.transform !== transform) {
        entry.button.style.transform = transform;
        entry.transform = transform;
    }
    if (entry.hidden) {
        entry.button.style.display = "";
        entry.hidden = false;
    }
}

// Geometry needs to be frame-accurate: typing in the collaborative editor reflows the
// text with no scroll and no resize event, and the description's overflow-auto box
// emits a `scroll` that does not bubble from an element Owl keeps recreating. The loop
// parks itself when there is nothing to track, so pages with no branch lines cost
// nothing beyond the 500ms scan.
function tbcTick() {
    tbcRafId = null;
    if (!tbcEntries.length) return;

    const clip = tbcGetClipRect();
    for (const entry of tbcEntries) {
        tbcPositionButton(entry, clip);
    }
    tbcRafId = requestAnimationFrame(tbcTick);
}

function tbcStartLoop() {
    if (tbcRafId === null) {
        tbcRafId = requestAnimationFrame(tbcTick);
    }
}
