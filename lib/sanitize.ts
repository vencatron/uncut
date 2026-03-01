/**
 * HTML sanitization for semi-trusted content (e.g., Shopify product descriptions).
 * Uses an allow-list approach: only permitted tags and attributes pass through.
 * For fully untrusted user input in browser contexts, consider DOMPurify.
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "b",
  "i",
  "u",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "span",
  "div",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "blockquote",
  "pre",
  "code",
  "hr",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "width", "height"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan", "scope"]),
};

// Safe URL protocols for src/href attributes
const SAFE_URL_PROTOCOL = /^(https?:\/\/|\/)/i;

// Dangerous URL protocols
const UNSAFE_PROTOCOL = /^\s*(javascript|data|vbscript):/i;

export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // Remove HTML comments (can hide XSS vectors)
  let result = html.replace(/<!--[\s\S]*?-->/g, "");

  // Remove CDATA sections
  result = result.replace(/<!\[CDATA\[[\s\S]*?\]\]>/gi, "");

  // Process tags
  result = result.replace(
    /<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi,
    (match, tag, attrs) => {
      const tagLower = tag.toLowerCase();

      // Block disallowed tags entirely
      if (!ALLOWED_TAGS.has(tagLower)) {
        return "";
      }

      // Self-closing or closing tag
      if (match.startsWith("</")) {
        return `</${tagLower}>`;
      }

      // Parse and filter attributes
      const allowedAttrs = ALLOWED_ATTRS[tagLower];
      const safeAttrs: string[] = [];

      // Match attributes: name="value", name='value', or name=value
      const attrRegex =
        /([a-z][a-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*))/gi;
      let attrMatch;

      while ((attrMatch = attrRegex.exec(attrs)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

        // Skip event handlers (onclick, onerror, etc.)
        if (attrName.startsWith("on")) continue;

        // Skip attributes not explicitly allowed for this tag
        // If tag has no entry in ALLOWED_ATTRS, no attributes are allowed
        if (!allowedAttrs || !allowedAttrs.has(attrName)) continue;

        // Decode HTML entities to catch encoded XSS
        const decoded = attrValue
          .replace(/&#x([0-9a-f]+);?/gi, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16)),
          )
          .replace(/&#(\d+);?/g, (_, dec) =>
            String.fromCharCode(parseInt(dec, 10)),
          );

        // Validate href attribute on anchors
        if (attrName === "href" && tagLower === "a") {
          if (UNSAFE_PROTOCOL.test(decoded)) continue;

          // Force external links to have safe rel
          safeAttrs.push(`href="${attrValue.replace(/"/g, "&quot;")}"`);
          safeAttrs.push('rel="noopener noreferrer"');
          continue;
        }

        // Validate src attribute on images
        if (attrName === "src" && tagLower === "img") {
          // Only allow http(s) URLs or relative paths
          if (!SAFE_URL_PROTOCOL.test(decoded)) continue;
          if (UNSAFE_PROTOCOL.test(decoded)) continue;

          safeAttrs.push(`src="${attrValue.replace(/"/g, "&quot;")}"`);
          continue;
        }

        safeAttrs.push(`${attrName}="${attrValue.replace(/"/g, "&quot;")}"`);
      }

      return safeAttrs.length > 0
        ? `<${tagLower} ${safeAttrs.join(" ")}>`
        : `<${tagLower}>`;
    },
  );

  return result;
}
