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
   * Sanitizes unicode characters for WinAnsi standard font encoding in pdf-lib.
   * Maps smart quotes, em-dashes, and special symbols to safe ASCII equivalents.
   */
  public static sanitizeUnicodeForPdf(text: string): string {
    return (
      text
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/\u2026/g, "...")
        .replace(/[\u2022\u25CF\u25AA]/g, "* ")
        // eslint-disable-next-line no-control-regex
        .replace(/[^\x00-\x7F]/g, (char) => {
          const code = char.charCodeAt(0);
          // Common latin-1 supplements
          if (code >= 160 && code <= 255) return char;
          return "?";
        })
    );
  }

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

    const sanitized = this.sanitizeUnicodeForPdf(text);
    const rawLines = sanitized.replace(/\r\n/g, "\n").split("\n");
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
    const safeTitle = this.sanitizeUnicodeForPdf(title);

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Header
      page.drawText(safeTitle, {
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
   * Converts DOCX buffer to structured PDF preserving headings, paragraphs, tables, lists, and images.
   */
  public static async docxToPdf(
    docxBuffer: Buffer,
    originalFilename: string,
  ): Promise<{ pdfBuffer: Buffer; text: string }> {
    // 1. Extract raw text for indexing
    const { value: rawText } = await mammoth.extractRawText({ buffer: docxBuffer });

    // 2. Extract HTML with style mapping to preserve structural hierarchy
    const { value: html } = await mammoth.convertToHtml({ buffer: docxBuffer });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const margin = 40;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const maxLineWidth = pageWidth - 2 * margin;
    const title = originalFilename.replace(/\.docx?$/i, "");
    const safeTitle = this.sanitizeUnicodeForPdf(title);

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let pageNumber = 1;
    let yPos = pageHeight - margin - 25;

    const drawHeader = (page: typeof currentPage) => {
      page.drawText(safeTitle, {
        x: margin,
        y: pageHeight - margin + 10,
        size: 9,
        font: fontBold,
        color: rgb(0.3, 0.3, 0.3),
      });
      page.drawLine({
        start: { x: margin, y: pageHeight - margin + 2 },
        end: { x: pageWidth - margin, y: pageHeight - margin + 2 },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });
    };

    const drawFooter = (page: typeof currentPage, pNum: number) => {
      page.drawText(`Page ${pNum} - Converted by Handover Academic Engine`, {
        x: margin,
        y: margin - 15,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    };

    drawHeader(currentPage);

    const ensureSpace = (neededHeight: number) => {
      if (yPos - neededHeight < margin + 15) {
        drawFooter(currentPage, pageNumber);
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        pageNumber++;
        yPos = pageHeight - margin - 25;
        drawHeader(currentPage);
      }
    };

    // Parse HTML blocks into formatted elements
    const blockRegex = /<(h[1-3]|p|li|tr)[^>]*>([\s\S]*?)<\/\1>/gi;
    let match;
    let parsedAnyBlocks = false;

    while ((match = blockRegex.exec(html)) !== null) {
      parsedAnyBlocks = true;
      const tag = match[1]?.toLowerCase() || "p";
      const rawBlock = match[2] || "";

      // Check for inline images
      const imgMatch = /<img[^>]+src=["']data:image\/(png|jpe?g);base64,([^"']+)["']/i.exec(
        rawBlock,
      );
      if (imgMatch && imgMatch[2]) {
        try {
          const imgBuffer = Buffer.from(imgMatch[2], "base64");
          let embeddedImg;
          if (imgMatch[1]?.includes("png")) {
            embeddedImg = await pdfDoc.embedPng(imgBuffer);
          } else {
            embeddedImg = await pdfDoc.embedJpg(imgBuffer);
          }

          const scale = Math.min(maxLineWidth / embeddedImg.width, 240 / embeddedImg.height, 1);
          const drawW = embeddedImg.width * scale;
          const drawH = embeddedImg.height * scale;

          ensureSpace(drawH + 15);
          currentPage.drawImage(embeddedImg, {
            x: margin,
            y: yPos - drawH,
            width: drawW,
            height: drawH,
          });
          yPos -= drawH + 15;
        } catch {
          // Fallback image rendering
        }
      }

      // Clean text tags
      const cleanText = this.sanitizeUnicodeForPdf(
        rawBlock
          .replace(/<td[^>]*>/gi, " | ")
          .replace(/<[^>]+>/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim(),
      );

      if (!cleanText) continue;

      let currentFont = font;
      let currentSize = 10;
      let currentLineHeight = 14;

      if (tag === "h1") {
        currentFont = fontBold;
        currentSize = 14;
        currentLineHeight = 20;
        ensureSpace(24);
        yPos -= 8;
      } else if (tag === "h2") {
        currentFont = fontBold;
        currentSize = 12;
        currentLineHeight = 17;
        ensureSpace(20);
        yPos -= 6;
      } else if (tag === "h3") {
        currentFont = fontBold;
        currentSize = 10.5;
        currentLineHeight = 15;
        ensureSpace(18);
        yPos -= 4;
      } else if (tag === "li") {
        currentSize = 9.5;
        currentLineHeight = 13.5;
      }

      // Word wrap block
      const words = cleanText.split(/\s+/);
      let currentLine = tag === "li" ? "* " : "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = currentFont.widthOfTextAtSize(testLine, currentSize);
        if (width < maxLineWidth) {
          currentLine = testLine;
        } else {
          ensureSpace(currentLineHeight);
          currentPage.drawText(currentLine, {
            x: margin,
            y: yPos,
            size: currentSize,
            font: currentFont,
            color: tag.startsWith("h") ? rgb(0.1, 0.1, 0.2) : rgb(0.15, 0.15, 0.15),
          });
          yPos -= currentLineHeight;
          currentLine = word;
        }
      }

      if (currentLine) {
        ensureSpace(currentLineHeight);
        currentPage.drawText(currentLine, {
          x: margin,
          y: yPos,
          size: currentSize,
          font: currentFont,
          color: tag.startsWith("h") ? rgb(0.1, 0.1, 0.2) : rgb(0.15, 0.15, 0.15),
        });
        yPos -= currentLineHeight + (tag.startsWith("h") ? 6 : 4);
      }
    }

    drawFooter(currentPage, pageNumber);

    if (!parsedAnyBlocks) {
      // Fallback to textToPdf
      const fallback = await this.textToPdf(
        rawText || "Document parsed without body elements.",
        title,
      );
      return { pdfBuffer: fallback, text: rawText };
    }

    const pdfBytes = await pdfDoc.save();
    return { pdfBuffer: Buffer.from(pdfBytes), text: rawText };
  }

  /**
   * Converts Image (PNG or JPEG) to a high-quality PDF page.
   */
  public static async imageToPdf(
    imageBuffer: Buffer,
    mimeType: string,
    filename: string,
  ): Promise<Buffer> {
    return this.imagesToPdf([{ buffer: imageBuffer, mimeType, filename }]);
  }

  /**
   * Multi-image PDF compiler: converts multiple images into a single standardized PDF document.
   */
  public static async imagesToPdf(
    images: Array<{ buffer: Buffer; mimeType: string; filename?: string }>,
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < images.length; i++) {
      const item = images[i];
      if (!item) continue;

      let embeddedImage;
      const isPng =
        item.mimeType.includes("png") ||
        (item.filename && item.filename.toLowerCase().endsWith(".png"));

      try {
        if (isPng) {
          embeddedImage = await pdfDoc.embedPng(item.buffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(item.buffer);
        }
      } catch {
        // Try opposite decoder if header mismatched
        try {
          embeddedImage = isPng
            ? await pdfDoc.embedJpg(item.buffer)
            : await pdfDoc.embedPng(item.buffer);
        } catch {
          continue;
        }
      }

      const { width, height } = embeddedImage;
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

      const label = item.filename ? `Image ${i + 1}: ${item.filename}` : `Image Page ${i + 1}`;
      page.drawText(label, {
        x: 30,
        y: 841.89 - 25,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawText(`Page ${i + 1} of ${images.length} - Handover Document Compiler`, {
        x: 30,
        y: 20,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

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
      if (inputBuffer.length === 0) {
        return { success: false, error: "Input file buffer is empty." };
      }
      if (inputBuffer.length > 25 * 1024 * 1024) {
        return { success: false, error: "Input file exceeds 25 MB size limit." };
      }

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
            error: `Conversion from .${ext} to .pdf is not supported. Supported formats: DOCX, TXT, PNG, JPG, JPEG.`,
          };
        }
      } else {
        return {
          success: false,
          error: `Target format .${targetFormat} is currently not supported.`,
        };
      }

      if (!convertedBuffer || convertedBuffer.length === 0) {
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
      return { success: false, error: `Conversion failure: ${msg}` };
    }
  }
}
