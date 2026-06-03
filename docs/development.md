# Development

## Run Locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Verify

```powershell
npm run validate:all
```

## Content Rules

- Do not commit PDF files.
- Course content lives under `content/courses/math-analysis/`.
- Sequence-limit content is the first sample chapter.
- Diagrams are programmatic specs, not AI-generated images.
- User API keys stay in browser local storage for the MVP.
- Handwritten answer images are sent only when the learner submits an answer for grading.

## Collaboration

Partner AI owns odd task packages.
Main AI owns app implementation and even task packages.
