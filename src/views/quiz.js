// Focused lesson view: slim progress rail, one question, a divided answer list,
// and a bottom bar whose Continue button never moves.
import { mount, swap, announce } from '../ui/dom.js';
import { icon, LETTERS } from '../ui/components.js';
import * as S from '../logic/session.js';

export function sessionLabel(session, chapter) {
  if (session.mode === 'chapter') return `Chapter ${chapter.number}`;
  const name = chapter.topics[session.topicKey].name;
  return session.mode === 'practice' ? `Topic practice · ${name}` : `Retry · ${name}`;
}

function shell(total) {
  return `
    <div class="lesson">
      <header class="lesson-top">
        <div class="lesson-top-inner">
          <button class="btn btn--quiet lesson-exit" type="button" data-action="exit">${icon.x}<span>Exit</span></button>
          <div class="rail" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="0">
            <span class="rail-fill" data-ref="rail"></span>
          </div>
          <span class="lesson-count"><span class="vh">Question </span><span data-ref="num">1</span> of ${total}</span>
        </div>
      </header>
      <div class="lesson-body" data-ref="stage"></div>
      <footer class="lesson-bar">
        <div class="lesson-bar-inner">
          <p class="lesson-status" data-ref="status"></p>
          <button class="btn btn--primary lesson-continue" type="button" data-action="continue" data-ref="continue" disabled></button>
        </div>
      </footer>
    </div>`;
}

function questionMarkup(session, chapter) {
  const q = S.currentQuestion(session);
  return `
    <div class="lesson-prompt">
      <p class="lesson-kicker">${sessionLabel(session, chapter)}</p>
      <h1 class="lesson-q" id="q-text" tabindex="-1">${q.q}</h1>
    </div>
    <div class="lesson-work">
    <ol class="choices" aria-labelledby="q-text">
      ${q.choices.map((text, i) => `
        <li>
          <button class="choice" type="button" data-action="pick" data-i="${i}">
            <span class="choice-flag" data-flag></span>
            <span class="choice-key" aria-hidden="true">${LETTERS[i]}</span>
            <span class="choice-text"><span class="vh">${LETTERS[i]}. </span>${text}</span>
          </button>
        </li>`).join('')}
    </ol>
    <div class="collapse" data-ref="explain"><div class="collapse-inner"></div></div>
    </div>`;
}

export function mountQuiz(root, session, chapter) {
  mount(root, shell(session.questions.length), { screen: 'quiz' });
  const $ = ref => root.querySelector(`[data-ref="${ref}"]`);

  function setProgress(done) {
    const total = session.questions.length;
    $('rail').style.width = `${(done / total) * 100}%`;
    $('rail').parentElement.setAttribute('aria-valuenow', done);
  }

  function render(s) {
    $('stage').innerHTML = questionMarkup(s, chapter);
    $('num').textContent = s.index + 1;
    const status = $('status');
    status.className = 'lesson-status';
    status.textContent = 'Select an answer';
    const cont = $('continue');
    cont.disabled = true;
    cont.innerHTML = `<span>${S.isLast(s) ? 'See results' : 'Continue'}</span>${icon.arrow}`;
    root.querySelector('#q-text').focus({ preventScroll: true });
  }

  render(session);

  return {
    /** Show the next question with a quick cross-fade; header and bar stay put. */
    next(s) {
      return swap($('stage'), () => { render(s); window.scrollTo(0, 0); });
    },

    /** Mark the rows, reveal the explanation, enable Continue. Nothing above the explanation moves. */
    feedback(s) {
      const { question: q, pick, correct } = S.outcome(s);
      root.querySelectorAll('.choice').forEach((row, k) => {
        row.disabled = true;
        let flag = '';
        if (k === q.answer) {
          row.classList.add('is-correct');
          flag = `${icon.check}${correct ? 'Your answer · Correct' : 'Correct answer'}`;
        } else if (k === pick) {
          row.classList.add('is-wrong');
          flag = `${icon.x}Your answer`;
        } else {
          row.classList.add('is-muted');
        }
        row.querySelector('[data-flag]').innerHTML = flag;
      });

      setProgress(S.answeredCount(s));

      const status = $('status');
      status.className = `lesson-status ${correct ? 'is-correct' : 'is-wrong'}`;
      status.innerHTML = correct ? `${icon.check}Correct` : `${icon.x}Not quite`;

      const explain = $('explain');
      explain.firstElementChild.innerHTML = `
        <div class="explain-card">
          <p class="explain-text"><strong>${correct ? 'Correct.' : `The answer is ${LETTERS[q.answer]}.`}</strong> ${q.why}</p>
          ${q.slides ? `<p class="explain-ref">Chapter ${chapter.number} · ${q.slides}</p>` : ''}
        </div>`;
      requestAnimationFrame(() => explain.classList.add('is-open'));

      const cont = $('continue');
      cont.disabled = false;
      cont.focus({ preventScroll: true }); // the bar is always on screen, so no scrolling is needed
      announce(correct
        ? `Correct. ${q.why}`
        : `Incorrect. The correct answer is ${LETTERS[q.answer]}, ${q.choices[q.answer]}. ${q.why}`);
    }
  };
}
