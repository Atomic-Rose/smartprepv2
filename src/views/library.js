// Course library: the first screen. One decision — pick a chapter and start.
import { ART } from '../ui/art.js';
import { button, icon } from '../ui/components.js';
import { plural } from '../logic/session.js';

function tile(chapter, i) {
  const titleId = `tile-title-${i}`;
  return `
    <li class="tile">
      <div class="tile-art">${ART[chapter.art]()}</div>
      <div class="tile-body">
        <p class="tile-num">Chapter ${chapter.number}</p>
        <h2 class="tile-title" id="${titleId}">${chapter.title}</h2>
        <p class="tile-meta">${plural(chapter.questions.length, 'question')}</p>
        ${button({ label: 'Start practice', action: 'start', block: true, after: icon.arrow,
                   attrs: `data-chapter="${i}" aria-describedby="${titleId}"` })}
      </div>
    </li>`;
}

export function renderLibrary(course, chapters) {
  return `
    <div class="library">
      <header class="course-head">
        <p class="kicker">Chapter practice</p>
        <h1 class="course-title" id="course-title" tabindex="-1">${course.code}</h1>
        <p class="course-lede">Pick a chapter. Five questions, each one explained.</p>
      </header>
      <ul class="tiles" aria-label="Chapters">
        ${chapters.map(tile).join('')}
      </ul>
    </div>`;
}
