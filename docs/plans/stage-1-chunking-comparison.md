# Stage 1 — Chunking Comparison (conceptual roadmap, not an implementation plan)

## Context

This repo is under **Learning Mode**: I never write, edit, or generate code here — that's the whole point of the POC. This document is a conceptual roadmap for *you* to implement, not a spec for me to execute.

You've completed the corpus + eval harness (`LEARNING.md` calls this Stage 0):
- `/corpus` — 27 real internal NOQ/EPOS engineering docs (architecture, domain model, controllers, validation, order lifecycle, terminals/offline sync, environments, logging, etc.)
- `QUESTIONS.md` — 15 eval questions, phrased to map onto specific corpus docs (refund policy, DB count, scheduled tasks, order status sequence, logging, domain model specs, controller creation, validation standards, terminal offline updates, environments, production URL, offline payments)

Next up per `LEARNING.md` is **Stage 1 — Chunking** (principle: *chunking determines what's retrievable*). One thing to know going in: the earlier fixed-size chunker (`Chunking-strategy/fixed-size-chunking.ts`, commit `132c5ff`) was deleted in commit `d73ec8b` — it no longer exists in the tree, so that piece needs to be rebuilt, not just reused.

## What Stage 1 is actually testing

Per `LEARNING.md`, this stage is chunking-only — no embeddings or vector store yet (that's Stage 2). So "inspect top-k manually" doesn't mean a real similarity search; it means *you* read the chunk sets and judge, by eye, which chunks would plausibly be retrieved for a given question. Decide up front how you want to simulate "top-k" without a retriever — e.g., keyword/substring match against the question's key terms, or just manually shortlisting the chunks that contain the relevant heading/section. Either is fine; the point is comparing chunk *boundaries*, not building a search algorithm.

## Two chunkers to build and compare

**1. Fixed-size chunker (rebuild)**
- Splits text by a fixed character/token count with some overlap, ignoring document structure.
- Decisions you'll need to make: chunk size, overlap size, and whether to split on raw characters or tokens.

**2. Semantic/structural chunker (new)**
- Splits by document structure — headings, sections, paragraphs — so each chunk aligns with a logical unit of the source doc.
- Decisions: what counts as a split point (heading level? paragraph boundary?), and what to do with sections that are much longer or shorter than others (the corpus docs vary a lot in length, e.g. `UMS+(User+Management+System).doc` and `Environments.doc` are notably large).
- Note: the corpus files are `.doc` — you'll need to figure out how to read structure out of that format (heading styles, etc.) before you can chunk on structure at all. That's a prerequisite worth solving first.

## Comparison method

1. Run both chunkers over the same corpus.
2. Pick a handful of `QUESTIONS.md` questions where the answer clearly lives in one doc (e.g. Q1 refund policy, Q3 scheduled tasks, Q11/Q12 terminal updates offline).
3. For each, find which chunk(s) from each chunker's output would contain the answer.
4. Look specifically for:
   - Does fixed-size chunking ever split a fact from its qualifier (e.g. a rule from its exception, a step from its precondition)?
   - Is semantic chunking's output very uneven in size (a one-line heading section vs. a multi-page one)?

## Output

Write an "observed behavior" note under the Stage 1 heading in `LEARNING.md`, based on what you actually see — not predicted ahead of time. That's the deliverable for this stage, per the project's own build-plan convention.

## Verification

- Both chunkers run over the full `/corpus` without errors.
- For at least 3–5 of the eval questions, you can point to the specific chunk(s) each strategy produced and say whether the relevant fact was intact, split, or missing.
- `LEARNING.md` Stage 1 has a written observed-behavior note reflecting this.
