// Запуск: node test/math.test.js
const assert = require('assert');
const M = require('../math.js');
let passed = 0;
function t(name, fn) { fn(); passed++; console.log('✓ ' + name); }

const expectedSteps = { 15: 3, 30: 4, 50: 5, 60: 5, 100: 6, 1000: 9, 3000: 10 };
for (const [b, n] of Object.entries(expectedSteps)) {
  t(`Мартингейл $${b} -> ${n} шагов`, () => {
    const r = M.martingale(Number(b));
    assert.strictEqual(r.maxSteps, n);
    assert.ok(r.total <= Number(b) + 1e-9, 'сумма шагов не превышает баланс');
    assert.ok(r.nextTotal > Number(b), 'следующий шаг уже не помещается');
    r.steps.forEach((s, i) => assert.ok(Math.abs(s.stake - Math.pow(2.15, i)) < 1e-9));
    console.log('   ' + r.steps.map(s => '$' + s.stakeDisplay.toFixed(2)).join(' + ') + ' = $' + M.round2(r.total).toFixed(2) + ' | следующий $' + M.round2(r.nextStake).toFixed(2));
  });
}

t('Мартингейл $60: точные суммы', () => {
  const r = M.martingale(60);
  assert.deepStrictEqual(r.steps.map(s => s.stakeDisplay), [1, 2.15, 4.62, 9.94, 21.37]);
  assert.strictEqual(M.round2(r.total), 39.08);
  assert.strictEqual(M.round2(r.nextStake), 45.94);
  assert.strictEqual(M.round2(r.nextTotal), 85.02);
});

t('Граница: баланс ровно равен сумме шагов', () => {
  assert.strictEqual(M.martingale(1).maxSteps, 1);
  assert.strictEqual(M.martingale(3.15).maxSteps, 2);
  assert.strictEqual(M.martingale(3.14).maxSteps, 1);
});

t('Фикса: 2–3%, минимум $1.00', () => {
  const cases = { 15: [1, 1], 30: [1, 1], 50: [1, 1.5], 60: [1.2, 1.8], 100: [2, 3], 1000: [20, 30], 3000: [60, 90] };
  for (const [b, [a, c]] of Object.entries(cases)) {
    const f = M.fixa(Number(b));
    assert.strictEqual(f.stake2, a, `2% от ${b}`);
    assert.strictEqual(f.stake3, c, `3% от ${b}`);
    assert.ok(f.stake2 >= 1 && f.stake3 >= 1);
  }
});

t('Баланс < $1: сделка невозможна', () => {
  assert.strictEqual(M.fixa(0.5), null);
  assert.strictEqual(M.martingale(0.99).maxSteps, 0);
  assert.strictEqual(M.canTrade(0.99), false);
  assert.strictEqual(M.canTrade(1), true);
});

t('Блокировка режимов: < $50 заблокировано, >= $50 открыто', () => {
  [15, 30, 49.99].forEach(b => assert.strictEqual(M.advancedUnlocked(b), false));
  [50, 60, 100, 1000, 3000].forEach(b => assert.strictEqual(M.advancedUnlocked(b), true));
});

t('Анти-Мартингейл: $1 -> $1.92 -> $3.69 -> $7.08', () => {
  const a = M.antiMartingale();
  assert.deepStrictEqual(a.steps.map(s => s.stakeDisplay), [1, 1.92, 3.69]);
  assert.deepStrictEqual(a.steps.map(s => s.ifWinDisplay), [1.92, 3.69, 7.08]);
  assert.ok(Math.abs(a.take - Math.pow(1.92, 3)) < 1e-12);
  assert.strictEqual(a.takeDisplay, 7.08);
  assert.strictEqual(a.profitDisplay, 6.08);
});

t('Разбор ввода', () => {
  assert.strictEqual(M.parseBalance('50'), 50);
  assert.strictEqual(M.parseBalance('1 000,5'), 1000.5);
  assert.strictEqual(M.parseBalance('$60'), 60);
  assert.ok(isNaN(M.parseBalance('abc')));
  assert.ok(isNaN(M.parseBalance('')));
  assert.ok(isNaN(M.parseBalance('-5')));
});

console.log(`\nВсе тесты пройдены: ${passed}`);
