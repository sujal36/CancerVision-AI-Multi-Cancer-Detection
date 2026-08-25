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

  /* === End deduped / problem-causing part removed === */
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
    const res2 = document.getElementById('res2');

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
    // ---------- Defensive collapse helper (paste once after modal installed) ----------
function __cv_defensive_collapse_before_modal() {
  try {
    // 1) close custom selects (remove visible open state)
    document.querySelectorAll('.cv-custom-select.open').forEach(w => {
      try { w.classList.remove('open'); w.querySelector('.cv-selected')?.setAttribute('aria-expanded','false'); } catch(e) {}
    });

    // 2) remove .open-select from meta-rows and form-rows and clear gap vars
    document.querySelectorAll('.meta-row.open-select, .form-row.open-select').forEach(m => {
      try { m.classList.remove('open-select'); } catch(e) {}
      try { m.style.removeProperty('--open-gap'); m.style.removeProperty('--open-gap-mobile'); } catch(e) {}
    });

    // 3) ensure ctypeWrap collapsed
    const cw = document.getElementById('ctypeWrap');
    if (cw) {
      try {
        cw.style.maxHeight = '0px';
        cw.style.opacity = '0';
        cw.style.pointerEvents = 'none';
        cw.setAttribute('aria-hidden', 'true');
        cw.style.display = 'none';
      } catch(e) {}
    }

    // 4) remove any heading preview hack immediately (if present)
    try { if (window.__cv_debug && typeof window.__cv_debug.restoreOriginalHeading === 'function') window.__cv_debug.restoreOriginalHeading(); } catch(e) {}

    // 5) remove any visual shift/transform/margin applied to upload-block
    const ub = document.querySelector('.upload-block');
    if (ub) {
      try {
        ub.classList.remove('preview-right');
        // try to remove transform and marginTop set by hooks
        ub.style.transform = ub.__cv_prev_shift?.transform || ub.__cv_prev_styles?.transform || '';
        ub.style.marginTop = ub.__cv_prev_shift?.marginTop || ub.__cv_prev_styles?.marginTop || '';
        ub.style.transition = ub.__cv_prev_shift?.transition || ub.__cv_prev_styles?.transition || '';
        // also forcibly clear inline transform/marginTop
        ub.style.removeProperty('transform');
        ub.style.removeProperty('margin-top');
      } catch(e) {}
    }

    // 6) remove any inline maxHeight on custom wrappers (defensive)
    document.querySelectorAll('[style*="max-height"]').forEach(el => {
      try {
        // only clear if it looks like our ctype/ctypeWrap style
        if (String(el.style.maxHeight).indexOf('px') !== -1) el.style.removeProperty('max-height');
      } catch(e) {}
    });
  } catch (err) {
    // non-fatal
    console.warn('defensive collapse failed', err);
  }
}

