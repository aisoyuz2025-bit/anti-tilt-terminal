/* Анти-Тильт: чистая математика (общая для браузера и Node-тестов) */
(function (root) {
  'use strict';
  var MIN_TRADE = 1.0;          // минимальная сделка строго $1.00
  var LOCK_THRESHOLD = 50;      // Мартингейл / Анти-Мартингейл от $50
  var MARTI_COEF = 2.15;        // множитель Мартингейла
  var PAYOUT = 0.92;            // выплата 92%
  var ANTI_STEPS = 3;           // лестница разгона из 3 шагов
  var EPS = 1e-9;

  function round2(x) { return Math.round((x + EPS) * 100) / 100; }
  function floor2(x) { return Math.floor((x + EPS) * 100) / 100; }

  /** Разбор ввода: "1 000,50" -> 1000.5; NaN если некорректно */
  function parseBalance(str) {
    if (typeof str === 'number') return isFinite(str) ? str : NaN;
    if (str == null) return NaN;
    var s = String(str).replace(/[\s$]/g, '').replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(s)) return NaN;
    return parseFloat(s);
  }

  function canTrade(balance) { return isFinite(balance) && balance >= MIN_TRADE; }
  function advancedUnlocked(balance) { return isFinite(balance) && balance >= LOCK_THRESHOLD; }

  /** Фикса: 2% и 3% от баланса, но не меньше $1.00 */
  function fixa(balance) {
    if (!canTrade(balance)) return null;
    var raw2 = balance * 0.02, raw3 = balance * 0.03;
    var s2 = Math.max(MIN_TRADE, floor2(raw2));
    var s3 = Math.max(MIN_TRADE, floor2(raw3));
    return { stake2: s2, stake3: s3, floored2: raw2 < MIN_TRADE, floored3: raw3 < MIN_TRADE };
  }

  /**
   * Мартингейл: шаг n = 1 * 2.15^(n-1). Шаги добавляются, пока
   * СУММА всех шагов (точная) не превышает баланс.
   */
  function martingale(balance) {
    var steps = [];
    if (!canTrade(balance)) return { steps: steps, maxSteps: 0, total: 0, nextStake: MIN_TRADE, nextTotal: MIN_TRADE };
    var sum = 0, n = 1;
    while (true) {
      var stake = MIN_TRADE * Math.pow(MARTI_COEF, n - 1);
      if (sum + stake > balance + EPS) {
        return { steps: steps, maxSteps: steps.length, total: sum, nextStake: stake, nextTotal: sum + stake };
      }
      sum += stake;
      steps.push({ step: n, stake: stake, cumulative: sum, stakeDisplay: round2(stake), cumulativeDisplay: round2(sum) });
      n++;
      if (n > 200) break; // защита
    }
    return { steps: steps, maxSteps: steps.length, total: sum, nextStake: 0, nextTotal: sum };
  }

  /** Анти-Мартингейл: риск $1, при плюсе вся сумма (ставка * 1.92) идёт дальше */
  function antiMartingale() {
    var steps = [];
    for (var i = 1; i <= ANTI_STEPS; i++) {
      var stake = MIN_TRADE * Math.pow(1 + PAYOUT, i - 1);
      var result = MIN_TRADE * Math.pow(1 + PAYOUT, i);
      steps.push({ step: i, stake: stake, ifWin: result, stakeDisplay: round2(stake), ifWinDisplay: round2(result) });
    }
    var take = MIN_TRADE * Math.pow(1 + PAYOUT, ANTI_STEPS);
    return { steps: steps, take: take, takeDisplay: round2(take), profit: take - MIN_TRADE, profitDisplay: round2(take - MIN_TRADE), risk: MIN_TRADE };
  }

  var api = {
    MIN_TRADE: MIN_TRADE, LOCK_THRESHOLD: LOCK_THRESHOLD, MARTI_COEF: MARTI_COEF,
    PAYOUT: PAYOUT, ANTI_STEPS: ANTI_STEPS,
    round2: round2, floor2: floor2, parseBalance: parseBalance, canTrade: canTrade,
    advancedUnlocked: advancedUnlocked, fixa: fixa, martingale: martingale, antiMartingale: antiMartingale
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AntiTiltMath = api;
})(typeof self !== 'undefined' ? self : this);
