import { Parser } from 'fast-mhtml';
import type { Dirent } from 'node:fs';
import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';
import { generateFixedChunks } from './fixed-chunking.js';

type ChunkinStretegy = 'Fixed' | 'Semantic';

export class Pipeline {
    constructor(
        private path: string,
        private strategy: ChunkinStretegy = 'Fixed'
    ) {}

    async getFiles(): Promise<Dirent<string>[]> {
        return await fs.readdir(this.path, { withFileTypes: true });
    }

    private async getFileBody(file: Dirent<string>): Promise<string | undefined> {
        const filePath = `${file.parentPath}/${file.name}`;
        const mhtml = await fs.readFile(filePath, 'utf-8');
        const p = new Parser({});

        // get file contents
        const result = p.parse(mhtml).rewrite().spit();
        const content = result[0]?.content;
        if (content) {
            // cleanup text
            const $ = cheerio.load(content);
            return $.text().replace(/\s+/g, ' ').trim();
        }
    }

    async runPipeline() {
        const files = await this.getFiles();
        const fileBody = await this.getFileBody(files[0]!);
        if (this.strategy === 'Fixed') {
            console.log(generateFixedChunks(fileBody!));
        }

        //
        //         for (const file of files) {
        //             const fileBody = await this.getFileBody(file);
        //             if (this.strategy === 'Fixed') {
        //                 console.log(generateFixedChunks(fileBody));
        //             }
        //         }
    }
}
