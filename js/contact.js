document.addEventListener('DOMContentLoaded', function () {
  function showInputError(el, msg) {
    if (!el || !el.parentNode) return;
    let e = el.parentNode.querySelector('.input-error');
    if (!e) {
      e = document.createElement('small');
      e.className = 'input-error';
      e.style.color = '#c0392b';
      e.style.display = 'block';
      e.style.fontSize = '12px';
      e.style.marginTop = '6px';
      el.parentNode.appendChild(e);
    }
    e.textContent = msg;
  }
  function clearInputError(el) {
    if (!el || !el.parentNode) return;
    const e = el.parentNode.querySelector('.input-error');
    if (e) e.remove();
  }

  function positionChipForInput(el, chip) {
    if (!el || !chip) return;
    try {
      const inputOffsetTop = el.offsetTop || 0;
      const inputHeight = el.offsetHeight || el.clientHeight || 36;
      const topInsideWrap = inputOffsetTop + Math.round(inputHeight / 2);

      chip.style.top = topInsideWrap + 'px';
      chip.style.transform = 'translateY(-50%)';
    } catch (err) {
      chip.style.top = '50%';
      chip.style.transform = 'translateY(-50%)';
    }
  }

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
        chip.style.transform = 'translateY(-50%)';
        chip.style.pointerEvents = 'none';
        chip.style.zIndex = 6;
        chip.style.display = 'inline-block';
        chip.style.whiteSpace = 'nowrap';
        chip.style.padding = '6px 10px';
        chip.style.borderRadius = '8px';
        chip.style.fontWeight = '700';
        chip.style.fontSize = '0.9rem';
      }
      chip.textContent = message || '';
      if (opts.color) chip.style.background = opts.color;
      else chip.style.background = '#fff2f2';
      if (opts.textColor) chip.style.color = opts.textColor;
      else chip.style.color = '#721c24';
      chip.style.opacity = '1';
      chip.style.visibility = 'visible';
      positionChipForInput(el, chip);
      if (!chip._chipBound) {
        const reposition = () => positionChipForInput(el, chip);
        chip._chipBound = reposition;
        window.addEventListener('resize', reposition, { passive: true });
        window.addEventListener('scroll', reposition, { passive: true });
      }
    } catch (e) { console.warn('showFieldChip failed', e); }
  }

  function removeFieldChip(el) {
    try {
      if (!el) return;
      const wrap = el.closest('.age-input-wrap') || el.parentElement || null;
      if (!wrap) return;
      const chip = wrap.querySelector('.field-chip.age-badge');
      if (chip) {
        if (chip._chipBound) {
          window.removeEventListener('resize', chip._chipBound);
          window.removeEventListener('scroll', chip._chipBound);
        }
        chip.remove();
      }
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


    if (!v) {
      showInputError(el, 'First name required');
      showFieldChip(el, 'Required', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }

    if (!nameRegex.test(v) || !letterRegex.test(v)) {
      showInputError(el, 'Invalid name');
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }


    if (containsBlockedWord(v)) {
      showInputError(el, 'Inappropriate words not allowed');
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


    if (containsBlockedWord(v)) {
      showInputError(el, 'Inappropriate words not allowed');
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      return false;
    }

    clearInputError(el);
    removeFieldChip(el);
    return true;
  }

  const form = document.getElementById('contactForm');

  if (form) {

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const required = ['firstName', 'lastName', 'email', 'prefContact', 'type', 'subject', 'message', 'consent'];
      let valid = true;

      required.forEach(id => {
        const hint = document.getElementById(id + 'Hint');
        if (hint) hint.textContent = '';
      });


      if (!validateFirstName()) valid = false;
      if (!validateLastName()) valid = false;


      required.forEach(id => {
        const el = document.getElementById(id);
        const hint = document.getElementById(id + 'Hint');
        if (!el) return;
        if (id === 'firstName' || id === 'lastName') return;

        if (el.type === 'checkbox') {
          if (!el.checked) {
            if (hint) hint.textContent = 'Please check to proceed.';
            valid = false;
          }
        } else {
          const value = (el.value || '').toString().trim();
          if (!value) {
            if (hint) hint.textContent = 'This field is required.';
            valid = false;
          } else if (id === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
            if (hint) hint.textContent = 'Enter a valid email address.';
            valid = false;
          }
        }
      });

     if (valid) {
showAppModal('Message Sent Successfully', 'Your message has been successfully sent. Our team will get back to you soon.');


}
else {
        const firstInvalid = required.find(id => {
          const el = document.getElementById(id);
          if (!el) return false;
          if (el.type === 'checkbox') return !el.checked;
          return !(el.value || '').toString().trim();
        });
        if (firstInvalid) {
          const el = document.getElementById(firstInvalid);
          if (el && typeof el.focus === 'function') el.focus();
        }
      }
    });


    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(inp => {
      ['input', 'change'].forEach(evt =>
        inp.addEventListener(evt, () => {
          const hint = document.getElementById(inp.id + 'Hint');
          if (hint) hint.textContent = '';
        })
      );
    });


    const fEl = document.getElementById('firstName');
    const lEl = document.getElementById('lastName');
    if (fEl) {
      fEl.addEventListener('input', () => { clearInputError(fEl); removeFieldChip(fEl); });
      fEl.addEventListener('input', validateFirstName);
      fEl.addEventListener('blur', validateFirstName);
    }
    if (lEl) {
      lEl.addEventListener('input', () => { clearInputError(lEl); removeFieldChip(lEl); });
      lEl.addEventListener('input', validateLastName);
      lEl.addEventListener('blur', validateLastName);
    }
  }

  const iconsContainer = document.querySelector('.floating-icons');
  if (iconsContainer) {
    const icons = ['fa-phone-alt', 'fa-envelope'];

    function spawnIcon() {
      const icon = document.createElement('i');
      icon.classList.add('fas', icons[Math.floor(Math.random() * icons.length)]);
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;
      const size = 30 + Math.random() * 25;
      const dur = 6 + Math.random() * 4;
      icon.style.left = `${x}px`;
      icon.style.top = `${y}px`;
      icon.style.fontSize = `${size}px`;
      icon.style.setProperty('--tx', `${tx}px`);
      icon.style.setProperty('--ty', `${ty}px`);
      icon.style.animationDuration = `${dur}s`;
      iconsContainer.appendChild(icon);
      setTimeout(() => {
        if (icon && icon.parentNode) icon.parentNode.removeChild(icon);
      }, (dur + 1) * 1000);
    }

    const spawnInterval = setInterval(spawnIcon, 1500);
    for (let i = 0; i < 6; i++) setTimeout(spawnIcon, i * 400);
    window.addEventListener('beforeunload', () => clearInterval(spawnInterval));
  }


  (function setupAttachmentUI() {
    let fileInput = document.getElementById('attachment');
    if (!fileInput) return;

    const field = fileInput.closest('.field') || fileInput.parentElement;
    if (field && getComputedStyle(field).position === 'static') {
      field.style.position = 'relative';
    }


    let filenameSpan = field.querySelector('.custom-file-name');
    if (!filenameSpan) {
      filenameSpan = document.createElement('span');
      filenameSpan.className = 'custom-file-name';
      filenameSpan.style.display = 'none';
      field.appendChild(filenameSpan);
    }


    let removeBtn = field.querySelector('.attachment-remove');
    if (!removeBtn) {
      removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'attachment-remove';
      removeBtn.textContent = 'Remove';
      removeBtn.style.display = 'none';
      field.appendChild(removeBtn);
    }

    function updateUIForFile(el) {
      const file = el.files && el.files[0];
      if (file) {
        field.classList.add('file-picked');
        filenameSpan.textContent = file.name;
        filenameSpan.style.display = '';
        removeBtn.style.display = 'inline-block';
      } else {
        field.classList.remove('file-picked');
        filenameSpan.textContent = '';
        filenameSpan.style.display = 'none';
        removeBtn.style.display = 'none';
      }
    }

    fileInput.addEventListener('change', function () {
      updateUIForFile(this);
    });

    removeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      try { fileInput.value = ''; } catch (err) { }
      if (fileInput && fileInput.value) {
        const newInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newInput, fileInput);
        fileInput = newInput;
        fileInput.addEventListener('change', function () { updateUIForFile(this); });
      }
      updateUIForFile(document.getElementById('attachment'));
    });

    if (form) {
      form.addEventListener('reset', () => {
        setTimeout(() => {
          const cur = document.getElementById('attachment');
          if (cur) {
            try { cur.value = ''; } catch (err) { }
            updateUIForFile(cur);
          }
        }, 10);
      });
    }

    updateUIForFile(fileInput);
  })();



  function runInitialValidation() {
    try {
      validateFirstName && validateFirstName();
      validateLastName && validateLastName();


      validateContactNumber && validateContactNumber();
      validateEmail && validateEmail();
      validateSubject && validateSubject();
      validateMessage && validateMessage();


      const otherRequired = ['email', 'prefContact', 'type', 'subject', 'message', 'consent'];
      otherRequired.forEach(id => {
        const el = document.getElementById(id);
        const hint = document.getElementById(id + 'Hint');
        if (!el) return;

        if (el.type === 'checkbox') {
          if (!el.checked && hint) hint.textContent = 'Please check to proceed.';
        } else {
          const v = (el.value || '').toString().trim();
          if (!v && hint) hint.textContent = 'This field is required.';
        }
      });
    } catch (e) {
      console.warn('initial validation failed', e);
    }
  }

  function validateContactNumber() {
    const el = document.getElementById('contactNumber') || document.getElementById('phone');
    const hintId = (document.getElementById('contactNumberHint') ? 'contactNumberHint' : 'phoneHint');
    const hint = document.getElementById(hintId);
    if (!el) return true;
    const val = (el.value || '').trim();

    const indiaRegex = /^(?:\+91[\-\s]?)?[6-9]\d{9}$/;
    const universalRegex = /^\+?[0-9\s\-()]{7,15}$/;

    removeFieldChip(el);
    if (hint) hint.textContent = '';

    if (!val) {
      showFieldChip(el, 'Required', { color: '#f6dfdf', textColor: '#7a1f1f' });
      if (hint) hint.textContent = 'Contact number required';
      el.classList.add('input-error-border');
      return false;
    }

    if (indiaRegex.test(val) || universalRegex.test(val)) {
      removeFieldChip(el);
      if (hint) hint.textContent = '';
      el.classList.remove('input-error-border');
      return true;
    }

    showFieldChip(el, 'Invalid', { color: '#f6dfdf', textColor: '#7a1f1f' });
    if (hint) hint.textContent = 'Enter a valid phone number (Indian or international)';
    el.classList.add('input-error-border');
    return false;
  }

  const phoneEl = document.getElementById('contactNumber') || document.getElementById('phone');
  if (phoneEl) {
    phoneEl.addEventListener('input', validateContactNumber); // live validation
    phoneEl.addEventListener('blur', validateContactNumber);
  }

  function validateEmail() {
    const emailInput = document.getElementById('email');
    const hint = document.getElementById('emailHint');
    const value = (emailInput.value || '').trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    removeFieldChip(emailInput);
    if (hint) hint.textContent = '';

    if (!value) {
      showFieldChip(emailInput, 'Required', { color: '#f6dfdf', textColor: '#7a1f1f' });
      if (hint) hint.textContent = 'Email address required';
      emailInput.classList.add('input-error-border');
      return false;
    }

    if (!emailRegex.test(value)) {
      showFieldChip(emailInput, 'Invalid', { color: '#f6dfdf', textColor: '#7a1f1f' });
      if (hint) hint.textContent = 'Enter a valid email (e.g., example@gmail.com)';
      emailInput.classList.add('input-error-border');
      return false;
    }

    removeFieldChip(emailInput);
    if (hint) hint.textContent = '';
    emailInput.classList.remove('input-error-border');
    return true;
  }

  const emailEl = document.getElementById('email');
  if (emailEl) {
    emailEl.addEventListener('input', validateEmail); // live validation
    emailEl.addEventListener('blur', validateEmail);
  }


  function validateSubject() {
    const subjectInput = document.getElementById('subject');
    const hint = document.getElementById('subjectHint');
    const value = (subjectInput.value || '').trim().toLowerCase();

    removeFieldChip(subjectInput);
    if (hint) hint.textContent = '';

    if (!value) {
      showFieldChip(subjectInput, 'Required', { color: '#f6dfdf', textColor: '#7a1f1f' });
      if (hint) hint.textContent = 'Subject is required';
      subjectInput.classList.add('input-error-border');
      return false;
    }

    const blockedWords = ["fuck", "bitch", "asshole", "sex", "nude", "porn", "kill", "rape", "terror", "drugs", "suicide", "murder", "bomb", "attack", "stupid", "idiot", "shit", "bastard", "bloody", "hate"];
    const found = blockedWords.some(word => value.includes(word));

    if (found) {
      showFieldChip(subjectInput, 'Invalid', { color: '#f6dfdf', textColor: '#7a1f1f' });
      if (hint) hint.textContent = 'Inappropriate or abusive words are not allowed';
      subjectInput.classList.add('input-error-border');
      return false;
    }

    removeFieldChip(subjectInput);
    if (hint) hint.textContent = '';
    subjectInput.classList.remove('input-error-border');
    return true;
  }

  const subjectEl = document.getElementById('subject');
  if (subjectEl) {
    subjectEl.addEventListener('input', validateSubject);
    subjectEl.addEventListener('blur', validateSubject);
  }


  function validateMessage() {
    const msgInput = document.getElementById('message');
    const hint = document.getElementById('msgHint');
    const value = (msgInput.value || '').trim().toLowerCase();

    removeFieldChip(msgInput);
    if (hint) hint.textContent = '';

    if (!value) {
      showFieldChip(msgInput, 'Required', { color: '#f6dfdf', textColor: '#7a1f1f' });
      if (hint) hint.textContent = 'Message cannot be empty';
      msgInput.classList.add('input-error-border');
      return false;
    }

    const blockedWordsMsg = ["fuck", "bitch", "asshole", "sex", "porn", "nude", "kill", "rape", "suicide", "murder", "bomb", "terror", "attack", "hate", "stupid", "idiot", "shit", "bastard", "bloody", "drugs", "gun", "weapon"];
    const foundMsg = blockedWordsMsg.some(word => value.includes(word));

    if (foundMsg) {
      showFieldChip(msgInput, 'Invalid', { color: '#f6dfdf', textColor: '#7a1f1f' });
      if (hint) hint.textContent = 'Inappropriate or abusive language is not allowed';
      msgInput.classList.add('input-error-border');
      return false;
    }

    removeFieldChip(msgInput);
    if (hint) hint.textContent = '';
    msgInput.classList.remove('input-error-border');
    return true;
  }

  const msgEl = document.getElementById('message');
  if (msgEl) {
    msgEl.addEventListener('input', validateMessage);
    msgEl.addEventListener('blur', validateMessage);
  }


  const _blockedShort = ["fuck", "bitch", "asshole", "sex", "nude", "porn", "kill", "rape", "terror", "drugs", "suicide", "murder", "bomb", "attack", "stupid", "idiot", "shit", "bastard", "bloody", "hate", "gun", "weapon"];


  function containsBlockedWord(val) {
    if (!val) return false;
    const s = val.toLowerCase();
    return _blockedShort.some(word => s.includes(word));
  }

  function validateAddress() {
    const el = document.getElementById('address');
    const hint = document.getElementById('addressHint');
    if (!el) return true;
    const v = (el.value || '').trim();


    if (!el._touched && !v) {
      clearInputError(el);
      removeFieldChip(el);
      if (hint) hint.textContent = '';
      return true;
    }


    if (!v) {
      clearInputError(el);
      removeFieldChip(el);
      if (hint) hint.textContent = '';
      return true;
    }


    if (containsBlockedWord(v)) {
      removeFieldChip(el);
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      if (hint) hint.textContent = 'Inappropriate words not allowed';
      return false;
    }


    if (v.length < 3 || !/[A-Za-z0-9]/.test(v)) {
      removeFieldChip(el);
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      if (hint) hint.textContent = 'Enter valid city/state/country';
      return false;
    }

    clearInputError(el);
    removeFieldChip(el);
    if (hint) hint.textContent = '';
    return true;
  }

  function validateOrg() {
    const el = document.getElementById('org');
    const hint = document.getElementById('orgHint');
    if (!el) return true;
    const v = (el.value || '').trim();


    if (!el._touched && !v) {
      clearInputError(el);
      removeFieldChip(el);
      if (hint) hint.textContent = '';
      return true;
    }

    if (!v) { clearInputError(el); removeFieldChip(el); if (hint) hint.textContent = ''; return true; }

    if (containsBlockedWord(v)) {
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      if (hint) hint.textContent = 'Inappropriate language detected';
      return false;
    }

    if (v.length < 2 || !/[A-Za-z]/.test(v)) {
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      if (hint) hint.textContent = 'Enter a valid organisation or company name';
      return false;
    }

    clearInputError(el); removeFieldChip(el); if (hint) hint.textContent = '';
    return true;
  }

  function validateRole() {
    const el = document.getElementById('role');
    const hint = document.getElementById('roleHint');
    if (!el) return true;
    const v = (el.value || '').trim();


    if (!el._touched && !v) {
      clearInputError(el);
      removeFieldChip(el);
      if (hint) hint.textContent = '';
      return true;
    }

    if (!v) { clearInputError(el); removeFieldChip(el); if (hint) hint.textContent = ''; return true; }

    if (containsBlockedWord(v)) {
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      if (hint) hint.textContent = 'Inappropriate language detected';
      return false;
    }

    if (v.length < 2 || !/[A-Za-z]/.test(v)) {
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      if (hint) hint.textContent = 'Enter a valid role (e.g., Researcher)';
      return false;
    }

    clearInputError(el); removeFieldChip(el); if (hint) hint.textContent = '';
    return true;
  }


  function validateLink() {
    const el = document.getElementById('link');
    const hint = document.getElementById('linkHint');
    if (!el) return true;
    const v = (el.value || '').trim();


    if (!el._touched && !v) {
      clearInputError(el);
      removeFieldChip(el);
      if (hint) hint.textContent = '';
      return true;
    }

    if (!v) { clearInputError(el); removeFieldChip(el); if (hint) hint.textContent = ''; return true; }

    if (containsBlockedWord(v)) {
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      if (hint) hint.textContent = 'Inappropriate language detected';
      return false;
    }

    const urlRegex = /^(https?:\/\/)?([^\s.]+\.)+[^\s]{2,}\/?.*$/i;
    if (!urlRegex.test(v)) {
      showFieldChip(el, 'Invalid', { color: '#f8d7da', textColor: '#721c24' });
      if (hint) hint.textContent = 'Enter a valid URL (e.g., https://linkedin.com/in/you)';
      return false;
    }

    clearInputError(el); removeFieldChip(el); if (hint) hint.textContent = '';
    return true;
  }

  ['address', 'org', 'role', 'link'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el._touched = false;
    el.addEventListener('blur', function () {
      el._touched = true;
      if (id === 'address') validateAddress();
      if (id === 'org') validateOrg();
      if (id === 'role') validateRole();
      if (id === 'link') validateLink();
    }, { passive: true });
    el.addEventListener('change', function () {
      el._touched = true;
      if (id === 'address') validateAddress();
      if (id === 'org') validateOrg();
      if (id === 'role') validateRole();
      if (id === 'link') validateLink();
    }, { passive: true });


  });
  function updatePreferredContactRequirement() {
    const pref = document.getElementById('prefContact');
    const email = document.getElementById('email');
    const phone = document.getElementById('contactNumber') || document.getElementById('phone');

    if (!pref || (!email && !phone)) return;

    const val = (pref.value || '').toLowerCase().trim();

    function toggleRequiredStarFor(el, show) {
      if (!el) return;
      const lab = document.querySelector(`label[for="${el.id}"]`);
      if (!lab) return;
      let starSpan = lab.querySelector('span.req-star, span[aria-hidden="true"].req-star');
      if (!starSpan) {
        const allSpans = lab.querySelectorAll('span');
        for (let s of allSpans) {
          if ((s.textContent || '').trim().includes('*')) {
            starSpan = s;
            break;
          }
        }
      }

      if (starSpan) {
        starSpan.style.display = show ? '' : 'none';
        return;
      }
      const labelText = lab.childNodes;
      for (let i = labelText.length - 1; i >= 0; i--) {
        const n = labelText[i];
        if (n.nodeType === Node.TEXT_NODE && (n.textContent || '').includes('*')) {
          const text = (n.textContent || '');
          const starIndex = text.lastIndexOf('*');
          if (starIndex >= 0) {
            const before = text.slice(0, starIndex);
            const after = text.slice(starIndex + 1);
            n.textContent = before + (after || '');
            const span = document.createElement('span');
            span.className = 'req-star';
            span.textContent = ' *';
            span.style.color = '#d43f3f';
            span.setAttribute('aria-hidden', 'true');
            span.style.display = show ? '' : 'none';
            lab.appendChild(span);
            return;
          }
        }
      }
    }

    function makeOptional(el) {
      if (!el) return;
      el.required = false;
      const hint = document.getElementById(el.id + 'Hint');
      if (hint) hint.textContent = '';
      removeFieldChip(el);
      el.classList.remove('input-error-border');
      clearInputError(el);
      toggleRequiredStarFor(el, false);
    }

    function makeRequired(el, runValidation = false, msg = 'This field is required.') {
      if (!el) return;
      el.required = true;
      const hint = document.getElementById(el.id + 'Hint');
      if (hint) hint.textContent = msg;
      toggleRequiredStarFor(el, true);
      if (runValidation) {
        if (el.id === 'email' && typeof validateEmail === 'function') validateEmail();
        if ((el.id === 'contactNumber' || el.id === 'phone') && typeof validateContactNumber === 'function') validateContactNumber();
      }
    }

    if (val === 'email') {
      makeRequired(email, true, 'Email is required when preferred contact is Email.');
      makeOptional(phone);
    } else if (val === 'phone' || val === 'contact' || val === 'contactnumber') {
      makeRequired(phone, true, 'Contact number is required when preferred contact is Phone.');
      makeOptional(email);
    } else {
      makeRequired(email, true);
      makeRequired(phone, true);
    }
  }

  const prefSelect = document.getElementById('prefContact');
  if (prefSelect) {
    ['change', 'input', 'blur', 'keyup'].forEach(ev =>
      prefSelect.addEventListener(ev, updatePreferredContactRequirement)
    );
    prefSelect.addEventListener('click', function () { setTimeout(updatePreferredContactRequirement, 0); });
    updatePreferredContactRequirement();
  }
  runInitialValidation();



  (function selectGapWithOverlay() {
    const selects = [
      document.getElementById('prefContact'),
      document.getElementById('type')
    ].filter(Boolean);
    if (!selects.length) return;
    let overlay = null;
    function ensureOverlay() {
      if (overlay) return overlay;
      overlay = document.createElement('div');
      overlay.className = 'select-gap-overlay';

      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: 50,
        background: 'transparent',
        pointerEvents: 'auto'
      });

      overlay.addEventListener('pointerdown', function (ev) {
        ev.preventDefault();
        document.querySelectorAll('.row.open-select').forEach(r => r.classList.remove('open-select'));
        removeOverlay();
      }, { passive: true });
      return overlay;
    }

    function attachOverlay() {
      const ov = ensureOverlay();
      if (!document.body.contains(ov)) document.body.appendChild(ov);
    }
    function removeOverlay() {
      if (!overlay) return;
      try { overlay.remove(); } catch (e) { }
    }

    function setRowOpen(selectEl, open) {
      const row = selectEl && selectEl.closest('.row');
      if (!row) return;
      if (open) row.classList.add('open-select');
      else row.classList.remove('open-select');
    }

    selects.forEach(sel => {
      sel._origPosition = sel.style.position || '';
      sel._origZ = sel.style.zIndex || '';
      sel.addEventListener('pointerdown', function (e) {
        if (e.button && e.button !== 0) return;
        setRowOpen(sel, true);
        try {
          sel.style.position = sel._origPosition || 'relative';
          sel.style.zIndex = 100;
        } catch (err) { }

        attachOverlay();
      }, { capture: true, passive: true });
      sel.addEventListener('focusin', function () {
        setRowOpen(sel, true);
        try {
          sel.style.position = sel._origPosition || 'relative';
          sel.style.zIndex = 100;
        } catch (err) { }
        attachOverlay();
      }, { passive: true });

      function clearAndClose() {
        setRowOpen(sel, false);
        removeOverlay();
        try {
          sel.style.zIndex = sel._origZ || '';
          sel.style.position = sel._origPosition || '';
        } catch (err) { }
      }
      sel.addEventListener('change', clearAndClose, { capture: true });
      sel.addEventListener('input', clearAndClose, { capture: true });
      sel.addEventListener('pointerup', clearAndClose, { passive: true });
      sel.addEventListener('blur', function () {
        setTimeout(() => {
          setRowOpen(sel, false);
          removeOverlay();
          try {
            sel.style.zIndex = sel._origZ || '';
            sel.style.position = sel._origPosition || '';
          } catch (err) { }
        }, 0);
      });
      window.addEventListener('beforeunload', () => {
        try { removeOverlay(); } catch (e) { }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.row.open-select').forEach(r => r.classList.remove('open-select'));
        removeOverlay();
      }
    });
  })();
  const resetBtn = document.querySelector('button[type="reset"], input[type="reset"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.setItem('focusFirstName', 'true');
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.location.reload();
    });
  }
  window.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('focusFirstName') === 'true') {
      localStorage.removeItem('focusFirstName');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const f = document.getElementById('firstName');
      if (f) {
        setTimeout(() => f.focus(), 250);
      }
    }
  });
  (function initSupportStars() {
    const container = document.querySelector('.support-stars');
    if (!container) return;
    const colors = ['#000000ff', '#00ffb3ff', '#ff0000ff', '#1e00ffff'];
    function svghtml(color) {
      return `<svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="${color}" d="M12 2.6l1.9 4.2 4.6.7-3.3 3.2.8 4.6L12 13.8 7.9 15.3l.8-4.6L5.4 7.5l4.6-.7L12 2.6z"/>
    </svg>`;
    }
    function spawnStar() {
      const s = document.createElement('div');
      s.className = 'star';
      const size = 22;
      s.style.setProperty('--star-size', size + 'px');
      const leftPct = 6 + Math.random() * 88;
      s.style.left = leftPct + '%';
      const topPct = 50 + Math.random() * 40;
      s.style.top = topPct + '%';
      const tx = (Math.random() - 0.5) * 120 + 'px';
      const ty = (-60 - Math.random() * 100) + 'px';
      s.style.setProperty('--tx', tx);
      s.style.setProperty('--ty', ty);
      const rot = Math.floor(Math.random() * 360) + 'deg';
      s.style.setProperty('--rot', rot);
      const dur = 6;
      s.style.setProperty('--dur', dur + 's');
      s.innerHTML = svghtml(colors[Math.floor(Math.random() * colors.length)]);
      container.appendChild(s);
      requestAnimationFrame(() => s.classList.add('anim'));
      setTimeout(() => { try { s.remove(); } catch (e) { } }, (dur + 0.6) * 1000);
    }
    let timer = null;
    function scheduleNext() {
      const next = 900;
      timer = setTimeout(() => { spawnStar(); scheduleNext(); }, next);
    }
    scheduleNext();
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          if (!timer) scheduleNext();
        } else {
          if (timer) { clearTimeout(timer); timer = null; }
        }
      });
    }, { threshold: 0.2 });
    obs.observe(container);
  })();


  // Put this near top or end of contact.js (after DOMContentLoaded block or inside it)
