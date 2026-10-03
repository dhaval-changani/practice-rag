import type { Chunk } from './chunk.js';

const STANDARD_STEP = 100;
const CHUNK_OVERLAP = 50;
const CHUNK_SIZE = STANDARD_STEP + CHUNK_OVERLAP;

export function generateFixedChunks(text: string, fileName: string): Chunk[] {
    const words = text.split(' ');
    const chunks: Chunk[] = [];

    let counter = 0;
    while (words.length >= counter) {
        const chunk = words.slice(counter, counter + CHUNK_SIZE);
        if (chunk.length > CHUNK_OVERLAP) {
            chunks.push({
                text: chunk.join(' '),
                meta: {
                    index: counter,
                    fileName,
                },
            });
        }
        counter += STANDARD_STEP;
    }

    return chunks;
}
