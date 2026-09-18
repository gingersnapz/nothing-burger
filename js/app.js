import {categories} from './catalog.js';
import {createMachine} from './engine.js';
import {interactions} from './toys.js';

const machine = createMachine(categories);
const select = document.querySelector('#category');
const receipt = document.querySelector('#receipt');
const generate = document.querySelector('#generate');
const interaction = document.querySelector('#interaction');
let count = 0;
for (const category of categories) {
  const option = document.createElement('option');
  option.value = category.id;
  option.textContent = category.label;
  select.append(option);
}
generate.disabled = false;
generate.addEventListener('click', () => {
  const result = machine.next(select.value);
  count++;
  document.querySelector('#result-category').textContent = result.category.toUpperCase();
  document.querySelector('#result-number').textContent = `№ ${String(count).padStart(3, '0')}`;
  document.querySelector('#result-symbol').textContent = result.symbol;
  document.querySelector('#result-title').textContent = result.title;
  document.querySelector('#result-body').textContent = result.body;
  document.querySelector('#result-note').textContent = result.note;
  document.querySelector('#count').textContent = count.toLocaleString();
  interaction.replaceChildren();
  if (result.interaction) interactions[result.interaction]?.(interaction);
  receipt.classList.remove('arrive');
  // Restart the short receipt animation; reduced-motion users get a static update.
  void receipt.offsetWidth;
  receipt.classList.add('arrive');
});
