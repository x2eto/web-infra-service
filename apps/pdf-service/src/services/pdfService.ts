import type { Browser, BrowserContext, Page } from 'playwright';
import { errors as PlaywrightErrors } from 'playwright';
import { AppError, type PdfRequestBody } from '@web-infra/shared';
import { pdfLimiter } from '../limiter';
/**
 * Service class for generating PDFs.
 */
export class PdfService {
  private readonly browser: Browser;

  constructor(browser: Browser) {
    this.browser = browser;
  }

  /**
   * Generates a PDF from the provided URL.
   * @param input - The input parameters for generating the PDF.
   * @returns A Promise that resolves to a Buffer containing the generated PDF.
   * @throws {GeneratePdfError} If an error occurs during PDF generation.
   * @throws {TimeoutPdfError} If the target page takes too long to respond or load.
   */
  async generatePdf(input: PdfRequestBody): Promise<Buffer> {
    const { url, pdfOptions = {}, timeout = 30000 } = input;

    let context: BrowserContext | undefined;
    let page: Page | undefined;

    try {
      return await pdfLimiter(async () => {
        context = await this.browser.newContext();
        page = await context.newPage();

        await page.goto(url, { waitUntil: 'networkidle', timeout });

        const pdfBuffer = await page.pdf(pdfOptions);
        return pdfBuffer;
      });
    } catch (error) {
      if (error instanceof PlaywrightErrors.TimeoutError) {
        throw new AppError(
          'Gateway Timeout: The target page took too long to respond or load.',
          'TIMEOUT',
          504,
          (error as Error).message,
        );
      }
      throw new AppError(
        'An error occurred while generating the PDF.',
        'INTERNAL_ERROR',
        500,
        (error as Error).message,
      );
    } finally {
      if (page) await page.close();
      if (context) await context.close();
    }
  }
}

/**
 * Custom error class for PDF generation errors.
 */
export class GeneratePdfError extends Error {
  original?: Error;
  constructor(message: string, original?: Error) {
    super(message);
    this.name = 'GeneratePdfError';
    this.original = original;
  }
}
/**
 * Custom error class for PDF generation timeout errors.
 */
export class TimeoutPdfError extends GeneratePdfError {
  constructor(message: string, original?: Error) {
    super(message, original);
    this.name = 'TimeoutPdfError';
  }
}
