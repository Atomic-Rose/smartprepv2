// Score-led results: the big number on the left, one next step on the right,
// missed answers on demand below.
import { button, icon, tally, answerReview, scoreHeading } from '../ui/components.js';
import * as S from '../logic/session.js';

function disclosure(id, label, entries) {
  return `
    <div class="disclosure">
      <button class="disclosure-toggle" type="button" data-action="disclose" aria-expanded="false" aria-controls="${id}">
        <span>${label}</span>${icon.chevron}
      </button>
      <div class="collapse" id="${id}" hidden><div class="collapse-inner"><ol class="review-list">${answerReview(entries)}</ol></div></div>
    </div>`;
}

export function renderResults({ chapter, session, nextChapter }) {
  const sc = S.score(session);
  const rec = S.recommend(chapter, session);
  let panel, more;

  if (rec) {
    panel = `
      <section class="next-step" aria-labelledby="next-title">
        <p class="label">Review next</p>
        <h2 class="next-title" id="next-title">${rec.topicName}</h2>
        <p class="next-why" id="next-why">${rec.sentence}</p>
        ${button({ label: rec.actionLabel, action: 'follow-up', block: true, after: icon.arrow, attrs: 'aria-describedby="next-why"' })}
        <p class="next-note">${rec.kind === 'practice'
          ? `${S.plural(rec.questions.length, 'new question')} on this topic`
          : 'No new questions for this topic yet'}</p>
      </section>`;
    more = `
      ${disclosure('missed-panel', `Show missed answers (${sc.missed.length})`, sc.missed)}
      <div class="results-actions">
        ${button({ label: 'Restart chapter', action: 'restart', variant: 'secondary', before: icon.restart })}
        ${button({ label: 'Back to chapters', action: 'library', variant: 'quiet', before: icon.back })}
      </div>`;
  } else {
    panel = `
      <section class="next-step" aria-labelledby="next-title">
        <p class="label">All clear</p>
        <h2 class="next-title" id="next-title">Nothing to review</h2>
        <p class="next-why">${nextChapter ? `Chapter ${nextChapter.number} is next.` : 'That was the last chapter.'}</p>
        ${nextChapter
          ? button({ label: `Start Chapter ${nextChapter.number}`, action: 'next-chapter', block: true, after: icon.arrow })
          : button({ label: 'Back to chapters', action: 'library', block: true, after: icon.arrow })}
      </section>`;
    more = `
      <div class="results-actions">
        ${button({ label: 'Restart chapter', action: 'restart', variant: 'secondary', before: icon.restart })}
        ${nextChapter ? button({ label: 'Back to chapters', action: 'library', variant: 'quiet', before: icon.back }) : ''}
      </div>`;
  }

  return `
    <div class="results">
      <div class="results-score">
        <p class="kicker">Chapter ${chapter.number} · ${chapter.title}</p>
        ${scoreHeading(sc.correct, sc.total)}
        ${tally(sc.entries)}
        <p class="score-caption">Chapter score</p>
      </div>
      ${panel}
      <div class="results-more">${more}</div>
    </div>`;
}

export function renderFollowUpResults({ chapter, session, chapterSession }) {
  const sc = S.score(session);
  const base = S.score(chapterSession);
  const topic = chapter.topics[session.topicKey];
  const kind = session.mode === 'practice' ? 'Topic practice' : 'Retry';

  return `
    <div class="results">
      <div class="results-score">
        <p class="kicker">${kind} · ${topic.name}</p>
        ${scoreHeading(sc.correct, sc.total)}
        ${tally(sc.entries)}
        <p class="score-caption">${kind} score. Your Chapter ${chapter.number} score stays ${base.correct}/${base.total}.</p>
      </div>
      <section class="next-step" aria-labelledby="next-title">
        <p class="label">${kind} done</p>
        <h2 class="next-title" id="next-title">${topic.name}</h2>
        <p class="next-why">${S.followUpSummary(chapter, session)}</p>
        ${button({ label: 'Return to chapters', action: 'library', block: true, after: icon.arrow })}
      </section>
      <div class="results-more">
        ${disclosure('practice-panel', `Show your answers (${sc.total})`, sc.entries)}
        <div class="results-actions">
          ${button({ label: `Back to Chapter ${chapter.number} results`, action: 'results', variant: 'quiet', before: icon.back })}
        </div>
      </div>
    </div>`;
}
