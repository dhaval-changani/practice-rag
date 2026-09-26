# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Learning Mode (highest priority — overrides everything else)

This repo is a learning project. I write all the code myself.

- Never write or modify code in this repo. No edits to `src/**`, no new source files, no "here, I fixed it" patches — even when asked directly, even for a one-line change.
- Never output code. No snippets, no diffs, no pseudo-code that is really code, no type signatures or function bodies dressed up as examples. Plain prose only.
- When I ask for help, explain in plain text: what is wrong, why it happens, which concept it touches, and what direction to take. Name the file and line, the API, or the doc to read — then stop and let me implement it.
- Reviews and debugging: describe the defect and the reasoning. Do not supply the fix.
- Suggest solutions as *ideas*, not implementations. If several approaches exist, describe the tradeoffs and let me choose.
- Exception: files I explicitly ask you to edit that are not source code (e.g. this `CLAUDE.md`, `LEARNING.md`, `README.md`, config, notes). When in doubt, ask before writing anything.

## Commands

- `npm start` — run `src/index.ts` via `tsx` (no build step). `npm run dev` — same, in watch mode.
- `npm run typecheck` — `tsc --noEmit`. `npm run build` — emit to `dist/`.
- `npx eslint .` — lint (no npm script). Flat config in `eslint.config.mts` (js recommended + typescript-eslint recommended), loaded via `jiti`.
- `npx prettier --write .` — format (no npm script).
- No test runner — the `test` script is still the npm placeholder.

## Architecture

A RAG (retrieval-augmented generation) learning POC. Target shape is the standard pipeline — ingestion → chunking → embedding → vector store → retrieval → generation — built one stage at a time per the build plan in `LEARNING.md`.

- `/corpus` — ~27 internal engineering docs exported as `.doc`. **Gitignored** (`*corpus` in `.gitignore`): local-only, never commit it or copy its contents into tracked files.
- `QUESTIONS.md` — fixed eval set of 15 questions, written before building anything; every stage is judged against it.
- Current work is Stage 1 (chunking comparison): `src/index.ts` is the entry point; `src/chunking-pipeline/` holds the corpus reader (`Pipeline`) and the fixed-size and semantic chunkers. Conceptual roadmap: `docs/plans/stage-1-chunking-comparison.md`.

## Known rough edges

Real gotchas and bugs go here as they're found, same as the sibling project's convention: observations only, mine to fix under Learning Mode.

- **Corpus `.doc` files are not Word documents.** They're Confluence "Export to Word" output: a MIME `multipart/related` message (MHTML) wrapping a single quoted-printable HTML part. Word-binary parsers like `word-extractor` sniff magic bytes and reject them ("Unable to read this type of file"). The HTML inside keeps real heading/paragraph/table structure, which matters for the Stage 1 semantic chunker.

## LEARNING.md

`LEARNING.md` is the running conceptual reference for this POC — where RAG concepts get written down as they're actually built and verified, not ahead of the work. Check it for current progress.

## Conventions

- TypeScript with ESM (`"type": "module"`, `module: nodenext`), `verbatimModuleSyntax` + `isolatedModules`. Relative imports need explicit `.js` extensions — a bare directory import like `./chunking-pipeline` won't resolve.
- `strict`, plus `noUncheckedIndexedAccess` (array/record indexing yields `T | undefined`) and `exactOptionalPropertyTypes`.
- Prettier: 4-space indent, single quotes, semicolons, `printWidth` 120, `trailingComma` es5.

## Environment

No `.env` exists yet. Once one is needed (e.g. an embedding-provider API key), expect it loaded via Node's native `process.loadEnvFile()` (no `dotenv` package), with `.env` covered by `.gitignore`.

## Plan files

Save any plan files to `docs/plans/` in this repo, not to an external plans directory. This keeps planning history alongside the project it describes.
