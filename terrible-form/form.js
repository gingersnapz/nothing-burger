import {DAY, FIRST_DAY, dateFromOffset, passwordRules, validateStage} from './rules.js';

const $ = selector => document.querySelector(selector);
const form = $('#diabolical-form');
const controls = $('#form-controls');
const next = $('#continue');
const error = $('#form-error');
const birthday = $('#birthday');
const terms = $('#terms-box');
let stage = 0;
let alias = '';
let actions = 0;
let termsRead = false;
let evasions = 0;
let processing = false;
let timer;

const today = new Date();
birthday.max = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - FIRST_DAY) / DAY);
const formatter = new Intl.DateTimeFormat('en-US', {month:'long', day:'numeric', year:'numeric', timeZone:'UTC'});
function updateDate() {
  const date = formatter.format(dateFromOffset(birthday.value));
  $('#birthday-display').textContent = date;
  birthday.setAttribute('aria-valuetext', date);
}
function shuffleLetters() {
  const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  $('#letter').replaceChildren(...letters.map(letter => new Option(letter, letter)));
}
function updateAlias() {
  $('#alias').textContent = alias || '_ _ _';
  $('#add-letter').disabled = alias.length >= 12;
  $('#undo-letter').disabled = alias.length === 0;
}
function updateRules() {
  for (const [name, passed] of Object.entries(passwordRules($('#password').value))) {
    $(`[data-rule="${name}"]`).classList.toggle('passed', passed);
  }
}
function burden() {
  actions++;
  $('#burden').textContent = actions;
}
function showError(message) {
  error.textContent = message;
  error.hidden = false;
  error.focus();
}
function showStage(focus = true) {
  document.querySelectorAll('.stage').forEach((node, index) => { node.hidden = index !== stage; });
  document.querySelectorAll('#steps li').forEach((node, index) => {
    node.removeAttribute('aria-current');
    node.classList.toggle('done', index < stage);
    if (index === stage) node.setAttribute('aria-current', 'step');
  });
  $('#page-label').textContent = `SECTION 0${stage + 1} / 03`;
  $('#back').hidden = stage === 0;
  next.textContent = stage === 2 ? 'Submit this regrettable application →' : 'Proceed, regrettably →';
  next.classList.remove('evade-left', 'evade-middle');
  error.hidden = true;
  if (focus) $(`#stage-${stage}-title`).focus();
}
function state() {
  return {alias, birthdayConfirmed:$('#birthday-confirm').checked, country:$('#country').value,
    password:$('#password').value, termsRead, termsAccepted:$('#terms-accept').checked,
    human:document.querySelector('input[name="human"]:checked')?.value};
}
function complete() {
  processing = false;
  form.hidden = true;
  $('#success').hidden = false;
  $('#receipt-name').textContent = alias;
  $('#receipt-actions').textContent = actions;
  $('#password').value = '';
  $('#page-label').textContent = 'CASE CLOSED. NOTHING RESOLVED.';
  document.querySelectorAll('#steps li').forEach(node => {node.classList.add('done'); node.removeAttribute('aria-current');});
  $('#success-title').focus();
}
function reset() {
  clearTimeout(timer);
  form.reset();
  alias = '';
  actions = 0;
  termsRead = false;
  evasions = 0;
  processing = false;
  stage = 0;
  controls.disabled = false;
  $('#terms-accept').disabled = true;
  $('#terms-status').textContent = 'Acknowledgement locked. Please perform scrolling.';
  $('#burden').textContent = '0';
  $('#submission-note').textContent = 'Estimated completion time: longer than necessary.';
  $('#success').hidden = true;
  form.hidden = false;
  terms.scrollTop = 0;
  updateAlias();
  updateDate();
  updateRules();
  shuffleLetters();
  showStage();
}
// All state stays in memory. There are no fetches, storage calls, or real submissions.
form.addEventListener('click', event => {if (event.target.closest('button')) burden();});
form.addEventListener('input', burden);
$('#add-letter').addEventListener('click', () => {
  if (alias.length >= 12) return;
  alias += $('#letter').value;
  updateAlias();
  shuffleLetters();
});
$('#undo-letter').addEventListener('click', () => {alias = alias.slice(0, -1); updateAlias();});
birthday.addEventListener('input', () => {updateDate(); $('#birthday-confirm').checked = false;});
$('#password').addEventListener('input', updateRules);
$('#back').addEventListener('click', () => {if (stage > 0 && !processing) {stage--; showStage();}});
terms.addEventListener('scroll', () => {
  if (stage === 2 && terms.clientHeight > 0 && !termsRead && terms.scrollTop + terms.clientHeight >= terms.scrollHeight - 4) {
    termsRead = true;
    $('#terms-accept').disabled = false;
    $('#terms-status').textContent = 'Scrolling certified. You may now acknowledge the scrolling.';
    burden();
  }
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (processing) return;
  const message = validateStage(stage, state());
  if (message) {showError(message); return;}
  error.hidden = true;
  if (stage < 2) {stage++; showStage(); return;}
  if (evasions < 2) {
    evasions++;
    next.classList.toggle('evade-left', evasions === 1);
    next.classList.toggle('evade-middle', evasions === 2);
    next.textContent = evasions === 1 ? 'Submit, but over here →' : 'Fine. Submit for real →';
    showError(evasions === 1 ? 'The submit button has relocated to another department. Please click it again.' : 'Your request to submit has been acknowledged. One final click. We promise, reluctantly.');
    return;
  }
  processing = true;
  controls.disabled = true;
  $('#submission-note').setAttribute('role', 'status');
  $('#submission-note').textContent = '99% complete. Waiting for the last 1% to return from lunch…';
  next.textContent = 'Bureaucracy in progress…';
  timer = setTimeout(complete, 2400);
});
$('#restart').addEventListener('click', reset);
window.addEventListener('pagehide', () => {clearTimeout(timer); if (processing) {processing = false; controls.disabled = false; next.textContent = 'Fine. Submit for real →';}});
const country = $('#country');
const options = [...country.options].slice(1).sort((a,b) => a.text.slice(2).localeCompare(b.text.slice(2)));
options.forEach(option => country.append(option));
shuffleLetters();
updateDate();
updateAlias();
updateRules();
controls.disabled = false;
