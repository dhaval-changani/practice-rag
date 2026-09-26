# RAG POC

A learning POC for retrieval-augmented generation — embeddings, vector stores, and retrieval — built from first principles, the same way as the sibling [`AI Agent POC`](../AI%20Agent%20POC) project.

## Why this exists

The `AI Agent POC` covered multi-agent orchestration (routing, handoffs, agents-as-tools) but deliberately left RAG untouched. This repo picks up that other core AI-engineering primitive: how you get relevant context into a model's window in the first place, rather than how multiple agents hand work to each other once it's there.

## Status

Built one stage at a time, following the plan in [`LEARNING.md`](./LEARNING.md): ingestion → chunking → embedding → vector store → retrieval → generation.

- **Stage 0 — Corpus & harness:** done. A local corpus of ~27 internal engineering docs, plus a fixed set of 15 eval questions in [`QUESTIONS.md`](./QUESTIONS.md). The questions were written before any code, and every stage is scored against them.
- **Stage 1 — Chunking comparison:** in progress. The project is scaffolded (TypeScript, ESLint, Prettier). A corpus reader, a fixed-size chunker and a semantic chunker are being written in `src/chunking-pipeline/`. The roadmap is in [`docs/plans/stage-1-chunking-comparison.md`](./docs/plans/stage-1-chunking-comparison.md).
- **Stages 2–6** (embeddings, retrieval vs. generation, context budget, grounding, freshness): not started.

## Layout

- `src/index.ts`: entry point.
- `src/chunking-pipeline/`: the corpus reader and the two chunkers for Stage 1.
- `corpus/`: the source documents. They're **gitignored** and stay local only, so a fresh clone won't include them. They're Confluence "Export to Word" `.doc` files. Despite the extension, each one is really a MIME/MHTML wrapper around HTML, not a Word binary.
- `QUESTIONS.md`: the eval set.
- `docs/plans/`: planning notes for each stage.

## Learning Mode

This repo follows the same Learning Mode as `AI Agent POC`: the code is written by hand, one verified step at a time. See [`CLAUDE.md`](./CLAUDE.md) for the full rules.

## Learning notes

The conceptual write-up — what's been built, what it taught, what surprised me — lives in [`LEARNING.md`](./LEARNING.md).

## Running this

Requires Node.js. Run `npm install` first, then:

- `npm start`: runs `src/index.ts` with `tsx`, with no build step.
- `npm run dev`: the same, in watch mode.
- `npm run typecheck`: type-checks with `tsc --noEmit`.
- `npm run build`: compiles to `dist/`.
- `npx eslint .` and `npx prettier --write .`: lint and format.

There's no test runner yet. The pipeline reads from `corpus/`, so you need a local copy of the docs for it to do anything useful.