(function () {
  const modal = document.getElementById('appModal');
  if (!modal) return;

  const panel = modal.querySelector('.app-modal__panel');
  const overlay = modal.querySelector('.app-modal__overlay');
  const closeButtons = modal.querySelectorAll('[data-close-modal]');
  let lastActive = null;

  function openModal(title, message) {
    lastActive = document.activeElement;
    modal.querySelector('#appModalTitle').textContent = title || '';
    modal.querySelector('#appModalDesc').textContent = message || '';
    modal.hidden = false;
    // force reflow then add open class for animation
    requestAnimationFrame(() => modal.classList.add('open'));
    // trap focus
    trapFocus(panel);
    // focus first focusable (close button so keyboard users can close)
    const closeBtn = modal.querySelector('.app-modal__close');
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', handleKeydown);
  }

function closeModal() {
  modal.classList.remove('open');
  document.removeEventListener('keydown', handleKeydown);

  // wait for the closing animation to finish (same delay as before)
  setTimeout(() => {
    modal.hidden = true;
    releaseFocusTrap();

    // find the actual reset button (same selector you used)
    const resetBtn = document.querySelector('button[type="reset"], input[type="reset"]');

    if (resetBtn) {
      // programmatically "click" the reset button so its handler runs exactly
      // like a real user click (preserves any custom reset handler).
      resetBtn.click();
    } else {
      // fallback: if reset button not found, fallback to manual reset (safe)
      const form = document.getElementById('contactForm');
      if (form) {
        form.reset();
        // remove validation UI added by JS
        form.querySelectorAll('.input-error, .field-chip').forEach(el => el.remove());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const firstNameInput = document.getElementById('firstName');
        if (firstNameInput) setTimeout(() => firstNameInput.focus(), 400);
      }
    }

    // optional: restore previous focus if you want (keeps behavior you had)
    if (lastActive && typeof lastActive.focus === 'function') lastActive.focus();
  }, 240);
}


  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
  overlay.addEventListener('click', closeModal);

  function handleKeydown(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') maintainFocus(e);
  }

  // --- minimal focus-trap (sufficient for simple modal) ---
  let focusableNodes = [];
  let firstFocusable = null;
  let lastFocusable = null;
  function trapFocus(root) {
    focusableNodes = Array.from(root.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
      .filter(n => !n.hasAttribute('disabled') && n.offsetParent !== null);
    firstFocusable = focusableNodes[0] || root;
    lastFocusable = focusableNodes[focusableNodes.length - 1] || root;
  }
  function maintainFocus(e) {
    if (!focusableNodes.length) {
      e.preventDefault();
      return;
    }
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault(); lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault(); firstFocusable.focus();
    }
  }
  function releaseFocusTrap() {
    focusableNodes = []; firstFocusable = null; lastFocusable = null;
  }

  // Expose global helper to replace alert
  window.showAppModal = function (title, message) {
    openModal(title, message);
  };
})();



}); 
