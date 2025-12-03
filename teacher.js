// teacher-login.js
// Provides login/setup/forgot flows (when included on teacher-login.html)
// Also exposes window.teacherAuth helpers for teacher.html to use.
// Safe: if loaded on pages that don't have the login UI, it only defines helpers.

// ---------- Config keys ----------
const KEY_PW = 'teacherPasswordHash';
const KEY_REC = 'teacherRecoveryHash';
const KEY_LOGGED = 'teacherLoggedIn';

// ---------- Helper: SHA-256 -> hex ----------
async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  const bytes = new Uint8Array(buf);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------- Expose high-level auth helpers used by teacher.html ----------
window.teacherAuth = {
  verifyPassword: async function(plain) {
    const stored = localStorage.getItem(KEY_PW);
    if (!stored) return false;
    return (await sha256Hex(plain)) === stored;
  },
  changePassword: async function(currentPlain, newPlain, newRecoveryPlain) {
    // require current password to change (or to set recovery)
    const stored = localStorage.getItem(KEY_PW);
    if (!stored) throw new Error('No existing password set. Use setup on login page first.');

    if (!currentPlain) throw new Error('Enter current password to authorize changes.');

    const curHash = await sha256Hex(currentPlain);
    if (curHash !== stored) throw new Error('Current password is incorrect.');

    if (newPlain !== null && newPlain !== undefined) {
      if (typeof newPlain === 'string' && newPlain.length > 0) {
        if (newPlain.length < 6) throw new Error('New password must be at least 6 characters.');
        const nh = await sha256Hex(newPlain);
        localStorage.setItem(KEY_PW, nh);
      }
      // if empty string explicitly passed, don't change password
    }

    if (typeof newRecoveryPlain === 'string') {
      // If empty string => remove recovery. If non-empty => set hashed recovery.
      if (newRecoveryPlain === '') {
        localStorage.removeItem(KEY_REC);
      } else if (newRecoveryPlain.length > 0) {
        const rh = await sha256Hex(newRecoveryPlain);
        localStorage.setItem(KEY_REC, rh);
      }
    }
    return true;
  },
  logout: function() {
    localStorage.removeItem(KEY_LOGGED);
  }
};

