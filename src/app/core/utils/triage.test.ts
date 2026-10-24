import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDangerSigns, DANGER_SIGNS } from './triage';

test('evaluateDangerSigns returns green when no symptoms are selected', () => {
  const result = evaluateDangerSigns([]);
  assert.equal(result.riskLevel, 'green');
  assert.equal(result.criticalSymptoms.length, 0);
  assert.equal(result.warningSymptoms.length, 0);
  assert.match(result.summary, /ALL CLEAR/);
});

test('evaluateDangerSigns detects red alert for pre-eclampsia symptoms', () => {
  const result = evaluateDangerSigns(['severe_headache_vision']);
  assert.equal(result.riskLevel, 'red');
  assert.equal(result.criticalSymptoms.length, 1);
  assert.match(result.clinicalProtocolRecommendation, /Magnesium Sulfate/);
});

test('evaluateDangerSigns detects red alert for postpartum hemorrhage', () => {
  const result = evaluateDangerSigns(['vaginal_bleeding']);
  assert.equal(result.riskLevel, 'red');
  assert.match(result.clinicalProtocolRecommendation, /Postpartum Hemorrhage/);
});

test('evaluateDangerSigns flags amber warning for swollen hands and face', () => {
  const result = evaluateDangerSigns(['swollen_face_hands']);
  assert.equal(result.riskLevel, 'amber');
  assert.equal(result.criticalSymptoms.length, 0);
  assert.equal(result.warningSymptoms.length, 1);
});

test('evaluateDangerSigns escalates severe blood pressure vitals to red alert', () => {
  const result = evaluateDangerSigns([], { systolicBp: 165, diastolicBp: 112 });
  assert.equal(result.riskLevel, 'red');
});

test('DANGER_SIGNS contains both maternal and newborn critical signs', () => {
  const newbornSigns = DANGER_SIGNS.filter(ds => ds.category === 'newborn');
  const maternalSigns = DANGER_SIGNS.filter(ds => ds.category === 'maternal');
  assert.ok(newbornSigns.length >= 3);
  assert.ok(maternalSigns.length >= 4);
});
