// App entry: holds app state and navigates between the library, quiz and results screens.
import { COURSE, CHAPTERS } from './data/chapters.js';
import * as Session from './logic/session.js';
import { renderLibrary } from './views/library.js';
import { mountQuiz } from './views/quiz.js';
import { renderResults, renderFollowUpResults } from './views/results.js';
import { mount, toggleRegion } from './ui/dom.js';

const root = document.getElementById('app');

const app = {
  session: null,        // the quiz in progress (chapter, practice or retry)
  chapterSession: null, // last finished chapter run; follow-ups never modify it
  quiz: null,           // quiz view controller while a quiz is on screen
  busy: false           // true during the short question cross-fade
};

const chapterOf = s => CHAPTERS[s.chapterIndex];

/* ---------- Navigation ---------- */

function showLibrary() {
  app.quiz = null;
  mount(root, renderLibrary(COURSE, CHAPTERS), { screen: 'library', focus: '#course-title' });
}

function startQuiz(session) {
  app.session = session;
  app.busy = false;
  app.quiz = mountQuiz(root, session, chapterOf(session));
}

function startChapter(i) {
  if (!CHAPTERS[i]) return;
  startQuiz(Session.createSession({ mode: 'chapter', chapterIndex: i, questions: CHAPTERS[i].questions }));
}

function startFollowUp() {
  const s = Session.followUpSession(chapterOf(app.chapterSession), app.chapterSession);
  if (s) startQuiz(s);
}

function showResults() {
  app.quiz = null;
  const s = app.chapterSession;
  mount(root, renderResults({ chapter: chapterOf(s), session: s, nextChapter: CHAPTERS[s.chapterIndex + 1] }),
    { screen: 'results', focus: '#score' });
}

function showFollowUpResults(s) {
  app.quiz = null;
  mount(root, renderFollowUpResults({ chapter: chapterOf(s), session: s, chapterSession: app.chapterSession }),
    { screen: 'results', focus: '#score' });
}

/* ---------- Quiz actions ---------- */

function pick(i) {
  if (!app.quiz || app.busy) return;
  const next = Session.answer(app.session, i);
  if (next === app.session) return; // already answered or invalid choice
  app.session = next;
  app.quiz.feedback(next);
}

async function proceed() {
  const s = app.session;
  if (!app.quiz || app.busy || !Session.isAnswered(s)) return;
  if (Session.isLast(s)) return finish();
  app.busy = true;
  app.session = Session.advance(s);
  await app.quiz.next(app.session);
  app.busy = false;
}

function finish() {
  const s = app.session;
  if (s.mode === 'chapter') {
    app.chapterSession = s;
    showResults();
  } else {
    showFollowUpResults(s);
  }
}

function exitQuiz() {
  // Leaving follow-up practice returns to the chapter results; leaving a chapter returns home.
  if (app.session?.mode !== 'chapter' && app.chapterSession) showResults();
  else showLibrary();
}

/* ---------- Events ---------- */

const actions = {
  start: el => startChapter(Number(el.dataset.chapter)),
  pick: el => pick(Number(el.dataset.i)),
  continue: proceed,
  exit: exitQuiz,
  'follow-up': startFollowUp,
  restart: () => startChapter(app.chapterSession.chapterIndex),
  'next-chapter': () => startChapter(app.chapterSession.chapterIndex + 1),
  results: showResults,
  library: showLibrary,
  disclose: toggleRegion
};

root.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  actions[el.dataset.action]?.(el);
});

// In a quiz, A–D or 1–4 answers the current question; Enter then activates the focused Continue.
document.addEventListener('keydown', e => {
  if (!app.quiz || e.altKey || e.ctrlKey || e.metaKey || e.repeat || e.key.length !== 1) return;
  const key = e.key.toLowerCase();
  const i = 'abcd'.includes(key) ? 'abcd'.indexOf(key) : '1234'.indexOf(key);
  if (i < 0) return;
  e.preventDefault();
  pick(i);
});

showLibrary();
