import type { Chunk } from './chunk.js';

const CHUNK_SIZE = 200;
const CHUNK_OVERLAP = 50;

export function generateFixedChunks(text: string): Chunk[] {
    const chunkSteps = text.length / CHUNK_SIZE;
    const chunks: Chunk[] = [];

    for (let i = 0; i < chunkSteps; i++) {
        const index = i * CHUNK_SIZE;
        const chunk = text.slice(index, (i + 1) * CHUNK_SIZE + CHUNK_OVERLAP);
        chunks.push({
            text: chunk,
            meta: {
                index,
                offset: CHUNK_SIZE + CHUNK_OVERLAP,
            },
        });
    }

    return chunks;
}