// Hook into patient modal show so collapse runs BEFORE modal becomes visible
try {
  if (window.__cv_patient_modal && typeof window.__cv_patient_modal.show === 'function') {
    const _origShow = window.__cv_patient_modal.show.bind(window.__cv_patient_modal);
    window.__cv_patient_modal.show = function () {
      try { __cv_defensive_collapse_before_modal(); } catch (e) {}
      return _origShow();
    };
  }
} catch (e) { /* ignore */ }


    


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
        try { button.tabIndex = enabled ? 0 : -1; } catch (e) {}
        button.style.pointerEvents = enabled ? '' : 'none';
        button.style.opacity = enabled ? '' : '0.55';
      }

      // options: prevent keyboard/click when disabled
      opts.forEach(o => {
        if (!enabled) {
          o.setAttribute('aria-disabled', 'true');
          try { o.tabIndex = -1; } catch (e) {}
        } else {
          o.removeAttribute('aria-disabled');
          try { o.tabIndex = 0; } catch (e) {}
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
        try { selectEl.style.pointerEvents = 'none'; selectEl.style.opacity = '0.55'; } catch (e) {}
      } else {
        try { selectEl.style.pointerEvents = ''; selectEl.style.opacity = ''; } catch (e) {}
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

/* prevent accidental submit */
document.querySelectorAll('form').forEach(f => {
  if (f.querySelector('#age2') || f.querySelector('#fileInp') || f.classList.contains('detection-form')) {
    f.addEventListener('submit', ev => { ev.preventDefault(); return false; });
  }
});

/* helpers */
const safeAddClass = (el, c) => el && el.classList && el.classList.add(c);
const safeRemoveClass = (el, c) => el && el.classList && el.classList.remove(c);
const findDetectionInner = el => el ? el.closest('.detection-inner') : null;


// Close any open custom selects / meta-row gaps and collapse ctypeWrap
function closeAllOpenSelects() {
  try {
    // 1) Close custom cv-custom-select popups
    document.querySelectorAll('.cv-custom-select.open').forEach(w => {
      try { w.classList.remove('open'); } catch(e) {}
      try {
        const btn = w.querySelector('.cv-selected');
        if (btn) btn.setAttribute('aria-expanded','false');
      } catch(e) {}
    });

    // 2) Remove .open-select from meta-row/form-row so CSS gaps collapse
    document.querySelectorAll('.meta-row.open-select, .form-row.open-select').forEach(m => {
      try { m.classList.remove('open-select'); } catch(e) {}
      try { m.style.removeProperty('--open-gap'); m.style.removeProperty('--open-gap-mobile'); } catch(e) {}
    });

    // 3) If ctypeWrap panel is expanded, collapse it and restore detect-note margin
    const cw = document.getElementById('ctypeWrap');
    if (cw) {
      try {
        cw.style.maxHeight = '0px';
        cw.style.opacity = '0';
        cw.style.pointerEvents = 'none';
        cw.setAttribute('aria-hidden', 'true');
      } catch(e) {}
      try { if (typeof setDetectNoteMargin === 'function') setDetectNoteMargin('30px'); } catch(e) {}
    }
  } catch (err) {
    console.warn('closeAllOpenSelects error', err);
  }
}




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
      try { setSelectEnabled(sourceSelect, false); } catch (e) { try { sourceSelect.disabled = true; } catch (e2) {} }
      try { const wrap = sourceSelect.closest && sourceSelect.closest('.cv-custom-select'); if (wrap) wrap.classList.add('disabled'); } catch (e) {}
    }

    // ORGAN: set to unknown if possible, then disable + visually mark disabled
    if (organSelect) {
      setToUnknownAndUpdateUI(organSelect);
      try { setSelectEnabled(organSelect, false); } catch (e) { try { organSelect.disabled = true; } catch (e2) {} }
      try { const wrap = organSelect.closest && organSelect.closest('.cv-custom-select'); if (wrap) wrap.classList.add('disabled'); } catch (e) {}
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

      try { setSelectEnabled(subtypeSelect, false); } catch (e) { try { subtypeSelect.disabled = true; } catch (e2) {} }
      try { const wrap = subtypeSelect.closest && subtypeSelect.closest('.cv-custom-select'); if (wrap) wrap.style.display = 'none'; } catch (e) {}
    }

    // GROUND TRUTH: set to unknown if possible, then disable + visually mark
    if (groundTruthSelect) {
      setToUnknownAndUpdateUI(groundTruthSelect);
      try { setSelectEnabled(groundTruthSelect, false); } catch (e) { try { groundTruthSelect.disabled = true; } catch (e2) {} }
      try { const wrap = groundTruthSelect.closest && groundTruthSelect.closest('.cv-custom-select'); if (wrap) wrap.classList.add('disabled'); } catch (e) {}
    }

  } catch (err) {
    // fail-safe: attempt to disable all selects if something unexpected happens
    try { if (sourceSelect) setSelectEnabled(sourceSelect, false); } catch (e) {}
    try { if (organSelect) setSelectEnabled(organSelect, false); } catch (e) {}
    try { if (subtypeSelect) setSelectEnabled(subtypeSelect, false); } catch (e) {}
    try { if (groundTruthSelect) setSelectEnabled(groundTruthSelect, false); } catch (e) {}
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
        else { sourceSelect.disabled = false; try { sourceSelect.style.pointerEvents = ''; sourceSelect.style.opacity = ''; } catch (e) {} }
        try {
          const wrap = sourceSelect.closest && sourceSelect.closest('.cv-custom-select');
          if (wrap) {
            const btn = wrap.querySelector('.cv-selected .cv-text') || wrap.querySelector('.cv-selected');
            const selectedOpt = Array.from(sourceSelect.options).find(o => o.value === sourceSelect.value);
            if (btn) btn.textContent = selectedOpt ? (selectedOpt.textContent || selectedOpt.value) : '';
          }
        } catch (e) {}
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
        else { groundTruthSelect.disabled = false; try { groundTruthSelect.style.pointerEvents = ''; groundTruthSelect.style.opacity = ''; } catch (e) {} }

        try {
          const wrap = groundTruthSelect.closest && groundTruthSelect.closest('.cv-custom-select');
          if (wrap) {
            const btn = wrap.querySelector('.cv-selected .cv-text') || wrap.querySelector('.cv-selected');
            const selectedOpt = Array.from(groundTruthSelect.options).find(o => o.value === groundTruthSelect.value);
            if (btn) btn.textContent = selectedOpt ? (selectedOpt.textContent || selectedOpt.value) : '';
          }
        } catch (e) {}
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
      // remove the uploaded file and notify the user so state remains predictable.
      try {
        if (pickedFile && prevMode !== mode) {
          if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
            window.__cv_toast.show({
              title: 'Mode changed',
              message: 'Detection mode changed — uploaded image removed.',
              timeout: 2200
            });
          } else {
            try { alert('Detection mode changed — uploaded image removed.'); } catch (e) { /* ignore */ }
          }
          try { resetFile(); } catch (e) { console.warn('resetFile failed during mode change', e); }
          // focus ctype2 if switched to manual so user can re-select
          try { if (mode === 'manual' && ctype2) ctype2.focus(); } catch (e) { /* ignore */ }
        }
      } catch (e) {
        console.warn('mode-change file clear failed', e);
      }
      // ===== end NEW =====

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

    /* -----------------------
      Dropzone + file handling
      ----------------------- */
    if (dz && fileInp) {
      dz.addEventListener('click', () => {
        // if mandatory not filled, block click and show hint
        if (!mandatoryDetailsFilled()) {
         // Collapse open selects AND undo any visual preview shift + heading swap
try {
  // 1) close custom selects and meta-row gaps (your helper)
  if (typeof closeAllOpenSelects === 'function') closeAllOpenSelects();

  // 2) remove any visual shift applied to upload-block (hooks define this)
  if (typeof removeVisualShift === 'function') {
    try { removeVisualShift(); } catch (e) { /* ignore */ }
  } else if (window.__cv_debug && typeof window.__cv_debug.removeVisualShift === 'function') {
    try { window.__cv_debug.removeVisualShift(); } catch (e) { /* ignore */ }
  }

  // 3) restore heading if the "Preview Uploaded Image" heading was moved
  if (window.__cv_debug && typeof window.__cv_debug.restoreOriginalHeading === 'function') {
    try { window.__cv_debug.restoreOriginalHeading(); } catch (e) { /* ignore */ }
  }

  // 4) also ensure ctypeWrap inline styles collapsed (defensive)
  const cw = document.getElementById('ctypeWrap');
  if (cw) {
    try {
      cw.style.maxHeight = '0px';
      cw.style.opacity = '0';
      cw.style.pointerEvents = 'none';
      cw.setAttribute('aria-hidden', 'true');
    } catch (e) {}
  }

  // 5) remove open classes from any cv-custom-select left behind (defensive)
  document.querySelectorAll('.cv-custom-select.open').forEach(w => {
    try { w.classList.remove('open'); w.querySelector('.cv-selected')?.setAttribute('aria-expanded','false'); } catch(e) {}
  });

  // 6) remove open-select class from meta rows too (defensive)
  document.querySelectorAll('.meta-row.open-select, .form-row.open-select').forEach(m => {
    try { m.classList.remove('open-select'); } catch(e) {}
    try { m.style.removeProperty('--open-gap'); m.style.removeProperty('--open-gap-mobile'); } catch(e) {}
  });
} catch (err) {
  // silent
  console.warn('defensive-collapse failed', err);
}

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
           // Collapse open selects AND undo any visual preview shift + heading swap
try {
  // 1) close custom selects and meta-row gaps (your helper)
  if (typeof closeAllOpenSelects === 'function') closeAllOpenSelects();

  // 2) remove any visual shift applied to upload-block (hooks define this)
  if (typeof removeVisualShift === 'function') {
    try { removeVisualShift(); } catch (e) { /* ignore */ }
  } else if (window.__cv_debug && typeof window.__cv_debug.removeVisualShift === 'function') {
    try { window.__cv_debug.removeVisualShift(); } catch (e) { /* ignore */ }
  }

  // 3) restore heading if the "Preview Uploaded Image" heading was moved
  if (window.__cv_debug && typeof window.__cv_debug.restoreOriginalHeading === 'function') {
    try { window.__cv_debug.restoreOriginalHeading(); } catch (e) { /* ignore */ }
  }

  // 4) also ensure ctypeWrap inline styles collapsed (defensive)
  const cw = document.getElementById('ctypeWrap');
  if (cw) {
    try {
      cw.style.maxHeight = '0px';
      cw.style.opacity = '0';
      cw.style.pointerEvents = 'none';
      cw.setAttribute('aria-hidden', 'true');
    } catch (e) {}
  }

  // 5) remove open classes from any cv-custom-select left behind (defensive)
  document.querySelectorAll('.cv-custom-select.open').forEach(w => {
    try { w.classList.remove('open'); w.querySelector('.cv-selected')?.setAttribute('aria-expanded','false'); } catch(e) {}
  });

  // 6) remove open-select class from meta rows too (defensive)
  document.querySelectorAll('.meta-row.open-select, .form-row.open-select').forEach(m => {
    try { m.classList.remove('open-select'); } catch(e) {}
    try { m.style.removeProperty('--open-gap'); m.style.removeProperty('--open-gap-mobile'); } catch(e) {}
  });
} catch (err) {
  // silent
  console.warn('defensive-collapse failed', err);
}

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
        if (thumb2) thumb2.style.display = 'none';
        if (finfo && /\.dcm$/.test(lower)) finfo.textContent += ' • DICOM preview unavailable';
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
  function resetFile(doScroll = true) {
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

    // remove runtime class  
    if (uploadBlock) uploadBlock.classList.remove('has-preview');
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
      // return segmented control to Auto
      try { setMode('auto'); } catch (e) { /* ignore */ }

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
    heading = heading || findHeading();
    if (!heading) return;
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
  }

  function restoreOriginalHeading() {
    heading = heading || findHeading();
    if (!heading) return;
    heading.textContent = original.text || heading.textContent;
    heading.style.textAlign = original.textAlign || '';
    heading.style.marginTop = original.marginTop || '';
    heading.style.marginBottom = original.marginBottom || '';
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

  // Hook into existing handleFile/resetFile (wrap them)
  try {
    if (typeof handleFile === 'function') {
      const _hf = handleFile;
      handleFile = function (file) {
        const r = _hf.apply(this, arguments);
        // schedule after UI updates
        requestAnimationFrame(() => setTimeout(applyPreviewHeading, 40));
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
  try { window.__cv_debug = window.__cv_debug || {}; window.__cv_debug.applyPreviewHeading = applyPreviewHeading; window.__cv_debug.restoreOriginalHeading = restoreOriginalHeading; } catch (e) {}
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
  if (!v) { showInputError(el, 'First name required'); 
    // show chip (red-ish) but keep original error text
    showFieldChip(el, 'Required', { color: '#f8d7da', textColor: '#721c24' });
    return false;
  }
  if (!nameRegex.test(v) || !letterRegex.test(v)) { showInputError(el, 'Invalid name');
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
  if (!v) { showInputError(el, 'Last name required (or use . if none)'); 
    showFieldChip(el, 'Required', { color: '#f8d7da', textColor: '#721c24' });
    return false;
  }
  if (!nameRegex.test(v) || !letterRegex.test(v)) { showInputError(el, 'Invalid last name');
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
  if (!m) { showInputError(el, 'Enter BP as Systolic/Diastolic (e.g., 120/80)');
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
  if (!m) { showInputError(el, 'Enter blood sugar numeric (e.g., 95)');
    showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
    return false;
  }
  const val = +m[1];
  if (val < 20 || val > 1000) { showInputError(el, 'Blood sugar value appears unrealistic. Please verify the entry.');
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
  if (!m) { showInputError(el, 'Enter haemoglobin in g/dL (e.g., 13.5)');
    showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
    return false;
  }
  const val = +m[1];
  if (val < 3 || val > 30) { showInputError(el, 'Haemoglobin value appears outside the normal range. Please recheck.');
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
      const ok = canRunAnalysis();
      if (!ok) {
        validateAge2(); validateFirstName(); validateLastName(); validateGender(); validateBP(); validateSugar(); validateHB();
        return;
      }

      if (res2) res2.innerHTML = '';
      analyze2.innerHTML = '<span class="spinner"></span> Analyzing...';
      analyze2.disabled = true;

      setTimeout(() => {
        const pool = [
          { l: 'No suspicious findings', p: 0.06, e: 'Low probability detected.' },
          { l: 'Lung — Suspicious', p: 0.83, e: 'Possible lung abnormality.' },
          { l: 'Breast — Suspicious', p: 0.68, e: 'Possible suspicious area.' },
          { l: 'Skin — High risk', p: 0.91, e: 'Atypical skin lesion detected.' },
          { l: 'Brain — Indeterminate', p: 0.64, e: 'Recommend further MRI.' }
        ];
        const pick = pool[Math.floor(Math.random() * pool.length)];
        if (res2) {
          res2.innerHTML = `<div class="result"><div style="font-weight:800">${pick.l}</div><div style="margin-top:6px">${pick.e}</div><div style="margin-top:8px;font-size:20px;font-weight:800;color:var(--accent)">${Math.round(pick.p * 100)}% Confidence</div></div>`;
        }
        analyze2.innerHTML = 'Analyze';
        updateAnalyzeState();
      }, 1200);
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
      if (e.key === 'ArrowDown') { e.preventDefault(); const first = opts.querySelector('.cv-option'); if(first) first.focus(); }
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
.cv-toast-title{font-size:22px;font-weight:800;margin:0}
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

      // safe render of chips into #ctypeSelected
      function renderChips() {
        if (!selectedContainer) return;
        selectedContainer.innerHTML = '';

        // normalize hidden value if present
        const hiddenVal = (hiddenInput && hiddenInput.value) ? (hiddenInput.value || '').toString().trim() : '';
        // fallback: use our internal selected[] if hidden not present
        const visibleCount = selected.length;

        // If neither hidden input nor selected array has values, treat as empty
        if (!visibleCount && !hiddenVal) {
          selectedContainer.style.display = 'none';
          if (hiddenInput) hiddenInput.value = '';
          // sync file-details (no selection)
          try { if (currentMode === 'manual') syncFileDetailsToMode(); } catch (e) { }

          // === Robust guard: if there is an uploaded file and we are in manual mode, clear it ===
          try {
            if (pickedFile && currentMode === 'manual') {
              // show toast if available
              if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
                window.__cv_toast.show({
                  title: 'Selection required',
                  message: 'You cleared cancer type selection — uploaded image has been removed.',
                  timeout: 2200
                });
              } else {
                try { alert('You cleared cancer type selection — uploaded image has been removed.'); } catch (e) {/*ignore*/ }
              }

              // reset the uploaded file visually + state (do not scroll/focus to firstName when triggered by chip clear)
              try { resetFile(false); } catch (e) { console.warn('resetFile failed after ctype cleared', e); }
              // focus the ctype select so user can re-select quickly
              try { if (ctype2) ctype2.focus(); } catch (e) { }
            }
          } catch (e) {
            console.warn('post-clear uploaded-file guard failed', e);
          }

          return;
        }

        // render chips for each selected item (selected[] takes precedence)
        selectedContainer.style.display = 'flex';
        const renderList = selected.length ? selected : (hiddenVal ? hiddenVal.split(',').map(s => s.trim()).filter(Boolean) : []);
        renderList.forEach(val => {
          // find option label (fallback to value)
          let opt = null;
          try {
            if (ctype2) opt = ctype2.querySelector(`option[value="${CSS.escape ? CSS.escape(val) : val}"]`);
          } catch (e) { /* ignore CSS.escape issues */ }
          if (!opt && ctype2) {
            Array.from(ctype2.options).forEach(o => { if (o.value === val) opt = o; });
          }
          const label = opt ? (opt.textContent || opt.value) : val;
          const chip = document.createElement('div');
          chip.className = 'chip';
          chip.setAttribute('data-value', val);
          chip.innerHTML = `<span class="chip-label">${label}</span><span class="chip-x" role="button" aria-label="Remove ${label}">×</span>`;
          // improved removal handler: remove DOM immediately, then update internal state
          const removeBtn = chip.querySelector('.chip-x');
          removeBtn.addEventListener('click', (ev) => {
            ev && ev.preventDefault();
            // remove the chip element immediately so UI is responsive
            try { chip.remove(); } catch (e) { /* ignore if not supported */ }
            // now update internal store + re-render / state
            removeValue(val);
          });

          selectedContainer.appendChild(chip);
        });

        // update hidden input reliably
        try { if (hiddenInput) hiddenInput.value = selected.join(','); } catch (e) { /* ignore */ }

        // --- update file-details UI based on selection count when chips change ---
        try {
          if (currentMode === 'manual') {
            if (selected.length === 0) {
              applySingleManualFileDetails(null);
            } else if (selected.length === 1) {
              applySingleManualFileDetails(selected[0]);
            } else {
              applyLockedFileDetails();
            }
          } else {
            // if auto mode, enforce locked
            applyLockedFileDetails();
          }
        } catch (e) { /* ignore */ }
      }

      // observe hidden input changes (handles external clears / programmatic changes)
      try {
        if (hiddenInput && typeof MutationObserver !== 'undefined') {
          const mo = new MutationObserver(() => {
            try {
              const hv = (hiddenInput.value || '').toString().trim();
              // if hiddenInput becomes empty while in manual mode and a file is uploaded, clear file
              if (!hv && pickedFile && currentMode === 'manual') {
                if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
                  window.__cv_toast.show({
                    title: 'Selection required',
                    message: 'Cancer type selection cleared — uploaded image has been removed.',
                    timeout: 2200
                  });
                } else {
                  try { alert('Cancer type selection cleared — uploaded image has been removed.'); } catch (e) { /* ignore */ }
                }
                try { resetFile(false); } catch (e) { console.warn('resetFile failed in observer', e); }
                try { if (ctype2) ctype2.focus(); } catch (e) { /* ignore */ }
              }
            } catch (e) { /* ignore */ }
          });
          mo.observe(hiddenInput, { attributes: true, attributeFilter: ['value'], subtree: false, characterData: true, childList: true });
          // also store observer so we can.disconnect later if needed
          hiddenInput.__cv_mutation_observer = mo;
        }
      } catch (e) { /* ignore if MutationObserver not available */ }

      // add a value
      function addValue(val) {
        if (!val) return;
        if (selected.includes(val)) return;
        if (selected.length >= maxSelect) {
          // Use center toast if available, otherwise fallback to inline
          if (window.__cv_toast && typeof window.__cv_toast.show === 'function') {
            window.__cv_toast.show({ message: `You can select up to ${maxSelect} items only.`, title: 'Selection limit', timeout: 2600 });
          } else {
            showTempMessage(`You can select up to ${maxSelect} items only.`);
          }
          return;
        }
        selected.push(val);
        // update hiddenInput immediately so renderChips reads the freshest value
        try { if (hiddenInput) hiddenInput.value = selected.join(','); } catch (e) { /* ignore */ }
        renderChips();
         try { syncFileDetailsToMode(); } catch (e) { /* ignore */ }
  try { updateAnalyzeState(); } catch (e) { /* ignore */ }
      }

      // remove a value
      // --- replace the existing removeValue function with this ---
      function removeValue(val) {
        if (!val) return;
        selected = selected.filter(v => v !== val);
        // update hiddenInput immediately before re-render so no stale fallback happens
        try { if (hiddenInput) hiddenInput.value = selected.join(','); } catch (e) { /* ignore */ }
        renderChips();
        updateAnalyzeState(); // analysis pre-check uses hidden value
         // <-- NEW: sync UI after removing
  try { syncFileDetailsToMode(); } catch (e) { /* ignore */ }
  try { updateAnalyzeState(); } catch (e) { /* ignore */ }

        // --- NEW: keep focus on detection options after removing a chip ---
        try {
          if (ctype2) {
            // small timeout ensures DOM updates from renderChips() are applied
            setTimeout(() => {
              try { ctype2.focus(); } catch (e) { /* ignore */ }
            }, 20);
          }
        } catch (e) { /* ignore */ }
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
            try { ctype2.value = ''; } catch (err) { /* ignore */ }
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

 // === Robust visual right + down shift on preview (replace previous hook block) ===
(function installRightShiftHooks() {
  const RIGHT_SHIFT_PX = 750; // how far to move right (px). tweak up/down
  const DOWN_SHIFT_PX = 195; // how far to move down (px). tweak up/down
  const TRANSITION = 'transform 260ms ease, margin-top 260ms ease';

  function applyVisualShift() {
  const uploadBlock = document.querySelector('.upload-block');
  if (!uploadBlock) return;
  // SAFETY GUARD: only apply if a preview is actually active
  if (!uploadBlock.classList.contains('has-preview')) return;

  try {
    uploadBlock.classList.add('preview-right');
    if (typeof uploadBlock.__cv_prev_shift === 'undefined') {
      uploadBlock.__cv_prev_shift = {
        transform: uploadBlock.style.transform || '',
        transition: uploadBlock.style.transition || '',
        marginTop: uploadBlock.style.marginTop || '',
      };
    }
    uploadBlock.style.transition = uploadBlock.style.transition || TRANSITION;
    uploadBlock.style.transform = `translateX(${RIGHT_SHIFT_PX}px)`;
    uploadBlock.style.marginTop = `${DOWN_SHIFT_PX}px`;
  } catch (e) { console.warn('applyVisualShift failed', e); }
}


  function removeVisualShift() {
    const uploadBlock = document.querySelector('.upload-block');
    if (!uploadBlock) return;
    try {
      uploadBlock.classList.remove('preview-right');

      // restore previous inline styles if stored
      const prev = uploadBlock.__cv_prev_shift || {};
      uploadBlock.style.transform = typeof prev.transform !== 'undefined' ? prev.transform : '';
      uploadBlock.style.marginTop = typeof prev.marginTop !== 'undefined' ? prev.marginTop : '';
      uploadBlock.style.transition = typeof prev.transition !== 'undefined' ? prev.transition : '';
      delete uploadBlock.__cv_prev_shift;
    } catch (e) { console.warn('removeVisualShift failed', e); }
  }// REPLACE the existing hookHandleFile() implementation with this safe version:
function hookHandleFile() {
  if (typeof handleFile !== 'function') return;
  const orig = handleFile;
  handleFile = function (file) {
    // call original handler first (it may block early)
    const r = orig.apply(this, arguments);

    // schedule a guarded visual shift only if preview is actually active
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const uploadBlock = document.querySelector('.upload-block');
          // Only apply the visual shift if the upload-block currently has a preview
          if (uploadBlock && uploadBlock.classList.contains('has-preview')) {
            applyVisualShift();
          } else {
            // ensure we do NOT accidentally leave a transform from a previous run
            // (best-effort cleanup)
            try { 
              if (uploadBlock && uploadBlock.style && uploadBlock.style.transform) {
                // do not remove transform here forcibly unless necessary; removeVisualShift will handle restore
                // but as safe-guard:
                // uploadBlock.style.transform = '';
              }
            } catch (e) { /* ignore */ }
          }
        } catch (e) { console.warn('guarded hookHandleFile error', e); }
      }, 40);
    });

    return r;
  };
}

  function hookResetFile() {
    if (typeof resetFile !== 'function') return;
    const orig = resetFile;
    resetFile = function(doScroll) {
      const r = orig.apply(this, arguments);
      // remove shift after reset - small delay so DOM restored
      requestAnimationFrame(() => { setTimeout(removeVisualShift, 40); });
      return r;
    };
  }

  try { hookHandleFile(); } catch (e) { /* ignore */ }
  try { hookResetFile(); } catch (e) { /* ignore */ }

  // expose small helpers for debugging
  try { window.__cv_debug = window.__cv_debug || {}; window.__cv_debug.applyVisualShift = applyVisualShift; window.__cv_debug.removeVisualShift = removeVisualShift; } catch (e) {}
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


})();



