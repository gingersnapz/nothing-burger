import test from 'node:test';
import assert from 'node:assert/strict';
import {categories} from '../js/catalog.js';
import {createMachine} from '../js/engine.js';
import {interactions} from '../js/toys.js';
test('each category exhausts all content before recycling, with no boundary repeat', () => {
  for (const category of categories) {
    const machine = createMachine(categories);
    const results = Array.from({length: category.entries.length}, () => machine.next(category.id));
    assert.equal(new Set(results.map(r => r.key)).size, category.entries.length);
    assert.ok(results.every(r => r.category === category.label));
    assert.notEqual(machine.next(category.id).key, results.at(-1).key);
  }
});
test('all mode can reach every entry and every toy has a registered handler', () => {
  const machine = createMachine(categories);
  const count = categories.reduce((n,c) => n + c.entries.length, 0);
  const results = Array.from({length: count}, () => machine.next());
  assert.equal(new Set(results.map(r => r.key)).size, count);
  for (const r of results) {
    assert.ok(r.title && r.body && r.note);
    if (r.interaction) assert.equal(typeof interactions[r.interaction], 'function');
  }
});
test('unknown category fails clearly', () => assert.throws(() => createMachine(categories).next('missing'), /Unknown/));
