/**
 * Basic HTML sanitization for untrusted content.
 * Removes script tags, event handlers, and dangerous protocols.
 * For production use with truly untrusted content, consider DOMPurify.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  return (
    html
      // Remove script tags and their contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove event handlers (onclick, onerror, onload, etc.)
      .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "")
      // Remove javascript: and data: protocols in href/src
      .replace(/\s+(href|src)\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, "")
      .replace(/\s+(href|src)\s*=\s*["']?\s*data:[^"'\s>]*/gi, "")
      // Remove iframe, object, embed tags
      .replace(/<(iframe|object|embed|form|input)[^>]*>/gi, "")
      .replace(/<\/(iframe|object|embed|form|input)>/gi, "")
  );
}
