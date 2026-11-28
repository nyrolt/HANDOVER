import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import mammoth from "mammoth";
import { FileStorageService, StoredFileInfo } from "./fileStorageService";

export interface ConversionResult {
  success: boolean;
  convertedInfo?: StoredFileInfo;
  extractedText?: string;
  error?: string;
}

export class FileConverterService {
  /**
   * Converts plain text string or buffer to a formatted PDF.
   */
  public static async textToPdf(text: string, title = "Converted Document"): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 10;
    const lineHeight = 14;
    const margin = 40;
    const pageWidth = 595.28; // A4 width in pt
    const pageHeight = 841.89; // A4 height in pt
    const maxLineWidth = pageWidth - 2 * margin;

    const rawLines = text.replace(/\r\n/g, "\n").split("\n");
    const wrappedLines: string[] = [];

    for (const rawLine of rawLines) {
      if (rawLine.trim().length === 0) {
        wrappedLines.push("");
        continue;
      }
      const words = rawLine.split(/\s+/);
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width < maxLineWidth) {
          currentLine = testLine;
        } else {
          wrappedLines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) {
        wrappedLines.push(currentLine);
      }
    }

    const linesPerPage = Math.floor((pageHeight - 2 * margin - 40) / lineHeight);
    const totalPages = Math.max(1, Math.ceil(wrappedLines.length / linesPerPage));

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Header
      page.drawText(title, {
        x: margin,
        y: pageHeight - margin + 10,
        size: 9,
        font: fontBold,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Horizontal separator line
      page.drawLine({
        start: { x: margin, y: pageHeight - margin + 2 },
        end: { x: pageWidth - margin, y: pageHeight - margin + 2 },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });

      // Page body
      const startLine = pageIdx * linesPerPage;
      const endLine = Math.min(wrappedLines.length, startLine + linesPerPage);
      let yPos = pageHeight - margin - 20;

      for (let i = startLine; i < endLine; i++) {
        const line = wrappedLines[i] ?? "";
        if (line) {
          page.drawText(line, {
            x: margin,
            y: yPos,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
        yPos -= lineHeight;
      }

      // Footer
      const footerText = `Page ${pageIdx + 1} of ${totalPages} - Converted by Handover Platform`;
      page.drawText(footerText, {
        x: margin,
        y: margin - 15,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Converts DOCX buffer to PDF and extracts plain text.
   */
  public static async docxToPdf(
    docxBuffer: Buffer,
    originalFilename: string,
  ): Promise<{ pdfBuffer: Buffer; text: string }> {
    const { value: extractedText } = await mammoth.extractRawText({ buffer: docxBuffer });
    const title = originalFilename.replace(/\.docx?$/i, "");
    const pdfBuffer = await this.textToPdf(extractedText || "No readable text extracted.", title);
    return { pdfBuffer, text: extractedText };
  }

  /**
   * Converts Image (PNG or JPEG) to a high-quality PDF page.
   */
  public static async imageToPdf(
    imageBuffer: Buffer,
    mimeType: string,
    filename: string,
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    let embeddedImage;

    if (mimeType.includes("png") || filename.toLowerCase().endsWith(".png")) {
      embeddedImage = await pdfDoc.embedPng(imageBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(imageBuffer);
    }

    const { width, height } = embeddedImage;
    // Standard A4 aspect fit
    const maxW = 595.28 - 60;
    const maxH = 841.89 - 60;
    const scale = Math.min(maxW / width, maxH / height, 1);

    const drawW = width * scale;
    const drawH = height * scale;

    const page = pdfDoc.addPage([595.28, 841.89]);
    const x = (595.28 - drawW) / 2;
    const y = (841.89 - drawH) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawW,
      height: drawH,
    });

    // Add document header
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText(`Attached Submission: ${filename}`, {
      x: 30,
      y: 841.89 - 25,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Main conversion orchestrator: detects input format, converts to target format (defaults to PDF),
   * and saves the converted output file.
   */
  public static async convertFile(
    inputBuffer: Buffer,
    originalFilename: string,
    targetFormat: "pdf" | "png" | "jpg" = "pdf",
  ): Promise<ConversionResult> {
    try {
      const ext = originalFilename.split(".").pop()?.toLowerCase() || "";
      let convertedBuffer: Buffer | null = null;
      let extractedText = "";

      if (targetFormat === "pdf") {
        if (ext === "docx" || ext === "doc") {
          const res = await this.docxToPdf(inputBuffer, originalFilename);
          convertedBuffer = res.pdfBuffer;
          extractedText = res.text;
        } else if (ext === "txt") {
          extractedText = inputBuffer.toString("utf-8");
          convertedBuffer = await this.textToPdf(extractedText, originalFilename);
        } else if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
          const mime = ext === "png" ? "image/png" : "image/jpeg";
          convertedBuffer = await this.imageToPdf(inputBuffer, mime, originalFilename);
        } else if (ext === "pdf") {
          // Already PDF
          return { success: true };
        } else {
          return {
            success: false,
            error: `Conversion from .${ext} to .pdf is not supported. Supported: DOCX, TXT, PNG, JPG.`,
          };
        }
      } else {
        return {
          success: false,
          error: `Target format .${targetFormat} is currently not supported.`,
        };
      }

      if (!convertedBuffer) {
        return { success: false, error: "Conversion produced no output." };
      }

      const baseName = originalFilename.replace(/\.[^/.]+$/, "");
      const newFilename = `${baseName}_converted.${targetFormat}`;
      const saved = await FileStorageService.saveBuffer(convertedBuffer, newFilename, "converted");

      return {
        success: true,
        convertedInfo: saved,
        extractedText,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }
}
