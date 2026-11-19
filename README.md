# SmartPrep v2

Chapter practice for CIS 3010-16. Pick a chapter, answer five questions with an explanation for each, then practice the topic you struggled with.

## Run it

```
npm run dev
```

Then open http://localhost:5173/. No install step: the dev server is a zero-dependency Node script (Node 18+). The app uses ES modules, so it has to be served over http rather than opened from `file://`.

```
npm test
```

Runs the scoring and recommendation tests in Node, without the UI.

The v1 prototype is kept unchanged at `prototype/smartprep-v1.html` (http://localhost:5173/prototype/smartprep-v1.html).

## Demo path (targeted practice)

1. Chapter 1 → **Start practice**
2. Answer **C, A, A, A, D**, pressing **Continue** after each (the last one says **See results**)
3. Results: **3/5**, "You missed both questions on Skills and careers. Review slides 15 and 19."
4. **Practice this topic** → answer **B, C** → 2/2, scored separately from the chapter
5. **Return to chapters**

Keyboard: Tab and Enter work throughout. In a quiz, A–D or 1–4 answers the current question.

## Files

| Path | Responsibility |
| --- | --- |
| `index.html` | Page shell; loads styles and `src/main.js` |
| `src/main.js` | App entry: app state, navigation between screens, event handling |
| `src/data/chapters.js` | Course, chapters, questions, explanations, slide references, follow-up questions |
| `src/logic/session.js` | Pure quiz logic: answers, progress, scoring, recommendation, follow-ups (no DOM) |
| `src/views/library.js` | Course library screen |
| `src/views/quiz.js` | Lesson screen and its in-place feedback updates |
| `src/views/results.js` | Chapter results and follow-up results |
| `src/ui/components.js` | Shared markup: button, icons, score heading, tally, answer review |
| `src/ui/art.js` | Original chapter tile illustrations (inline SVG) |
| `src/ui/dom.js` | Mount, cross-fade, collapse, screen-reader announcements |
| `styles/tokens.css` | Color, type scale, layout and motion tokens |
| `styles/base.css` | Reset, header, buttons, shared motion and reduced-motion rules |
| `styles/library.css`, `quiz.css`, `results.css` | Per-screen styles |
| `tests/session.test.js` | Node tests for the logic module |
| `scripts/serve.mjs` | Local static dev server |
| `prototype/smartprep-v1.html` | Previous version, for comparison |
| `docs/screenshots/` | Review screenshots (desktop, phone, grayscale v1 vs v2) |
