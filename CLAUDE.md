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

No `package.json` exists yet — this repo is not scaffolded. Once it is, expect this section to fill in with the same shape as the sibling `AI Agent POC` project: a `dev`/`start` script run via `tsx`, and `typecheck` via `tsc --noEmit`.

## Architecture

Not yet built. This is a RAG (retrieval-augmented generation) learning POC — the expected shape is the standard RAG pipeline: ingestion → chunking → embedding → vector store → retrieval → generation. No files or modules exist yet to describe; this section gets filled in as real pieces land.

## Known rough edges

None yet — nothing has been built. Real gotchas and bugs go here as they're found, same as the sibling project's convention: observations only, mine to fix under Learning Mode.

## LEARNING.md

`LEARNING.md` is the running conceptual reference for this POC — where RAG concepts get written down as they're actually built and verified, not ahead of the work. Check it for current progress.

## Conventions

Expected to mirror the sibling `AI Agent POC` project once scaffolded: TypeScript with ESM (`"type": "module"`), `verbatimModuleSyntax` + `isolatedModules` (relative imports need explicit `.js` extensions), strict mode, and `tsx` for running without a build step.

## Environment

No `.env` exists yet. Once one is needed (e.g. an embedding-provider API key), expect it loaded via Node's native `process.loadEnvFile()` (no `dotenv` package), with `.env` covered by `.gitignore`.

## Plan files

Save any plan files to `docs/plans/` in this repo, not to an external plans directory. This keeps planning history alongside the project it describes.
