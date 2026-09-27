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
      // 1. If PNG Data URL, verify magic bytes (89 50 4E 47)
      if (url.startsWith('data:image/png;base64,')) {
        const commaIdx = url.indexOf(',');
        const base64 = url.substring(commaIdx + 1).replace(/\s/g, '');
        if (base64.length < 50) {
          resolve(false);
          return;
        }
        const binaryHeader = atob(base64.substring(0, 32));
        if (
          binaryHeader.charCodeAt(0) !== 0x89 ||
          binaryHeader.charCodeAt(1) !== 0x50 ||
          binaryHeader.charCodeAt(2) !== 0x4e ||
          binaryHeader.charCodeAt(3) !== 0x47
        ) {
          resolve(false);
          return;
        }
      }

      // 2. If SVG Data URL, verify valid SVG root structure
      if (url.includes('data:image/svg+xml')) {
        const svgContent = extractSvgString(url);
        if (!svgContent || !svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
          resolve(false);
          return;
        }
      }

      // 3. Verify that the browser can decode and render the bitmap
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = url;
    } catch {
      resolve(false);
    }
  });
}

/**
 * Converts a base64 string to a Uint8Array safely
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const cleanBase64 = base64.replace(/\s/g, '');
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Triggers a native browser file download using a Blob and Object URL.
 */
function triggerBlobDownload(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke object URL after a safe delay
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60000);
}

/**
 * Extracts raw SVG string from an SVG Data URI (handles base64, utf-8, and url-encoded)
 */
export function extractSvgString(svgDataUrl: string): string | null {
  try {
    if (!svgDataUrl || !svgDataUrl.includes('data:image/svg+xml')) {
      return null;
    }

    const commaIdx = svgDataUrl.indexOf(',');
    if (commaIdx === -1) return null;

    const meta = svgDataUrl.substring(0, commaIdx);
    const data = svgDataUrl.substring(commaIdx + 1);

    if (meta.includes('base64')) {
      const decoded = atob(data.replace(/\s/g, ''));
      // Handle UTF-8 encoding properly
      const bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    } else {
      return decodeURIComponent(data);
    }
  } catch (err) {
    console.error('Error decoding SVG data url:', err);
    return null;
  }
}

/**
 * Downloads any image (PNG Data URL, JPEG Data URL, or SVG Data URL) as a valid, high-resolution PNG file.
 */
export async function downloadAsPng(imageUrl: string, filenameBase: string): Promise<boolean> {
  if (!imageUrl || typeof imageUrl !== 'string') return false;

  const sanitizedFilename = `${filenameBase.replace(/[^a-zA-Z0-9_\u00C0-\u017F-]/g, '_')}.png`;

  try {
    // Case 1: Already a PNG or JPEG raster base64 data URL (e.g. directly from Sharp or Gemini)
    if (imageUrl.startsWith('data:image/png;base64,') || imageUrl.startsWith('data:image/jpeg;base64,')) {
      const commaIdx = imageUrl.indexOf(',');
      const base64Data = imageUrl.substring(commaIdx + 1).replace(/\s/g, '');
      const bytes = base64ToUint8Array(base64Data);

      if (bytes.length < 50) {
        console.error('Image data is too small to be a valid PNG');
        return false;
      }

      // Verify PNG magic signature: 0x89, 0x50, 0x4E, 0x47
      const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

      if (!isPng && !isJpeg) {
        console.error('Image binary does not match PNG/JPEG signature');
        return false;
      }

      const mime = isJpeg ? 'image/jpeg' : 'image/png';
      const blob = new Blob([bytes], { type: mime });
      triggerBlobDownload(blob, sanitizedFilename);
      return true;
    }

    // Case 2: SVG Data URL - Rasterize to 2x High-Resolution PNG on offscreen Canvas
    return new Promise((resolve) => {
      const img = new Image();
      // Note: Do NOT set crossOrigin on data URIs to avoid canvas security tainting in Chromium

      img.onload = () => {
        try {
          const targetWidth = Math.max(img.naturalWidth || 700, 1400);
          const targetHeight = Math.max(img.naturalHeight || 900, 1800);

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d', { alpha: true });
          if (!ctx) {
            resolve(false);
            return;
          }

          // Fill clean background to ensure no alpha artifacting
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          canvas.toBlob((blob) => {
            if (blob && blob.size > 500) {
              triggerBlobDownload(blob, sanitizedFilename);
              resolve(true);
            } else {
              console.error('Canvas export produced empty blob');
              resolve(false);
            }
          }, 'image/png');
        } catch (canvasErr) {
          console.error('Canvas export error:', canvasErr);
          resolve(false);
        }
      };

      img.onerror = (err) => {
        console.error('Image load error for PNG rasterization:', err);
        resolve(false);
      };

      img.src = imageUrl;
    });
  } catch (err) {
    console.error('Failed to export PNG:', err);
    return false;
  }
}

/**
 * Downloads an SVG image as a valid .svg file (UTF-8 encoded vector XML).
 */
export function downloadAsSvg(imageUrl: string, filenameBase: string): boolean {
  if (!imageUrl || typeof imageUrl !== 'string') return false;

  const sanitizedFilename = `${filenameBase.replace(/[^a-zA-Z0-9_\u00C0-\u017F-]/g, '_')}.svg`;

  try {
    const svgText = extractSvgString(imageUrl);
    if (!svgText || !svgText.includes('<svg') || !svgText.includes('</svg>')) {
      console.warn('Image is not a valid SVG document');
      return false;
    }

    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    if (blob.size < 100) {
      console.error('SVG blob is empty or too small');
      return false;
    }
    triggerBlobDownload(blob, sanitizedFilename);
    return true;
  } catch (err) {
    console.error('Failed to export SVG:', err);
    return false;
  }
}
