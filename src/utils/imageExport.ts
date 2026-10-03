// Image validation and high-fidelity PNG/SVG export utility
// Ensures all generated tattoo sketches and stencils download as valid, universally openable image files.

/**
 * Validates whether a Data URL or Image URL contains genuine, valid image bytes and can be decoded.
 */
export function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || !url.startsWith('data:image/')) {
      resolve(false);
      return;
    }

    try {
      // 1. Verify known raster magic bytes when the format is explicitly declared.
      if (url.startsWith('data:image/png;base64,') || url.startsWith('data:image/jpeg;base64,')) {
        const commaIdx = url.indexOf(',');
        const base64 = url.substring(commaIdx + 1).replace(/\s/g, '');
        if (base64.length < 50) {
          resolve(false);
          return;
        }
        const binaryHeader = atob(base64.substring(0, 32));
        const isPng = binaryHeader.charCodeAt(0) === 0x89
          && binaryHeader.charCodeAt(1) === 0x50
          && binaryHeader.charCodeAt(2) === 0x4e
          && binaryHeader.charCodeAt(3) === 0x47;
        const isJpeg = binaryHeader.charCodeAt(0) === 0xff
          && binaryHeader.charCodeAt(1) === 0xd8
          && binaryHeader.charCodeAt(2) === 0xff;
        if (!isPng && !isJpeg) {
          resolve(false);
          return;
        }
      }

      // 2. Verify SVG structure before asking the browser to decode it.
      if (url.includes('data:image/svg+xml')) {
        const svgContent = extractSvgString(url);
        if (!svgContent || !/<svg\b[^>]*>/i.test(svgContent) || !/<\/svg>/i.test(svgContent)) {
          resolve(false);
          return;
        }
      }

      // 3. Verify that the browser can decode and render the bitmap/vector.
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth > 0 && img.naturalHeight > 0);
      img.onerror = () => resolve(false);
      img.src = url;
    } catch {
      resolve(false);
    }
  });
}

/** Converts a base64 string to a Uint8Array safely. */
function base64ToUint8Array(base64: string): Uint8Array {
  const cleanBase64 = base64.replace(/\s/g, '');
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

/** Triggers a native browser file download using a Blob and Object URL. */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}

/** Extracts raw SVG string from an SVG Data URI (base64, utf-8, or URL-encoded). */
export function extractSvgString(svgDataUrl: string): string | null {
  try {
    if (!svgDataUrl || !svgDataUrl.includes('data:image/svg+xml')) return null;
    const commaIdx = svgDataUrl.indexOf(',');
    if (commaIdx === -1) return null;

    const meta = svgDataUrl.substring(0, commaIdx);
    const data = svgDataUrl.substring(commaIdx + 1);
    if (meta.includes('base64')) {
      const decoded = atob(data.replace(/\s/g, ''));
      const bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
      return new TextDecoder('utf-8').decode(bytes);
    }
    return decodeURIComponent(data);
  } catch (err) {
    console.error('Error decoding SVG data url:', err);
    return null;
  }
}

/**
 * Rasterizes a data-URL image to a real PNG. PNG inputs are downloaded directly;
 * JPEG and SVG inputs are decoded through an offscreen canvas so the resulting
 * file is genuinely PNG (not JPEG bytes mislabeled with a .png extension).
 */
export async function downloadAsPng(imageUrl: string, filenameBase: string): Promise<boolean> {
  if (!imageUrl || typeof imageUrl !== 'string') return false;
  const sanitizedFilename = `${filenameBase.replace(/[^a-zA-Z0-9_\u00C0-\u017F-]/g, '_')}.png`;

  try {
    if (imageUrl.startsWith('data:image/png;base64,')) {
      const commaIdx = imageUrl.indexOf(',');
      const bytes = base64ToUint8Array(imageUrl.substring(commaIdx + 1));
      const isPng = bytes.length >= 50 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
      if (!isPng) return false;
      triggerBlobDownload(new Blob([bytes], { type: 'image/png' }), sanitizedFilename);
      return true;
    }

    if (!imageUrl.startsWith('data:image/jpeg;base64,') && !imageUrl.includes('data:image/svg+xml')) return false;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const targetWidth = Math.max(img.naturalWidth || 700, 1400);
          const targetHeight = Math.max(img.naturalHeight || 900, 1800);
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d', { alpha: true });
          if (!ctx) return resolve(false);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          canvas.toBlob((blob) => {
            if (!blob || blob.size <= 500) return resolve(false);
            triggerBlobDownload(blob, sanitizedFilename);
            resolve(true);
          }, 'image/png');
        } catch (err) {
          console.error('Canvas export error:', err);
          resolve(false);
        }
      };
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  } catch (err) {
    console.error('Failed to export PNG:', err);
    return false;
  }
}

/** Downloads an SVG image as a valid .svg file (UTF-8 encoded vector XML). */
export function downloadAsSvg(imageUrl: string, filenameBase: string): boolean {
  if (!imageUrl || typeof imageUrl !== 'string') return false;
  const sanitizedFilename = `${filenameBase.replace(/[^a-zA-Z0-9_\u00C0-\u017F-]/g, '_')}.svg`;

  try {
    const svgText = extractSvgString(imageUrl);
    if (!svgText || !/<svg\b[^>]*>/i.test(svgText) || !/<\/svg>/i.test(svgText)) return false;
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    if (blob.size < 100) return false;
    triggerBlobDownload(blob, sanitizedFilename);
    return true;
  } catch (err) {
    console.error('Failed to export SVG:', err);
    return false;
  }
}
