# Retrieval-Augmented Generation — From First Principles

Learning reference for this POC. Filled in as each piece is actually built and verified — not written ahead of the work.

## First principles of a production RAG system (2026-09-20)

Discussed conceptually, before any code exists. Standard pipeline shape: ingestion → chunking → embedding → vector store → retrieval → generation.

- **Retrieval quality is the ceiling.** Generation can't recover from bad retrieval — wrong chunks in means wrong answer out, regardless of prompt quality. Most production effort goes into retrieval, not the LLM call.
- **Chunking determines what's retrievable.** Chunk size/strategy controls whether a piece of information exists as a discrete, findable unit. Too large dilutes relevance (embedding averages out); too small loses context. Semantic chunking (by section/heading) tends to beat fixed-size in production, and metadata (source, position, hierarchy) should travel with each chunk for traceability.
- **Embeddings are lossy.** Vector similarity finds *semantically close*, not necessarily *factually relevant*. This gap motivates re-ranking, hybrid search (keyword + vector), and query rewriting layered on top of raw cosine similarity.
- **Retrieval and generation are separate failure modes.** A wrong answer could be a retrieval miss (right info never fetched) or a generation miss (right info fetched but ignored/misread). Need eval sets/metrics that distinguish the two, or you can't tell what to fix.
- **Freshness/consistency of the index is a systems problem.** Real corpora change; without an ingestion/update pipeline to keep the vector store in sync, the system silently serves stale or orphaned data.
- **Context window is a budget, not a bucket.** More retrieved context isn't free — it costs tokens/latency and can distract the model ("lost in the middle"). How much to include, and in what order, is an active decision (re-ranking, truncation).
- **Grounding must be verifiable.** Citations/source attribution back to specific chunks matter for both user trust and debugging (was it a retrieval failure or a hallucination?).
- **Failure should degrade gracefully.** When retrieval returns nothing relevant, the system should say so rather than let the LLM hallucinate from parametric knowledge.

## Build plan — teaching each principle by observation (2026-09-20)

Each stage exists to make a principle observable, not just implemented. End every stage with an "observed behavior" note below it, written after seeing actual output — not predicted beforehand.

### Stage 0 — Corpus & harness
Small real corpus (10-30 docs), ideally with some internal contradiction/ambiguity (needed later for principles 3 and 8). Fixed eval set of 10-15 questions with known answers, written *before* building anything — some answerable from the corpus, some not.

### Stage 1 — Chunking (principle: chunking determines what's retrievable)
Compare fixed-size chunking (already have this, `132c5ff`) against a semantic/structural chunker (by heading/paragraph). Run the same eval question through both, inspect top-k manually: does fixed-size ever split a fact from its qualifier? Is semantic chunking uneven in size?

### Stage 2 — Embedding + vector store (principle: embeddings are lossy)
Pure cosine-similarity retrieval. Construct queries phrased close to a wrong chunk, and queries phrased far from the right chunk. Observe where pure vector similarity fails before adding any fix (hybrid search, reranking).

### Stage 3 — Retrieval vs. generation isolation (principles: retrieval is the ceiling; separate failure modes)
Inspect retrieved top-k independently of the final answer. Score the eval set twice: "was the right chunk retrieved" vs. "was the final answer correct." Look for cases where retrieval succeeded but generation still failed, and vice versa — log both scores separately.

### Stage 4 — Context budget (principle: context window is a budget)
Same query at k=1, k=5, k=20. Observe whether answer quality plateaus, degrades, or the model starts ignoring the correct chunk buried among irrelevant ones ("lost in the middle").

### Stage 5 — Grounding & citations (principles: grounding must be verifiable; graceful degradation)
Add source attribution to generated answers. Ask a question the corpus cannot answer and check whether the model hallucinates a citation anyway.

### Stage 6 — Freshness (principle: freshness/consistency is a systems problem) — optional, further out
Add/edit a document after the index is built. Compare behavior with vs. without re-indexing.
