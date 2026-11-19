// Markup for pieces that repeat across screens.

const svg = (body, extra = '') =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${body}</svg>`;

export const icon = {
  check: svg('<path d="M5 12.5l4.5 4.5L19 7" stroke-width="2.6"/>'),
  x: svg('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke-width="2.6"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6" stroke-width="2.2"/>'),
  back: svg('<path d="M19 12H5M11 6l-6 6 6 6" stroke-width="2.2"/>'),
  restart: svg('<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" stroke-width="2.2"/>'),
  chevron: svg('<path d="M6 9l6 6 6-6" stroke-width="2.2"/>', ' data-chevron')
};

export const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * The one button component.
 * variant: 'primary' (cobalt, one per screen), 'secondary' (outlined) or 'quiet' (text only).
 */
export function button({ label, action, variant = 'primary', block = false, before = '', after = '', attrs = '' }) {
  const cls = `btn btn--${variant}${block ? ' btn--block' : ''}`;
  return `<button class="${cls}" type="button" data-action="${action}" ${attrs}>${before}<span>${label}</span>${after}</button>`;
}

/** Decorative per-question tally used under the big score. */
export function tally(entries) {
  return `<div class="tally" aria-hidden="true">${entries.map(e => `<span class="${e.correct ? 'hit' : 'miss'}"></span>`).join('')}</div>`;
}

/** Answer review list: one item per question, with the student's pick and the key. */
export function answerReview(entries) {
  return entries.map(({ question: q, pick, correct }) => `
    <li class="review-item">
      <p class="review-q">${q.q}</p>
      <dl class="review-answers">
        <div class="${correct ? 'is-correct' : 'is-wrong'}">
          <dt>${correct ? icon.check : icon.x}Your answer</dt>
          <dd>${LETTERS[pick]}. ${q.choices[pick]}</dd>
        </div>
        ${correct ? '' : `
        <div class="is-correct">
          <dt>${icon.check}Correct answer</dt>
          <dd>${LETTERS[q.answer]}. ${q.choices[q.answer]}</dd>
        </div>`}
      </dl>
      ${q.slides ? `<p class="review-ref">${q.slides}</p>` : ''}
    </li>`).join('');
}

/** Big score heading. The visible numerals are decorative; screen readers get the sentence. */
export function scoreHeading(correct, total) {
  return `<h1 class="score" id="score" tabindex="-1">
      <span class="score-num" aria-hidden="true">${correct}</span><span class="score-of" aria-hidden="true">/${total}</span>
      <span class="vh">${correct} of ${total} correct</span>
    </h1>`;
}
