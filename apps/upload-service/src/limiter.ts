import pLimit from 'p-limit';

const MERGE_CONCURRENCY = Number(process.env.MERGE_CONCURRENCY || 2);

export const mergeLimiter = pLimit(MERGE_CONCURRENCY);
