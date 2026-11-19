import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS } from '../src/data/chapters.js';
import * as S from '../src/logic/session.js';

const ch1 = CHAPTERS[0], ch2 = CHAPTERS[1];

function play(chapterIndex, picks, mode = 'chapter') {
  let s = S.createSession({ mode, chapterIndex, questions: CHAPTERS[chapterIndex].questions });
  picks.forEach((p, i) => {
    s = S.answer(s, p);
    if (i < picks.length - 1) s = S.advance(s);
  });
  return s;
}

test('scores a chapter run', () => {
  const s = play(0, [2, 0, 0, 0, 3]);
  const { correct, total, missed } = S.score(s);
  assert.equal(correct, 3);
  assert.equal(total, 5);
  assert.deepEqual(missed.map(m => m.index), [1, 2]);
});

test('recommends Skills and careers with the exact demo sentence', () => {
  const rec = S.recommend(ch1, play(0, [2, 0, 0, 0, 3]));
  assert.equal(rec.topicName, 'Skills and careers');
  assert.equal(rec.sentence, 'You missed both questions on Skills and careers. Review slides 15 and 19.');
  assert.equal(rec.kind, 'practice');
  assert.equal(rec.actionLabel, 'Practice this topic');
  assert.equal(rec.questions, ch1.topics.skills.practice);
});

test('falls back to a labeled retry when no fresh questions exist', () => {
  const rec = S.recommend(ch2, play(1, [0, 2, 3, 1, 0]));
  assert.equal(rec.topicName, 'Industry structure');
  assert.equal(rec.sentence, 'You missed 1 of 2 questions on Industry structure. Reread the section on Porter’s five forces model.');
  assert.equal(rec.kind, 'retry');
  assert.equal(rec.actionLabel, 'Retry missed questions');
  assert.deepEqual(rec.questions, [ch2.questions[0]]);
});

test('ties go to the larger share missed, then chapter order', () => {
  // Miss Q1 (tech, 1 of 1) and Q2 (skills, 1 of 2): tech wins on share.
  assert.equal(S.recommend(ch1, play(0, [0, 0, 3, 0, 3])).topicKey, 'tech');
  // Miss Q4 (is, 1 of 1) and Q5 (data, 1 of 1): equal share, chapter order wins.
  assert.equal(S.recommend(ch1, play(0, [2, 2, 3, 1, 0])).topicKey, 'is');
});

test('formats slide lists', () => {
  assert.equal(S.formatSlides([9]), 'slide 9');
  assert.equal(S.formatSlides([15, 19]), 'slides 15 and 19');
  assert.equal(S.formatSlides([31, 38, 39]), 'slides 31, 38, and 39');
});

test('perfect score has no recommendation and no follow-up', () => {
  const s = play(0, [2, 2, 3, 0, 3]);
  assert.equal(S.score(s).correct, 5);
  assert.equal(S.recommend(ch1, s), null);
  assert.equal(S.followUpSession(ch1, s), null);
});

test('answers are locked once given and invalid choices are ignored', () => {
  let s = S.createSession({ chapterIndex: 0, questions: ch1.questions });
  assert.equal(S.advance(s), s, 'cannot advance before answering');
  assert.equal(S.answer(s, 9), s);
  assert.equal(S.answer(s, -1), s);
  s = S.answer(s, 1);
  assert.equal(S.answer(s, 2), s, 'second answer ignored');
  assert.equal(S.outcome(s).pick, 1);
  assert.equal(S.answeredCount(s), 1);
});

test('cannot advance past the last question', () => {
  const s = play(0, [2, 2, 3, 0, 3]);
  assert.ok(S.isLast(s));
  assert.equal(S.advance(s), s);
});

test('follow-up practice is scored separately from the chapter run', () => {
  const chapterRun = play(0, [2, 0, 0, 0, 3]);
  let f = S.followUpSession(ch1, chapterRun);
  assert.equal(f.mode, 'practice');
  assert.equal(f.topicKey, 'skills');
  f = S.answer(f, 1); f = S.advance(f); f = S.answer(f, 2);
  assert.deepEqual([S.score(f).correct, S.score(f).total], [2, 2]);
  assert.equal(S.score(chapterRun).correct, 3, 'chapter score unchanged');
  assert.equal(S.followUpSummary(ch1, f), 'Both right. Skills and careers is back on track.');
});

test('follow-up summary for a partial miss points back to the slides', () => {
  let f = S.followUpSession(ch1, play(0, [2, 0, 0, 0, 3]));
  f = S.answer(f, 1); f = S.advance(f); f = S.answer(f, 0);
  assert.equal(S.followUpSummary(ch1, f), 'You missed 1 of 2. Review slides 15 and 19.');
});

test('new follow-up questions carry no slide reference', () => {
  for (const c of CHAPTERS) for (const t of Object.values(c.topics)) for (const q of t.practice ?? []) {
    assert.equal(q.slides, undefined);
  }
});
