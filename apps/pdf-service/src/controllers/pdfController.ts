import type { Request, Response } from 'express';
import type { PdfRequestBody } from '@web-infra/shared';
import { PdfService } from '../services/pdfService';

export class PdfController {
  private readonly service: PdfService;

  constructor(service: PdfService) {
    this.service = service;
  }

  /**
   * Generates a PDF from the provided URL.
   * @param req - The request object containing the URL to generate the PDF from.
   * @param res - The response object to send the generated PDF.
   */
  generate = async (req: Request<Record<string, any>, any, PdfRequestBody>, res: Response) => {
    const buffer = await this.service.generatePdf(req.body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="output-${Date.now()}.pdf"`);
    res.send(buffer);
  };
}
