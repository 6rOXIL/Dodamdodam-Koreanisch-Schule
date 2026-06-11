/** Supabase class-materials 버킷 설정과 동일 */
export const RESOURCE_MAX_FILE_SIZE_BYTES = 52_428_800; // 50 MB

export const RESOURCE_MAX_FILE_SIZE_MB = RESOURCE_MAX_FILE_SIZE_BYTES / (1024 * 1024);

export const RESOURCE_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/msword",
] as const;

export const RESOURCE_ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
] as const;

export const RESOURCE_ACCEPT_ATTRIBUTE = [
  ...RESOURCE_ALLOWED_EXTENSIONS,
  ...RESOURCE_ALLOWED_MIME_TYPES,
].join(",");

export type ResourceFileValidationError = "size" | "type";

export type ResourceFileValidationResult =
  | { valid: true }
  | { valid: false; error: ResourceFileValidationError };

function getFileExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return "";
  return fileName.slice(dot).toLowerCase();
}

export function isAllowedResourceExtension(extension: string) {
  return RESOURCE_ALLOWED_EXTENSIONS.includes(extension as (typeof RESOURCE_ALLOWED_EXTENSIONS)[number]);
}

export function isAllowedResourceMimeType(mimeType: string) {
  if (!mimeType) return false;
  return RESOURCE_ALLOWED_MIME_TYPES.includes(mimeType as (typeof RESOURCE_ALLOWED_MIME_TYPES)[number]);
}

export function validateResourceFile(file: File): ResourceFileValidationResult {
  if (file.size > RESOURCE_MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "size" };
  }

  const extension = getFileExtension(file.name);
  const mimeOk = isAllowedResourceMimeType(file.type);
  const extOk = isAllowedResourceExtension(extension);

  if (mimeOk || extOk) {
    return { valid: true };
  }

  return { valid: false, error: "type" };
}

export function formatResourceFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
