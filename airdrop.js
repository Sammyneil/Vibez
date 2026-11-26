(function () {
  var CONFIG = {
    VERIFY_ENDPOINT: '/api/verify',
    SUBMIT_ENDPOINT: '/api/submit',
    STORAGE_KEY: 'vibez_airdrop_v2'
  };
  var X_ACCOUNT = 'Vibez_coin';
  var POST_ID = '2125564862365364671';
  var POST_URL = 'https://x.com/' + X_ACCOUNT + '/status/' + POST_ID;
  var TASKS = [
    { id: 'x', type: 'link', icon: 'fa-brands fa-x-twitter', title: 'Follow us on X', desc: 'Follow @' + X_ACCOUNT + ', then confirm below.', links: [{ label: 'Follow on X', url: 'https://x.com/' + X_ACCOUNT, icon: 'fa-brands fa-x-twitter' }] },
    { id: 'rt', type: 'link', icon: 'fa-solid fa-retweet', title: 'Like and Repost', desc: 'Like and repost our launch post, then confirm below.', links: [{ label: 'Like', url: 'https://x.com/intent/like?tweet_id=' + POST_ID, icon: 'fa-solid fa-heart' }, { label: 'Repost', url: 'https://x.com/intent/retweet?tweet_id=' + POST_ID, icon: 'fa-solid fa-retweet' }] },
    { id: 'comment', type: 'xlink', icon: 'fa-solid fa-comment', title: 'Comment', desc: 'Comment on our launch post, then paste the link to your comment.', postUrl: POST_URL, placeholder: 'https://x.com/yourname/status/…' },
    { id: 'tg', type: 'telegram', icon: 'fa-brands fa-telegram', title: 'Join our Telegram', desc: 'Join the community channel. Membership is checked securely.', links: [{ label: 'Open Telegram', url: 'https://t.me/vibecoinonsoll', icon: 'fa-brands fa-telegram' }] },
    { id: 'email', type: 'email', icon: 'fa-solid fa-envelope', title: 'Drop your email', desc: 'Used for airdrop updates and announcements.', placeholder: 'you@example.com' },
    { id: 'wallet', type: 'address', icon: 'fa-solid fa-wallet', title: 'Submit your Solana address', desc: 'The public wallet address that will receive your share.', placeholder: 'Your Solana wallet address' }
  ];
  var listEl = document.getElementById('tk-list');
  if (!listEl) return;
  window.vibezAirdropV2 = true;
  var editing = {};
  var drafts = {};
  var state = load();
  var telegramBotId = '';

  var style = document.createElement('style');
  style.textContent = '.tk-check{margin-top:1.2rem;text-align:center}.tk-check-list{list-style:none;margin-top:1rem;text-align:left;display:flex;flex-direction:column;gap:.5rem}.tk-check-list li{display:flex;gap:.6rem;align-items:flex-start;font-size:.9rem;font-weight:600;padding:.65rem .85rem;border-radius:12px;border:1px solid rgba(11,11,18,.1);background:#fff}.tk-check-list li.ok i{color:#0a7fd6}.tk-check-list li.bad i{color:#c2410c}.tk-check-list li.sum{background:#faf7ff;border:2px solid #0b0b12}';
  document.head.appendChild(style);
  var checkWrap = document.createElement('div');
  checkWrap.className = 'tk-check';
  checkWrap.innerHTML = '<button class="tk-btn primary" type="button" id="tk-check-btn"><i class="fa-solid fa-clipboard-check"></i> Run verification check</button><ul class="tk-check-list" id="tk-check-list" aria-live="polite"></ul>';
  listEl.parentNode.insertBefore(checkWrap, document.getElementById('tk-final'));

  function load() {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state)); } catch (e) {}

  }
  function getTask(id) { return TASKS.filter(function (task) { return task.id === id; })[0]; }
  function isEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value); }
  function isSolAddress(value) {
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) return false;
    var alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    var bytes = [0];
    for (var i = 0; i < value.length; i++) {
      var carry = alphabet.indexOf(value[i]);
      for (var j = 0; j < bytes.length; j++) { carry += bytes[j] * 58; bytes[j] = carry & 255; carry >>= 8; }
      while (carry > 0) { bytes.push(carry & 255); carry >>= 8; }
    }
    for (var k = 0; k < value.length && value[k] === '1'; k++) bytes.push(0);
    return bytes.length === 32;
  }
  function compareIds(a, b) { return a.length !== b.length ? (a.length < b.length ? -1 : 1) : (a === b ? 0 : (a < b ? -1 : 1)); }
  function bad(message) { return { ok: false, msg: message, value: '', user: '' }; }
  function checkComment(raw) {
    var url;
    try { url = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://' + raw); } catch (e) { return bad('That is not a valid link. Paste the full link to your comment.'); }
    var host = url.hostname.toLowerCase().replace(/^(www|mobile)\./, '');
    if (host !== 'x.com' && host !== 'twitter.com') return bad('Please paste a link from x.com.');
    var match = url.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})(?:\/.*)?$/);
    if (!match) return bad('The link should look like x.com/yourname/status/123…');
    if (match[2] === POST_ID) return bad('That is the link to our post. Paste the link to your own comment.');
    if (match[1].toLowerCase() === X_ACCOUNT.toLowerCase()) return bad("That link is from our own account. Paste your comment's link.");
    if (compareIds(match[2], POST_ID) < 0) return bad("That post is older than our launch post, so it can't be a comment on it.");
    return { ok: true, msg: '', value: 'https://x.com/' + match[1] + '/status/' + match[2], user: match[1] };
  }
  function validate(task, raw) {
    var value = (raw || '').trim();
    if (!value) return bad(task.type === 'email' ? 'Please enter your email address.' : task.type === 'address' ? 'Please enter your Solana address.' : 'Please paste the link to your comment.');
    if (task.type === 'email') return isEmail(value) ? { ok: true, msg: '', value: value } : bad('Please enter a valid email address.');
    if (task.type === 'address') return isSolAddress(value) ? { ok: true, msg: '', value: value } : bad("That doesn't look like a valid Solana address. Check it and try again.");
    return checkComment(value);
  }
  function isDone(task) {
    var entry = state[task.id] || {};
    if (task.type === 'link' || task.type === 'telegram') return !!entry.verified;
    return !!entry.saved && validate(task, entry.value).ok;
  }
  function allOpened(task, entry) {
    var opened = (entry || {}).opened || {};
    return task.links.every(function (link, index) { return !!opened[index]; });
  }
  function taskHTML(task, index) {
    var entry = state[task.id] || {};
    var done = isDone(task);
    var label = task.type === 'link' || task.type === 'telegram' ? 'Completed' : 'Saved';
    var html = '<div class="tk-task' + (done ? ' done' : '') + '" data-id="' + task.id + '"><div class="tk-head"><div class="tk-icon"><i class="' + task.icon + '"></i></div><div class="tk-info"><div class="tk-title"><span class="tk-num">' + (index + 1) + '</span>' + task.title + '</div><p class="tk-desc">' + task.desc + '</p></div><span class="tk-pill' + (done ? ' ok' : '') + '">' + (done ? '<i class="fa-solid fa-check"></i> ' + label : 'Pending') + '</span></div>';
    if (task.type === 'link' || task.type === 'telegram') {
      if (done) html += '<div class="tk-actions"><button class="tk-btn success" type="button" disabled><i class="fa-solid fa-circle-check"></i> Completed</button></div>';
      else {
        var opened = entry.opened || {};
        html += '<div class="tk-actions">' + task.links.map(function (link, i) { return '<a class="tk-btn ' + (opened[i] ? 'success' : 'primary') + '" data-action="open" data-i="' + i + '" href="' + link.url + '" target="_blank" rel="noopener noreferrer"><i class="' + (opened[i] ? 'fa-solid fa-check' : link.icon) + '"></i> ' + link.label + '</a>'; }).join('');
        html += '<button class="tk-btn" type="button" data-action="verify"' + (allOpened(task, entry) ? '' : ' disabled') + '><i class="fa-solid fa-shield-halved"></i> ' + (task.type === 'telegram' ? 'Verify membership' : 'I completed this') + '</button></div>';
      }
    } else {
      if (task.type === 'xlink') html += '<div class="tk-actions"><a class="tk-btn primary" href="' + task.postUrl + '" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-x-twitter"></i> Open post to comment</a></div>';
      var locked = entry.saved && !editing[task.id];
      html += '<div class="tk-form"><input class="tk-input" type="' + (task.type === 'email' ? 'email' : 'text') + '" placeholder="' + task.placeholder + '" aria-label="' + task.title + '" autocomplete="' + (task.type === 'email' ? 'email' : 'off') + '" spellcheck="false" autocapitalize="off"' + (task.type === 'xlink' ? ' inputmode="url"' : '') + (locked ? ' readonly' : '') + '>';
      html += locked ? '<button class="tk-btn" type="button" data-action="edit"><i class="fa-solid fa-pen"></i> Edit</button>' : '<button class="tk-btn primary" type="button" data-action="save"><i class="fa-solid fa-floppy-disk"></i> ' + (entry.saved ? 'Update' : 'Save') + '</button>' + (entry.saved ? '<button class="tk-btn" type="button" data-action="cancel">Cancel</button>' : '');
      html += '</div>';
    }
    return html + '<div class="tk-msg" role="status" aria-live="polite"></div></div>';
  }
  function render() {
    var oldInputs = listEl.querySelectorAll('.tk-input');
    for (var i = 0; i < oldInputs.length; i++) {
      var input = oldInputs[i];
      if (!input.readOnly) drafts[input.closest('.tk-task').getAttribute('data-id')] = input.value;
    }
    listEl.innerHTML = TASKS.map(taskHTML).join('');
    var inputs = listEl.querySelectorAll('.tk-input');
    for (var j = 0; j < inputs.length; j++) {
      var field = inputs[j];
      var id = field.closest('.tk-task').getAttribute('data-id');
      field.value = !field.readOnly && drafts[id] !== undefined ? drafts[id] : ((state[id] || {}).value || '');
    }
    var count = TASKS.filter(isDone).length;
    var percent = Math.round((count / TASKS.length) * 100);
    document.getElementById('tk-count').textContent = String(count);
    document.getElementById('tk-total').textContent = String(TASKS.length);
    document.getElementById('tk-fill').style.width = percent + '%';
    document.getElementById('tk-bar').setAttribute('aria-valuenow', String(percent));
    document.getElementById('tk-final').hidden = count !== TASKS.length;
    var submitButton = document.getElementById('tk-submit-btn');
    var submitStatus = document.getElementById('tk-submit-status');
    if (state.submitted && submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fa-solid fa-circle-check"></i> Entry submitted';
      if (submitStatus) submitStatus.textContent = 'Your entry has been received by Vibez.';
    }
  }
  function say(card, text, ok) {
    var message = card.querySelector('.tk-msg');
    if (message) { message.textContent = text; message.className = 'tk-msg' + (ok ? ' ok' : ''); }
  }
  function loadTelegramWidget() {
    if (!CONFIG.VERIFY_ENDPOINT) return;
    fetch(CONFIG.VERIFY_ENDPOINT).then(function (response) { return response.ok ? response.json() : {}; }).then(function (data) {
      if (!data.telegramBotId) return;
      telegramBotId = String(data.telegramBotId);
      var script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      document.head.appendChild(script);
    }).catch(function () {});
  }
  function verifyTelegram() {
    return new Promise(function (resolve, reject) {
      if (!window.Telegram || !window.Telegram.Login) return reject(new Error('Telegram login not loaded'));
      window.Telegram.Login.auth({ bot_id: telegramBotId, request_access: false }, function (user) {
        if (!user) return resolve(false);
        fetch(CONFIG.VERIFY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task: 'tg', telegram: user }) })
          .then(function (response) { return response.json(); }).then(function (data) {
            if (data.verified) state.tg = Object.assign({}, state.tg, { telegramId: data.telegramId, telegramUsername: user.username || '', verified: true });
            resolve(!!data.verified);
          }).catch(reject);
      });
    });
  }
  function verify(task, button, card) {
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking…';
    var result = task.type === 'telegram' ? (telegramBotId ? verifyTelegram() : Promise.resolve(false)) : Promise.resolve(true);
    result.then(function (ok) {
      if (ok) {
        state[task.id] = Object.assign({}, state[task.id], { verified: true });
        save(); render();
      } else {
        button.disabled = false;
        button.innerHTML = '<i class="fa-solid fa-shield-halved"></i> ' + (task.type === 'telegram' ? 'Verify membership' : 'I completed this');
        say(card, task.type === 'telegram' ? 'Telegram membership could not be confirmed. Try again after joining the channel.' : 'Please complete the linked steps, then try again.');
      }
    }).catch(function () { button.disabled = false; say(card, 'Something went wrong. Please try again.'); });
  }
  function submitValue(id) {
    var task = getTask(id);
    var card = listEl.querySelector('.tk-task[data-id="' + id + '"]');
    var input = card.querySelector('.tk-input');
    var result = validate(task, input.value);
    if (!result.ok) return say(card, result.msg);
    state[id] = { value: result.value, saved: true };
    delete editing[id];
    delete drafts[id];
    save(); render();
    var fresh = listEl.querySelector('.tk-task[data-id="' + id + '"]');
    if (fresh) say(fresh, task.type === 'xlink' ? 'Saved. Comment by @' + result.user + '.' : 'Saved. You can update it any time.', true);
  }

  function submitEntry() {
    var button = document.getElementById('tk-submit-btn');
    var status = document.getElementById('tk-submit-status');
    var consent = document.getElementById('tk-consent');
    if (state.submitted) return;
    if (!TASKS.every(isDone)) {
      status.textContent = 'Please complete all six tasks first.';
      return;
    }
    if (!consent || !consent.checked) {
      status.textContent = 'Please agree to the data-use notice before submitting.';
      return;
    }
    if (!CONFIG.SUBMIT_ENDPOINT) {
      status.textContent = 'Submission is not configured yet. Your details remain saved only in this browser.';
      return;
    }
    var email = (state.email || {}).value || '';
    var walletAddress = (state.wallet || {}).value || '';
    var commentUrl = (state.comment || {}).value || '';
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting…';
    status.textContent = 'Sending your entry securely…';
    fetch(CONFIG.SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        walletAddress: walletAddress,
        commentUrl: commentUrl,
        xFollowSelfReported: !!(state.x || {}).verified,
        xLikeRepostSelfReported: !!(state.rt || {}).verified,
        consent: true
      })
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok || !data.ok) throw new Error(data.error || 'Submission failed. Please try again.');
        state.submitted = true;
        state.submittedAt = data.submittedAt || new Date().toISOString();
        save();
        button.innerHTML = '<i class="fa-solid fa-circle-check"></i> Entry submitted';
        status.textContent = 'Your entry has been received by Vibez. You can close this page.';
      });
    }).catch(function (error) {
      button.disabled = false;
      button.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit my airdrop entry';
      status.textContent = error && error.message ? error.message : 'Could not submit your entry. Please try again.';
    });
  }

  function runCheck() {
    var rows = [];
    var passed = 0;
    TASKS.forEach(function (task) {
      var entry = state[task.id] || {};
      var ok = false;
      var message = '';
      if (task.type === 'link' || task.type === 'telegram') {
        ok = !!entry.verified;
        message = ok ? (task.type === 'telegram' ? 'membership verified' : 'self-confirmed') : (allOpened(task, entry) ? 'press the completion button' : 'not completed yet');
      } else if (!entry.saved) message = 'not submitted yet';
      else { var result = validate(task, entry.value); ok = result.ok; message = ok ? 'looks good' : result.msg; }
      if (ok) passed++;
      rows.push('<li class="' + (ok ? 'ok' : 'bad') + '"><i class="fa-solid ' + (ok ? 'fa-circle-check' : 'fa-circle-xmark') + '"></i><span>' + task.title + ': ' + message + '</span></li>');
    });
    var all = passed === TASKS.length;
    var summary = '<li class="sum ' + (all ? 'ok' : 'bad') + '"><i class="fa-solid ' + (all ? 'fa-circle-check' : 'fa-triangle-exclamation') + '"></i><span>' + (all ? 'All ' + TASKS.length + ' tasks complete. Your entry is recorded in this browser.' : passed + ' of ' + TASKS.length + ' tasks complete. Fix the items marked below.') + '</span></li>';
    document.getElementById('tk-check-list').innerHTML = summary + rows.join('');
  }

  listEl.addEventListener('click', function (event) {
    var element = event.target.closest('[data-action]');
    if (!element) return;
    var card = element.closest('.tk-task');
    var id = card.getAttribute('data-id');
    var task = getTask(id);
    var action = element.getAttribute('data-action');
    if (action === 'open') {
      var index = element.getAttribute('data-i');
      var entry = state[id] || {};
      var opened = Object.assign({}, entry.opened);
      opened[index] = true;
      state[id] = Object.assign({}, entry, { opened: opened });
      save();
      if (allOpened(task, state[id])) { var verifyButton = card.querySelector('[data-action="verify"]'); if (verifyButton) verifyButton.disabled = false; say(card, 'Done? Press the completion button.', true); }
      else say(card, Object.keys(opened).length + ' of ' + task.links.length + ' steps opened.', true);
    } else if (action === 'verify') verify(task, element, card);
    else if (action === 'save') submitValue(id);
    else if (action === 'edit') { editing[id] = true; render(); var field = listEl.querySelector('.tk-task[data-id="' + id + '"] .tk-input'); if (field) field.focus(); }
    else if (action === 'cancel') { delete editing[id]; delete drafts[id]; render(); }
  });
  listEl.addEventListener('keydown', function (event) {
    var input = event.target;
    if (event.key === 'Enter' && !event.nativeEvent?.isComposing && event.keyCode !== 229 && input.classList && input.classList.contains('tk-input') && !input.readOnly) {
      event.preventDefault();
      submitValue(input.closest('.tk-task').getAttribute('data-id'));
    }
  });
  document.getElementById('tk-check-btn').addEventListener('click', runCheck);
  document.getElementById('tk-submit-btn').addEventListener('click', submitEntry);
  loadTelegramWidget();
  render();
})();
