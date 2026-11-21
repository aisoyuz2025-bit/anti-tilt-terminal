(function () {
  'use strict';
  var M = window.AntiTiltMath;
  var KEY = 'antitilt.v1';
  var $ = function (id) { return document.getElementById(id); };

  var I18N = {
    ru: {
      title: 'Терминал защиты депозита', subtitle: 'Анти-Тильт · калькулятор сделок',
      linkTg: 'Telegram-канал', linkApex: 'Платформа APEX',
      balanceLabel: 'Твой рабочий баланс ($)', minTrade: 'Минимальная сделка — строго $1.00',
      fixaName: 'Фикса', fixaTag: 'Доступна всегда',
      fixaHelp: 'Самый безопасный старт. Вы всегда ставите одну и ту же сумму (например, $1). Идеально для привыкания к системе без риска.',
      martiName: 'Мартингейл (Умное перекрытие)', antiName: 'Анти-Мартингейл (Разгон)', from50: 'От $50',
      martiHelp: 'Система перекрытия минусов. Если прогноз не зашел, следующая сумма чуть увеличивается, чтобы вернуть потерю и дать плюс. Терминал сам считает, сколько шагов выдержит ваш баланс.',
      antiHelp: 'Охота за серией плюсов. Рискуете только стартовым $1, а дальше разгоняете полученную прибыль.',
      disclaimer: 'Это только калькулятор. Не является финансовой рекомендацией. Торговля связана с риском потери всего депозита.',
      statWins: 'Плюс', statLosses: 'Минус', statStreak: 'Минусов подряд', reset: 'Сброс',
      plus: '[+] Плюс', minus: '[−] Минус',
      stopText: '🔴 СТОП-ТОРГИ. Система защиты активирована. Закрой платформу до завтра, чтобы сохранить деньги',
      lockedToast: 'Доступно при балансе от $50. Для небольших сумм используйте Фиксу',
      errInvalid: 'Введите сумму числом, например 50',
      errMin: 'Баланс меньше $1 — сделка невозможна. Минимальная сделка $1.00.',
      warnSmall: 'Баланс до $50 — доступна только Фикса.',
      noTrade: 'Сделка невозможна: на балансе меньше $1.00.',
      fixaTitle: 'Фикса — ваша ставка', fixaRange: 'Диапазон 2–3% от баланса: {a} – {b}',
      fixaFloor: '2–3% от баланса меньше $1, поэтому ставка — минимум $1.00.',
      fixaSame: 'Ставьте эту сумму в каждой сделке, не увеличивайте её после минуса.',
      martiTitle: 'Мартингейл — шаги безопасности',
      martiHead: 'Ваш баланс вмещает максимум <b>{n}</b> {steps} безопасности',
      thStep: 'Шаг', thStake: 'Ставка', thTotal: 'Всего вложено', thIfWin: 'При плюсе',
      martiOver: 'Шаг {n} ({s}) уже не помещается: нужно {t}',
      martiNote: 'Коэффициент x2.15. Сумма всех шагов не превышает ваш баланс.',
      antiTitle: 'Анти-Мартингейл — лестница разгона',
      antiHead: 'Риск всегда только <b>$1.00</b>',
      antiTake: 'После 3 плюсов подряд забираем <b>≈{t}</b> (прибыль +{p})',
      antiNote: 'Выплата 92%. При минусе — возврат к $1.00.',
      nextFixa: 'Следующая ставка: <b>{s}</b>',
      nextMarti: 'Шаг {k} из {n} · следующая ставка: <b>{s}</b>',
      nextAnti: 'Шаг {k} из 3 · следующая ставка: <b>{s}</b>',
      nextNone: 'Введите баланс от $1, чтобы начать',
      takeToast: '🎯 3 плюса подряд! Забирайте ≈{t} и начинайте снова с $1.00',
      reasonStreak: 'Причина: 3 минуса подряд. Разблокировка завтра.',
      reasonSteps: 'Причина: исчерпан лимит шагов Мартингейла. Разблокировка завтра.',
      resetLocked: 'Во время СТОП-ТОРГОВ сброс недоступен — до завтра',
      stepsWord: function (n) { var m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return 'шаг'; if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'шага'; return 'шагов'; }
    },
    en: {
      title: 'Deposit Protection Terminal', subtitle: 'Anti-Tilt · trade calculator',
      linkTg: 'Telegram channel', linkApex: 'APEX platform',
      balanceLabel: 'Your working balance ($)', minTrade: 'Minimum trade — strictly $1.00',
      fixaName: 'Fixed', fixaTag: 'Always available',
      fixaHelp: 'The safest start. You always trade the same amount (for example, $1). Perfect for getting used to the system without risk.',
      martiName: 'Martingale (Smart recovery)', antiName: 'Anti-Martingale (Boost)', from50: 'From $50',
      martiHelp: 'A system for covering losses. If a forecast fails, the next amount grows a little to win back the loss and give a profit. The terminal calculates how many steps your balance can handle.',
      antiHelp: 'Hunting for a winning streak. You risk only the starting $1, then roll the profit forward.',
      disclaimer: 'This is only a calculator. Not financial advice. Trading carries the risk of losing your entire deposit.',
      statWins: 'Wins', statLosses: 'Losses', statStreak: 'Losses in a row', reset: 'Reset',
      plus: '[+] Win', minus: '[−] Loss',
      stopText: '🔴 STOP TRADING. Protection system activated. Close the platform until tomorrow to keep your money',
      lockedToast: 'Available with a balance of $50 or more. For small amounts use Fixed',
      errInvalid: 'Enter the amount as a number, e.g. 50',
      errMin: 'Balance is below $1 — no trade possible. Minimum trade is $1.00.',
      warnSmall: 'Balance under $50 — only Fixed is available.',
      noTrade: 'No trade possible: balance is below $1.00.',
      fixaTitle: 'Fixed — your stake', fixaRange: '2–3% of balance: {a} – {b}',
      fixaFloor: '2–3% of the balance is below $1, so the stake is the $1.00 minimum.',
      fixaSame: 'Use this amount for every trade; do not raise it after a loss.',
      martiTitle: 'Martingale — safety steps',
      martiHead: 'Your balance fits a maximum of <b>{n}</b> safety {steps}',
      thStep: 'Step', thStake: 'Stake', thTotal: 'Total used', thIfWin: 'If win',
      martiOver: 'Step {n} ({s}) does not fit: needs {t}',
      martiNote: 'Multiplier x2.15. The sum of all steps never exceeds your balance.',
      antiTitle: 'Anti-Martingale — boost ladder',
      antiHead: 'Risk is always just <b>$1.00</b>',
      antiTake: 'After 3 wins in a row take <b>≈{t}</b> (profit +{p})',
      antiNote: '92% payout. After a loss — back to $1.00.',
      nextFixa: 'Next stake: <b>{s}</b>',
      nextMarti: 'Step {k} of {n} · next stake: <b>{s}</b>',
      nextAnti: 'Step {k} of 3 · next stake: <b>{s}</b>',
      nextNone: 'Enter a balance of $1 or more to start',
      takeToast: '🎯 3 wins in a row! Take ≈{t} and start again from $1.00',
      reasonStreak: 'Reason: 3 losses in a row. Unlocks tomorrow.',
      reasonSteps: 'Reason: Martingale step limit reached. Unlocks tomorrow.',
      resetLocked: 'Reset is not available during STOP TRADING — until tomorrow',
      stepsWord: function (n) { return n === 1 ? 'step' : 'steps'; }
    }
  };

  var defaults = { lang: 'ru', theme: 'dark', balance: '50', mode: 'fixa', wins: 0, losses: 0, lossStreak: 0, mStep: 0, aStep: 0, stopDate: null, stopReason: null };
  var S = load();

  function load() {
    try { var o = JSON.parse(localStorage.getItem(KEY)); return Object.assign({}, defaults, o || {}); }
    catch (e) { return Object.assign({}, defaults); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function t(k) { var v = I18N[S.lang][k]; return v == null ? I18N.ru[k] : v; }
  function fmt(s, o) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); }
  function money(x) { return '$' + M.round2(x).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function balance() { return M.parseBalance(S.balance); }
  function isStopped() { return !!S.stopDate && S.stopDate >= today(); }

  function checkDay() {
    if (S.stopDate && S.stopDate < today()) {
      S.stopDate = null; S.stopReason = null; S.lossStreak = 0; S.mStep = 0; S.aStep = 0; save();
    }
  }

  // ---------- render ----------
  function applyStatic() {
    document.documentElement.lang = S.lang;
    document.documentElement.setAttribute('data-theme', S.theme);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', S.theme === 'light' ? '#F2F5F8' : '#0A0D12');
    document.title = t('title') + ' — Anti-Tilt';
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $('langBtn').textContent = S.lang === 'ru' ? 'EN' : 'RU';
    $('themeBtn').textContent = S.theme === 'dark' ? '☀️' : '🌙';
  }

  function render() {
    checkDay();
    var b = balance();
    var valid = isFinite(b);
    var ok = valid && M.canTrade(b);
    var unlocked = ok && M.advancedUnlocked(b);
    if (!unlocked && S.mode !== 'fixa') { S.mode = 'fixa'; }

    // input state + message
    var msg = $('balanceMsg');
    $('balance').parentNode.classList.toggle('bad', !ok);
    if (!valid) { msg.className = 'msg err'; msg.textContent = t('errInvalid'); }
    else if (!ok) { msg.className = 'msg err'; msg.textContent = t('errMin'); }
    else if (!unlocked) { msg.className = 'msg warn'; msg.textContent = t('warnSmall'); }
    else { msg.className = 'msg'; msg.textContent = ''; }
    document.querySelectorAll('#quick button').forEach(function (q) { q.classList.toggle('on', Number(q.dataset.v) === b); });

    // mode cards
    document.querySelectorAll('.mode').forEach(function (el) {
      var m = el.dataset.mode, locked = m !== 'fixa' && !unlocked;
      el.classList.toggle('locked', locked);
      el.classList.toggle('sel', m === S.mode);
      el.setAttribute('aria-checked', m === S.mode ? 'true' : 'false');
      el.setAttribute('aria-disabled', locked ? 'true' : 'false');
    });

    var mart = M.martingale(ok ? b : 0);
    if (S.mStep >= mart.maxSteps) S.mStep = Math.max(0, mart.maxSteps - 1);
    var anti = M.antiMartingale();

    // result
    var r = $('result'), h = '';
    if (!ok) h = '<p class="empty">' + t('noTrade') + '</p>';
    else if (S.mode === 'fixa') {
      var f = M.fixa(b);
      h = '<h2>' + t('fixaTitle') + '</h2><div class="big">' + money(f.stake2) + '</div>' +
        '<p class="note">' + fmt(t('fixaRange'), { a: money(f.stake2), b: money(f.stake3) }) + '</p>' +
        (f.floored2 ? '<p class="note">' + t('fixaFloor') + '</p>' : '') +
        '<p class="note">' + t('fixaSame') + '</p>';
    } else if (S.mode === 'marti') {
      h = '<h2>' + t('martiTitle') + '</h2><div class="headline">' + fmt(t('martiHead'), { n: mart.maxSteps, steps: t('stepsWord')(mart.maxSteps) }) + '</div>' +
        '<table><thead><tr><th>' + t('thStep') + '</th><th>' + t('thStake') + '</th><th>' + t('thTotal') + '</th></tr></thead><tbody>';
      mart.steps.forEach(function (s, i) {
        h += '<tr class="' + (i === S.mStep ? 'cur' : '') + '"><td>' + s.step + '</td><td>' + money(s.stake) + '</td><td>' + money(s.cumulative) + '</td></tr>';
      });
      h += '<tr class="over"><td colspan="3">' + fmt(t('martiOver'), { n: mart.maxSteps + 1, s: money(mart.nextStake), t: money(mart.nextTotal) }) + '</td></tr></tbody></table>' +
        '<p class="note">' + t('martiNote') + '</p>';
    } else {
      h = '<h2>' + t('antiTitle') + '</h2><div class="headline">' + t('antiHead') + '</div>' +
        '<table><thead><tr><th>' + t('thStep') + '</th><th>' + t('thStake') + '</th><th>' + t('thIfWin') + '</th></tr></thead><tbody>';
      anti.steps.forEach(function (s, i) {
        h += '<tr class="' + (i === S.aStep ? 'cur' : '') + '"><td>' + s.step + '</td><td>' + money(s.stake) + '</td><td>' + money(s.ifWin) + '</td></tr>';
      });
      h += '</tbody></table><div class="take">' + fmt(t('antiTake'), { t: money(anti.take), p: money(anti.profit) }) + '</div>' +
        '<p class="note">' + t('antiNote') + '</p>';
    }
    r.innerHTML = h;

    // tilt panel
    $('wins').textContent = S.wins;
    $('losses').textContent = S.losses;
    $('streak').textContent = S.lossStreak + '/3';
    $('streak').classList.toggle('hot', S.lossStreak >= 2);
    var nx = '';
    if (!ok) nx = t('nextNone');
    else if (S.mode === 'fixa') nx = fmt(t('nextFixa'), { s: money(M.fixa(b).stake2) });
    else if (S.mode === 'marti') nx = fmt(t('nextMarti'), { k: S.mStep + 1, n: mart.maxSteps, s: money(mart.steps[S.mStep].stake) });
    else nx = fmt(t('nextAnti'), { k: S.aStep + 1, s: money(anti.steps[S.aStep].stake) });
    $('next').innerHTML = nx;

    var stopped = isStopped();
    document.body.classList.toggle('stopped', stopped);
    $('stop').hidden = !stopped;
    $('next').hidden = stopped;
    $('stopSub').textContent = stopped ? t(S.stopReason === 'steps' ? 'reasonSteps' : 'reasonStreak') : '';
    $('plusBtn').disabled = $('minusBtn').disabled = stopped || !ok;
    $('resetBtn').disabled = stopped;
    save();
    sizeTilt();
  }

  function sizeTilt() { document.documentElement.style.setProperty('--tilt-h', $('tilt').offsetHeight + 'px'); }

  var toastTimer;
  function toast(text, good) {
    var el = $('toast'); el.textContent = text; el.classList.toggle('good', !!good); el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }
  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  function triggerStop(reason) {
    S.stopDate = today(); S.stopReason = reason;
    var f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    vibrate([200, 100, 200, 100, 400]);
  }

  // ---------- events ----------
  $('balance').value = S.balance;
  $('balance').addEventListener('input', function (e) { S.balance = e.target.value.trim(); render(); });
  $('balance').addEventListener('keydown', function (e) { if (e.key === 'Enter') e.target.blur(); });
  $('quick').addEventListener('click', function (e) {
    var v = e.target.closest('button'); if (!v) return;
    S.balance = v.dataset.v; $('balance').value = v.dataset.v; render();
  });

  function selectMode(el) {
    var m = el.dataset.mode;
    if (el.classList.contains('locked')) { toast(t('lockedToast')); vibrate(40); return; }
    if (m !== S.mode) { S.mode = m; S.mStep = 0; S.aStep = 0; }
    render();
  }
  $('modes').addEventListener('click', function (e) {
    var q = e.target.closest('.q');
    if (q) { e.stopPropagation(); q.closest('.mode').classList.toggle('open'); return; }
    var el = e.target.closest('.mode'); if (el) selectMode(el);
  });
  $('modes').addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('mode')) { e.preventDefault(); selectMode(e.target); }
  });

  $('plusBtn').addEventListener('click', function () {
    if (isStopped()) return;
    S.wins++; S.lossStreak = 0; S.mStep = 0;
    if (S.mode === 'anti') {
      if (S.aStep >= M.ANTI_STEPS - 1) { S.aStep = 0; toast(fmt(t('takeToast'), { t: money(M.antiMartingale().take) }), true); }
      else S.aStep++;
    }
    vibrate(20); render();
  });
  $('minusBtn').addEventListener('click', function () {
    if (isStopped()) return;
    var b = balance();
    S.losses++; S.lossStreak++;
    var stop = null;
    if (S.mode === 'marti') {
      var mx = M.martingale(b).maxSteps;
      if (S.mStep >= mx - 1) stop = 'steps'; else S.mStep++;
    }
    if (S.mode === 'anti') S.aStep = 0;
    if (S.lossStreak >= 3) stop = stop || 'streak';
    if (stop) triggerStop(stop); else vibrate(40);
    render();
  });
  $('resetBtn').addEventListener('click', function () {
    if (isStopped()) { toast(t('resetLocked')); return; }
    S.wins = 0; S.losses = 0; S.lossStreak = 0; S.mStep = 0; S.aStep = 0; render();
  });
  $('langBtn').addEventListener('click', function () { S.lang = S.lang === 'ru' ? 'en' : 'ru'; applyStatic(); render(); });
  $('themeBtn').addEventListener('click', function () { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyStatic(); render(); });

  window.addEventListener('resize', sizeTilt);
  if (window.ResizeObserver) new ResizeObserver(sizeTilt).observe($('tilt'));
  document.addEventListener('visibilitychange', function () { if (!document.hidden) render(); });
  setInterval(function () { if (S.stopDate && S.stopDate < today()) render(); }, 60000);

  applyStatic();
  render();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); });
  }
})();
