import { Parser } from 'fast-mhtml';
import type { Dirent } from 'node:fs';
import fs from 'node:fs/promises';

export class Pipeline {
    constructor(private path: string) {}

    async getFiles(): Promise<Dirent<string>[]> {
        return await fs.readdir(this.path, { withFileTypes: true });
    }

    private async getFileBody(file: Dirent<string>) {
        const filePath = `${file.parentPath}/${file.name}`;
        const mhtml = await fs.readFile(filePath, 'utf-8');
        const p = new Parser({});
        const result = p
            .parse(mhtml) // parse file
            .rewrite() // rewrite all links
            .spit(); // return all contents
        console.log(result);
    }

    async runPipeline() {
        const files = await this.getFiles();

        for (const file of files) {
            await this.getFileBody(file);
        }
    }
}
