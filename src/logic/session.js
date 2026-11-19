// Quiz session logic: answers, progress, scoring and recommendations.
// Pure functions with no DOM access. Every update returns a new session object,
// so a finished chapter session can be kept untouched while follow-up practice runs.

/**
 * @typedef {{ q: string, choices: string[], answer: number, why: string, slides?: string, topic?: string }} Question
 * @typedef {{ mode: 'chapter'|'practice'|'retry', chapterIndex: number, topicKey: string|null,
 *             questions: Question[], picks: (number|null)[], index: number }} Session
 */

/** @returns {Session} */
export function createSession({ mode = 'chapter', chapterIndex, topicKey = null, questions }) {
  return { mode, chapterIndex, topicKey, questions, picks: questions.map(() => null), index: 0 };
}

export const currentQuestion = s => s.questions[s.index];
export const isAnswered = s => s.picks[s.index] !== null;
export const isLast = s => s.index === s.questions.length - 1;
export const answeredCount = s => s.picks.filter(p => p !== null).length;

/** Record an answer for the current question. Ignores repeats and out-of-range choices. */
export function answer(s, choice) {
  const q = currentQuestion(s);
  if (isAnswered(s) || !Number.isInteger(choice) || choice < 0 || choice >= q.choices.length) return s;
  const picks = s.picks.slice();
  picks[s.index] = choice;
  return { ...s, picks };
}

/** The outcome of the current question, once answered. */
export function outcome(s) {
  const question = currentQuestion(s), pick = s.picks[s.index];
  return { question, pick, correct: pick === question.answer };
}

/** Move to the next question. Only allowed after answering, and not past the end. */
export function advance(s) {
  if (!isAnswered(s) || isLast(s)) return s;
  return { ...s, index: s.index + 1 };
}

export function score(s) {
  const entries = s.questions.map((question, index) => ({
    question, index, pick: s.picks[index], correct: s.picks[index] === question.answer
  }));
  const correct = entries.filter(e => e.correct).length;
  return { correct, total: entries.length, entries, missed: entries.filter(e => !e.correct) };
}

/* ---------- Copy helpers ---------- */

export function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export function formatSlides(list) {
  if (list.length === 1) return `slide ${list[0]}`;
  if (list.length === 2) return `slides ${list[0]} and ${list[1]}`;
  return `slides ${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}

export function reviewLine(topic) {
  return topic.slides ? `Review ${formatSlides(topic.slides)}.` : topic.review;
}

function missedPhrase(missed, total) {
  if (missed < total) return `${missed} of ${total} questions`;
  if (total === 1) return 'the question';
  if (total === 2) return 'both questions';
  return `all ${total} questions`;
}

/**
 * Pick one topic to review after a chapter session, or null for a perfect score.
 * Ranking: most misses, then the larger share of that topic missed, then chapter order.
 */
export function recommend(chapter, session) {
  const { missed } = score(session);
  if (!missed.length) return null;

  const order = Object.keys(chapter.topics);
  const stats = order
    .map(key => ({
      key,
      missed: missed.filter(e => e.question.topic === key).length,
      total: session.questions.filter(q => q.topic === key).length
    }))
    .filter(t => t.missed > 0)
    .sort((a, b) => b.missed - a.missed || b.missed / b.total - a.missed / a.total || order.indexOf(a.key) - order.indexOf(b.key));

  const top = stats[0];
  const topic = chapter.topics[top.key];
  const fresh = topic.practice ?? [];
  const retry = missed.filter(e => e.question.topic === top.key).map(e => e.question);

  return {
    topicKey: top.key,
    topicName: topic.name,
    missed: top.missed,
    topicTotal: top.total,
    sentence: `You missed ${missedPhrase(top.missed, top.total)} on ${topic.name}. ${reviewLine(topic)}`,
    kind: fresh.length ? 'practice' : 'retry',
    actionLabel: fresh.length ? 'Practice this topic' : 'Retry missed questions',
    questions: fresh.length ? fresh : retry
  };
}

/** Build the follow-up session for a finished chapter session, or null if nothing was missed. */
export function followUpSession(chapter, chapterSession) {
  const rec = recommend(chapter, chapterSession);
  if (!rec) return null;
  return createSession({
    mode: rec.kind,
    chapterIndex: chapterSession.chapterIndex,
    topicKey: rec.topicKey,
    questions: rec.questions
  });
}

/** One-line summary for a finished follow-up session. */
export function followUpSummary(chapter, session) {
  const { correct, total } = score(session);
  const topic = chapter.topics[session.topicKey];
  if (correct === total) {
    const lead = total === 1 ? 'Right' : total === 2 ? 'Both right' : `All ${total} right`;
    return `${lead}. ${topic.name} is back on track.`;
  }
  return `You missed ${total - correct} of ${total}. ${reviewLine(topic)}`;
}
