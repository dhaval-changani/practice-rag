import { Pipeline } from './chunking-pipeline/index.js';

const CORPUS_PATH = './corpus';

const pipeline = new Pipeline(CORPUS_PATH);

pipeline.runPipeline()
