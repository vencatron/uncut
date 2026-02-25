/**
 * HTML sanitization for semi-trusted content (e.g., Shopify product descriptions).
 * Removes script tags, event handlers, dangerous protocols, and risky elements.
 * For fully untrusted user input, use DOMPurify instead.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  return (
    html
      // Remove script tags and their contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove style tags (can contain expressions in legacy IE)
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      // Remove event handlers (onclick, onerror, onload, etc.)
      .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "")
      // Remove javascript:, data:, and vbscript: protocols in href/src
      .replace(
        /\s+(href|src)\s*=\s*["']?\s*(javascript|data|vbscript):[^"'\s>]*/gi,
        "",
      )
      // Remove style attributes (can contain expression() in legacy IE)
      .replace(/\s+style\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s+style\s*=\s*[^\s>]+/gi, "")
      // Remove dangerous tags
      .replace(
        /<(iframe|object|embed|form|input|base|link|meta|svg|math)[^>]*>/gi,
        "",
      )
      .replace(
        /<\/(iframe|object|embed|form|input|base|link|meta|svg|math)>/gi,
        "",
      )
  );
}
