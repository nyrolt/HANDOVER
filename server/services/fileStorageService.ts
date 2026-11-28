import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_BASE_DIR = path.resolve(process.cwd(), "uploads", "submissions");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_BASE_DIR)) {
  fs.mkdirSync(UPLOAD_BASE_DIR, { recursive: true });
}

export interface StoredFileInfo {
  originalFilename: string;
  storedFilename: string;
  storagePath: string;
  fileMimeType: string;
  fileSize: number;
  checksumSha256: string;
}

export interface MagicByteValidation {
  valid: boolean;
  detectedMime: string;
  message?: string;
}

export class FileStorageService {
  public static getUploadDir(): string {
    return UPLOAD_BASE_DIR;
  }

  /**
   * Sanitizes filename to prevent directory traversal or invalid characters.
   */
  public static sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.+/g, ".");
  }

  /**
   * Computes SHA-256 checksum of a buffer.
   */
  public static computeChecksum(buffer: Buffer): string {
    return crypto.createHash("sha256").update(buffer).digest("hex");
  }

  /**
   * Inspects magic bytes of a buffer to verify true file format.
   */
  public static validateMagicBytes(buffer: Buffer, declaredMime?: string): MagicByteValidation {
    if (buffer.length < 4) {
      return { valid: false, detectedMime: "application/octet-stream", message: "File too small" };
    }

    // PDF magic bytes: %PDF- (25 50 44 46)
    if (buffer.subarray(0, 4).toString() === "%PDF") {
      return { valid: true, detectedMime: "application/pdf" };
    }

    // PNG magic bytes: \x89PNG\r\n\x1a\n (89 50 4E 47)
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return { valid: true, detectedMime: "image/png" };
    }

    // JPEG magic bytes: \xFF\xD8\xFF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { valid: true, detectedMime: "image/jpeg" };
    }

    // ZIP / DOCX / XLSX magic bytes: PK\x03\x04 (50 4B 03 04)
    if (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
      // DOCX is a zip archive
      return {
        valid: true,
        detectedMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    }

    // Plain text check (printable ASCII / UTF-8)
    let isText = true;
    const checkLength = Math.min(buffer.length, 512);
    for (let i = 0; i < checkLength; i++) {
      const byte = buffer[i];
      if (byte === 0 || (byte < 7 && byte !== 0) || (byte > 14 && byte < 32 && byte !== 27)) {
        isText = false;
        break;
      }
    }

    if (isText) {
      return { valid: true, detectedMime: "text/plain" };
    }

    return {
      valid: declaredMime ? declaredMime === "application/octet-stream" : false,
      detectedMime: "application/octet-stream",
      message: "Unknown or unsupported binary signature",
    };
  }

  /**
   * Saves buffer to local secure storage.
   */
  public static async saveBuffer(
    buffer: Buffer,
    originalFilename: string,
    subfolder = "",
  ): Promise<StoredFileInfo> {
    const targetDir = subfolder ? path.join(UPLOAD_BASE_DIR, subfolder) : UPLOAD_BASE_DIR;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const sanitized = this.sanitizeFilename(originalFilename);
    const uniquePrefix = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
    const storedFilename = `${uniquePrefix}_${sanitized}`;
    const storagePath = path.join(targetDir, storedFilename);

    await fs.promises.writeFile(storagePath, buffer);

    const checksumSha256 = this.computeChecksum(buffer);
    const magic = this.validateMagicBytes(buffer);

    return {
      originalFilename,
      storedFilename,
      storagePath,
      fileMimeType: magic.detectedMime,
      fileSize: buffer.length,
      checksumSha256,
    };
  }

  /**
   * Reads a stored file by path safely.
   */
  public static async readFile(filePath: string): Promise<Buffer> {
    const resolved = path.resolve(filePath);
    // Security check: ensure path is within UPLOAD_BASE_DIR
    if (!resolved.startsWith(UPLOAD_BASE_DIR)) {
      throw new Error("Directory traversal attempt detected");
    }
    return await fs.promises.readFile(resolved);
  }

  /**
   * Deletes a stored file safely.
   */
  public static async deleteFile(filePath: string): Promise<boolean> {
    try {
      const resolved = path.resolve(filePath);
      if (!resolved.startsWith(UPLOAD_BASE_DIR)) return false;
      if (fs.existsSync(resolved)) {
        await fs.promises.unlink(resolved);
        return true;
      }
    } catch {
      // Ignore deletion errors
    }
    return false;
  }
}
