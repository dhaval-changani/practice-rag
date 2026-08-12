const testDoc = `
# Architecture Decision: Caching
We will use Redis for caching user sessions to improve latency.

## Configuration
\`\`\`json
{
  "cache_ttl": 3600,
  "strategy": "lru"
}
\`\`\`
`;

const fixSizeChunking = (doc: string, chunkSize: number): string[] => {
  let index = 0;
  const chunks = [];
  while (true) {
    const start = index * chunkSize;
    const chunk = doc.slice(start, start + chunkSize).replace(/\n/g, "");

    if (!chunk.length) {
      break;
    }

    chunks.push(chunk);
    index++;
  }
  return chunks;
};

console.log(fixSizeChunking(testDoc, 60));