// ---------- If login UI present (teacher-login.html), render and handle flows ----------
(function maybeInitLoginUI(){
  const root = document.getElementById('forms');
  const helpText = document.getElementById('helpText');
  if (!root) return; // no login UI on this page — only helpers needed

  function showHelp(txt){ if(helpText) helpText.textContent = txt || ''; }

  (async function init() {
    const pw = localStorage.getItem(KEY_PW);
    if (!pw) {
      renderSetup();
      showHelp('No teacher password found. Create a new password and optional recovery code (used for "Forgot password").');
    } else {
      renderLogin();
      showHelp('If you forget the password, use the "Forgot password" link (requires a recovery code if previously set).');
    }
  })();

  // --- Setup UI ---
  function renderSetup(){
    root.innerHTML = `
      <label>Create new password</label>
      <input id="newPwd" type="password" placeholder="New password (min 6 chars)"/>
      <label>Confirm password</label>
      <input id="confirmPwd" type="password" placeholder="Confirm new password"/>
      <label>Optional: Recovery code (use to reset password if forgotten)</label>
      <input id="recovery" type="text" placeholder="Recovery code (optional) - remember this"/>
      <button id="btnCreate">Create Password</button>
      <p class="small">This device will store a hashed password locally. If you lose access and didn't set a recovery code, you'll need to clear certain localStorage keys manually to reset.</p>
    `;

    document.getElementById('btnCreate').addEventListener('click', async () => {
      const pw = document.getElementById('newPwd').value.trim();
      const conf = document.getElementById('confirmPwd').value.trim();
      const rec = document.getElementById('recovery').value.trim();

      if (pw.length < 6) return alert('Password must be at least 6 characters.');
      if (pw !== conf) return alert('Passwords do not match.');

      const pwHash = await sha256Hex(pw);
      localStorage.setItem(KEY_PW, pwHash);

      if (rec) {
        const recHash = await sha256Hex(rec);
        localStorage.setItem(KEY_REC, recHash);
      }

      alert('✅ Password created successfully. Please login.');
      renderLogin();
    });
  }

  // --- Login UI ---
  function renderLogin(){
    root.innerHTML = `
      <label>Enter password</label>
      <input id="pwd" type="password" placeholder="Password"/>
      <button id="btnLogin">Login</button>

      <div style="display:flex;justify-content:space-between;margin-top:10px">
        <button id="btnForgot" class="link" style="background:none;border:0;padding:0">Forgot password?</button>
        <button id="btnClear" class="link" style="background:none;border:0;padding:0">Reset (clear credentials)</button>
      </div>
      <div style="margin-top:8px" id="status" class="small"></div>
    `;

    document.getElementById('btnLogin').addEventListener('click', async () => {
      const pw = document.getElementById('pwd').value || '';
      if (!pw) return alert('Enter password.');
      const stored = localStorage.getItem(KEY_PW);
      if (!stored) return alert('No password is set — please create one first.');
      const hash = await sha256Hex(pw);
      if (hash === stored) {
        localStorage.setItem(KEY_LOGGED, 'true');
        window.location.href = 'teacher.html';
      } else {
        document.getElementById('status').textContent = 'Incorrect password.';
      }
    });

    document.getElementById('btnForgot').addEventListener('click', renderForgot);
    document.getElementById('btnClear').addEventListener('click', () => {
      if (!confirm('This will remove the stored teacher password and recovery code from this browser so you can set a new one. Continue?')) return;
      localStorage.removeItem(KEY_PW);
      localStorage.removeItem(KEY_REC);
      localStorage.removeItem(KEY_LOGGED);
      alert('Credentials cleared. Please create a new password.');
      renderSetup();
    });
  }

  // --- Forgot / Reset UI ---
  function renderForgot(){
    const recExists = !!localStorage.getItem(KEY_REC);
    if (!recExists) {
      root.innerHTML = `
        <p class="small">No recovery code set for this installation. You can clear saved teacher credentials to reset password manually (this deletes the password & recovery code from this browser).</p>
        <div class="grid">
          <button id="btnClearCreds">Clear Stored Credentials</button>
          <button id="btnBack">Back to Login</button>
        </div>
      `;
      document.getElementById('btnClearCreds').addEventListener('click', () => {
        if (!confirm('Clear stored teacher password and recovery code?')) return;
        localStorage.removeItem(KEY_PW);
        localStorage.removeItem(KEY_REC);
        localStorage.removeItem(KEY_LOGGED);
        alert('Cleared. Create a new password now.');
        renderSetup();
      });
      document.getElementById('btnBack').addEventListener('click', renderLogin);
      return;
    }

    root.innerHTML = `
      <label>Enter Recovery Code</label>
      <input id="recCode" type="text" placeholder="Recovery code you set earlier"/>
      <label>New password</label>
      <input id="newPwd2" type="password" placeholder="New password (min 6)"/>
      <label>Confirm password</label>
      <input id="confirmPwd2" type="password" placeholder="Confirm new password"/>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button id="btnReset">Reset Password</button>
        <button id="btnForgotBack" class="link" style="background:none;border:0;padding:0">Back</button>
      </div>
      <div id="fStatus" class="small"></div>
    `;

    document.getElementById('btnForgotBack').addEventListener('click', renderLogin);

    document.getElementById('btnReset').addEventListener('click', async () => {
      const rec = document.getElementById('recCode').value.trim();
      const np = document.getElementById('newPwd2').value.trim();
      const conf = document.getElementById('confirmPwd2').value.trim();
      if (!rec) return alert('Enter recovery code.');
      if (np.length < 6) return alert('Password must be at least 6 chars.');
      if (np !== conf) return alert('Passwords do not match.');

      const recHash = await sha256Hex(rec);
      const storedRec = localStorage.getItem(KEY_REC);
      if (!storedRec) return alert('No recovery stored — cannot reset.');
      if (recHash !== storedRec) {
        document.getElementById('fStatus').textContent = 'Recovery code does not match.';
        return;
      }

      const newHash = await sha256Hex(np);
      localStorage.setItem(KEY_PW, newHash);
      localStorage.setItem(KEY_LOGGED, 'true');
      alert('Password reset successful. Redirecting to Teacher Portal...');
      window.location.href = 'teacher.html';
    });
  }

})();
