// script.js (cleaned, duplicates removed, behaviour/values preserved)
// Only one intentional change: on init() when mandatory patient details are NOT filled,
// scroll to the firstName input and then show the patient modal. Nothing else modified.

(() => {

  /* -----------------------
    Inject runtime CSS for upload preview behaviour  
    ----------------------- */
  (function injectPreviewCSS() {
    if (document.getElementById('cv-runtime-upload-css')) return;
    const css = `
  /* ===== Cleaned / Deduped upload preview CSS (paste-ready) ===== */

  /* Base upload box */
  .upload-block .upload-box,
  #upload-section .upload-box {
    box-sizing: border-box;
    width: 100%;
    min-height: 120px;
    padding: 18px;
    border-radius: 8px;
    transition: opacity .18s ease, max-height .22s ease;
  }

  /* Default hidden fileArea until preview active */
  .upload-block #fileArea,
  #upload-section #fileArea {
    display: none;
  }

  /* When preview active: hide the dropzone/box and show fileArea */
  .upload-block.has-preview .upload-box,
  #upload-section.has-preview .upload-box,
  .upload-block.upload-block.has-preview .upload-box {
    display: none !important;
    opacity: 0 !important;
    max-height: 0 !important;
    pointer-events: none !important;
  }

  .upload-block.has-preview #fileArea,
  #upload-section.has-preview #fileArea {
    display: block !important;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto 28px !important;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px dashed rgba(0,0,0,0.06);
    background: transparent;
    max-width: 760px;
    overflow: visible;
  }

  /* thumbnail image defaults inside preview */
  .upload-block.has-preview #fileArea img#thumb2,
  #upload-section.has-preview img#thumb2 {
    display: block !important;
    width: 70% !important;
    height: auto !important;
    max-width: 520px !important;
    border-radius: 10px !important;
    object-fit: contain !important;
  }

  /* preview-frame container */
  .preview-frame {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 14px;
    box-sizing: border-box;
    padding: 0;
  }

  /* file-meta breathing & layout */
  .file-meta,
  #upload-section .file-meta {
    margin-bottom: 6px !important;
    background: transparent;
  }
  .upload-block.has-preview .file-meta,
  .upload-block.has-preview .file-details,
  .upload-block.has-preview #fileArea .file-meta {
    margin-bottom: 55px !important; /* space between file-details and buttons */
  }

  /* Button-row: default inline / inline-move helpers */
  .upload-block.has-preview .button-row,
  .upload-block.has-preview .button-row.inline-move,
  #upload-section.has-preview .button-row {
    position: static !important;
    display: flex !important;
    justify-content: center !important; /* center below file-meta by default */
    align-items: center !important;
    gap: 20px !important;
    margin: 12px auto 0 !important;
    width: auto !important;
    transform: none !important;
  }

  .upload-block .button-row.inline-move {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    margin-left: 8px !important;
    margin-top: 0 !important;
    vertical-align: middle !important;
    transform: translateY(-2px) !important;
  }
  .upload-block .clear-inline { display: inline-block !important; vertical-align: middle !important; }
  .upload-block .file-area-clear-wrap-inline { display: inline-flex !important; align-items: center !important; gap: 8px !important; vertical-align: middle !important; }

  /* make sure Clear shows when preview active */
  .upload-block.has-preview #clear2,
  #upload-section.has-preview #clear2 {
    display: inline-flex !important;
    margin: 0 !important;
  }

  /* preview frame -> file-details gap (bigger gap as requested) */
  .upload-block.has-preview #fileArea > .preview-frame,
  .upload-block.has-preview #fileArea img#thumb2,
  #upload-section.has-preview #fileArea > .preview-frame {
    margin-top: 28px !important;   /* small push from top */
    margin-bottom: 112px !important; /* big space below preview image/frame */
  }

  /* Extra spacing tweaks kept safe */
  .upload-block.has-preview .file-meta { margin-bottom: 28px !important; }
  .upload-block.has-preview #fileArea { margin-bottom: 40px !important; padding-bottom: 6px !important; }

  /* Visual-only right alignment class (no DOM moving) */
  .upload-block.preview-right,
  #upload-section.preview-right {
    margin-left: auto !important;
    margin-right: 60px !important;
    max-width: 760px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  /* ensure fileArea stays centered inside preview-right wrapper */
  .upload-block.preview-right #fileArea,
  #upload-section.preview-right #fileArea {
    margin-left: 0 !important;
    margin-right: 0 !important;
    max-width: 760px !important;
  }

  /* Heading -> preview gap: main rule you asked to increase */
  .upload-block.has-preview h3,
  #upload-section.has-preview h3,
  .upload-block.has-preview .upload-heading,
  #upload-section.has-preview .upload-heading {
    text-align: center !important;
    margin-top: 24px !important;
    margin-bottom: 180px !important; /* MAIN: heading -> preview gap */
    transition: margin-bottom .22s ease;
  }

  /* If JS toggles .upload-heading.preview-active (cover that too) */
  .upload-heading.preview-active {
    margin-bottom: 88px !important;
  }

  /* Small-screen responsive adjustments */
  @media (max-width: 900px) {
    .upload-block .upload-box { min-height: 90px; padding: 12px; }
    .upload-block.has-preview #fileArea img#thumb2,
    #upload-section .preview-frame img#thumb2 { width: 95vw !important; max-width: 100% !important; transform: none !important; padding: 8px !important; }
    .upload-block.preview-right,
    #upload-section.preview-right { margin-right: 20px !important; max-width: 95vw !important; }
    .upload-block.preview-right .button-row,
    #upload-section.preview-right .button-row { margin: 12px auto 24px !important; flex-direction: column; gap: 12px !important; }
    .file-meta .meta-row { grid-template-columns: 1fr !important; gap: 6px !important; }
  }

  /* Final visual parity override for thumb2 (if you intentionally want large padded framed look) */
  .preview-frame img#thumb2,
  #upload-section .preview-frame img#thumb2 {
    width: 85% !important;
    max-width: 520px !important;
    padding: 65px !important;
    border: 8px solid rgb(0,0,0) !important;
    border-radius: 10px !important;
    background: #fff !important;
    box-shadow: 0 10px 30px rgba(4,12,24,0.06), 0 1px 0 rgba(255,255,255,0.6) inset !important;
    margin-bottom: 55px !important;
    object-fit: contain !important;
    transition: all .22s ease !important;
  }

  /* Keep minimal fallback for button styles (so Analyze / Clear remain consistent) */
  #clear2, #analyze2 {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 12px 28px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    box-sizing: border-box;
  }
  #analyze2[disabled] { opacity: 0.6; cursor: not-allowed; }

  /* Only reduce gap after the File details title (safe, high-specificity override) */
  .file-meta .meta-title,
  #upload-section .file-meta .meta-title {
    margin-bottom: 30px !important;   /* reduce space after heading */
    padding-bottom: 0 !important;     /* ensure no extra padding */
    line-height: 1.1 !important;
  }

 /* Single canonical rule for dropdown open gap (JS sets --open-gap) */
.file-meta .meta-row.open-select,
.upload-block .meta-row.open-select,
#upload-section .meta-row.open-select,
.meta-row.open-select {
  /* JS should set --open-gap (px) when opening the select */
  margin-bottom: var(--open-gap, 180px) !important;
  padding-bottom: 0 !important;       /* do NOT use padding for gap */
  transition: margin-bottom .28s ease !important;
}


  /* Stabilize Age chip: prevent baseline shift when Gender opens/focuses */
  .age-input-wrap {
    position: relative;
    display: block;        /* was inline-block; block prevents baseline reflow */
    height: 46px;          /* matches your input height */
    min-height: 46px;      /* keep your existing min-height intent */
  }

  /* keep the chip vertically positioned over the bottom edge of the wrapper */
  .age-badge {
    top: 100%;
    transform: translateY(-50%);
  }

  /* ONLY target the file-details value cells — do NOT touch/select the <select> itself */
.file-meta .meta-row > .meta-value,
#upload-section .file-meta .meta-row > .meta-value {
  box-sizing: border-box !important;
  display: block !important;           /* allow margin auto to center the block */
  width: 60% !important;               /* match the visual width of your centered select (adjust if needed) */
  max-width: 480px !important;         /* safety cap */
  margin-left: auto !important;
  margin-right: auto !important;       /* center the whole value-block inside the second grid column */
  padding-left: 0 !important;
  padding-right: 0 !important;
  justify-self: center !important;     /* center within grid cell */
   margin-left: 95px !important; /* 👈 small right shift — adjust 30–50px if needed */
}

/* keep any children (text / spans) default-styled but prevent extra offsets */
.file-meta .meta-row > .meta-value > * {
  margin: 0 !important;
  box-sizing: border-box !important;
}


/* Wrap long file names cleanly inside value cell */
.file-meta .meta-row > .meta-value {
  word-wrap: break-word !important;
  overflow-wrap: anywhere !important;
  white-space: normal !important;
  max-width: 95% !important; /* keeps spacing balanced */
  display: block !important;
}

/* FINAL: stable gap under File details heading (place at END of style.css) */
#upload-section .file-meta .meta-title,
.file-meta .meta-title {
  margin-bottom: 76px !important;   /* desktop gap — change 56px -> 48px/64px as you prefer */
  display: block !important;
}

/* Uniform vertical gap between file detail rows only */
.file-meta .meta-row {
  margin-bottom: 24px !important;   /* 👈 gap between each row, adjust 20–32px as needed */
}

/* Remove gap under last row to keep bottom tidy */
.file-meta .meta-row:last-child {
  margin-bottom: 0 !important;
}

/* permanent fix — paste into style.css or mobileresponsive.css (end of file) */
.upload-block.has-preview #fileArea > .preview-frame,
#upload-section.has-preview #fileArea > .preview-frame,
.upload-block.has-preview #fileArea img#thumb2,
#upload-section.has-preview img#thumb2 {
  margin-top: 18px !important;
  margin-bottom: 75px !important;
}

/* Hide any marked moved heading while inside upload-block (prevents flashes) */
.upload-block [data-preview-heading="1"],
#upload-section [data-preview-heading="1"] {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition: none !important;
}

/* When preview is actually active, show it smoothly */
.upload-block.has-preview [data-preview-heading="1"],
#upload-section.has-preview [data-preview-heading="1"] {
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  transition: opacity .18s ease, transform .18s ease !important;
}

/* TEMP: aggressive heading suppression while Clear is processing */
.cv-heading-suppress [data-preview-heading="1"],
.cv-heading-suppress .upload-heading,
.cv-heading-suppress h3[data-preview-heading],
.cv-heading-suppress h3.upload-heading {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition: none !important;
}


/* ---- FORCE: disable transitions/animations while preview active ----
   Paste this at the end of your main stylesheet (style.css) */
.upload-block.has-preview,
.upload-block.has-preview * {
  transition: none !important;
  -webkit-transition: none !important;
  animation: none !important;
  -webkit-animation: none !important;
  will-change: auto !important; /* avoid GPU hinting glitches */
}


/* final no-animation shift class */
.upload-block.preview-right {
    transform: translateX(750px) !important;
    margin-top: 195px !important;
    transition: none !important;
    animation: none !important;
}

.fixed-left-preview-image { 
  position: fixed;
  top: 2200px !important; 
  left: -35px;
  width: 500px;
  height: auto;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
  transition: opacity .25s ease;
   animation: floaty 4.5s ease-in-out infinite;
   will-change: transform;

}

/* ⭐ Keyframes for floating */
@keyframes floaty {
  0%   { transform: translateY(0px) rotate(-1deg); }
  50%  { transform: translateY(-14px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(-1deg); }
}

/* show only when preview active */
.upload-block.has-preview ~ .fixed-left-preview-image {
  opacity: 1 !important;
}

  /* === End deduped / problem-causing part removed === */


/* ===== DICOM: remove frame and let placeholder fill the preview area ===== */
.upload-block.dcm-mode,
#upload-section.dcm-mode {
  /* make outer container neutral */
  background: transparent !important;
  box-shadow: none !important;
}

/* remove padding / border / shadow from fileArea and preview container */
.upload-block.dcm-mode #fileArea,
.upload-block.dcm-mode .preview-frame,
#upload-section.dcm-mode #fileArea,
#upload-section.dcm-mode .preview-frame {
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

/* make the placeholder image use the whole area and remove the black border */
.upload-block.dcm-mode img#thumb2,
#upload-section.dcm-mode img#thumb2 {
  display: block !important;
  width: 100% !important;
  height: auto !important;            /* or use 100% if you want full-bleed height */
  object-fit: contain !important;     /* try cover if you want to crop to fill */
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 6px !important;     /* set 0 if you want square corners */
  box-shadow: none !important;
  background: transparent !important;
}

/* if you previously forced a framed look with very-high-specificity, this final rule beats it */
.upload-block.dcm-mode img#thumb2,
.upload-block.dcm-mode .preview-frame img#thumb2 {
  border: none !important;
  outline: none !important;
}

#thumb2.dcm-placeholder {
    display: block !important;
    margin: 0 auto !important;
    width: 100% !important;
    min-width: 740px !important;
    object-fit: contain !important;
}


/* ===== File-too-large: centered inner-row layout ===== */
.cv-file-toast {
  display: flex !important;
  justify-content: center !important; /* centers the inner row on page */
  align-items: center !important;
  pointer-events: auto;
  padding: 0 !important; /* inner wrapper handles padding */
  background: transparent !important; /* avoid inner-background artifacts */
  box-shadow: none !important; /* we put shadow on inner wrapper */
}

.cv-file-toast .ft-inner {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 16px 28px;
  border-radius: 12px;
  min-width: 520px;
  max-width: calc(100% - 56px);
  box-sizing: border-box;
  background: linear-gradient(180deg,#072a36,#04232b);
  color: #fff;
  box-shadow: 0 20px 60px rgba(2,6,23,0.45);
  position: relative;
}

/* left icon wrapper */
.cv-file-toast .ft-icon {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 56px;
  background: rgba(255,255,255,0.04);
  box-shadow: 0 8px 28px rgba(2,6,23,0.35);
}

/* content next to icon (title + subtitle) */
.cv-file-toast .ft-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center; /* center title/subtitle as a unit */
  flex: 1 1 auto;
  padding: 4px 8px;
  background: transparent; /* IMPORTANT: remove any inner bg */
 
}

/* title + subtitle */
.cv-file-toast .ft-title {
  font-weight: 800;
  font-size: 18px;
  line-height: 1;
  background: transparent !important; /* remove dark rounded box */
  padding: 4px 6px;
}
.cv-file-toast .ft-sub {
  font-size: 13px;
  opacity: 0.85;
  max-width: 68ch;
  background: transparent !important;
}

/* keep existing close button pinned to the right (absolute inside inner) */
.cv-file-toast .ft-close {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 6;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 6px 18px rgba(0,0,0,0.28);
}

/* responsive tweaks */
@media (max-width: 720px) {
  .cv-file-toast .ft-inner { min-width: unset; padding: 12px 14px; gap:12px; width: calc(100% - 32px); }
  .cv-file-toast .ft-icon { width:44px; height:44px; flex:0 0 44px; }
  .cv-file-toast .ft-title { font-size:16px; }
  .cv-file-toast .ft-sub { font-size:12px; }
  .cv-file-toast .ft-close { right:8px; top:8px; width:30px; height:30px; }
}

/* paste after your cv-filetoo-css (end of file) */
#cv-filetoo-body {
  /* shift the whole text block slightly left without changing grid/layout */
  transform: translateX(-40px);
  will-change: transform;
}

/* ensure title & msg align left (optional but cleaner) */
#cv-filetoo-title,
#cv-filetoo-msg {
  text-align: left;
}



  `;
    const s = document.createElement('style');
    s.id = 'cv-runtime-upload-css';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  })();

  /* -----------------------
    Smooth scroll for anchor links  
    ----------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });

  /* -----------------------
    Intersection observer animations (cards)  
    ----------------------- */
  try {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.card, .dashboard-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });
  } catch (err) { /* non-fatal */ }

  /* CTA micro-interaction */
  const cta = document.querySelector('.cta-button');
  if (cta) {
    cta.addEventListener('mouseenter', () => cta.style.transform = 'translateY(-3px)');
    cta.addEventListener('mouseleave', () => cta.style.transform = 'translateY(0)');
  }

  /* -----------------------
    Detection form setup & DOM refs  
    ----------------------- */
  const segAuto = document.getElementById('segAuto');
  const segManual = document.getElementById('segManual');
  const ctypeWrap = document.getElementById('ctypeWrap');
  const ctype2 = document.getElementById('ctype2');




  const dz = document.getElementById('dz');
  const fileInp = document.getElementById('fileInp');
  const fileArea = document.getElementById('fileArea');
  const thumb2 = document.getElementById('thumb2');
  const fname = document.getElementById('fname');
  const finfo = document.getElementById('finfo');
  const clear2 = document.getElementById('clear2');
  const sample2 = document.getElementById('sample2');

  const analyze2 = document.getElementById('analyze2');
  const form = document.querySelector(".detection-form");
  const popup = document.getElementById("loadingPopup");
  const progressCircle = document.querySelector(".progress");


  const texts = [
    "Initializing AI Model...",
    "Analyzing medical patterns...",
    "Detecting anomalies...",
    "Generating report..."
  ];

  let textIndex = 0;

  if (form && popup) {
    form.addEventListener("submit", async function (e) {

      e.preventDefault(); // 🔥 MOST IMPORTANT

      // 🔥 scroll top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      // 🔥 show popup
      setTimeout(() => {
        popup.style.display = "flex";
        document.body.style.overflow = "hidden";
      }, 300);

      if (analyze2) analyze2.disabled = true;

      const formData = new FormData(form);

      formData.append("blood_pressure", document.getElementById("bp2").value);
      formData.append("blood_sugar", document.getElementById("sugar2").value);
      formData.append("haemoglobin", document.getElementById("hb2").value);

      // 🔥 START BACKEND
      const res = await fetch("/predict", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      const jobId = data.job_id;

      // 🔥 TEXT LOOP
      setInterval(() => {
        const el = document.getElementById("loadingText");
        if (el) {
          el.innerText = texts[textIndex % texts.length];
          textIndex++;
        }
      }, 2000);

      // 🔥 REAL PROGRESS POLLING
      const interval = setInterval(async () => {

        let prog;

        try {
          const res2 = await fetch(`/progress/${jobId}`);
          prog = await res2.json();
        } catch (err) {
          console.error("Progress fetch failed:", err);
          return;
        }

        if (!prog || typeof prog.progress === "undefined") return;

        if (progressCircle) {
          const offset = 220 - (prog.progress / 100) * 220;
          progressCircle.style.strokeDashoffset = offset;
        }

        const textEl = document.getElementById("loadingText");
        const percentEl = document.getElementById("progressPercent");

        if (textEl && percentEl) {
          textEl.innerText = prog.status;
          percentEl.innerText = `(${prog.progress}%)`;
        }
        if (Number(prog.progress) >= 100) {
          clearInterval(interval);

          await fetch("/save-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prog.result)
          });

          window.location.href = "/insights";
        }

      }, 800);

    });
  }
  const res2 = document.getElementById('res2');
  // --- Insights: DOM refs & state (updated, safer restore) ---
  let insightsSection = document.getElementById('insightsSection');
  let closeInsightsBtn = document.getElementById('closeInsights');

  // store list of {el, prevDisplay}
  const __cv_savedDisplays = [];

  // Helper: safely get element display string
  function _getDisplay(el) {
    try { return window.getComputedStyle(el).display || ''; } catch (e) { return el && el.style ? el.style.display : ''; }
  }

  // Helper: hide an element and save its previous display
  function _hideAndSave(el) {
    if (!el) return;
    // avoid saving same element twice
    if (__cv_savedDisplays.some(s => s.el === el)) return;
    try {
      __cv_savedDisplays.push({ el: el, prev: _getDisplay(el) || el.style.display || '' });
      el.style.display = 'none';
      if (el.setAttribute) el.setAttribute('aria-hidden', 'true');
    } catch (e) { console.warn('hideAndSave failed', e); }
  }

  // Helper: restore all saved
  function _restoreAllSaved() {
    try {
      __cv_savedDisplays.forEach(item => {
        try {
          if (!item.el) return;
          // if prev was 'none' or '', set to '' to allow CSS to control it
          item.el.style.display = (item.prev && item.prev !== 'none') ? item.prev : '';
          if (item.el.setAttribute) item.el.setAttribute('aria-hidden', 'false');
        } catch (e) { }
      });
    } catch (e) { console.warn('restoreAllSaved failed', e); }
    // clear store
    __cv_savedDisplays.length = 0;
  }

  // Find the specific "Detection Options" block (so we hide only that)
  function _findDetectionOptionsBlock() {
    const blocks = Array.from(document.querySelectorAll('.form-block'));
    for (const b of blocks) {
      const h3 = b.querySelector('h3, h2, .meta-title');
      if (h3 && /Detection Options/i.test((h3.textContent || '').trim())) return b;
    }
    // fallback: try a block that contains the segAuto/segManual IDs
    const seg = document.getElementById('segAuto') || document.getElementById('segManual');
    if (seg) return seg.closest('.form-block') || seg.parentElement;
    return null;
  }

  // Show Insights: hide detection/upload UI and reveal insights section (heading only)
  function showInsights() {
    try {
      insightsSection = insightsSection || document.getElementById('insightsSection');
      closeInsightsBtn = closeInsightsBtn || document.getElementById('closeInsights');

      // 1) Hide the Detection Options block (only that block)
      const detectionOptionsBlock = _findDetectionOptionsBlock();
      if (detectionOptionsBlock) _hideAndSave(detectionOptionsBlock);

      // 2) Hide the upload section (exact id)
      const uploadSec = document.getElementById('upload-section') || uploadBlock || document.querySelector('.upload-block');
      if (uploadSec) _hideAndSave(uploadSec);

      // 3) Also hide lightweight ctypeWrap (if present) so dropdown UI doesn't remain visible
      if (typeof ctypeWrap !== 'undefined' && ctypeWrap) _hideAndSave(ctypeWrap);

      // 4) hide small detect-fun-img (if exists)
      if (typeof detectFunImg !== 'undefined' && detectFunImg) _hideAndSave(detectFunImg);

      // 5) hide fixed left deco image explicitly (this fixed decoration caused the persistent image)
      const deco = document.getElementById('cv-left-deco-image');
      if (deco) _hideAndSave(deco);

      // Show insights section as a normal block (it should be styled in CSS to look like a section)
      if (insightsSection) {
        insightsSection.style.display = 'block';
        // remove card-like classes if any (defensive)
        insightsSection.classList.remove('cv-toast', 'cv-toast-overlay');
        insightsSection.classList.add('insights-section-visible');
        insightsSection.setAttribute && insightsSection.setAttribute('aria-hidden', 'false');
        setTimeout(() => { try { closeInsightsBtn && closeInsightsBtn.focus(); } catch (e) { } }, 80);
      } else {
        console.warn('showInsights: no #insightsSection found in DOM');
      }
    } catch (err) {
      console.warn('showInsights failed', err);
    }
  }

  // Hide Insights (restore previous detection/upload UI)
  function hideInsights() {
    try {
      // hide insights UI
      insightsSection = insightsSection || document.getElementById('insightsSection');
      if (insightsSection) {
        insightsSection.style.display = 'none';
        insightsSection.classList.remove('insights-section-visible');
        insightsSection.setAttribute && insightsSection.setAttribute('aria-hidden', 'true');
      }

      // restore previously-hidden elements
      try {
        _restoreAllSaved();
      } catch (e) {
        console.warn('restore failed', e);
      }

      // >>> NEW: reset detection-options + upload section (same as Clear)
      try {
        // reset upload section like "Clear" button
        if (typeof resetFile === "function") {
          resetFile(false);   // false = no auto-scroll
        }

        // Reset ctype chips (if your script has this debug helper)
        if (window.__cv_debug && typeof window.__cv_debug.clearCtype === "function") {
          try { window.__cv_debug.clearCtype(); } catch (e) { }
        }

        // Rerun UI sync helpers if present
        try { if (typeof syncFileDetailsToMode === "function") syncFileDetailsToMode(); } catch (e) { }
        try { if (typeof updateAnalyzeState === "function") updateAnalyzeState(); } catch (e) { }

      } catch (e) {
        console.warn("hideInsights: reset failed", e);
      }
      // <<< END reset block


      // small UX: focus analyze button again
      setTimeout(() => {
        try { analyze2 && analyze2.focus(); } catch (e) { }
      }, 60);

    } catch (err) {
      console.warn('hideInsights failed', err);
    }
  }

  // close button wiring (supports late-added button)
  if (closeInsightsBtn) {
    closeInsightsBtn.addEventListener('click', (ev) => { ev && ev.preventDefault(); hideInsights(); });
  }
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'closeInsights') {
      e.preventDefault();
      hideInsights();
    }
  });




  const age2 = document.getElementById('age2');
  const age2err = document.getElementById('age2err');
  const gender2 = document.getElementById('gender2');
  const bp2 = document.getElementById('bp2');
  const sugar2 = document.getElementById('sugar2');
  const hb2 = document.getElementById('hb2');

  const detectNote1 = document.querySelector('.detect-note1');
  const ageGenderRow = document.querySelector('.detection-form .form-row:nth-of-type(2)');
  const uploadBlock = document.querySelector('.upload-block'); // we'll toggle .has-preview here  
  // --- hide the Detection Options heading until mandatory fields are valid ---
  const detectionHeading = Array.from(document.querySelectorAll('h1,h2,h3,.section-title,.detection-title'))
    .find(el => /\bDetection Options\b/i.test((el.textContent || '').trim()));
  if (detectionHeading) detectionHeading.style.display = 'none';
  // --- hide the Detection Note paragraph until mandatory patient details are valid ---
  const detectionNote = document.querySelector('.detect-note1');
  const detectFunImg = document.querySelector('.detect-fun-img'); // NEW: small image inside Detection Options

  /* -----------------------
    Patient-details required modal (centered popup + blur overlay)
    ----------------------- */
  (function installPatientModal() {
    // inject CSS
    if (!document.getElementById('cv-patient-modal-css')) {
      const css = `
  /* patient modal */
  .cv-patient-overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(8,12,20,0.42); z-index: 12050; opacity: 0; pointer-events: none; transition: opacity .22s ease; backdrop-filter: blur(6px); }
  .cv-patient-overlay.show { opacity: 1; pointer-events: auto; }
  .cv-patient-card { width: min(880px, 90%); max-width: 880px; background: linear-gradient(180deg,#07263f,#082735); color: #fff; border-radius: 14px; padding: 28px 40px; box-shadow: 0 40px 80px rgba(2,6,23,0.6); text-align: center; position: relative; }
  .cv-patient-title { font-weight: 800; font-size: 26px; margin: 0 0 8px; }
  .cv-patient-msg { font-size: 15px; opacity: .92; margin-bottom: 6px; }
  .cv-patient-close { position: absolute; right: 14px; top: 14px; background: transparent; border: 0; color: rgba(255,255,255,0.9); font-size: 20px; cursor: pointer; padding: 6px; border-radius: 999px; }
  @media (max-width:560px) {
    .cv-patient-card { padding: 18px 16px; border-radius: 12px; }
    .cv-patient-title { font-size: 20px; }
    .cv-patient-msg { font-size: 14px; }
  }
  `;
      const s = document.createElement('style');
      s.id = 'cv-patient-modal-css';
      s.appendChild(document.createTextNode(css));
      document.head.appendChild(s);
    }

    // modal DOM
    if (!document.getElementById('cv-patient-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'cv-patient-overlay';
      overlay.className = 'cv-patient-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-hidden', 'true');

      const card = document.createElement('div');
      card.className = 'cv-patient-card';

      const closeBtn = document.createElement('button');
      closeBtn.className = 'cv-patient-close';
      closeBtn.innerHTML = '✕';
      closeBtn.type = 'button';
      closeBtn.addEventListener('click', hidePatientModal);

      const title = document.createElement('div');
      title.className = 'cv-patient-title';
      title.textContent = 'Patient details required';

      const msg = document.createElement('div');
      msg.className = 'cv-patient-msg';
      msg.textContent = 'Please fill in all mandatory patient details to begin the detection process.';

      card.appendChild(closeBtn);
      card.appendChild(title);
      card.appendChild(msg);
      overlay.appendChild(card);
      document.body.appendChild(overlay);

      // click outside to close
      overlay.addEventListener('click', (ev) => { if (ev.target === overlay) hidePatientModal(); });
      // Esc to close
      document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') hidePatientModal(); });
    }

    function showPatientModal() {
      const overlay = document.getElementById('cv-patient-overlay');
      if (!overlay) return;
      overlay.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => overlay.classList.add('show'));
      document.documentElement.classList.add('cv-patient-modal-active');
    }

    function hidePatientModal() {
      const overlay = document.getElementById('cv-patient-overlay');
      if (!overlay) return;
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('cv-patient-modal-active');

    }

    // expose helpers
    window.__cv_patient_modal = { show: showPatientModal, hide: hidePatientModal, isShown: () => !!(document.getElementById('cv-patient-overlay') && document.getElementById('cv-patient-overlay').classList.contains('show')) };
  })();

  /* -----------------------
     Mode-change confirm modal (Yes / No)
     - stays open until user chooses Yes or No
     ----------------------- */
  (function installModeChangeConfirm() {
    if (!document.getElementById('cv-mode-change-css')) {
      const css = `
    .cv-mode-change-overlay { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(3,37,65,0.45); backdrop-filter: blur(4px) saturate(120%); z-index: 12100; opacity: 0; pointer-events: none; transition: opacity .18s ease; }
.cv-mode-change-overlay.show { opacity: 1; pointer-events: auto; }
.cv-mode-change-card { width: min(880px, 92%); max-width: 880px; background: linear-gradient(180deg,#07263f,#082735); color:#fff; border-radius:12px; padding:20px 26px; box-shadow: 0 30px 80px rgba(2,6,23,0.6); text-align:center; position: relative; }

.cv-mode-change-title { font-size:22px; font-weight:800; margin:6px 0 28px; }

/* container for the two-message lines (keeps them stacked) */
.cv-mode-change-msg { font-size:15px; opacity:0.95; margin-bottom:12px; }

/* first line (detection sentence) */
.cv-mode-change-sub {
  display: block;
  margin-bottom: 22px; /* gap below detection sentence */
}

/* bold question line — can control its bottom gap separately (before buttons) */
.cv-mode-change-ask {
  display: block;
  font-weight: 700;
  margin-bottom: 40px; /* gap between question and buttons — adjust as needed */
}

/* spacing between Yes / No buttons */
.cv-mode-change-actions {
  display:flex;
  gap:80px;                 /* increase to create more horizontal space between buttons */
  justify-content:center;
  align-items:center;
}

.cv-mode-btn {
  background: #0095ff !important;       /* solid blue */
  color: #fff !important;
  border: none !important;
  padding: 12px 28px !important;
  border-radius: 10px !important;        /* rectangle rounded */
  font-weight: 700 !important;
  font-size: 15px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18) !important;
  cursor: pointer !important;
  min-width: 140px !important;
}
.cv-mode-btn.yes { background: linear-gradient(90deg,#00c6ff,#0072ff); color:#fff; box-shadow:0 8px 24px rgba(0,114,255,0.14); }
/* remove extra border from NO button */
.cv-mode-btn.no {
  border: none !important;
  background: #0095ff !important;
  color: white !important;
}

/* same hover as OK button */
.cv-mode-btn:hover {
  background: #0080e0 !important;
}

.cv-mode-change-close { position:absolute; right:12px; top:12px; background:transparent; border:0; color:rgba(255,255,255,0.85); font-size:18px; cursor:not-allowed; opacity:0.25; }
@media(max-width:560px) { .cv-mode-change-card { padding:16px; } .cv-mode-change-title { font-size:18px } }

    `;
      const st = document.createElement('style'); st.id = 'cv-mode-change-css'; st.appendChild(document.createTextNode(css)); document.head.appendChild(st);
    }

    if (!document.getElementById('cv-mode-change-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'cv-mode-change-overlay';
      overlay.className = 'cv-mode-change-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-modal', 'true');

      const card = document.createElement('div'); card.className = 'cv-mode-change-card';

      const closeBtn = document.createElement('button');
      closeBtn.className = 'cv-mode-change-close';
      closeBtn.type = 'button';
      closeBtn.title = 'Close disabled until you choose';
      closeBtn.textContent = '✕';
      closeBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); /* noop */ });

      const title = document.createElement('div'); title.className = 'cv-mode-change-title'; title.textContent = 'Mode changed';

      const msg = document.createElement('div');
      msg.className = 'cv-mode-change-msg';
      msg.innerHTML = '<div class="cv-mode-change-sub">Detection mode changed — uploaded image removed.</div>' +
        '<div class="cv-mode-change-ask"><strong>Would you like to update patient details as well?</strong></div>';


      const actions = document.createElement('div'); actions.className = 'cv-mode-change-actions';

      const yesBtn = document.createElement('button'); yesBtn.className = 'cv-mode-btn yes'; yesBtn.type = 'button'; yesBtn.textContent = 'Yes — Update Details';
      const noBtn = document.createElement('button'); noBtn.className = 'cv-mode-btn no'; noBtn.type = 'button'; noBtn.textContent = 'No — Continue Detection';

      actions.appendChild(yesBtn); actions.appendChild(noBtn);
      card.appendChild(closeBtn); card.appendChild(title); card.appendChild(msg); card.appendChild(actions);
      overlay.appendChild(card);
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (ev) => { if (ev.target === overlay) ev.stopPropagation(); });
      document.addEventListener('keydown', (ev) => { if (!overlay.classList.contains('show')) return; if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); } });

      yesBtn.addEventListener('click', () => { try { window.__cv_mode_confirm && window.__cv_mode_confirm.onYes && window.__cv_mode_confirm.onYes(); } catch (e) { } });
      noBtn.addEventListener('click', () => { try { window.__cv_mode_confirm && window.__cv_mode_confirm.onNo && window.__cv_mode_confirm.onNo(); } catch (e) { } });
    }

    function showModeChangeConfirm() {
      const overlay = document.getElementById('cv-mode-change-overlay'); if (!overlay) return;
      overlay.setAttribute('aria-hidden', 'false'); requestAnimationFrame(() => overlay.classList.add('show'));
      try { const no = overlay.querySelector('.cv-mode-btn.no'); if (no) no.focus(); } catch (e) { }
    }
    function hideModeChangeConfirm() { const overlay = document.getElementById('cv-mode-change-overlay'); if (!overlay) return; overlay.classList.remove('show'); overlay.setAttribute('aria-hidden', 'true'); }

    window.__cv_mode_confirm = window.__cv_mode_confirm || {};
    window.__cv_mode_confirm.show = showModeChangeConfirm;
    window.__cv_mode_confirm.hide = hideModeChangeConfirm;

    // default behavior when user clicks Yes
    window.__cv_mode_confirm.onYes = function () {
      try { if (typeof resetPatientDetails === 'function') resetPatientDetails(); } catch (e) { console.warn('resetPatientDetails failed', e); }
      try {
        const firstNameInput = document.getElementById('firstName');
        if (firstNameInput) {
          const smallScreen = window.innerWidth < 900;
          const yOffset = smallScreen ? -120 : -250;
          const y = firstNameInput.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, Math.floor(y)), behavior: 'smooth' });
          setTimeout(() => { try { firstNameInput.focus({ preventScroll: true }); } catch (e) { firstNameInput.focus(); } }, 420);
        }
      } catch (e) { }
      window.__cv_mode_confirm.hide();
    };

    window.__cv_mode_confirm.onNo = function () {
      try {
        // === NEW GUARD: prevent chip/observer auto-reset from racing with mode-change ===
        window.__cv_mode_confirm = window.__cv_mode_confirm || {};
        window.__cv_mode_confirm.suppressAutoReset = true;

        console.log('[cv:onNo] start (suppressAutoReset=true)');
        // save scroll
        const prevX = window.pageXOffset || 0;
        const prevY = window.pageYOffset || 0;

        // blur active element to avoid focus-scroll
        try { if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }

        // determine pending mode: prefer the explicitly stored requested mode,
        // otherwise keep the currentMode (already applied by setMode)
        const pending = (window.__cv_mode_confirm && window.__cv_mode_confirm.pendingMode)
          ? window.__cv_mode_confirm.pendingMode
          : (currentMode || 'auto');
        console.log('[cv:onNo] pendingMode=', pending);


        // 1) remove uploaded file WITHOUT scrolling (pass pending so resetFile can preserve mode)
        try {
          // IMPORTANT: call resetFile with preserveMode so resetFile will set mode correctly
          resetFile(false, pending);
          console.log('[cv:onNo] resetFile(false, pending) done');
        } catch (e) {
          console.warn('[cv:onNo] resetFile failed', e);
        }

        // 2) ensure segmented controls visible / enabled immediately
        try {
          if (segAuto) { segAuto.style.display = ''; segAuto.disabled = false; segAuto.removeAttribute('aria-disabled'); }
          if (segManual) { segManual.style.display = ''; segManual.disabled = false; segManual.removeAttribute('aria-disabled'); }
          console.log('[cv:onNo] seg controls ensured visible/enabled');
        } catch (e) { console.warn('[cv:onNo] enabling segments failed', e); }

        // 3) hide modal immediately
        try { if (window.__cv_mode_confirm && typeof window.__cv_mode_confirm.hide === 'function') window.__cv_mode_confirm.hide(); } catch (e) { }

        // 4) set a temporary force flag so other handlers don't revert our change
        window.__cv_force_mode = pending;
        // clear after short window
        setTimeout(() => { try { delete window.__cv_force_mode; console.log('[cv:onNo] cleared __cv_force_mode'); } catch (e) { } }, 600);

        // 5) apply mode in a guarded manner
        requestAnimationFrame(() => {
          setTimeout(() => {
            try {
              // try setMode normally
              let applied = false;
              try {
                if (typeof setMode === 'function') {
                  setMode(pending);
                  applied = (currentMode === pending);
                  console.log('[cv:onNo] setMode attempted, applied=', applied, 'currentMode=', currentMode);
                }
              } catch (e) {
                console.warn('[cv:onNo] setMode threw', e);
                applied = false;
              }

              // fallback: force classes / simulate click if not applied
              if (!applied) {
                try {
                  if (pending === 'auto') {
                    // visual + state: mark segAuto active
                    if (segAuto) {
                      segAuto.classList.add('active');
                      segAuto.setAttribute('aria-selected', 'true');
                      segAuto.tabIndex = 0;
                    }
                    if (segManual) {
                      segManual.classList.remove('active');
                      segManual.setAttribute('aria-selected', 'false');
                      segManual.tabIndex = -1;
                    }
                    // hide ctype UI & disable
                    try { showCtypeWrap(false); if (ctype2) ctype2.disabled = true; } catch (e) { }
                    currentMode = 'auto'; try { window.currentMode = 'auto'; } catch (e) { }
                    console.log('[cv:onNo] fallback -> forced auto classes/state');
                  } else {
                    if (segManual) {
                      segManual.classList.add('active');
                      segManual.setAttribute('aria-selected', 'true');
                      segManual.tabIndex = 0;
                    }
                    if (segAuto) {
                      segAuto.classList.remove('active');
                      segAuto.setAttribute('aria-selected', 'false');
                      segAuto.tabIndex = -1;
                    }
                    try { showCtypeWrap(true); if (ctype2) { ctype2.disabled = false; try { ctype2.focus(); } catch (e) { } } } catch (e) { }
                    currentMode = 'manual'; try { window.currentMode = 'manual'; } catch (e) { }
                    console.log('[cv:onNo] fallback -> forced manual classes/state');
                  }
                } catch (e) { console.warn('[cv:onNo] fallback apply failed', e); }
              }

              // 6) ensure detection heading/note UI updated
              try {
                if (currentMode === 'auto') {
                  if (detectionHeading) detectionHeading.style.display = '';
                  if (detectionNote) detectionNote.style.display = '';
                  if (detectFunImg) detectFunImg.style.display = '';
                } else {
                  try { if (detectionHeading) detectionHeading.style.display = ''; if (detectionNote) detectionNote.style.display = ''; } catch (e) { }
                }
              } catch (e) { /* ignore */ }

              // 7) sync UI pieces & analysis state
              try { syncFileDetailsToMode(); } catch (e) { console.warn('[cv:onNo] syncFileDetailsToMode failed', e); }
              try { updateAnalyzeState(); } catch (e) { console.warn('[cv:onNo] updateAnalyzeState failed', e); }

              // 8) broadcast event for other handlers to respect (optional listeners can ignore)
              try {
                const ev = new CustomEvent('cv:modeChanged', { detail: { mode: currentMode, source: 'onNo' } });
                window.dispatchEvent(ev);
                console.log('[cv:onNo] dispatched cv:modeChanged', currentMode);
              } catch (e) { /* ignore */ }

            } catch (err) {
              console.warn('[cv:onNo] inner error', err);
            } finally {
              // clear pending flag if present
              try { if (window.__cv_mode_confirm) delete window.__cv_mode_confirm.pendingMode; } catch (e) { }

              // restore scroll so user isn't moved
              try { window.scrollTo(prevX, prevY); } catch (e) { try { window.scrollTo(prevX, prevY); } catch (er) { } }
            }

            // === FINAL ENFORCEMENT: ensure mode/UI truly reflect the pending value ===
            try {
              (function finalForceMode() {
                try {
                  const forced = (typeof pending !== 'undefined' && pending) ? pending : (currentMode || 'auto');
                  if (forced === 'auto') {
                    // make segAuto visually active
                    if (segAuto) {
                      segAuto.classList.add('active');
                      segAuto.setAttribute('aria-selected', 'true');
                      segAuto.tabIndex = 0;
                    }
                    if (segManual) {
                      segManual.classList.remove('active');
                      segManual.setAttribute('aria-selected', 'false');
                      segManual.tabIndex = -1;
                    }
                    // ensure ctype UI is closed/disabled
                    try { showCtypeWrap(false); } catch (e) { }
                    try { if (ctype2) { ctype2.disabled = true; } } catch (e) { }
                    // set JS state
                    currentMode = 'auto';
                    try { window.currentMode = 'auto'; } catch (e) { }
                  } else {
                    // forced manual
                    if (segManual) {
                      segManual.classList.add('active');
                      segManual.setAttribute('aria-selected', 'true');
                      segManual.tabIndex = 0;
                    }
                    if (segAuto) {
                      segAuto.classList.remove('active');
                      segAuto.setAttribute('aria-selected', 'false');
                      segAuto.tabIndex = -1;
                    }
                    try { showCtypeWrap(true); } catch (e) { }
                    try { if (ctype2) { ctype2.disabled = false; try { ctype2.focus(); } catch (e) { } } } catch (e) { }
                    currentMode = 'manual';
                    try { window.currentMode = 'manual'; } catch (e) { }
                  }

                  // sync other UI pieces & analysis state
                  try { syncFileDetailsToMode(); } catch (e) { console.warn('[cv:onNo] syncFileDetailsToMode failed in finalForce', e); }
                  try { updateAnalyzeState(); } catch (e) { console.warn('[cv:onNo] updateAnalyzeState failed in finalForce', e); }

                  // re-dispatch modeChanged so listeners that missed previous event will react
                  try {
                    const ev2 = new CustomEvent('cv:modeChanged', { detail: { mode: currentMode, source: 'onNo:final' } });
                    window.dispatchEvent(ev2);
                    console.log('[cv:onNo] dispatched cv:modeChanged (final)', currentMode);
                  } catch (e) { /* ignore */ }

                } catch (e) {
                  console.warn('[cv:onNo] finalForceMode error', e);
                }
              })();
            } catch (ee) { /* ignore final enforcement errors */ }

            // === CLEAR the suppress flag after a short safety window ===
            try {
              setTimeout(() => {
                try {
                  if (window.__cv_mode_confirm) {
                    delete window.__cv_mode_confirm.suppressAutoReset;
                    console.log('[cv:onNo] cleared suppressAutoReset');
                  }
                } catch (ee) { /* ignore */ }
              }, 700); // safety window
            } catch (ee) { /* ignore */ }

          }, 40);
        });
      } catch (e) {
        try { window.__cv_mode_confirm && window.__cv_mode_confirm.hide(); } catch (ex) { }
        console.warn('[cv:onNo] outer error', e);
      }
    };



  })();



  // NEW HELPERS: file-details selects (these are the selects in your form)
  // --- paste near other helpers (safeAddClass / safeRemoveClass) ---
  function setSelectEnabled(selectEl, enabled) {
    try {
      if (!selectEl) return;

      // 1) keep native semantics for forms
      selectEl.disabled = !enabled;
      if (!enabled) selectEl.setAttribute('disabled', 'true'); else selectEl.removeAttribute('disabled');
      try { selectEl.tabIndex = enabled ? 0 : -1; } catch (e) { /* ignore */ }

      // 2) reflect state on custom wrapper if present (cv-custom-select created by buildCustom)
      const wrapper = (selectEl.closest && selectEl.closest('.cv-custom-select')) || null;
      const button = wrapper ? wrapper.querySelector('.cv-selected') : null;
      const opts = wrapper ? Array.from(wrapper.querySelectorAll('.cv-option')) : [];

      if (wrapper) {
        // visual + accessibility flags on wrapper
        wrapper.classList.toggle('disabled', !enabled);
        wrapper.setAttribute('aria-disabled', (!enabled).toString());

        // visible button: prevent focus/click when disabled and slightly dim it
        if (button) {
          button.setAttribute('aria-disabled', (!enabled).toString());
          try { button.tabIndex = enabled ? 0 : -1; } catch (e) { }
          button.style.pointerEvents = enabled ? '' : 'none';
          button.style.opacity = enabled ? '' : '0.55';
        }

        // options: prevent keyboard/click when disabled
        opts.forEach(o => {
          if (!enabled) {
            o.setAttribute('aria-disabled', 'true');
            try { o.tabIndex = -1; } catch (e) { }
          } else {
            o.removeAttribute('aria-disabled');
            try { o.tabIndex = 0; } catch (e) { }
          }
        });

        // add/remove a capturing handler while disabled to block accidental opens
        if (!enabled) {
          if (!wrapper.__cv_disabled_handler) {
            wrapper.__cv_disabled_handler = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
            wrapper.addEventListener('click', wrapper.__cv_disabled_handler, true);
            wrapper.__cv_disabled_key = function (ev) { if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') { ev.preventDefault(); ev.stopPropagation(); } };
            wrapper.addEventListener('keydown', wrapper.__cv_disabled_key, true);
          }
        } else {
          if (wrapper.__cv_disabled_handler) {
            wrapper.removeEventListener('click', wrapper.__cv_disabled_handler, true);
            delete wrapper.__cv_disabled_handler;
          }
          if (wrapper.__cv_disabled_key) {
            wrapper.removeEventListener('keydown', wrapper.__cv_disabled_key, true);
            delete wrapper.__cv_disabled_key;
          }
        }
      } else {
        // No custom wrapper: make native select visually non-interactive when disabled
        if (!enabled) {
          try { selectEl.style.pointerEvents = 'none'; selectEl.style.opacity = '0.55'; } catch (e) { }
        } else {
          try { selectEl.style.pointerEvents = ''; selectEl.style.opacity = ''; } catch (e) { }
        }
      }
    } catch (err) {
      console.warn('setSelectEnabled error', err);
    }
  }

  const sourceSelect = document.getElementById('sourceSelect');
  const organSelect = document.getElementById('organSelect');
  const subtypeSelect = document.getElementById('subtypeSelect');
  const groundTruthSelect = document.getElementById('groundTruthSelect');

  // store original location of .button-row and analyze2 so we can restore exactly  
  let originalButtonRowParent = null;
  let originalButtonRowNextSibling = null;
  let analyzeOriginalParent = null;
  let analyzeOriginalNextSibling = null;

  let pickedFile = null;
  let currentMode = 'auto';



  /* helpers */
  const safeAddClass = (el, c) => el && el.classList && el.classList.add(c);
  const safeRemoveClass = (el, c) => el && el.classList && el.classList.remove(c);
  const findDetectionInner = el => el ? el.closest('.detection-inner') : null;

  /* detect-note margin helper */
  function setDetectNoteMargin(px) {
    if (!detectNote1) return;
    detectNote1.style.transition = 'margin-top 0.34s ease';
    detectNote1.style.marginTop = px;
  }


  /* -----------------------
    FILE-DETAILS MODE HELPERS (ADDED)
    ----------------------- */

  // REPLACE your existing applyLockedFileDetails() with this — only this function changed.
  function applyLockedFileDetails() {
    try {
      // helper: set select to "unknown" option if present (or fallback), update any cv-custom-select visible UI
      function setToUnknownAndUpdateUI(sel) {
        if (!sel) return;
        // find unknown option (value === 'unknown' OR text includes 'unknown')
        const opt = Array.from(sel.options).find(o => {
          const v = (o.value || '').toString().trim().toLowerCase();
          const t = (o.textContent || o.innerText || '').toString().trim().toLowerCase();
          return v === 'unknown' || t.indexOf('unknown') !== -1;
        });

        // set native value first (so form state is correct)
        if (opt) {
          try { sel.value = opt.value; } catch (e) { try { sel.selectedIndex = Array.prototype.indexOf.call(sel.options, opt); } catch (e2) { /* ignore */ } }
        } else {
          // fallback: try to select an explicit 'unknown' string or clear to placeholder
          const explicit = Array.from(sel.options).find(o => (o.value || '').toString().trim().toLowerCase() === 'unknown');
          if (explicit) {
            try { sel.value = explicit.value; } catch (e) { /* ignore */ }
          } else {
            // choose first option as safe fallback (often placeholder)
            const first = sel.options && sel.options[0];
            try { sel.value = first ? first.value : ''; } catch (e) { /* ignore */ }
          }
        }

        // then update custom wrapper visible text (if present)
        try {
          const wrap = sel.closest && sel.closest('.cv-custom-select');
          if (wrap) {
            const txt = wrap.querySelector('.cv-text');
            // determine label to show: prefer the resolved native selected option's text
            const selOpt = sel.options[sel.selectedIndex];
            const label = (selOpt && (selOpt.textContent || selOpt.innerText)) || (opt && (opt.textContent || opt.innerText)) || '— Select —';
            if (txt) {
              txt.textContent = label;
              txt.classList.toggle('cv-placeholder', !label || String(label).trim() === '');
            }
            // update visible options aria-selected if any
            const visOpts = wrap.querySelectorAll('.cv-option');
            if (visOpts && visOpts.length) {
              visOpts.forEach(v => {
                try {
                  if (opt && String(v.dataset.value) === String(opt.value)) v.setAttribute('aria-selected', 'true');
                  else v.removeAttribute('aria-selected');
                } catch (e) { /* ignore per-item */ }
              });
            }
          }
        } catch (e) { /* ignore wrapper update errors */ }
      }

      // SOURCE: set to unknown if possible, then disable + visually mark disabled
      if (sourceSelect) {
        setToUnknownAndUpdateUI(sourceSelect);
        try { setSelectEnabled(sourceSelect, false); } catch (e) { try { sourceSelect.disabled = true; } catch (e2) { } }
        try { const wrap = sourceSelect.closest && sourceSelect.closest('.cv-custom-select'); if (wrap) wrap.classList.add('disabled'); } catch (e) { }
      }

      // ORGAN: set to unknown if possible, then disable + visually mark disabled
      if (organSelect) {
        setToUnknownAndUpdateUI(organSelect);
        try { setSelectEnabled(organSelect, false); } catch (e) { try { organSelect.disabled = true; } catch (e2) { } }
        try { const wrap = organSelect.closest && organSelect.closest('.cv-custom-select'); if (wrap) wrap.classList.add('disabled'); } catch (e) { }
      }

      // SUBTYPE: hide row, clear options, disable (keep wrapper hidden)
      if (subtypeSelect) {
        try {
          const subRow = subtypeSelect.closest('.meta-row');
          if (subRow) subRow.style.display = 'none';
        } catch (e) { /* ignore */ }

        try {
          while (subtypeSelect.firstChild) subtypeSelect.removeChild(subtypeSelect.firstChild);
          const placeholder = document.createElement('option');
          placeholder.value = '';
          placeholder.textContent = '— Select —';
          placeholder.selected = true;
          subtypeSelect.appendChild(placeholder);
        } catch (e) { /* ignore */ }

        try { setSelectEnabled(subtypeSelect, false); } catch (e) { try { subtypeSelect.disabled = true; } catch (e2) { } }
        try { const wrap = subtypeSelect.closest && subtypeSelect.closest('.cv-custom-select'); if (wrap) wrap.style.display = 'none'; } catch (e) { }
      }

      // GROUND TRUTH: set to unknown if possible, then disable + visually mark
      if (groundTruthSelect) {
        setToUnknownAndUpdateUI(groundTruthSelect);
        try { setSelectEnabled(groundTruthSelect, false); } catch (e) { try { groundTruthSelect.disabled = true; } catch (e2) { } }
        try { const wrap = groundTruthSelect.closest && groundTruthSelect.closest('.cv-custom-select'); if (wrap) wrap.classList.add('disabled'); } catch (e) { }
      }

    } catch (err) {
      // fail-safe: attempt to disable all selects if something unexpected happens
      try { if (sourceSelect) setSelectEnabled(sourceSelect, false); } catch (e) { }
      try { if (organSelect) setSelectEnabled(organSelect, false); } catch (e) { }
      try { if (subtypeSelect) setSelectEnabled(subtypeSelect, false); } catch (e) { }
      try { if (groundTruthSelect) setSelectEnabled(groundTruthSelect, false); } catch (e) { }
      console.warn('applyLockedFileDetails error', err);
    }
  }


  // === REPLACE ONLY this function in your script.js ===
  function applySingleManualFileDetails(preferredOrganValue) {
    try {
      const useHelper = (typeof setSelectEnabled === 'function');

      // --- determine the target organ value (normalized) ---
      const pref = preferredOrganValue && (preferredOrganValue.toString().trim()) ? preferredOrganValue.toString().trim() : '';
      // if preferred provided but not found in organ options, fallback to empty
      const organOptValues = organSelect ? Array.from(organSelect.options).map(o => (o.value || '').toString().trim()) : [];
      const organVal = (pref && organOptValues.includes(pref)) ? pref : (organSelect && (organSelect.value || '').toString().trim()) || '';

      // === ORGAN SELECT: set to preferred (if valid) or keep current placeholder; then LOCK it ===
      if (organSelect) {
        try {
          if (pref && organOptValues.includes(pref)) {
            try { organSelect.value = pref; } catch (e) { /* ignore */ }
          } else {
            const firstPlaceholder = Array.from(organSelect.options).find(o => (o.value || '').toString().trim() === '' || (o.textContent || '').toLowerCase().includes('select'));
            if (firstPlaceholder && (!organSelect.value || organSelect.value === 'unknown' || organSelect.value === '')) {
              try { organSelect.value = firstPlaceholder.value || ''; } catch (e) { organSelect.value = firstPlaceholder.value || ''; }
            }
          }

          try {
            const wrap = organSelect.closest && organSelect.closest('.cv-custom-select');
            if (wrap) {
              const btn = wrap.querySelector('.cv-selected .cv-text') || wrap.querySelector('.cv-selected');
              const selectedOpt = Array.from(organSelect.options).find(o => o.value === organSelect.value);
              if (btn) btn.textContent = selectedOpt ? (selectedOpt.textContent || selectedOpt.value) : (organSelect.value || '');
            }
          } catch (e) { /* ignore */ }

          if (useHelper) setSelectEnabled(organSelect, false);
          else {
            organSelect.disabled = true;
            try {
              const wrap = organSelect.closest && organSelect.closest('.cv-custom-select');
              if (wrap) {
                wrap.classList.add('disabled');
                const btn = wrap.querySelector('.cv-selected');
                if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.tabIndex = -1; btn.style.pointerEvents = 'none'; btn.style.opacity = '0.55'; }
                wrap.querySelectorAll('.cv-option').forEach(o => { o.setAttribute('aria-disabled', 'true'); o.tabIndex = -1; });
              } else {
                organSelect.style.pointerEvents = 'none';
                organSelect.style.opacity = '0.55';
              }
            } catch (e) { /* ignore */ }
          }
        } catch (e) { /* ignore organ block */ }
      }

      // === SUBTYPE handling: SHOW only when organVal maps to known subtypes; else HIDE & clear ===
      if (subtypeSelect) {
        const subRow = subtypeSelect.closest('.meta-row');

        const setSubtypeOptions = (optsArray) => {
          while (subtypeSelect.firstChild) subtypeSelect.removeChild(subtypeSelect.firstChild);
          const placeholder = document.createElement('option');
          placeholder.value = '';
          placeholder.textContent = '— Select subtype —';
          placeholder.selected = true;
          placeholder.disabled = false;
          subtypeSelect.appendChild(placeholder);
          optsArray.forEach(o => {
            const el = document.createElement('option');
            el.value = o.value;
            el.textContent = o.label;
            subtypeSelect.appendChild(el);
          });
          try { subtypeSelect.value = ''; } catch (e) { /* ignore */ }

          // Update custom wrapper visible options if present — rebuild list so it always matches
          try {
            const wrap = subtypeSelect.closest && subtypeSelect.closest('.cv-custom-select');
            if (wrap) {
              const optsContainer = wrap.querySelector('.cv-options');
              const visibleButtonText = wrap.querySelector('.cv-selected .cv-text') || wrap.querySelector('.cv-selected');
              // Clear existing visible options
              if (optsContainer) {
                optsContainer.innerHTML = '';
                // Recreate option nodes to match native options exactly
                Array.from(subtypeSelect.options).forEach((nativeOpt, idx) => {
                  const item = document.createElement('div');
                  item.className = 'cv-option';
                  item.setAttribute('role', 'option');
                  item.dataset.value = nativeOpt.value;
                  item.textContent = nativeOpt.textContent || nativeOpt.value;
                  item.tabIndex = 0;
                  if (nativeOpt.selected) item.setAttribute('aria-selected', 'true');
                  // click handler to sync native select and visible button
                  item.addEventListener('click', () => {
                    try {
                      // set native select's value
                      subtypeSelect.selectedIndex = idx;
                      // update visible button text
                      if (visibleButtonText) visibleButtonText.textContent = nativeOpt.textContent || nativeOpt.value;
                      // update aria-selected flags
                      Array.from(optsContainer.children).forEach(c => c.removeAttribute('aria-selected'));
                      item.setAttribute('aria-selected', 'true');
                      // close the custom dropdown if open
                      const wrapperClose = wrap.classList.contains('open') ? (() => wrap.classList.remove('open')) : null;
                      if (wrapperClose) wrapperClose();
                      // dispatch change so other logic picks it up
                      subtypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    } catch (e) { /* ignore per-item */ }
                  });
                  optsContainer.appendChild(item);
                });
              }
            }
          } catch (e) { /* ignore wrapper update errors */ }

        };

        const subtypeMap = {
          brain: [{ value: 'normal', label: 'normal' }, { value: 'glioma_tumor', label: 'glioma_tumor' }, { value: 'meningioma_tumor', label: 'meningioma_tumor' }, { value: 'pituitary_tumor', label: 'pituitary_tumor' }, { value: 'unknown', label: 'Unknown' }],
          lung: [{ value: 'large_cell_carcinoma', label: 'large_cell_carcinoma' }, { value: 'squamous_cell_carcinoma', label: 'squamous_cell_carcinoma' }, { value: 'adenocarcinoma', label: 'adenocarcinoma' }, { value: 'normal', label: 'normal' }, { value: 'unknown', label: 'Unknown' }],
          breast: [{ value: 'normal', label: 'normal' }, { value: 'malignant_tumor', label: 'malignant_tumor' }, { value: 'benign_tumor', label: 'benign_tumor' }, { value: 'unknown', label: 'Unknown' }],
          skin: [{ value: 'normal', label: 'normal' }, { value: 'melanoma', label: 'melanoma' }, { value: 'basal_cell_carcinoma', label: 'basal_cell_carcinoma' }, { value: 'squamous_cell_carcinoma', label: 'squamous_cell_carcinoma' }, { value: 'unknown', label: 'Unknown' }]
        };

        if (organVal && subtypeMap[organVal]) {
          if (subRow) subRow.style.display = '';
          if (useHelper) setSelectEnabled(subtypeSelect, true);
          else { subtypeSelect.disabled = false; subtypeSelect.style.pointerEvents = ''; subtypeSelect.style.opacity = ''; }
          setSubtypeOptions(subtypeMap[organVal]);

          // ensure custom wrapper (if buildCustom created one) is shown when subtype is enabled
          try {
            const wrap = subtypeSelect && subtypeSelect.closest && subtypeSelect.closest('.cv-custom-select');
            if (wrap) {
              wrap.style.display = '';
            }
          } catch (e) { /* ignore */ }

        } else {
          if (subRow) subRow.style.display = 'none';
          if (useHelper) setSelectEnabled(subtypeSelect, false);
          else { subtypeSelect.disabled = true; subtypeSelect.style.pointerEvents = 'none'; subtypeSelect.style.opacity = '0.55'; }
          while (subtypeSelect.firstChild) subtypeSelect.removeChild(subtypeSelect.firstChild);
          const placeholder = document.createElement('option');
          placeholder.value = '';
          placeholder.textContent = '— Select —';
          placeholder.selected = true;
          subtypeSelect.appendChild(placeholder);
          // also clear custom wrapper options if present
          try {
            const wrap = subtypeSelect && subtypeSelect.closest && subtypeSelect.closest('.cv-custom-select');
            if (wrap) {
              const optsContainer = wrap.querySelector('.cv-options');
              if (optsContainer) optsContainer.innerHTML = '';
              const visibleButtonText = wrap.querySelector('.cv-selected .cv-text') || wrap.querySelector('.cv-selected');
              if (visibleButtonText) visibleButtonText.textContent = '— Select —';
            }
          } catch (e) { /* ignore */ }
        }
      }

      // === SOURCE SELECT: make sure it is editable and show placeholder (NO preselect 'unknown') ===
      try {
        if (sourceSelect) {
          const placeholderOpt = Array.from(sourceSelect.options).find(o => (o.value || '').toString().trim() === '' || (o.textContent || '').toLowerCase().includes('select'));
          if (placeholderOpt) {
            try { sourceSelect.value = placeholderOpt.value || ''; } catch (e) { sourceSelect.value = placeholderOpt.value || ''; }
          } else {
            try { sourceSelect.value = ''; } catch (e) { /* ignore */ }
          }
          if (useHelper) setSelectEnabled(sourceSelect, true);
          else { sourceSelect.disabled = false; try { sourceSelect.style.pointerEvents = ''; sourceSelect.style.opacity = ''; } catch (e) { } }
          try {
            const wrap = sourceSelect.closest && sourceSelect.closest('.cv-custom-select');
            if (wrap) {
              const btn = wrap.querySelector('.cv-selected .cv-text') || wrap.querySelector('.cv-selected');
              const selectedOpt = Array.from(sourceSelect.options).find(o => o.value === sourceSelect.value);
              if (btn) btn.textContent = selectedOpt ? (selectedOpt.textContent || selectedOpt.value) : '';
            }
          } catch (e) { }
        }
      } catch (e) { /* ignore */ }

      // === GROUND TRUTH: editable + placeholder (NO 'unknown' preselected) ===
      try {
        if (groundTruthSelect) {
          const placeholderOpt = Array.from(groundTruthSelect.options).find(o => (o.value || '').toString().trim() === '' || (o.textContent || '').toLowerCase().includes('select'));
          if (placeholderOpt) {
            try { groundTruthSelect.value = placeholderOpt.value || ''; } catch (e) { groundTruthSelect.value = placeholderOpt.value || ''; }
          } else {
            try { groundTruthSelect.value = ''; } catch (e) { /* ignore */ }
          }
          if (useHelper) setSelectEnabled(groundTruthSelect, true);
          else { groundTruthSelect.disabled = false; try { groundTruthSelect.style.pointerEvents = ''; groundTruthSelect.style.opacity = ''; } catch (e) { } }

          try {
            const wrap = groundTruthSelect.closest && groundTruthSelect.closest('.cv-custom-select');
            if (wrap) {
              const btn = wrap.querySelector('.cv-selected .cv-text') || wrap.querySelector('.cv-selected');
              const selectedOpt = Array.from(groundTruthSelect.options).find(o => o.value === groundTruthSelect.value);
              if (btn) btn.textContent = selectedOpt ? (selectedOpt.textContent || selectedOpt.value) : '';
            }
          } catch (e) { }
        }
      } catch (e) { /* ignore */ }

    } catch (e) { /* ignore overall */ }
  }


  function getCtypeSelectedCountAndFirst() {
    try {
      const hidden = document.getElementById('ctype2_values');
      if (!hidden || !hidden.value) return { count: 0, first: null };
      const parts = hidden.value.split(',').map(s => s.trim()).filter(Boolean);
      return { count: parts.length, first: parts[0] || null };
    } catch (e) { return { count: 0, first: null }; }
  }

  // === Robust syncFileDetailsToMode (replace existing) ===
  function syncFileDetailsToMode() {
    try {
      const mode = currentMode || 'auto';
      if (mode === 'auto') {
        applyLockedFileDetails();
        return;
      }

      // Gather selected ctype values from multiple possible sources (hidden input, native select, chip API)
      let vals = [];

      try {
        const hidden = document.getElementById('ctype2_values');
        if (hidden && (hidden.value || '').trim()) {
          vals = hidden.value.split(',').map(s => s.trim()).filter(Boolean);
        }
      } catch (e) { vals = []; }

      // Fallback: if hidden empty, try native select value (single-select browsers)
      try {
        if ((!vals || vals.length === 0) && ctype2) {
          const nativeVal = (ctype2.value || '').toString().trim();
          if (nativeVal) vals = [nativeVal];
        }
      } catch (e) { /* ignore */ }

      // Extra fallback: if window.__cv_debug.ctypeSelected exists use it (debug API returns internal selected array)
      try {
        if ((!vals || vals.length === 0) && window.__cv_debug && typeof window.__cv_debug.ctypeSelected === 'function') {
          const dbg = window.__cv_debug.ctypeSelected();
          if (Array.isArray(dbg) && dbg.length) vals = dbg.slice();
        }
      } catch (e) { /* ignore */ }

      // Normalize: remove empties and duplicates
      try {
        vals = (vals || []).map(s => (s || '').toString().trim()).filter(Boolean);
        vals = Array.from(new Set(vals)); // unique
      } catch (e) { vals = vals || []; }

      if (vals.length === 0) {
        // no selection yet: enable organ so user can pick (single-manual empty state)
        applySingleManualFileDetails(null);
        if (groundTruthSelect) {
          try { setSelectEnabled(groundTruthSelect, true); } catch (e) { groundTruthSelect.disabled = false; }
        }
      } else if (vals.length === 1) {
        // single selected: set organ to matching value and show subtype
        applySingleManualFileDetails(vals[0]);
      } else {
        // multi selected -> lock like auto: organ/ground -> unknown, subtype hide
        applyLockedFileDetails();
      }
    } catch (e) {
      // fail-safe: if sync crashes, lock to safe state
      try { applyLockedFileDetails(); } catch (err) { /* ignore */ }
    }
  }


  /* --- segmented control & ctype show/hide --- */
  function showCtypeWrap(show) {
    if (!ctypeWrap) return;
    const container = findDetectionInner(ctypeWrap);
    ctypeWrap.style.overflow = 'hidden';
    ctypeWrap.style.transition = 'max-height .26s ease, opacity .2s ease';
    if (show) {
      ctypeWrap.style.display = 'block';
      ctypeWrap.setAttribute('aria-hidden', 'false');
      ctypeWrap.style.pointerEvents = 'auto';
      if (ctype2) ctype2.disabled = false;
      const h = ctypeWrap.scrollHeight + 'px';
      ctypeWrap.style.maxHeight = '0px';
      ctypeWrap.style.opacity = '0';
      requestAnimationFrame(() => {
        ctypeWrap.style.maxHeight = h;
        ctypeWrap.style.opacity = '1';
      });
      // push detect-note down  
      setDetectNoteMargin('125px');
      if (container) container.classList.add('ctype-open');
    } else {
      const h = ctypeWrap.scrollHeight + 'px';
      ctypeWrap.style.maxHeight = h;
      ctypeWrap.style.opacity = '1';
      requestAnimationFrame(() => {
        ctypeWrap.style.maxHeight = '0px';
        ctypeWrap.style.opacity = '0';
        ctypeWrap.style.pointerEvents = 'none';
        if (ctype2) ctype2.disabled = true;
        ctypeWrap.setAttribute('aria-hidden', 'true');
      });
      setTimeout(() => { ctypeWrap.style.display = 'none'; }, 320);
      // restore margin  
      setDetectNoteMargin('30px');
      if (container) container.classList.remove('ctype-open');
    }
  }

  /* -----------------------
    NEW: require mandatory patient fields before enabling detection/upload
    ----------------------- */

  // returns true only if all mandatory patient fields are valid
  function mandatoryDetailsFilled() {
    // use validators so inline errors show
    const okFirst = validateFirstName();
    const okLast = validateLastName();
    const okAge = validateAge2();
    const okGender = validateGender();
    return okFirst && okLast && okAge && okGender;
  }

  // enable/disable detection controls & dropzone based on mandatoryDetailsFilled
  function updateDetectionAvailability() {
    const ok = mandatoryDetailsFilled();

    // Segmented controls: show/hide based on mandatory completion (we hide them entirely until ok)
    try {
      if (segAuto) segAuto.style.display = ok ? '' : 'none';
      if (segManual) segManual.style.display = ok ? '' : 'none';
    } catch (e) { /* ignore */ }

    // If not ok: force auto mode and hide ctypeWrap
    try {
      if (!ok) {
        // ensure manual mode not active & ctype closed
        setMode('auto');
        showCtypeWrap(false);
        if (ctype2) try { ctype2.disabled = true; } catch (e) { }
      }
    } catch (e) { /* ignore */ }

    // Dropzone / upload area: hide entirely until mandatory details are filled
    try {
      if (dz) {
        if (!ok) {
          // hide the whole upload block (preferred) so both dropzone and preview area stay hidden
          try {
            if (uploadBlock) uploadBlock.style.display = 'none';
            else dz.style.display = 'none';
          } catch (e) { try { dz.style.display = 'none'; } catch (er) { /* ignore */ } }
          // ensure not focusable/interactive while hidden
          try { dz.setAttribute('aria-hidden', 'true'); } catch (e) { }
          // remove any ready class
          try { dz.classList && dz.classList.remove('cv-dz-ready'); } catch (e) { }
        } else {
          // show upload UI again (restore display). If the upload block had a preview active, .has-preview will manage visibility
          try {
            if (uploadBlock) uploadBlock.style.display = '';
            if (dz) dz.style.display = 'block';
          } catch (e) { try { dz.style.display = 'block'; } catch (er) { /* ignore */ } }
          try { dz.removeAttribute('aria-hidden'); } catch (e) { }
        }
      }
      if (fileInp) {
        // keep file input functional but handleFile will block if mandatory not filled;
        // (we don't set disabled on fileInp to avoid UX file picker differences on some browsers)
      }
    } catch (e) { /* ignore */ }

    // also toggle the Detection Options heading/section (robust if it's outside the upload block)
    try { if (detectionHeading) detectionHeading.style.display = ok ? '' : 'none'; } catch (e) { /* ignore */ }
    try { if (detectionNote) detectionNote.style.display = ok ? '' : 'none'; } catch (e) { /* ignore */ }
    try { if (detectFunImg) detectFunImg.style.display = ok ? '' : 'none'; } catch (e) { /* ignore */ }


  }

  /* -----------------------
    setMode and segmented control wiring
    ----------------------- */
  function setMode(mode) {
    // store previous mode to detect change
    const prevMode = currentMode;
    currentMode = mode;
    // keep global pointer too
    try { window.currentMode = mode; } catch (e) { }
    if (!segAuto || !segManual) return;
    if (mode === 'auto') {
      safeAddClass(segAuto, 'active'); segAuto.setAttribute('aria-selected', 'true'); segAuto.tabIndex = 0;
      safeRemoveClass(segManual, 'active'); segManual.setAttribute('aria-selected', 'false'); segManual.tabIndex = -1;
      showCtypeWrap(false);

      // *** CLEAR multi-select chips/values when switching to auto ***
      try {
        if (window.__cv_debug && typeof window.__cv_debug.clearCtype === 'function') {
          window.__cv_debug.clearCtype();
        }
      } catch (e) { /* ignore */ }

      // enforce locked file-details for auto
      try { applyLockedFileDetails(); } catch (e) { }

    } else {
      safeAddClass(segManual, 'active'); segManual.setAttribute('aria-selected', 'true'); segManual.tabIndex = 0;
      safeRemoveClass(segAuto, 'active'); segAuto.setAttribute('aria-selected', 'false'); segAuto.tabIndex = -1;
      showCtypeWrap(true);
      setTimeout(() => { try { if (ctype2) ctype2.focus(); } catch (err) { /* ignore */ } }, 280);

      // sync file-details according to how many ctype items are selected
      try { syncFileDetailsToMode(); } catch (e) { }
    }

    // ===== NEW: If user changed the detection mode while a file was uploaded,
    // remove the uploaded file and prompt Yes/No to edit patient details.
    try {
      if (pickedFile && prevMode !== mode) {
        try { resetFile(false); } catch (e) { console.warn('resetFile failed during mode change', e); }

        if (window.__cv_mode_confirm && typeof window.__cv_mode_confirm.show === 'function') {
          window.__cv_mode_confirm.pendingMode = mode;   // <-- ADD THIS LINE
          window.__cv_mode_confirm.show();
        } else {
          // fallback to old toast/alert if modal unavailable
          if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
            window.__cv_toast.show({
              title: 'Mode changed',
              message: 'Detection mode changed — uploaded image removed.',
              timeout: 2200
            });
          } else {
            try { alert('Detection mode changed — uploaded image removed.'); } catch (e) { }
          }
        }

        // focus ctype2 if switched to manual so user can re-select
        try { if (mode === 'manual' && ctype2) ctype2.focus(); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      console.warn('mode-change file clear failed', e);
    }



    updateAnalyzeState();
  }

  if (segAuto) segAuto.addEventListener('click', (e) => { e.preventDefault(); if (!segAuto.disabled) setMode('auto'); });
  if (segManual) segManual.addEventListener('click', (e) => { e.preventDefault(); if (!segManual.disabled) setMode('manual'); });

  /* keyboard support for segmented control */
  [segAuto, segManual].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (btn === segAuto) setMode('manual'); else setMode('auto');
        if (currentMode === 'auto') segAuto && segAuto.focus(); else segManual && segManual.focus();
      }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!btn.disabled) btn.click(); }
    });
  });



  // === INSTALL: Apple-style "File too large" popup (ONLY for size error) ===
  (function installFileTooLargePopup() {
    if (window.__cv_fileTooLarge_installed) return;
    window.__cv_fileTooLarge_installed = true;

    const css = `
 #cv-filetoo-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 13200;

    /* 🔥 EXACT MATCH of your second modal blur */
    background: rgba(3, 37, 65, 0.45); 
    backdrop-filter: blur(6px) saturate(120%);

    /* Hidden by default */
    opacity: 0;
    visibility: hidden;
    pointer-events: none;

    transition: opacity .25s ease, visibility .25s ease;
}

#cv-filetoo-overlay.show {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}


  #cv-filetoo-card {
    width: min(720px, 86%);
    max-width: 720px;
    padding: 18px 22px;
    border-radius: 14px;
    gap: 16px;
    box-sizing: border-box;

    /* DARK frosted Apple-style */
    backdrop-filter: blur(30px) saturate(120%);
    background: linear-gradient(180deg, rgba(10,24,34,0.62), rgba(6,18,28,0.45));
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 30px 80px rgba(6,12,24,0.46), inset 0 1px 0 rgba(255,255,255,0.02);
    color: #e6f4fb;
    position: relative;
    text-align: left;
    min-height: 66px;
  }

  /* left warning icon */
  #cv-filetoo-icon {
    width: 56px; height: 56px; flex:0 0 56px;
    border-radius: 12px;
    display:flex; align-items:center; justify-content:center;
    background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
    box-shadow: 0 8px 26px rgba(2,6,23,0.18), inset 0 1px 0 rgba(255,255,255,0.02);
  }
#cv-filetoo-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center !important;
    align-items: center !important;
    margin-left: 10px;
}

  #cv-filetoo-title { font-weight:800; font-size:17px; color:#f1fbff; margin:0; text-align:left; }
  #cv-filetoo-msg { font-size:13px; color: rgba(230,244,251,0.82); margin:0; line-height:1.2; }

  #cv-filetoo-close {
    position:absolute; right:12px; top:12px;
    width:34px; height:34px; border-radius:999px;
    display:inline-flex; align-items:center; justify-content:center;
    background: linear-gradient(180deg,#ff6b6b,#d83b3b);
    border: 1px solid rgba(255,255,255,0.06);
    cursor:pointer;
    box-shadow: 0 10px 26px rgba(2,6,23,0.28);
  }
  #cv-filetoo-close .x { color:#fff; font-weight:700; font-size:13px; line-height:1; }

  @media(max-width:560px){
    #cv-filetoo-card { padding:14px; border-radius:12px; gap:12px; width:92%; }
    #cv-filetoo-icon{ width:48px;height:48px; flex:0 0 48px; border-radius:10px;}
    #cv-filetoo-title{ font-size:15px }
    #cv-filetoo-msg{ font-size:12px }
    #cv-filetoo-close{ width:30px; height:30px; top:8px; right:8px }
  }


#cv-filetoo-title {
    font-weight: 700;
    font-size: 18px;
    color: #ffffff;
}

#cv-filetoo-msg {
    font-size: 13px;
    opacity: 0.85;
}

#cv-filetoo-card {
    display: grid !important;
    grid-template-columns: auto 1fr auto !important;
    align-items: center;
    column-gap: 16px;
}


  
  `;
    try {
      // remove old style if present to avoid duplicates
      const old = document.getElementById('cv-filetoo-css');
      if (old) old.remove();
      const st = document.createElement('style'); st.id = 'cv-filetoo-css'; st.appendChild(document.createTextNode(css));
      document.head.appendChild(st);
    } catch (e) { /* ignore */ }

    // If overlay already exists remove it (avoid duplicate visible overlays)
    try {
      const existing = document.getElementById('cv-filetoo-overlay');
      if (existing) existing.remove();
    } catch (e) { }

    // DOM
    const overlay = document.createElement('div');
    overlay.id = 'cv-filetoo-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-hidden', 'true');

    const card = document.createElement('div');
    card.id = 'cv-filetoo-card';
    card.setAttribute('role', 'document');

    const icon = document.createElement('div');
    icon.id = 'cv-filetoo-icon';
    // SVG warning — high contrast so it shows on dark frosted bg
    icon.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 2L22 20H2L12 2Z" fill="#FFCC66"/>
      <path d="M12 8v5" stroke="#6B3E00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="17" r="1.2" fill="#6B3E00"/>
    </svg>`;

    const body = document.createElement('div');
    body.id = 'cv-filetoo-body';
    const title = document.createElement('div'); title.id = 'cv-filetoo-title'; title.textContent = 'File too large';
    const msg = document.createElement('div'); msg.id = 'cv-filetoo-msg'; msg.textContent = 'Maximum allowed file size is 10 MB.';

    body.appendChild(title);
    body.appendChild(msg);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'cv-filetoo-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '<span class="x">✕</span>';
    closeBtn.addEventListener('click', hideFileTooLarge);

    card.appendChild(icon);
    card.appendChild(body);
    card.appendChild(closeBtn);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    let hideTimer = null;
    function showFileTooLarge(opts) {
      try {
        opts = opts || {};
        if (opts.title) title.textContent = opts.title;
        if (opts.message) msg.textContent = opts.message;
        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.add('show');
        // clear previous timer
        if (hideTimer) clearTimeout(hideTimer);
        const timeout = (typeof opts.timeout === 'number') ? opts.timeout : 2600;
        if (timeout > 0) hideTimer = setTimeout(hideFileTooLarge, timeout);
      } catch (e) { console.warn('showFileTooLarge failed', e); }
    }
    function hideFileTooLarge() {
      try {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      } catch (e) { /* ignore */ }
    }

    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) hideFileTooLarge(); });

    // expose API
    window.__cv_fileTooLarge = { show: showFileTooLarge, hide: hideFileTooLarge };
  })();



  /* -----------------------
    Dropzone + file handling
    ----------------------- */
  if (dz && fileInp) {
    dz.addEventListener('click', () => {
      // if mandatory not filled, block click and show hint
      if (!mandatoryDetailsFilled()) {
        // Prefer showing the modal when installed, else fall back to toast/alert
        if (window.__cv_patient_modal && typeof window.__cv_patient_modal.show === 'function') {
          if (!window.__cv_patient_modal.isShown()) {
            // scroll to firstName before showing modal (same behaviour as init)
            const firstNameInput = document.getElementById('firstName');
            if (firstNameInput) {
              try {
                const smallScreen = window.innerWidth < 900;
                const yOffset = smallScreen ? -120 : -250;
                const y = firstNameInput.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: Math.max(0, Math.floor(y)), behavior: 'smooth' });
                setTimeout(() => {
                  try { firstNameInput.focus({ preventScroll: true }); } catch (err) { firstNameInput.focus(); }
                  try { window.__cv_patient_modal.show(); } catch (e) { /* ignore */ }
                }, 420);
              } catch (e) {
                try { window.__cv_patient_modal.show(); } catch (err) { /* ignore */ }
              }
            } else {
              try { window.__cv_patient_modal.show(); } catch (err) { /* ignore */ }
            }
          }
        } else if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
          window.__cv_toast.show({ title: 'Complete patient details', message: 'Please fill mandatory patient fields before uploading an image.', timeout: 2200 });
        } else {
          try { alert('Please fill mandatory patient fields before uploading an image.'); } catch (e) { /* ignore */ }
        }
        // focus first invalid field
        setTimeout(() => {
          try {
            if (!validateFirstName()) document.getElementById('firstName').focus();
            else if (!validateLastName()) document.getElementById('lastName').focus();
            else if (!validateAge2()) document.getElementById('age2').focus();
            else if (!validateGender()) document.getElementById('gender2').focus();
          } catch (e) { }
        }, 120);
        return;
      }
      fileInp.click();
    });
    dz.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && mandatoryDetailsFilled()) fileInp.click(); });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
      dz.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); });
    });
    dz.addEventListener('dragover', () => dz.classList.add('hover'));
    dz.addEventListener('dragleave', () => dz.classList.remove('hover'));
    dz.addEventListener('drop', (e) => {
      dz.classList.remove('hover');
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });

    fileInp.addEventListener('change', (e) => { if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]); });
  }

  if (clear2) clear2.addEventListener('click', (e) => { e && e.preventDefault(); resetFile(); });

  if (sample2) {
    sample2.addEventListener('click', () => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#eef2ff'/><text x='50%' y='50%' text-anchor='middle' font-size='38' fill='#223'>SAMPLE IMAGE</text></svg>`;
      fetch('data:image/svg+xml;utf8,' + encodeURIComponent(svg)).then(r => r.blob()).then(b => {
        const f = new File([b], 'sample.png', { type: 'image/png' }); handleFile(f);
      });
    });
  }

  /**
   * handleFile(file)
   * - saves pickedFile
   * - shows preview (thumb2)
   * - hides the dropzone (dz) and toggles .has-preview on .upload-block
   * - enables Analyze button (visual)
   */
  function handleFile(file) {
    // NEW: Prevent upload entirely until mandatory patient details are filled
    try {
      if (!mandatoryDetailsFilled()) {
        if (window.__cv_patient_modal && typeof window.__cv_patient_modal.show === 'function') {
          if (!window.__cv_patient_modal.isShown()) window.__cv_patient_modal.show();
        } else if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
          window.__cv_toast.show({ title: 'Complete patient details', message: 'Please fill mandatory patient fields before uploading an image.', timeout: 2200 });
        } else {
          try { alert('Please fill mandatory patient fields before uploading an image.'); } catch (e) { /* ignore */ }
        }
        // focus first invalid field
        setTimeout(() => {
          try {
            if (!validateFirstName()) document.getElementById('firstName').focus();
            else if (!validateLastName()) document.getElementById('lastName').focus();
            else if (!validateAge2()) document.getElementById('age2').focus();
            else if (!validateGender()) document.getElementById('gender2').focus();
          } catch (e) { }
        }, 120);
        return;
      }
    } catch (e) { /* if validator throws, continue to blocking below */ }

    // ---- FILE TYPE + SIZE GUARD (insert HERE, before manual-mode block) ----
    try {
      const ACCEPT_EXT = ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'dcm'];
      const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

      const name = (file && file.name || '').toLowerCase();
      const extMatch = name.match(/\.([a-z0-9]+)$/);
      const ext = extMatch ? extMatch[1] : '';

      // extension check
      if (!ext || !ACCEPT_EXT.includes(ext)) {
        if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
          window.__cv_toast.show({ title: 'Unsupported file', message: 'Only JPG/PNG/TIFF/DCM files are allowed.', timeout: 2600 });
        } else {
          try { alert('Unsupported file. Only JPG, PNG, TIFF, DCM allowed.'); } catch (e) { }
        }
        try { if (fileInp) fileInp.value = ''; } catch (e) { }
        return;
      }

      // size check
      if (file && file.size && file.size > MAX_BYTES) {
        if (window.__cv_fileTooLarge && typeof window.__cv_fileTooLarge.show === 'function') {
          window.__cv_fileTooLarge.show({ title: 'File too large', message: 'Maximum allowed file size is 10 MB.', timeout: 2600 });
        } else if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
          // existing toast fallback (keeps current behaviour)
          window.__cv_toast.show({ title: 'File too large', message: 'Maximum allowed file size is 10 MB.', timeout: 2600 });
        } else {
          try { alert('File too large. Max allowed is 10 MB.'); } catch (e) { }
        }
        try { if (fileInp) fileInp.value = ''; } catch (e) { }
        return;
      }

    } catch (e) {
      console.warn('file type/size guard failed', e);
    }
    // ---- end guard ----


    // ======= BLOCK: require at least one cancer-type in Manual mode =======
    try {
      // If we are in manual mode and no cancer-type selected, block the upload
      if (currentMode === 'manual') {
        const hidden = document.getElementById('ctype2_values');
        const hiddenVal = hidden ? (hidden.value || '').trim() : '';
        // fallback to native select value if hidden not present
        const nativeVal = (ctype2 && (ctype2.value || '').toString()) || '';
        const anySelected = !!(hiddenVal || nativeVal);

        if (!anySelected) {
          // show centralized toast if available
          if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
            window.__cv_toast.show({
              title: 'Select cancer type',
              message: 'Please select at least one cancer type before uploading.',
              timeout: 2600
            });
            // focus the select after a short delay so toast shows first
            setTimeout(() => {
              try { if (ctype2) { ctype2.focus(); } } catch (e) { /* ignore */ }
            }, 400);
          } else {
            // fallback
            try { alert('Please select at least one cancer type before uploading.'); } catch (e) {/*ignore*/ }
            try { if (ctype2) ctype2.focus(); } catch (e) { }
          }
          return; // block the upload flow
        }
      }
    } catch (e) {
      // if anything unexpected fails, don't block upload — fail-safe
      console.warn('manual-mode upload guard error', e);
    }
    // ======= end BLOCK =======

    pickedFile = file;

    // show filename & info  
    if (fname) fname.textContent = file.name || '';
    if (finfo) finfo.textContent = `${(file.size / 1024).toFixed(1)} KB • ${file.type || 'unknown'}`;

    // also mirror into meta placeholders (so visible File details update)  
    const metaFilename = document.getElementById('metaFilename');
    const metaMime = document.getElementById('metaMime');
    const metaSize = document.getElementById('metaSize');
    if (metaFilename) metaFilename.textContent = file.name || '—';
    if (metaMime) metaMime.textContent = file.type || '—';
    if (metaSize) metaSize.textContent = `${(file.size / 1024).toFixed(1)} KB` || '—';

    // create thumbnail if image  
    const lower = (file.name || '').toLowerCase();
    if (thumb2 && /\.(jpg|jpeg|png|tiff|tif)$/.test(lower)) {
      const reader = new FileReader();
      reader.onload = ev => {
        thumb2.src = ev.target.result;
        thumb2.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      // === DICOM placeholder handling (use EXACT Image2.png) ===
      if (/\.dcm$/.test(lower)) {
        // <-- replace existing DICOM branch with the block below
        try {
          // ensure fileArea visible (use flex so centering works)
          if (fileArea) fileArea.style.display = 'flex';

          // remove normal preview box and enable dcm-mode (marker for CSS)
          if (uploadBlock) {
            uploadBlock.classList.remove('has-preview'); // important: remove default preview box
            uploadBlock.classList.add('dcm-mode');      // add marker so CSS can hide border/shadow
          }

          // mark fileArea so our CSS for placeholder applies
          if (fileArea) fileArea.classList.add('dcm-placeholder-fileArea');

          // local path you uploaded (exact file path used by the system)
          const placeholderPath = 'Image2.png';

          if (thumb2) {
            thumb2.src = placeholderPath;
            thumb2.alt = 'DICOM preview placeholder';
            thumb2.style.display = 'block';
            // prefer CSS to control size, but set safe inline fallbacks
            thumb2.style.width = thumb2.style.width || '85%';
            thumb2.style.maxWidth = thumb2.style.maxWidth || '520px';
            thumb2.style.objectFit = 'contain';
            // remove any framing classes on inner preview element if present
            try { fileArea.querySelector('.preview-frame')?.classList.remove('framed'); } catch (e) { }
          }

          // hide dropzone (we want the placeholder occupying preview area)
          if (dz) dz.style.display = 'none';

          if (finfo) finfo.textContent = (file.type || 'DICOM') + ' • preview unavailable (placeholder shown)';
          // ==== DICOM META FIX: ensure File Format shows ".dcm" (browser file.type may be empty) ====
          try {
            const ext = (file && file.name && file.name.includes('.')) ? file.name.split('.').pop().toLowerCase() : 'dcm';
            if (metaMime) metaMime.textContent = '.' + ext;
          } catch (e) {
            try { if (metaMime) metaMime.textContent = '.dcm'; } catch (e2) { }
          }

        } catch (err) {
          console.warn('DICOM placeholder failed', err);
          if (thumb2) thumb2.style.display = 'none';
          if (finfo) finfo.textContent += ' • DICOM preview unavailable';
        }
      } else {
        // fallback for non-image & non-dcm
        if (thumb2) thumb2.style.display = 'none';
        if (finfo) finfo.textContent += ' • Preview unavailable';
      }

    }



    // Show preview area (left column under Upload Image)  
    if (fileArea) fileArea.style.display = 'block';

    // Hide dropzone so preview appears under the Upload heading  
    if (dz) dz.style.display = 'none';

    // Add runtime class on upload-block so injected CSS applies globally  
    if (uploadBlock) uploadBlock.classList.add('has-preview');
    // 👇 ye nayi line yahin lagani hai
    document.querySelector('.upload-heading')?.classList.toggle('preview-active', uploadBlock.classList.contains('has-preview'));

    // --- NEW: Visual-only right-align of uploadBlock when preview active (no DOM move) ---
    (function visuallyRightAlignUploadBlock() {
      try {
        if (!uploadBlock) return;
        if (uploadBlock.__previewRightActive) return;
        uploadBlock.__previewRightActive = true;
        // store previous inline styles
        uploadBlock.__cv_prev_styles = {
          maxWidth: uploadBlock.style.maxWidth || '',
          margin: uploadBlock.style.margin || '',
          boxSizing: uploadBlock.style.boxSizing || ''
        };
        // apply preview-right class and minimal inline tweaks
        uploadBlock.classList.add('preview-right');
        uploadBlock.style.maxWidth = uploadBlock.style.maxWidth || '760px';
        // attempt to push visually to right in normal flow
        uploadBlock.style.margin = uploadBlock.style.margin || '0 0 20px auto';
        uploadBlock.style.boxSizing = uploadBlock.style.boxSizing || 'border-box';

        // ensure fileArea is centered inside uploadBlock
        const fileAreaLocal = uploadBlock.querySelector('#fileArea');
        if (fileAreaLocal) {
          // store previous margin if needed
          fileAreaLocal.__cv_prev_margin = fileAreaLocal.style.margin || '';
          fileAreaLocal.style.margin = fileAreaLocal.style.margin || '0 auto';
        }
      } catch (e) {
        console.warn('visuallyRightAlignUploadBlock failed', e);
      }
    })();



    // Move the Analyze button to sit next to Clear button (specific to provided HTML)
    (function moveAnalyzeBesideClear() {
      try {
        if (!analyze2) return;
        const br = document.querySelector('.upload-block .button-row');

        // save originals (first time)
        if (br && !originalButtonRowParent) {
          originalButtonRowParent = br.parentNode;
          originalButtonRowNextSibling = br.nextSibling || null;
        }
        if (analyze2 && !analyzeOriginalParent) {
          analyzeOriginalParent = analyze2.parentNode;
          analyzeOriginalNextSibling = analyze2.nextSibling || null;
        }

        // find the wrapper that contains #clear2
        const clearWrap = clear2 ? clear2.parentNode : null;
        const fileAreaLocal = document.querySelector('.upload-block.has-preview #fileArea') || document.getElementById('fileArea');

        if (!clearWrap) {
          // fallback: append .button-row into fileArea and center it
          if (br && fileAreaLocal && br.parentNode !== fileAreaLocal) {
            try { br.parentNode && br.parentNode.removeChild(br); } catch (e) { }
            fileAreaLocal.appendChild(br);
          }
          if (br) {
            br.style.display = 'flex';
            br.style.justifyContent = 'center';
            br.style.alignItems = 'center';
            br.style.gap = '16px';
            br.style.marginTop = '12px';
          }
          return;
        }

        // Make clearWrap a centered flex container
        try {
          clearWrap.style.display = 'flex';
          clearWrap.style.flexWrap = 'nowrap';
          clearWrap.style.alignItems = 'center';
          clearWrap.style.justifyContent = 'center';
          clearWrap.style.gap = '12px';
          clearWrap.style.margin = '0 auto';
        } catch (e) { /* ignore */ }

        // Hide spacer if present
        let spacer = null;
        Array.from(clearWrap.children).forEach(ch => {
          try {
            const cs = getComputedStyle(ch);
            if (ch !== clear2 && (cs.flexGrow === '1' || cs.flex === '1' || cs.flex === '1 1 auto')) {
              spacer = ch;
            }
          } catch (e) { }
        });
        if (spacer) {
          spacer.__cv_prev_display = spacer.style.display || '';
          spacer.__cv_prev_flex = spacer.style.flex || '';
          spacer.style.display = 'none';
          spacer.__cv_hidden_for_preview = true;
        }

        // Insert analyze2 next to clear2 (before spacer if present)
        if (analyze2.parentNode && analyze2.parentNode !== clearWrap) {
          try { analyze2.parentNode.removeChild(analyze2); } catch (e) { }
        }

        if (spacer) {
          clearWrap.insertBefore(analyze2, spacer);
        } else {
          if (clear2.nextSibling) clearWrap.insertBefore(analyze2, clear2.nextSibling);
          else clearWrap.appendChild(analyze2);
        }

        // Style analyze2 inline (non-invasive)
        try {
          analyze2.style.display = 'inline-flex';
          analyze2.style.verticalAlign = 'middle';
          analyze2.style.margin = '0';
          analyze2.style.padding = '12px 28px';
          analyze2.style.borderRadius = '999px';
          analyze2.style.fontWeight = '600';
          analyze2.style.cursor = 'pointer';
        } catch (e) { /* ignore */ }

        // Hide original .button-row to avoid duplicates
        if (br) {
          try { br.style.display = 'none'; } catch (e) { }
        }
      } catch (err) {
        // silent fallback - ensure analyze visible somewhere
        try {
          const fallback = document.querySelector('.upload-block.has-preview #fileArea') || document.getElementById('fileArea');
          if (fallback && analyze2 && analyze2.parentNode !== fallback) {
            try { analyze2.parentNode.removeChild(analyze2); } catch (e) { }
            fallback.appendChild(analyze2);
            analyze2.style.display = 'inline-flex';
          }
        } catch (e) { }
      }
    })();

    // Update the analyze button state visually (enabled because file exists)  
    updateAnalyzeState();
  }

  /**
* resetFile(doScroll = true)
* - clears file state, hides preview & shows dropzone back
* - if doScroll === false then do NOT perform the post-reset scroll/focus to firstName
*/
  function resetFile(doScroll = true, preserveMode = null) {
    // --- STOP ALL TRANSITIONS INSTANTLY on CLEAR ---
    const ub = document.querySelector('.upload-block');
    if (ub) {
      ub.style.transition = 'none';
      ub.style.transform = 'none';
    }

    pickedFile = null;
    if (fileInp) fileInp.value = '';
    if (fileArea) fileArea.style.display = 'none';
    if (thumb2) { thumb2.src = ''; thumb2.style.display = 'none'; }
    if (fname) fname.textContent = '';
    if (finfo) finfo.textContent = '';
    if (res2) res2.innerHTML = '';

    // hide file details values  
    const metaFilename = document.getElementById('metaFilename');
    const metaMime = document.getElementById('metaMime');
    const metaSize = document.getElementById('metaSize');
    if (metaFilename) metaFilename.textContent = '—';
    if (metaMime) metaMime.textContent = '—';
    if (metaSize) metaSize.textContent = '—';

    // show dropzone again  
    if (dz) {
      try {
        // only show dropzone if upload block is visible (it will be visible when mandatory details are filled)
        if (uploadBlock && uploadBlock.style.display === 'none') {
          // leave hidden (user hasn't filled mandatory details)
        } else {
          dz.style.display = 'block';
        }
      } catch (e) {
        dz.style.display = 'block';
      }
    }

    if (uploadBlock) uploadBlock.classList.remove('has-preview');
    if (uploadBlock) uploadBlock.classList.remove('dcm-mode');



    try { if (fileArea) fileArea.classList.remove('dcm-placeholder-fileArea'); } catch (e) { }
    // 👇 ye nayi line yahin lagani hai
    document.querySelector('.upload-heading')?.classList.toggle('preview-active', uploadBlock.classList.contains('has-preview'));

    // --- NEW: remove preview-right class and restore inline styles (if we set them) ---
    (function removeVisualRightAlign() {
      try {
        if (!uploadBlock) return;
        if (!uploadBlock.__previewRightActive) return;
        uploadBlock.classList.remove('preview-right');
        // restore previous inline styles if stored
        try {
          const prev = uploadBlock.__cv_prev_styles || {};
          uploadBlock.style.maxWidth = (typeof prev.maxWidth !== 'undefined') ? prev.maxWidth : '';
          uploadBlock.style.margin = (typeof prev.margin !== 'undefined') ? prev.margin : '';
          uploadBlock.style.boxSizing = (typeof prev.boxSizing !== 'undefined') ? prev.boxSizing : '';
          delete uploadBlock.__cv_prev_styles;
        } catch (e) { /* ignore */ }
        delete uploadBlock.__previewRightActive;

        // restore fileArea margin if we changed it
        try {
          const fileAreaLocal = uploadBlock.querySelector('#fileArea');
          if (fileAreaLocal && typeof fileAreaLocal.__cv_prev_margin !== 'undefined') {
            fileAreaLocal.style.margin = fileAreaLocal.__cv_prev_margin || '';
            delete fileAreaLocal.__cv_prev_margin;
          } else if (fileAreaLocal) {
            fileAreaLocal.style.margin = '';
          }
        } catch (e) { /* ignore */ }
      } catch (e) {
        console.warn('removeVisualRightAlign failed', e);
      }
    })();

    // restore any spacer we hid earlier  
    try {
      const clearWrap = clear2 && clear2.parentNode;
      if (clearWrap) {
        Array.from(clearWrap.children).forEach(ch => {
          if (ch.__cv_hidden_for_preview) {
            ch.style.display = ch.__cv_prev_display || '';
            ch.style.flex = ch.__cv_prev_flex || '';
            delete ch.__cv_hidden_for_preview;
            delete ch.__cv_prev_display;
            delete ch.__cv_prev_flex;
          }
        });
      }
    } catch (e) { /* ignore */ }

    // restore Analyze back to original place (under .button-row) and restore any styles  
    (function restoreAnalyzePosition() {
      if (!analyze2) return;
      try {
        if (analyzeOriginalParent) {
          if (analyze2.parentNode && analyze2.parentNode.contains(analyze2)) {
            analyze2.parentNode.removeChild(analyze2);
          }
          if (analyzeOriginalNextSibling && analyzeOriginalNextSibling.parentNode === analyzeOriginalParent) {
            analyzeOriginalParent.insertBefore(analyze2, analyzeOriginalNextSibling);
          } else {
            analyzeOriginalParent.appendChild(analyze2);
          }
        } else {
          const br = document.querySelector('.upload-block .button-row');
          if (br) {
            if (analyze2.parentNode && analyze2.parentNode.contains(analyze2)) {
              analyze2.parentNode.removeChild(analyze2);
            }
            br.appendChild(analyze2);
          }
        }
        // clear inline styles we added  
        try {
          analyze2.style.display = '';
          analyze2.style.verticalAlign = '';
          analyze2.style.margin = '';
          analyze2.style.padding = '';
          analyze2.style.borderRadius = '';
          analyze2.style.fontWeight = '';
          analyze2.style.cursor = '';
        } catch (e) { }
        analyzeOriginalParent = null;
        analyzeOriginalNextSibling = null;
      } catch (err) { /* ignore */ }
    })();

    // restore .button-row location if we stored it
    (function moveButtonRowBack() {
      const br = document.querySelector('.upload-block .button-row');
      if (!br || !originalButtonRowParent) return;
      br.classList.remove('inline-move');
      ['display', 'alignItems', 'gap', 'marginTop', 'marginLeft', 'verticalAlign', 'transform', 'position', 'top', 'left', 'right'].forEach(k => { try { br.style[k] = ''; } catch (e) { } });
      try {
        if (originalButtonRowNextSibling && originalButtonRowNextSibling.parentNode === originalButtonRowParent) {
          originalButtonRowParent.insertBefore(br, originalButtonRowNextSibling);
        } else {
          originalButtonRowParent.appendChild(br);
        }
      } catch (err) {
        try { originalButtonRowParent.appendChild(br); } catch (e) { /* ignore */ }
      }
    })();

    updateAnalyzeState();

    // Also sync file-details to current mode (in case clear changed selections)
    try { syncFileDetailsToMode(); } catch (e) { }

    // ---- NEW: reset detection options when Clear is clicked ----
    try {
      if (typeof preserveMode === 'string') {
        try { setMode(preserveMode); } catch (e) { }
      } else {
        try { setMode('auto'); } catch (e) { }
      }


      // clear multi-select chips / hidden input
      try {
        if (window.__cv_debug && typeof window.__cv_debug.clearCtype === 'function') {
          window.__cv_debug.clearCtype();
        } else {
          const hidden = document.getElementById('ctype2_values');
          if (hidden) hidden.value = '';
          if (ctype2) try { ctype2.value = ''; ctype2.disabled = true; } catch (e) { }
          const selWrap = document.getElementById('ctypeSelected');
          if (selWrap) selWrap.innerHTML = '';
        }
      } catch (e) { /* ignore */ }

      // reset file-details selects to their default states
      try {
        if (organSelect) {
          // set to blank / placeholder
          const first = Array.from(organSelect.options)[0];
          if (first) organSelect.value = first.value || '';
          organSelect.disabled = true;
        }
        if (subtypeSelect) {
          subtypeSelect.innerHTML = '<option value="">— Select—</option>';
          subtypeSelect.disabled = true;
        }
        if (groundTruthSelect) {
          // prefer 'unknown' option if present, else fallback to first
          const unk = Array.from(groundTruthSelect.options).find(o => o.value === 'unknown' || o.text.toLowerCase().includes('unknown'));
          if (unk) groundTruthSelect.value = unk.value;
          else {
            const gfirst = Array.from(groundTruthSelect.options)[0];
            if (gfirst) groundTruthSelect.value = gfirst.value || '';
          }
          groundTruthSelect.disabled = false;
        }
        if (sourceSelect) {
          const sfirst = Array.from(sourceSelect.options)[0];
          if (sfirst) sourceSelect.value = sfirst.value || '';
        }
      } catch (e) { /* ignore */ }

      // --- NEW: after reset, scroll to First Name and focus (same behavior as Start Detection button) ---
      if (doScroll !== false) {
        try {
          const firstNameInput = document.getElementById('firstName');
          if (firstNameInput) {
            const smallScreen = window.innerWidth < 900;
            const yOffset = smallScreen ? -120 : -250;
            const y = firstNameInput.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: Math.max(0, Math.floor(y)), behavior: 'smooth' });
            setTimeout(() => {
              try { firstNameInput.focus({ preventScroll: true }); } catch (err) { firstNameInput.focus(); }
            }, 550);
          }
        } catch (e) { /* ignore */ }
      }
      // --- end new scroll/focus ---
    } catch (e) { /* ignore overall */ }
    // ---- end reset detection options ----

    updateAnalyzeState();

    // Also sync file-details to current mode (in case clear changed selections)
    try { syncFileDetailsToMode(); } catch (e) { }
  }

  /* resetPatientDetails: clears patient inputs and updates UI/validation */
  function resetPatientDetails() {
    try {
      const ids = ['firstName', 'lastName', 'age2', 'gender2', 'bp2', 'sugar2', 'hb2'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        try { el.value = ''; } catch (e) { }
        try { clearInputError(el); } catch (e) { }
        try { removeFieldChip(el); } catch (e) { }
      });

      try {
        const ageWrap = document.querySelector('.age-input-wrap');
        if (ageWrap) {
          const badge = ageWrap.querySelector('.age-badge.field-chip');
          if (badge) badge.remove();
        }
      } catch (e) { }

      try { validateFirstName(); validateLastName(); validateAge2(); validateGender(); validateBP(); validateSugar(); validateHB(); } catch (e) { }
      try { updateDetectionAvailability(); } catch (e) { }
      try { setMode('auto'); } catch (e) { }
    } catch (err) { console.warn('resetPatientDetails error', err); }
  }


  (function installHeadingSwap() {
    const uploadBlock = document.querySelector('.upload-block');
    if (!uploadBlock) return;

    // try to find heading inside uploadBlock first, else find global heading with exact text
    function findHeading() {
      if (uploadBlock) {
        const local = uploadBlock.querySelector('h1,h2,h3,h4,.upload-title,.upload-heading');
        if (local) return local;
      }
      const all = document.querySelectorAll('h1,h2,h3,h4,span,label,div');
      for (const el of all) {
        const txt = (el.textContent || '').trim();
        if (/^Upload Image$/i.test(txt)) return el;
      }
      return null;
    }

    let heading = findHeading();
    const original = { text: '', textAlign: '', marginTop: '', marginBottom: '', parent: null, nextSibling: null };
    if (heading) {
      original.text = heading.textContent;
      original.textAlign = heading.style.textAlign || '';
      original.marginTop = heading.style.marginTop || '';
      original.marginBottom = heading.style.marginBottom || '';
      original.parent = heading.parentNode;
      original.nextSibling = heading.nextSibling || null;
    }

    function applyPreviewHeading() {
      // Prevent heading-swap during short-lived clear suppression window
      if (window.__cv_skip_heading_swap) return;
      heading = heading || findHeading();
      if (!heading) return;

      // mark it as a preview-heading so CSS can target it reliably
      try {
        heading.dataset.previewHeading = '1';
        // ensure it's hidden initially to avoid flashes while being moved
        heading.style.visibility = 'hidden';
        heading.style.opacity = '0';
        heading.style.transition = 'none';
      } catch (e) { /* ignore */ }

      // change text + center
      heading.textContent = 'Preview Uploaded Image';
      heading.style.textAlign = 'center';
      heading.style.marginTop = heading.style.marginTop || '12px';
      heading.style.marginBottom = heading.style.marginBottom || '12px';

      // move heading inside uploadBlock just before #fileArea so it's visually over the preview
      try {
        const fileArea = uploadBlock.querySelector('#fileArea');
        if (fileArea && heading.parentNode !== uploadBlock) {
          uploadBlock.insertBefore(heading, fileArea);
        }
      } catch (e) { /* non-fatal */ }

      // small async unblock: let CSS show it *only* when .has-preview is present (CSS handles visibility)
      // but as an extra safeguard, remove the inline hidden after a tick so CSS controls it
      requestAnimationFrame(() => {
        try {
          // keep inline none for a very short time, then remove so CSS rules take over
          setTimeout(() => {
            heading.style.transition = '';
            heading.style.visibility = '';
            heading.style.opacity = '';
          }, 40);
        } catch (e) { }
      });
    }

    function restoreOriginalHeading() {
      // if suppression active, skip restore now (will be restored once suppression cleared)
      if (window.__cv_skip_heading_swap) {
        // schedule a gentle retry after suppression window just in case
        setTimeout(() => {
          try { restoreOriginalHeading(); } catch (e) { /* ignore */ }
        }, 420);
        return;
      }

      heading = heading || findHeading();
      if (!heading) return;

      // restore text & spacing
      heading.textContent = original.text || heading.textContent;
      heading.style.textAlign = original.textAlign || '';
      heading.style.marginTop = original.marginTop || '';
      heading.style.marginBottom = original.marginBottom || '';

      // remove our marker so CSS no longer targets it
      try {
        delete heading.dataset.previewHeading;
        // remove any inline hidden left behind
        heading.style.visibility = '';
        heading.style.opacity = '';
        heading.style.transition = '';
      } catch (e) { /* ignore */ }

      // attempt to restore original DOM position
      try {
        if (original.parent) {
          if (original.nextSibling && original.nextSibling.parentNode === original.parent) {
            original.parent.insertBefore(heading, original.nextSibling);
          } else {
            original.parent.appendChild(heading);
          }
        }
      } catch (e) { /* ignore */ }
    }



    // small helper: true when preview UI is actually active
    function hasPreviewActive() {
      try {
        const uploadBlockLocal = document.querySelector('.upload-block');
        const fileAreaLocal = document.getElementById('fileArea');
        // pickedFile may be in outer scope — use if available
        const pf = (typeof pickedFile !== 'undefined') ? pickedFile : null;
        return !!(
          (uploadBlockLocal && uploadBlockLocal.classList && uploadBlockLocal.classList.contains('has-preview')) ||
          pf ||
          (fileAreaLocal && fileAreaLocal.style && fileAreaLocal.style.display && fileAreaLocal.style.display !== 'none')
        );
      } catch (e) {
        return false;
      }
    }

    // Hook into existing handleFile/resetFile (wrap them)
    try {
      if (typeof handleFile === 'function') {
        const _hf = handleFile;
        handleFile = function (file) {
          const r = _hf.apply(this, arguments);

          // schedule guarded heading swap after original handler finishes
          requestAnimationFrame(() => {
            setTimeout(() => {
              try {
                if (hasPreviewActive()) {
                  // only change heading if preview actually present
                  try { applyPreviewHeading(); } catch (e) { /* ignore */ }
                } else {
                  // no preview -> do nothing (prevents unwanted heading change)
                }
              } catch (e) { /* non-fatal */ }
            }, 40);
          });

          return r;
        };
      }
    } catch (e) { console.warn('headingSwap hook handleFile failed', e); }

    try {
      if (typeof resetFile === 'function') {
        const _rf = resetFile;
        resetFile = function (doScroll) {
          const r = _rf.apply(this, arguments);
          requestAnimationFrame(() => setTimeout(restoreOriginalHeading, 40));
          return r;
        };
      }
    } catch (e) { console.warn('headingSwap hook resetFile failed', e); }

    // expose for debug
    try {
      window.__cv_debug = window.__cv_debug || {};
      window.__cv_debug.applyPreviewHeading = applyPreviewHeading;
      window.__cv_debug.restoreOriginalHeading = restoreOriginalHeading;
      window.__cv_debug.hasPreviewActive = hasPreviewActive;
    } catch (e) { }
  })();


  /* -----------------------
     Validations: age, names, bp, sugar, hb, gender  
     ----------------------- */
  function showInputError(el, msg) {
    if (!el || !el.parentNode) return;
    let e = el.parentNode.querySelector('.input-error');
    if (!e) {
      e = document.createElement('small');
      e.className = 'input-error';
      e.style.color = '#c0392b';
      e.style.display = 'block';
      e.style.fontSize = '12px';
      el.parentNode.appendChild(e);
    }
    e.textContent = msg;
  }
  function clearInputError(el) {
    if (!el || !el.parentNode) return;
    const e = el.parentNode.querySelector('.input-error');
    if (e) e.remove();
  }// set per-row open gap (px string like "120px" or "320px")
  // priority: meta-row[data-open-gap] -> gapMap by selectId -> heuristics by label text -> fallback
  function setMetaRowGap(metaRow, selectId) {
    try {
      if (!metaRow) return;

      // 1️⃣ Priority #1: data attribute (if present, overrides all)
      const attr = metaRow.getAttribute && metaRow.getAttribute('data-open-gap');
      if (attr) {
        const px = String(attr).trim().endsWith('px')
          ? String(attr).trim()
          : `${String(attr).trim()}px`;
        metaRow.style.setProperty('--open-gap', px);
        metaRow.style.setProperty(
          '--open-gap-mobile',
          parseInt(px, 10) > 200 ? '120px' : '90px'
        );
        return;
      }

      // 2️⃣ Priority #2: explicit map for known selects
      const gapMap = {
        sourceSelect: '220px',        // smaller gap for Source
        organSelect: '270px',         // medium-large gap for Organ
        groundTruthSelect: '220px',   // mid gap for Ground Truth
        subtypeSelect: '320px'        // optional extra dropdown
      };

      if (selectId && gapMap[selectId]) {
        const gap = gapMap[selectId];
        metaRow.style.setProperty('--open-gap', gap);
        metaRow.style.setProperty(
          '--open-gap-mobile',
          parseInt(gap, 10) > 200 ? '120px' : '90px'
        );
        return;
      }

      // 3️⃣ Priority #3: heuristic fallback by label text (safety net)
      const txt = (metaRow.textContent || '').toLowerCase();
      if (txt.includes('source')) {
        metaRow.style.setProperty('--open-gap', '150px');
        metaRow.style.setProperty('--open-gap-mobile', '90px');
      } else if (txt.includes('organ')) {
        metaRow.style.setProperty('--open-gap', '300px');
        metaRow.style.setProperty('--open-gap-mobile', '120px');
      } else if (txt.includes('ground')) {
        metaRow.style.setProperty('--open-gap', '220px');
        metaRow.style.setProperty('--open-gap-mobile', '100px');
      } else {
        // fallback
        metaRow.style.setProperty('--open-gap', '220px');
        metaRow.style.setProperty('--open-gap-mobile', '90px');
      }
    } catch (e) {
      console.warn('setMetaRowGap failed', e);
    }
  }


  /* ---------- chip helpers (paste once near other helpers) ---------- */
  function showFieldChip(el, message, opts = {}) {
    try {
      if (!el) return;
      let wrap = el.closest('.age-input-wrap') || el.parentElement;
      if (!wrap) wrap = el.parentElement || document.body;
      try { if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative'; } catch (e) { wrap.style.position = 'relative'; }
      let chip = wrap.querySelector('.field-chip.age-badge');
      if (!chip) {
        chip = document.createElement('span');
        chip.className = 'age-badge field-chip';
        try {
          if (el.nextSibling) el.parentNode.insertBefore(chip, el.nextSibling);
          else el.parentNode.appendChild(chip);
        } catch (e) { wrap.appendChild(chip); }
        chip.style.position = 'absolute';
        chip.style.right = '12px';
        chip.style.top = '50%';
        chip.style.transform = 'translateY(-35%)';
        chip.style.pointerEvents = 'none';
        chip.style.zIndex = 6;
        chip.style.display = 'inline-block';
        chip.style.whiteSpace = 'nowrap';
      }
      chip.textContent = message || '';
      if (opts.color) chip.style.background = opts.color;
      if (opts.textColor) chip.style.color = opts.textColor;
      chip.style.opacity = '1';
      chip.style.visibility = 'visible';
    } catch (e) { console.warn('showFieldChip failed', e); }
  }

  function removeFieldChip(el) {
    try {
      if (!el) return;
      const wrap = el.closest('.age-input-wrap') || el.parentElement || null;
      if (!wrap) return;
      const chip = wrap.querySelector('.field-chip.age-badge');
      if (chip) chip.remove();
    } catch (e) { console.warn('removeFieldChip failed', e); }
  }

  const nameRegex = /^[A-Za-z\u00C0-\u024F.'\-\s]+$/;
  const letterRegex = /[A-Za-z\u00C0-\u024F]/;
  const bpRegex = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})(\s*mmhg)?\s*$/i;
  const sugarRegex = /^\s*(\d{1,3}(?:\.\d{1,2})?)(\s*mg\/dl)?\s*$/i;
  const hbRegex = /^\s*(\d{1,2}(?:\.\d{1,2})?)\s*(g\/dL)?\s*$/i;

  function validateFirstName() {
    const el = document.getElementById('firstName');
    if (!el) return true;
    const v = (el.value || '').trim();
    // your original validation
    if (!v) {
      showInputError(el, 'First name required');
      // show chip (red-ish) but keep original error text
      showFieldChip(el, 'Required', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    if (!nameRegex.test(v) || !letterRegex.test(v)) {
      showInputError(el, 'Invalid name');
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    clearInputError(el);
    removeFieldChip(el);
    return true;
  }

  function validateLastName() {
    const el = document.getElementById('lastName');
    if (!el) return true;
    const v = (el.value || '').trim();
    if (v === '.') { clearInputError(el); removeFieldChip(el); return true; }
    if (!v) {
      showInputError(el, 'Last name required (or use . if none)');
      showFieldChip(el, 'Required', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    if (!nameRegex.test(v) || !letterRegex.test(v)) {
      showInputError(el, 'Invalid last name');
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    clearInputError(el);
    removeFieldChip(el);
    return true;
  }



  function validateAge2() {
    if (!age2) return true;
    const raw = (age2.value || '').trim();
    const normalized = raw.replace(',', '.');

    // empty -> invalid (required)
    if (!normalized) {
      if (age2err) {
        age2err.style.display = 'block';
        age2err.textContent = 'Enter valid age: 0.1–0.9 for infants, or whole years 1–130.';
      }
      return false;
    }

    // infant: exactly one decimal digit 0.[1-9]
    const infantRegex = /^0\.[1-9]$/;
    if (infantRegex.test(normalized)) {
      if (age2err) age2err.style.display = 'none';
      return true;
    }

    // whole-year: integer in 1..130 (no decimals)
    // allow numeric strings like "1", "45", "130" but reject "01", "1.0", "1.2"
    const n = Number(normalized);
    const isIntegerString = /^[1-9]\d*$/.test(normalized); // prevents leading zeros
    if (isIntegerString && Number.isInteger(n) && n >= 1 && n <= 130) {
      if (age2err) age2err.style.display = 'none';
      return true;
    }

    // otherwise invalid
    if (age2err) {
      age2err.style.display = 'block';
      age2err.textContent = 'Enter valid age: 0.1–0.9 for infants (months), or whole years 1–130. Use single decimal for months (e.g. 0.5 = 6 months).';
    }
    return false;
  }


  // --- Age badge logic: add a small right-side label inside age input wrapper ---
  (function installAgeBadge() {
    try {
      if (!age2) return;

      // ensure parent wrapper exists and has relative positioning
      let wrap = age2.closest('.age-input-wrap') || age2.parentElement;
      if (!wrap) return;
      wrap.classList.add('age-input-wrap');

      // create badge if not present
      let badge = wrap.querySelector('.age-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'age-badge';
        badge.setAttribute('aria-hidden', 'true');
        wrap.appendChild(badge);
      }

      // compute label for given normalized input
      function ageLabelFor(normalized) {
        if (!normalized) return { text: '', cls: '' };

        // single-decimal infant form: 0.[1-9] -> months 1..9
        const decMatch = String(normalized).match(/^0\.([1-9])$/);
        if (decMatch) {
          const months = Math.round(parseFloat(normalized) * 12);
          const monText = months === 1 ? '1 month' : `${months} months`;
          return { text: `Infant — ${monText}`, cls: 'age--infant' };
        }

        // whole years only allowed here (1..130)
        const n = Number(normalized);
        if (!Number.isInteger(n) || n < 1 || n > 130) return { text: '', cls: '' };

        if (n < 13) return { text: `${n} yr — Child`, cls: 'age--child' };
        if (n < 60) return { text: `${n} yr — Adult`, cls: 'age--adult' };
        return { text: `${n} yr — Senior`, cls: 'age--senior' };
      }

      function updateBadge() {
        const raw = (age2.value || '').trim();
        if (!raw) {
          badge.textContent = '';
          badge.className = 'age-badge';
          badge.style.display = 'none';
          return;
        }

        // normalize: accept comma as decimal separator
        const normalized = raw.replace(',', '.');

        // validity tests (must match validateAge2 rules)
        const isInfantDecimal = /^0\.[1-9]$/.test(normalized);
        const n = Number(normalized);
        const isWholeYear = Number.isInteger(n) && n >= 1 && n <= 130;

        // hide badge for invalid / fractional-year / multi-decimal inputs
        if (!(isInfantDecimal || isWholeYear)) {
          badge.textContent = '';
          badge.className = 'age-badge';
          badge.style.display = 'none';
          return;
        }

        const info = ageLabelFor(normalized);
        if (!info.text) {
          badge.style.display = 'none';
          return;
        }
        badge.textContent = info.text;
        badge.className = 'age-badge ' + info.cls;
        badge.style.display = 'block';
      }

      age2.addEventListener('input', updateBadge);
      age2.addEventListener('change', updateBadge);
      age2.addEventListener('blur', updateBadge);
      updateBadge();
    } catch (e) {
      console.warn('installAgeBadge failed', e);
    }
  })();



  function validateBP() {
    if (!bp2) return true;
    const el = bp2; const v = (el.value || '').trim();
    if (!v) { clearInputError(el); removeFieldChip(el); return true; } // optional field -> valid when empty
    const m = bpRegex.exec(v);
    if (!m) {
      showInputError(el, 'Enter BP as Systolic/Diastolic (e.g., 120/80)');
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    const sys = +m[1], dia = +m[2];
    if (sys < 50 || sys > 300 || dia < 30 || dia > 200 || dia >= sys) {
      showInputError(el, 'Blood pressure value appears out of normal range. Please recheck.');
      showFieldChip(el, 'Out of range', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    clearInputError(el); removeFieldChip(el); return true;
  }

  function validateSugar() {
    if (!sugar2) return true;
    const el = sugar2; const v = (el.value || '').trim();
    if (!v) { clearInputError(el); removeFieldChip(el); return true; } // optional
    const m = sugarRegex.exec(v);
    if (!m) {
      showInputError(el, 'Enter blood sugar numeric (e.g., 95)');
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    const val = +m[1];
    if (val < 20 || val > 1000) {
      showInputError(el, 'Blood sugar value appears unrealistic. Please verify the entry.');
      showFieldChip(el, 'Out of range', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    clearInputError(el); removeFieldChip(el); return true;
  }


  function validateHB() {
    if (!hb2) return true;
    const el = hb2; const v = (el.value || '').trim();
    if (!v) { clearInputError(el); removeFieldChip(el); return true; } // optional
    const m = hbRegex.exec(v);
    if (!m) {
      showInputError(el, 'Enter haemoglobin in g/dL (e.g., 13.5)');
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    const val = +m[1];
    if (val < 3 || val > 30) {
      showInputError(el, 'Haemoglobin value appears outside the normal range. Please recheck.');
      showFieldChip(el, 'Out of range', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }
    clearInputError(el); removeFieldChip(el); return true;
  }

  function validateGender() {
    if (!gender2) return true;
    const v = (gender2.value || '').trim();
    if (!v) { showInputError(gender2, 'Please select gender'); return false; }
    clearInputError(gender2);
    return true;
  }

  // attach listeners
  ['firstName', 'lastName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { validateFirstName(); validateLastName(); updateAnalyzeState(); updateDetectionAvailability(); });
  });
  if (age2) age2.addEventListener('input', () => { validateAge2(); updateAnalyzeState(); updateDetectionAvailability(); });
  [bp2, sugar2, hb2].forEach(el => { if (el) el.addEventListener('input', () => { validateBP(); validateSugar(); validateHB(); updateAnalyzeState(); }); });
  if (gender2) gender2.addEventListener('change', () => { validateGender(); updateAnalyzeState(); updateDetectionAvailability(); });

  /* -----------------------
     Age/Gender spacing behaviour (dropdown open/close)
     ----------------------- */
  (function setupAgeGenderSpacing() {
    if (!ageGenderRow || !gender2) return;
    ageGenderRow.style.transition = 'margin-bottom 0.28s ease';

    function openSpacing() {
      // Prevent double spacing clash
      if (!ageGenderRow.classList.contains('open-select')) {
        ageGenderRow.classList.add('open-age');
      }
    }
    function closeSpacing() {
      ageGenderRow.classList.remove('open-age');
    }

    gender2.addEventListener('focus', openSpacing);
    gender2.addEventListener('mousedown', openSpacing);
    gender2.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === ' ') openSpacing(); });
    gender2.addEventListener('change', closeSpacing);
    gender2.addEventListener('blur', () => setTimeout(closeSpacing, 50));
    gender2.addEventListener('keyup', e => { if (e.key === 'Escape') closeSpacing(); });
  })();
  /* -----------------------
     Analyze enable/disable & runtime validation
     ----------------------- */
  function canEnableAnalyzeButton() { return !!pickedFile; }

  function canRunAnalysis() {
    if (!pickedFile) return false;
    if (!validateAge2()) return false;
    if (!validateFirstName() || !validateLastName()) return false;
    if (!validateGender()) return false;
    if (!validateBP() || !validateSugar() || !validateHB()) return false;
    // modified to support multi-select: check hidden field/store instead of native select value  
    if (currentMode === 'manual') {
      const hidden = document.getElementById('ctype2_values');
      const vals = hidden ? (hidden.value || '').trim() : '';
      if (!vals) return false;
    }
    return true;
  }

  function updateAnalyzeState() {
    if (!analyze2) return;
    const enabled = canEnableAnalyzeButton();
    analyze2.disabled = !enabled;
    analyze2.classList.toggle('disabled', !enabled);
    analyze2.style.opacity = enabled ? '1' : '0.6';
    analyze2.style.cursor = enabled ? 'pointer' : 'not-allowed';
  }

  if (analyze2) {
    analyze2.addEventListener('click', () => {
      // retain original validation behaviour (so user cannot open insights when form incomplete)
      const ok = canRunAnalysis();
      if (!ok) {
        validateAge2(); validateFirstName(); validateLastName(); validateGender(); validateBP(); validateSugar(); validateHB();
        return;
      }

      // Instead of running the old "analysis", open Insights section and hide detection/upload UI
      try {
        showInsights();
        // clear any transient analysis UI text
        if (res2) res2.innerHTML = '';
        // visually mark analyze button (optional)
        analyze2.blur();
      } catch (e) {
        console.warn('Opening insights failed', e);
      }
    });
  }

  /* -----------------------
     init
     ----------------------- */
  (function init() {
    const br = document.querySelector('.upload-block .button-row');
    if (br) {
      originalButtonRowParent = br.parentNode;
      originalButtonRowNextSibling = br.nextSibling || null;
    }
    if (analyze2 && !analyzeOriginalParent) {
      analyzeOriginalParent = analyze2.parentNode;
      analyzeOriginalNextSibling = analyze2.nextSibling || null;
    }

    if (ctypeWrap) {
      ctypeWrap.style.display = 'none';
      ctypeWrap.style.maxHeight = '0px';
      ctypeWrap.setAttribute('aria-hidden', 'true');
      ctypeWrap.style.pointerEvents = 'none';
      if (ctype2) ctype2.disabled = true;
    }
    if (fileArea) fileArea.style.display = 'none';
    if (dz) dz.style.display = 'block';
    if (uploadBlock) uploadBlock.classList.remove('has-preview');


    setDetectNoteMargin('30px');

    // NEW: start with detection controls & upload area HIDDEN until mandatory fields filled
    try {
      if (segAuto) segAuto.style.display = 'none';
      if (segManual) segManual.style.display = 'none';
      if (detectionHeading) detectionHeading.style.display = 'none';
      if (detectionNote) detectionNote.style.display = 'none';
      if (detectFunImg) detectFunImg.style.display = 'none';
      // hide the upload block (preferred) so both dropzone and preview are hidden
      if (uploadBlock) uploadBlock.style.display = 'none';
      else if (dz) dz.style.display = 'none';
      if (dz) {
        try { dz.setAttribute('aria-hidden', 'true'); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }

    setMode('auto');
    updateAnalyzeState();

    // ensure detection availability is evaluated if user reloads with fields prefilled
    updateDetectionAvailability();

    // show startup popup only when mandatory patient details are NOT filled
    try {
      if (!mandatoryDetailsFilled()) {
        // Prefer patient modal if installed, else keep your previous fallback behaviour
        if (window.__cv_patient_modal && typeof window.__cv_patient_modal.show === 'function') {
          // scroll to firstName before showing modal (this is the only change requested)
          const firstNameInput = document.getElementById('firstName');
          if (firstNameInput) {
            try {
              const smallScreen = window.innerWidth < 900;
              const yOffset = smallScreen ? -120 : -250;
              const y = firstNameInput.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: Math.max(0, Math.floor(y)), behavior: 'smooth' });
              // wait a bit for the scroll then focus+show modal
              setTimeout(() => {
                try { firstNameInput.focus({ preventScroll: true }); } catch (err) { firstNameInput.focus(); }
                try { window.__cv_patient_modal.show(); } catch (e) { /* ignore */ }
              }, 420);
            } catch (e) {
              // fallback if anything fails: just show modal
              try { window.__cv_patient_modal.show(); } catch (err) { /* ignore */ }
            }
          } else {
            try { window.__cv_patient_modal.show(); } catch (err) { /* ignore */ }
          }
        } else {
          const popupTitle = 'Patient details required';
          const popupMessage = 'Please fill in all mandatory patient details to begin the detection process.';

          if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
            window.__cv_toast.show({ title: popupTitle, message: popupMessage, timeout: 4200 });
          } else {
            (function createFallbackStartupModal() {
              if (document.getElementById('cv-startup-modal')) return;
              const css = `
                #cv-startup-modal { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:12000; }
                #cv-startup-modal .card { width:min(88%,760px); max-width:760px; background:linear-gradient(180deg,#07243a,#032235); color:#fff; border-radius:12px; padding:22px 28px; box-shadow:0 30px 80px rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.04); text-align:center; position:relative; }
                #cv-startup-modal h3{margin:0 0 8px;font-size:22px;font-weight:800}
                #cv-startup-modal p{margin:0;font-size:15px;opacity:0.95}
                #cv-startup-modal .close{position:absolute;right:18px;top:14px;background:transparent;border:0;color:rgba(255,255,255,0.9);font-size:20px;cursor:pointer}
                @media(max-width:560px){ #cv-startup-modal .card{padding:16px 12px;border-radius:10px} #cv-startup-modal h3{font-size:18px} #cv-startup-modal p{font-size:14px} }
              `;
              const style = document.createElement('style');
              style.id = 'cv-startup-modal-css';
              style.appendChild(document.createTextNode(css));
              document.head.appendChild(style);

              const wrap = document.createElement('div');
              wrap.id = 'cv-startup-modal';
              wrap.setAttribute('role', 'dialog');
              wrap.setAttribute('aria-modal', 'true');
              wrap.innerHTML = `
                <div class="card" role="document">
                  <button class="close" aria-label="Close">✕</button>
                  <h3>${popupTitle}</h3>
                  <p>${popupMessage}</p>
                </div>
              `;
              document.body.appendChild(wrap);

              const closeBtn = wrap.querySelector('.close');
              function removeModal() {
                try { wrap.remove(); } catch (e) { wrap.style.display = 'none'; }
                try { style.remove(); } catch (e) { /* ignore */ }
              }
              closeBtn.addEventListener('click', removeModal);
              wrap.addEventListener('click', (ev) => { if (ev.target === wrap) removeModal(); });

              // auto-hide after timeout
              setTimeout(removeModal, 4200);
            })();
          }
        }
      }
    } catch (e) { /* non-fatal */ }

  })();

  // === File-details selects spacing: behave like gender dropdown spacing ===
  (function installCustomCenteredSelects() {
    const replacedAttr = 'data-replace';
    const selector = `select[${replacedAttr}="centered"], #subtypeSelect`;

    // minimal CSS injection to control width + option list centering + gap transition
    if (!document.getElementById('cv-custom-select-css')) {
      const css = `
/* Consolidated fixed custom-select CSS - paste REPLACING the duplicate blocks */
.cv-custom-select {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  /* control the overall width here — change 320px to whatever you want */
  max-width: 320px; /* ensures select doesn't grow beyond this */
  width: 100%; /* will be at most max-width */
  box-sizing: border-box;
  transition: margin-bottom .28s ease;
}

/* visible button: full width of wrapper; arrow absolute at right */
.cv-custom-select .cv-selected {
  position: relative;
  display: block;
  width: 100%;
  padding: 10px 44px 10px 12px; /* space on right for arrow */
  border-radius: 8px;
  border: 1px solid #d8e2e8;
  font-weight: 600;
  cursor: pointer;
  background: #fff;
  box-sizing: border-box;
}

/* center the label text inside the button */
.cv-custom-select .cv-selected .cv-text {
  display: block;
  width: 100%;
  text-align: center;
  pointer-events: none; /* clicking hits the button */
}

/* arrow stays absolute at right so text remains centered */
.cv-custom-select .cv-selected .cv-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
}

/* dropdown: align exactly to wrapper left / same width as wrapper */
.cv-custom-select .cv-options {
  position: absolute;
  top: calc(100% + 8px); /* gap under the select; tweak if needed */
  left: 0; /* start at left edge of wrapper */
  width: 100%; /* same width as the select */
  box-sizing: border-box;
  z-index: 15000;
  border-radius: 10px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  display: none;
  padding: 6px 0;
  box-shadow: 0 12px 40px rgba(2,6,23,0.12);
  overflow: hidden;
}
.cv-custom-select.open .cv-options { display: block; }

/* options styling */
.cv-option {
  padding: 12px 18px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  text-align: center; /* keep options centered like you wanted */
}
.cv-option:hover, .cv-option[aria-selected="true"] { background: rgba(0,0,0,0.03); }

/* use JS-driven variable for open gap (per-select). JS will set --open-gap on the meta-row */
.meta-row.open-select { margin-bottom: var(--open-gap, 220px) !important; transition: margin-bottom .28s ease !important; }

@media (max-width:900px) {
  .cv-custom-select { display:block; max-width:100%; width:100%; }
  .cv-custom-select .cv-options { left:0; transform:none; width:100%; top: calc(100% + 6px); }
  .meta-row.open-select { margin-bottom: var(--open-gap-mobile, 90px) !important; }
}

`;
      const style = document.createElement('style');
      style.id = 'cv-custom-select-css';
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }

    function buildCustom(select) {
      if (!select || select.__cv_custom_installed) return;
      select.__cv_custom_installed = true;

      const wrapper = document.createElement('div');
      wrapper.className = 'cv-custom-select';
      wrapper.tabIndex = -1;

      const button = document.createElement('div');
      button.className = 'cv-selected';
      button.setAttribute('role', 'button');
      button.setAttribute('aria-haspopup', 'listbox');
      button.setAttribute('aria-expanded', 'false');

      const text = document.createElement('span');
      text.className = 'cv-text';
      text.textContent = select.options[select.selectedIndex]?.text || '— Select —';
      if (!text.textContent) text.classList.add('cv-placeholder');

      const arrow = document.createElement('span');
      arrow.className = 'cv-arrow';
      arrow.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#51606a" d="M7 10l5 5 5-5z"/></svg>`;

      button.append(text, arrow);

      const opts = document.createElement('div');
      opts.className = 'cv-options';
      opts.setAttribute('role', 'listbox');
      opts.tabIndex = -1;

      Array.from(select.options).forEach((o, idx) => {
        const item = document.createElement('div');
        item.className = 'cv-option';
        item.role = 'option';
        item.dataset.value = o.value;
        item.textContent = o.text;
        item.tabIndex = 0;
        if (o.selected) item.setAttribute('aria-selected', 'true');
        item.addEventListener('click', () => {
          select.selectedIndex = idx;
          text.textContent = o.text;
          // update aria-selected for options
          Array.from(opts.children).forEach(c => c.removeAttribute('aria-selected'));
          item.setAttribute('aria-selected', 'true');
          close();
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });
        opts.appendChild(item);
      });

      // visually hide native select but keep it in DOM for forms
      select.style.cssText = 'position:absolute;opacity:0;width:0;height:0;pointer-events:none;';

      // insert wrapper before original select then move select inside wrapper
      select.parentNode.insertBefore(wrapper, select);
      wrapper.append(select, button, opts);
      // reflect initial disabled state on wrapper (important)
      try {
        wrapper.classList.toggle('disabled', select.disabled);
        if (select.disabled) {
          button.setAttribute('aria-disabled', 'true');
          button.tabIndex = -1;
          // ensure options not focusable
          opts.querySelectorAll('.cv-option').forEach(o => o.tabIndex = -1);
        }
      } catch (e) { /* ignore */ }

      /* === ADDITION: force wrapper width to match computed select/button width so dropdown aligns ===
         This block fixes the left-shift issue by giving wrapper an explicit pixel width and
         ensuring .cv-options uses left:0 and width:100% (CSS already enforces that).
      */
      /* === REPLACEMENT: compute wrapper width from visible button, then hide native select safely === */
      /* === REPLACEMENT: compute wrapper width from visible button, then hide native select safely === */
      try {
        // prefer button width (reliable) — fallback to select computed or bounding rect
        const btnRect = button.getBoundingClientRect();
        let computedWidth = (btnRect && btnRect.width) ? `${Math.round(btnRect.width)}px` : '';

        if (!computedWidth) {
          const cs = window.getComputedStyle(select);
          if (cs && cs.width && cs.width !== '0px') computedWidth = cs.width;
          else {
            const rect = select.getBoundingClientRect();
            if (rect && rect.width) computedWidth = `${Math.round(rect.width)}px`;
          }
        }
        // final fallback
        if (!computedWidth) computedWidth = '320px';

        wrapper.style.width = computedWidth;
        wrapper.style.display = 'inline-block';

        // ensure options align to wrapper edges
        opts.style.left = '0';
        opts.style.transform = 'none';
        opts.style.width = '100%';
      } catch (e) {
        // non-fatal
      }

      // Now hide native select more robustly (after computing width)
      try {
        // keep in DOM but remove from accessibility/focus flow so browser native dropdown won't open
        select.style.position = 'absolute';
        select.style.opacity = '0';
        select.style.pointerEvents = 'none';
        select.tabIndex = -1;
        select.setAttribute('aria-hidden', 'true');
        select.style.visibility = 'hidden';
        select.style.width = '1px';
        select.style.height = '1px';
        select.style.left = '-9999px';
      } catch (e) { /* ignore */ }

      // find nearest meta-row for spacing behavior
      const metaRow = select.closest('.meta-row') || (select.parentElement ? select.parentElement.closest('.meta-row') : null);

      // set gap variable (call helper) so CSS var is ready before open
      try { setMetaRowGap(metaRow, select.id); } catch (e) { /* ignore */ }

      function open() {
        wrapper.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        // add open-select to nearest meta-row (so gap/spacing behaves like gender)
        if (metaRow) metaRow.classList.add('open-select');
        else wrapper.classList.add('open-select'); // fallback
        document.addEventListener('click', onDocClick);
      }

      function close() {
        wrapper.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        if (metaRow) metaRow.classList.remove('open-select');
        else wrapper.classList.remove('open-select');
        document.removeEventListener('click', onDocClick);
      }

      function onDocClick(e) {
        if (!wrapper.contains(e.target)) close();
      }

      // toggle open on click
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.classList.contains('open') ? close() : open();
      });

      // keyboard accessibility: open with Enter/Space, navigate options with Arrow keys, select with Enter
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); button.click(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); const first = opts.querySelector('.cv-option'); if (first) first.focus(); }
      });

      opts.addEventListener('keydown', (e) => {
        const focused = document.activeElement;
        if (!focused || !focused.classList.contains('cv-option')) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); (focused.nextElementSibling || focused).focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); (focused.previousElementSibling || focused).focus(); }
        if (e.key === 'Enter') { e.preventDefault(); focused.click(); }
        if (e.key === 'Escape') { e.preventDefault(); close(); button.focus(); }
      });
    }

    function initAll() {
      document.querySelectorAll(selector).forEach(buildCustom);
    }

    // run now (script already runs in IIFE; DOM is available in your file)
    // but keep a DOMContentLoaded safety if script is included in head
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  })();

  (function setupFileMetaSelectSpacing() {
    try {
      // targets in your HTML  
      const selIds = ['sourceSelect', 'organSelect', 'subtypeSelect', 'groundTruthSelect'];

      selIds.forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        // find the nearest .meta-row wrapper  
        const metaRow = sel.closest('.meta-row') || sel.parentElement.closest('.meta-row') || null;
        if (!metaRow) return;

        // set per-row gap variable (so CSS var is ready before open)
        try { setMetaRowGap(metaRow, id); } catch (e) { /* ignore */ }

        // add handlers to add/remove class while interacting  
        const open = () => metaRow.classList.add('open-select');
        const close = () => metaRow.classList.remove('open-select');

        sel.addEventListener('focus', open);
        sel.addEventListener('mousedown', open); // supports mouse interaction  
        sel.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') open(); });
        sel.addEventListener('change', close);
        sel.addEventListener('blur', () => setTimeout(close, 80)); // small delay so change via click is allowed  
        sel.addEventListener('keyup', (e) => { if (e.key === 'Escape') close(); });
      });
    } catch (err) {
      // non-fatal: do nothing  
      console.warn('file-meta select spacing init failed', err);
    }
  })();


  const startDetectionBtn = document.getElementById('startDetectionBtn');
  if (startDetectionBtn) {
    startDetectionBtn.addEventListener('click', e => {
      e && e.preventDefault();
      const firstNameInput = document.getElementById('firstName');
      if (!firstNameInput) return;
      const smallScreen = window.innerWidth < 900;
      const yOffset = smallScreen ? -120 : -250;
      const y = firstNameInput.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, Math.floor(y)), behavior: 'smooth' });
      setTimeout(() => {
        try { firstNameInput.focus({ preventScroll: true }); } catch (err) { firstNameInput.focus(); }
      }, 550);
    });
  }

  // debug hooks
  window.__cv_debug = { handleFile, resetFile, canRunAnalysis };




  // === multi-select ctype behaviour (added) ===
  (function setupCtypeMultiSelect() {
    try {
      if (!ctype2) return;

      /* ------------------------------
         INSTALL lightweight centered toast
         (minimal, safe, non-invasive)
         ------------------------------ */
      (function installCvToast() {
        if (window.__cv_toast_installed) return;
        window.__cv_toast_installed = true;
        // create basic DOM once
        const css = `
/* minimal toast CSS injected for max-items modal */
.cv-toast-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(6,10,14,0.45);backdrop-filter:blur(6px);z-index:12000;opacity:0;transform:scale(.98);transition:opacity .22s ease,transform .22s ease;pointer-events:auto}
.cv-toast-overlay.show{opacity:1;transform:scale(1)}
.cv-toast{max-width:820px;width:min(85%,760px);background:linear-gradient(180deg,#101219,#0d1114);color:#fff;border-radius:14px;padding:22px 28px;box-shadow:0 20px 60px rgba(2,6,23,0.6);border:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;align-items:center;gap:6px;position:relative}
.cv-toast-title {
  color: #fff !important;
  font-size: 26px !important;
  margin-bottom: 12px !important;   /* 👉 NEW GAP */
}
.cv-toast-message{font-size:15px;color:rgba(255,255,255,0.9);text-align:center;margin-top:2px}
.cv-toast-close{position:absolute;right:12px;top:10px;background:transparent;border:0;color:rgba(255,255,255,0.8);font-size:20px;cursor:pointer;padding:6px;border-radius:999px}
@media(max-width:560px){.cv-toast{padding:16px 12px;border-radius:12px}.cv-toast-title{font-size:18px}.cv-toast-message{font-size:14px}}
`;
        try {
          const style = document.createElement('style');
          style.id = 'cv-toast-css';
          style.appendChild(document.createTextNode(css));
          document.head.appendChild(style);
        } catch (e) { /* ignore */ }

        const overlay = document.createElement('div');
        overlay.style.pointerEvents = 'none'; // keep clicks through when hidden
        overlay.className = 'cv-toast-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-hidden', 'true');

        const card = document.createElement('div');
        card.className = 'cv-toast';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'cv-toast-close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.innerHTML = '✕';

        const title = document.createElement('div');
        title.className = 'cv-toast-title';
        title.textContent = '';

        const message = document.createElement('div');
        message.className = 'cv-toast-message';
        message.textContent = '';

        closeBtn.addEventListener('click', () => hide());
        overlay.addEventListener('click', (ev) => { if (ev.target === overlay) hide(); });

        card.appendChild(closeBtn);
        card.appendChild(title);
        card.appendChild(message);
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        let timer = null;
        function show(opts) {
          opts = opts || {};
          title.textContent = opts.title || 'Notice';
          message.textContent = opts.message || '';
          overlay.setAttribute('aria-hidden', 'false');
          overlay.style.pointerEvents = 'auto';
          requestAnimationFrame(() => overlay.classList.add('show'));
          if (timer) clearTimeout(timer);
          timer = setTimeout(hide, typeof opts.timeout === 'number' ? opts.timeout : 2400);
        }
        function hide() {
          overlay.style.pointerEvents = 'none';
          overlay.classList.remove('show');
          overlay.setAttribute('aria-hidden', 'true');
          if (timer) { clearTimeout(timer); timer = null; }
        }

        window.__cv_toast = { show, hide };
      })();

      // read markers from HTML data-attributes (your HTML added these)
      const isMulti = (ctype2.dataset && ctype2.dataset.multiselect === 'true');
      const maxSelect = Number((ctype2.dataset && ctype2.dataset.maxselect) || 1);
      let hiddenInput = document.getElementById('ctype2_values');
      let selectedContainer = document.getElementById('ctypeSelected');
      // internal store of selected values (string values from options)
      let selected = [];

      // ensure container exists visually (if not present, create)
      if (!selectedContainer && ctypeWrap) {
        const sc = document.createElement('div');
        sc.id = 'ctypeSelected';
        sc.className = 'ctype-chips';
        ctypeWrap.appendChild(sc);
        selectedContainer = sc;
      }

      // ensure hidden input exists (so canRunAnalysis can read it)
      if (!hiddenInput && ctypeWrap) {
        const hi = document.createElement('input');
        hi.type = 'hidden';
        hi.id = 'ctype2_values';
        ctypeWrap.appendChild(hi);
        hiddenInput = hi;
      }

      /* ---------- Smoother chips: reduced delay + no container display toggles ---------- */

      (function ensureChipCSS_Smoother() {
        if (document.getElementById('cv-ctype-chip-css-smooth')) return;
        const css = `
   /* keep container always present to avoid layout jumps */
#ctypeSelected { display:flex; gap:8px; flex-wrap:wrap; align-items:center; min-height:1px; }
/* chips: immediate show (no entrance animation) */
#ctypeSelected .chip {
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:6px 10px;
  border-radius:999px;
  background:#f1f5f9;
  color:#07263f;
  font-weight:600;
  transform-origin:center;
  /* disable entrance/exit transitions so adding/removing is instant */
  transition: none !important;
  opacity:1 !important;
  transform: none !important;
  box-sizing: border-box;
}
/* removal state (very quick) */
#ctypeSelected .chip.chip--remove {
  transition: none !important;
  opacity: 0 !important;
  transform: scale(0.98) !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
  display: none !important; /* optional — can hide immediately */
}

#ctypeSelected .chip .chip-x { cursor:pointer; padding-left:6px; font-weight:700; color:#374151; }

  `;
        const st = document.createElement('style');
        st.id = 'cv-ctype-chip-css-smooth';
        st.appendChild(document.createTextNode(css));
        document.head.appendChild(st);
      })();

      // helper escape for attribute selector matching
      function escAttr(val) {
        try { return CSS && CSS.escape ? CSS.escape(val) : ('' + val).replace(/(["\\\]])/g, '\\$1'); } catch (e) { return ('' + val).replace(/(["\\\]])/g, '\\$1'); }
      }

      /**
       * renderChips - incremental, minimal DOM ops, no container display toggles
       */
      function renderChips() {
        try {
          if (!selectedContainer) return;
          // always keep the container visible (avoid display:none reflows)
          selectedContainer.style.display = selectedContainer.style.display || 'flex';

          // sync hidden input immediately
          try { if (hiddenInput) hiddenInput.value = selected.join(','); } catch (e) { }

          // build map of existing chips
          const existing = Array.from(selectedContainer.querySelectorAll('.chip'));
          const existingMap = new Map(existing.map(ch => [ch.getAttribute('data-value'), ch]));

          // ensure DOM order follows `selected`
          selected.forEach((val, idx) => {
            const key = String(val);
            const present = existingMap.get(key);
            const refNode = selectedContainer.children[idx] || null;
            if (present) {
              // place in correct location if needed
              if (present !== refNode) {
                try { selectedContainer.insertBefore(present, refNode); } catch (e) { }
              }
              // cleanup transient classes
              present.classList.remove('chip--enter', 'chip--remove');
              existingMap.delete(key);
            } else {
              // create new chip and insert
              const opt = (ctype2 ? Array.from(ctype2.options).find(o => String((o.value || '')).trim() === String(val)) : null);
              const label = (opt ? (opt.textContent || opt.value) : val);
              const chip = document.createElement('div');
              chip.className = 'chip';
              chip.setAttribute('data-value', key);
              chip.innerHTML = `<span class="chip-label">${label}</span><span class="chip-x" role="button" aria-label="Remove ${label}">×</span>`;

              // attach remove handler (non-bubbling)
              const removeBtn = chip.querySelector('.chip-x');
              removeBtn.addEventListener('click', (ev) => {
                ev && ev.preventDefault();
                // immediate visual hide (no animation)
                try {
                  chip.style.transition = 'none';
                  chip.style.opacity = '0';
                  chip.style.height = '0';
                  chip.style.margin = '0';
                  chip.style.padding = '0';
                  chip.style.overflow = 'hidden';
                } catch (e) { }
                // remove from store after tiny tick so UI updates instantly
                setTimeout(() => { try { removeValue(key); } catch (e) { } }, 8);
              });

              // insert at correct place (synchronously)
              if (refNode) selectedContainer.insertBefore(chip, refNode);
              else selectedContainer.appendChild(chip);

              // ensure it appears instantly: force reflow then clear any inline transition (keeps later global transitions usable)
              try {
                void chip.offsetHeight;
                // clear inline transition so future style toggles use CSS (which we've set to none anyway)
                chip.style.transition = '';
              } catch (e) { }

            }
          });

          // remaining chips in existingMap should be removed — remove instantly without visible shrink
          if (existingMap.size) {
            existingMap.forEach((ch, k) => {
              try {
                try {
                  ch.style.transition = 'none';
                  ch.style.webkitTransition = 'none';
                  ch.style.opacity = '0';
                  ch.style.transform = 'scale(0.98)';
                  ch.style.height = '0';
                  ch.style.padding = '0';
                  ch.style.margin = '0';
                  ch.style.overflow = 'hidden';
                  requestAnimationFrame(() => {
                    try { ch.remove(); } catch (e) { }
                  });
                } catch (e) {
                  try { ch.remove(); } catch (er) { }
                }
              } catch (e) { }
            });
          }


          // apply file-details sync logic
          try {
            if (currentMode === 'manual') {
              if (selected.length === 0) applySingleManualFileDetails(null);
              else if (selected.length === 1) applySingleManualFileDetails(selected[0]);
              else applyLockedFileDetails();
            } else {
              applyLockedFileDetails();
            }
          } catch (e) { }
        } catch (err) {
          console.warn('renderChips(smooth) failed', err);
        }
      }

      /* addValue: minimal, push -> render */
      /* note: ensure you use same selected array variable as before */
      function addValue(val) {
        try {
          if (!val) return;
          if (selected.includes(val)) return;
          if (selected.length >= maxSelect) {
            if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
              window.__cv_toast.show({ message: `You can select up to ${maxSelect} items only.`, title: 'Selection limit', timeout: 2600 });
            } else {
              showTempMessage(`You can select up to ${maxSelect} items only.`);
            }
            return;
          }
          selected.push(val);
          try { if (hiddenInput) hiddenInput.value = selected.join(','); } catch (e) { }
          // immediate incremental render (fast)
          try { renderChips(); } catch (e) { }
          try { syncFileDetailsToMode(); } catch (e) { }
          try { updateAnalyzeState(); } catch (e) { }
        } catch (err) {
          console.warn('addValue(smooth) error', err);
        }
      }

      /* removeValue: update store & trigger incremental removal (no heavy reflow) */
      function removeValue(val) {
        try {
          if (!val) return;
          const had = selected.includes(val);
          selected = selected.filter(v => v !== val);
          try { if (hiddenInput) hiddenInput.value = selected.join(','); } catch (e) { }

          // remove DOM chip immediately without any visible shrink / transition
          try {
            const node = selectedContainer && selectedContainer.querySelector(`[data-value="${escAttr(val)}"]`);
            if (node) {
              try {
                // disable transitions on this node so browser won't animate anything
                node.style.transition = 'none';
                node.style.webkitTransition = 'none';
                // visually hide instantly (use properties that avoid micro-layout flicker)
                node.style.opacity = '0';
                node.style.transform = 'scale(0.98)';
                node.style.height = '0';
                node.style.padding = '0';
                node.style.margin = '0';
                node.style.overflow = 'hidden';
                // remove from DOM next frame (gives browser time to apply styles)
                requestAnimationFrame(() => {
                  try { node.remove(); } catch (e) { /* ignore */ }
                });
              } catch (e) {
                // fallback: remove directly
                try { node.remove(); } catch (er) { /* ignore */ }
              }
            }
          } catch (e) { }


          // update UI sync
          try { updateAnalyzeState(); } catch (e) { }
          try { syncFileDetailsToMode(); } catch (e) { }
          try { updateAnalyzeState(); } catch (e) { }

          // keep focus on select
          try { if (ctype2) setTimeout(() => { try { ctype2.focus(); } catch (e) { } }, 20); } catch (e) { }

          // if cleared all -> preserve previous behavior: clear uploaded file if in manual and a file existed
          if (had && selected.length === 0) {
            try {
              if (pickedFile && currentMode === 'manual') {
                if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
                  window.__cv_toast.show({
                    title: 'Selection required',
                    message: 'You cleared cancer type selection — uploaded image has been removed.',
                    timeout: 2200
                  });
                } else {
                  try { alert('You cleared cancer type selection — uploaded image has been removed.'); } catch (e) { }
                }

                // RESPECT mode-change suppress flag so we don't race with onNo flow
                if (!(window.__cv_mode_confirm && window.__cv_mode_confirm.suppressAutoReset)) {
                  try { resetFile(false); } catch (e) { }
                } else {
                  // suppressed during mode-change — let onNo or caller handle reset instead
                  console.log('[cv] removeValue: skipped resetFile because suppressAutoReset is active');
                }

                try { if (ctype2) ctype2.focus(); } catch (e) { }
              }
            } catch (e) { console.warn('post-clear guard failed', e); }
            // also sync UI
            try { renderChips(); } catch (e) { }
          }

        } catch (err) {
          console.warn('removeValue(smooth) error', err);
        }
      }


      // temp ephemeral message under the select (FALLBACK inline implementation)
      let tempTimer = null;
      function showTempMessageInline(msg) {
        if (!ctypeWrap) return;
        let el = ctypeWrap.querySelector('.ctype-temp-msg');
        if (!el) {
          el = document.createElement('div');
          el.className = 'ctype-temp-msg';
          ctypeWrap.appendChild(el);
        }
        el.textContent = msg;
        el.style.opacity = '1';
        if (tempTimer) clearTimeout(tempTimer);
        tempTimer = setTimeout(() => {
          el.style.opacity = '0';
        }, 1400);
      }

      // Provide a unified showTempMessage function that uses the centered toast if present
      function showTempMessage(msg) {
        if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
          window.__cv_toast.show({ message: msg, title: 'Selection limit reached', timeout: 2600 });
          return;
        }
        // fallback to inline
        showTempMessageInline(msg);
      }

      // toggle behavior when selecting via native select
      ctype2.addEventListener('change', (e) => {
        try {
          const val = (ctype2.value || '').toString();
          if (!val) return;
          if (isMulti) {
            // toggle - if present remove, else add (but enforce max)
            if (selected.includes(val)) {
              removeValue(val);
            } else {
              if (selected.length >= maxSelect) {
                showTempMessage(`You can select up to ${maxSelect} items only.`);
              } else {
                addValue(val);
              }

            }
            // reset native select UI to placeholder so appearance remains unchanged
            try { requestAnimationFrame(() => { try { ctype2.value = ''; } catch (err) { /* ignore */ } }); } catch (e) { try { ctype2.value = ''; } catch (err) { } }

          } else {
            // single-select: keep native behavior and copy value to hidden
            selected = [val];
            if (hiddenInput) hiddenInput.value = selected.join(',');
            renderChips();
          }
          updateAnalyzeState();
        } catch (err) {
          console.warn('ctype2 change handler error', err);
        }
      });

      // keyboard support: Enter toggles focused option
      ctype2.addEventListener('keydown', (e) => {
        if (!isMulti) return;
        if (e.key === 'Enter' || e.key === ' ') {
          // allow normal behavior but emulate selection toggle after a tiny delay
          setTimeout(() => {
            const val = (ctype2.value || '').toString();
            if (!val) return;
            if (selected.includes(val)) removeValue(val); else addValue(val);
            try { ctype2.value = ''; } catch (err) { }
            updateAnalyzeState();
          }, 10);
          e.preventDefault();
        }
      });

      // expose small API on the DOM for debugging/testing
      if (window.__cv_debug) window.__cv_debug.ctypeSelected = () => selected.slice();

      // initialize from any prefilled hidden input (if present)
      (function initFromHidden() {
        if (hiddenInput && hiddenInput.value) {
          const vals = hiddenInput.value.split(',').map(s => s.trim()).filter(Boolean);
          if (vals.length) {
            selected = vals.slice(0, maxSelect);
            renderChips();
          }
        } else {
          renderChips();
        }
      })();

      /* -------------------------
  Reinstall safe MutationObserver on #ctype2_values to IGNORE programmatic updates
  (paste immediately after setupCtypeMultiSelect() IIFE)
-------------------------- */
      (function guardHiddenInputObserver() {
        try {
          const hidden = document.getElementById('ctype2_values');
          if (!hidden) return;

          // disconnect any old observer
          try { if (hidden.__cv_mutation_observer && typeof hidden.__cv_mutation_observer.disconnect === 'function') hidden.__cv_mutation_observer.disconnect(); } catch (e) { }

          let debounceTimer = null;
          const mo = new MutationObserver((mutations) => {
            // ignore if we flagged programmatic update
            if (hidden.__cv_updating) return;
            // debounce to coalesce many tiny changes
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              try {
                const hv = (hidden.value || '').toString().trim();
                if (!hv && pickedFile && currentMode === 'manual') {
                  if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
                    window.__cv_toast.show({ title: 'Selection required', message: 'Cancer type selection cleared — uploaded image has been removed.', timeout: 2200 });
                  } else try { alert('Cancer type selection cleared — uploaded image has been removed.'); } catch (e) { }
                  // respect suppress flag
                  if (!(window.__cv_mode_confirm && window.__cv_mode_confirm.suppressAutoReset)) {
                    try { resetFile(false); } catch (e) { }
                  } else {
                    console.log('[cv] guardHiddenInputObserver: skipped resetFile because suppressAutoReset is active');
                  }
                  try { if (ctype2) ctype2.focus(); } catch (e) { }
                }

              } catch (e) { }
            }, 80);
          });

          // observe attribute & value changes but be forgiving
          try {
            mo.observe(hidden, { attributes: true, attributeFilter: ['value'], childList: false, subtree: false, characterData: false });
          } catch (e) {
            // fallback: observe parent for childList changes (rare)
            const parent = hidden.parentNode;
            if (parent) mo.observe(parent, { childList: true, subtree: false });
          }
          hidden.__cv_mutation_observer = mo;
        } catch (e) { console.warn('guardHiddenInputObserver failed', e); }
      })();


      // === ADD: expose a clear function so external code can reset multi-select ===
      function clearCtypeSelections() {
        selected = [];
        try { if (hiddenInput) hiddenInput.value = ''; } catch (e) { /* ignore */ }
        try { ctype2.value = ''; } catch (e) { /* ignore */ }
        try { renderChips(); } catch (e) { /* ignore */ }
        try { updateAnalyzeState(); } catch (e) { /* ignore */ }
        // sync file-details after clearing
        try { syncFileDetailsToMode(); } catch (e) { /* ignore */ }
      }

      // attach clear to debug API so setMode() (outside closure) can call it safely
      try {
        window.__cv_debug = window.__cv_debug || {};
        window.__cv_debug.clearCtype = clearCtypeSelections;
      } catch (e) {
        // ignore if window is locked down
      }

    } catch (err) {
      // non-fatal
      console.warn('setupCtypeMultiSelect failed', err);
    }
  })();

  // === end multi-select block ===
  // === Robust visual right + down shift on preview (aggressive suppression on Clear) ===
  (function installRightShiftHooks() {
    const RIGHT_SHIFT_PX = 750;
    const DOWN_SHIFT_PX = 195;
    const TRANSITION = 'transform 260ms ease, margin-top 260ms ease';

    let suppressShiftUntil = 0;

    function isPreviewReallyVisible() {
      try {
        const uploadBlock = document.querySelector('.upload-block');
        if (!uploadBlock || !uploadBlock.classList.contains('has-preview')) return false;

        const thumb = uploadBlock.querySelector('#thumb2, .preview-frame img, .preview-frame');
        if (!thumb) return true;

        if (thumb.tagName === 'IMG') {
          const src = thumb.getAttribute('src') || '';
          const cs = getComputedStyle(thumb);
          if (!src.trim() || cs.display === 'none' || cs.visibility === 'hidden' || thumb.offsetWidth === 0) return false;
          return true;
        }

        const cs = getComputedStyle(thumb);
        if (cs.display === 'none' || cs.visibility === 'hidden' || thumb.offsetWidth === 0) return false;
        return true;
      } catch (e) {
        return false;
      }
    }
    function applyVisualShift() {
      const uploadBlock = document.querySelector('.upload-block');
      if (!uploadBlock) return;
      if (!isPreviewReallyVisible()) return;

      // बस class add कर → बाकी काम CSS करेगा (ZERO animation)
      uploadBlock.classList.add('preview-right');

      uploadBlock.__cv_last_shift = Date.now();
    }

    function removeVisualShift() {
      const uploadBlock = document.querySelector('.upload-block');
      if (!uploadBlock) return;
      try {
        uploadBlock.classList.remove('preview-right');
        const prev = uploadBlock.__cv_prev_shift || {};
        uploadBlock.style.transform = typeof prev.transform !== 'undefined' ? prev.transform : '';
        uploadBlock.style.marginTop = typeof prev.marginTop !== 'undefined' ? prev.marginTop : '';
        uploadBlock.style.transition = typeof prev.transition !== 'undefined' ? prev.transition : '';
        delete uploadBlock.__cv_prev_shift;
      } catch (e) { console.warn('removeVisualShift failed', e); }
    }

    // --- Small utilities to suppress heading/analyze flashes safely ---
    const ELEMENTS_TO_SUPPRESS_SELECTORS = ['h3[data-preview-heading]', '#analyze2', '.button-row.file-area-control-wrap'];

    function backupElementInline(el) {
      if (!el) return;
      el.__suppress_backup = el.__suppress_backup || {};
      const b = el.__suppress_backup;
      if (typeof b.transition === 'undefined') b.transition = el.style.transition || '';
      if (typeof b.opacity === 'undefined') b.opacity = el.style.opacity || '';
      if (typeof b.visibility === 'undefined') b.visibility = el.style.visibility || '';
      if (typeof b.display === 'undefined') b.display = el.style.display || '';
      if (typeof b.transform === 'undefined') b.transform = el.style.transform || '';
    }

    function restoreElementInline(el) {
      if (!el || !el.__suppress_backup) return;
      const b = el.__suppress_backup;
      try {
        el.style.transition = b.transition || '';
        el.style.opacity = b.opacity || '';
        el.style.visibility = b.visibility || '';
        el.style.display = b.display || '';
        el.style.transform = b.transform || '';
      } catch (e) { /* ignore */ }
      delete el.__suppress_backup;
    }

    function getElementsToSuppress() {
      const out = [];
      ELEMENTS_TO_SUPPRESS_SELECTORS.forEach(sel => {
        try { document.querySelectorAll(sel).forEach(e => e && out.push(e)); } catch (e) { }
      });
      return out;
    }



    // Aggressive suppression helper: instantly disable transition/transform to avoid flash
    function immediateSuppressAndHide() {
      const uploadBlock = document.querySelector('.upload-block');
      if (!uploadBlock) return;

      try {
        // store previous inline transition so we can restore later
        if (typeof uploadBlock.__cv_prev_transition_for_suppress === 'undefined') {
          uploadBlock.__cv_prev_transition_for_suppress = uploadBlock.style.transition || '';
        }
        if (typeof uploadBlock.__cv_prev_transform_for_suppress === 'undefined') {
          uploadBlock.__cv_prev_transform_for_suppress = uploadBlock.style.transform || '';
        }
        if (typeof uploadBlock.__cv_prev_margin_for_suppress === 'undefined') {
          uploadBlock.__cv_prev_margin_for_suppress = uploadBlock.style.marginTop || '';
        }

        // collect elements (heading/analyze/button-row) but DO NOT hide them or change pointer-events
        const els = getElementsToSuppress();

        // backup & remove transitions ONLY (no visibility/opacity changes)
        els.forEach(el => {
          try {
            backupElementInline(el);
            // remove transitions so style toggles won't animate (prevents the flash)
            el.style.transition = 'none';
            // help the browser by hinting what will change (no visual hide)
            el.style.willChange = 'opacity, transform';
          } catch (e) { }
        });

        // also remove uploadBlock transitions temporarily (avoid its transform animation)
        uploadBlock.style.transition = 'none';
        // force reflow so browser applies the no-transition state immediately
        void uploadBlock.offsetHeight;

        // mark suppression window (during which applyVisualShift will refuse to run)
        suppressShiftUntil = Date.now() + 700;

        // ensure any applied shift class is removed immediately without hiding heading/analyze
        uploadBlock.classList.remove('preview-right');

        // restore transitions & will-change after a short delay; keep suppressShiftUntil alive
        setTimeout(() => {
          try {
            uploadBlock.style.transition = uploadBlock.__cv_prev_transition_for_suppress || '';
            delete uploadBlock.__cv_prev_transition_for_suppress;
          } catch (e) { }

          // restore each element's inline backup (but do not force visibility changes)
          els.forEach(el => {
            try {
              // restore transition & remove will-change hint
              if (el && el.__suppress_backup) {
                el.style.transition = el.__suppress_backup.transition || '';
                el.style.willChange = '';
                // keep other inline properties untouched (we only touched transition/willChange)
                delete el.__suppress_backup;
              } else {
                // if no backup, at least remove the hint
                if (el) el.style.willChange = '';
              }
            } catch (e) { }
          });
        }, 300);
      } catch (e) {
        console.warn('immediateSuppressAndHide (safe) failed', e);
      }
    }


    // Temporarily remove transition/visibility quirks for list of elements (short window)
    function tempSuppressElements(ms = 700) {
      const els = getElementsToSuppress();
      if (!els.length) return;

      els.forEach(el => {
        try { backupElementInline(el); el.style.transition = 'none'; } catch (e) { }
      });

      // force reflow
      void document.body.offsetHeight;

      setTimeout(() => {
        els.forEach(el => {
          try { restoreElementInline(el); } catch (e) { }
        });
      }, Math.max(300, ms - 200));
    }

    // REPLACE the existing handleFile to guard shift application
    function hookHandleFile() {
      if (typeof handleFile !== 'function') return;
      const orig = handleFile;
      handleFile = function (file) {
        const r = orig.apply(this, arguments);

        requestAnimationFrame(() => {
          setTimeout(() => {
            try {
              if (isPreviewReallyVisible() && Date.now() >= suppressShiftUntil) {
                applyVisualShift();
              }
            } catch (e) { console.warn('guarded hookHandleFile error', e); }
          }, 140);
        });

        return r;
      };
    }

    // REPLACE resetFile to suppress before reset and cleanly remove shift
    function hookResetFile() {
      if (typeof resetFile !== 'function') return;
      const orig = resetFile;
      resetFile = function (doScroll) {
        // suppress immediately before the original reset runs to avoid flashes
        immediateSuppressAndHide();
        const r = orig.apply(this, arguments);
        // ensure visual shift removed after DOM update
        requestAnimationFrame(() => { setTimeout(removeVisualShift, 30); });
        return r;
      };
    }

    // Safer clear handler: capture-phase, suppress visuals, then call resetFile.
    // IMPORTANT: use stopPropagation (not stopImmediatePropagation) and DO NOT attempt to re-click the button.
    try {
      const clearBtn = document.getElementById('clear2') || document.querySelector('.button-row #clear2');
      if (clearBtn) {
        // simple, safe clear: call resetFile synchronously and prevent default
        clearBtn.addEventListener('click', function (ev) {
          try {
            ev && ev.preventDefault();
            ev && ev.stopPropagation();
            if (typeof resetFile === 'function') {
              // call with doScroll=false to avoid immediate scroll; change to true if you prefer scroll
              resetFile(false);
            } else {
              // fallback: attempt basic cleanup if resetFile missing
              try { document.getElementById('fileInp').value = ''; } catch (e) { }
            }
          } catch (e) { console.warn('simple clear handler error', e); }
        }, true); // keep capture-phase to match your earlier behavior
      }
    } catch (e) { console.warn('attach simple clear failed', e); }


    // defensive: if analyze2 or heading toggle style/class, briefly suppress to prevent micro-flash
    try {
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && m.target) {
            const t = m.target;
            if (t.matches && (t.matches('#analyze2') || t.matches('h3[data-preview-heading]') || t.matches('.button-row.file-area-control-wrap'))) {
              tempSuppressElements(500);
              break;
            }
          }
        }
      });

      // attach observer to currently present elements (non-invasive)
      ELEMENTS_TO_SUPPRESS_SELECTORS.forEach(sel => {
        try {
          const el = document.querySelector(sel);
          if (el) mo.observe(el, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
        } catch (e) { }
      });

      // disconnect after 10s (defensive, keeps cost low)
      setTimeout(() => { try { mo.disconnect(); } catch (e) { } }, 10000);
    } catch (e) { }

    try { hookHandleFile(); } catch (e) { /* ignore */ }
    try { hookResetFile(); } catch (e) { /* ignore */ }

    // expose debug helpers (non-invasive)
    try {
      window.__cv_debug = window.__cv_debug || {};
      window.__cv_debug.applyVisualShift = applyVisualShift;
      window.__cv_debug.removeVisualShift = removeVisualShift;
      window.__cv_debug.immediateSuppressAndHide = immediateSuppressAndHide;
      window.__cv_debug.isPreviewReallyVisible = isPreviewReallyVisible;
    } catch (e) { }
  })();

  /* ===== Upload heading: force-show guard (paste once, after installRightShiftHooks IIFE) ===== */
  (function installForceShowHeadingGuard() {
    const TEMP_ID = 'cv-force-show-css';
    if (!document.getElementById(TEMP_ID)) {
      const css = `
      .upload-block h1, .upload-block h2, .upload-block h3, .upload-block h4,
      #upload-section h1, #upload-section h2, #upload-section h3, #upload-section h4,
      [data-preview-heading="1"], .upload-heading {
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: none !important;
        display: block !important;
        transition: none !important;
      }
      .upload-block [data-temp-hidden="1"], #upload-section [data-temp-hidden="1"] {
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
      const st = document.createElement('style');
      st.id = TEMP_ID;
      st.appendChild(document.createTextNode(css));
      document.head.appendChild(st);
      // remove the temp style after a few seconds to avoid permanently overriding other rules
      setTimeout(() => { try { document.getElementById(TEMP_ID)?.remove(); } catch (e) { } }, 1200);
    }

    function unblockHeadingsNow(scopeEl) {
      try {
        const scope = scopeEl || (document.querySelector('.upload-block') || document.querySelector('#upload-section') || document);
        const headings = Array.from(scope.querySelectorAll('h1,h2,h3,h4,.upload-heading'))
          .filter(n => /upload\s*image/i.test((n.textContent || '').trim()));
        headings.forEach(h => {
          try {
            delete h.dataset.tempHidden;
            delete h.dataset.previewHeading;
            h.style.visibility = 'visible';
            h.style.opacity = '1';
            h.style.pointerEvents = 'auto';
            h.style.display = 'block';
            h.style.transition = 'none';
            h.style.transform = 'none';
          } catch (e) { }
        });
        // clear any temp-hidden markers in scope
        Array.from(scope.querySelectorAll('[data-temp-hidden]')).forEach(n => {
          try { delete n.dataset.tempHidden; n.style.visibility = 'visible'; n.style.opacity = '1'; } catch (e) { }
        });
      } catch (e) { /* non-fatal */ }
    }

    function killKnownSuppressors() {
      try {
        if (window.__uploadAutoHide && typeof window.__uploadAutoHide.stop === 'function') {
          try { window.__uploadAutoHide.stop(); } catch (e) { }
        }
        const hid = document.getElementById('ctype2_values');
        if (hid && hid.__cv_mutation_observer && typeof hid.__cv_mutation_observer.disconnect === 'function') {
          try { hid.__cv_mutation_observer.disconnect(); } catch (e) { }
        }
        // clear global skip flag if set
        try { if (window.__cv_skip_heading_swap) window.__cv_skip_heading_swap = false; } catch (e) { }
        // remove any helper class that suppresses heading on <html>
        try { document.documentElement.classList.remove('cv-heading-suppress'); } catch (e) { }
      } catch (e) { /* ignore */ }
    }

    const clearBtn = document.getElementById('clear2') || document.querySelector('.button-row #clear2') || document.querySelector('[id*="clear"]');
    if (!clearBtn) return; // nothing to attach to

    if (!clearBtn.__forceShowAttached) {
      clearBtn.addEventListener('click', function (ev) {
        try {
          // 1) quickly disconnect known suppressors so they can't re-hide
          killKnownSuppressors();
          // 2) force-heading visible immediately (sync)
          unblockHeadingsNow();
          // 3) force reflow to help the browser show it without delay
          void document.body.offsetHeight;
          // 4) schedule a clean unblock again after DOM updates
          setTimeout(() => { unblockHeadingsNow(); }, 50);
        } catch (e) { /* ignore */ }
        // let other handlers run normally after capture-phase
      }, true); // use capture-phase so this runs early
      clearBtn.__forceShowAttached = true;
    }

    // run once at install in case state is stuck
    try { killKnownSuppressors(); unblockHeadingsNow(); } catch (e) { }
  })();



  // ONLY target subtype select wrapper and apply .cv-subtype-match, then size it to match ground select wrapper
  (function ensureSubtypeWrapperStyle() {
    try {
      function apply() {
        const subtype = document.getElementById('subtypeSelect');
        if (!subtype) return false;
        // if buildCustom wrapped it, the wrapper will contain the select as a child
        const wrapper = subtype.closest && subtype.closest('.cv-custom-select');
        if (!wrapper) {
          // If no custom wrapper exists yet, do not modify native select; retry soon
          return false;
        }

        // Add marker class (CSS above targets this only)
        wrapper.classList.add('cv-subtype-match');

        // Try to size wrapper to visually match the ground truth select wrapper (if present)
        const ground = document.getElementById('groundTruthSelect');
        const groundWrap = ground && ground.closest ? ground.closest('.cv-custom-select') : null;

        if (groundWrap) {
          const gw = Math.round(groundWrap.getBoundingClientRect().width);
          if (gw > 0) {
            wrapper.style.width = gw + 'px';
            wrapper.style.maxWidth = gw + 'px';
            // ensure dropdown aligns to wrapper
            const opts = wrapper.querySelector('.cv-options');
            if (opts) { opts.style.width = '100%'; opts.style.left = '0'; }
          }
        } else {
          // Optionally align with native ground select computed width
          try {
            if (ground && !groundWrap) {
              const cs = window.getComputedStyle(ground);
              if (cs && cs.width && cs.width !== '0px') {
                wrapper.style.width = cs.width;
                wrapper.style.maxWidth = cs.width;
                const opts = wrapper.querySelector('.cv-options');
                if (opts) { opts.style.width = '100%'; opts.style.left = '0'; }
              }
            }
          } catch (e) { /* ignore */ }
        }
        return true;
      }

      // attempt now, retry a few times spaced out in case builder hasn't run yet
      let tries = 0;
      function attempt() {
        tries += 1;
        const ok = apply();
        if (!ok && tries < 8) setTimeout(attempt, 120);
      }
      // run on next frame (and then retries)
      requestAnimationFrame(attempt);
    } catch (e) { console.warn('ensureSubtypeWrapperStyle failed', e); }
  })();



  // --- Persistent fix: prevent chips staying hidden ---
  // Add this at the end of script.js
  (function () {
    const hiddenInput = document.getElementById('ctype2_values');
    const chipsWrap = document.getElementById('ctypeSelected');

    function unhideTempChips(root) {
      try {
        const rootEl = root || chipsWrap || document;
        const temp = rootEl.querySelectorAll ? rootEl.querySelectorAll('#ctypeSelected .chip[data-temp-hidden]') : [];
        temp.forEach(ch => {
          ch.removeAttribute('data-temp-hidden');
          // Remove inline styles that hide it
          if (ch.style) {
            if (ch.style.visibility === 'hidden') ch.style.visibility = '';
            if (ch.style.opacity === '0') ch.style.opacity = '1';
            // remove transition if it keeps it invisible
            ch.style.transition = '';
          }
        });
      } catch (e) {
        console.warn('unhideTempChips failed', e);
      }
    }

    // 1) Ensure chips are unhidden just after page load / initial render
    document.addEventListener('DOMContentLoaded', () => setTimeout(unhideTempChips, 50));

    // 2) Observe hidden input changes (the code already uses this input to coordinate chips)
    if (hiddenInput && typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(() => {
        // give original render logic a moment to run, then unhide
        setTimeout(unhideTempChips, 20);
      });
      mo.observe(hiddenInput, { attributes: true, attributeFilter: ['value'], childList: false });
    }

    // 3) Hook into possible renderChips/setMode flows: call unhide after common functions run.
    // If renderChips exists, wrap it to call unhide after each render
    if (typeof window.renderChips === 'function') {
      const origRender = window.renderChips;
      window.renderChips = function (...args) {
        const res = origRender.apply(this, args);
        setTimeout(unhideTempChips, 20);
        return res;
      };
    }

    // If setMode exists, call unhide after mode switch (useful if mode switch hides chips)
    if (typeof window.setMode === 'function') {
      const origMode = window.setMode;
      window.setMode = function (mode, ...rest) {
        const res = origMode.apply(this, [mode, ...rest]);
        setTimeout(unhideTempChips, 20);
        return res;
      };
    }

    // 4) As a last fallback, run periodically for a short while after page load
    let tries = 0;
    const int = setInterval(() => {
      unhideTempChips();
      tries++;
      if (tries > 10) clearInterval(int);
    }, 150);

  })();


  (function attachLeftFixedImage() {
    const deco = document.getElementById('cv-left-deco-image');
    const uploadBlock = document.querySelector('.upload-block');

    if (!deco || !uploadBlock) return;

    // REPLACE your existing reposition() with this safe variant
    function reposition() {
      if (!uploadBlock || !deco) return;

      // hide if no preview
      if (!uploadBlock.classList.contains('has-preview')) {
        deco.style.opacity = '0';
        return;
      }

      // 1) manual override via data attribute (highest priority)
      //    e.g. <img id="cv-left-deco-image" data-manual-top="120px" ...>
      const manualTop = deco.getAttribute('data-manual-top');
      if (manualTop) {
        deco.style.top = manualTop;
        deco.style.opacity = '1';
        return;
      }

      // 2) CSS variable offset fallback (can set in a stylesheet)
      //    .fixed-left-preview-image { --fixed-deco-top-offset: 10px; }
      const cssOffset = parseInt(getComputedStyle(deco).getPropertyValue('--fixed-deco-top-offset') || '0', 10);

      // compute top aligned to uploadBlock top + cssOffset
      const rect = uploadBlock.getBoundingClientRect();
      const topOffset = Math.round(rect.top + window.scrollY + cssOffset);

      // apply calculated top as inline style (this is what used to override your css:top)
      deco.style.top = topOffset + 'px';
      deco.style.opacity = '1';
    }


    window.addEventListener('scroll', reposition);
    window.addEventListener('resize', reposition);

    // Call once
    setTimeout(reposition, 200);
  })();

  /* cv-left-deco-image: show fixed left decoration ONLY when upload has preview */
  (function () {
    try {
      const img = document.getElementById('cv-left-deco-image');
      if (!img) return;

      // initial style already sets display:none
      function updateLeftDeco() {
        try {
          const ub = document.querySelector('.upload-block');
          if (ub && ub.classList && ub.classList.contains('has-preview')) {
            img.style.display = 'block';
          } else {
            img.style.display = 'none';
          }
        } catch (e) { /* ignore */ }
      }

      // initial check
      updateLeftDeco();

      // observe class changes on upload-block (fast, light)
      const ub = document.querySelector('.upload-block');
      if (ub && typeof MutationObserver !== 'undefined') {
        const mo = new MutationObserver(muts => updateLeftDeco());
        mo.observe(ub, { attributes: true, attributeFilter: ['class'] });
      }

      // also ensure Clear / handleFile flows update it
      document.getElementById('clear2')?.addEventListener('click', () => setTimeout(updateLeftDeco, 40));
      // if your code calls resetFile/handleFile we try to patch global functions (safe, non-destructive)
      if (typeof window.resetFile === 'function') {
        const orig = window.resetFile;
        window.resetFile = function (...args) {
          const res = orig.apply(this, args);
          setTimeout(updateLeftDeco, 40);
          return res;
        };
      }
      if (typeof window.handleFile === 'function') {
        const orig2 = window.handleFile;
        window.handleFile = function (...args) {
          const r = orig2.apply(this, args);
          setTimeout(updateLeftDeco, 120);
          return r;
        };
      }
    } catch (e) { console.warn('cv-left-deco init failed', e); }
  })();


  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.progress-ring').forEach(svg => {
      try {
        // read attributes
        const rawText = svg.getAttribute('data-percent-text') ?? svg.dataset.percentText ?? svg.getAttribute('data-percent') ?? svg.dataset.percent ?? '0';
        const rawFill = svg.getAttribute('data-fill') ?? svg.dataset.fill ?? rawText;
        const textPct = Math.max(0, Math.min(100, parseFloat(String(rawText).replace(',', '.')) || 0));
        const fillPct = Math.max(0, Math.min(100, parseFloat(String(rawFill).replace(',', '.')) || 0));
        const stroke = Math.max(1, parseFloat(svg.getAttribute('data-stroke') || svg.dataset.stroke || 8));
        const color = svg.getAttribute('data-color') || svg.dataset.color || '#2563eb';

        const circle = svg.querySelector('.progress-ring-circle');
        const bg = svg.querySelector('.progress-ring-bg');
        if (!circle || !bg) return;

        const r = parseFloat(circle.getAttribute('r')) || 54;
        const C = 2 * Math.PI * r;

        // set stroke widths
        circle.style.strokeWidth = bg.style.strokeWidth = stroke + 'px';

        // dasharray + offset based on fillPct (visual)
        circle.style.strokeDasharray = `${C} ${C}`;
        const offset = C * (1 - fillPct / 100);
        circle.style.strokeDashoffset = offset;

        // set color + text
        svg.style.setProperty('--ring-color', color);
        circle.style.stroke = color;
        const textEl = svg.parentNode.querySelector('.stat-circle-text');
        if (textEl) textEl.textContent = (textPct % 1 === 0 ? textPct.toFixed(0) : textPct.toFixed(1)) + '%';
      } catch (err) {
        console.warn('progress-ring error', err);
      }
    });
  });


  // footer-model.js (optional)
  // finds links with .model-card-link and opens simple modal with xhr fetch of /model-card snippet
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('.model-card-link');
    if (!a) return;
    // prevent new-tab if you prefer modal
    e.preventDefault();
    const url = a.href;
    // simple fetch + modal (no external libs)
    fetch(url, { credentials: 'same-origin' })
      .then(r => r.text())
      .then(html => {
        const modal = document.createElement('div');
        modal.className = 'cv-modal';
        modal.innerHTML = `
        <div class="cv-modal-card" role="dialog" aria-modal="true">
          <button class="cv-modal-close" aria-label="Close">✕</button>
          <div class="cv-modal-body">${html}</div>
        </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.cv-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (ev) => { if (ev.target === modal) modal.remove(); });
        // focus trap basics
        const first = modal.querySelector('button, a, input');
        if (first) first.focus();
      })
      .catch(() => {
        // fallback: open in new tab
        window.open(url, '_blank');
      });
  });





})(); 