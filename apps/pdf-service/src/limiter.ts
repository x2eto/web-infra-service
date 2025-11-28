import pLimit from 'p-limit';

const PDF_CONCURRENCY = Number(process.env.PDF_CONCURRENCY || 4);

export const pdfLimiter = pLimit(PDF_CONCURRENCY);
