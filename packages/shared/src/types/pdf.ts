import type { Page } from 'playwright';

export interface PdfRequestBody {
  url: string;
  pdfOptions?: Parameters<Page['pdf']>[0];
  timeout?: number;
}
