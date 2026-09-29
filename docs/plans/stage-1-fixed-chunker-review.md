# Improving the fixed-size chunker (Learning Mode: you implement, prose only)

## Context
You asked how to make chunking better, based on `src/chunking-pipeline/fixed-chunking.ts` and `LEARNING.md`. Stage 1 compares a *naive* fixed-size baseline with a semantic chunker, so the goal is a baseline that is correct and honest. It should not be a clever one. This file keeps each review round with its findings, and records which ones have been resolved.

## Review 2 (2026-09-29): after switching to characters and adding cheerio

State: text extraction now happens in the pipeline (cheerio, in `index.ts` `getFileBody`). The chunker counts in characters (`CHUNK_SIZE` 200, `CHUNK_OVERLAP` 50) and returns chunk objects with `meta`. Typecheck passes. I ran it over all 28 corpus files: 1,171 chunks, and no empty ones.

### Still broken
1. **CSS in the text, all 28 files.** Cheerio's whole-document text extraction also collects the text inside `<style>` elements. The `<!-- … -->` inside `<style>` counts as text, not a comment. So the first chunk begins with the title and then `@page Section1 { size: 8.5in … }`, and chunk 1 is almost all CSS. Direction: remove `<head>`, `<style>` (and `<script>`) before extracting, or extract only from `<body>`. Afterwards, look at a few documents for Confluence print boilerplate.
2. **The last chunk is still sometimes a duplicate (4 of 28 files).** Each chunk starts at a multiple of 200 and runs 250 characters. When fewer than 50 characters are left at the end, they are already in the previous chunk's overlap, and the loop still makes a chunk from them. Stop once a chunk reaches the end of the text.
3. **The metadata fields are named wrong.** `meta.index` holds the starting character position. `meta.offset` holds the same fixed chunk length (250) on every chunk. Name the fields for what they hold, and add the **source file name**. Stages 3 and 5 need the source file to trace a chunk back to its document once all files are chunked together.

### Decisions to make
4. **Characters versus words changed how big chunks are.** 200 characters is about 30–35 words, often less than a sentence. Character splitting also cuts through words: 721 of 1,171 chunks end mid-word. Mid-word cuts are inherent to naive chunking and are worth observing in Stage 1. But at this size nearly every fact gets split, which weakens the comparison with the semantic chunker. The options are to go back to words or tokens, or to keep characters at roughly 1,000–2,000 per chunk.
5. **The size and overlap names are still ambiguous.** `CHUNK_SIZE` is the step between chunk starts, and each chunk is 250 characters long. Fine if intended, but write down which one "size" means, so the LEARNING.md notes are accurate.

### Minor
- **`chunk.d.ts`:** a hand-written declaration file for your own type is unusual. It works only because the import is type-only and removed at runtime. A normal `chunk.ts` exporting the type is standard, and it gets checked like the rest of your code.
- **Missing file content:** `getFileBody` can return `undefined`. `runPipeline` hides that with the `!` non-null assertion, so a file with no content would crash inside the chunker (reading `text.length` on `undefined`). This will matter once the loop over all files is uncommented.

## Review 1: first version (word-based, raw HTML)

Measured on the first corpus file (Log Retention proposal, 21,702 characters / 1,455 words): 145 chunks, 135 of them empty. The first chunk was Word XML and CSS.

### Tier 1: correctness bugs
1. ~~Chunking raw HTML.~~ **Partly fixed in Review 2.** Tags and entities are gone, but `<style>` content still gets through (see Review 2, item 1).
2. ~~The loop count used the wrong unit (characters divided by a size in words), which caused the 135 empty chunks.~~ **Fixed.** The count and the slicing now both use characters.
3. Last chunk can be a duplicate, falling entirely inside the previous chunk's overlap. **Still open** (Review 2, item 2).
4. ~~`!splits.length` could never be true.~~ **Gone.** The code was rewritten.
5. Naming: the chunk length is `CHUNK_SIZE + CHUNK_OVERLAP`, and the step is `CHUNK_SIZE`. **Still open** (Review 2, item 5).
6. ~~Returned arrays of words.~~ **Fixed.** It now returns `Chunk` objects with text and metadata.

### Tier 2: improvements that keep it a fair baseline
- **Metadata on each chunk:** source file, chunk index, and word or character offsets. **Partly done:** the fields are mislabelled and the source file is missing (Review 2, item 3).
- **Count tokens, not words or characters.** Embedding limits are in tokens, and tables, URLs and code tokenize badly. Look at the tokenizer for whichever embedding model you pick in Stage 2.
- **Size statistics** (min, median, max per strategy). The Stage 1 question about uneven sizes needs numbers.

### Tier 3: structure-aware ideas (belong in the semantic chunker or a third strategy)
- Snap chunk boundaries to sentence ends (`Intl.Segmenter` with sentence granularity is built into Node).
- Recursive splitting: try paragraph breaks first, then sentences, then words.
- Contextual headers: put the document title and heading path in front of each chunk.
- Treat tables as units, and repeat the header row when a table is split.
- Strip Confluence boilerplate that repeats in every document.
- Later stages: parent-document ("small-to-big") retrieval.

Tradeoff: Tier 3 changes in the fixed chunker would blur the Stage 1 comparison. Keep them out of it, or add them as a separate third strategy.

## Verification (you run it)
- A run over all 28 files gives no empty chunks, and no HTML or CSS in any chunk (search the output for `@page`, `mso-` or `{`).
- The last chunk of each file is not contained in the chunk before it.
- Each chunk's metadata names its source file and a correct start position.
- The chunk count per file is about ceil((length − overlap) / step), in whatever unit you choose.
- Then do the Stage 1 comparison against `QUESTIONS.md` and write the observed-behavior note in `LEARNING.md`.
