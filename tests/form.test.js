import test from 'node:test';
import assert from 'node:assert/strict';
import {dateFromOffset, passwordRules, validateStage, DAY, FIRST_DAY} from '../terrible-form/rules.js';
const valid = {alias:'BOB',birthdayConfirmed:true,country:'New Tabistan',password:'Bureaucregg7',termsRead:true,termsAccepted:true,human:'two'};
test('the deliberately bad form has a complete valid path', () => {
  for (const stage of [0,1,2]) assert.equal(validateStage(stage,valid),'');
  assert.ok(Object.values(passwordRules(valid.password)).every(Boolean));
});
test('each stage rejects its unmet requirements', () => {
  for (const [stage,patch] of [[0,{alias:'AB'}],[0,{birthdayConfirmed:false}],[1,{country:''}],[1,{password:'password'}],[2,{termsRead:false}],[2,{termsAccepted:false}],[2,{human:'one'}],[2,{human:'three'}]]) {
    assert.notEqual(validateStage(stage,{...valid,...patch}),'');
  }
});
test('password requires exactly one odd digit and literal egg', () => {
  assert.equal(passwordRules('Bureaucregg2').number,false);
  assert.equal(passwordRules('Bureaucregg71').number,false);
  assert.equal(passwordRules('BureaucrEgg7').egg,false);
  assert.equal(passwordRules('Bureau egg7 ').space,false);
});
test('birthday offsets include leap day without timezone drift', () => {
  assert.equal(dateFromOffset(0).toISOString().slice(0,10),'1900-01-01');
  const offset=(Date.UTC(2000,1,29)-FIRST_DAY)/DAY;
  assert.equal(dateFromOffset(offset).toISOString().slice(0,10),'2000-02-29');
  assert.equal(dateFromOffset(offset+1).toISOString().slice(0,10),'2000-03-01');
});
